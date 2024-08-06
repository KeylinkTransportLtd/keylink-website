#!/usr/bin/env node
/**
 * Wires webp sources into page markup, idempotently.
 *
 *   node tools/generate-webp.js && node tools/wire-webp.js
 *
 * For every <img> whose class matches one of TARGET_CLASSES and whose src is a
 * png/jpg with a .webp twin on disk, the tag is wrapped in a <picture> with a
 * webp <source> ahead of it. Tags already inside a <picture> that has a
 * <source> are left alone, so re-running is safe.
 *
 * og:image and twitter:image are deliberately untouched: social scrapers are
 * least surprising with png/jpg.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'site');
const TARGET_CLASSES = ['post-hero__img', 'post-chart__img'];

function htmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return ['blog', 'assets', 'css', 'js'].includes(entry.name) && entry.name !== 'blog' ? [] : htmlFiles(full);
    return entry.name.endsWith('.html') ? [full] : [];
  });
}

// Resolves an img src as written in a page ('../assets/x.png') to a real path.
function webpTwin(file, src) {
  if (!/\.(png|jpe?g)$/i.test(src)) return null;
  const abs = path.resolve(path.dirname(file), src);
  const twin = abs.replace(/\.(png|jpe?g)$/i, '.webp');
  return fs.existsSync(twin) ? src.replace(/\.(png|jpe?g)$/i, '.webp') : null;
}

function processFile(file) {
  let html = fs.readFileSync(file, 'utf8');
  const before = html;
  let wrapped = 0;

  for (const cls of TARGET_CLASSES) {
    const imgPattern = new RegExp(`<img\\b[^>]*class="[^"]*\\b${cls}\\b[^"]*"[^>]*>`, 'g');

    html = html.replace(imgPattern, (imgTag, offset, full) => {
      const srcMatch = imgTag.match(/\ssrc="([^"]+)"/);
      if (!srcMatch) return imgTag;

      const webp = webpTwin(file, srcMatch[1]);
      if (!webp) return imgTag;

      // Already has a sibling <source>? Look back a short way for one.
      const lookback = full.slice(Math.max(0, offset - 400), offset);
      if (/<source\b[^>]*type="image\/webp"[^>]*>\s*$/.test(lookback)) return imgTag;

      const source = `<source srcset="${webp}" type="image/webp">`;
      wrapped++;

      // Inside a bare <picture> already: inject the source, keep the wrapper.
      if (/<picture>\s*$/.test(lookback)) return `${source}${imgTag}`;

      return `<picture>${source}${imgTag}</picture>`;
    });
  }

  if (html !== before) {
    fs.writeFileSync(file, html);
    return wrapped;
  }
  return 0;
}

function main() {
  const files = [
    ...fs.readdirSync(ROOT).filter((f) => f.endsWith('.html')).map((f) => path.join(ROOT, f)),
    ...fs.readdirSync(path.join(ROOT, 'blog')).filter((f) => f.endsWith('.html')).map((f) => path.join(ROOT, 'blog', f)),
  ];

  let totalTags = 0;
  let touched = 0;

  for (const file of files) {
    const count = processFile(file);
    if (count) { touched++; totalTags += count; }
  }

  console.log(`webp sources added: ${totalTags} across ${touched} files`);
}

main();
