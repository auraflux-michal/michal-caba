/**
 * Mirror read-out: tweens the fog (--fog 1 → 0), the score counter, the stage name and the
 * stage ladder. Every `[data-mirror-percent]` (panel + mobile nav) shows the same number.
 */
import { gsap, motion } from '@/scripts/lib/gsap';
import { lustroStages } from '@/data/lustro';

export function createMirror(root: ParentNode, reducedMotion: boolean) {
  const mirror = root.querySelector<HTMLElement>('[data-mirror]');
  const percents = [...root.querySelectorAll<HTMLElement>('[data-mirror-percent]')];
  const stages = [...root.querySelectorAll<HTMLElement>('[data-mirror-stage]')];
  const ladder = [...root.querySelectorAll<HTMLElement>('[data-ladder-step]')];
  const counter = { value: 0 };
  let currentStage = stages[0]?.textContent?.trim() ?? '';

  const writePercent = () => {
    const text = String(Math.round(counter.value));
    percents.forEach((el) => (el.textContent = text));
  };

  return function update(percent: number, stage: string, animate = true) {
    const duration = animate && !reducedMotion ? motion.duration.slow : 0;

    // sqrt curve: the first ticks clear the glass visibly (6% → fog 0.76, 50% → 0.29)
    const fog = 1 - Math.sqrt(percent / 100);
    if (mirror) gsap.to(mirror, { '--fog': fog, duration, ease: 'power2.out' });
    gsap.to(counter, { value: percent, duration, ease: 'power2.out', onUpdate: writePercent });
    if (!duration) writePercent();

    const here = lustroStages.findIndex((entry) => entry.name === stage);
    ladder.forEach((step, index) => {
      step.dataset.state = index < here ? 'past' : index === here ? 'here' : 'future';
    });

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
    // A new stage is a moment: pulse the mirror frame
    if (mirror && duration) {
      gsap.fromTo(
        mirror,
        { scale: 1 },
        { scale: 1.04, duration: 0.3, yoyo: true, repeat: 1, ease: 'power2.out' },
      );
    }
  };
}
