
import { Icon } from './material-icon';
import Link from 'next/link';
import type { Locale } from '../content';
import projects from '../content/projects.json';
import { TiltCard } from './tilt-card';

type Project = (typeof projects)[number];
const foregrounds = new Set(['orkuty', 'rydermais', 'singalong', 'deltaverse', 'ryan']);
const revisedMarks = new Set(['orkuty', 'beatup', 'deltaverse', 'karaotrack', 'mangut']);

export function ProjectCard({ project, locale, visitLabel, autoActive = false }: { project: Project; locale: Locale; visitLabel: string; autoActive?: boolean }) {
  const destination = '/' + locale + '/project/' + project.id;
  const descriptions = project.description as Partial<Record<Locale, string>>;
  const language = descriptions[locale] ? locale : 'pt-BR';
  return <TiltCard className={'card project-card project-card-' + project.id + (autoActive ? ' is-auto-active' : '')}>
    <div className="project-art">
      {project.image && <Link className="project-image" href={destination} tabIndex={-1} aria-hidden="true"><img src={project.image} alt="" loading="lazy" /></Link>}
      {foregrounds.has(project.id) && <img className="project-foreground" src={'/images/project-foregrounds/' + (project.id === 'orkuty' ? 'orkuty-login' : project.id) + '.webp'} alt="" loading="lazy" />}
    </div>
    <img className="project-logo" src={'/images/project-logos/' + project.id + (project.id === 'deltaverse' ? '-v6' : revisedMarks.has(project.id) ? '-v3' : '') + '.png'} alt="" loading="lazy" />
    <div className="project-info"><h3><Link href={destination} aria-label={visitLabel + ' · ' + project.title}><span className="project-title">{project.title}</span><span className="project-visit">{visitLabel} <Icon name="arrow_outward" /></span></Link></h3><p lang={language}>{descriptions[language]}</p></div>
  </TiltCard>;
}
