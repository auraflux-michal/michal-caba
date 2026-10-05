/**
 * "Lustro marki osobistej" controller: state (localStorage), screen flow, mirror, result,
 * sign-up and analytics. All markup is server-rendered (components/lustro/*); this module only
 * toggles screens and fills the result, so every style lives in Tailwind classes.
 *
 * Flow: intro (step -1) → steps 0…n-1 → result (step n). State survives reloads.
 */
import { gsap, motion, prefersReducedMotion, unveil } from '@/scripts/lib/gsap';
import { getLenis } from '@/scripts/lib/smooth-scroll';
import { track } from '@/scripts/lib/analytics';
import {
  lustroPotential,
  lustroScore,
  lustroSections,
  lustroStageFor,
  lustroStages,
} from '@/data/lustro';
import { createMirror } from './mirror';
import { confetti } from './confetti';

const STORE = 'lustro-marki-v1';
const STEPS = lustroSections.length;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface State {
  step: number;
  yes: string[];
}

const fresh = (): State => ({ step: -1, yes: [] });

function load(): State {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE) ?? 'null');
    if (saved && Array.isArray(saved.yes) && Number.isInteger(saved.step)) {
      return {
        step: Math.min(Math.max(saved.step, -1), STEPS),
        yes: saved.yes.filter((id: unknown) => typeof id === 'string'),
      };
    }
  } catch {
    // Private mode / corrupted entry: start fresh
  }
  return fresh();
}

const screenKey = (step: number) => (step < 0 ? 'intro' : step >= STEPS ? 'result' : String(step));

