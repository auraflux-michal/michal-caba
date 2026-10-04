/**
 * "#1METR DALEJ": letters rise in, then "DALEJ" is scrubbed one step to the right
 * as the visitor scrolls: the manifesto, literally moved "a metre further".
 */
import { gsap, SplitText, motion, unveil } from '@/scripts/lib/gsap';

export function initPhilosophy() {
  const heading = document.querySelector<HTMLElement>('[data-metr]');
  if (!heading) return;

  unveil(heading);

  const lines = heading.querySelectorAll<HTMLElement>('[data-metr-line]');
  lines.forEach((line, index) => {
    SplitText.create(line, {
      type: 'chars',
      mask: 'chars',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.chars, {
          yPercent: 110,
          duration: motion.duration.reveal,
          stagger: motion.stagger.tight,
          delay: index * 0.15,
          scrollTrigger: { trigger: heading, start: 'top 80%', once: true },
        }),
    });
  });

  const shift = heading.querySelector<HTMLElement>('[data-metr-shift]');
  if (shift) {
    gsap.from(shift, {
      x: () => -parseFloat(getComputedStyle(shift).marginLeft),
      ease: 'none',
      scrollTrigger: {
        trigger: heading,
        start: 'top 75%',
        end: 'bottom 35%',
        scrub: 0.8,
        invalidateOnRefresh: true,
      },
    });
  }
}
