'use client';

import { useEffect, useRef } from 'react';

export function HeroGrid() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = canvas.current;
    const parent = el?.parentElement;
    const ctx = el?.getContext('2d');
    if (!el || !parent || !ctx) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0, height = 0, frame = 0;
    let pointer: { x: number; y: number } | null = null;
    const draw = () => {
      frame = 0;
      ctx.clearRect(0, 0, width, height);
      const spacing = width < 600 ? 34 : 39;
      const points: { x: number; y: number; near: number }[] = [];
      for (let y = 20; y < height; y += spacing) for (let x = 20; x < width; x += spacing) {
        const dx = pointer ? pointer.x - x : 0, dy = pointer ? pointer.y - y : 0;
        const distance = Math.hypot(dx, dy);
        const near = pointer && distance < 150 ? 1 - distance / 150 : 0;
        points.push({ x: x + dx * near * .12, y: y + dy * near * .12, near });
      }
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        if (p.near > .05) for (let j = i + 1; j < points.length; j++) {
          const q = points[j];
          if (q.near < .05 || Math.abs(p.x - q.x) > spacing * 1.6 || Math.abs(p.y - q.y) > spacing * 1.6) continue;
          if (Math.hypot(p.x - q.x, p.y - q.y) > spacing * 1.55) continue;
          ctx.strokeStyle = `rgba(196,184,255,${Math.min(p.near, q.near) * .5})`;
          ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
        ctx.fillStyle = `rgba(210,202,255,${.22 + p.near * .75})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, 1 + p.near * 1.5, 0, Math.PI * 2); ctx.fill();
      }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
    const resize = () => { const rect = parent.getBoundingClientRect(); width = rect.width; height = rect.height; const dpr = Math.min(devicePixelRatio || 1, 2); el.width = width * dpr; el.height = height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); schedule(); };
    const move = (event: PointerEvent) => { if (reduced.matches || event.pointerType !== 'mouse') return; const rect = parent.getBoundingClientRect(); pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top }; schedule(); };
    const leave = () => { pointer = null; schedule(); };
    const observer = new ResizeObserver(resize); observer.observe(parent);
    parent.addEventListener('pointermove', move); parent.addEventListener('pointerleave', leave);
    resize();
    return () => { observer.disconnect(); parent.removeEventListener('pointermove', move); parent.removeEventListener('pointerleave', leave); cancelAnimationFrame(frame); };
  }, []);
  return <canvas className="hero-grid" ref={canvas} aria-hidden="true" />;
}

export function RevealLight() {
  useEffect(() => {
    const selector = '.nav a, .nav button, .nav summary, .card, .career-event, .contact-tile, .actions a, .story-button';
    let last: HTMLElement | null = null;
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const target = (event.target as Element).closest<HTMLElement>(selector);
      if (last && last !== target) last.classList.remove('reveal-active');
      last = target;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty('--reveal-x', `${event.clientX - rect.left}px`);
      target.style.setProperty('--reveal-y', `${event.clientY - rect.top}px`);
      target.classList.add('reveal-active');
    };
    const clear = () => { last?.classList.remove('reveal-active'); last = null; };
    document.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', clear);
    return () => { document.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', clear); clear(); };
  }, []);
  return null;
}
