/**
 * Hero intro: plays once on load: header drops in, headline rises line by line through
 * masks, the accent rule draws towards the quote, meta rail fades up.
 * Then the last line rotates ("W ludziach" → "W firmach" → "W pomysłach" → …) and a
 * "current" pulse travels the rule from Potencjał to the quote, lighting up #1metrDalej.
 */
import { gsap, ScrollTrigger, SplitText, motion, unveil } from '@/scripts/lib/gsap';

const ROTATE_EVERY = 2.6; // s: time each phrase stays on screen
const SWAP_DURATION = 0.8;
const INTRO_END = 2.2; // s: when the intro timeline has settled
const CURRENT_EVERY = 3.2; // s: pause between two current pulses

/**
 * @param intro play the load choreography. `false` (content already revealed by the failsafe on
 * slow connections) starts only the ambient effects, never hiding what is on screen.
 */
export function initHero({ intro = true }: { intro?: boolean } = {}) {
  const title = document.querySelector<HTMLElement>('[data-hero-title]');
  if (!title) return;

  const rule = document.querySelector('[data-hero-rule]');
  const quote = document.querySelector<HTMLElement>('[data-hero-quote]');
  const startAmbient = () => {
    initPhraseRotator(title);
    initCurrent(rule, quote?.querySelector<HTMLElement>('[data-hero-tag]') ?? null);
  };

  if (!intro) {
    startAmbient();
    return;
  }

  const header = document.querySelector('[data-header]');
  const lines = title.querySelectorAll('[data-hero-line]');
  const meta = document.querySelectorAll('[data-hero-meta]');

  unveil([header, title, rule, quote, ...meta].filter(Boolean));

  const tl = gsap.timeline({ defaults: { ease: motion.ease, duration: motion.duration.reveal } });

  if (header) tl.from(header, { yPercent: -100, duration: 1 }, 0);

  // Lines are pre-masked in markup (static masks keep the rotating grid intact)
  tl.from(lines, { yPercent: 110, stagger: motion.stagger.loose, duration: 1.4 }, 0.15);

  if (rule) tl.from(rule, { scaleX: 0, duration: 1.4, ease: motion.easeInOut }, 0.6);

  if (meta.length) tl.from(meta, { autoAlpha: 0, y: 16, stagger: motion.stagger.base }, 1);

  if (quote) {
    // Standalone tween (NOT added to `tl`): autoSplit re-splits when a late font subset
    // (latin-ext: ę, ć…) arrives or the width changes. Only the first split animates.
    let animated = false;
    SplitText.create(quote, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      onSplit: (self) => {
        if (animated) return;
        animated = true;
        return gsap.from(self.lines, {
          yPercent: 100,
          duration: motion.duration.reveal,
          stagger: motion.stagger.base,
          delay: 0.9,
        });
      },
    });
  }

  // Fixed start time instead of tl.onComplete: robust against anything extending the timeline
  gsap.delayedCall(INTRO_END, startAmbient);

  return tl;
}

/**
 * Rotates the stacked `[data-hero-word]` phrases. Single source of truth (`current`), one timer,
 * every swap hard-sets all phrases, so overlapping calls can never leave two phrases on screen.
 * Pauses while the hero is off-screen or the tab is hidden; resumes with a full interval.
 */
