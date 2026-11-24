'use client';

import { useEffect, useState } from 'react';
import { withPortfolioSource } from './outbound-link';

type NewsItem = { slug: string; title: string; summary: string; url: string };

export function News() {
  const [entries, setEntries] = useState<NewsItem[]>([]);
  useEffect(() => {
    const request = new AbortController();
    fetch('/api/news', { signal: request.signal })
      .then((response) => response.ok ? response.json() : [])
      .then(setEntries)
      .catch(() => {});
    return () => request.abort();
  }, []);

  if (!entries.length) return null;
  return <div className="cards section">{entries.map((item) => <article className="card" key={item.slug} lang="pt-BR">
    <h3><a href={withPortfolioSource(item.url)}>{item.title}</a></h3><p>{item.summary}</p>
  </article>)}</div>;
}
