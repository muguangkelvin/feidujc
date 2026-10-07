import { getCollection } from 'astro:content';
import { AIRPORTS } from '@/data/airports';
import { getAirportReviewMeta } from '@/data/reviews';

export async function GET() {
  const posts = await getCollection('blog', (post) => !post.data.draft && post.data.category !== 'reviews');

  const articleItems = posts.map((post) => ({
    type: 'article',
    id: post.id,
    title: post.data.title,
    description: post.data.description,
    category: post.data.category,
    tags: post.data.tags,
    url: `/${post.data.category}/${post.id}/`,
  }));

  const airportItems = AIRPORTS.map((airport) => ({
    type: 'airport',
    id: airport.id,
    title: airport.englishName ? `${airport.name} ${airport.englishName}` : airport.name,
    description: airport.description,
    category: '机场',
    tags: [airport.name, airport.englishName, ...airport.aliases].filter(Boolean),
    url: `/airports/${airport.slug}/`,
  }));

  const reviewItems = AIRPORTS.map((airport) => {
    const review = getAirportReviewMeta(airport);
    return {
      type: 'article',
      id: `review-${airport.id}`,
      title: review.title,
      description: review.description,
      category: 'reviews',
      tags: [airport.name, airport.englishName, ...airport.aliases, '机场测评'].filter(Boolean),
      url: `/reviews/${airport.slug}/`,
    };
  });

  const allItems = [...articleItems, ...reviewItems, ...airportItems];

  return new Response(JSON.stringify(allItems), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
