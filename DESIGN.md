# DESIGN.md: Michał Caba / personal brand

Source of truth: Figma **auraflux → Brandbook → `personal-brand`** (node `899:511`, frame 1440 × 7085).
Implementation: Astro 7 · Tailwind CSS 4 (CSS-first `@theme`) · GSAP 3 (ScrollTrigger, SplitText) · Lenis.

---

## 1. Principles

1. **Pixel-perfect @1440.** Every desktop dimension is the Figma value in `rem` (px / 16).
2. **Fluid, proportional desktop.** From `lg` (1024px) the root font-size is `(100vw − scrollbar) / 90`,
   so 1rem = 16px at exactly 1440px and the whole composition scales 1:1 between 1024 and 1920px
   (capped above). Verified by full-page diff against the Figma render.
3. **Tokens only.** The Tailwind palette and font stacks are reset (`--color-*: initial`); only the
   brand tokens below exist. No hex values in components.
4. **Content ≠ presentation.** Copy and lists live in `src/data/*`; sections are presentational.
5. **Progressive enhancement.** HTML is complete and readable without JS. Motion is opt-in via
   `data-*` attributes and fully disabled for `prefers-reduced-motion`.

## 2. Tokens (`src/styles/tokens.css`)

### Colour

| Token          | Hex       | Use                                             |
| -------------- | --------- | ----------------------------------------------- |
| `ink`          | `#0B0B0B` | Dark sections, primary text on light            |
| `paper`        | `#F1EEE8` | Light sections/cards, text on dark              |
| `accent`       | `#DB392D` | Brand red: rail, highlights, tags, reading time |
| `muted`        | `#767676` | Meta text (hero rail, taglines)                 |
| `line`         | `#272727` | Hairlines on ink (header, hero rail, footer)    |
| `silver`       | `#C0C0C0` | Portrait backdrop                               |
| `white`        | `#FFFFFF` | Header navigation                               |

Photography is graded monochrome (`photo-mono`): Figma uses `mix-blend-luminosity` over
neutral/zero-saturation backdrops, which is mathematically a greyscale filter.

### Typography

Families: **Space Grotesk** (display, variable 300-700) and **Manrope** (body, variable 200-800),
self-hosted via the Astro Fonts API from `@fontsource-variable/*` (latin + latin-ext for Polish),
preloaded, with metric-matched fallbacks (no CLS).

| Token               | Desktop (size / line) | Weight / family     | Where                          |
| ------------------- | --------------------- | ------------------- | ------------------------------ |
| `display`           | 200 / 200             | Bold · Space Grotesk| `#1METR DALEJ`                 |
| `display-tight`     | 200 / 168             | Bold · Space Grotesk| `WHAT’S NEXT?`                 |
| `numeral`           | 168 / 200             | Bold · Space Grotesk| `_01 _02 _03`                  |
| `h1`                | 88 / 88               | Bold · Space Grotesk| Hero headline (uppercase)      |
| `h2`                | 56 / 64               | Bold · Space Grotesk| Section headings, role titles  |
| `h3`                | 40 / 56               | Bold · Space Grotesk| Manifesto, closing line        |
| `h4`                | 32 / 40               | Bold · Space Grotesk| Note titles                    |
| `lead`              | 24 / 36               | Medium · Manrope    | Hero quote                     |
| `body`              | 20 / 32               | Medium · Manrope    | Paragraphs                     |
| `label`             | 18 / 28               | Regular/Bold · SG   | Section labels, nav, meta      |

Each has a fluid `*-sm` twin used below `lg` (e.g. `text-h1-sm lg:text-h1`).

### Spacing & layout

| Token     | Value | Meaning                                         |
| --------- | ----- | ----------------------------------------------- |
| `header`  | 77px  | Site header / hero rail (76 + 1px rule)         |
| `label`   | 76px  | Section label row & label boxes                 |
| `gutter`  | 40px  | Outer page gutter (`gutter-x` → 20px on mobile) |
| `inset`   | 80px  | Content inset for headings                      |
| `rail`    | 360px | Accent rail / label-box width (¼ of 1440)       |

