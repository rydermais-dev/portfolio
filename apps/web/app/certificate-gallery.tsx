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
  return <div className="cert-experience" lang="pt-BR">
    <div className="cert-intro"><div className="cert-intro-copy"><h2>O que aprendi<br /><span>pelo caminho.</span></h2><p>De programação e design à segurança da informação, esta coleção acompanha os assuntos que fui explorando ao longo da minha trajetória.</p><a href="#certificados">Explorar a coleção ↘</a></div><div className="cert-intro-aside"><div className="cert-record"><span>COLEÇÃO</span><strong>{certificates.length}</strong><span>CERTIFICADOS</span></div><div className="cert-record-meta">{years.length > 0 && <span>{Math.min(...years)} — {Math.max(...years)}</span>}<span>{issuers.length} INSTITUIÇÕES</span></div></div></div>
    <LogoCloud selected={issuer} onSelect={(name) => { setIssuer(name === issuer ? '' : name); setQuery(''); }} />
    <div className="cert-toolbar" id="certificados"><label>Buscar certificado<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Título, instituição ou tema" /></label><label>Instituição<select value={issuer} onChange={(event) => setIssuer(event.target.value)}><option value="">Todas as instituições</option>{issuers.map((name) => <option key={name} value={name}>{name}</option>)}</select></label><p role="status">{filtered.length} {filtered.length === 1 ? 'certificado' : 'certificados'}</p></div>
    {filtered.length ? <div className="cert-gallery">{filtered.map((cert) => <TiltCard className="cert-piece" key={cert.id}>
      <div className="cert-piece-top"><div className="cert-logo">{cert.issuerLogo && <img src={cert.issuerLogo} alt="" loading="lazy" />}</div><div><strong>{cert.emissor}</strong><span>{cert.date}</span></div></div>
      <div className="cert-piece-title"><span>CERTIFICADO</span><h3>{cert.title}</h3></div><div className="cert-piece-bottom">{cert.tags.length > 0 && <div className="certification-tags">{cert.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>}{cert.link.startsWith('https://') && <a href={cert.link}>{viewLabel} <Icon name="arrow_outward" /></a>}</div>
    </TiltCard>)}</div> : <div className="cert-empty"><p>Nenhum certificado encontrado para essa busca.</p><Button type="button" onClick={() => { setQuery(''); setIssuer(''); }}>Limpar filtros</Button></div>}
  </div>;
}
