import { https } from '../../../content';

export async function GET() {
  const endpoint = process.env.API_INTERNAL_URL;
  if (!endpoint) return Response.json([]);
  try {
    const response = await fetch(new URL('/v1/news', endpoint), { signal: AbortSignal.timeout(2500), cache: 'no-store' });
    if (!response.ok) return new Response(null, { status: 503 });
    const items = await response.json() as { url: string }[];
    return Response.json(items.filter((item) => https(item.url)), {
      headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=120' },
    });
  } catch {
    return new Response(null, { status: 503 });
  }
}
