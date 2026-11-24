'use client';

import { usePathname } from 'next/navigation';
import { HeroGrid } from './interaction-effects';

export function ContactFooterDots() {
  const pathname = usePathname();
  return pathname?.endsWith('/contact') ? <HeroGrid /> : null;
}
