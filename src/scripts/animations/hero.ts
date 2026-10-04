/**
 * Hero intro: plays once on load: header drops in, headline rises line by line through
 * masks, the accent rule draws towards the quote, meta rail fades up.
 * Then the last line rotates ("W ludziach" → "W firmach" → "W pomysłach" → …).
 */
import { gsap, ScrollTrigger, SplitText, motion, unveil } from '@/scripts/lib/gsap';

const ROTATE_EVERY = 2.6; // s: time each phrase stays on screen
const SWAP_DURATION = 0.8;
const INTRO_END = 2.2; // s: when the intro timeline has settled

export function initHero() {
  const title = document.querySelector<HTMLElement>('[data-hero-title]');
  if (!title) return;

  const header = document.querySelector('[data-header]');
  const lines = title.querySelectorAll('[data-hero-line]');
  const rule = document.querySelector('[data-hero-rule]');
  const quote = document.querySelector<HTMLElement>('[data-hero-quote]');
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
  gsap.delayedCall(INTRO_END, () => initPhraseRotator(title));

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
  let inView = true;

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

  const sync = () => {
    const shouldRun = inView && !document.hidden;
    if (shouldRun && timer.paused()) timer.restart(true); // full interval after resuming
    if (!shouldRun) timer.pause();
  };

  ScrollTrigger.create({
    trigger: title,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => {
      inView = self.isActive;
      sync();
    },
  });
  document.addEventListener('visibilitychange', sync);
}
