'use client';

import { Icon } from './material-icon';
import { useMemo, useState } from 'react';
import { Button } from '@moduix/react/button';
import { TiltCard } from './tilt-card';
import certificates from '../content/certifications.json';
import { LogoCloud } from './logo-cloud';

export function CertificateGallery({ viewLabel }: { viewLabel: string }) {
  const [query, setQuery] = useState('');
  const [issuer, setIssuer] = useState('');
  const issuers = useMemo(() => Array.from(new Set(certificates.map((cert) => cert.emissor))).sort(), []);
  const years = certificates.map((cert) => Number(cert.date.match(/\b\d{4}\b/)?.[0])).filter(Boolean);
  const filtered = certificates.filter((cert) => {
    const text = [cert.title, cert.emissor, ...cert.tags].join(' ').toLocaleLowerCase('pt-BR');
    return (!issuer || cert.emissor === issuer) && text.includes(query.trim().toLocaleLowerCase('pt-BR'));
  });
  const reset = () => { setQuery(''); setIssuer(''); };
  const hasFilters = Boolean(query || issuer);

  return <div className="cert-experience" lang="pt-BR">
    <div className="cert-intro"><div className="cert-intro-copy"><h2>O que aprendi<br /><span>pelo caminho.</span></h2><p>De programação e design à segurança da informação, esta coleção acompanha os assuntos que fui explorando ao longo da minha trajetória.</p><a href="#certificados">Explorar a coleção ↘</a></div><div className="cert-intro-aside"><div className="cert-record"><span>COLEÇÃO</span><strong>{certificates.length}</strong><span>CERTIFICADOS</span></div><div className="cert-record-meta">{years.length > 0 && <span>{Math.min(...years)} — {Math.max(...years)}</span>}<span>{issuers.length} INSTITUIÇÕES</span></div></div></div>
    <LogoCloud selected={issuer} onSelect={(name) => setIssuer(name === issuer ? '' : name)} />
    <section className="cert-collection" id="certificados" aria-labelledby="cert-collection-title">
      <div className="cert-collection-heading"><div><span className="cert-collection-eyebrow">APRENDIZADO CONTÍNUO</span><h2 id="cert-collection-title">Explore a coleção<span>.</span></h2><p>Encontre um curso pelo assunto ou pela instituição.</p></div><div className="cert-collection-count" role="status" aria-live="polite"><strong>{filtered.length}</strong><span>{filtered.length === 1 ? 'certificado encontrado' : 'certificados encontrados'}</span></div></div>
      <div className="cert-toolbar">
        <label className="cert-search">Buscar por palavra-chave<span className="cert-input-wrap"><Icon name="search" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ex.: React, segurança, design" /></span></label>
        <label className="cert-issuer">Instituição<select value={issuer} onChange={(event) => setIssuer(event.target.value)}><option value="">Todas as instituições</option>{issuers.map((name) => <option key={name} value={name}>{name}</option>)}</select></label>
        {hasFilters && <Button type="button" className="ui-button ui-button--outline cert-clear" onClick={reset}><Icon name="close" /> Limpar filtros</Button>}
      </div>
      {issuer && <p className="cert-active-filter">Exibindo certificados de <strong>{issuer}</strong>. <button type="button" onClick={() => setIssuer('')}>Ver todas</button></p>}
      {filtered.length ? <div className="cert-gallery">{filtered.map((cert) => <TiltCard className="cert-piece" key={cert.id}>
        <div className="cert-piece-top"><div className="cert-logo">{cert.issuerLogo && <img src={cert.issuerLogo.replace('/logos/', '/transparent/').replace(/\.png$/, '.webp')} alt="" loading="lazy" />}</div><div className="cert-issuer-meta"><span>EMITIDO POR</span><strong>{cert.emissor}</strong></div><span className="cert-piece-mark" aria-hidden="true"><Icon name="workspace_premium" /></span></div>
        <div className="cert-piece-title"><span>FORMAÇÃO E CERTIFICAÇÃO</span><h3>{cert.title}</h3></div>
        <div className="cert-piece-bottom"><div className="cert-piece-date"><span>EMISSÃO</span><strong>{cert.date}</strong></div>{cert.tags.length > 0 && <div className="certification-tags">{cert.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>}{cert.link.startsWith('https://') && <a href={cert.link}>{viewLabel} <Icon name="arrow_outward" /></a>}</div>
      </TiltCard>)}</div> : <div className="cert-empty"><Icon name="search" /><h3>Nenhum certificado encontrado</h3><p>Experimente outra palavra ou escolha outra instituição.</p><Button type="button" className="ui-button ui-button--outline" onClick={reset}>Limpar filtros</Button></div>}
    </section>
  </div>;
}
