/**
 * Page copy & repeatable content. Kept out of components so sections stay presentational.
 */
import { site, substackUrl } from './site';

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
    description: 'Łączę fakty, zadaję właściwe pytania i pomagam odnaleźć kierunek, który ma sens.',
  },
  {
    number: '02',
    title: 'Projektant',
    description: 'Zamieniam idee w doświadczenia, marki i rozwiązania, które ludzie rozumieją.',
  },
  {
    number: '03',
    title: 'Founder',
    description:
      'Buduję, żeby sprawdzić, co się stanie, kiedy dobry pomysł spotka się z rzeczywistością.',
  },
];

const substack = (slug: string) => substackUrl(`/p/${slug}`);

/** Reading speed for Polish prose; rounded up, minimum 1 minute */
const WORDS_PER_MINUTE = 200;
const readingTime = (words: number) => `${Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))} min`;

export interface Note {
  number: string;
  title: string;
  /** Derived from the post's word count, e.g. "3 min" */
  readingTime: string;
  /** Article URL: rows render as links (new tab) only when provided. */
  href?: string;
}

export const notes: Note[] = [
  {
    number: '_001',
    title: 'W najlepszym towarzystwie na świecie',
    readingTime: readingTime(564), // 564 words
    href: substack('w-najlepszym-towarzystwie-na-swiecie'),
  },
  {
    number: '_002',
    title: 'Spalić analizę',
    readingTime: readingTime(95), // 95 words
    href: substack('spalic-analize'),
  },
  {
    number: '_003',
    title: '108 CV, 108 mantr i jeden krok w przepaść',
    readingTime: readingTime(238), // 238 words
    href: substack('108-cv-108-mantr-i-jeden-krok-w-przepasc'),
  },
];

/** Offer module "Mapa Kierunku™" (sections/offer/*), between "Buduję" and "Filozofia". */
export const offer = {
  kicker: '04 / Warsztat strategiczny',
  name: ['Mapa', 'Kierunku'],
  tagline: 'Jedna marka. Jasny kierunek.',
  format: 'Warsztat strategiczny 1:1',
  price: '2500',
  currency: 'PLN',
  eyebrow: 'Mniej zgadywania. Więcej decyzji.',
  headline: ['Nie wiesz,', 'co dalej'],
  headlineAccent: 'z Twoją marką?',
  lead: 'Nie potrzebujesz kolejnej luźnej rozmowy. Potrzebujesz spojrzenia z zewnątrz i decyzji, które porządkują następny krok.',
  body: 'Zobaczmy, co działa, co Cię blokuje i gdzie warto skierować energię. Bez dokładania kolejnych pomysłów do listy. Z konkretnym kierunkiem działania.',
  outcomesLabel: 'Z czym wychodzisz',
  outcomes: [
    {
      number: '01',
      title: 'Diagnoza',
      text: 'Dwie godziny warsztatu ze mną. Przyglądamy się Twojej marce, ofercie, komunikacji i narzędziom. Sprawdzamy, co działa, co blokuje rozwój i czego potrzebujesz, żeby ruszyć dalej.',
    },
    {
      number: '02',
      title: 'Mapa kierunku',
      text: 'Po warsztacie opracowuję prezentację z wnioskami i rekomendacjami. Pokazuję, co warto zmienić, w jakiej kolejności i dlaczego. Oddzielam priorytety od rzeczy, które mogą poczekać.',
    },
    {
      number: '03',
      title: 'Pierwszy krok',
      text: 'Spotykamy się ponownie i omawiamy mapę oraz Twoje pytania. Wskazuję jeden najważniejszy krok na teraz i pokazuję, jak łączy się z dalszym kierunkiem.',
    },
  ],
  closing: ['Najpierw kierunek.', 'Potem kolejny metr.'],
  /** Pain-first copy for the offer panel (sections/offer/OfferPanel.astro) */
  pain: {
    headline: ['Nie wiesz,', 'co dalej'],
    /** Last line: "z" stays with "marką?" (no single-letter word at a line end) */
    headlinePre: 'z',
    headlineAccent: 'marką?',
    lead: 'Masz pomysły, możliwości i pytania. Dużo ruchu, mało kierunku. A każdy kolejny pomysł tylko dokłada chaosu.',
    points: [
      'Nie wiesz, na czym się skupić.',
      'Marka mówi jedno, oferta drugie.',
      'Planujesz nową stronę, ale nie masz pewności, czy od niej zacząć.',
    ],
    resolution: 'Ustalmy kierunek. Wybierzmy pierwszy krok.',
  },
  cta: 'Umów warsztat',
  /** Booking link; while null the CTA renders disabled with the note below */
  bookingUrl: site.consultationUrl as string | null,
  bookingNote: 'Rezerwacja wkrótce',
};
