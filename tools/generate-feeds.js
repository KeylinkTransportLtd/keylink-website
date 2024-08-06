#!/usr/bin/env node
/**
 * Generates site/sitemap.xml and site/rss.xml from site/js/blog-registry.js.
 *
 * The registry is the single source of truth for published posts, so both
 * feeds are derived from it rather than maintained by hand. Run this after
 * adding or editing a post:
 *
 *   node tools/generate-feeds.js
 *
 * Static pages are listed below; add new top-level pages there.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SITE = 'https://www.keylinktransport.ca';
const ROOT = path.join(__dirname, '..', 'site');
const RSS_LIMIT = 30;

// Top-level pages, with their sitemap weighting. Paths are the clean URLs
// served by _redirects, matching the canonical tags in each page.
const STATIC_PAGES = [
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/services', priority: '0.9', changefreq: 'monthly' },
  { url: '/about', priority: '0.8', changefreq: 'monthly' },
  { url: '/contact', priority: '0.8', changefreq: 'monthly' },
  { url: '/blog', priority: '0.8', changefreq: 'weekly' },
  { url: '/careers', priority: '0.7', changefreq: 'monthly' },
  { url: '/faq', priority: '0.7', changefreq: 'monthly' },
];

function loadPosts() {
  const registryPath = path.join(ROOT, 'js', 'blog-registry.js');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(registryPath, 'utf8'), sandbox);

  const posts = sandbox.window.KEYLINK_POSTS;
  if (!Array.isArray(posts) || !posts.length) {
    throw new Error('No posts found in blog-registry.js');
  }
  return posts.slice().sort((a, b) => (a.date < b.date ? 1 : -1));
}

// Clean URL for a post: 'blog/slug.html' -> 'https://.../blog/slug'
function postUrl(post) {
  return `${SITE}/${post.slug.replace(/\.html$/, '')}`;
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildSitemap(posts, latestDate) {
  const entries = [];

  for (const page of STATIC_PAGES) {
    // Home and blog index change whenever a post ships.
    const lastmod = page.url === '/' || page.url === '/blog' ? latestDate : latestDate;
    entries.push(
      `  <url>\n` +
      `    <loc>${SITE}${page.url}</loc>\n` +
      `    <lastmod>${lastmod}</lastmod>\n` +
      `    <changefreq>${page.changefreq}</changefreq>\n` +
      `    <priority>${page.priority}</priority>\n` +
      `  </url>`
    );
  }

  posts.forEach((post, index) => {
    // The three newest posts carry slightly more weight than the archive.
    const priority = index < 3 ? '0.8' : '0.7';
    entries.push(
      `  <url>\n` +
      `    <loc>${postUrl(post)}</loc>\n` +
      `    <lastmod>${post.date}</lastmod>\n` +
      `    <changefreq>monthly</changefreq>\n` +
      `    <priority>${priority}</priority>\n` +
      `  </url>`
    );
  });

  return `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    entries.join('\n') + '\n</urlset>\n';
}

function rfc822(dateString) {
  // Registry dates are date-only; noon UTC keeps the day stable everywhere.
  return new Date(`${dateString}T12:00:00Z`).toUTCString();
}

function buildRss(posts, latestDate) {
  const items = posts.slice(0, RSS_LIMIT).map((post) => {
    const url = postUrl(post);
    const image = post.image ? `${SITE}${post.image}` : null;
    return `    <item>\n` +
      `      <title>${escapeXml(post.title)}</title>\n` +
      `      <link>${url}</link>\n` +
      `      <guid isPermaLink="true">${url}</guid>\n` +
      `      <pubDate>${rfc822(post.date)}</pubDate>\n` +
      `      <category>${escapeXml(post.category || 'Industry')}</category>\n` +
      `      <description>${escapeXml(post.summary || '')}</description>\n` +
      (image ? `      <enclosure url="${escapeXml(image)}" type="image/png"/>\n` : '') +
      `    </item>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n` +
    `  <channel>\n` +
    `    <title>Keylink Transport Blog</title>\n` +
    `    <link>${SITE}/blog</link>\n` +
    `    <description>Freight industry analysis, cross-border trucking, and logistics strategy from Keylink Transport, a BC-based full truckload carrier.</description>\n` +
    `    <language>en-ca</language>\n` +
    `    <lastBuildDate>${rfc822(latestDate)}</lastBuildDate>\n` +
    `    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml"/>\n` +
    items.join('\n') + '\n' +
    `  </channel>\n` +
    `</rss>\n`;
}

function main() {
  const posts = loadPosts();
  const latestDate = posts[0].date;

  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), buildSitemap(posts, latestDate));
  fs.writeFileSync(path.join(ROOT, 'rss.xml'), buildRss(posts, latestDate));

  console.log(`sitemap.xml: ${STATIC_PAGES.length + posts.length} URLs (${posts.length} posts)`);
  console.log(`rss.xml: ${Math.min(posts.length, RSS_LIMIT)} items, newest ${latestDate}`);
}

main();
