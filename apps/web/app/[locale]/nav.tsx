'use client';

import { Icon } from '../material-icon';

import { Button } from '@moduix/react/button';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { languages, type Locale } from '../../content';

const labels: Record<Locale, [string, string, string, string]> = {
  'pt-BR': ['Menu', 'Idioma', 'Pular para o conteúdo', 'Fechar menu'], 'pt-PT': ['Menu', 'Idioma', 'Saltar para o conteúdo', 'Fechar menu'],
  en: ['Menu', 'Language', 'Skip to content', 'Close menu'], es: ['Menú', 'Idioma', 'Saltar al contenido', 'Cerrar menú'],
  de: ['Menü', 'Sprache', 'Zum Inhalt springen', 'Menü schließen'], fr: ['Menu', 'Langue', 'Aller au contenu', 'Fermer le menu'],
  'ja-JP': ['メニュー', '言語', '本文へスキップ', 'メニューを閉じる'], ko: ['메뉴', '언어', '본문으로 건너뛰기', '메뉴 닫기'],
  ru: ['Меню', 'Язык', 'Перейти к содержанию', 'Закрыть меню'],
};

export function Header({ locale, links, themeLabel }: {
  locale: Locale;
  links: { path: string; label: string }[];
  themeLabel: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [darkTheme, setDarkTheme] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuToggle = useRef<HTMLButtonElement>(null);
  const menuClose = useRef<HTMLButtonElement>(null);
  const [menuLabel, languageLabel, skipLabel, closeMenuLabel] = labels[locale];

  useEffect(() => {
    const saved = localStorage.getItem('portfolio-theme');
    if (saved === 'dark' || saved === 'light') document.documentElement.dataset.theme = saved;
    const update = () => setDarkTheme(document.documentElement.dataset.theme === 'dark' || (!document.documentElement.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    menuClose.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setMenuOpen(false);
      menuToggle.current?.focus();
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
    requestAnimationFrame(() => menuToggle.current?.focus());
  }

  function toggleTheme() {
    const root = document.documentElement;
    const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
    setDarkTheme(!dark);
    localStorage.setItem('portfolio-theme', root.dataset.theme);
  }

  function renderLinks() {
    return links.map(({ path, label }) => {
      const href = '/' + locale + path;
      const current = path === '/projects' && pathname.startsWith('/' + locale + '/project/')
        || pathname === href || Boolean(path && pathname.startsWith(href + '/'));
      return <Link className="ui-button ui-button--outline-light ui-button--nav" key={path} href={href} aria-current={current ? 'page' : undefined}
        onClick={closeMenu}>{label}</Link>;
    });
  }

  return (
    <header className="header">
      <a className="skip" href="#content">{skipLabel}</a>
      <div className="nav">
        <div className="nav-brand-group">
          <Button ref={menuToggle} type="button" aria-label={menuLabel} aria-expanded={menuOpen} aria-controls="mobile-navigation"
            className="ui-button ui-button--nav-icon mobile-menu-toggle" onClick={() => setMenuOpen((open) => !open)}>
            <Icon name={menuOpen ? 'close' : 'menu'} />
          </Button>
          <Link className="brand" href={'/' + locale}>Well<span>.</span></Link>
        </div>
        <nav className="desktop" aria-label={menuLabel}>{renderLinks()}</nav>
        <div className="tools">
          <label className="language">
            <img className="language-flag" alt="" width="20" height="16" src={'/flags/Flag_' + languages[locale][1] + '.svg'} />
            <select aria-label={languageLabel} value={locale} onChange={(event) => {
              const suffix = pathname.slice(locale.length + 1);
              document.cookie = 'portfolio-locale=' + encodeURIComponent(event.target.value) + '; Path=/; Max-Age=31536000; SameSite=Lax';
              router.push('/' + event.target.value + suffix + location.search + location.hash);
            }}>
              {Object.entries(languages).map(([key, [label]]) => <option lang={key} key={key} value={key}>{label}</option>)}
            </select>
          </label>
          <Button type="button" aria-label={themeLabel} className="ui-button ui-button--nav-icon theme" onClick={toggleTheme}><Icon name={darkTheme ? 'light_mode' : 'dark_mode'} /></Button>
        </div>
      </div>
      <div className="mobile-menu-layer" data-open={menuOpen} aria-hidden={!menuOpen}>
        <button className="mobile-menu-scrim" type="button" tabIndex={menuOpen ? 0 : -1} aria-label={closeMenuLabel} onClick={closeMenu} />
        <nav id="mobile-navigation" className="mobile-drawer" aria-label={menuLabel} inert={!menuOpen}>
          <div className="mobile-drawer-heading"><span>{menuLabel}</span>
            <Button ref={menuClose} type="button" aria-label={closeMenuLabel} className="ui-button ui-button--nav-icon" onClick={closeMenu}><Icon name="close" /></Button>
          </div>
          <div className="mobile-drawer-links">{renderLinks()}</div>
        </nav>
      </div>
    </header>
  );
}
