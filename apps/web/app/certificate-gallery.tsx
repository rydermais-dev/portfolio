'use client';

import { Icon } from './material-icon';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Button } from '@moduix/react/button';
import { TiltCard } from './tilt-card';
import { LogoCloud } from './logo-cloud';
import { https, type Locale } from '../content';
import { withPortfolioSource } from './outbound-link';
import { areaLabel, areas, certificateCatalog, certificateTechnologies, searchCertificates } from '../content/certificate-search';
import { certificateLabels, diplomaLabels, diplomaShareLabels } from '../content/certificate-labels';

const issuers = [...new Set(certificateCatalog.map((cert) => cert.emissor))].sort();
const years = certificateCatalog.map((cert) => Number(cert.date.match(/\b\d{4}\b/)?.[0])).filter(Boolean);
const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

function logoSource(path: string) {
  return path.replace('/logos/', '/transparent/').replace(/\.png$/, '.webp');
}

function displayDate(value: string, locale: Locale) {
  const [month, year] = value.split(' de ');
  const monthIndex = months.indexOf(month);
  if (monthIndex === -1 || !/^\d{4}$/.test(year ?? '')) return value;
  return new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric', timeZone: 'UTC' })
    .format(Date.UTC(Number(year), monthIndex, 1));
}

function FacetSelect({ label, options, selected, onChange }: {
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (selection: string[]) => void;
}) {
  return <details className="cert-facet" name="certificate-filters" onKeyDown={(event) => {
    if (event.key !== 'Escape' || !event.currentTarget.open) return;
    event.currentTarget.open = false;
    event.currentTarget.querySelector('summary')?.focus();
  }}>
    <summary className="ui-button ui-button--outline">
      {label}
      {selected.length > 0 && <span className="cert-facet-count">{selected.length}</span>}
      <Icon name="expand_more" />
    </summary>
    <fieldset className="cert-facet-options" aria-label={label}>
      {options.map((option) => <label key={option.value}>
        <input type="checkbox" checked={selected.includes(option.value)} onChange={(event) => {
          onChange(event.target.checked ? [...selected, option.value] : selected.filter((value) => value !== option.value));
        }} />
        {option.label}
      </label>)}
    </fieldset>
  </details>;
}

