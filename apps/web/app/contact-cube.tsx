'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent, PointerEvent } from 'react';
import { faces, frontFace, isSolved, loosePiece, scrambleTurns, sliceTurn, solvedCube, turnFace, tutorialCube, tutorialSolution } from './contact-cube-state';
import type { Turn } from './contact-cube-state';
import { Icon } from './material-icon';
import './contact-cube.css';

const initialView = { pitch: -24, yaw: 49 };
const axes = ['X', 'Y', 'Z'];
const lanes = [-1, 0, 1] as const;
const directions = [
  { horizontal: true, toward: -1, label: 'esquerda', angle: 0 },
  { horizontal: true, toward: 1, label: 'direita', angle: 180 },
  { horizontal: false, toward: -1, label: 'cima', angle: 90 },
  { horizontal: false, toward: 1, label: 'baixo', angle: -90 },
] as const;

function Cubelet({ piece, detached = false }: { piece: typeof loosePiece; detached?: boolean }) {
  const [x, y, z] = detached ? [0, 0, 0] : piece.position;
  return <span className="contact-cubelet" style={{ '--x': x, '--y': y, '--z': z } as CSSProperties}>
    {faces.map((face) => {
      const sticker = piece.stickers.find(({ normal }) => normal[face.axis] === face.side);
      return <span key={face.color} className="contact-cube-face"
        style={{ transform: `${face.rotation} translateZ(calc(var(--cube-size) / 2))`, '--sticker': sticker?.color } as CSSProperties} />;
    })}
  </span>;
}

