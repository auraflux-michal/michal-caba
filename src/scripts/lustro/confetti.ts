/**
 * Confetti burst on a fixed canvas, in brand colours (read from the CSS tokens).
 * Skipped entirely for visitors who prefer reduced motion.
 */
import { prefersReducedMotion } from '@/scripts/lib/gsap';

const DURATION = 4200;
const TOKENS = ['accent', 'ink', 'paper', 'silver', 'muted', 'accent'];

let running = 0;

export function confetti(canvas: HTMLCanvasElement, count = 170) {
  if (prefersReducedMotion()) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const styles = getComputedStyle(document.documentElement);
  const colors = TOKENS.map(
    (token) => styles.getPropertyValue(`--color-${token}`).trim() || '#db392d',
  );
  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const parts = Array.from({ length: count }, () => ({
    x: width / 2 + (Math.random() - 0.5) * width * 0.3,
    y: height * 0.35,
    vx: (Math.random() - 0.5) * 14,
    vy: -Math.random() * 14 - 6,
    w: 6 + Math.random() * 7,
    h: 8 + Math.random() * 10,
    r: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.3,
    color: colors[Math.floor(Math.random() * colors.length)],
    square: Math.random() < 0.3,
  }));

  const id = ++running;
  const start = performance.now();
  const frame = (now: number) => {
    if (id !== running) return; // a newer burst took over the canvas
    const elapsed = now - start;
    ctx.clearRect(0, 0, width, height);
    ctx.globalAlpha = Math.max(0, 1 - elapsed / DURATION);
    for (const p of parts) {
      p.vy += 0.32;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.fillStyle = p.color;
      // Squares instead of the prototype's dots: the site's geometry is strictly rectilinear
      if (p.square) ctx.fillRect(-p.w / 2, -p.w / 2, p.w, p.w);
      else ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.r * 2)));
      ctx.restore();
    }
    if (elapsed < DURATION) requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, width, height);
  };
  requestAnimationFrame(frame);
}
