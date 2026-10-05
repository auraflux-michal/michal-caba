# Michał Caba: personal brand

Landing page built from the Figma file *auraflux / personal-brand*: **Astro 7 + Tailwind CSS 4 + GSAP 3 + Lenis**.
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
- Roles & notes: `src/data/content.ts`: add `href` to a note to make its row a link.

## SEO & GEO

- `<head>`: title/description, canonical, robots, Open Graph (`profile`), Twitter card, icons.
- Social card: `public/og.png` (1200×630, designed asset). Replace the file to update it;
  social platforms cache previews, so re-scrape after changing it.
- Structured data (`src/lib/seo.ts`): one schema.org `@graph`: WebSite → ProfilePage → Person
  (jobTitle, knowsAbout, hasOccupation, sameAs) ↔ Organization (Auraflux, founder).
- Generated endpoints: `/robots.txt` (AI crawlers explicitly allowed), `/sitemap.xml`,
  `/llms.txt` (plain-language summary for AI answer engines).
- All of it is built from `src/data/site.ts` + `src/data/content.ts`: edit facts there.
- **Domain:** absolute URLs use `SITE_URL` if set, otherwise Vercel's production domain
  (`VERCEL_PROJECT_PRODUCTION_URL`: the vercel.app URL now, the custom domain once assigned).

## Indexing

Live: `indexable: true` in `src/data/site.ts`. Production builds get
`index, follow, max-image-preview:large`; Vercel preview deployments (`VERCEL_ENV` ≠ `production`)
and the GitHub Pages preview are always `noindex`. To hide the site again, set `indexable: false`.

## Deploy

Static output, zero-config on Vercel (`vercel.json` adds immutable caching for `/_astro/*`).
