/**
 * "Lustro marki osobistej": quiz content (lead magnet on /lustro).
 * Single source for the page markup, the client script (scoring, result) AND the server endpoint
 * (src/pages/api/lustro.ts recomputes score / stage / missing items from the submitted ids,
 * so nothing the browser sends about the result is trusted).
 * Item id = `${sectionIndex}-${itemIndex}`.
 */

export interface LustroItem {
  title: string;
  hint: string;
}

export interface LustroSection {
  title: string;
  why: string;
  items: LustroItem[];
}

export interface LustroStage {
  /** Lower bound in % (inclusive) */
  min: number;
  name: string;
  description: string;
}

const item = (title: string, hint: string): LustroItem => ({ title, hint });

export const lustroSections: LustroSection[] = [
  {
    title: 'Fundament spójności',
    why: 'Bez fundamentu każdy profil wygląda inaczej i ludzie nie wiedzą, czym się zajmujesz. Spójność buduje zaufanie, zanim ktoś do Ciebie napisze.',
    items: [
      item('Mam jedno zdanie o sobie', 'Kim jestem i komu pomagam. Używam go w każdym bio.'),
      item('Mam to samo zdjęcie profilowe wszędzie', 'Twarz, dobre światło, naturalny wyraz.'),
      item('Mam brand kit', '2–3 kolory i 1–2 fonty zapisane np. w Canvie.'),
      item('Wiem, jakim tonem mówię', 'Szczerze, z humorem, ekspercko? Trzymam się go wszędzie.'),
      item('Mam 3–4 filary treści', 'Tematy, o których regularnie mówię.'),
    ],
  },
  {
    title: 'Profile w social media',
    why: 'Ktoś, kto zobaczy Twój post, zaraz potem kliknie w profil. Masz kilka sekund, żeby przekonać go, że warto zostać.',
    items: [
      item(
        'Nagłówek na LinkedIn mówi, komu pomagam',
        'Nie samo „CEO” czy „Designer”. Najważniejsze na początku.',
      ),
      item(
        'Mam baner w kolorach marki',
        'LinkedIn 1584×396 px, Facebook 851×315 px, spójne ze sobą.',
      ),
      item(
        'Sekcja „Informacje” zaczyna się od zdania, które zatrzymuje',
        'Przed „więcej” widać tylko 2–3 linijki.',
      ),
      item(
        'Link do strony jest w bio na każdej platformie',
        'LinkedIn (Polecane i kontakt), Facebook, Instagram.',
      ),
      item(
        'Instagram to konto profesjonalne z wyróżnionymi relacjami',
        'Np. „O mnie”, „Klienci”, „Kulisy”, „Opinie”.',
      ),
      item(
        'Stopka maila i wizytówka prowadzą do mojej marki',
        'Link do strony i LinkedIn, kod QR.',
      ),
    ],
  },
  {
    title: 'Strona',
    why: 'Strona to Twój dom w internecie. Social media mogą zmienić zasady w każdej chwili, strona zostaje Twoja.',
    items: [
      item('Mam stronę marki osobistej', 'Nawet prosta, jednostronicowa wystarczy na start.'),
      item(
        'Mam podpięte Google Search Console i analitykę',
        'Wiem, czy Google mnie widzi i skąd przychodzą ludzie.',
      ),
      item(
        'Mam zainstalowany Meta Pixel',
        'Bez niego nie dotrę reklamą do osób, które były na stronie.',
      ),
      item(
        'Link do strony ładnie się wyświetla w social media',
        'Grafika podglądu (Open Graph) jest ustawiona.',
      ),
      item(
        'Formularz działa, strona dobrze wygląda na telefonie',
        'Sprawdzone osobiście, nie „chyba działa”.',
      ),
      item('Jest jasne wezwanie do działania', 'Np. kalendarz do umówienia rozmowy.'),
    ],
  },
  {
    title: 'Szablony grafik',
    why: 'Szablony oszczędzają czas i sprawiają, że Twoje posty są rozpoznawalne, zanim ktoś przeczyta nazwisko.',
    items: [
      item('Mam szablon posta z cytatem lub myślą', '1080×1350 px, działa na IG, FB i LinkedIn.'),
      item('Mam szablon karuzeli edukacyjnej', '5–8 slajdów, ten sam format.'),
      item('Mam szablon okładki rolki i relacji', '1080×1920 px.'),
      item('Mam szablon opinii klienta lub case study', 'Gotowy do podmiany treści.'),
    ],
  },
  {
    title: 'Treści i rytm',
    why: 'Widoczność buduje regularność, nie perfekcja. Lepiej publikować przeciętnie i regularnie niż idealnie raz na kwartał.',
    items: [
      item('Publikuję co najmniej raz w tygodniu', 'Realny rytm, który utrzymam przez rok.'),
      item('Mam bank pomysłów na treści', 'Każda rozmowa z klientem to potencjalny post.'),
      item('Regularnie wrzucam relacje', 'Tam ludzie poznają mnie „na żywo”.'),
      item('Nagrywam rolki lub krótkie wideo', 'Na start choćby jedno tygodniowo.'),
      item('Odpowiadam na komentarze i komentuję u innych', 'Na LinkedIn to połowa zasięgu.'),
    ],
  },
  {
    title: 'Dowód społeczny',
    why: 'Ty możesz mówić, że jesteś dobry. Kiedy mówią to Twoi klienci, ludzie zaczynają wierzyć.',
    items: [
      item('Mam co najmniej 5 opinii klientów', 'Tekst, a najlepiej krótkie wideo.'),
      item('Mam opisane 2–3 case studies', 'Problem, co zrobiłem, efekt.'),
      item('Opinie są widoczne na stronie i w social media', 'Nie leżą tylko w mailach.'),
    ],
  },
  {
    title: 'Rytm miesięczny',
    why: 'Marka to żywy organizm. Raz w miesiącu warto spojrzeć w lustro jeszcze raz.',
    items: [
      item('Raz w miesiącu sprawdzam, co działa', 'Które posty, skąd przychodzą zapytania.'),
      item(
        'Aktualizuję bio i stronę, gdy zmienia się oferta',
        'Wszędzie mówię to samo, aktualnie.',
      ),
    ],
  },
];

