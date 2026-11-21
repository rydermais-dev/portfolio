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
import { TiltCard } from '../../tilt-card';
import { HeroGrid } from '../../interaction-effects';
import { PrintButton } from '../../print-button';

type Props = { params: Promise<{ locale: string; segments?: string[] }> };
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
  const projectDescription = (project: (typeof projects)[number]) => {
    const values = project.description as Partial<Record<Locale, string>>;
    const language = values[locale] ? locale : 'pt-BR';
    return <p lang={language}>{values[language]}</p>;
  };
  const featured = (entries: typeof projects) => <div className="cards">
    {entries.map((project, index) => <TiltCard className="card project-card" key={project.id}>
      {project.image && <Link className="project-image" href={path('/project/' + project.id)} tabIndex={-1} aria-hidden="true"><img src={project.image} alt="" loading="lazy" /></Link>}
      <span className="card-index">{String(index + 1).padStart(2, '0')} / {t('menu.projects')}</span>
      <h3><Link href={path('/project/' + project.id)}>{project.title}<span aria-hidden="true"> ↗</span></Link></h3>{projectDescription(project)}
    </TiltCard>)}
  </div>;

  if (!section || (section === 'about' && !slug)) return <>
    <section className={'hero' + (section === 'about' ? ' hero-about' : '')}>
      <HeroGrid />
      <div className="hero-trails" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /></div>
      <div className="wrap hero-inner">
        <div className="hero-portrait"><img src={section === 'about' ? '/wellington-linkedin.jpg' : '/wellington.jpg'} width="176" height="176" alt="" /></div>
        <div>
          <span className="hero-label">{section === 'about' ? t('menu.about') : 'FULL STACK / UI & UX'}</span>
          <h1>Wellington do Nascimento<span className="hero-dot">.</span></h1>
          <p>{!section ? 'Full Stack Developer · UI/UX' : t('html.about.description')}</p>
          {!section && <div className="home-hero-actions"><Link href={path('/projects')}>{t('menu.projects')} ↗</Link><Link href={path('/about')}>{t('menu.about')} ↓</Link></div>}
        </div>
      </div>
    </section>
    {!section ? <>
      <section className="wrap section home-story"><div><span className="page-kicker">FULL STACK · UX</span><h2>{t('html.home.trajectoryTitle')}</h2></div><div><p>{t('html.home.trajectoryParagraph1')}</p><div className="actions"><Link href={path('/about')}>{t('menu.about')} ↗</Link></div></div></section>
      <Playground locale={locale} />
      <section className="wrap section home-projects"><div className="home-section-heading"><h2>{t('html.home.projectsTitle')}</h2><Link href={path('/projects')}>{t('menu.projects')} ↗</Link></div>{featured(projects.slice(0, 3))}</section><section className="wrap home-next" lang="pt-BR"><div><h2>Vamos conversar?</h2><p>Tem uma ideia, um desafio ou uma oportunidade em mente? Adoraria saber mais.</p></div><Link href={path('/contact')}>{t('menu.contact')} ↗</Link></section>
    </> : <>
      <section className="wrap section experience-section">
        <h2>{t('html.about.experience.title')}</h2>
        <div className="career-timeline">{groupedTimeline.map(([year, entries]) => <section className="career-year" key={year}>
          <h3 className="career-year-label">{year}</h3>
          <ol className="career-events">{entries?.map((entry) => <li key={entry.id + '-' + (entry.company ?? entry.formationType)} className="career-event" lang="pt-BR" style={{ '--event-color': entry.color || '#9871f6' } as React.CSSProperties}>
            <div className="career-header"><div className="career-company">{entry.companyLogo && <img src={entry.companyLogo} alt="" width="36" height="36" loading="lazy" />}<strong>{entry.company ?? entry.formationType}</strong></div><span>{entry.date ?? year}</span></div>
            <h4>{entry.jobRole ?? entry.formationRole ?? entry.title}</h4>
            <p>{entry.jobDescription ?? entry.formationDescription ?? entry.description}</p>
            {(entry.jobtags || entry.formationtags) && <><div className="career-tags">{(entry.jobtags || entry.formationtags || []).slice(0, 8).map((tag) => <span key={tag}>{tag}</span>)}</div>{(entry.jobtags || entry.formationtags || []).length > 8 && <details className="career-more"><summary>{t('html.home.viewMore')}</summary><div className="career-tags">{(entry.jobtags || entry.formationtags || []).slice(8).map((tag) => <span key={tag}>{tag}</span>)}</div></details>}</>}
            <div className="career-meta">{(entry.jobLocation || entry.formationLocation) && <span>⌖ {entry.jobLocation || entry.formationLocation}</span>}{(entry.jobContract || entry.formationType) && <span>◌ {entry.jobContract || entry.formationType}</span>}{https(entry.companyLink) && <a href={https(entry.companyLink)}>{t('html.about.experience.company.button')} ↗</a>}</div>
          </li>)}</ol>
        </section>)}</div>
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
      {project.image && <div className="project-cover"><img src={project.image} alt="" /></div>}
    </div>
  </section>)}</>;

  if (section === 'cv') return <section className="wrap section cv-page" lang="pt-BR">
    <div className="cv-controls"><Link href={path('/contact')}>← {t('menu.contact')}</Link><PrintButton label="Imprimir / salvar em PDF" /></div>
    <header className="cv-heading"><span className="page-kicker">Curriculum Vitae</span><h1>Wellington do Nascimento</h1><p>Full Stack Developer · UI/UX</p><p>Rio de Janeiro, Brasil · <a href="mailto:dev.wellnascimento@gmail.com">dev.wellnascimento@gmail.com</a> · <a href={linkedIn}>LinkedIn</a></p></header>
    <h2>{t('html.about.experience.title')}</h2><div className="cv-entries">{timeline.filter((entry) => entry.jobRole).map((entry) => <article key={entry.id + '-' + entry.company}><h3>{entry.jobRole}</h3><strong>{entry.company} · {entry.date}</strong><p>{entry.jobDescription}</p></article>)}</div>
    <h2>{t('html.about.skills.title')}</h2><div>{skills.map((group) => <p key={group.name}><strong>{group.name}: </strong>{group.items.map(({ name }) => name).join(' · ')}</p>)}</div>
  </section>;

  return <section className={'wrap section page-section page-' + section}>
    <span className="page-kicker">WELLNAS / {heading}</span>
    <h1>{heading}</h1>
    {section === 'projects' && <><p className="editorial-lead" lang="pt-BR">Aqui você encontra o SingAlong!, que nasceu do meu interesse por jogos musicais, além de experimentos de automação, nostalgia e desenvolvimento para a web.</p>{featured(projects)}</>}
    {section === 'certifications' && <div className="cards certification-grid" lang="pt-BR">{certifications.map((cert) => <TiltCard className="card certification-card" key={cert.id}>
      <div className="certification-issuer">{cert.issuerLogo && <img className="issuer-logo" src={cert.issuerLogo} alt="" loading="lazy" />}<div><strong>{cert.emissor}</strong>{cert.date && <span>{cert.date}</span>}</div></div>
      <h2>{cert.title}</h2>
      {cert.tags?.length > 0 && <div className="certification-tags">{cert.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>}
      {https(cert.link) && <a className="certification-link" href={https(cert.link)}>{t('html.certifications.view') || cert.title} ↗</a>}
    </TiltCard>)}</div>}
    {section === 'blog' && !slug && <>
      <div className="journal-intro" lang="pt-BR"><div><p className="journal-eyebrow">NOTAS DE UM DESENVOLVEDOR</p><h2>Ideias, descobertas e código.</h2><p>Um espaço para compartilhar o que aprendo construindo para a web e as histórias que encontro pelo caminho.</p></div><div className="journal-mark" aria-hidden="true">✳</div></div><div className="journal-heading"><h2>Artigos</h2><span>{posts.length} publicações</span></div>
      <div className="blog-index">{[...posts].sort((a, b) => b.date.localeCompare(a.date)).map((post) => <article className="card blog-entry" key={post.slug} lang="pt-BR">
        {post.date && <time dateTime={post.date}>{date.format(new Date(post.date))}</time>}
        <div><h2><Link href={path('/blog/' + post.slug)}>{post.title} <span aria-hidden="true">↗</span></Link></h2><p>{post.description}</p></div>
      </article>)}</div>
      <News />
      <div className="journal-follow" lang="pt-BR"><div><h2>Continuamos a conversa?</h2><p>Compartilho descobertas e projetos também no LinkedIn.</p></div><a href={linkedIn}>Acompanhar no LinkedIn ↗</a></div>
    </>}
    {section === 'blog' && slug && posts.filter((post) => post.slug === slug).map((post) =>
      <article className="article" key={post.slug} lang="pt-BR"><Link href={path('/blog')}>← {t('menu.blog')}</Link><Markdown skipHtml>{post.body}</Markdown><aside className="article-next">{posts.filter((other) => other.slug !== slug).map((other) => <Link key={other.slug} href={path('/blog/' + other.slug)}>{other.title} ↗</Link>)}</aside></article>)}
    {section === 'contact' && <div className="contact-groups">
      <div className="contact-intro" lang="pt-BR"><div><p className="journal-eyebrow">VAMOS CONVERSAR</p><h2>Uma boa ideia começa com uma conversa.</h2><p>Quer criar um produto, melhorar uma experiência ou conversar sobre uma oportunidade? Conte o que você tem em mente e o contexto do projeto. Vou gostar de conhecer sua ideia.</p></div><div className="contact-orbit" aria-hidden="true">✳</div></div>
      <section className="resume-panel"><div><h2>Curriculum Vitae</h2><p lang="pt-BR">Consulte minha trajetória em uma versão pronta para impressão.</p></div><Link className="resume-link" href={path('/cv')}>Curriculum Vitae ↗</Link></section>
      <section><h2>{t('html.contact.contactInfo')}</h2><div className="contact-grid"><a className="contact-tile" href="mailto:dev.wellnascimento@gmail.com"><span aria-hidden="true">✉</span><div><strong>Envie um e-mail</strong><small>dev.wellnascimento@gmail.com</small></div><span aria-hidden="true">↗</span></a><a className="contact-tile" href={linkedIn}><span aria-hidden="true">in</span><div><strong>Conecte-se no LinkedIn</strong><small>@wellnas</small></div><span aria-hidden="true">↗</span></a></div></section>
    </div>}
    {section === 'about' && slug && <div className="personality-result"><img src="/images/MBTI/16personalities-intp.svg" alt="" /><div><span className="page-kicker">INTP-T</span><p>{t('html.about.personality.description')}</p><a href="https://www.16personalities.com/intp-personality">16Personalities ↗</a></div></div>}
  </section>;
}
