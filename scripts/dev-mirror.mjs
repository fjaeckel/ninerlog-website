/**
 * Mirrors `_site/pages/` onto the `_site/` root during `npm run dev`.
 * The nunjucks watcher writes pages under `_site/pages/`, while the server
 * and all production URLs resolve against the root — the build does this
 * with a one-off copy, dev needs it continuously.
 */
import { cpSync, existsSync, mkdirSync, watch } from 'node:fs';
import { dirname, join, relative } from 'node:path';

const SRC = '_site/pages';
const DEST = '_site';

function mirrorAll() {
  if (!existsSync(SRC)) return;
  cpSync(SRC, DEST, { recursive: true });
}

mkdirSync(SRC, { recursive: true });
mirrorAll();

const pending = new Set();
let timer = null;

function flush() {
  for (const file of pending) {
    const from = join(SRC, file);
    if (!existsSync(from)) continue;
    const to = join(DEST, file);
    try {
      mkdirSync(dirname(to), { recursive: true });
      cpSync(from, to, { recursive: true });
      process.stdout.write(`mirrored ${relative(SRC, from)}\n`);
    } catch (err) {
      process.stdout.write(`mirror failed for ${file}: ${err.message}\n`);
    }
  }
  pending.clear();
}

watch(SRC, { recursive: true }, (event, file) => {
  if (!file) {
    mirrorAll();
    return;
  }
  pending.add(file);
  clearTimeout(timer);
  timer = setTimeout(flush, 150);
});

process.stdout.write(`mirroring ${SRC} → ${DEST}\n`);
