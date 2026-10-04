/**
 * Generic, attribute-driven scroll reveals. Markup opts in with `data-reveal` + one modifier:
 *   data-split-lines  → lines rise through masks (SplitText, re-splits on resize/font load)
 *   data-fade         → soft fade-up
 *   data-wipe         → horizontal clip wipe (labels / boxes)
 *   data-pop          → clip from top (tags)
 *   data-clip-up      → clip from bottom (small media)
 *   (none)            → fade-up
 *   data-reveal="custom" → skipped here, animated by a section module
 * Optional `data-delay="0.2"` offsets the start.
 */
import { gsap, SplitText, motion, unveil } from '@/scripts/lib/gsap';

const trigger = (el: Element) => ({ trigger: el, start: motion.start, once: true });

export function initReveals() {
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    // `data-reveal="custom"` elements are owned by a dedicated section module
    if (el.dataset.reveal === 'custom') return;

    const delay = Number(el.dataset.delay ?? 0);
    unveil(el);

    if (el.hasAttribute('data-split-lines')) {
      SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 105,
            duration: motion.duration.reveal,
            stagger: motion.stagger.base,
            delay,
            scrollTrigger: trigger(el),
          }),
      });
      return;
    }

    const base = { delay, scrollTrigger: trigger(el), duration: motion.duration.reveal };

    if (el.hasAttribute('data-wipe')) {
      gsap.from(el, { ...base, clipPath: 'inset(0% 100% 0% 0%)', ease: motion.easeInOut });
    } else if (el.hasAttribute('data-pop')) {
      gsap.from(el, { ...base, clipPath: 'inset(0% 0% 100% 0%)', ease: motion.easeInOut });
    } else if (el.hasAttribute('data-clip-up')) {
      gsap.from(el, { ...base, clipPath: 'inset(100% 0% 0% 0%)', ease: motion.easeInOut });
    } else {
      gsap.from(el, { ...base, autoAlpha: 0, y: 40 });
    }
  });
}
