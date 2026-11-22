'use client';

import { useEffect, useRef } from 'react';

export function HomeHeroPortrait() {
  const scene = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = scene.current;
    const hero = element?.closest('.home-hero');
    if (!element || !hero) return;

    const reset = () => {
      element.style.removeProperty('--portrait-x');
      element.style.removeProperty('--portrait-y');
    };
    const move = (event: Event) => {
      if (!(event instanceof PointerEvent) || event.pointerType !== 'mouse') return;
      if (!matchMedia('(prefers-reduced-motion: no-preference)').matches) return;
      const { left, top, width, height } = hero.getBoundingClientRect();
      element.style.setProperty('--portrait-x', ((event.clientX - left) / width - .5) * 32 + 'px');
      element.style.setProperty('--portrait-y', ((event.clientY - top) / height - .5) * 24 + 'px');
    };

    hero.addEventListener('pointermove', move, { passive: true });
    hero.addEventListener('pointerleave', reset);
    return () => {
      hero.removeEventListener('pointermove', move);
      hero.removeEventListener('pointerleave', reset);
    };
  }, []);

  return (
    <div className="home-hero-scene" ref={scene} aria-hidden="true">
      <div className="home-hero-orbit" />
      <div className="home-hero-photo">
        <img src="/wellington-linkedin.jpg" width="420" height="420" alt="" fetchPriority="high" />
      </div>
      <div className="home-hero-spark" />
    </div>
  );
}