function initPhraseRotator(title: HTMLElement) {
  if (title.dataset.rotating) return; // idempotent
  const phrases = gsap.utils.toArray<HTMLElement>('[data-hero-word]', title);
  if (phrases.length < 2) return;
  title.dataset.rotating = 'true';

  let current = 0;

  gsap.set(phrases, { autoAlpha: 0, yPercent: 110 });
  gsap.set(phrases[current], { autoAlpha: 1, yPercent: 0 });

  const swap = () => {
    const prev = current;
    current = (current + 1) % phrases.length;

    gsap.killTweensOf(phrases);
    // Park everything that is not part of this swap
    phrases.forEach((phrase, index) => {
      if (index !== prev && index !== current) gsap.set(phrase, { autoAlpha: 0, yPercent: 110 });
    });

    gsap
      .timeline({ defaults: { duration: SWAP_DURATION, ease: motion.easeInOut } })
      .fromTo(phrases[prev], { autoAlpha: 1, yPercent: 0 }, { yPercent: -110 }, 0)
      .fromTo(phrases[current], { autoAlpha: 1, yPercent: 110 }, { yPercent: 0 }, 0)
      .set(phrases[prev], { autoAlpha: 0, yPercent: 110 });
  };

  const timer = gsap.delayedCall(ROTATE_EVERY, () => {
    swap();
    timer.restart(true);
  });
  timer.pause(); // the visibility gate below starts it only when the hero is actually on screen

  whileVisible(title, {
    resume: () => {
      timer.restart(true); // full interval after resuming
    },
    pause: () => timer.pause(),
  });
}

/**
 * "Current": a glowing pulse travels the connector rule from Potencjał to the quote, accelerating
 * like a discharge; on arrival #1metrDalej flares. Desktop only (the rule is hidden below lg).
 */
function initCurrent(rule: Element | null, tag: HTMLElement | null) {
  const spark = rule?.querySelector<HTMLElement>('[data-hero-spark]');
  if (!rule || !spark || (rule as HTMLElement).dataset.current) return;
  (rule as HTMLElement).dataset.current = 'true';

  const pulse = gsap.timeline({ repeat: -1, repeatDelay: CURRENT_EVERY, paused: true });
  pulse
    // `left` in % of the rule: no pixel maths, stays correct on resize
    .fromTo(spark, { left: '-30%' }, { left: '100%', duration: 1.1, ease: 'power2.in' }, 0)
    .fromTo(spark, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'none' }, 0)
    .to(spark, { opacity: 0, duration: 0.12, ease: 'none' }, 1.02);

  if (tag) {
    pulse
      .fromTo(
        tag,
        { textShadow: '0 0 0px rgba(219, 57, 45, 0)', filter: 'brightness(1)' },
        {
          textShadow: '0 0 18px rgba(219, 57, 45, 0.85)',
          filter: 'brightness(1.35)',
          duration: 0.18,
          ease: 'power2.out',
        },
        1.0,
      )
      .to(
        tag,
        { textShadow: '0 0 0px rgba(219, 57, 45, 0)', filter: 'brightness(1)', duration: 0.9 },
        '>',
      );
  }

  // Runs only while the rule is rendered (it is display:none below lg, per its own CSS) and on
  // screen. Breakpoint changes are picked up on ScrollTrigger's resize refresh: no duplicated
  // media query here.
  whileVisible(rule, {
    when: () => (rule as HTMLElement).offsetWidth > 0,
    resume: () => pulse.play(),
    pause: () => pulse.pause(),
  });
}

/**
 * Calls `resume` / `pause` as the element enters/leaves the viewport, the tab is hidden, or the
 * optional `when` predicate changes (re-evaluated on every ScrollTrigger refresh, e.g. resize).
 */
function whileVisible(
  trigger: Element,
  {
    resume,
    pause,
    when = () => true,
  }: { resume: () => void; pause: () => void; when?: () => boolean },
) {
  let running = false;
  let active = false;

  const sync = () => {
    const shouldRun = active && !document.hidden && when();
    if (shouldRun === running) return;
    running = shouldRun;
    if (shouldRun) resume();
    else pause();
  };

  // State comes from the callback's own `self` (ScrollTrigger may fire these synchronously
  // during create(), before its return value is assigned anywhere).
  const track = (self: ScrollTrigger) => {
    active = self.isActive;
    sync();
  };
  ScrollTrigger.create({
    trigger,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: track,
    onRefresh: track,
  });

  document.addEventListener('visibilitychange', sync);
}
