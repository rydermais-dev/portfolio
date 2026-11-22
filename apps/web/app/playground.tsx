'use client';

import { Button } from '@moduix/react/button';
import Link from 'next/link';
import { useState } from 'react';
import { translate, type Locale } from '../content';
import projects from '../content/projects.json';
import { ProjectCard } from './project-card';

const featuredIds = ['singalong', 'orkuty', 'ryan', 'deltaverse'];
const featuredProjects = featuredIds.map((id) => projects.find((project) => project.id === id)!);

export function Playground({ locale }: { locale: Locale }) {
  const [selected, setSelected] = useState(0);
  const project = featuredProjects[selected];
  const step = (direction: number) => setSelected((index) => (index + direction + featuredProjects.length) % featuredProjects.length);

  return <section className="playground" aria-labelledby="playground-title">
    <div className="wrap playground-inner">
      <div className="playground-heading"><h2 id="playground-title">{translate(locale, 'html.home.projectsTitle')}<span>.</span></h2></div>
      <div className="playground-slide">
        <div aria-live="polite" aria-atomic="true" key={project.id}>
          <ProjectCard project={project} locale={locale} visitLabel={translate(locale, 'html.home.visit')} />
        </div>
        <div className="story-controls" aria-label="Navegar pelos destaques">
          <Button type="button" className="story-button" aria-label="Destaque anterior" onClick={() => step(-1)}>←</Button>
          <span className="story-position" aria-hidden="true">{selected + 1} / {featuredProjects.length}</span>
          <Button type="button" className="story-button" aria-label="Próximo destaque" onClick={() => step(1)}>→</Button>
        </div>
        <Link className="playground-all" href={'/' + locale + '/projects'}>Ver todos os projetos <span aria-hidden="true">↗</span></Link>
      </div>
    </div>
  </section>;
}
