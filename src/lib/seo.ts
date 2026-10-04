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

/** Preview builds are never indexed; production only once `site.indexable` is enabled */
export function robotsDirective(): string {
  const isPreview = import.meta.env.PUBLIC_PREVIEW === 'true';
  return isPreview || !site.indexable
    ? 'noindex, nofollow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
}

interface GraphInput {
  canonical: string;
  homepage: string;
  imageUrl: string;
}

/** One connected @graph: WebSite → ProfilePage → Person ↔ Organization (Auraflux) */
export function buildJsonLd({ canonical, homepage, imageUrl }: GraphInput) {
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
        '@type': 'ProfilePage',
        '@id': ids.page,
        url: canonical,
        name: site.title,
        description: site.description,
        inLanguage: 'pl-PL',
        isPartOf: { '@id': ids.website },
        about: { '@id': ids.person },
        mainEntity: { '@id': ids.person },
        primaryImageOfPage: { '@id': ids.image },
      },
      {
        '@type': 'ImageObject',
        '@id': ids.image,
        url: imageUrl,
        contentUrl: imageUrl,
        width: 1200,
        height: 630,
        caption: `Portret: ${site.name}`,
      },
      {
        '@type': 'Person',
        '@id': ids.person,
        name: site.name,
        givenName: site.person.givenName,
        familyName: site.person.familyName,
        url: homepage,
        image: { '@id': ids.image },
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
