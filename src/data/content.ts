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

export interface Note {
  number: string;
  title: string;
  readingTime: string;
  /** Optional article URL: rows render as links only when provided. */
  href?: string;
}

export const notes: Note[] = [
  { number: '_001', title: 'Zakochany w potencjałach', readingTime: '4 min' },
  {
    number: '_002',
    title: 'To, co najbardziej chcemy zmienić u innych, potrafi powiedzieć zaskakująco dużo o nas',
    readingTime: '4 min',
  },
  {
    number: '_003',
    title:
      'Czasami nie potrzebujesz planu na pięć lat. Potrzebujesz wiedzieć, jaki jest następny ruch.',
    readingTime: '4 min',
  },
];
