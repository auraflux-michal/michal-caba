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
│  ├─ lustro/       Mirror + quiz screens for /lustro
│  └─ ui/           SectionLabel, Tag, SplitLines, CtaRow, EmailLink
├─ data/            site.ts (links, nav, SEO) · content.ts (roles, notes) · lustro.ts (quiz)
├─ pages/           index · lustro · api/lustro (Vercel Function) · robots/sitemap/llms
├─ layouts/         BaseLayout (SEO, fonts, motion bootstrap)
├─ scripts/
│  ├─ lib/          gsap.ts (plugins, eases) · smooth-scroll.ts (Lenis, anchors)
│  ├─ animations/   one module per section / concern
│  ├─ lustro/       quiz controller, mirror read-out, confetti
│  └─ main.ts       client entry
└─ styles/          tokens.css (@theme) · base.css · utilities.css
```

## Editing content

- Links (consultation, socials, Auraflux, privacy policy): `src/data/site.ts`
- Lustro quiz (items, stages, copy): `src/data/lustro.ts`
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

## Lustro marki osobistej (`/lustro`)

Interactive checklist + newsletter lead magnet. Content and scoring: `src/data/lustro.ts`
(shared by the page, the browser and the server). Progress is kept in `localStorage`.

**Newsletter → MailerLite.** The form posts to `/api/lustro` (`src/pages/api/lustro.ts`, a Vercel
Function); the API key stays on the server. Setup, once:

1. MailerLite → Integrations → API: create a token. In Vercel → Settings → Environment Variables
   add `MAILERLITE_API_KEY` (and optionally `MAILERLITE_GROUP_ID`, the group's numeric id), then redeploy.
2. MailerLite → Subscribers → Fields: create `lustro_wynik` (Number), `lustro_etap` (Text),
   `lustro_braki` (Text), `lustro_braki_2` (Text, overflow of long lists). `name` exists already.
3. MailerLite → Account settings → Subscribe settings: switch on **Double opt-in for API and
   integrations** (GDPR: every subscriber confirms by e-mail first).
4. Build the welcome automation on the group, e.g. `{$name}`, `{$lustro_etap}`, `{$lustro_braki}`.

The server recomputes score / stage / missing items from the submitted checkbox ids, validates
e-mail + consent, rejects cross-origin posts and drops honeypot submissions.

**Analytics.** `src/scripts/lib/analytics.ts` sends `lustro_start`, `lustro_complete`,
`lustro_signup` (Meta: `Lead`) to GA4 (`gtag`/`dataLayer`) and/or Meta Pixel (`fbq`) once either
is installed; until then the calls are no-ops. Both need a cookie-consent banner first.

**Links:** privacy policy = `site.privacyUrl` (`#` until the page exists), booking =
`site.consultationUrl`. Social card: `public/og-lustro.png`.

## Indexing

Live: `indexable: true` in `src/data/site.ts`. Production builds get
`index, follow, max-image-preview:large`; Vercel preview deployments (`VERCEL_ENV` ≠ `production`)
are always `noindex`. To hide the site again, set `indexable: false`.

## Deploy

Pages are prerendered (static); `@astrojs/vercel` turns only `src/pages/api/*`
(`prerender = false`) into Vercel Functions. `vercel.json` adds immutable caching for `/_astro/*`.
Local: `npm run dev` (the endpoint answers `503 not_configured` without `MAILERLITE_API_KEY` in `.env`).
