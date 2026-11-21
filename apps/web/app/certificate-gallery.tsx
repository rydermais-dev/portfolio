'use client';

import { useMemo, useState } from 'react';
import { Button } from '@moduix/react/button';
import { TiltCard } from './tilt-card';
import certificates from '../content/certifications.json';

export function CertificateGallery({ viewLabel }: { viewLabel: string }) {
  const [query, setQuery] = useState('');
  const [issuer, setIssuer] = useState('');
  const issuers = useMemo(() => Array.from(new Set(certificates.map((cert) => cert.emissor))).sort(), []);
  const filtered = certificates.filter((cert) => {
    const text = [cert.title, cert.emissor, ...cert.tags].join(' ').toLocaleLowerCase('pt-BR');
    return (!issuer || cert.emissor === issuer) && text.includes(query.trim().toLocaleLowerCase('pt-BR'));
  });
  return <div className="cert-experience" lang="pt-BR">
    <div className="cert-intro"><div><p className="cert-overline">APRENDIZADO CONTÍNUO</p><h2>Conhecimento que acompanha a jornada.</h2><p>Cada curso representa uma curiosidade, uma habilidade desenvolvida e novas possibilidades para criar.</p></div><div className="cert-summary"><strong>{certificates.length}</strong><span>certificados<br />na coleção</span></div></div>
    <div className="cert-toolbar"><label>Buscar certificado<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Título, instituição ou tema" /></label><label>Instituição<select value={issuer} onChange={(event) => setIssuer(event.target.value)}><option value="">Todas as instituições</option>{issuers.map((name) => <option key={name} value={name}>{name}</option>)}</select></label><p role="status">{filtered.length} {filtered.length === 1 ? 'certificado' : 'certificados'}</p></div>
    {filtered.length ? <div className="cert-gallery">{filtered.map((cert) => <TiltCard className="cert-piece" key={cert.id}>
      <div className="cert-piece-top"><div className="cert-logo">{cert.issuerLogo && <img src={cert.issuerLogo} alt="" loading="lazy" />}</div><div><strong>{cert.emissor}</strong><span>{cert.date}</span></div></div>
      <h3>{cert.title}</h3><div className="cert-piece-bottom">{cert.tags.length > 0 && <div className="certification-tags">{cert.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>}{cert.link.startsWith('https://') && <a href={cert.link}>{viewLabel} ↗</a>}</div>
    </TiltCard>)}</div> : <div className="cert-empty"><p>Nenhum certificado encontrado para essa busca.</p><Button type="button" onClick={() => { setQuery(''); setIssuer(''); }}>Limpar filtros</Button></div>}
  </div>;
}
