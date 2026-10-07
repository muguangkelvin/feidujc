import { getCollection } from 'astro:content';
import { AIRPORTS } from '@/data/airports';
import { SITE } from '@/config/site';

const STATIC_PATHS = [
  '/',
  '/airports/',
  '/ranking/',
  '/reviews/',
  '/guides/',
  '/clients/',
  '/blog/',
  '/tags/',
  '/about/',
  '/affiliate/',
  '/disclaimer/',
  '/privacy/',
  '/profile/',
] as const;

const articlePath = (category: string, id: string) => {
  if (category === 'guides') return `/guides/${id}/`;
  if (category === 'clients') return `/clients/${id}/`;
  return `/blog/${id}/`;
};

const escapeXml = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

export async function GET() {
  const posts = await getCollection('blog', (post) => !post.data.draft && post.data.category !== 'reviews');
  const tags = [...new Set(posts.flatMap((post) => post.data.tags))];
  const datedUrls = [
    ...AIRPORTS.flatMap((airport) => [
      { path: `/airports/${airport.slug}/`, lastmod: airport.lastVerified },
      { path: `/reviews/${airport.slug}/`, lastmod: airport.lastVerified },
    ]),
    ...posts.map((post) => ({ path: articlePath(post.data.category, post.id), lastmod: post.data.updated.toISOString().slice(0, 10) })),
  ];
  const paths: Array<{ path: string; lastmod?: string }> = [
    ...STATIC_PATHS.map((path) => ({ path })),
    ...datedUrls,
    ...tags.map((tag) => ({ path: `/tags/${encodeURIComponent(tag)}/` })),
  ];
  const unique = [...new Map(paths.map((item) => [item.path, item])).values()];
  const urls = unique.map(({ path, lastmod }) => {
    const loc = escapeXml(`${SITE.url}${path}`);
    return `  <url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`;
  }).join('\n');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
