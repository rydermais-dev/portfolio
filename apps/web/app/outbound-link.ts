export function withPortfolioSource(href: string): string {
  if (!/^https?:\/\//i.test(href)) return href;

  try {
    const url = new URL(href);
    url.searchParams.set('utm_source', 'portfolio_wellnas');
    return url.href;
  } catch {
    return href;
  }
}
