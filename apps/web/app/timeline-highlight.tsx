'use client';

import { useEffect, useRef } from 'react';

export function TimelineHighlight() {
  const indicator = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const dot = indicator.current;
    const timeline = dot?.parentElement;
    if (!dot || !timeline) return;
    const header = document.querySelector<HTMLElement>('.header');
    const events = Array.from(timeline.querySelectorAll<HTMLElement>('.career-event'));
    const years = Array.from(timeline.querySelectorAll<HTMLElement>('.career-year'));
    let frame = 0;
    const update = () => {
      frame = 0;
      const menuBottom = Math.max(0, header?.getBoundingClientRect().bottom ?? 0);
      const marker = menuBottom + Math.max(0, window.innerHeight - menuBottom) * .25;
      const bounds = timeline.getBoundingClientRect();
      const measured = events.map((event) => ({ event, rect: event.getBoundingClientRect() }));
      const active = bounds.top <= marker && bounds.bottom > marker
        ? measured.reduce<{ event: HTMLElement; distance: number } | undefined>((closest, { event, rect }) => {
            const distance = Math.max(rect.top - marker, marker - rect.bottom, 0);
            return !closest || distance < closest.distance ? { event, distance } : closest;
          }, undefined)?.event
        : undefined;
      const color = active?.style.getPropertyValue('--event-color') || 'var(--accent)';
      timeline.style.setProperty('--timeline-marker', marker + 'px');
      dot.classList.toggle('is-active', Boolean(active));
      dot.style.setProperty('--active-color', color);
      measured.forEach(({ event, rect }) => {
        const passed = rect.bottom <= marker;
        const dotY = passed ? rect.bottom - 27 : rect.top + 33;
        event.classList.toggle('is-active', event === active);
        event.classList.toggle('is-passed', passed);
        event.classList.toggle('is-dot-covered', Boolean(active) && Math.abs(dotY - marker) < 22);
      });
      years.forEach((year) => {
        const selected = active && year.contains(active);
        year.classList.toggle('is-active', Boolean(selected));
        if (selected) year.style.setProperty('--active-color', color);
        else year.style.removeProperty('--active-color');
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const resizeObserver = new ResizeObserver(schedule);
    if (header) resizeObserver.observe(header);
    resizeObserver.observe(timeline);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
    return () => { resizeObserver.disconnect(); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); if (frame) cancelAnimationFrame(frame); };
  }, []);
  return <div ref={indicator} className="career-indicator" aria-hidden="true" />;
}
