/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger and Lenis share one RAF.
 * Also owns in-page anchor navigation (works with and without Lenis).
 */
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';

let lenis: Lenis | null = null;

export function initSmoothScroll(): Lenis {
  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export const getLenis = () => lenis;

/** Scroll to an in-page target and move focus there for keyboard / screen-reader users. */
export function scrollToTarget(target: HTMLElement, immediate = false) {
  const focusTarget = () => {
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  };

  if (lenis) {
    lenis.scrollTo(target, { immediate, onComplete: focusTarget });
  } else {
    target.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' });
    focusTarget();
  }
  history.replaceState(null, '', `#${target.id}`);
}

import type { initMenu } from '@/scripts/animations/menu';

/** Single in-page navigation path for every `a[href^="#"]`, including the INDEX menu links. */
export function initAnchorLinks(menu?: ReturnType<typeof initMenu>) {
  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return;
    const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;

    const id = link.getAttribute('href')!.slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target) return;

    event.preventDefault();
    // Scrolling is locked while the INDEX menu is open or closing: close it, then jump
    if (menu?.isBusy()) {
      menu.close(() => scrollToTarget(target, true));
      return;
    }
    scrollToTarget(target);
  });
}
