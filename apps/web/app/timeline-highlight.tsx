'use client';

import { useEffect } from 'react';

export function TimelineHighlight() {
  useEffect(() => {
    const timeline = document.querySelector<HTMLElement>('.career-timeline');
    if (!timeline) return;
    const header = document.querySelector<HTMLElement>('.header');
    const events = Array.from(timeline.querySelectorAll<HTMLElement>('.career-event'));
    let frame = 0;
    const update = () => {
      frame = 0;
      const menuBottom = Math.max(0, header?.getBoundingClientRect().bottom ?? 0);
      const marker = menuBottom + (window.innerHeight - menuBottom) / 2;
      timeline.style.setProperty('--timeline-marker', marker + 'px');
      const bounds = timeline.getBoundingClientRect();
      const active = bounds.top <= marker && bounds.bottom > marker
        ? events.reduce<HTMLElement | undefined>((closest, event) => {
            const rect = event.getBoundingClientRect();
            const distance = Math.abs((rect.top + rect.bottom) / 2 - marker);
            if (!closest) return event;
            const previous = closest.getBoundingClientRect();
            const previousDistance = Math.abs((previous.top + previous.bottom) / 2 - marker);
            return distance < previousDistance ? event : closest;
          }, undefined)
        : undefined;
      events.forEach((event) => event.classList.toggle('is-active', event === active));
      timeline.querySelectorAll<HTMLElement>('.career-year').forEach((year) => {
        const selected = active && year.contains(active);
        year.classList.toggle('is-active', Boolean(selected));
        if (selected) year.style.setProperty('--active-color', active.style.getPropertyValue('--event-color'));
        else year.style.removeProperty('--active-color');
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const headerObserver = new ResizeObserver(schedule);
    if (header) headerObserver.observe(header);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
    return () => { headerObserver.disconnect(); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); if (frame) cancelAnimationFrame(frame); };
  }, []);
  return null;
}
