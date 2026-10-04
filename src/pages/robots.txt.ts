/**
 * robots.txt: crawling stays allowed even pre-launch, so crawlers can read the noindex
 * (meta robots + X-Robots-Tag). AI crawlers are explicitly welcome (GEO).
 */
import type { APIRoute } from 'astro';
import { absoluteUrl } from '@/lib/seo';

const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'PerplexityBot',
  'Google-Extended',
  'Applebot-Extended',
];

export const GET: APIRoute = ({ site }) =>
  new Response(
    [
      'User-agent: *',
      'Allow: /',
      '',
      ...AI_CRAWLERS.flatMap((bot) => [`User-agent: ${bot}`, 'Allow: /', '']),
      `Sitemap: ${absoluteUrl('/sitemap.xml', site)}`,
      '',
    ].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
