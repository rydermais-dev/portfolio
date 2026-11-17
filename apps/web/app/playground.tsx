'use client';

import { Button } from '@moduix/react/button';
import Link from 'next/link';
import { useState } from 'react';

const stories = [
  { tag: '01 / SOFTWARE HOUSE', title: 'CodeHouse', text: 'Desenvolvimento de produtos digitais, design de experiência e entrega de projetos de ponta a ponta.', href: 'https://codehouse.rydermais.com/', action: 'Conhecer a CodeHouse', symbol: '01' },
  { tag: '02 / KARAOKÊ', title: 'SingAlong!', text: 'Minha paixão por jogos musicais encontrou a programação: um projeto de karaokê para cantar junto.', href: 'https://singalong.rydermais.com/app', action: 'Abrir o SingAlong!', symbol: '02' },
  { tag: '03 / PROJETOS PESSOAIS', title: 'RyderMais', text: 'Um espaço para reunir projetos e experimentar com a web, design e novas tecnologias.', href: 'https://rydermais.com/', action: 'Visitar a RyderMais', symbol: '03' },
];

export function Playground({ locale }: { locale: string }) {
  const [selected, setSelected] = useState(0);
  const story = stories[selected];
  return <section className="playground" lang="pt-BR" aria-labelledby="playground-title">
    <div className="wrap playground-inner">
      <div className="playground-heading"><span className="eyebrow">PROJETOS PESSOAIS / 01—03</span><h2 id="playground-title">Projetos que fazem parte da minha história<span>.</span></h2><p>Da música ao desenvolvimento de produtos: alguns projetos que contam um pouco sobre mim.</p></div>
      <div className="story-panel"><div className="story-top"><span>{story.tag}</span><span aria-hidden="true">{story.symbol}</span></div><h3>{story.title}</h3><p>{story.text}</p><a href={story.href}>{story.action} <span aria-hidden="true">↗</span></a>
        <div className="story-controls" aria-label="Escolha uma experiência">{stories.map((item, index) => <Button key={item.tag} type="button" className="story-button" aria-label={item.title} aria-pressed={selected === index} onClick={() => setSelected(index)}>{String(index + 1).padStart(2, '0')}</Button>)}</div>
      </div>
      <Link className="playground-all" href={'/' + locale + '/projects'}>Ver todos os projetos <span aria-hidden="true">↗</span></Link>
    </div>
  </section>;
}

