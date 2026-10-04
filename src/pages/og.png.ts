/**
 * Open Graph image (1200×630), rendered at build time with Satori → Resvg.
 * Same type, palette and composition as the hero: headline, accent "current" rule, portrait.
 * Fonts come from @fontsource (static .woff, which Satori can read; it cannot read woff2).
 */
import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { site } from '@/data/site';

const require = createRequire(import.meta.url);
const font = (pkg: string, file: string) => readFile(require.resolve(`${pkg}/files/${file}`));

// Brand tokens (mirrors src/styles/tokens.css)
const INK = '#0b0b0b';
const PAPER = '#f1eee8';
const ACCENT = '#db392d';
const MUTED = '#767676';
const LINE = '#272727';
const SILVER = '#c0c0c0';

// latin + latin-ext (Polish diacritics) are separate files: list both so Satori falls back per glyph
const DISPLAY = 'Space Grotesk, Space Grotesk Ext';
const BODY = 'Manrope, Manrope Ext';

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({
  type,
  props: { style: { display: 'flex', ...style }, children },
});

export const GET: APIRoute = async () => {
  const [spaceBold, spaceBoldExt, spaceRegular, manrope, manropeExt] = await Promise.all([
    font('@fontsource/space-grotesk', 'space-grotesk-latin-700-normal.woff'),
    font('@fontsource/space-grotesk', 'space-grotesk-latin-ext-700-normal.woff'),
    font('@fontsource/space-grotesk', 'space-grotesk-latin-400-normal.woff'),
    font('@fontsource/manrope', 'manrope-latin-500-normal.woff'),
    font('@fontsource/manrope', 'manrope-latin-ext-500-normal.woff'),
  ]);

  // Monochrome portrait, as on the site (Figma: mix-blend-luminosity)
  const portrait = await sharp(resolve('src/assets/images/michal-footer.png')) // build runs from the project root
    .flatten({ background: SILVER }) // transparent PNG backdrop → silver, as on the site
    .grayscale()
    .resize({ width: 600 })
    .jpeg({ quality: 82 })
    .toBuffer();
  const portraitSrc = `data:image/jpeg;base64,${portrait.toString('base64')}`;

  const label = (text: string, color: string) =>
    h(
      'div',
      { fontFamily: DISPLAY, fontSize: 22, fontWeight: 700, color, letterSpacing: 0.5 },
      text,
    );

  const tree = h(
    'div',
    {
      width: 1200,
      height: 630,
      position: 'relative',
      backgroundColor: INK,
      flexDirection: 'column',
      fontFamily: DISPLAY,
    },
    [
      // Top bar
      h(
        'div',
        {
          height: 84,
          padding: '0 56px',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${LINE}`,
        },
        [label(site.name.toUpperCase(), PAPER), label('#1metrDalej', ACCENT)],
      ),
      // Headline
      h(
        'div',
        {
          position: 'absolute',
          left: 56,
          top: 150,
          flexDirection: 'column',
          fontSize: 104,
          fontWeight: 700,
          lineHeight: 1,
          color: PAPER,
          textTransform: 'uppercase',
        },
        [
          h('div', {}, 'Widzę'),
          h('div', { color: ACCENT }, 'Potencjał'),
          h('div', {}, 'W ludziach'),
        ],
      ),
      // Accent "current" rule from Potencjał towards the portrait
      h('div', {
        position: 'absolute',
        left: 644,
        top: 304,
        width: 164,
        height: 3,
        backgroundImage: `linear-gradient(90deg, ${ACCENT}, ${PAPER})`,
      }),
      // Portrait (bottom-right, flush with the bottom edge)
      h(
        'div',
        {
          position: 'absolute',
          right: 56,
          bottom: 0,
          width: 300,
          height: 370,
          backgroundColor: SILVER,
          overflow: 'hidden',
        },
        [
          {
            type: 'img',
            props: { src: portraitSrc, width: 300, height: 375, style: { objectFit: 'cover' } },
          },
        ],
      ),
      // Bottom meta
      h(
        'div',
        {
          position: 'absolute',
          left: 56,
          bottom: 48,
          fontFamily: BODY,
          fontSize: 26,
          fontWeight: 500,
          color: MUTED,
        },
        site.person.jobTitles.join('  /  '),
      ),
    ],
  );

  const svg = await satori(tree as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Space Grotesk', data: spaceBold, weight: 700, style: 'normal' },
      { name: 'Space Grotesk Ext', data: spaceBoldExt, weight: 700, style: 'normal' },
      { name: 'Space Grotesk', data: spaceRegular, weight: 400, style: 'normal' },
      { name: 'Manrope', data: manrope, weight: 500, style: 'normal' },
      { name: 'Manrope Ext', data: manropeExt, weight: 500, style: 'normal' },
    ],
  });

  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' },
  });
};
