/**
 * Global site configuration: navigation, contact & social links, SEO defaults.
 * Update URLs here; components never hard-code them.
 */
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
   * Search-engine indexing. Keep `false` until launch: when flipping to `true`, also remove
   * the X-Robots-Tag header in vercel.json.
   */
  indexable: false,
  author: 'Michał Caba',
  /** Structured data (schema.org Person) + llms.txt: facts AI answer engines can quote */
  person: {
    givenName: 'Michał',
    familyName: 'Caba',
    jobTitles: ['Strateg marki', 'Projektant', 'Founder Auraflux'],
    summary:
      'Michał Caba jest strategiem marki, projektantem i założycielem studia Auraflux (strategia, branding, technologia). Tworzy rzeczy na styku ludzkiej intuicji i technicznej precyzji. Jego filozofia #1metrDalej zakłada, że nie trzeba zmieniać całego świata: wystarczy przesunąć coś o jeden metr.',
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
