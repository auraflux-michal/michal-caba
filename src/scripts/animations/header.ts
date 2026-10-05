/**
 * Header auto-hide: slides away while scrolling down, returns on scroll up / near the top.
 */
import { gsap, ScrollTrigger, unveil } from '@/scripts/lib/gsap';

export function initHeader(isMenuOpen: () => boolean) {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;

  const show = gsap.quickTo(header, 'yPercent', { duration: 0.6, ease: 'expo' });
  let hidden = false;

  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      const shouldHide = self.direction === 1 && self.scroll() > window.innerHeight * 0.4;
      if (isMenuOpen() || shouldHide === hidden) return;
      hidden = shouldHide;
      show(hidden ? -100 : 0);
    },
  });

  // Keyboard users must always see the focused nav
  header.addEventListener('focusin', () => {
    hidden = false;
    show(0);
  });
}

/** Header entrance on pages without the hero (whose intro timeline normally slides it in) */
export function introHeader() {
  const header = document.querySelector('[data-header]');
  if (!header) return;
  unveil(header);
  gsap.from(header, { yPercent: -100, duration: 1 });
}
