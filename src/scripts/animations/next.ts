/**
 * "What's next?" — oversized letters rise through masks with a slight rotation.
 */
import { gsap, SplitText, motion, unveil } from '@/scripts/lib/gsap';

export function initNext() {
  const title = document.querySelector<HTMLElement>('[data-next-title]');
  if (!title) return;

  unveil(title);

  title.querySelectorAll<HTMLElement>('[data-next-line]').forEach((line, index) => {
    SplitText.create(line, {
      type: 'chars',
      mask: 'chars',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.chars, {
          yPercent: 115,
          rotate: 6,
          transformOrigin: '0% 100%',
          duration: 1.3,
          stagger: motion.stagger.tight,
          delay: index * 0.12,
          scrollTrigger: { trigger: title, start: 'top 80%', once: true },
        }),
    });
  });
}