export const lustroStages: LustroStage[] = [
  {
    min: 0,
    name: 'Zaparowane lustro',
    description:
      'Potencjał jest, ale na razie nikt go nie widzi. Czasem nawet Ty. To dobry moment na start, bo każdy krok będzie widać od razu.',
  },
  {
    min: 25,
    name: 'Pierwsze odbicie',
    description:
      'Coś już się pokazuje. Masz pierwsze elementy, ale marka jeszcze nie układa się w spójną całość.',
  },
  {
    min: 50,
    name: 'Wyraźny kontur',
    description:
      'Ludzie zaczynają rozpoznawać, kim jesteś i co robisz. Teraz czas na regularność i dowód społeczny.',
  },
  {
    min: 75,
    name: 'Pełne odbicie',
    description:
      'Twoja marka jest spójna i widoczna. Zostały detale, które zamienią widoczność w zapytania.',
  },
  {
    min: 90,
    name: 'Marka, która przyciąga',
    description: 'Twoja marka pracuje na Ciebie. Teraz skaluj i dziel się tym, co działa.',
  },
];

/* ---------- Scoring (shared by the browser and the server) ---------- */

export const lustroItemIds = lustroSections.flatMap((section, s) =>
  section.items.map((_, i) => `${s}-${i}`),
);

export const LUSTRO_TOTAL = lustroItemIds.length;

/** Rounded share of checked items, 0–100 (unknown ids are ignored) */
export function lustroScore(checked: Iterable<string>): number {
  const valid = new Set([...checked].filter((id) => lustroItemIds.includes(id)));
  return Math.round((valid.size / LUSTRO_TOTAL) * 100);
}

export function lustroStageFor(score: number): LustroStage {
  return lustroStages.reduce((found, stage) => (score >= stage.min ? stage : found));
}

/** Titles of every unchecked item, in quiz order */
export function lustroMissing(checked: Iterable<string>): string[] {
  const yes = new Set(checked);
  return lustroSections.flatMap((section, s) =>
    section.items.filter((_, i) => !yes.has(`${s}-${i}`)).map((entry) => entry.title),
  );
}

/** The (up to) 3 weakest sections with their first unchecked item: "your biggest potential" */
export function lustroPotential(checked: Iterable<string>, limit = 3) {
  const yes = new Set(checked);
  return lustroSections
    .map((section, s) => {
      const done = section.items.filter((_, i) => yes.has(`${s}-${i}`)).length;
      const first = section.items.find((_, i) => !yes.has(`${s}-${i}`));
      return {
        title: section.title,
        percent: Math.round((done / section.items.length) * 100),
        firstStep: first?.title ?? null,
      };
    })
    .filter((section) => section.percent < 100)
    .sort((a, b) => a.percent - b.percent)
    .slice(0, limit);
}

/** Page copy that is not part of the checklist itself */
export const lustroCopy = {
  title: 'Lustro marki osobistej | Michał Caba',
  description:
    'Interaktywna checklista marki osobistej: 31 punktów, około 4 minut. Zaznacz, co już masz, a lustro pokaże etap Twojej marki i potencjał, którego z bliska nie widać.',
  ogAlt: 'Lustro marki osobistej: interaktywna checklista Michała Caby',
};
