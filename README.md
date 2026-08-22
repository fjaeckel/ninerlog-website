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
│   ├── features.njk            # Features showcase (see below)
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
│   ├── ask-ai.njk       # "Learn more with AI" logo row, included by footer.njk
│   └── scripts.njk      # Scroll reveal + mobile menu JS
└── input.css            # Tailwind directives + custom CSS
```

## Light and dark

Three modes: **system** (the default — no stored preference), **light** and
**dark**. The toggle in the header cycles through them and stores the choice in
`localStorage` under `theme`; choosing *system* removes the key rather than
storing the word, so a visitor who never touches the button keeps following
their OS, including when it changes mid-visit.

The inline script at the top of `layouts/base.njk` runs before the first paint
and sets two things on `<html>`: the `dark` class (which drives Tailwind's
`dark:` variant, configured as `@custom-variant dark (&:is(.dark *))`) and
`data-theme-mode`, which selects the toggle's icon purely in CSS. Both have to
happen there — doing either after load flashes the wrong state.

Page chrome — header, footer, hero sections, the 404 — is navy in **both**
themes by design; only the content sections swap. So a new section needs a
`dark:` counterpart for every colour it sets, and a colour picked against navy
usually fails on white. The ones that bit us: `text-sky-100` on a
`bg-sky-500/10` bar (1.04:1 in light), the `freq-badge` utility, and `-500`
inks used as small text on white. `freq-badge` now carries its own light
palette in `input.css`; elsewhere the pattern is `text-sky-700 dark:text-sky-400`.

**Check both themes before shipping a page.** The quickest way is
`localStorage.setItem('theme','dark')` then reload — toggling the class from
the console does not reliably restyle already-painted nested elements.

## The features page

`features.njk` and its German twin `de/funktionen.njk` are the long-form
showcase, and the only pages that carry a chapter nav: a row of anchor pills
under the hero, one per `<section id="…">`. Anchor and section must stay in
step, and every section needs `scroll-mt-20` so the sticky header does not
cover its heading.

Both files open with three Nunjucks macros — `check()`, `card()` and `badge()` —
because the page is otherwise forty repetitions of the same tick-mark SVG.
Pass `true` as the last argument to `check()` or `card()` to append the
**New** pill. `badge()` takes a *whole* class name for the status dot
(`"bg-amber-400"`), never a colour fragment: Tailwind scans these files as plain
text and cannot see a class assembled from parts.

The hero deliberately carries no call to action, and the sign-up button sits at
the very bottom. The landing pages lead with **See what it does** for the same
reason — asking for a registration before anyone has seen the product turned
readers away from the product.

**When a feature ships, this page, its German twin, and `llms.txt` all need the
same update.**

### What the site deliberately does not claim

Some things the API and frontend implement are **not advertised anywhere on the
site**, because the implementation is not good enough to promise yet:

| Not claimed | Present in code as |
|---|---|
| Gliders / sailplanes | `launchMethod` (winch, aerotow, self-launch), FCL.140.S and §61.57(a) evaluators |
| German ultralights | the LuftPersV §45 evaluator |
| The iOS app | the `ninerlog-ios` repo |

Grepping the repos for features will surface all three again. Leave them out
until the owner says otherwise. `SPL` and `LAPL(S)` count as glider claims —
use "an EASA licence and an FAA certificate" as the multi-licence example.
`TMG` is fine: it is a powered class rating on the generic class machinery.

## Learn more with AI

`src/partials/ask-ai.njk` is a "Learn more with AI" row in the footer brand
column — four assistant logos (ChatGPT, Claude, Gemini, Perplexity) that open a
new chat with a ready-made prompt about NinerLog. It is included from
`footer.njk`, so it appears on every page and picks its language from
`pageLang`.

The prompt points the assistant at `/llms.txt` — a plain-text product summary
kept at the repo root and copied to `_site/` by `build:assets` — so the answers
are grounded in real facts rather than guesses about a project the models have
never seen. **Keep `llms.txt` in step with the site when features change.**

Only ChatGPT and Perplexity accept a prompt as a URL parameter; Claude removed
its web `?q=` parameter and Gemini never had one. So the links are plain anchors
that also copy the prompt to the clipboard on click (see `scripts.njk`), with a
"paste it in" hint that stays hidden until clicked. Without JavaScript the links
still open the assistant.

Logo paths come from [simple-icons](https://simpleicons.org) (CC0) and are
inlined rather than fetched, matching the self-hosted approach used for fonts.

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
