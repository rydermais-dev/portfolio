import Link from 'next/link';
import { notFound } from 'next/navigation';
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

type Props = { params: Promise<{ locale: string; segments?: string[] }> };
const links = [
  ['about', 'menu.about'], ['certifications', 'html.home.certifications'], ['projects', 'menu.projects'],
  ['blog', 'menu.blog'], ['contact', 'menu.contact'],
];
const linkedIn = 'https://www.linkedin.com/in/wellnas/';
const staticRoutes = [[], ...links.map(([slug]) => [slug]), ['about', 'personality-test'],
  ...projects.map(({ id }) => ['project', id]), ...posts.map(({ slug }) => ['blog', slug])];

export function generateStaticParams() {
  return locales.flatMap((locale) => staticRoutes.map((segments) => ({ locale, segments })));
}

function title(locale: Locale, segments: string[]) {
  const [section, slug] = segments;
  if (section === 'project') return projects.find((project) => project.id === slug)?.title;
  if (section === 'blog' && slug) return posts.find((post) => post.slug === slug)?.title;
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
  const projectDescription = (project: (typeof projects)[number]) => {
    const values = project.description as Partial<Record<Locale, string>>;
    const language = values[locale] ? locale : 'pt-BR';
    return <p lang={language}>{values[language]}</p>;
  };
  const featured = (entries: typeof projects) => <div className="cards">
    {entries.map((project, index) => <article className="card project-card" key={project.id}>
      <span className="card-index">{String(index + 1).padStart(2, '0')} / {t('menu.projects')}</span>
      <h3><Link href={path('/project/' + project.id)}>{project.title}<span aria-hidden="true"> ↗</span></Link></h3>{projectDescription(project)}
    </article>)}
  </div>;

  if (!section || (section === 'about' && !slug)) return <>
    <section className={'hero' + (section === 'about' ? ' hero-about' : '')}>
      <div className="wrap hero-inner">
        <img src="/wellington.jpg" width="176" height="176" alt="" />
        <div>
          <span className="hero-label">{section === 'about' ? t('menu.about') : 'FULL STACK / UI & UX'}</span>
          <h1>Wellington do Nascimento<span className="hero-dot">.</span></h1>
          <p>{!section ? 'Full Stack Developer · UI/UX' : t('html.about.description')}</p>
        </div>
      </div>
    </section>
    {!section ? <>
      <section className="wrap section">
        <h2>{t('html.home.trajectoryTitle')}</h2>
        <p>{t('html.home.trajectoryParagraph1')}</p>
        <div className="actions"><Link href={path('/about')}>{t('menu.about')}</Link><a href={linkedIn}>LinkedIn</a></div>
      </section>
      <Playground locale={locale} />
      <section className="wrap section"><h2>{t('html.home.projectsTitle')}</h2>{featured(projects.slice(0, 3))}</section>
    </> : <>
      <section className="wrap section experience-section">
        <h2>{t('html.about.experience.title')}</h2>
        <ol className="timeline">
          {[...timeline].sort((a, b) => (b.startDate ?? b.formationStartDate ?? '').localeCompare(a.startDate ?? a.formationStartDate ?? '')).map((entry) =>
            <li key={entry.id} className="card" lang="pt-BR">
              <span className="muted">{entry.date ?? (entry.startDate ?? entry.formationStartDate)?.slice(0, 4)}</span>
              <h3>{entry.jobRole ?? entry.formationRole ?? entry.title}</h3>
              {https(entry.companyLink) ? <a href={https(entry.companyLink)}>{entry.company ?? entry.formationType}</a> : (entry.company ?? entry.formationType)}
              <p>{entry.jobDescription ?? entry.formationDescription ?? entry.description}</p>
            </li>)}
        </ol>
      </section>
      <section className="wrap section">
        <h2>{t('html.about.skills.title')}</h2>
        <div className="cards">{skills.map((group) => <article className="card" key={group.name}>
          <h3>{group.name}</h3><p>{group.items.map(({ name }) => name).join(' · ')}</p>
        </article>)}</div>
      </section>
      <section className="wrap section"><h2>{t('html.about.personality.title')}</h2><Link href={path('/about/personality-test')}>{t('html.about.personality.button')}</Link></section>
    </>}
  </>;

  if (section === 'project') return <>{projects.filter(({ id }) => id === slug).map((project) => <section key={project.id} className={'project-detail project-' + project.id}>
    <div className="wrap project-detail-inner">
      <Link className="back-link" href={path('/projects')}>← {t('menu.projects')}</Link>
      <span className="project-kicker">{t('menu.projects')} / {project.title}</span>
      <h1>{project.title}</h1>
      <div className="project-intro">{projectDescription(project)}</div>
      <div className="actions">
        {https(project.website) && <a href={https(project.website)}>{t('html.home.visit')} ↗</a>}
        {https(project.code) && <a href={https(project.code)}>GitHub ↗</a>}
      </div>
    </div>
  </section>)}</>;

  return <section className={'wrap section page-section page-' + section}>
    <span className="page-kicker">WELLNAS / {heading}</span>
    <h1>{heading}</h1>
    {section === 'projects' && featured(projects)}
    {section === 'certifications' && <div className="cards">{certifications.map((cert) => <article className="card" key={cert.id} lang="pt-BR">
      <span className="muted">{cert.emissor}</span><h3>{cert.title}</h3>
      {cert.description && <p>{cert.description}</p>}
      {https(cert.link) && <a href={https(cert.link)}>{t('html.certifications.view') || cert.title}</a>}
    </article>)}</div>}
    {section === 'blog' && !slug && <>
      <div className="cards">{[...posts].sort((a, b) => b.date.localeCompare(a.date)).map((post) => <article className="card" key={post.slug} lang="pt-BR">
        {post.date && <time dateTime={post.date}>{date.format(new Date(post.date))}</time>}
        <h3><Link href={path('/blog/' + post.slug)}>{post.title}</Link></h3><p>{post.description}</p>
      </article>)}</div>
      <News />
      <p><a href={linkedIn}>LinkedIn</a></p>
    </>}
    {section === 'blog' && slug && posts.filter((post) => post.slug === slug).map((post) =>
      <article className="article" key={post.slug} lang="pt-BR"><Markdown skipHtml>{post.body}</Markdown></article>)}
    {section === 'contact' && <div className="contact-links">
      <a href={linkedIn}><span>01</span>LinkedIn <span aria-hidden="true">↗</span></a><a href="https://github.com/rydermais-dev"><span>02</span>GitHub <span aria-hidden="true">↗</span></a>
      <a href="mailto:dev.wellnascimento@gmail.com"><span>03</span>E-mail <span aria-hidden="true">↗</span></a>
    </div>}
    {section === 'about' && slug && <p>{t('html.about.personality.description')}</p>}
  </section>;
}
