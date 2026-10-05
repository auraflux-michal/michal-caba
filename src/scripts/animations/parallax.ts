/**
 * Photography: curtain reveal on entry + gentle scroll-linked parallax inside the frame.
 * Frames must clip (`overflow-hidden`). Media that fills its frame edge to edge opts in to a
 * safety zoom with `data-parallax-cover`, so the vertical drift never reveals an edge.
 */
import { gsap, motion } from '@/scripts/lib/gsap';

export function initParallax() {
  document.querySelectorAll<HTMLElement>('[data-parallax-frame]').forEach((frame) => {
    const media = frame.querySelector<HTMLElement>('[data-parallax-media]');
    if (!media) return;

    const isCover = media.hasAttribute('data-parallax-cover');

    gsap.from(frame, {
      clipPath: 'inset(0% 0% 100% 0%)',
      duration: 1.6,
      ease: motion.easeInOut,
      scrollTrigger: { trigger: frame, start: 'top 90%', once: true },
    });

    gsap.fromTo(
      media,
      { yPercent: -4, scale: isCover ? 1.12 : 1 },
      {
        yPercent: 4,
        ease: 'none',
        scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  });
}