export function initLustro() {
  const root = document.querySelector<HTMLElement>('[data-lustro]');
  const panel = root?.querySelector<HTMLElement>('[data-lustro-panel]');
  if (!root || !panel) return;

  const reducedMotion = prefersReducedMotion();
  const animated = document.documentElement.classList.contains('is-animated');
  const canvas = document.querySelector<HTMLCanvasElement>('[data-confetti]');
  const updateMirror = createMirror(root, reducedMotion);

  let state = load();
  let current: HTMLElement | null = null;

  const save = () => {
    try {
      localStorage.setItem(STORE, JSON.stringify(state));
    } catch {
      // Storage unavailable: the quiz still works for this visit
    }
  };

  const screens = new Map(
    [...panel.querySelectorAll<HTMLElement>('[data-screen]')].map((el) => [el.dataset.screen!, el]),
  );
  const inputs = [...panel.querySelectorAll<HTMLInputElement>('input[data-item]')];
  const nav = panel.querySelector<HTMLElement>('[data-lustro-nav]');
  const navCount = nav?.querySelector('[data-nav-count]');
  const navNext = nav?.querySelector('[data-nav-next-label]');
  const percent = () => lustroScore(state.yes);

  /* ---------- Rendering ---------- */

  const refreshMirror = (animate = true) => {
    const p = percent();
    updateMirror(p, lustroStageFor(p).name, animate);
  };

  /** Sticky nav: visible on steps only, "N z M zaznaczone", last step says "Pokaż wynik" */
  const refreshNav = () => {
    const section = lustroSections[state.step];
    if (nav) nav.hidden = !section;
    if (!section) return;
    const done = section.items.filter((_, i) => state.yes.includes(`${state.step}-${i}`)).length;
    if (navCount) navCount.textContent = `${done} z ${section.items.length}`;
    if (navNext) navNext.textContent = state.step === STEPS - 1 ? 'Pokaż wynik' : 'Dalej';
  };

  /** Intro: resume a saved run or start over */
  const refreshIntro = () => {
    const label = panel.querySelector('[data-lustro-start-label]');
    const resume = panel.querySelector<HTMLElement>('[data-lustro-resume]');
    const text = panel.querySelector('[data-lustro-resume-text]');
    const saved = state.yes.length;
    if (label) label.textContent = saved ? 'Kontynuuj' : 'Spójrz w lustro';
    if (resume) resume.hidden = !saved;
    if (text) text.textContent = `Masz już zaznaczone: ${saved}.`;
  };

  const renderResult = () => {
    const screen = screens.get('result');
    if (!screen) return;
    const p = percent();
    const stage = lustroStageFor(p);
    const here = lustroStages.indexOf(stage);

    screen.querySelector('[data-result-stage]')!.textContent = stage.name;
    screen.querySelector('[data-result-description]')!.textContent = stage.description;
    screen.querySelectorAll<HTMLElement>('[data-scale-step]').forEach((step, index) => {
      step.dataset.state = index < here ? 'past' : index === here ? 'here' : 'future';
      step.setAttribute('aria-current', String(index === here));
    });

    const potential = lustroPotential(state.yes);
    const list = screen.querySelector('[data-potential-list]')!;
    const template = screen.querySelector<HTMLTemplateElement>('[data-potential-row]')!;
    list.replaceChildren(
      ...potential.map((area) => {
        const row = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
        row.querySelector('[data-potential-title]')!.textContent = area.title;
        row.querySelector('[data-potential-percent]')!.textContent = `${area.percent}%`;
        row.querySelector('[data-potential-first]')!.textContent = area.firstStep ?? '';
        return row;
      }),
    );
    screen.querySelector<HTMLElement>('[data-result-potential]')!.hidden = !potential.length;
    screen.querySelector<HTMLElement>('[data-result-complete]')!.hidden = potential.length > 0;
  };

  /* ---------- Screen flow ---------- */

  const scrollToPanel = () => {
    const header = document.querySelector<HTMLElement>('[data-header]');
    const top = Math.max(
      0,
      panel.getBoundingClientRect().top + window.scrollY - (header?.offsetHeight ?? 0),
    );
    if (window.scrollY <= top) return;
    // Instant: the new screen animates in at the top, no long scroll to watch
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(top, { immediate: true, force: true });
    else window.scrollTo({ top, behavior: 'auto' });
  };

  /**
   * Animate a screen's direct children in (fade-up, house easing). Opacity, not autoAlpha:
   * `visibility: hidden` would drop the focus just moved to the screen's heading.
   */
  const enter = (screen: HTMLElement, delay = 0) => {
    if (reducedMotion) return;
    // Step screens: animate the rows individually so the list cascades in
    const parts = [...screen.children].flatMap((child) =>
      child.tagName === 'UL' ? [...child.children] : [child],
    );
    gsap.fromTo(
      parts,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.05,
        delay,
        clearProps: 'transform,opacity',
      },
    );
  };

  const focusHeading = (screen: HTMLElement) => {
    const heading = screen.querySelector<HTMLElement>('h1, h2');
    if (!heading) return;
    if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
    heading.classList.add('outline-none');
    heading.focus({ preventScroll: true });
  };

  const show = (step: number, { focus = true } = {}) => {
    state.step = step;
    save();
    const next = screens.get(screenKey(step));
    if (!next || next === current) return;
    if (screenKey(step) === 'result') renderResult();

    screens.forEach((screen) => (screen.hidden = screen !== next));
    current = next;
    refreshNav();
    if (step < 0) refreshIntro();
    scrollToPanel();
    if (focus) focusHeading(next);
    enter(next);
  };

  /* ---------- Events ---------- */

  inputs.forEach((input) => {
    input.checked = state.yes.includes(input.dataset.item!);
    input.addEventListener('change', () => {
      const id = input.dataset.item!;
      state.yes = input.checked
        ? [...new Set([...state.yes, id])]
        : state.yes.filter((x) => x !== id);
      save();
      refreshMirror();
      refreshNav();
      if (input.checked && !reducedMotion) {
        const box = input.parentElement?.querySelector('[data-item-box]');
        if (box)
          gsap.fromTo(box, { scale: 0.75 }, { scale: 1, duration: 0.6, ease: 'back.out(3)' });
      }
    });
  });

  panel.addEventListener('click', (event) => {
    const target = (event.target as Element).closest<HTMLElement>(
      '[data-lustro-start], [data-lustro-next], [data-lustro-back], [data-lustro-restart]',
    );
    if (!target) return;

    if (target.hasAttribute('data-lustro-start')) {
      track('lustro_start', { resumed: state.yes.length > 0 });
      show(0);
    } else if (target.hasAttribute('data-lustro-next')) {
      const step = state.step + 1;
      show(step);
      if (step >= STEPS) {
        const p = percent();
        track('lustro_complete', { score: p, stage: lustroStageFor(p).name });
        if (canvas) window.setTimeout(() => confetti(canvas), 450);
      }
    } else if (target.hasAttribute('data-lustro-back')) {
      show(state.step - 1);
    } else {
      state = fresh();
      inputs.forEach((input) => (input.checked = false));
      refreshMirror();
      refreshIntro();
      show(-1);
    }
  });

  initSignup(
    root,
    () => state.yes,
    () => canvas && confetti(canvas, 90),
  );

  /* ---------- Boot ---------- */

  refreshIntro();
  refreshMirror(false);
  show(state.step, { focus: false });

  if (animated) {
    unveil(root.querySelectorAll('[data-reveal="custom"]'));
    const mirror = root.querySelector('[data-mirror]');
    if (mirror && !reducedMotion) {
      gsap.from(mirror, {
        autoAlpha: 0,
        scale: 0.92,
        y: 30,
        duration: 1.6,
        delay: 0.2,
        clearProps: 'transform,opacity,visibility',
      });
    }
  }
}

