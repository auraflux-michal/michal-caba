/**
 * Hero intro — plays once on load: header drops in, headline rises line by line through
 * masks, the accent rule draws towards the quote, meta rail fades up.
 */
import { gsap, SplitText, motion, unveil } from '@/scripts/lib/gsap';

export function initHero() {
  const title = document.querySelector<HTMLElement>('[data-hero-title]');
  if (!title) return;

  const header = document.querySelector('[data-header]');
  const rule = document.querySelector('[data-hero-rule]');
  const quote = document.querySelector<HTMLElement>('[data-hero-quote]');
  const meta = document.querySelectorAll('[data-hero-meta]');

  unveil([header, title, rule, quote, ...meta].filter(Boolean));

  const tl = gsap.timeline({ defaults: { ease: motion.ease, duration: motion.duration.reveal } });

  if (header) tl.from(header, { yPercent: -100, duration: 1 }, 0);

  SplitText.create(title, {
    type: 'lines',
    mask: 'lines',
    linesClass: 'split-line',
    autoSplit: true,
    onSplit: (self) =>
      tl.from(self.lines, { yPercent: 110, stagger: motion.stagger.loose, duration: 1.4 }, 0.15),
  });

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
