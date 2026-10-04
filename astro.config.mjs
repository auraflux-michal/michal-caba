// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

/** Unicode ranges as published by Fontsource — Polish diacritics live in latin-ext. */
const UNICODE_RANGES = {
  latin:
    'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD',
  'latin-ext':
    'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF',
};

/**
 * Two @font-face variants per family (latin + latin-ext), sourced from @fontsource-variable/*.
 * @param {string} slug Fontsource package slug
 * @param {string} weight Variable weight axis range
 */
const fontsourceVariants = (slug, weight) => {
  /** @param {'latin' | 'latin-ext'} subset */
  const variant = (subset) => ({
    src: /** @type {[string]} */ ([
      `./node_modules/@fontsource-variable/${slug}/files/${slug}-${subset}-wght-normal.woff2`,
    ]),
    weight,
    style: /** @type {const} */ ('normal'),
    unicodeRange: /** @type {[string]} */ ([UNICODE_RANGES[subset]]),
  });
  /** @type {[ReturnType<typeof variant>, ReturnType<typeof variant>]} */
  const variants = [variant('latin'), variant('latin-ext')];
  return variants;
};

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // Overridable for preview hosts (GitHub Pages serves the project under /michal-caba/)
  site: process.env.SITE_URL ?? 'https://michalcaba.pl',
  base: process.env.BASE_PATH ?? '/',
  compressHTML: true,
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  image: {
    // Styling is owned by Tailwind (unlayered Astro image CSS would override utility layers)
    responsiveStyles: false,
    layout: 'constrained',
  },
  // Self-hosted variable fonts from npm (@fontsource-variable/*): no third-party requests at
  // build or run time. Astro generates @font-face, preload links and metric-matched fallbacks.
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Space Grotesk',
      cssVariable: '--font-space-grotesk',
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
      options: { variants: fontsourceVariants('space-grotesk', '300 700') },
    },
    {
      provider: fontProviders.local(),
      name: 'Manrope',
      cssVariable: '--font-manrope',
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
      options: { variants: fontsourceVariants('manrope', '200 800') },
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
