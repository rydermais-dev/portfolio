'use client';

import { Button } from '@moduix/react/button';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { languages, type Locale } from '../../content';

const labels: Record<Locale, [string, string, string]> = {
  'pt-BR': ['Menu', 'Idioma', 'Pular para o conteúdo'], 'pt-PT': ['Menu', 'Idioma', 'Saltar para o conteúdo'],
  en: ['Menu', 'Language', 'Skip to content'], es: ['Menú', 'Idioma', 'Saltar al contenido'],
  de: ['Menü', 'Sprache', 'Zum Inhalt springen'], fr: ['Menu', 'Langue', 'Aller au contenu'],
  'ja-JP': ['メニュー', '言語', '本文へスキップ'], ko: ['메뉴', '언어', '본문으로 건너뛰기'],
  ru: ['Меню', 'Язык', 'Перейти к содержанию'],
};

export function Header({ locale, links, themeLabel }: {
  locale: Locale;
  links: { path: string; label: string }[];
  themeLabel: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const menu = useRef<HTMLDetailsElement>(null);
  const [menuLabel, languageLabel, skipLabel] = labels[locale];

  useEffect(() => {
    const saved = localStorage.getItem('portfolio-theme');
    if (saved === 'dark' || saved === 'light') document.documentElement.dataset.theme = saved;
  }, []);

  function toggleTheme() {
    const root = document.documentElement;
    const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
    localStorage.setItem('portfolio-theme', root.dataset.theme);
  }

  function renderLinks() {
    return links.map(({ path, label }) => {
      const href = '/' + locale + path;
      const current = path === '/projects' && pathname.startsWith('/' + locale + '/project/')
        || pathname === href || Boolean(path && pathname.startsWith(href + '/'));
      return <Link key={path} href={href} aria-current={current ? 'page' : undefined}
        onClick={() => { if (menu.current) menu.current.open = false; }}>{label}</Link>;
    });
  }

  return (
    <header className="header">
      <a className="skip" href="#content">{skipLabel}</a>
      <div className="nav">
        <Link className="brand" href={'/' + locale}>Well<span>.</span></Link>
        <nav className="desktop" aria-label={menuLabel}>{renderLinks()}</nav>
        <div className="tools">
          <label className="language">
            <img alt="" width="20" height="16" src={'/flags/Flag_' + languages[locale][1] + '.svg'} />
            <select aria-label={languageLabel} value={locale} onChange={(event) => {
              const suffix = pathname.slice(locale.length + 1);
              document.cookie = 'portfolio-locale=' + encodeURIComponent(event.target.value) + '; Path=/; Max-Age=31536000; SameSite=Lax';
              router.push('/' + event.target.value + suffix + location.search + location.hash);
            }}>
              {Object.entries(languages).map(([key, [label]]) => <option lang={key} key={key} value={key}>{label}</option>)}
            </select>
          </label>
          <Button type="button" aria-label={themeLabel} className="theme" onClick={toggleTheme}>◐</Button>
          <details className="mobile" ref={menu} onKeyDown={(event) => {
            if (event.key === 'Escape' && menu.current?.open) {
              menu.current.open = false;
              menu.current.querySelector('summary')?.focus();
            }
          }}>
            <summary>{menuLabel}</summary>
            <nav aria-label={menuLabel}>{renderLinks()}</nav>
          </details>
        </div>
      </div>
    </header>
  );
}