/* ---------- Newsletter sign-up ---------- */

const ERRORS: Record<string, string> = {
  invalid_email: 'Wpisz poprawny adres e-mail, np. jan@firma.pl',
  consent_required: 'Zaznacz zgodę na newsletter, żebym mógł wysłać Ci plan.',
  default: 'Nie udało się zapisać. Spróbuj ponownie za chwilę.',
};

function initSignup(root: HTMLElement, checked: () => string[], celebrate: () => void) {
  const form = root.querySelector<HTMLFormElement>('[data-signup-form]');
  if (!form) return;
  const wrap = root.querySelector<HTMLElement>('[data-signup-form-wrap]')!;
  const done = root.querySelector<HTMLElement>('[data-signup-done]')!;
  const error = form.querySelector<HTMLElement>('[data-signup-error]')!;
  const submit = form.querySelector<HTMLButtonElement>('[data-signup-submit]')!;
  const submitLabel = form.querySelector<HTMLElement>('[data-signup-submit-label]')!;
  const endpoint = root.dataset.endpoint ?? '/api/lustro';

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const consent = data.get('consent') === 'on';

    if (!EMAIL_PATTERN.test(email)) {
      error.textContent = ERRORS.invalid_email;
      form.querySelector<HTMLInputElement>('[name="email"]')?.focus();
      return;
    }
    if (!consent) {
      error.textContent = ERRORS.consent_required;
      return;
    }

    error.textContent = '';
    submit.disabled = true;
    submitLabel.textContent = 'Wysyłam…';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          consent: true,
          website: String(data.get('website') ?? ''),
          checked: checked(),
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) throw new Error(result.error ?? 'default');

      const p = lustroScore(checked());
      track('lustro_signup', { score: p, stage: lustroStageFor(p).name });
      done.querySelector('[data-signup-name]')!.textContent = name ? `, ${name}` : '';
      wrap.hidden = true;
      done.hidden = false;
      done.focus({ preventScroll: true });
      if (!prefersReducedMotion()) {
        gsap.from(done.children, {
          autoAlpha: 0,
          y: 30,
          stagger: 0.08,
          duration: motion.duration.reveal,
        });
      }
      celebrate();
    } catch (failure) {
      const code = failure instanceof Error ? failure.message : 'default';
      error.textContent = ERRORS[code] ?? ERRORS.default;
    } finally {
      submit.disabled = false;
      submitLabel.textContent = 'Wyślij mi plan';
    }
  });
}
