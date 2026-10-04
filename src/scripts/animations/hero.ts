/**
 * Hero intro — plays once on load: header drops in, headline rises line by line through
 * masks, the accent rule draws towards the quote, meta rail fades up.
 * Then the last word of the headline rotates ("ludziach" → "firmach" → "pomysłach"),
 * paused whenever the hero is off-screen.
 */
import { gsap, ScrollTrigger, SplitText, motion, unveil } from '@/scripts/lib/gsap';

const ROTATE_EVERY = 2.6; // s — time each word stays on screen

export function initHero() {
  const title = document.querySelector<HTMLElement>('[data-hero-title]');
  if (!title) return;

  const header = document.querySelector('[data-header]');
  const lines = title.querySelectorAll('[data-hero-line]');
  const rule = document.querySelector('[data-hero-rule]');
  const quote = document.querySelector<HTMLElement>('[data-hero-quote]');
  const meta = document.querySelectorAll('[data-hero-meta]');

  unveil([header, title, rule, quote, ...meta].filter(Boolean));

  const tl = gsap.timeline({
    defaults: { ease: motion.ease, duration: motion.duration.reveal },
    onComplete: () => initWordRotator(title),
  });

  if (header) tl.from(header, { yPercent: -100, duration: 1 }, 0);

  // Lines are pre-masked in markup (static masks keep the rotator's inline-grid intact)
  tl.from(lines, { yPercent: 110, stagger: motion.stagger.loose, duration: 1.4 }, 0.15);

  if (rule) tl.from(rule, { scaleX: 0, duration: 1.4, ease: motion.easeInOut }, 0.6);

  if (quote) {
    SplitText.create(quote, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      onSplit: (self) => tl.from(self.lines, { yPercent: 100, stagger: motion.stagger.base }, 0.9),
    });
  }

  if (meta.length) tl.from(meta, { autoAlpha: 0, y: 16, stagger: motion.stagger.base }, 1);

  return tl;
}

function initWordRotator(title: HTMLElement) {
  const words = gsap.utils.toArray<HTMLElement>('[data-hero-word]', title);
  if (words.length < 2) return;

  gsap.set(words.slice(1), { autoAlpha: 0, yPercent: 110 });
  gsap.set(words[0], { autoAlpha: 1, yPercent: 0 });

  let current = 0;
  let inView = true;

  // One self-contained swap per tick — no repeating timeline, so no wrap-around state to restore
  const swap = () => {
    const out = words[current];
    current = (current + 1) % words.length;
    const next = words[current];

    gsap.to(out, { yPercent: -110, duration: 0.8, ease: motion.easeInOut });
    gsap.fromTo(
      next,
      { autoAlpha: 1, yPercent: 110 },
      { yPercent: 0, duration: 0.8, ease: motion.easeInOut },
    );
    gsap.set(out, { autoAlpha: 0, delay: 0.8 });
  };

  const tick = gsap.delayedCall(ROTATE_EVERY, function loop() {
    if (inView) swap();
    tick.restart(true);
  });

  // Pause while the hero is off-screen
  ScrollTrigger.create({
    trigger: title,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => {
      inView = self.isActive;
    },
  });
}
