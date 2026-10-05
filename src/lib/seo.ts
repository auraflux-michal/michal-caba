/**
 * SEO / GEO helpers: schema.org graph, absolute URLs and the robots directive.
 * Facts come from src/data/*, so page copy, structured data and llms.txt never drift apart.
 */
import { site } from '@/data/site';
import { roles } from '@/data/content';

/** Absolute URL that respects `site` + `base` (works on Vercel and the GitHub Pages preview) */
export function absoluteUrl(path: string, siteUrl: URL | undefined): string {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
  return new URL(`${base}${path.replace(/^\//, '')}`, siteUrl).href;
}

/** Root-relative asset path that respects `base` (for icons etc. that must load on any host) */
export function assetPath(path: string): string {
  return `${import.meta.env.BASE_URL.replace(/\/?$/, '/')}${path.replace(/^\//, '')}`;
}

/**
 * Link to a home-page section: a bare `#id` on the home page (smooth in-page scroll),
 * `/#id` from subpages (e.g. /lustro), so the shared header/menu work everywhere.
 */
export function sectionHref(id: string, currentPath: string): string {
  const home = assetPath('/');
  const onHome = currentPath === home || currentPath === `${home}index.html`;
  return onHome ? `#${id}` : `${home}#${id}`;
}

/**
 * Robots directive. Indexable only when `site.indexable` is on AND this is a production build:
 * Vercel preview/branch deployments (VERCEL_ENV=preview|development) and the GitHub Pages
 * preview (PUBLIC_PREVIEW) are always noindex, so Google never sees duplicate copies.
 */
export function robotsDirective(): string {
  const isPreview =
    import.meta.env.PUBLIC_PREVIEW === 'true' ||
    (process.env.VERCEL_ENV !== undefined && process.env.VERCEL_ENV !== 'production');
  return isPreview || !site.indexable
    ? 'noindex, nofollow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
}

interface GraphInput {
  canonical: string;
  homepage: string;
  /** Social card (og.png) */
  imageUrl: string;
  imageCaption?: string;
  /** The page itself: the home ProfilePage (default) or a subpage WebPage (e.g. /lustro) */
  page?: { type: 'ProfilePage' | 'WebPage'; name: string; description: string };
  /** Real portrait photo for the Person entity */
  portraitUrl: string;
}

/** One connected @graph: WebSite → ProfilePage → Person ↔ Organization (Auraflux) */
export function buildJsonLd({
  canonical,
  homepage,
  imageUrl,
  imageCaption = `${site.name}: Widzę potencjał w ludziach`,
  portraitUrl,
  page = { type: 'ProfilePage', name: site.title, description: site.description },
}: GraphInput) {
  const isProfile = page.type === 'ProfilePage';
  const ids = {
    website: `${homepage}#website`,
    page: `${canonical}#webpage`,
    person: `${homepage}#person`,
    org: `${site.auraflux.homepage}/#organization`,
    image: `${canonical}#primaryimage`,
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': ids.website,
        url: homepage,
        name: site.name,
        description: site.description,
        inLanguage: 'pl-PL',
        publisher: { '@id': ids.person },
      },
      {
        '@type': page.type,
        '@id': ids.page,
        url: canonical,
        name: page.name,
        description: page.description,
        inLanguage: 'pl-PL',
        isPartOf: { '@id': ids.website },
        ...(isProfile
          ? { about: { '@id': ids.person }, mainEntity: { '@id': ids.person } }
          : { author: { '@id': ids.person } }),
        primaryImageOfPage: { '@id': ids.image },
      },
      {
        '@type': 'ImageObject',
        '@id': ids.image,
        url: imageUrl,
        contentUrl: imageUrl,
        width: 1200,
        height: 630,
        caption: imageCaption,
      },
      {
        '@type': 'Person',
        '@id': ids.person,
        name: site.name,
        givenName: site.person.givenName,
        familyName: site.person.familyName,
        url: homepage,
        image: {
          '@type': 'ImageObject',
          url: portraitUrl,
          caption: `Portret: ${site.name}`,
        },
        jobTitle: [...site.person.jobTitles],
        description: site.person.summary,
        knowsAbout: [...site.person.knowsAbout],
        knowsLanguage: [...site.person.knowsLanguage],
        nationality: { '@type': 'Country', name: site.person.country },
        hasOccupation: roles.map((role) => ({
          '@type': 'Occupation',
          name: role.title,
          description: role.description,
        })),
        worksFor: { '@id': ids.org },
        sameAs: [...site.socials.map((social) => social.href), site.consultationUrl],
      },
      {
        '@type': 'Organization',
        '@id': ids.org,
        name: site.auraflux.name,
        url: site.auraflux.homepage,
        description: site.auraflux.description,
        founder: { '@id': ids.person },
      },
    ],
  };
}
