
import { Icon } from '../../material-icon';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import type { Metadata } from 'next';
import Markdown from 'react-markdown';
import { https, isLocale, locales, translate, type Locale } from '../../../content';
import projects from '../../../content/projects.json';
import timeline from '../../../content/timeline.json';
import certifications from '../../../content/certifications.json';
import skills from '../../../content/skills.json';
import posts from '../../../content/posts.json';
import { News } from '../../news';
import { Playground } from '../../playground';
import { ProjectCard } from '../../project-card';
import { ProjectDetail } from '../../project-detail';
import { HomeHeroPortrait } from '../../home-hero-portrait';
import { HeroGrid } from '../../interaction-effects';
import { HeroLight } from '../../hero-light';
import { HeroText } from '../../hero-text';
import { PrintButton } from '../../print-button';
import { CertificateGallery } from '../../certificate-gallery';
import { TimelineHighlight } from '../../timeline-highlight';

type Props = { params: Promise<{ locale: string; segments?: string[] }> };
const [featuredPost, ...archivePosts] = [...posts].sort((a, b) => b.date.localeCompare(a.date));
const readingMinutes = (body: string) => Math.max(1, Math.ceil(body.trim().split(/\s+/).length / 220));
const links = [
  ['about', 'menu.about'], ['certifications', 'html.home.certifications'], ['projects', 'menu.projects'],
  ['blog', 'menu.blog'], ['contact', 'menu.contact'],
];
const linkedIn = 'https://www.linkedin.com/in/wellnas/';
const staticRoutes = [[], ...links.map(([slug]) => [slug]), ['cv'], ['about', 'personality-test'],
  ...projects.map(({ id }) => ['project', id]), ...posts.map(({ slug }) => ['blog', slug])];

export function generateStaticParams() {
  return locales.flatMap((locale) => staticRoutes.map((segments) => ({ locale, segments })));
}

function title(locale: Locale, segments: string[]) {
  const [section, slug] = segments;
  if (section === 'project') return projects.find((project) => project.id === slug)?.title;
  if (section === 'blog' && slug) return posts.find((post) => post.slug === slug)?.title;
  if (section === 'cv') return 'Curriculum Vitae';
  if (section === 'about' && slug) return translate(locale, 'html.about.personality.title');
  const key = links.find(([route]) => route === section)?.[1];
  return key ? translate(locale, key) : undefined;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, segments = [] } = await params;
  if (!isLocale(locale)) return {};
  return { title: title(locale, segments) };
}

