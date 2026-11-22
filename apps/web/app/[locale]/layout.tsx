import 'material-symbols/rounded.css';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { isLocale, locales, translate } from '../../content';
import { Header } from './nav';
import { RevealLight } from '../interaction-effects';
import '@moduix/react/style.css';
import '@fontsource-variable/inter';
import '../style.css';

export const metadata: Metadata = {
  title: { default: 'Wellington do Nascimento', template: '%s · Wellington do Nascimento' },
  description: 'Portfólio profissional de Wellington do Nascimento.',
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function Layout({ children, params }: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const links = [
    ['', 'menu.home'], ['#sobre-mim', 'menu.about'], ['/certifications', 'html.home.certifications'],
    ['/projects', 'menu.projects'], ['/blog', 'menu.blog'], ['/contact', 'menu.contact'],
  ].map(([path, key]) => ({ path, label: translate(locale, key) }));
  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <RevealLight />
        <Header locale={locale} links={links} themeLabel={translate(locale, 'commons.themes.dark') + ' / ' + translate(locale, 'commons.themes.light')} />
        <main id="content">{children}</main>
        <footer className="wrap footer">
          <span>Wellington do Nascimento</span>
          <a href="https://github.com/rydermais-dev/portfolio">GitHub · AGPL-3.0</a>
        </footer>
      </body>
    </html>
  );
}
