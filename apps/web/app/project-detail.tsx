import Link from 'next/link';
import type { CSSProperties } from 'react';
import { https, translate, type Locale } from '../content';
import { withPortfolioSource } from './outbound-link';
import projects from '../content/projects.json';
import { projectStories, type ProjectBlock } from '../content/project-stories';
import { Icon } from './material-icon';
import { HeroLight } from './hero-light';

type Project = (typeof projects)[number];

const labels = {
  'pt-BR': ['Nesta página', 'Próximo projeto'],
  'pt-PT': ['Nesta página', 'Próximo projeto'],
  en: ['On this page', 'Next project'],
  es: ['En esta página', 'Siguiente proyecto'],
  fr: ['Sur cette page', 'Projet suivant'],
  de: ['Auf dieser Seite', 'Nächstes Projekt'],
  'ja-JP': ['このページの内容', '次のプロジェクト'],
  ko: ['이 페이지의 내용', '다음 프로젝트'],
  ru: ['На этой странице', 'Следующий проект'],
} satisfies Record<Locale, [string, string]>;

function localized(value: Partial<Record<Locale, string>>, locale: Locale) {
  const lang = value[locale] ? locale : 'pt-BR';
  return { lang, children: value[lang] };
}

type StoryImage = Extract<ProjectBlock, { type: 'feature' }>['image'];

function StoryFigure({ image, locale }: { image: StoryImage; locale: Locale }) {
  const alt = localized(image.alt, locale);
  return <figure className="case-figure">
    <img src={image.src} alt={alt.children ?? ''} lang={alt.lang} loading="lazy" decoding="async" />
    {image.caption && <figcaption {...localized(image.caption, locale)} />}
  </figure>;
}

function StoryBlock({ block, locale }: { block: ProjectBlock; locale: Locale }) {
  return <section id={block.id} className={`case-block case-block--${block.type}`} aria-labelledby={`${block.id}-title`}>
    <div>
      <h2 id={`${block.id}-title`} {...localized(block.title, locale)} />
      {'paragraphs' in block && block.paragraphs.map((paragraph, index) =>
        <p key={index} {...localized(paragraph, locale)} />)}
    </div>
    {block.type === 'feature' && <StoryFigure image={block.image} locale={locale} />}
    {block.type === 'gallery' && <div className="case-gallery">
      {block.images.map((image) => <StoryFigure key={image.id} image={image} locale={locale} />)}
    </div>}
  </section>;
}

export function ProjectDetail({ project, locale }: { project: Project; locale: Locale }) {
  const story = projectStories[project.id];
  const next = projects[(projects.findIndex(({ id }) => id === project.id) + 1) % projects.length];
  const [contentsLabel, nextLabel] = labels[locale];
  const website = https(project.website);
  const code = https(project.code);
  const href = (suffix: string) => `/${locale}${suffix}`;

  return <article className="case-page" style={{ '--case-accent': story?.accent ?? '#c094ff' } as CSSProperties}>
    <header className="case-hero">
      <HeroLight />
      <div className="wrap">
        <Link className="ui-button ui-button--outline-light case-back" href={href('/projects')}>
          <Icon name="arrow_back" /> {translate(locale, 'menu.projects')}
        </Link>
        <div className="case-hero-grid">
          <div className="case-intro">
            {story && <span className="case-category" {...localized(story.category, locale)} />}
            <h1>{project.title}</h1>
            <p {...localized(story?.summary ?? project.description, locale)} />
            {story && story.focus.length > 0 && <ul className="case-focus">
              {story.focus.map((item) => <li key={item}>{item}</li>)}
            </ul>}
            {(website || code) && <div className="case-actions">
              {website && <a className="ui-button ui-button--light" href={withPortfolioSource(website)}>{translate(locale, 'html.home.visit')} <Icon name="arrow_outward" /></a>}
              {code && <a className="ui-button ui-button--outline-light" href={withPortfolioSource(code)}>GitHub <Icon name="arrow_outward" /></a>}
            </div>}
          </div>
          {project.image && <div className="case-cover">
            <img src={project.image} alt="" fetchPriority="high" />
            {story?.coverOverlay && <img className="case-cover-overlay" src={story.coverOverlay} alt="" />}
          </div>}
        </div>
      </div>
    </header>
    {story && story.blocks.length > 0 && <div className="wrap case-story">
      <nav className="case-toc" aria-label={contentsLabel}>
        <p>{contentsLabel}</p>
        <ul>{story.blocks.map((block) => <li key={block.id}><a href={`#${block.id}`} {...localized(block.title, locale)} /></li>)}</ul>
      </nav>
      <div className="case-blocks">{story.blocks.map((block) => <StoryBlock key={block.id} block={block} locale={locale} />)}</div>
    </div>}
    {next && next.id !== project.id && <div className="wrap case-footer">
      <Link className="case-next" href={href(`/project/${next.id}`)}>
        <div><span>{nextLabel}</span><strong>{next.title}</strong></div>
        <Icon name="arrow_forward" />
      </Link>
    </div>}
  </article>;
}
