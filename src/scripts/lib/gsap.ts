/**
 * Single GSAP entry point: registers plugins once and sets house easing/durations
 * (mirrors the motion tokens in src/styles/tokens.css).
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

/** Token parity: --ease-out-expo / --ease-in-out-quart */
CustomEase.create('expo', '0.19, 1, 0.22, 1');
CustomEase.create('inOutQuart', '0.76, 0, 0.24, 1');

export const motion = {
  ease: 'expo',
  easeInOut: 'inOutQuart',
  duration: { fast: 0.2, base: 0.45, slow: 0.9, reveal: 1.2 },
  stagger: { tight: 0.04, base: 0.08, loose: 0.12 },
  /** Default viewport entry point for scroll-triggered reveals */
  start: 'top 85%',
} as const;

gsap.defaults({ ease: motion.ease, duration: motion.duration.slow });

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Make an element hidden by `html.is-animated [data-reveal]` visible again before tweening it */
export const unveil = (target: gsap.TweenTarget) => gsap.set(target, { visibility: 'visible' });

export { gsap, ScrollTrigger, SplitText };
