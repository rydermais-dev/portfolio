import { NextRequest, NextResponse } from 'next/server';

const locales = ['pt-BR', 'pt-PT', 'en', 'es', 'de', 'fr', 'ja-JP', 'ko', 'ru'];
function resolveLocale(value: string) {
  const tag = value.toLowerCase();
  const exact = locales.find((locale) => locale.toLowerCase() === tag);
  if (exact) return exact;
  const language = tag.split('-')[0];
  return ({ pt: 'pt-BR', en: 'en', es: 'es', de: 'de', fr: 'fr', ja: 'ja-JP', ko: 'ko', ru: 'ru' } as Record<string, string>)[language];
}
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split('/')[1];
  if (locales.includes(first)) return NextResponse.next();
  const alias = first && resolveLocale(first);
  const preferred = resolveLocale(request.cookies.get('portfolio-locale')?.value || '') ||
    (request.headers.get('accept-language') || '').split(',').map((item) => {
      const [tag, quality] = item.trim().split(';q=');
      return { tag, quality: quality === undefined ? 1 : Number(quality) };
    }).filter((item) => item.quality > 0).sort((a, b) => b.quality - a.quality).map((item) => resolveLocale(item.tag)).find(Boolean) || 'pt-BR';
  const url = request.nextUrl.clone();
  url.pathname = alias ? `/${alias}${pathname.slice(first.length + 1)}` : `/${preferred}${pathname === '/' ? '' : pathname}`;
  const response = NextResponse.redirect(url);
  response.headers.set('Vary', 'Accept-Language, Cookie');
  response.headers.set('Cache-Control', 'private, no-store');
  return response;
}
export const config = { matcher: ['/((?!api|_next|healthz|.*\\..*).*)'] };