export default async function Page({ params }: Props) {
  const { locale, segments = [] } = await params;
  if (!isLocale(locale)) notFound();
  const path = (suffix: string) => '/' + locale + suffix;
  const t = (key: string) => translate(locale, key);
  const [section, slug] = segments;
  const allowed = staticRoutes.some((route) => route.join('/') === segments.join('/'));
  if (!allowed) notFound();
  const heading = title(locale, segments);
  const date = new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' });
  const groupedTimeline = Object.entries(Object.groupBy([...timeline].sort((a, b) => (b.startDate ?? b.formationStartDate ?? '').localeCompare(a.startDate ?? a.formationStartDate ?? '')), (entry) => (entry.startDate ?? entry.formationStartDate ?? '').slice(0, 4) || '—')).sort(([a], [b]) => b.localeCompare(a));

  if (section === 'about' && !slug) permanentRedirect(path('#sobre-mim'));

  if (!section) return <>
    <div className="home-showcase">
      <HeroLight />
    <section className="hero home-hero">
      <HeroGrid />
      <div className="hero-trails" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /></div>
      <div className="wrap hero-inner">
        <div>
          <HeroText as="h1">Wellington do Nascimento<span className="hero-dot">.</span></HeroText>
          <HeroText as="p">Full Stack Developer · UI/UX</HeroText>
          {!section && <HeroText as="p" className="home-hero-statement" lang="pt-BR">Da ideia à interface.<br /><span>Feito para pessoas.</span></HeroText>}
          {!section && <div className="home-hero-actions"><Link className="ui-button ui-button--light" href={path('/projects')}>{t('menu.projects')} <Icon name="arrow_outward" /></Link><Link className="ui-button ui-button--outline-light" href={path('#sobre-mim')}>{t('menu.about')} <Icon name="arrow_downward" /></Link></div>}
        </div>
        <HomeHeroPortrait />
      </div>
    </section>
      <Playground locale={locale} />
    </div>
      <section id="sobre-mim" className="wrap section experience-section">
        <h2>{t('html.about.experience.title')}</h2>
        <div className="career-timeline"><TimelineHighlight />{groupedTimeline.map(([year, entries]) => <section className="career-year" key={year} style={{ '--year-color': entries?.[0]?.color || 'var(--accent)' } as React.CSSProperties}>
          <h3 className="career-year-label">{year}</h3>
          <ol className="career-events">{entries?.map((entry) => <li key={entry.id + '-' + (entry.company ?? entry.formationType)} className="career-event" lang="pt-BR" style={{ '--event-color': entry.color || '#9871f6' } as React.CSSProperties}>
            <div className="career-header"><div className="career-company">{entry.companyLogo && <img src={entry.companyLogo} alt="" width="36" height="36" loading="lazy" />}<strong>{entry.company ?? entry.formationType}</strong></div><span>{entry.date ?? year}</span></div>
            <h4>{entry.jobRole ?? entry.formationRole ?? entry.title}</h4>
            <p>{entry.jobDescription ?? entry.formationDescription ?? entry.description}</p>
            {(entry.jobtags || entry.formationtags) && <><div className="career-tags">{(entry.jobtags || entry.formationtags || []).slice(0, 8).map((tag) => <span key={tag}>{tag}</span>)}</div>{(entry.jobtags || entry.formationtags || []).length > 8 && <details className="career-more"><summary>{t('html.home.viewMore')}</summary><div className="career-tags">{(entry.jobtags || entry.formationtags || []).slice(8).map((tag) => <span key={tag}>{tag}</span>)}</div></details>}</>}
            <div className="career-meta">{(entry.jobLocation || entry.formationLocation) && <span><Icon name="location_on" /> {entry.jobLocation || entry.formationLocation}</span>}{(entry.jobContract || entry.formationType) && <span><Icon name="work" /> {entry.jobContract || entry.formationType}</span>}{https(entry.companyLink) && <a href={https(entry.companyLink)}>{t('html.about.experience.company.button')} <Icon name="arrow_outward" /></a>}</div>
          </li>)}</ol>
        </section>)}</div>
      </section>
      <section className="wrap home-next" lang="pt-BR"><HeroGrid /><div className="home-next-copy"><h2>Vamos construir<br /><span>algo juntos?</span></h2><p>Uma ideia em construção, um desafio de produto ou uma oportunidade para colaborar. Me conte o que você tem em mente.</p><Link className="ui-button ui-button--primary" href={path('/contact')}>{t('menu.contact')} <Icon name="arrow_outward" /></Link></div><div className="home-next-blocks" aria-hidden="true"><i /><i /><i /><i /></div></section>
  </>;

  if (section === 'project') {
    const project = projects.find(({ id }) => id === slug);
    if (!project) notFound();
    return <ProjectDetail project={project} locale={locale} />;
  }

  if (section === 'cv') return <section className="wrap section cv-page" lang="pt-BR">
    <div className="cv-controls"><Link href={path('/contact')}><Icon name="arrow_back" /> {t('menu.contact')}</Link><PrintButton label="Imprimir / salvar em PDF" /></div>
    <header className="cv-heading"><span className="page-kicker">Curriculum Vitae</span><h1>Wellington do Nascimento</h1><p>Full Stack Developer · UI/UX</p><p>Rio de Janeiro, Brasil · <a href="mailto:dev.wellnascimento@gmail.com">dev.wellnascimento@gmail.com</a> · <a href={linkedIn}>LinkedIn</a></p></header>
    <h2>{t('html.about.experience.title')}</h2><div className="cv-entries">{timeline.filter((entry) => entry.jobRole).map((entry) => <article key={entry.id + '-' + entry.company}><h3>{entry.jobRole}</h3><strong>{entry.company} · {entry.date}</strong><p>{entry.jobDescription}</p></article>)}</div>
    <h2>{t('html.about.skills.title')}</h2><div>{skills.map((group) => <p key={group.name}><strong>{group.name}: </strong>{group.items.map(({ name }) => name).join(' · ')}</p>)}</div>
  </section>;

  return <section className={'wrap section page-section page-' + section}>
    {section !== 'contact' && section !== 'blog' && <h1>{heading}</h1>}
    {section === 'projects' && <><p className="editorial-lead" lang="pt-BR">Aqui você encontra o SingAlong!, que nasceu do meu interesse por jogos musicais, além de experimentos de automação, nostalgia e desenvolvimento para a web.</p><div className="cards">{projects.map((project) => <ProjectCard key={project.id} project={project} locale={locale} visitLabel={t('html.home.visit')} />)}</div></>}
    {section === 'certifications' && <CertificateGallery locale={locale} />}
    {section === 'blog' && !slug && <>
      <header className="journal-masthead" lang="pt-BR"><h1>Notas de desenvolvimento</h1><p>O que aprendo construindo para a web, do código às decisões de interface.</p></header>
      {featuredPost && <article className="journal-feature" lang="pt-BR">
        <div className="journal-feature-copy"><p className="journal-meta"><time dateTime={featuredPost.date}>{date.format(new Date(featuredPost.date))}</time> · {readingMinutes(featuredPost.body)} min de leitura</p>
          <h2><Link href={path('/blog/' + featuredPost.slug)}>{featuredPost.title}</Link></h2>
          <p>{featuredPost.description}</p>
          <Link className="ui-button ui-button--outline" href={path('/blog/' + featuredPost.slug)}>Ler artigo <Icon name="arrow_outward" /></Link>
        </div><div className="journal-feature-art" aria-hidden="true"><span /><span /><span /></div>
      </article>}
      {archivePosts.length > 0 && <div className="journal-heading" lang="pt-BR"><h2>Arquivo</h2></div>}
      <div className="blog-index">{archivePosts.map((post) => <article className="card blog-entry" key={post.slug} lang="pt-BR">
        {post.date && <time dateTime={post.date}>{date.format(new Date(post.date))}</time>}
        <div><h3><Link href={path('/blog/' + post.slug)}>{post.title} <Icon name="arrow_outward" /></Link></h3><p>{post.description} · {readingMinutes(post.body)} min de leitura</p></div>
      </article>)}</div>
      <News />
      <div className="journal-follow" lang="pt-BR"><div><h2>Continuamos a conversa?</h2><p>Compartilho descobertas e projetos também no LinkedIn.</p></div><a className="ui-button ui-button--light" href={linkedIn}>Acompanhar no LinkedIn <Icon name="arrow_outward" /></a></div>
    </>}
    {section === 'blog' && slug && posts.filter((post) => post.slug === slug).map((post) =>
      <article className="article journal-article" key={post.slug} lang="pt-BR">
        <Link href={path('/blog')}><Icon name="arrow_back" /> {t('menu.blog')}</Link>
        <header><h1>{post.title}</h1><p className="journal-meta">Wellington do Nascimento · <time dateTime={post.date}>{date.format(new Date(post.date))}</time> · {readingMinutes(post.body)} min de leitura</p></header>
        <Markdown skipHtml>{post.body}</Markdown>
        <aside className="article-next"><h2>Continue lendo</h2>{posts.filter((other) => other.slug !== slug).map((other) => <Link key={other.slug} href={path('/blog/' + other.slug)}>{other.title} <Icon name="arrow_outward" /></Link>)}</aside>
      </article>)}
    {section === 'contact' && <div className="contact-page" lang="pt-BR">
      <header className="contact-hero">
        <div className="contact-hero-copy"><h1>Vamos conversar.</h1><p>Se você está montando um time ou tem um produto em construção, me conte qual problema quer resolver e em que ponto o trabalho está.</p></div>
        <div className="contact-grid">
          <a className="contact-tile" href="mailto:dev.wellnascimento@gmail.com"><Icon name="mail" /><div><strong>E-mail</strong><small>dev.wellnascimento@gmail.com</small></div><Icon name="arrow_outward" /></a>
          <a className="contact-tile" href={linkedIn}><span aria-hidden="true">in</span><div><strong>LinkedIn</strong><small>@wellnas</small></div><Icon name="arrow_outward" /></a>
        </div>
      </header>
      <section className="contact-resume"><div><h2>Minha trajetória em uma página</h2><p>Experiências e competências em uma versão pronta para impressão.</p></div><Link className="ui-button ui-button--primary" href={path('/cv')}>Ver currículo <Icon name="arrow_outward" /></Link></section>
    </div>}
    {section === 'about' && slug && <div className="personality-result"><img src="/images/MBTI/16personalities-intp.svg" alt="" /><div><span className="page-kicker">INTP-T</span><p>{t('html.about.personality.description')}</p><a href="https://www.16personalities.com/intp-personality">16Personalities <Icon name="arrow_outward" /></a></div></div>}
  </section>;
}
