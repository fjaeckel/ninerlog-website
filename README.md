# NinerLog Website

Public-facing marketing website for [NinerLog](https://ninerlog.com) — the free, open-source pilot logbook.

## Tech Stack

- **Markup:** HTML + [Nunjucks](https://mozilla.github.io/nunjucks/) templates
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin)
- **Fonts:** [Fontsource](https://fontsource.org/), self-hosted (Plus Jakarta Sans, Inter, JetBrains Mono) — latin-subset woff2 files copied from `node_modules` into `_site/fonts` by `npm run build:fonts`
- **Icons:** Inline SVGs from [Lucide](https://lucide.dev/)
- **Hosting:** [GitHub Pages](https://pages.github.com/)

## Getting Started

```bash
npm install
npm run dev       # Dev server → http://localhost:8080
npm run build     # Production build → _site/
```

## Project Structure

```
src/
├── pages/          # Nunjucks page templates → _site/*.html (subdirs preserved)
│   ├── index.njk               # Landing page
│   ├── features.njk            # Features page
│   ├── easa-logbook.njk        # EASA currency landing page
│   ├── faa-logbook.njk         # FAA currency landing page
│   ├── free-pilot-logbook.njk  # No-subscription landing page
│   ├── self-hosted.njk         # Self-hosting / flying club landing page
│   ├── import-export.njk       # Import & export landing page
│   ├── open-source.njk         # Open Source page
│   ├── donate.njk              # Donate page
│   ├── about.njk               # About page
│   ├── privacy.njk             # Privacy Policy
│   ├── terms.njk               # Terms of Service
│   ├── imprint.njk             # Impressum
│   ├── 404.njk                 # Custom 404
│   └── de/                     # German pages → _site/de/*.html
│       ├── flugbuch.njk
│       ├── open-source-flugbuch.njk
│       ├── vereinsflugbuch.njk
│       └── selbst-hosten.njk
├── layouts/
│   └── base.njk         # Base HTML shell
├── partials/
│   ├── head.njk         # <head> with meta, OG, fonts, CSS
│   ├── header.njk       # Sticky nav + wordmark + mobile menu
│   ├── footer.njk       # 4-column footer
│   └── scripts.njk      # Scroll reveal + mobile menu JS
└── input.css            # Tailwind directives + custom CSS
```

## Adding a New Page

1. Create `src/pages/new-page.njk` extending `layouts/base.njk`
2. Set page metadata variables (`pageTitle`, `pageDescription`, `pagePath`)
3. Set `sitemapChangefreq` and `sitemapPriority` — the build fails without them,
   so a page cannot silently go missing from the sitemap
4. Update nav links in `src/partials/header.njk` and `src/partials/footer.njk`
5. Run `npm run build`

`sitemap.xml` is generated from the pages by `scripts/generate-sitemap.mjs` and
written to `_site/`; it is not checked in. `<lastmod>` comes from the last commit
touching each page file, which is why CI checks out full history. To exclude a
page from the sitemap entirely, add it to `EXCLUDED` in that script (as `404.njk` is).

## Languages (EN / DE)

German pages live in `src/pages/de/` and build to `_site/de/*.html`. A page
declares its language and its counterpart with page variables:

| Variable | Purpose |
|---|---|
| `pageLang` | `"de"` on German pages; sets `<html lang>`, `og:locale`, and switches nav/footer labels |
| `altDe` | On an **English** page: path of its German counterpart |
| `altEn` | On a **German** page: path of its English counterpart |
| `skipToContentLabel` | Translated skip link text |

`altDe` / `altEn` drive the `hreflang` block in `src/partials/head.njk`. They are
emitted **only** when a genuine counterpart exists — hreflang must be reciprocal
and point at real equivalents, so a page with no translation (e.g.
`/de/vereinsflugbuch`) deliberately emits none.

The sitemap's `xhtml:link` alternates are derived from the same variables, so
they cannot drift from the page markup. The generator also enforces reciprocity:
if one page of a pair declares its counterpart and the counterpart does not
declare it back, the build fails rather than shipping an annotation that search
engines would discard.

## Deployment

Push to `main` → GitHub Actions builds → deploys to GitHub Pages at [ninerlog.com](https://ninerlog.com).

## Related Repositories

| Repository | Description |
|---|---|
| [ninerlog-api](https://github.com/fjaeckel/ninerlog-api) | Go backend REST API (includes OpenAPI spec) |
| [ninerlog-frontend](https://github.com/fjaeckel/ninerlog-frontend) | React/TypeScript PWA frontend |

## Contributing

See [CONTRIBUTING.md](https://github.com/fjaeckel/ninerlog-api/blob/main/CONTRIBUTING.md) for development guidelines.
