# Phase 3: Build Brief — Keylink Transport Inc.
## Master Document for the New Website Build

---

## Design Direction

### Color Palette

KeyLink's existing blue (#17A6E8) is strong — bright, readable, and distinct in the freight space where navy and orange dominate. We keep it as primary and build a premium dark/light system around it.

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Primary Blue | Keylink Blue | `#17A6E8` | CTAs, links, highlights, stat numbers |
| Dark Background | Near Black | `#0A0E14` | Hero, footer, dark sections |
| Section Dark | Deep Navy | `#111827` | Alternating dark sections |
| Light Background | Cool White | `#F8FAFC` | Light sections, cards |
| White | Pure White | `#FFFFFF` | Text on dark, card backgrounds |
| Text Primary | Off White | `#E2E8F0` | Body text on dark bg |
| Text Secondary | Steel Gray | `#94A3B8` | Supporting text, labels |
| Accent Light | Ice Blue | `#E0F2FE` | Subtle highlights, badge backgrounds |
| Border | Slate | `#1E293B` | Card borders, dividers |

**Rationale:** First Frontier and elite carriers use dark/navy backgrounds with bright accent colors for a premium, authoritative feel. KeyLink's current white-dominant site feels like a template. The new dark hero immediately signals "serious carrier" vs. "small transporter."

### Typography

