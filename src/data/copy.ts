/**
 * Page copy by version. Sections read the active version from `Astro.locals.copy` (set by
 * components/pages/HomePage.astro), falling back to `copyV1` (the live site).
 * Arrays of lines map 1:1 to the designed line breaks; `accent` parts render in red.
 */
export interface SiteCopy {
  hero: { quote: [string, string]; quotePre: string; quoteAccent: string };
  about: { headline: [string, string]; accent: string; bio: string };
  /** Role descriptions, in role order (Strateg, Projektant, Founder) */
  roles: [string, string, string];
  build: { headline: string[]; accent: string[]; paragraphs: string[]; cta: string };
  offer: {
    lead: string;
    body?: string;
    /** Pain symptoms (× list); empty = list not rendered */
    points: string[];
    /** Uppercase closing line under the copy; omitted = not rendered */
    resolution?: string;
    /** Accordion texts, in step order */
    steps: [string, string, string];
    /** Optional line under the accordion */
    afterSteps?: string;
  };
  philosophy: { lead: string; blocks: string[][] };
  notes: { intro: string; lines: string[] };
  next: { line: string; accent: string; body: string[] };
}

export const copyV1: SiteCopy = {
  hero: {
    quote: ['Lubię sprawdzać co się', 'stanie kiedy przesuniemy'],
    quotePre: 'go o',
    quoteAccent: '#1metrDalej',
  },
  about: {
    headline: ['Projektuję marki.', 'Buduję firmy.'],
    accent: 'Pomagam znaleźć kierunek.',
    bio: 'Jestem Michał. Od ponad 15 lat łączę strategię, design, technologię i biznes. Pomagam przedsiębiorcom spojrzeć na swoje pomysły z nowej perspektywy, uporządkować to, co złożone, i zdecydować, co naprawdę warto zrobić.',
  },
  roles: [
    'Łączę fakty, zadaję właściwe pytania i pomagam odnaleźć kierunek, który ma sens.',
    'Zamieniam idee w doświadczenia, marki i rozwiązania, które ludzie rozumieją.',
    'Buduję, żeby sprawdzić, co się stanie, kiedy dobry pomysł spotka się z rzeczywistością.',
  ],
  build: {
    headline: ['Najpierw'],
    accent: ['znajdujemy', 'sens'],
    paragraphs: [
      'Pomagamy firmom odkryć, co naprawdę jest w nich wartościowe, a później nadajemy temu strategię, język, formę i doświadczenie.',
      'Nie interesuje nas robienie marek głośniejszych. Interesuje nas sprawianie, żeby było wiadomo, dlaczego warto ich słuchać.',
    ],
    cta: 'Odwiedź Auraflux',
  },
  offer: {
    lead: 'Masz pomysły, możliwości i pytania. Dużo ruchu, mało kierunku. A każdy kolejny pomysł tylko dokłada chaosu.',
    points: [
      'Nie wiesz, na czym się skupić.',
      'Marka mówi jedno, oferta drugie.',
      'Planujesz nową stronę, ale nie masz pewności, czy od niej zacząć.',
    ],
    resolution: 'Ustalmy kierunek. Wybierzmy pierwszy krok.',
    steps: [
      'Dwie godziny warsztatu ze mną. Przyglądamy się Twojej marce, ofercie, komunikacji i narzędziom. Sprawdzamy, co działa, co blokuje rozwój i czego potrzebujesz, żeby ruszyć dalej.',
      'Po warsztacie opracowuję prezentację z wnioskami i rekomendacjami. Pokazuję, co warto zmienić, w jakiej kolejności i dlaczego. Oddzielam priorytety od rzeczy, które mogą poczekać.',
      'Spotykamy się ponownie i omawiamy mapę oraz Twoje pytania. Wskazuję jeden najważniejszy krok na teraz i pokazuję, jak łączy się z dalszym kierunkiem.',
    ],
    afterSteps:
      'W cenie: warsztat 2h 1:1, przygotowanie prezentacji z mapą kierunku oraz osobne spotkanie z omówieniem rekomendacji.',
  },
  philosophy: {
    lead: 'Nie musisz zmieniać całego świata. Wystarczy, że zrobisz jeden krok, który coś zmieni.',
    blocks: [
      ['Jedna decyzja. Jedna rozmowa.', 'Jeden pomysł, który wreszcie ruszy z miejsca.'],
      ['A jutro?', 'Jeszcze metr.'],
    ],
  },
  notes: {
    intro: 'To, co akurat żywe.',
    lines: ['Myśli, obserwacje i pytania,', 'których nie chcę zostawić', 'tylko w swojej głowie.'],
  },
  next: {
    line: 'Nie wiem...',
    accent: 'dlatego jest ciekawie',
    body: [
      'Masz pomysł, wyzwanie albo poczucie,',
      'że czas coś zmienić?',
      'Porozmawiajmy o tym, co dalej.',
    ],
  },
};