export function CertificateGallery({ locale }: { locale: Locale }) {
  const [query, setQuery] = useState('');
  const [issuer, setIssuer] = useState('');
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [areasLabel, technologiesLabel, searchLabel, placeholder, issuerLabel, allIssuers, clearLabel,
    topicsLabel, dateLabel, collectionTitle, intro, emptyTitle, emptyDescription, resultsLabel] = certificateLabels[locale];
  const [view, close, record, recipient, issuedBy, credentialLabel, verificationLabel] = diplomaLabels[locale];
  const [activeCertificate, setActiveCertificate] = useState<(typeof certificateCatalog)[number] | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const verificationLink = https(activeCertificate?.link);

  const [copyLabel, copiedLabel] = diplomaShareLabels[locale];
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'manual'>('idle');
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    function syncFromUrl() {
      const id = new URL(window.location.href).searchParams.get('certificado');
      const certificate = certificateCatalog.find((item) => String(item.id) === id) ?? null;
      setActiveCertificate(certificate);
      if (!certificate) dialog.current?.close();
    }
    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  useEffect(() => {
    if (activeCertificate && dialog.current && !dialog.current.open) dialog.current.showModal();
  }, [activeCertificate]);

  function showCertificate(certificate: (typeof certificateCatalog)[number]) {
    const url = new URL(window.location.href);
    url.searchParams.set('certificado', String(certificate.id));
    window.history.replaceState(null, '', url);
    setActiveCertificate(certificate);
  }

  function clearCertificate() {
    const url = new URL(window.location.href);
    if (url.searchParams.has('certificado')) {
      url.searchParams.delete('certificado');
      window.history.replaceState(null, '', url);
    }
    setActiveCertificate(null);
    setCopyState('idle');
  }

  async function copyCertificateLink() {
    if (!activeCertificate) return;
    const url = new URL(window.location.href);
    url.searchParams.set('certificado', String(activeCertificate.id));
    url.hash = '';
    try {
      await navigator.clipboard.writeText(url.href);
      setCopyState('copied');
    } catch {
      setShareUrl(url.href);
      setCopyState('manual');
    }
  }
  const filtered = searchCertificates(query, issuer, selectedAreas, selectedTechnologies);
  const areaOptions = (Object.keys(areas) as (keyof typeof areas)[])
    .map((value) => ({ value, label: areaLabel(value, locale) }))
    .sort((a, b) => a.label.localeCompare(b.label, locale));
  const technologyOptions = certificateTechnologies.map((name) => ({ value: name, label: name }));
  const reset = () => {
    setQuery('');
    setIssuer('');
    setSelectedAreas([]);
    setSelectedTechnologies([]);
  };
  const hasFilters = Boolean(query || issuer || selectedAreas.length || selectedTechnologies.length);
  return <div className="cert-experience">
    <div className="cert-intro" lang="pt-BR"><div className="cert-intro-copy"><h2>O que aprendi<br /><span>pelo caminho.</span></h2><p>De programação e design à segurança da informação, esta coleção acompanha os assuntos que fui explorando ao longo da minha trajetória.</p><a href="#certificados">Explorar a coleção ↘</a></div><div className="cert-intro-aside"><div className="cert-record"><span>COLEÇÃO</span><strong>{certificateCatalog.length}</strong><span>CERTIFICADOS</span></div><div className="cert-record-meta">{years.length > 0 && <span>{Math.min(...years)} — {Math.max(...years)}</span>}<span>{issuers.length} INSTITUIÇÕES</span></div></div></div>
    <LogoCloud selected={issuer} onSelect={(name) => setIssuer(name === issuer ? '' : name)} />
    <section className="cert-collection" id="certificados" aria-labelledby="cert-collection-title">
      <div className="cert-collection-heading">
        <div><h2 id="cert-collection-title">{collectionTitle}<span>.</span></h2><p>{intro}</p></div>
        <div className="cert-collection-count" role="status"><span>{resultsLabel}</span><strong>{filtered.length}</strong></div>
      </div>
      <div className="cert-toolbar">
        <label className="cert-search">
          {searchLabel}
          <span className="cert-input-wrap"><Icon name="search" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={placeholder} /></span>
        </label>
        <label className="cert-issuer">
          {issuerLabel}
          <select value={issuer} onChange={(event) => setIssuer(event.target.value)}>
            <option value="">{allIssuers}</option>
            {issuers.map((name) => <option key={name} value={name}>{name}</option>)}
          </select>
        </label>
        <div className="cert-facets">
          <FacetSelect label={areasLabel} options={areaOptions} selected={selectedAreas} onChange={setSelectedAreas} />
          <FacetSelect label={technologiesLabel} options={technologyOptions} selected={selectedTechnologies} onChange={setSelectedTechnologies} />
          {hasFilters && <Button type="button" className="ui-button ui-button--outline cert-clear" onClick={reset}><Icon name="close" /> {clearLabel}</Button>}
        </div>
      </div>
      {filtered.length ? <div className="cert-gallery">{filtered.map((cert) => <TiltCard className="cert-piece" key={cert.id}>
        <header className="cert-piece-top">
          <div className="cert-logo">
            {cert.issuerLogo ? <img src={logoSource(cert.issuerLogo)} alt="" loading="lazy" /> : <Icon name="workspace_premium" />}
          </div>
          <div className="cert-issuer-meta"><strong>{cert.emissor}</strong></div>
          <span className="cert-piece-mark"><Icon name="workspace_premium" /></span>
        </header>
        <h3>{cert.title}</h3>
        <div className="cert-piece-topics">
          <span className="cert-field-label">{topicsLabel}</span>
          <ul className="certification-tags">
            {cert.areas.map((area) => <li key={area}><span>{areaLabel(area, locale)}</span></li>)}
            {cert.technologies.map((technology) => <li key={technology}><span className="cert-tech-tag">{technology}</span></li>)}
          </ul>
        </div>
        <footer className="cert-piece-bottom">
          <div className="cert-piece-date">
            <Icon name="calendar_today" />
            <div><span className="cert-field-label">{dateLabel}</span><strong>{displayDate(cert.date, locale)}</strong></div>
          </div>
          <Button type="button" className="ui-button ui-button--outline cert-view" aria-haspopup="dialog" aria-label={view + ': ' + cert.title} onClick={() => showCertificate(cert)}>
            {view} <Icon name="arrow_outward" />
          </Button>
        </footer>
      </TiltCard>)}</div> : <div className="cert-empty"><Icon name="search" /><h3>{emptyTitle}</h3><p>{emptyDescription}</p><Button type="button" className="ui-button ui-button--outline" onClick={reset}>{clearLabel}</Button></div>}
    </section>
    <dialog ref={dialog} className="cert-dialog" aria-labelledby="cert-dialog-title" onClose={clearCertificate} onClick={(event) => {
      if (event.target === event.currentTarget) event.currentTarget.close();
    }}>
      <div className="cert-diploma" style={{ "--diploma-brand": activeCertificate?.issuerColor } as CSSProperties}>
        <Button type="button" autoFocus className="ui-button ui-button--outline cert-dialog-close" aria-label={close} onClick={() => dialog.current?.close()}><Icon name="close" /></Button>
        {activeCertificate && <>
          <header className="cert-diploma-brand">
            <div className="cert-diploma-issuer">
              {activeCertificate.issuerLogo && <span className="cert-logo cert-diploma-logo"><img src={logoSource(activeCertificate.issuerLogo)} alt="" /></span>}
              <div><span>{issuedBy}</span><strong>{activeCertificate.emissor}</strong></div>
            </div>
          </header>
          <div className="cert-diploma-heading">
            <p>{record}</p>
            <h2 id="cert-dialog-title">{activeCertificate.title}</h2>
            <p className="cert-diploma-recipient">{recipient} <strong>Wellington do Nascimento</strong></p>
          </div>
          <dl className="cert-diploma-facts">
            <div>
              <dt>{dateLabel}</dt>
              <dd>{displayDate(activeCertificate.date, locale)}</dd>
            </div>
            {activeCertificate.credentialId && <div className="cert-diploma-id">
              <dt>{credentialLabel}</dt>
              <dd><code>{activeCertificate.credentialId}</code></dd>
            </div>}
            <div className="cert-diploma-topics">
              <dt>{topicsLabel}</dt>
              <dd>{[...activeCertificate.areas.map((area) => areaLabel(area, locale)), ...activeCertificate.technologies].join(' · ')}</dd>
            </div>
          </dl>
          <div className="cert-diploma-actions">
            {verificationLink && <a className="ui-button cert-diploma-link" href={withPortfolioSource(verificationLink)}>{verificationLabel} <Icon name="arrow_outward" /></a>}
            <Button type="button" className="ui-button ui-button--outline cert-copy-link" onClick={copyCertificateLink}>
              <Icon name="link" /> {copyLabel}
            </Button>
            {copyState === 'copied' && <span className="cert-copy-status" role="status">{copiedLabel}</span>}
            {copyState === 'manual' && <input className="cert-share-url" readOnly value={shareUrl} aria-label={copyLabel} onFocus={(event) => event.currentTarget.select()} />}
          </div>
        </>}
      </div>
    </dialog>
  </div>;
}
