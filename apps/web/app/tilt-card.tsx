'use client';

import { useEffect, useRef, type ReactNode } from 'react';

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
  return <article ref={card} className={'tilt-card ' + className}>{children}</article>;
}