- **Heading Font:** [Inter](https://fonts.google.com/specimen/Inter) — weight 700/800 for display, 600 for section heads
- **Body Font:** Inter — weight 400/500
- **Mono/Data Font:** JetBrains Mono or system-ui monospace for stat counters, license numbers

**Rationale:** Inter is the freight industry's de facto premium choice — clean, highly legible, and renders crisply on all screens. First Frontier and top performers all use geometric sans-serifs. KeyLink's current Squarespace font is unidentified and inconsistent.

**Type Scale:**
- Display: 72px / line-height 1.1 / weight 800
- H1: 56px / 1.15 / 700
- H2: 40px / 1.2 / 700
- H3: 28px / 1.3 / 600
- Body: 18px / 1.7 / 400
- Small/label: 13px / 1.5 / 500 uppercase tracking

### Photography / Asset Style

- **Hero:** Nano Banana 3D generated asset — cinematic truck on dark/dusk background (placeholder)
- **Real photography:** Download and use their actual fleet photos if available; otherwise use high-quality truck highway shots (always real, never obvious stock)
- **Style:** Dark, cinematic, high-contrast. Think: shot at golden hour or night, deep shadows, glowing lights
- **Avoid:** Bright white backgrounds on service section images; smiling-stock-photo-people; illustration-based icons

### Animation Recommendations

| Element | Animation | Trigger |
|---------|-----------|---------|
| Hero headline | Text reveal (clipPath sweep left-to-right) | Page load |
| Stat counters | Count-up from 0 | ScrollTrigger enter |
| Service cards | Fade-up stagger (50ms delay each) | ScrollTrigger enter |
| Freight corridor map | Draw SVG path across map | ScrollTrigger |
| Nav | Blur + background fade on scroll | Scroll progress |
| CTA buttons | Subtle scale + shadow on hover | Hover |
| Section transitions | Parallax — background moves at 60% scroll speed | Scroll |
| Trust badges | Fade in sequence | ScrollTrigger enter |
| Testimonial quotes | Horizontal slide carousel | Auto + drag |

**Parallax:** Hero background image (or 3D asset) moves at 0.4× scroll rate — creates depth
**GSAP Timeline:** Hero loads with a 3-step entrance: logo fade → headline reveal → stat strip slide up

### What to AVOID

Based on competitor analysis:
- ❌ Image sliders / carousels in hero (NATS Canada — confusing, reduces trust)
- ❌ AI-generated images that look AI-generated (dilutes authenticity)
- ❌ Videos that don't load (current site)
- ❌ Burying compliance info (USDOT, MC#) in text — display as badges
- ❌ Generic "Get in Touch" CTAs — be specific ("Get a Freight Quote" / "Check a Lane")
- ❌ Squarespace/template visual patterns
- ❌ Single-column text blocks with no visual hierarchy

---

## Site Architecture

### Pages to Build

| Page | URL | Purpose |
|------|-----|---------|
| Home | `/index.html` | Hero, stats, services overview, trust signals, testimonials, freight corridors map, contact CTA |
| About | `/about.html` | Full brand story, team, mission/vision/values, timeline |
| Services | `/services.html` | Detailed FTL, cross-border, dispatch support overview |
| Contact / Quote | `/contact.html` | Full quote request form, contact details, map |
| Careers | `/careers.html` | Open roles, company culture, application form |
| 404 | `/404.html` | Branded error page |

### Navigation Structure

```
[Logo]    Home    About    Services    Contact    Careers    [Get a Quote →]
```

- "Get a Quote" = primary CTA button (blue, always visible in nav)
- Nav becomes sticky + blurred-glass background on scroll
- Mobile: hamburger → full-screen overlay with staggered link animation

### Content Hierarchy — Homepage

1. **NAV** — Logo + links + Get a Quote CTA
2. **HERO** — Headline + subheadline + dual CTA + Nano Banana 3D asset
3. **STAT STRIP** — 4 key numbers (animated counters)
4. **TRUST BADGES** — USDOT, MC#, ICBC $750K, 5-Star, BC-based
5. **SERVICES** — 3 service cards (FTL Dry Van, Cross-Border, Dispatch Support)
6. **FREIGHT CORRIDORS** — Animated map showing Canada/US coverage
7. **ABOUT SNIPPET** — Family-owned story + CTA to About page
8. **SOCIAL PROOF** — Testimonials carousel (broker + customer reviews)
9. **JOIN THE TEAM** — Career CTA block
10. **FOOTER** — Logo, nav, contact info, coverage areas, compliance badges, copyright

---

## Content Framework

### Homepage Headlines — 3 Options

**Option A (Pain/Solution):**
> "Canadian Freight That Actually Shows Up On Time."
> *Save up to 90% off carrier direct rates. FTL dry van across Canada and the US.*

**Option B (Authority):**
> "Western Canada's Most Trusted FTL Carrier."
> *1,500+ truckloads moved monthly. Family-owned, broker-trusted, nationally licensed.*

**Option C (Differentiation — RECOMMENDED):**
> "Canada–USA Freight You Can Count On."
> *Save up to 90% off carrier direct pricing — with the response time of a company that knows your name.*

**Recommendation:** Option C — keeps their proven headline but adds the personal-service differentiator that separates them from every large carrier. The "knows your name" line is their genuine edge.

### Stat Strip (4 Counters)

| Stat | Display | Sub-label |
|------|---------|-----------|
| 1,500+ | Truckloads / Month | Consistent. Every month. |
| 90% | Off Carrier Direct Pricing | Average customer savings |
| $750K | BIPD Coverage | ICBC-insured, fully compliant |
| 5★ | Rated | By Brokers & Shippers |

### Trust Badges Row

Display as styled pill/badge components:
- 🇨🇦 USDOT# 2832041
- MC# 946449
- $750,000 BIPD Insured (ICBC)
- Licensed Canada–USA Carrier
- Based in Abbotsford, BC

### Service Cards (3)

**Card 1: Full-Truckload (FTL) Dry Van**
> General cargo across Canada and the US. Dedicated capacity, on-time delivery, no surprises.

**Card 2: Cross-Border Transport**
> Compliant border documentation, experienced drivers. Vancouver to Sacramento and everywhere between.

**Card 3: Real-Time Dispatch Support**
> We answer the phone. Know your shipment status, talk to your dispatcher, get answers when it matters.

### Section-by-Section Copy Direction

**FREIGHT CORRIDORS section:**
Headline: "1,500+ Loads. Every Route. Every Month."
Body: Animated SVG map of Canada/US with route lines lighting up — BC → AB → SK → MB → WA → OR → CA

**ABOUT SNIPPET section:**
Headline: "Big Enough to Deliver. Small Enough to Care."
Body: 3-sentence version of brand story. Founded 2019, Abbotsford BC, family-owned. Link → About page.

**TESTIMONIALS section:**
Headline: "Trusted by Brokers. Rated 5 Stars."
Use: Glassdoor review + 2-3 additional broker testimonials (request from client if available)

**CAREERS CTA section:**
Headline: "Drive Your Career Forward."
Body: "We're always looking for drivers and logistics professionals who share our values."
CTA: "See Open Roles →"

### SEO Keyword Targets

Based on competitor ranking patterns:

| Keyword | Page | Priority |
|---------|------|----------|
| FTL carrier British Columbia | Home + Services | High |
| Canada USA freight carrier | Home | High |
| cross-border dry van trucking | Services | High |
| freight carrier Abbotsford BC | Home | High |
| full truckload transport Canada | Services | High |
| trucking company Abbotsford | Home | Medium |
| BC freight broker carrier | Services | Medium |
| FMCSA carrier 2832041 | Home (schema) | Medium |

---

## Conversion Playbook

### Primary Conversion Goal
**Get a freight quote form submission** → email to dispatch@keylinktransport.ca

### Lead Capture Strategy
1. **Primary:** "Get a Freight Quote" form (Contact page) — fields: Name, Company, Email, Phone, Origin, Destination, Date, Cargo description, File upload
2. **Secondary:** Phone click-to-call in nav and footer — (778) 549-8334
3. **Tertiary:** "Book a Free Consult" → /appointments (Calendly-style scheduling)

### Social Proof Plan

| Type | Placement | Content |
|------|-----------|---------|
| Star rating badge | Hero + above fold | "5-Star Rated by Industry Brokers" |
| Glassdoor quote | Testimonial section | "Great company, great guys, pays really well" |
| Broker review cards | Testimonial carousel | Request 3-5 from their top broker partners |
| Stats counter strip | Below hero | 1,500+ loads, 90% savings, $750K insured |
| Trust badges | Below hero + footer | USDOT, MC#, ICBC |
| Compliance display | Footer + About | FMCSA Profile link |

### Trust Signal Checklist
- [x] USDOT and MC# visible (as styled badges, not buried text)
- [x] Insurance amount displayed ($750,000 BIPD)
- [x] Licensed Canada–USA visible in header and footer
- [x] Phone number in header (click-to-call)
- [x] Response time commitment ("reply within 1 business day")
- [x] Privacy policy linked in contact form
- [x] FMCSA profile linked in footer
- [x] Real photography (not AI/stock)
- [x] Real address displayed (2629 Progressive Way, Abbotsford, BC)
- [x] Glassdoor rating referenced
