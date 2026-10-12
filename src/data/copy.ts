/**
 * Page copy by version. Sections read the active version from `Astro.locals.copy` (set by
 * components/pages/HomePage.astro), falling back to `copyV1` (the live site).
 * v2 = content-only rewrite (2026-10): same layout, components and interactions.
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
    accent: 'Upraszczam trudne pytania.',
    bio: 'Jestem Michał. Od ponad 15 lat poruszam się między strategią, designem, technologią i biznesem. Projektuję marki i pomagam ludziom zamieniać pomysły w rzeczy, które naprawdę istnieją.',
  },
  roles: [
    'Patrzę z dystansu, łączę kropki i szukam tego, co naprawdę ma znaczenie.',
    'Upraszczam złożone rzeczy i nadaję pomysłom formę, która wydaje się oczywista.',
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
    lead: 'Publikujesz, poprawiasz, zaczynasz od nowa. Dużo ruchu, mało kierunku. A każdy kolejny pomysł tylko dokłada chaosu.',
    points: [
      'Nie wiesz, na czym się skupić.',
      'Marka mówi jedno, oferta drugie.',
      'Tracisz czas na działania, które nic nie zmieniają.',
    ],
    resolution: 'Jedno spotkanie. Trzy decyzje, które porządkują następny krok.',
    steps: [
      'Przyglądamy się Twojej marce, komunikacji i obecnym działaniom. Oddzielamy to, co działa, od tego, co tylko zajmuje czas.',
      'Nazywamy blokady i miejsca, w których tracisz potencjał. Ustalamy, co zasługuje na uwagę, a co można odpuścić.',
      'Wychodzisz z mapą kolejnych działań: co zrobić najpierw, co później i w co naprawdę warto inwestować.',
    ],
  },
  philosophy: {
    lead: 'Nie musisz zmieniać całego świata. Wystarczy, że przesuniesz coś o jeden metr.',
    blocks: [
      ['Siebie. Pomysł. Firmę. Relacje.', 'Nie chodzi o wielką rewolucję, tylko o ruch.'],
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
    body: ['Masz coś, w czym widzisz potencjał,', 'ale nie wiesz, jaki zrobić następny ruch?'],
  },
};

export const copyV2: SiteCopy = {
  hero: {
    quote: ['Lubię sprawdzać, co się', 'stanie, kiedy dostanie'],
    quotePre: '',
    quoteAccent: 'właściwy kierunek.',
  },
  about: {
    headline: ['Projektuję marki.', 'Buduję firmy.'],
    accent: 'Pomagam znaleźć kierunek.',
    bio: 'Jestem Michał. Od ponad 15 lat łączę strategię, design, technologię i biznes. Pomagam przedsiębiorcom spojrzeć na swoje pomysły z nowej perspektywy, uporządkować to, co złożone, i zdecydować, co naprawdę warto zrobić.',
  },
  roles: [
    'Łączę fakty, zadaję właściwe pytania i pomagam odnaleźć kierunek, który ma sens.',
    'Zamieniam idee w doświadczenia, marki i rozwiązania, które ludzie rozumieją.',
    'Buduję własne firmy. Wiem, że dobra strategia musi działać również poza prezentacją.',
  ],
  build: {
    headline: ['Strategia nadaje kierunek.'],
    accent: ['My nadajemy jej formę.'],
    // One paragraph, lightly tightened: the 5-line v2 headline leaves less room in the fixed card
    paragraphs: [
      'Auraflux to firma, którą buduję. Łączymy strategię, design i technologię, zamieniając dobre decyzje w marki, produkty i doświadczenia. Możesz przyjść z gotowym kierunkiem albo wypracować go wcześniej ze mną na warsztacie 1:1.',
    ],
    cta: 'Odkryj Auraflux',
  },
  offer: {
    lead: 'Masz pomysły, możliwości i pytania. Ale brakuje Ci jasności, co naprawdę ma sens i od czego zacząć.',
    body: 'Spotkajmy się 1:1. Przyjrzymy się Twojej marce, nazwiemy najważniejsze wyzwania i wyznaczymy kierunek dalszych działań.',
    points: [],
    steps: [
      'Przyglądamy się Twojej marce, jej sytuacji i wyzwaniom. Szukamy tego, co działa, co blokuje rozwój i gdzie kryje się potencjał.',
      'Oddzielamy rzeczy ważne od pilnych. Wybieramy obszary, na których warto się skupić, zamiast próbować zmieniać wszystko naraz.',
      'Zamieniamy wnioski w konkretne następne kroki. Wiesz, od czego zacząć, co zrobić najpierw i jak ruszyć z miejsca.',
    ],
    afterSteps:
      'Kierunek jest Twój. Możesz działać samodzielnie, ze swoim zespołem albo skorzystać ze wsparcia Auraflux.',
  },
  philosophy: {
    lead: 'Nie musisz zmieniać całego świata. Wystarczy, że zrobisz jeden krok, który coś zmieni.',
    blocks: [
      ['Jedna decyzja. Jedna rozmowa.', 'Jeden pomysł, który wreszcie ruszy z miejsca.'],
      ['A jutro?', 'Jeszcze metr.'],
    ],
  },
  notes: {
    intro: 'To, co akurat chodzi mi po głowie.',
    lines: ['O markach, decyzjach, projektowaniu,', 'biznesie i ciekawości świata.'],
  },
  next: {
    line: 'Nie wiem jeszcze, dokąd zmierzasz.',
    accent: 'Chętnie pomogę Ci to odkryć.',
    body: [
      'Masz pomysł, wyzwanie albo poczucie,',
      'że czas coś zmienić?',
      'Porozmawiajmy o tym, co dalej.',
    ],
  },
};
