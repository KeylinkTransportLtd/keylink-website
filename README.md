# Keylink Transport — Premium Website
**Built April 2026 | Stack: HTML · CSS · JavaScript · GSAP**

---

## Project Structure

```
site/
├── index.html          # Homepage (primary conversion page)
├── services.html       # Services: FTL, Cross-Border, Corridors
├── about.html          # Company story, mission, values, credentials
├── contact.html        # Quote request form (primary lead capture)
├── careers.html        # Job listings + application form
├── 404.html            # Custom 404 error page
├── robots.txt          # Search engine directives
├── sitemap.xml         # XML sitemap for all pages
├── css/
│   └── main.css        # All styles — CSS custom properties, responsive
├── js/
│   └── main.js         # GSAP animations, nav, counters, form handling
└── assets/             # Place logo, images, and Nano Banana 3D assets here

research/
├── 01-client-brand.md          # Brand extraction from keylinktransport.ca
├── 02-competitor-analysis.md   # Top 10 competitor analysis with scores
├── 03-build-brief.md           # Master build brief (design + content + SEO)
├── niche-analysis-report.md    # Client-facing lead magnet PDF source
└── 04-quality-audit.md         # Final QA checklist
```

---

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--navy` | `#12294A` | Hero BG, nav, dark sections |
| `--teal` | `#1A7B6E` | Accents, borders, secondary CTAs |
| `--teal-lt` | `#22a092` | Links, icons, hover states |
| `--gold` | `#F0A820` | Primary CTA buttons, highlights |
| `--midnight` | `#0A0E1A` | Darkest sections, footer |
| `--frost` | `#F4F7FA` | Light content sections |
| Heading font | Syne 700/800 | All headings |
| Body font | Inter 400/500/600 | All body copy, UI |

---

## Nano Banana Asset Placeholders

Three 3D asset placeholders are marked in the HTML with `<!-- NANO BANANA ASSET HERE -->` comments:

| Location | File | Dimensions | Style notes |
|----------|------|------------|-------------|
| Homepage Hero | `index.html` line ~145 | 620 × 465px | FTL dry van truck, navy/teal colorway, cinematic lighting, slight left-facing angle, transparent PNG or WebP |
| Services — FTL section | `services.html` | 560 × 420px | Dry van truck, side view, white trailer, navy cab |
| Services — Cross-Border | `services.html` | 560 × 420px | Truck at border checkpoint, Canadian/US flag context, dawn lighting |
| About page | `about.html` | 560 × 560px | Keylink truck at Abbotsford warehouse, golden hour lighting |

**To place assets:** Replace the `<div class="hero__asset-placeholder">` block (or `<div class="service-detail__visual">`) with your `<img>` tag:

```html
<img src="assets/hero-truck.png"
     alt="Keylink Transport FTL dry van truck"
     width="620" height="465"
     loading="eager">
```

---

## Form Endpoints

Both forms currently prevent default submission and show a success message. Connect them to a real backend before going live:

### Option A — Formspree (quickest)
1. Create a free account at [formspree.io](https://formspree.io)
2. Create a new form and copy your form ID (e.g. `xabcdefg`)
3. In `contact.html`, find the comment `// ACTION: Replace with actual form submission endpoint` and replace with:

```javascript
fetch('https://formspree.io/f/xabcdefg', {
  method: 'POST',
  body: new FormData(form),
  headers: { 'Accept': 'application/json' }
}).then(r => {
  if (r.ok) { form.style.display = 'none'; success.style.display = 'block'; }
});
```

4. Also update `applyForm` in `careers.html` with a second Formspree form ID.

### Option B — Netlify Forms (if deploying to Netlify)
Add `data-netlify="true"` to both `<form>` elements. Netlify auto-detects and handles submissions.

### Option C — Custom Backend
Replace `fetch('#')` with your API endpoint. The form data is a standard `FormData` object.

---

## Deployment

### Netlify (Recommended — free tier available)
1. Go to [netlify.com](https://netlify.com) → "Add new site" → "Deploy manually"
2. Drag the `site/` folder into the Netlify drop zone
3. Your site will be live at a `*.netlify.app` URL instantly
4. Add your custom domain in Site Settings → Domain Management

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` from the `site/` directory
3. Follow prompts — deploy in ~60 seconds

### Traditional Web Host (cPanel / FTP)
1. Upload all files inside `site/` to your `public_html` directory
2. Ensure `.htaccess` (if Apache) has:
   ```
   ErrorDocument 404 /404.html
   ```

---

## SEO Checklist (Pre-Launch)

- [ ] Update `<link rel="canonical">` on every page to match live domain
- [ ] Update `sitemap.xml` with live domain URLs
- [ ] Update `robots.txt` sitemap URL to live domain
- [ ] Update `og:url` meta tags to live domain
- [ ] Update Schema JSON-LD `"url"` fields to live domain
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Verify FMCSA profile link is correct
- [ ] Replace placeholder testimonials with real named quotes from clients/brokers

---

## Post-Launch Priorities

1. **Google Reviews** — Set up Google Business Profile for Abbotsford location and request reviews from 5 broker partners. Display widget on homepage.
2. **CTPAT / FAST certification** — If Keylink pursues CTPAT certification, add badge to trust bar and About page credentials section.
3. **Analytics** — Add Google Analytics 4 or Plausible tracking script to all `<head>` tags.
4. **HTTPS** — Ensure SSL certificate is active before going live. Netlify/Vercel provide this automatically.
5. **Content expansion** — Add a blog section targeting "FTL carrier Abbotsford BC" and "cross-border freight Canada USA" keywords for long-term SEO.

---

## Cost Breakdown (for client invoice)

| Deliverable | Value |
|-------------|-------|
| Brand Extraction & Research | $1,200 |
| Competitor Analysis (10 companies) | $1,500 |
| Build Brief + SEO Strategy | $1,000 |
| Homepage (GSAP animated, responsive) | $2,500 |
| Services Page | $800 |
| About Page | $700 |
| Contact / Quote Form Page | $800 |
| Careers Page + Job Schema | $700 |
| 404 + robots.txt + sitemap.xml | $200 |
| Quality Audit | $300 |
| Niche Analysis Report (lead magnet) | $500 |
| **Total** | **$10,200** |

*Nano Banana 3D asset generation billed separately.*

---

*Built with Claude Code · April 2026*
