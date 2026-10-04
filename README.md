# Michał Caba — personal brand

Landing page built from the Figma file *auraflux / personal-brand* — **Astro 7 + Tailwind CSS 4 + GSAP 3 + Lenis**.
Design system & conventions: see [`DESIGN.md`](./DESIGN.md).

## Getting started

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # astro check + static build → dist/
npm run preview
```

Node ≥ 22.12 (see `.nvmrc`).

## Structure

```
src/
├─ assets/          images (optimised by astro:assets) & SVG icons (imported as components)
├─ components/
│  ├─ layout/       Header, IndexMenu, Footer
│  ├─ sections/     Hero, About, Roles, Build, Philosophy, Notes, Next
│  └─ ui/           SectionLabel, Tag, SplitLines
├─ data/            site.ts (links, nav, SEO) · content.ts (roles, notes)
├─ layouts/         BaseLayout (SEO, fonts, motion bootstrap)
├─ scripts/
│  ├─ lib/          gsap.ts (plugins, eases) · smooth-scroll.ts (Lenis, anchors)
│  ├─ animations/   one module per section / concern
│  └─ main.ts       client entry
└─ styles/          tokens.css (@theme) · base.css · utilities.css
```

## Editing content

- Links (consultation, socials, Auraflux): `src/data/site.ts`
- Roles & notes: `src/data/content.ts` — add `href` to a note to make its row a link.

## Indexing (pre-launch)

The site is currently **noindex**: `<meta name="robots">` and the `X-Robots-Tag` header
(`vercel.json`). `robots.txt` deliberately allows crawling so search engines can see the noindex.
To launch: set `indexable: true` in `src/data/site.ts` and remove the `X-Robots-Tag` header.

## Deploy

Static output, zero-config on Vercel (`vercel.json` adds immutable caching for `/_astro/*`).