export function ContactCube({ locale, victoryCopy, playAgain }: {
  locale: string;
  victoryCopy: Record<'self' | 'helped', { title: string; description: string }>;
  playAgain: string;
}) {
  const [phase, setPhase] = useState<'intro' | 'fitting' | 'ready' | 'play' | 'celebrating'>('intro');
  const [cube, setCube] = useState(tutorialCube);
  const [view, setView] = useState(initialView);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [holding, setHolding] = useState(false);
  const [near, setNear] = useState(false);
  const [turn, setTurn] = useState<Turn | null>(null);
  const [moves, setMoves] = useState(0);
  const [victorySource, setVictorySource] = useState<'self' | 'helped' | null>(null);
  const [scramble, setScramble] = useState<Turn[]>([]);
  const [sequence, setSequence] = useState<'scramble' | 'solve' | null>(null);
  const [entered, setEntered] = useState(false);
  const [grabbed, setGrabbed] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const orbitControl = useRef<HTMLDivElement>(null);
  const slot = useRef<HTMLSpanElement>(null);
  const playButton = useRef<HTMLButtonElement>(null);
  const timer = useRef<number>(0);
  const pieceDrag = useRef<{ id: number; x: number; y: number; centerX: number; centerY: number } | null>(null);
  const orbitDrag = useRef<{ id: number; x: number; y: number } | null>(null);
  const history = useRef<Turn[]>([]);
  const front = frontFace(view.pitch, view.yaw);
  const centerColor = cube.find(({ position, stickers }) =>
    position[front.axis] === front.side && stickers.length === 1,
  )?.stickers[0].color;
  const frontLabel = faces.find(({ color }) => color === centerColor)?.label ?? front.label;
  const won = phase === 'play' && isSolved(cube);

  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.intersectionRatio < .35) return;
      setEntered(true);
      observer.disconnect();
    }, { threshold: .35 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  function fitPiece(keyboard = false) {
    const finish = () => {
      setPhase('ready');
      if (keyboard) requestAnimationFrame(() => playButton.current?.focus());
    };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCube(solvedCube);
      finish();
      return;
    }
    setPhase('fitting');
    const animate = (index: number) => {
      const move = tutorialSolution[index];
      setTurn(move);
      timer.current = window.setTimeout(() => {
        setCube((current) => turnFace(current, move));
        setTurn(null);
        if (index + 1 === tutorialSolution.length) finish();
        else timer.current = window.setTimeout(() => animate(index + 1), 40);
      }, 240);
    };
    timer.current = window.setTimeout(() => animate(0), 120);
  }

  function grab(event: PointerEvent<HTMLButtonElement>) {
    if (event.button !== 0 || pieceDrag.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pieceDrag.current = {
      id: event.pointerId, x: event.clientX, y: event.clientY,
      centerX: rect.left + rect.width / 2, centerY: rect.top + rect.height / 2,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setGrabbed(true);
    setHolding(true);
  }

  function dragPosition(event: PointerEvent<HTMLButtonElement>) {
    const origin = pieceDrag.current;
    if (origin?.id !== event.pointerId) return;
    const x = event.clientX - origin.x;
    const y = event.clientY - origin.y;
    const rect = slot.current?.getBoundingClientRect();
    const fits = !!rect && Math.hypot(origin.centerX + x - rect.left, origin.centerY + y - rect.top) < 41;
    return { x, y, fits };
  }

  function dragPiece(event: PointerEvent<HTMLButtonElement>) {
    const position = dragPosition(event);
    if (!position) return;
    setOffset(position);
    setNear(position.fits);
  }

  function drop(event: PointerEvent<HTMLButtonElement>) {
    const position = dragPosition(event);
    if (!position) return;
    pieceDrag.current = null;
    setHolding(false);
    setNear(false);
    setOffset({ x: 0, y: 0 });
    if (event.type === 'pointerup' && position.fits) fitPiece();
  }

  function startGame() {
    const nextScramble = scrambleTurns();
    setCube(solvedCube);
    setScramble(nextScramble);
    history.current = [...nextScramble];
    setView(initialView);
    setMoves(0);
    setVictorySource(null);
    setPhase('play');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCube(nextScramble.reduce(turnFace, solvedCube));
      return;
    }
    animateMoves(nextScramble, 'scramble', 0, 105);
  }

  function animateMoves(movesToPlay: Turn[], kind: 'scramble' | 'solve', index: number, duration: number) {
    if (index >= movesToPlay.length) {
      setSequence(null);
      setTurn(null);
      if (kind === 'solve') celebrate('helped');
      return;
    }
    const move = movesToPlay[index];
    setSequence(kind);
    setTurn(move);
    timer.current = window.setTimeout(() => {
      setCube((current) => turnFace(current, move));
      setMoves((count) => count + (kind === 'solve' ? 1 : 0));
      setTurn(null);
      timer.current = window.setTimeout(() => animateMoves(movesToPlay, kind, index + 1, duration), 22);
    }, duration);
  }

  function celebrate(source: 'self' | 'helped') {
    setVictorySource(source);
    setPhase('celebrating');
    timer.current = window.setTimeout(() => setPhase('ready'), 1250);
  }

  function requestHelp() {
    if (turn || sequence || phase !== 'play') return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCube(solvedCube);
      setMoves((count) => count + scramble.length);
      celebrate('helped');
      return;
    }
    animateMoves([...history.current].reverse().map(({ direction, ...move }) => ({
      ...move, direction: direction === 1 ? -1 : 1,
    })), 'solve', 0, 215);
  }

  function rotateSlice(move: Turn) {
    if (turn || sequence || phase !== 'play') return;
    history.current.push(move);
    const commit = () => {
      const nextCube = turnFace(cube, move);
      setCube(nextCube);
      setMoves((count) => count + 1);
      setTurn(null);
      if (isSolved(nextCube)) celebrate('self');
    };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      commit();
      return;
    }
    setTurn(move);
    timer.current = window.setTimeout(commit, 240);
  }

  function orbit(dx: number, dy: number) {
    setView(({ pitch, yaw }) => ({
      pitch: Math.max(-90, Math.min(90, pitch + dy)),
      yaw: (yaw + dx) % 360,
    }));
  }

  function orbitKeys(event: KeyboardEvent<HTMLDivElement>) {
    if (phase !== 'play' || event.target !== event.currentTarget) return;
    const steps: Record<string, [number, number]> = {
      ArrowLeft: [-30, 0], ArrowRight: [30, 0], ArrowUp: [0, 30], ArrowDown: [0, -30],
    };
    const step = steps[event.key];
    if (!step) return;
    event.preventDefault();
    orbit(...step);
  }

  const victoryMessage = victorySource ? victoryCopy[victorySource] : null;
  const play = phase === 'ready' && <button ref={playButton} type="button"
    className={`ui-button ui-button--light ${victoryMessage ? 'contact-cube-replay' : 'contact-cube-start'}`}
    onClick={(event) => {
      startGame();
      if (event.detail === 0) requestAnimationFrame(() => orbitControl.current?.focus());
    }}>{victoryMessage ? playAgain : 'Jogar'}</button>;

  return <div className="contact-cube" style={{ '--cube-slot-color': loosePiece.stickers[0].color } as CSSProperties}>
    <div ref={stage} className="contact-cube-stage" data-phase={phase} data-entered={entered}>
      <div ref={orbitControl} className="contact-cube-orbit"
        tabIndex={phase === 'play' ? 0 : undefined}
        role={phase === 'play' ? 'group' : undefined}
        aria-label={phase === 'play' ? 'Visão do cubo. Use as teclas de seta para olhar outros lados.' : undefined}
        onKeyDown={orbitKeys}
        onPointerDown={(event) => {
          if (phase !== 'play' || event.button !== 0 || orbitDrag.current || (event.target as Element).closest('button')) return;
          event.currentTarget.setPointerCapture(event.pointerId);
          orbitDrag.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
        }}
        onPointerMove={(event) => {
          const previous = orbitDrag.current;
          if (previous?.id !== event.pointerId) return;
          orbit((event.clientX - previous.x) * .63, (previous.y - event.clientY) * .63);
          orbitDrag.current = { id: previous.id, x: event.clientX, y: event.clientY };
        }}
        onLostPointerCapture={(event) => {
          if (orbitDrag.current?.id === event.pointerId) orbitDrag.current = null;
        }}>
        <div className="contact-cube-model" style={{ transform: `rotateX(${view.pitch}deg) rotateY(${view.yaw}deg)` }}>
          {cube.map((piece) => {
            if (phase === 'intro' && piece.id === loosePiece.id) return null;
            const turning = turn && piece.position[turn.axis] === turn.side;
            return <div key={piece.id} aria-hidden="true" className={turning ? 'contact-cube-pivot is-turning' : 'contact-cube-pivot'}
              style={turning ? { '--cube-turn': `rotate${axes[turn.axis]}(${90 * turn.direction}deg)` } as CSSProperties : undefined}>
              <Cubelet piece={piece} />
            </div>;
          })}
          {phase === 'intro' && <span className="contact-cube-slot" aria-hidden="true" data-near={near}><span ref={slot} /></span>}
          {phase === 'play' && <div className="contact-cube-controls" role="group"
            aria-label={`Giros da face ${frontLabel}`}
            style={{ transform: `${front.rotation} translateZ(calc(var(--cube-step) + var(--cube-size) / 2))` }}>
            {directions.flatMap(({ horizontal, toward, label, angle }) => lanes.map((index) =>
              <button key={`${label}-${index}`} type="button" className="contact-cube-turn"
                aria-label={`Girar ${horizontal ? 'linha' : 'coluna'} ${index + 2} para ${label}`}
                aria-disabled={!!turn || !!sequence}
                style={{
                  '--arrow-x': horizontal ? 1.94 * toward : index,
                  '--arrow-y': horizontal ? index : 1.94 * toward,
                  '--arrow-angle': angle + 'deg',
                } as CSSProperties}
                onClick={() => rotateSlice(sliceTurn(front, horizontal, index, toward))}>
                <Icon name="chevron_left" />
              </button>,
            ))}
          </div>}
        </div>
      </div>
      {phase === 'intro' && <>
        <button type="button" className="contact-cube-piece" data-holding={holding} data-grabbed={grabbed}
          aria-label="Encaixar a peça verde" onClick={(event) => { if (event.detail === 0) fitPiece(true); }}
          style={{ '--dx': offset.x + 'px', '--dy': offset.y + 'px' } as CSSProperties}
          onPointerDown={grab} onPointerMove={dragPiece} onPointerUp={drop}
          onPointerCancel={drop} onLostPointerCapture={drop}>
          <span className="contact-cube-loose" aria-hidden="true">
            <span className="contact-cube-piece-shadow" />
            <span className="contact-cube-piece-flight">
              <span className="contact-cube-piece-model"><Cubelet piece={loosePiece} detached /></span>
            </span>
          </span>
          <span className="contact-cube-hand" aria-hidden="true" />
        </button>
      </>}
      {!victoryMessage && play}
      {phase === 'celebrating' && <div className="contact-cube-celebration" aria-hidden="true">
        {Array.from({ length: 12 }, (_, index) => <i key={index} style={{ '--spark-index': index } as CSSProperties} />)}
      </div>}
      {victoryMessage && <div className="contact-cube-result" lang={locale}>
        <div className="contact-cube-victory" role="status">
          <h3>{victoryMessage.title}</h3>
          <p>{victoryMessage.description}</p>
        </div>
        {play}
      </div>}
      {phase === 'play' && <button type="button" className="ui-button ui-button--outline-light contact-cube-help"
        aria-label="Receber ajuda para resolver o cubo" aria-disabled={!!turn || !!sequence} onClick={requestHelp}>
        <Icon name="lightbulb" /><span>Receber ajuda</span>
      </button>}
    </div>
    <span className="contact-cube-status" role="status">{phase === 'fitting' ? 'Peça encaixada. Resolvendo o cubo…'
      : phase === 'ready' && !victoryMessage ? 'Peça encaixada. Jogo disponível.'
      : won ? `Cubo resolvido em ${moves} movimentos!` : ''}</span>
  </div>;
}
