'use client';

import { useEffect } from 'react';

export function TimelineHighlight() {
  useEffect(() => {
    const timeline = document.querySelector<HTMLElement>('.career-timeline');
    if (!timeline) return;
    const events = Array.from(timeline.querySelectorAll<HTMLElement>('.career-event'));
    let frame = 0;
    const update = () => {
      frame = 0;
      const marker = window.innerWidth <= 700 ? 100 : 112;
      const bounds = timeline.getBoundingClientRect();
      const active = bounds.top <= marker && bounds.bottom > marker
        ? [...events].reverse().find((event) => event.getBoundingClientRect().top <= marker) ?? events[0]
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
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
    return () => { window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); if (frame) cancelAnimationFrame(frame); };
  }, []);
  return null;
}
