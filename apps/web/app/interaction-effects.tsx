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
    let sparks: { x: number; y: number; start: number; duration: number }[] = [];
    let timer: ReturnType<typeof setTimeout> | undefined;
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
      const now = performance.now();
      sparks = sparks.filter((spark) => now - spark.start < spark.duration);
      for (const spark of sparks) {
        const alpha = Math.sin(Math.PI * (now - spark.start) / spark.duration);
        ctx.fillStyle = `rgba(243,226,206,${alpha * .9})`;
        ctx.shadowColor = '#f2d5ad'; ctx.shadowBlur = 12 * alpha;
        ctx.beginPath(); ctx.arc(spark.x, spark.y, 1.5 + alpha, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
      }
      if (sparks.length) schedule();
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
    const resize = () => { const rect = parent.getBoundingClientRect(); width = rect.width; height = rect.height; const dpr = Math.min(devicePixelRatio || 1, 2); el.width = width * dpr; el.height = height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); schedule(); };
    const move = (event: PointerEvent) => { if (reduced.matches || event.pointerType !== 'mouse') return; const rect = parent.getBoundingClientRect(); pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top }; schedule(); };
    const leave = () => { pointer = null; schedule(); };
    const twinkle = () => {
      if (!reduced.matches && !document.hidden && width > 40 && height > 40) {
        const spacing = width < 600 ? 34 : 39;
        sparks.push({ x: 20 + Math.floor(Math.random() * Math.max(1, Math.floor((width - 20) / spacing))) * spacing, y: 20 + Math.floor(Math.random() * Math.max(1, Math.floor((height - 20) / spacing))) * spacing, start: performance.now(), duration: 1500 + Math.random() * 1400 });
        schedule();
      }
      timer = setTimeout(twinkle, 1100 + Math.random() * 1400);
    };
    const observer = new ResizeObserver(resize); observer.observe(parent);
    parent.addEventListener('pointermove', move); parent.addEventListener('pointerleave', leave);
    resize(); timer = setTimeout(twinkle, 1000);
    return () => { observer.disconnect(); parent.removeEventListener('pointermove', move); parent.removeEventListener('pointerleave', leave); cancelAnimationFrame(frame); clearTimeout(timer); };
  }, []);
  return <canvas className="hero-grid" ref={canvas} aria-hidden="true" />;
}

export function RevealLight() {
  useEffect(() => {
    const selector = 'main a:not(.project-card a), main button, .project-visit, .nav a, .nav button, .nav summary, .nav select, .footer a, .card:not(.project-card), .career-event, .contact-tile, .cert-piece';
    const lit = new Set<HTMLElement>();
    let frame = 0;
    let position: { x: number; y: number } | null = null;
    const update = () => {
      frame = 0;
      if (!position) return;
      const { x, y } = position;
      const next = new Map<HTMLElement, { x: number; y: number; strength: number }>();
      document.querySelectorAll<HTMLElement>(selector).forEach((target) => {
        const rect = target.getBoundingClientRect();
        if (!rect.width || !rect.height || rect.bottom < 0 || rect.top > innerHeight) return;
        const dx = Math.max(rect.left - x, 0, x - rect.right);
        const dy = Math.max(rect.top - y, 0, y - rect.bottom);
        const distance = Math.hypot(dx, dy);
        if (distance >= 110) return;
        next.set(target, { x: x - rect.left, y: y - rect.top, strength: (1 - distance / 110) * .55 });
      });

      lit.forEach((target) => {
        if (!next.has(target)) target.classList.remove('reveal-active');
      });
      lit.clear();
      next.forEach(({ x, y, strength }, target) => {
        target.style.setProperty('--reveal-x', x + 'px');
        target.style.setProperty('--reveal-y', y + 'px');
        target.style.setProperty('--reveal-strength', String(strength));
        target.classList.add('reveal-active');
        lit.add(target);
      });
    };
    const schedule = () => {
      if (position && !frame) frame = requestAnimationFrame(update);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      position = { x: event.clientX, y: event.clientY };
      schedule();
    };
    const clear = () => { position = null; cancelAnimationFrame(frame); frame = 0; lit.forEach((target) => target.classList.remove('reveal-active')); lit.clear(); };
    document.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', clear);
    window.addEventListener('scroll', schedule, { capture: true, passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('blur', clear);
    return () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', clear);
      window.removeEventListener('scroll', schedule, true);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('blur', clear);
      clear();
    };
  }, []);
  return null;
}
