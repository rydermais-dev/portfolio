'use client';

import { useEffect, useRef } from 'react';

export function HeroLight() {
  const layer = useRef<HTMLDivElement>(null);
  const pulse = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = layer.current;
    const ripple = pulse.current;
    const hero = element?.parentElement;
    if (!hero || !element || !ripple) return;

    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    let animation: Animation | undefined;
    let pointer: PointerEvent | undefined;
    let touchTimer: ReturnType<typeof setTimeout> | undefined;

    const position = (event: MouseEvent) => {
      const bounds = hero.getBoundingClientRect();
      return [event.clientX - bounds.left, event.clientY - bounds.top];
    };

    const updateLight = () => {
      if (!pointer) return;
      const { left, top, width, height } = hero.getBoundingClientRect();
      const x = pointer.clientX - left;
      const y = pointer.clientY - top;
      const dx = Math.max(0, -x, x - width);
      const dy = Math.max(0, -y, y - height);
      const distance = Math.hypot(dx, dy);
      element.style.setProperty('--hero-light-x', x + 'px');
      element.style.setProperty('--hero-light-y', y + 'px');
      element.style.setProperty('--hero-light-strength', String(Math.max(0, 1 - distance / 170)));
      element.classList.toggle('is-lit', distance < 170);
    };

    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      pointer = event;
      updateLight();
    };

    const leave = () => {
      pointer = undefined;
      element.classList.remove('is-lit');
      element.style.setProperty('--hero-light-strength', '0');
      clearTimeout(touchTimer);
    };
    const touch = (event: PointerEvent) => {
      if (event.pointerType !== 'touch') return;
      pointer = event;
      updateLight();
      clearTimeout(touchTimer);
      touchTimer = setTimeout(leave, 650);
    };

    const flash = (x: number, y: number) => {
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      animation?.cancel();
      animation = ripple.animate(
        reducedMotion.matches
          ? [{ opacity: .85 }, { opacity: 0 }]
          : [{ opacity: .28 }, { opacity: 0 }],
        { duration: reducedMotion.matches ? 200 : 700, easing: 'ease-out' },
      );
    };

    const press = (event: PointerEvent) => {
      if (event.button !== 0 || !event.isPrimary) return;
      const [x, y] = position(event);
      flash(x, y);
    };

    const activate = (event: MouseEvent) => {
      if (event.detail !== 0 || !(event.target instanceof Element)) return;
      const control = event.target.closest('button, a');
      if (!control) return;
      const target = control.getBoundingClientRect();
      const bounds = hero.getBoundingClientRect();
      flash(target.left + target.width / 2 - bounds.left, target.top + target.height / 2 - bounds.top);
    };

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerleave', leave);
    document.addEventListener('pointerdown', touch, { passive: true });
    hero.addEventListener('pointerdown', press, { passive: true, capture: true });
    hero.addEventListener('click', activate, true);
    window.addEventListener('scroll', updateLight, { passive: true });
    window.addEventListener('blur', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerleave', leave);
      document.removeEventListener('pointerdown', touch);
      hero.removeEventListener('pointerdown', press, true);
      hero.removeEventListener('click', activate, true);
      window.removeEventListener('scroll', updateLight);
      window.removeEventListener('blur', leave);
      animation?.cancel();
      clearTimeout(touchTimer);
    };
  }, []);

  return <div ref={layer} className="hero-light" aria-hidden="true"><span ref={pulse} /></div>;
}
