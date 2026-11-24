'use client';

import { useEffect, useRef } from 'react';
import { portraitLightPoint, portraitPointer } from './portrait-pointer';

export function HeroGrid() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = canvas.current;
    const parent = el?.parentElement;
    const ctx = el?.getContext('2d');
    if (!el || !parent || !ctx) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0, height = 0, frame = 0;
    let pointer: { clientX: number; clientY: number } | null = null;
    let sparks: { x: number; y: number; start: number; duration: number }[] = [];
    let timer: ReturnType<typeof setTimeout> | undefined;
    let touchTimer: ReturnType<typeof setTimeout> | undefined;
    const draw = () => {
      frame = 0;
      ctx.clearRect(0, 0, width, height);
      const explicitTheme = document.documentElement.dataset.theme;
      const lightTheme = explicitTheme === 'light' || (explicitTheme !== 'dark' && matchMedia('(prefers-color-scheme: light)').matches);
      const glow = lightTheme ? '41,38,46' : '243,240,250';
      const bounds = parent.getBoundingClientRect();
      const pointerPosition = pointer ? { x: pointer.clientX - bounds.left, y: pointer.clientY - bounds.top } : null;
      const spacing = width < 600 ? 34 : 39;
      const points: { x: number; y: number; near: number }[] = [];
      for (let y = 20; y < height; y += spacing) for (let x = 20; x < width; x += spacing) {
        const dx = pointerPosition ? pointerPosition.x - x : 0, dy = pointerPosition ? pointerPosition.y - y : 0;
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
          ctx.strokeStyle = `rgba(${glow},${Math.min(p.near, q.near) * .58})`;
          ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
        ctx.fillStyle = `rgba(${glow},${.22 + p.near * .75})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, 1 + p.near * 1.5, 0, Math.PI * 2); ctx.fill();
      }
      const now = performance.now();
      sparks = sparks.filter((spark) => now - spark.start < spark.duration);
      for (const spark of sparks) {
        const alpha = Math.sin(Math.PI * (now - spark.start) / spark.duration);
        ctx.fillStyle = `rgba(${glow},${alpha * .9})`;
        ctx.shadowColor = lightTheme ? '#29262e' : '#f3f0fa'; ctx.shadowBlur = 12 * alpha;
        ctx.beginPath(); ctx.arc(spark.x, spark.y, 1.5 + alpha, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
      }
      if (sparks.length) schedule();
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
    const resize = () => { const rect = parent.getBoundingClientRect(); width = rect.width; height = rect.height; const dpr = Math.min(devicePixelRatio || 1, 2); el.width = width * dpr; el.height = height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); schedule(); };
    const move = (event: PointerEvent) => { if (reduced.matches || (event.pointerType !== 'mouse' && event.pointerType !== 'pen')) return; pointer = { clientX: event.clientX, clientY: event.clientY }; schedule(); };
    const leave = () => { pointer = null; schedule(); };
    const touch = (event: PointerEvent) => { if (event.pointerType !== 'touch') return; pointer = { clientX: event.clientX, clientY: event.clientY }; schedule(); clearTimeout(touchTimer); touchTimer = setTimeout(() => { pointer = null; schedule(); }, 650); };
    const twinkle = () => {
      if (!reduced.matches && !document.hidden && width > 40 && height > 40) {
        const spacing = width < 600 ? 34 : 39;
        sparks.push({ x: 20 + Math.floor(Math.random() * Math.max(1, Math.floor((width - 20) / spacing))) * spacing, y: 20 + Math.floor(Math.random() * Math.max(1, Math.floor((height - 20) / spacing))) * spacing, start: performance.now(), duration: 1500 + Math.random() * 1400 });
        schedule();
      }
      timer = setTimeout(twinkle, 1100 + Math.random() * 1400);
    };
    const observer = new ResizeObserver(resize); observer.observe(parent);
    const themeObserver = new MutationObserver(schedule);
    themeObserver.observe(document.documentElement, { attributes:true, attributeFilter:['data-theme'] });
    window.addEventListener('pointermove', move, { passive: true }); window.addEventListener('pointerleave', leave);
    document.addEventListener('pointerdown', touch, { passive: true });
    window.addEventListener('scroll', schedule, { capture: true, passive: true });
    window.addEventListener('blur', leave);
    resize(); timer = setTimeout(twinkle, 1000);
    return () => { observer.disconnect(); themeObserver.disconnect(); window.removeEventListener('pointermove', move); window.removeEventListener('pointerleave', leave); document.removeEventListener('pointerdown', touch); window.removeEventListener('scroll', schedule, true); window.removeEventListener('blur', leave); cancelAnimationFrame(frame); clearTimeout(timer); clearTimeout(touchTimer); };
  }, []);
  return <canvas className="hero-grid" ref={canvas} aria-hidden="true" />;
}

const tiltProperties = ['--foreground-x', '--foreground-y', '--tilt-x', '--tilt-y', '--portrait-perspective', '--portrait-plane-correction', '--portrait-face-x', '--portrait-face-y', '--glare-x', '--glare-y'];
const portraitPerspective = 900;

function resetTilt(card: HTMLElement) {
  card.classList.remove('is-pointer-over');
  tiltProperties.forEach((property) => card.style.removeProperty(property));
}

function updateTilt(card: HTMLElement, x: number, y: number, proximity = 1) {
  const isPortrait = card.classList.contains('home-hero-photo');
  const baseTilt = card.classList.contains('project-card') ? 18 : 8;
  const amount = (isPortrait ? 24 : baseTilt) * proximity;
  card.style.setProperty('--foreground-x', String(x * 12) + 'px');
  card.style.setProperty('--foreground-y', String(y * 12) + 'px');
  const tiltX = -y * amount;
  const tiltY = x * amount;
  card.style.setProperty('--tilt-x', String(tiltX) + 'deg');
  card.style.setProperty('--tilt-y', String(tiltY) + 'deg');
  if (isPortrait) {
    const projection = new DOMMatrix();
    projection.m34 = -1 / portraitPerspective;
    projection.rotateAxisAngleSelf(1, 0, 0, tiltX);
    projection.rotateAxisAngleSelf(0, 1, 0, tiltY);
    // The shared clip flattens its contents. Invert the frame's projection on
    // that plane so the face stays front-on inside the moving silhouette.
    projection.m13 = projection.m23 = projection.m31 = projection.m32 = projection.m34 = 0;
    projection.m33 = 1;
    card.style.setProperty('--portrait-perspective', portraitPerspective + 'px');
    card.style.setProperty('--portrait-plane-correction', projection.inverse().toString());
    card.style.setProperty('--portrait-face-x', (-y * 3) + 'deg');
    card.style.setProperty('--portrait-face-y', (x * 6) + 'deg');
  }
  card.style.setProperty('--glare-x', String((x + .5) * 100) + '%');
  card.style.setProperty('--glare-y', String((y + .5) * 100) + '%');
  card.classList.add('is-pointer-over');
}

export function RevealLight() {
  useEffect(() => {
    const selector = 'main a:not(.project-card a), main button, .project-card, .project-visit, .nav a, .nav button, .nav summary, .nav .language, .footer, .footer a, .card:not(.project-card), .career-event, .contact-tile, .cert-piece, [data-hero-text], [data-portrait-light]';
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const activeZones = new Set<Element>();
    let tilted = new Set<HTMLElement>();
    const lit = new Set<HTMLElement>();
    const exitTimers = new Map<HTMLElement, ReturnType<typeof setTimeout>>();
    const enterFrames = new Map<HTMLElement, number>();
    const fadeOut = (target: HTMLElement) => {
      cancelAnimationFrame(enterFrames.get(target) ?? 0);
      enterFrames.delete(target);
      target.classList.remove('reveal-entering');
      target.classList.add('reveal-leaving');
      target.style.setProperty('--reveal-strength', '0');
      clearTimeout(exitTimers.get(target));
      exitTimers.set(target, setTimeout(() => {
        target.classList.remove('reveal-active', 'reveal-leaving');
        exitTimers.delete(target);
      }, 180));
    };
    let frame = 0;
    let position: { x: number; y: number } | null = null;
    let touchTimer: ReturnType<typeof setTimeout> | undefined;
    const zones = document.querySelectorAll('.home-hero, .playground');
    const visibility = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) activeZones.add(entry.target);
        else activeZones.delete(entry.target);
      });
      if (!activeZones.size) clear();
    });
    zones.forEach((zone) => visibility.observe(zone));
    const update = () => {
      frame = 0;
      if (!position) return;
      const { x, y } = position;
      const nextTilt = new Map<HTMLElement, { rect: DOMRect; proximity: number }>();
      const heroPhoto = reducedMotion.matches ? null : document.querySelector<HTMLElement>('.home-hero-photo.tilt-card');
      const heroRect = heroPhoto?.getBoundingClientRect();
      // The portrait tracks the pointer anywhere in the viewport for as long
      // as it remains visible, even when the cursor is far from the photo.
      if (heroPhoto && heroRect && heroRect.bottom > 0 && heroRect.top < innerHeight && heroRect.right > 0 && heroRect.left < innerWidth) {
        nextTilt.set(heroPhoto, { rect: heroRect, proximity: 1 });
      }
      const hoveredProject = document.elementFromPoint(x, y)?.closest<HTMLElement>('.project-card.tilt-card');
      if (hoveredProject && [...activeZones].some((zone) => zone.contains(hoveredProject))) {
        const rect = hoveredProject.getBoundingClientRect();
        nextTilt.set(hoveredProject, { rect, proximity: 1 });
      }

      if (heroPhoto && heroRect && heroRect.bottom > 0 && heroRect.top < innerHeight && heroRect.right > 0 && heroRect.left < innerWidth) {
        nextTilt.set(heroPhoto, { rect: heroRect, proximity: 1 });
      }
      tilted.forEach((target) => { if (!nextTilt.has(target)) resetTilt(target); });
      tilted = new Set(nextTilt.keys());
      nextTilt.forEach(({ rect, proximity }, target) => {
        if (!rect.width || !rect.height) return;
        if (target === heroPhoto && target.parentElement) {
          const pointer = portraitPointer(target.parentElement, x, y);
          updateTilt(target, pointer.x, pointer.y);
          return;
        }
        const normalizedX = Math.max(-.85, Math.min(.85, (x - rect.left) / rect.width - .5));
        const normalizedY = Math.max(-.85, Math.min(.85, (y - rect.top) / rect.height - .5));
        updateTilt(target, normalizedX, normalizedY, proximity);
      });
      const next = new Map<HTMLElement, { x: string; y: string; strength: number }>();
      document.querySelectorAll<HTMLElement>(selector).forEach((target) => {
        const rect = target.getBoundingClientRect();
        if (!rect.width || !rect.height || rect.bottom < 0 || rect.top > innerHeight) return;
        const frame = target.classList.contains('home-hero-portrait-figure')
          ? target.closest<HTMLElement>('.home-hero-photo')
          : null;
        const revealRange = frame ? 190 : 110;
        const dx = Math.max(rect.left - x, 0, x - rect.right);
        const dy = Math.max(rect.top - y, 0, y - rect.bottom);
        const distance = Math.hypot(dx, dy);
        // The reveal reaches nearby elements at low intensity and strengthens
        // inside them. Its CSS radius stays constant throughout the interaction.
        const isVisibleZone = [...activeZones].some((zone) => zone.contains(target));
        const isNavigationControl = Boolean(target.closest('.nav'));
        if (distance >= revealRange || (!isVisibleZone && !(isNavigationControl && activeZones.size > 0))) return;
        const inside = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
        const edgeDistance = inside
          ? Math.min(x - rect.left, rect.right - x, y - rect.top, rect.bottom - y)
          : 0;
        const strength = inside
          ? .16 + Math.min(edgeDistance / 40, 1) * .08
          : (1 - distance / revealRange) * .16;
        const localX = x - rect.left;
        const localY = y - rect.top;
        if (frame?.parentElement) {
          const point = portraitLightPoint(target, frame, x, y);
          target.querySelectorAll('fePointLight').forEach((light) => {
            light.setAttribute('x', String(point.x * 840));
            light.setAttribute('y', String(point.y * 840));
          });
          // Approximate the portrait's head and torso in image coordinates.
          const head = Math.hypot((point.x - .48) / .23, (point.y - .33) / .29);
          const torso = Math.hypot((point.x - .49) / .48, (point.y - .89) / .32);
          const edge = Math.max(0, Math.min(1, (Math.min(head, torso) - .72) / .43));
          target.style.setProperty('--portrait-rim-gain', String(edge * edge * (3 - 2 * edge)));
          next.set(target, { x: point.x * 100 + '%', y: point.y * 100 + '%', strength });
          return;
        }
        next.set(target, { x: localX + 'px', y: localY + 'px', strength });
      });
      lit.forEach((target) => {
        if (!next.has(target)) fadeOut(target);
      });
      lit.clear();
      next.forEach(({ x, y, strength }, target) => {
        clearTimeout(exitTimers.get(target));
        exitTimers.delete(target);
        target.classList.remove('reveal-leaving');
        target.style.setProperty('--reveal-x', x);
        target.style.setProperty('--reveal-y', y);
        if (!target.classList.contains('reveal-active')) {
          target.style.setProperty('--reveal-strength', '0');
          target.classList.add('reveal-active', 'reveal-entering');
          const frame = requestAnimationFrame(() => {
            target.style.setProperty('--reveal-strength', String(strength));
            enterFrames.delete(target);
          });
          enterFrames.set(target, frame);
          setTimeout(() => target.classList.remove('reveal-entering'), 180);
        } else {
          target.style.setProperty('--reveal-strength', String(strength));
        }
        lit.add(target);
      });
    };
    const schedule = () => {
      if (position && !frame) frame = requestAnimationFrame(update);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
      if (!activeZones.size) return;
      position = { x: event.clientX, y: event.clientY };
      schedule();
    };
    const touch = (event: PointerEvent) => {
      if (event.pointerType !== 'touch') return;
      position = { x: event.clientX, y: event.clientY };
      schedule();
      clearTimeout(touchTimer);
      touchTimer = setTimeout(clear, 650);
    };
    const clear = () => {
      position = null;
      cancelAnimationFrame(frame);
      frame = 0;
      tilted.forEach(resetTilt);
      tilted.clear();
      lit.forEach(fadeOut);
      lit.clear();
    };
    document.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerdown', touch, { passive: true });
    document.addEventListener('pointerleave', clear);
    window.addEventListener('scroll', schedule, { capture: true, passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('blur', clear);
    reducedMotion.addEventListener('change', schedule);
    return () => {
      visibility.disconnect();
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerdown', touch);
      document.removeEventListener('pointerleave', clear);
      window.removeEventListener('scroll', schedule, true);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('blur', clear);
      reducedMotion.removeEventListener('change', schedule);
      clear();
      clearTimeout(touchTimer);
      exitTimers.forEach(clearTimeout);
      enterFrames.forEach(cancelAnimationFrame);
    };
  }, []);
  return null;
}
