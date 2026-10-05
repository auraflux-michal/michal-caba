/**
 * Mirror read-out: tweens the fog (--fog 1 → 0), the percentage counter and the stage name.
 */
import { gsap, motion } from '@/scripts/lib/gsap';

export function createMirror(root: ParentNode, reducedMotion: boolean) {
  const mirror = root.querySelector<HTMLElement>('[data-mirror]');
  const percents = [...root.querySelectorAll<HTMLElement>('[data-mirror-percent]')];
  const stages = [...root.querySelectorAll<HTMLElement>('[data-mirror-stage]')];
  const counter = { value: 0 };
  let currentStage = stages[0]?.textContent?.trim() ?? '';

  const writePercent = () => {
    const text = `${Math.round(counter.value)}%`;
    percents.forEach((el) => (el.textContent = text));
  };

  return function update(percent: number, stage: string, animate = true) {
    const duration = animate && !reducedMotion ? motion.duration.slow : 0;

    if (mirror) gsap.to(mirror, { '--fog': 1 - percent / 100, duration, ease: 'power2.out' });
    gsap.to(counter, { value: percent, duration, ease: 'power2.out', onUpdate: writePercent });
    if (!duration) writePercent();

    if (stage === currentStage) return;
    currentStage = stage;
    stages.forEach((el) => {
      if (!duration) {
        el.textContent = stage;
        return;
      }
      gsap
        .timeline()
        .to(el, { autoAlpha: 0, y: -8, duration: 0.25, ease: 'power2.in' })
        .call(() => {
          el.textContent = stage;
        })
        .fromTo(el, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.8 });
    });
  };
}
