#!/usr/bin/env node
/**
 * Creates .webp twins for site images so pages can serve webp with a
 * png/jpg fallback. Existing twins are left alone unless --force is passed.
 *
 *   node tools/generate-webp.js [--force]
 *
 * Covers every image referenced by blog-registry.js plus any png/jpg in
 * site/assets over MIN_BYTES. sharp is resolved from the npx cache since the
 * project has no package.json.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..', 'site');
const ASSETS = path.join(ROOT, 'assets');
const MIN_BYTES = 150 * 1024;
const QUALITY = 82;

function loadSharp() {
  try {
    return require('sharp');
  } catch (err) {
    const found = execSync(
      "find ~/.npm/_npx -type d -path '*node_modules/sharp' | head -1",
      { shell: '/bin/bash' }
    ).toString().trim();
    if (!found) throw new Error('sharp not found; run: npx sharp-cli --version');
    return require(found);
  }
}

function registryImages() {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'js', 'blog-registry.js'), 'utf8'), sandbox);
  return (sandbox.window.KEYLINK_POSTS || [])
    .map((post) => post.image)
    .filter((image) => image && image.startsWith('/assets/'))
    .map((image) => path.join(ROOT, image.replace(/^\//, '')));
}

function main() {
  const force = process.argv.includes('--force');
  const sharp = loadSharp();

  const candidates = new Set();

  for (const file of registryImages()) {
    if (/\.(png|jpe?g)$/i.test(file) && fs.existsSync(file)) candidates.add(file);
  }

  for (const name of fs.readdirSync(ASSETS)) {
    const file = path.join(ASSETS, name);
    if (!/\.(png|jpe?g)$/i.test(name)) continue;
    if (fs.statSync(file).size >= MIN_BYTES) candidates.add(file);
  }

  const targets = [...candidates].sort();
  let written = 0;
  let skipped = 0;
  let savedBytes = 0;

  const run = async () => {
    for (const file of targets) {
      const out = file.replace(/\.(png|jpe?g)$/i, '.webp');
      if (fs.existsSync(out) && !force) { skipped++; continue; }
      await sharp(file).webp({ quality: QUALITY, effort: 6 }).toFile(out);
      savedBytes += fs.statSync(file).size - fs.statSync(out).size;
      written++;
    }
    console.log(`webp written: ${written}, already present: ${skipped}`);
    console.log(`saved on new twins: ${(savedBytes / 1048576).toFixed(1)} MB`);
  };

  run().catch((err) => { console.error(err); process.exit(1); });
}

main();
