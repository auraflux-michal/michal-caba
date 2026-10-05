/**
 * Notes list: hairlines draw left → right in sequence, rows and the archive CTA follow.
 */
import { gsap, motion } from '@/scripts/lib/gsap';

export function initNotes() {
  const list = document.querySelector<HTMLElement>('[data-notes]');
  if (!list) return;

  const rules = list.querySelectorAll('[data-note-rule]');
  const rows = list.querySelectorAll('[data-note-row], [data-cta]');

  const tl = gsap.timeline({ scrollTrigger: { trigger: list, start: motion.start, once: true } });
  tl.from(rules, { scaleX: 0, duration: 1.4, ease: motion.easeInOut, stagger: 0.12 }, 0);
  tl.from(rows, { autoAlpha: 0, y: 32, duration: motion.duration.reveal, stagger: 0.12 }, 0.35);
}
