'use client';

import { useEffect, useRef, type PointerEvent, type ReactNode } from 'react';

export function TiltCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const card = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = card.current;
    const info = element?.querySelector<HTMLElement>('.project-info');
    const heading = info?.querySelector<HTMLElement>('h3');
    if (!element || !info || !heading) return;
    const update = () => {
      element.style.setProperty('--logo-target-left', (info.offsetLeft + heading.offsetLeft) + 'px');
      element.style.setProperty('--logo-slot', `${Math.min(element.clientWidth * .36, 140)}px`);
      element.style.setProperty('--logo-target-bottom', `${info.offsetTop + heading.offsetTop + heading.offsetHeight}px`);
    };
    const observer = new ResizeObserver(update);
    observer.observe(element);
    observer.observe(info);
    update();
    return () => observer.disconnect();
  }, []);
  function move(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    const amount = event.currentTarget.classList.contains('project-card') ? 18 : 8;
    event.currentTarget.style.setProperty('--foreground-x', `${x * 12}px`);
    event.currentTarget.style.setProperty('--foreground-y', `${y * 12}px`);
    event.currentTarget.style.setProperty('--tilt-x', `${-y * amount}deg`);
    event.currentTarget.style.setProperty('--tilt-y', `${x * amount}deg`);
    event.currentTarget.style.setProperty('--glare-x', `${(x + .5) * 100}%`);
    event.currentTarget.style.setProperty('--glare-y', `${(y + .5) * 100}%`);
  }
  function reset() {
    card.current?.style.removeProperty('--foreground-x');
    card.current?.style.removeProperty('--foreground-y');
    card.current?.style.removeProperty('--tilt-x');
    card.current?.style.removeProperty('--tilt-y');
  }
  return <article ref={card} className={'tilt-card ' + className} onPointerMove={move} onPointerLeave={reset}>{children}</article>;
}
