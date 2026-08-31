#!/usr/bin/env node
/*
 * Generates _site/sitemap.xml from the Nunjucks pages.
 *
 * The sitemap used to be a hand-maintained file at the repo root, which meant
 * every new page had to be remembered twice. Deriving it from the pages
 * themselves makes that impossible to forget: a page carries its own sitemap
 * metadata in its front matter, or it is deliberately excluded here.
 *
 * <lastmod> comes from the last commit that touched each page file, so it
 * reflects real content changes rather than deploy timestamps. This requires
 * full git history — see the `fetch-depth: 0` note in .github/workflows/deploy.yml.
 */

import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PAGES_DIR = join(ROOT, 'src/pages');
const OUT = join(ROOT, '_site/sitemap.xml');
const ORIGIN = 'https://ninerlog.com';

// Pages that must never appear in the sitemap, regardless of front matter.
const EXCLUDED = new Set(['404.njk']);

const read = (v) => (v == null ? null : String(v));

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.name.endsWith('.njk') ? [full] : [];
  });
}

/** Pull a `{% set name = "value" %}` out of a page's front matter. */
function njkSet(source, name) {
  const match = source.match(
    new RegExp(`\\{%\\s*set\\s+${name}\\s*=\\s*"([^"]*)"\\s*%\\}`)
  );
  return match ? match[1] : null;
}

/** Date of the last commit touching `file`, as YYYY-MM-DD. */
function lastModified(file) {
  const rel = relative(ROOT, file);
  const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', rel], {
    cwd: ROOT,
    encoding: 'utf8',
  }).trim();
  // Empty for a page that is new and not yet committed: it is being changed
  // right now, so today is the honest answer.
  return out || new Date().toISOString().slice(0, 10);
}

const escape = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const pages = [];
const problems = [];

for (const file of walk(PAGES_DIR).sort()) {
  const name = file.slice(PAGES_DIR.length + 1);
  if (EXCLUDED.has(name.split('/').pop())) continue;

  const source = readFileSync(file, 'utf8');

  // Pages marked `pageNoindex` are deliberately kept out of search results
  // (see src/partials/head.njk). Advertising them in the sitemap would invite
  // exactly the crawl the noindex is there to prevent.
  if (njkSet(source, 'pageNoindex') === 'true') continue;

  const pagePath = njkSet(source, 'pagePath');

  if (!pagePath) {
    problems.push(`${name}: no pagePath — cannot place it in the sitemap`);
    continue;
  }

  const changefreq = read(njkSet(source, 'sitemapChangefreq'));
  const priority = read(njkSet(source, 'sitemapPriority'));
  if (!changefreq || !priority) {
    problems.push(`${name}: missing sitemapChangefreq or sitemapPriority`);
    continue;
  }

  pages.push({
    file,
    pagePath,
    changefreq,
    priority,
    altDe: njkSet(source, 'altDe'),
    altEn: njkSet(source, 'altEn'),
    lastmod: lastModified(file),
  });
}

// hreflang must be reciprocal: search engines discard one-sided annotations.
// Catching it here means a half-declared pair fails the build instead of
// silently shipping a sitemap that contradicts the page markup.
const byPath = new Map(pages.map((p) => [p.pagePath, p]));
for (const page of pages) {
  const partnerPath = page.altDe ?? page.altEn;
  if (!partnerPath) continue;

  const partner = byPath.get(partnerPath);
  if (!partner) {
    problems.push(`${page.pagePath}: declares alternate ${partnerPath}, which is not a page`);
    continue;
  }
  if ((partner.altDe ?? partner.altEn) !== page.pagePath) {
    problems.push(
      `${page.pagePath} ↔ ${partnerPath}: hreflang is not reciprocal — ` +
        `${partnerPath} must point back at ${page.pagePath}`
    );
  }
}

if (problems.length) {
  console.error('Cannot generate sitemap:');
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

// Preserve the previous ordering: priority desc, then path, so the diff stays
// readable when pages are added.
pages.sort(
  (a, b) =>
    Number(b.priority) - Number(a.priority) || a.pagePath.localeCompare(b.pagePath)
);

const body = pages
  .map((page) => {
    const url = escape(ORIGIN + page.pagePath);
    const lines = [`    <loc>${url}</loc>`];

    const partnerPath = page.altDe ?? page.altEn;
    if (partnerPath) {
      const en = escape(ORIGIN + (page.altEn ?? page.pagePath));
      const de = escape(ORIGIN + (page.altDe ?? page.pagePath));
      lines.push(
        `    <xhtml:link rel="alternate" hreflang="en" href="${en}"/>`,
        `    <xhtml:link rel="alternate" hreflang="de" href="${de}"/>`,
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${en}"/>`
      );
    }

    lines.push(
      `    <lastmod>${page.lastmod}</lastmod>`,
      `    <changefreq>${page.changefreq}</changefreq>`,
      `    <priority>${page.priority}</priority>`
    );
    return `  <url>\n${lines.join('\n')}\n  </url>`;
  })
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${body}
</urlset>
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, xml);
console.log(`Wrote ${relative(ROOT, OUT)} with ${pages.length} URLs`);
