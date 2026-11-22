'use client';

import { Button } from '@moduix/react/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { translate, type Locale } from '../content';
import projects from '../content/projects.json';
import { ProjectCard } from './project-card';

const featuredIds = ['singalong', 'orkuty', 'ryan', 'deltaverse'];
const featuredProjects = featuredIds.map((id) => projects.find((project) => project.id === id)!);

export function Playground({ locale }: { locale: Locale }) {
  const [selected, setSelected] = useState(0);
  const [interacting, setInteracting] = useState(false);
  const [visible, setVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReducedMotion(media.matches);
    const updateVisibility = () => setVisible(!document.hidden);
    updateMotion();
    updateVisibility();
    media.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', updateVisibility);
    return () => {
      media.removeEventListener('change', updateMotion);
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  }, []);

  const running = !interacting && visible && !reducedMotion;
  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => {
      setDirection(1);
      setSelected((index) => (index + 1) % featuredProjects.length);
      setTimerKey((key) => key + 1);
    }, 6500);
    return () => window.clearTimeout(timer);
  }, [running, selected, timerKey]);
  const project = featuredProjects[selected];
  const intro = locale.startsWith('pt')
    ? 'Explore projetos que unem tecnologia, criatividade e experiências pensadas para pessoas.'
    : 'Explore projects that bring together technology, creativity, and experiences designed for people.';
  const select = (index: number) => {
    setDirection(index < selected ? -1 : 1);
    setSelected((index + featuredProjects.length) % featuredProjects.length);
    setTimerKey((key) => key + 1);
  };

  return <section className="playground" aria-labelledby="playground-title">
    <div className="wrap playground-inner">
      <div className="playground-heading"><h2 id="playground-title">{translate(locale, 'html.home.projectsTitle')}<span>.</span></h2><div className="playground-description"><p lang={locale.startsWith('pt') ? 'pt' : 'en'}>{intro}</p></div></div>
      <div className="playground-slide" onPointerEnter={() => setInteracting(true)} onPointerLeave={() => setInteracting(false)} onFocusCapture={() => setInteracting(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false); }}>
        <div className="playground-stage">
          <Button type="button" className="ui-button ui-button--icon-light carousel-arrow carousel-arrow-prev" aria-label="Destaque anterior" onClick={() => select(selected - 1)}>←</Button>
        <div className={'playground-stack ' + (direction === 1 ? 'is-forward' : 'is-backward')}>
          <div className="carousel-depth" key={timerKey} aria-hidden="true"><i /><i /></div>
          <div className="playground-current" key={project.id}>
            <ProjectCard project={project} locale={locale} visitLabel={translate(locale, 'html.home.visit')} />
          </div>
        </div>
        <Button type="button" className="ui-button ui-button--icon-light carousel-arrow carousel-arrow-next" aria-label="Próximo destaque" onClick={() => select(selected + 1)}>→</Button>
        </div>
        <div className="carousel-pagination" aria-label="Escolher destaque">
          {featuredProjects.map((item, index) => <button key={item.id} type="button" className="carousel-pill" aria-label={item.title + ' · ' + (index + 1) + ' / ' + featuredProjects.length} aria-current={selected === index ? 'true' : undefined} onClick={() => select(index)}>
            {selected === index && <span key={timerKey + '-' + String(running)} className={'carousel-progress' + (running ? ' is-running' : '')} />}
          </button>)}
        </div>
        <Link className="ui-button ui-button--outline-light playground-all" href={'/' + locale + '/projects'}>Ver todos os projetos <span aria-hidden="true">↗</span></Link>
      </div>
    </div>
  </section>;
}
