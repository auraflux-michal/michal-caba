/**
 * Global site configuration: navigation, contact & social links, SEO defaults.
 * Update URLs here; components never hard-code them.
 */
/** Substack URLs for Notes, UTM-tagged so traffic from this site is attributable */
export const substackUrl = (path: string) =>
  `https://michalcaba.substack.com${path}?utm_source=michalcaba&utm_medium=referral&utm_campaign=notes`;

export const site = {
  name: 'Michał Caba',
  /** <title> & og:title (~60 chars) */
  title: 'Michał Caba | Strateg marki, projektant i founder Auraflux',
  /** meta description (~155 chars): who, what, proof, hook */
  description:
    'Michał Caba: strateg, projektant marek i założyciel Auraflux. Pomagam firmom odkryć, co w nich wartościowe, i nadać temu strategię, formę i język. #1metrDalej',
  locale: 'pl_PL',
  lang: 'pl',
  themeColor: '#0b0b0b',
  /**
   * Search-engine indexing (launched). Only production deployments are ever indexable:
   * Vercel preview deployments and the GitHub Pages preview always get noindex (src/lib/seo.ts).
   */
  indexable: true,
  author: 'Michał Caba',
  /** Structured data (schema.org Person) + llms.txt: facts AI answer engines can quote */
  person: {
    givenName: 'Michał',
    familyName: 'Caba',
    jobTitles: ['Strateg marki', 'Projektant', 'Founder Auraflux'],
    summary:
      'Michał Caba jest strategiem marki, projektantem i założycielem studia Auraflux (strategia, branding, technologia). Od ponad 15 lat porusza się między strategią, designem, technologią i biznesem. Projektuje marki i pomaga ludziom zamieniać pomysły w rzeczy, które naprawdę istnieją. Jego filozofia #1metrDalej zakłada, że nie trzeba zmieniać całego świata: wystarczy przesunąć coś o jeden metr.',
    knowsAbout: [
      'Strategia marki',
      'Branding',
      'Projektowanie identyfikacji wizualnej',
      'Budowanie firm',
      'Komunikacja marki',
      'Projektowanie doświadczeń cyfrowych',
    ],
    knowsLanguage: ['pl'],
    country: 'PL',
  },
  /** Destination of the "Konsultacja" CTA (external booking: opens in a new tab) */
  consultationUrl: 'https://cal.com/michalcaba',
  auraflux: {
    name: 'Auraflux',
    homepage: 'https://auraflux.pl',
    description:
      'Studio strategii, brandingu i technologii. Pomaga firmom odkryć, co jest w nich wartościowe, i nadaje temu strategię, język, formę i doświadczenie.',
    url: 'https://auraflux.pl/?utm_source=michalcaba&utm_medium=referral&utm_campaign=build_section',
    footerUrl:
      'https://auraflux.pl/?utm_source=michalcaba&utm_medium=referral&utm_campaign=footer_link',
  },
  /** Notes CTA "Archiwum myśli" (all posts) */
  notesArchiveUrl: substackUrl('/archive'),
  socials: [
    { label: 'Linkedin', href: 'https://www.linkedin.com/in/michal-caba/' },
    { label: 'Instagram', href: 'https://www.instagram.com/cabamichal' },
    { label: 'Facebook', href: 'https://www.facebook.com/michalcabaPL/' },
  ],
} as const;

/** Section index: drives the "INDEX +" overlay menu and section anchors. */
export const sections = [
  { id: 'start', label: 'Start' },
  { id: 'czlowiek', label: 'Człowiek' },
  { id: 'role', label: 'Role' },
  { id: 'buduje', label: 'Buduję' },
  { id: 'filozofia', label: 'Filozofia' },
  { id: 'notes', label: 'Notes' },
  { id: 'poczatek', label: 'Początek' },
] as const;

export type SectionId = (typeof sections)[number]['id'];
