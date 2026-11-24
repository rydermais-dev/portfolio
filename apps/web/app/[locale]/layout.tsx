import 'material-symbols/rounded.css';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { isLocale, locales, translate } from '../../content';
import { Header } from './nav';
import { withPortfolioSource } from '../outbound-link';
import { RevealLight } from '../interaction-effects';
import { ContactFooterDots } from '../contact-footer-dots';
import '@moduix/react/style.css';
import '@fontsource-variable/inter';
import '../style.css';
import '../project-detail.css';

export const metadata: Metadata = {
  title: { default: 'Wellington do Nascimento', template: '%s · Wellington do Nascimento' },
  description: 'Portfólio profissional de Wellington do Nascimento.',
  applicationName: 'Wellington N. Portfolio',
  icons: {
    icon: [
      { url: '/favicons/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicons/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicons/favicon.ico', rel: 'shortcut icon' },
    ],
    apple: [{ url: '/favicons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/favicons/site.webmanifest',
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
    ['', 'menu.home'], ['/certifications', 'html.home.certifications'],
    ['/projects', 'menu.projects'], ['/blog', 'menu.blog'], ['/contact', 'menu.contact'],
  ].map(([path, key]) => ({ path, label: translate(locale, key) }));
  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <RevealLight />
        <Header locale={locale} links={links} themeLabel={translate(locale, 'commons.themes.dark') + ' / ' + translate(locale, 'commons.themes.light')} />
        <div className="contact-footer-flow">
          <main id="content">{children}</main>
          <footer className="wrap footer">
            <span>Wellington do Nascimento</span>
            <a href={withPortfolioSource('https://github.com/rydermais-dev/portfolio')}>GitHub · AGPL-3.0</a>
            <ContactFooterDots />
          </footer>
        </div>
      </body>
    </html>
  );
}
