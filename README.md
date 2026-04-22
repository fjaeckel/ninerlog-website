# NinerLog Website

Public-facing marketing website for [NinerLog](https://ninerlog.com) — the free, open-source pilot logbook.

## Tech Stack

- **Markup:** HTML + [Nunjucks](https://mozilla.github.io/nunjucks/) templates
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin)
- **Fonts:** [Fontsource](https://fontsource.org/) via jsdelivr CDN (Plus Jakarta Sans, Inter)
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
├── pages/          # Nunjucks page templates → _site/*.html
│   ├── index.njk        # Landing page
│   ├── features.njk     # Features page
│   ├── open-source.njk  # Open Source page
│   ├── donate.njk       # Donate page
│   ├── about.njk        # About page
│   ├── privacy.njk      # Privacy Policy
│   ├── terms.njk        # Terms of Service
│   ├── imprint.njk      # Impressum
│   └── 404.njk          # Custom 404
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
3. Update nav links in `src/partials/header.njk`
4. Update `sitemap.xml`
5. Run `npm run build`

## Deployment

Push to `main` → GitHub Actions builds → deploys to GitHub Pages at [ninerlog.com](https://ninerlog.com).

## Related Repositories

| Repository | Description |
|---|---|
| [ninerlog-api](https://github.com/fjaeckel/ninerlog-api) | Go backend REST API (includes OpenAPI spec) |
| [ninerlog-frontend](https://github.com/fjaeckel/ninerlog-frontend) | React/TypeScript PWA frontend |

## Contributing

See [CONTRIBUTING.md](https://github.com/fjaeckel/ninerlog-api/blob/main/CONTRIBUTING.md) for development guidelines.
