import type { ComponentPropsWithoutRef } from 'react';

type HeroTextProps = ComponentPropsWithoutRef<'p'> & { as: 'h1' | 'h2' | 'p' };

export function HeroText({ as: Tag, children, ...props }: HeroTextProps) {
  return <Tag {...props} data-hero-text>
    {children}
    <span className={'hero-text-outline' + (Tag === 'h1' ? ' hero-text-outline--radial' : '')} aria-hidden="true">{children}</span>
  </Tag>;
}
