/**
 * Roles: the accent rail grows down with scroll, and each numeral slides out of it —
 * red digits are invisible on the red rail, so they appear to emerge from the wall.
 */
import { gsap } from '@/scripts/lib/gsap';

export function initRoles() {
  const rail = document.querySelector('[data-rail]');
  const section = rail?.closest('section');

  gsap.matchMedia().add('(min-width: 64rem)', () => {
    if (rail && section) {
      gsap.from(rail, {
        scaleY: 0,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top 75%', end: 'top 10%', scrub: 0.6 },
      });
    }

    document.querySelectorAll<HTMLElement>('[data-role]').forEach((role) => {
      const digits = role.querySelector('[data-role-digits]');
      if (!digits) return;
      gsap.from(digits, {
        xPercent: -70,
        ease: 'none',
        scrollTrigger: { trigger: role, start: 'top 90%', end: 'top 45%', scrub: 0.8 },
      });
    });
  });
}
