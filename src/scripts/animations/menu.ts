/**
 * "INDEX +" overlay: clip-path curtain, staggered links, scroll lock, focus management and
 * Escape to close. In-page navigation (from the menu or anywhere else) goes through
 * initAnchorLinks, which closes the menu first via `close()`.
 */
import { gsap, motion } from '@/scripts/lib/gsap';
import { getLenis } from '@/scripts/lib/smooth-scroll';

export function initMenu(reducedMotion: boolean) {
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const label = document.querySelector<HTMLElement>('[data-menu-toggle-label]');
  if (!menu || !toggle) {
    return { isOpen: () => false, isBusy: () => false, close: (done?: () => void) => done?.() };
  }

  const links = [...menu.querySelectorAll<HTMLAnchorElement>('[data-menu-link]')];
  let open = false;
  let closing = false;
  const afterClose: Array<() => void> = [];
  let tl: gsap.core.Timeline | null = null;

  const setOpen = (next: boolean, onClosed?: () => void) => {
    if (next === open) return;
    open = next;
    toggle.setAttribute('aria-expanded', String(open));
    document.documentElement.toggleAttribute('data-menu-open', open);
    if (label) label.textContent = open ? 'Zamknij' : 'Index';
    tl?.kill();

    if (open) {
      closing = false;
      afterClose.length = 0;
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
      closing = true;
      if (onClosed) afterClose.push(onClosed);
      tl = gsap
        .timeline({
          defaults: { duration: reducedMotion ? 0 : 0.7 },
          onComplete: () => {
            closing = false;
            menu.hidden = true;
            document.documentElement.style.overflow = '';
            getLenis()?.start();
            afterClose.splice(0).forEach((done) => done());
          },
        })
        .to(menu, { clipPath: 'inset(0% 0% 100% 0%)', ease: motion.easeInOut });
      if (!onClosed) toggle.focus({ preventScroll: true });
    }
  };

  toggle.addEventListener('click', () => setOpen(!open));

  document.addEventListener('keydown', (event) => {
    if (!open) return;
    if (event.key === 'Escape') {
      setOpen(false);
      return;
    }
    // Focus trap: cycle through the toggle + every *visible* focusable in the menu
    // (breakpoint-only links such as the mobile "Konsultacja" are skipped)
    if (event.key === 'Tab') {
      const focusables = [
        toggle,
        ...menu.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      ].filter((el) => el.getClientRects().length > 0);
      const index = focusables.indexOf(document.activeElement as HTMLElement);
      const last = focusables.length - 1;
      const nextIndex =
        index === -1 // focus outside the list (e.g. after a click): enter at the matching end
          ? event.shiftKey
            ? last
            : 0
          : event.shiftKey
            ? (index - 1 + focusables.length) % focusables.length
            : (index + 1) % focusables.length;
      event.preventDefault();
      focusables[nextIndex]?.focus();
    }
  });

  return {
    isOpen: () => open,
    /** Open or still animating closed: page scrolling is locked */
    isBusy: () => open || closing,
    /** Close (or finish closing), then run `done` once scrolling is unlocked */
    close: (done?: () => void) => {
      if (open) setOpen(false, done);
      else if (closing) {
        if (done) afterClose.push(done);
      } else done?.();
    },
  };
}
