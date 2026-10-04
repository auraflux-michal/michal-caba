/**
 * "INDEX +" overlay: clip-path curtain, staggered links, scroll lock, focus management,
 * Escape to close, and anchor navigation after the curtain closes.
 */
import { gsap, motion } from '@/scripts/lib/gsap';
import { getLenis, scrollToTarget } from '@/scripts/lib/smooth-scroll';

export function initMenu(reducedMotion: boolean) {
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const label = document.querySelector<HTMLElement>('[data-menu-toggle-label]');
  if (!menu || !toggle) return { isOpen: () => false };

  const links = [...menu.querySelectorAll<HTMLAnchorElement>('[data-menu-link]')];
  let open = false;
  let tl: gsap.core.Timeline | null = null;

  const setOpen = (next: boolean, onClosed?: () => void) => {
    if (next === open) return;
    open = next;
    toggle.setAttribute('aria-expanded', String(open));
    if (label) label.textContent = open ? 'Zamknij' : 'Index';
    tl?.kill();

    if (open) {
      menu.hidden = false;
      getLenis()?.stop();
      document.documentElement.style.overflow = 'hidden';
      tl = gsap
        .timeline({ defaults: { duration: reducedMotion ? 0 : motion.duration.slow } })
        .to(menu, { clipPath: 'inset(0% 0% 0% 0%)', ease: motion.easeInOut })
        .fromTo(
          links,
          { yPercent: 100 },
          { yPercent: 0, stagger: 0.05, ease: motion.ease },
          reducedMotion ? 0 : 0.35,
        );
      links[0]?.focus({ preventScroll: true });
    } else {
      tl = gsap
        .timeline({
          defaults: { duration: reducedMotion ? 0 : 0.7 },
          onComplete: () => {
            menu.hidden = true;
            document.documentElement.style.overflow = '';
            getLenis()?.start();
            onClosed?.();
          },
        })
        .to(menu, { clipPath: 'inset(0% 0% 100% 0%)', ease: motion.easeInOut });
      if (!onClosed) toggle.focus({ preventScroll: true });
    }
  };

  toggle.addEventListener('click', () => setOpen(!open));

  links.forEach((link) =>
    link.addEventListener('click', (event) => {
      const target = document.getElementById(link.hash.slice(1));
      if (!target) return;
      event.preventDefault();
      setOpen(false, () => scrollToTarget(target, true));
    }),
  );

  document.addEventListener('keydown', (event) => {
    if (!open) return;
    if (event.key === 'Escape') {
      setOpen(false);
      return;
    }
    // Focus trap: cycle between the toggle and the menu links
    if (event.key === 'Tab') {
      const focusables = [toggle, ...links];
      const index = focusables.indexOf(document.activeElement as HTMLAnchorElement);
      const nextIndex = event.shiftKey
        ? (index - 1 + focusables.length) % focusables.length
        : (index + 1) % focusables.length;
      event.preventDefault();
      focusables[nextIndex]?.focus();
    }
  });

  return { isOpen: () => open };
}
