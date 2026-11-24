'use client';

import { useEffect, useId, useRef } from 'react';
import { portraitPointer } from './portrait-pointer';

export function HomeHeroPortrait() {
  const scene = useRef<HTMLDivElement>(null);
  const lightFilterId = useId();
  const rimFilterId = useId();

  useEffect(() => {
    const element = scene.current;
    if (!element) return;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    let pointer: { x: number; y: number } | undefined;

    const reset = () => {
      for (const property of ['--portrait-x', '--portrait-y', '--portrait-bg-x', '--portrait-bg-y', '--portrait-bg-tilt-x', '--portrait-bg-tilt-y']) {
        element.style.removeProperty(property);
      }
    };
    const apply = () => {
      if (!pointer || reducedMotion.matches) return;
      const { top, width, height } = element.getBoundingClientRect();
      if (!width || !height) return;
      if (top >= innerHeight || top + height <= 0) { reset(); return; }
      const { x, y } = portraitPointer(element, pointer.x, pointer.y);
      // Keep the portrait almost locked to camera while the room carries the depth.
      element.style.setProperty('--portrait-x', x * 2 + 'px');
      element.style.setProperty('--portrait-y', y * 1.5 + 'px');
      element.style.setProperty('--portrait-bg-x', x * 35 + 'px');
      element.style.setProperty('--portrait-bg-y', y * 29 + 'px');
      // The room gets a second, stronger tilt; the foreground is counter-rotated
      // independently in interaction-effects so the face stays close to level.
      element.style.setProperty('--portrait-bg-tilt-x', -y * 20 + 'deg');
      element.style.setProperty('--portrait-bg-tilt-y', x * 20 + 'deg');
    };
    const move = (event: PointerEvent) => {
      if ((event.pointerType !== 'mouse' && event.pointerType !== 'pen') || reducedMotion.matches) return;
      pointer = { x: event.clientX, y: event.clientY };
      apply();
    };
    const resetPointer = () => { pointer = undefined; reset(); };

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerleave', resetPointer);
    window.addEventListener('scroll', apply, { passive: true });
    window.addEventListener('resize', apply);
    window.addEventListener('blur', resetPointer);
    reducedMotion.addEventListener('change', resetPointer);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerleave', resetPointer);
      window.removeEventListener('scroll', apply);
      window.removeEventListener('resize', apply);
      window.removeEventListener('blur', resetPointer);
      reducedMotion.removeEventListener('change', resetPointer);
    };
  }, []);

  return (
    <div className="home-hero-scene" ref={scene} aria-hidden="true">
      <div className="home-hero-orbit" data-portrait-light />
      <div className="home-hero-photo tilt-card" data-portrait-light>
        <div className="home-hero-portrait-mat">
          <img className="home-hero-portrait-background" src="/images/hero-portrait-background.webp" width="840" height="840" alt="" fetchPriority="high" />
          <span className="home-hero-portrait-reveal-border" aria-hidden="true" />
        </div>
        <div className="home-hero-portrait-subject">
          <div className="home-hero-portrait-figure" data-portrait-light>
            <img src="/images/hero-portrait-foreground.webp" width="840" height="840" alt="" fetchPriority="high" />
            <div className="home-hero-portrait-lighting">
              <svg className="home-hero-portrait-relief" viewBox="0 0 840 840" aria-hidden="true">
                <defs>
                  <filter id={lightFilterId} filterUnits="userSpaceOnUse" x="0" y="0" width="840" height="840" colorInterpolationFilters="sRGB">
                    <feImage href="/images/hero-portrait-depth.webp" x="0" y="0" width="840" height="840" result="depth" />
                    <feColorMatrix in="depth" type="luminanceToAlpha" result="heightRaw" />
                    <feGaussianBlur in="heightRaw" stdDeviation="5" result="height" />
                    <feDiffuseLighting in="height" surfaceScale="48" diffuseConstant="1" lightingColor="white" result="light">
                      <fePointLight x="420" y="310" z="300" />
                    </feDiffuseLighting>
                    <feColorMatrix in="light" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  .45 .45 .45 0 -.28" result="lightAlpha" />
                    <feComposite in="SourceGraphic" in2="lightAlpha" operator="in" />
                  </filter>
                </defs>
                <rect width="840" height="840" fill="white" filter={`url(#${lightFilterId})`} />
              </svg>
              <svg className="home-hero-portrait-rim" viewBox="0 0 840 840" aria-hidden="true">
                <defs>
                  <filter id={rimFilterId} filterUnits="userSpaceOnUse" x="0" y="0" width="840" height="840" colorInterpolationFilters="sRGB">
                    <feImage href="/images/hero-portrait-depth.webp" x="0" y="0" width="840" height="840" result="depth" />
                    <feColorMatrix in="depth" type="luminanceToAlpha" result="heightRaw" />
                    <feGaussianBlur in="heightRaw" stdDeviation="5" result="height" />
                    <feSpecularLighting in="height" surfaceScale="56" specularConstant=".85" specularExponent="7" lightingColor="white" result="reflection">
                      <fePointLight x="420" y="310" z="145" />
                    </feSpecularLighting>
                    <feComposite in="SourceGraphic" in2="reflection" operator="in" />
                  </filter>
                </defs>
                <rect width="840" height="840" fill="white" filter={`url(#${rimFilterId})`} />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="home-hero-spark" />
    </div>
  );
}
