/**
 * Client entry. Boots smooth scroll + section animations once fonts are ready
 * (so SplitText measures final line breaks). Everything degrades to static content
 * when JavaScript is off or the visitor prefers reduced motion.
 */
import { ScrollTrigger, prefersReducedMotion } from '@/scripts/lib/gsap';
import { initAnchorLinks, initSmoothScroll, scrollToTarget } from '@/scripts/lib/smooth-scroll';
import { initMenu } from '@/scripts/animations/menu';
import { initHeader } from '@/scripts/animations/header';
import { initHero } from '@/scripts/animations/hero';
import { initReveals } from '@/scripts/animations/reveal';
import { initParallax } from '@/scripts/animations/parallax';
import { initRoles } from '@/scripts/animations/roles';
import { initPhilosophy } from '@/scripts/animations/philosophy';
import { initNotes } from '@/scripts/animations/notes';
import { initNext } from '@/scripts/animations/next';

declare global {
  interface Window {
    __motionReady?: boolean;
  }
}

async function boot() {
  const reducedMotion = prefersReducedMotion();

  initAnchorLinks();
  const menu = initMenu(reducedMotion);

  if (reducedMotion) {
    window.__motionReady = true;
    return;
  }

  await document.fonts.ready;

  initSmoothScroll();
  initHeader(menu.isOpen);
  initHero();
  initReveals();
  initParallax();
  initRoles();
  initPhilosophy();
  initNotes();
  initNext();

  window.__motionReady = true;
  ScrollTrigger.refresh();

  // Deep links (e.g. /#notes): jump after layout & triggers are settled
  const hashTarget = location.hash && document.getElementById(location.hash.slice(1));
  if (hashTarget) requestAnimationFrame(() => scrollToTarget(hashTarget, true));
}

boot();
