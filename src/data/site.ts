/**
 * Global site configuration — navigation, contact & social links, SEO defaults.
 * Update URLs here; components never hard-code them.
 */
export const site = {
  name: 'Michał Caba',
  title: 'Michał Caba — Founder / Strateg / Projektant',
  description:
    'Widzę potencjał w ludziach. Projektuję marki, buduję firmy i upraszczam trudne pytania. #1metrDalej',
  locale: 'pl_PL',
  lang: 'pl',
  themeColor: '#0b0b0b',
  /**
   * Search-engine indexing. Keep `false` until launch — when flipping to `true`, also remove
   * the X-Robots-Tag header in vercel.json.
   */
  indexable: false,
  author: 'Michał Caba',
  /** Destination of the "Konsultacja" CTA */
  consultationUrl: '#poczatek',
  auraflux: {
    name: 'Auraflux',
    url: 'https://auraflux.pl/?utm_source=michalcaba&utm_medium=referral&utm_campaign=build_section',
    footerUrl:
      'https://auraflux.pl/?utm_source=badzblizej&utm_medium=referral&utm_campaign=footer_link',
  },
  socials: [
    { label: 'Linkedin', href: 'https://www.linkedin.com/in/michalcaba/' },
    { label: 'Instagram', href: 'https://www.instagram.com/michalcaba/' },
    { label: 'Facebook', href: 'https://www.facebook.com/michalcaba/' },
  ],
} as const;

/** Section index — drives the "INDEX +" overlay menu and section anchors. */
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
