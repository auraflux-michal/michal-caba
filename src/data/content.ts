/**
 * Page copy & repeatable content. Kept out of components so sections stay presentational.
 */

/** Hero headline, 3rd line: rotates in this order, then loops (first = static / no-JS fallback). */
export const heroPhrases = ['W ludziach', 'W firmach', 'W pomysłach'] as const;

export interface Role {
  number: string;
  title: string;
  description: string;
}

export const roles: Role[] = [
  {
    number: '01',
    title: 'Strateg',
    description: 'Patrzę z dystansu, łączę kropki i szukam tego, co naprawdę ma znaczenie.',
  },
  {
    number: '02',
    title: 'Projektant',
    description: 'Upraszczam złożone rzeczy i nadaję pomysłom formę, która wydaje się oczywista.',
  },
  {
    number: '03',
    title: 'Founder',
    description:
      'Buduję, żeby sprawdzić, co się stanie, kiedy dobry pomysł spotka się z rzeczywistością.',
  },
];

/** Notes link to the Substack posts. UTM tags attribute traffic from this site. */
const substack = (slug: string) =>
  `https://michalcaba.substack.com/p/${slug}?utm_source=michalcaba&utm_medium=referral&utm_campaign=notes`;

export interface Note {
  number: string;
  title: string;
  /** Shown as e.g. "4 min" (~200 words per minute) */
  readingTime: string;
  /** Article URL: rows render as links (new tab) only when provided. */
  href?: string;
}

export const notes: Note[] = [
  {
    number: '_001',
    title: 'W najlepszym towarzystwie na świecie',
    // TODO: verify reading time against the post (Substack is unreachable from the build env)
    readingTime: '4 min',
    href: substack('w-najlepszym-towarzystwie-na-swiecie'),
  },
  {
    number: '_002',
    title: 'Spalić analizę',
    // TODO: verify reading time against the post
    readingTime: '4 min',
    href: substack('spalic-analize'),
  },
  {
    number: '_003',
    title: '108 CV, 108 mantr i jeden krok w przepaść',
    // TODO: verify reading time against the post
    readingTime: '4 min',
    href: substack('108-cv-108-mantr-i-jeden-krok-w-przepasc'),
  },
];
