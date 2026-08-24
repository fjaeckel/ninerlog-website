---
name: feature-media
description: How the feature screenshots, demo videos and their light/dark variants are wired into ninerlog.com — the markup patterns, the naming contract with images/, and how to regenerate the media from the frontend repo. Load when touching feature images on any page, adding a screenshot for a new feature section, or swapping a still for a demo video.
---

# Feature media

All feature screenshots and demo clips live in `images/` and are captured
from the real app — never mocked up. They come in light/dark pairs and show
one coherent demo logbook (a "famous women in aviation" homage: Amelia
Earhart's account, Neta Snook signing, a Ninety-Nines club roster).

## Regenerating

The capture pipeline lives in the frontend repo:

```bash
cd ../ninerlog-frontend
npm run shots:marketing                    # stills, light + dark
npm run shots:marketing -- --animations    # demo WebM + GIF
cp .screenshots/marketing/feature-*.png ../ninerlog-website/images/
cp .screenshots/marketing/demo-*.webm  ../ninerlog-website/images/
cp .screenshots/marketing/demo-quicklog{,-dark}.gif ../ninerlog-website/images/
```

See that repo's `marketing-images` skill for targets, the story fixtures,
and the review checklist. **Never** rename files in `images/` casually — the
`fjaeckel/ninerlog` README hotlinks them as
`https://ninerlog.com/images/<name>` and GitHub caches hard.

## Markup patterns

Site dark mode is a **class toggle** (`scripts.njk` toggles `.dark` on the
root), so `<picture media="(prefers-color-scheme:…)">` would ignore the
toggle. Theme-dependent media is always an element pair:

```html
<div class="w-full order-last lg:order-none">
  <img src="/images/feature-x.png"      alt="…" class="w-full dark:hidden"       loading="lazy" width="1264" height="739" />
  <img src="/images/feature-x-dark.png" alt="…" class="w-full hidden dark:block" loading="lazy" width="1264" height="739" />
</div>
```

Stills come **pre-framed** — rounded corners, hairline border and drop shadow
are baked into the PNG on a transparent margin — so never add `rounded-xl` or
`shadow-xl` to a feature `<img>` (it would double-frame). Framed stills are
1264×739 CSS px (mobile 457×916).

The wrapper carries the grid/order/sizing classes (a bare pair would become
two grid children and break the two-column layout); both images share the
same alt — the width/height attributes only fix the aspect ratio.

Demo videos follow the same pairing. They are unframed media, so they DO get
`rounded-xl shadow-xl` in CSS, and their poster must be one of the unframed
`poster-*` copies (a framed poster would flash margins before playback):

```html
<video class="rounded-xl shadow-xl w-full dark:hidden" autoplay loop muted playsinline
       preload="metadata" poster="/images/poster-x.png" width="1200" height="675" aria-label="…">
  <source src="/images/demo-x.webm" type="video/webm" />
  <img src="/images/feature-x.png" alt="…" class="w-full" loading="lazy" width="1200" height="675" />
</video>
```

## Who references what

| Page | Media |
|---|---|
| `src/pages/features.njk` | every `feature-*` pair; `demo-quicklog` and `demo-reports` videos; new-section shots `feature-credentials`, `feature-fleet`, `feature-custom-currency` |
| `src/pages/de/funktionen.njk` | mirror of features.njk with German alts — keep the two in sync |
| `src/pages/self-hosted.njk` | `feature-flying-club` pair |
| `fjaeckel/ninerlog` README | hotlinks `feature-*` pairs and `demo-quicklog[-dark].gif` |

A feature section without a screenshot should get one: capture it via a new
target in the frontend pipeline, then follow the patterns above — English
page first, German mirror in the same change.

## Checking

`npm run build`, then confirm the built pages reference both variants
(`grep -c feature-x-dark _site/features.html`) and eyeball the section in
both themes — the reveal-on-scroll animation needs a beat before a
screenshot shows anything.