Grid splits used by the design: 50/50 (hero rail, Człowiek), 360 | 1080 (Role),
960 | 480 (Buduję), 569 → 1360 list (Notes). Section labels always sit at 40 / 24.

### Motion

| Token              | Value                          |
| ------------------ | ------------------------------ |
| `ease-out-expo`    | `cubic-bezier(0.19,1,0.22,1)`  |
| `ease-in-out-quart`| `cubic-bezier(0.76,0,0.24,1)`  |
| durations          | 200 / 450 / 900 ms (+1.2s reveals) |

Mirrored in GSAP as custom eases `expo` / `inOutQuart` (`src/scripts/lib/gsap.ts`).

## 3. Sections (Figma → component)

| Figma (y)          | Component                     | Notes                                                    |
| ------------------ | ----------------------------- | -------------------------------------------------------- |
| 0-800              | `sections/Hero.astro`         | Height `min(800px, 100svh)`; H1/rule/quote keep exact relative offsets, group at Figma's proportional depth (311px @ 800). Last line rotates (`heroPhrases` in data) |
| 800-1600           | `sections/About.astro`        | Exact Figma fill crop on portrait; paper panel starts in hero rail |
| 1600-2816          | `sections/Roles.astro`        | Red digits vanish into the red rail (layering, no mask)   |
| 2816-3616 (+76)    | `sections/Build.astro`        | Card overlaps “Filozofia” by 76px, as designed           |
| 3616-4879          | `sections/Philosophy.astro`   | `DALEJ` offset in `em` (0.745em / −0.155em)              |
| 4879-5823          | `sections/Notes.astro`        | Rows render as links once `href` is set in data          |
| 5823-6931          | `sections/Next.astro`         | Figma 910:704: content column x=700 (shared with footer), portrait + `ui/CtaRow` "Porozmawiajmy" (booking) |
| 6931-7184          | `layout/Footer.astro`         | Middle column at 50% - 20px (x=700)                      |

UI primitives: `ui/SectionLabel`, `ui/Tag`, `ui/SplitLines`, `ui/CtaRow`. Layout: `layout/Header`, `layout/IndexMenu`.

## 4. Motion system

All motion is declared in markup and implemented in `src/scripts/animations/*` (one module per concern):

| Attribute                         | Effect                                                          |
| --------------------------------- | --------------------------------------------------------------- |
| `data-reveal data-split-lines`    | Lines rise through masks (SplitText, auto re-split on resize)   |
| `data-reveal` (+`data-fade`)      | Fade-up                                                         |
| `data-reveal data-wipe/pop/clip-up` | Clip-path wipes (labels, tags, small media)                   |
| `data-reveal="custom"`            | Owned by a section module (hero, #1METR, What’s next)           |
| `data-parallax-frame/media`       | Curtain reveal + scrubbed parallax                              |

Signature moments: hero intro timeline · rotating headline line (W ludziach → W firmach → W pomysłach) · "current" pulse running along the hero rule into #1metrDalej · role numerals sliding out of the rail · **`DALEJ` scrubbed
“one metre further”** · notes hairlines drawing · INDEX overlay curtain.
Lenis drives smooth scroll on GSAP’s ticker. `html.is-animated` (set inline before paint) hides
reveal targets only when motion will actually run; a 3s failsafe unhides everything.

## 5. Accessibility

Semantic landmarks & heading order, skip link, `aria-labelledby` per section, decorative numerals
`aria-hidden` with SR-only text, focus-visible ring in accent, menu as modal dialog
(focus trap, Esc, focus return), external links announced, reduced-motion respected.

## 6. Known design normalisations

- Role title offsets in Figma vary by a few px (32/27/31 from the numeral, “Founder” +9px x);
  implemented on one consistent offset (32px, x = 583).
- Header, notes and role copy that repeats placeholder text in Figma is kept verbatim in `src/data/content.ts`.
