# Phase 3: Website Build Brief — Keylink Transport Inc.

## Design Direction

### Color Palette (Final)

| Role | Name | Hex | Usage |
|------|------|-----|-------|
| Primary | Deep Navy | #12294A | Hero BG, nav, dark sections |
| Secondary | Rich Teal | #1A7B6E | Section accents, borders, CTAs |
| Accent | Warm Gold | #F0A820 | Highlights, icons, star ratings |
| Dark BG | Midnight | #0A0E1A | Darkest sections, footer |
| Light BG | Frost | #F4F7FA | Light content sections |
| Text Light | Slate | #64748B | Body text on light BG |
| Text Dark | Cloud | #E8EDF5 | Body text on dark BG |
| White | Pure | #FFFFFF | Cards, contrast text |

**Rationale:** Navy/teal is authentic to Keylink's existing logo — we're elevating it, not replacing it. Gold creates warmth and energy that distinguishes them from the blue-heavy commodity freight look. Midnight backgrounds give a premium, cinematic quality that no competitor in their niche has deployed.

---

### Typography

**Heading Font:** Syne (Google Fonts)
- Geometric, editorial, modern authority
- Weights: 700, 800
- Used for: H1, H2, H3, stat numbers

**Body Font:** Inter (Google Fonts)
- Neutral, ultra-legible, industry-trusted
- Weights: 400, 500, 600
- Used for: Body copy, labels, nav, CTAs

**Display Numbers:** Syne 800 — for stat callouts (years, routes, etc.)

**Rationale:** Syne brings editorial weight that competitors don't have. Anton (Vitesse) is bolder but less refined. Inter is the de facto standard for professional B2B — shippers will trust it subconsciously.

---

### Photography / Asset Style

- **Hero:** 3D rendered truck asset from Nano Banana 2 (placeholder marked in code)
- **Secondary imagery:** Real truck/highway photography — warm tones, golden hour preferred (reinforces gold accent)
- **Icons:** Line icons only, teal colored, consistent 2px stroke weight
- **Avoid:** Generic stock "handshake" imagery, clipart trucks, generic supply chain graphics

---

### Animation Recommendations

| Element | Animation | Library |
|---------|-----------|---------|
| Hero headline | Stagger word reveal (up+fade) | GSAP |
| Stats counter | Count-up on scroll | GSAP ScrollTrigger |
| Service cards | Slide-up + fade on scroll | GSAP ScrollTrigger |
| Parallax truck | Horizontal drift on scroll | GSAP |
| Nav | Glassmorphism appear on scroll | Vanilla JS |
| Section dividers | Diagonal clip-path reveals | GSAP |
| Testimonial slider | Smooth horizontal scroll | GSAP |
| Button hover | Scale + shadow + color shift | CSS |
| Gold accent lines | Draw-on SVG stroke | GSAP |

---

### What to AVOID
- Generic blue-on-white trucking template look (every competitor does this)
- Clipart or illustrated trucks
- Squarespace-style stacked text blocks with no visual hierarchy
- Passive CTAs ("Learn more" without context)
- Walls of text without visual breaks
- Stock photos of generic businesspeople

---

## Site Architecture

### Pages

| Page | URL | Purpose |
|------|-----|---------|
| Homepage | /index.html | Primary conversion — quote leads |
| Services | /services.html | FTL deep-dive, SEO landing page |
| About | /about.html | Trust-building, mission/vision |
| Contact/Quote | /contact.html | Lead capture form |
| Careers | /careers.html | Driver + staff recruitment |
| 404 | /404.html | Retention on broken links |

### Navigation Structure

```
[Logo]  Home  Services  About  Careers  [Book a Load →] (gold CTA)
```

Mobile: Hamburger menu → full-screen overlay with same links

### Content Hierarchy Per Page

**Homepage (priority order):**
1. Hero — headline + subhead + dual CTAs + Nano Banana asset
2. Trust bar — USDOT#, MC#, ICBC insured, 5-Star badge
3. Services overview — 3 cards (FTL, Cross-Border, Coverage)
4. Stats section — Founded 2019, [X] Loads Delivered, 5-Star Rating, $750K Insured
5. Why Keylink — 5 values (icons + copy)
6. Coverage map — Canada + US routes
7. Testimonials — slider with named quotes
8. Careers CTA strip — driver recruitment
9. Contact/Quote CTA — final conversion
10. Footer

---

## CTA Strategy

| Page | Primary CTA | Secondary CTA |
|------|------------|---------------|
| Homepage | "Get a Free Quote" (gold button) | "View Our Services" (ghost button) |
| Services | "Request a Load" (gold) | "Call Us Direct" (text link) |
| About | "Work With Us" (teal) | "Meet the Team" (ghost) |
| Contact | Form submit "Send My Request" | Phone number |
| Careers | "Apply Now" (gold) | "See Open Roles" |

---

## Content Framework

### Homepage Headline Options

**Option 1 (Authority Formula):**
"Canada–USA Freight That Shows Up.
Every Load. Every Time."

**Option 2 (Savings Formula):**
"Save Up to 90% on Cross-Border Freight.
Full Truckload Experts Since 2019."

**Option 3 (Positioning Formula — RECOMMENDED):**
"Western Canada's Most Trusted
FTL Carrier. Proven Cross-Border."

---

### Value Proposition Structure

**Above the fold:** "BC-based. USDOT certified. $750K ICBC insured. We move full truckloads across Canada and the US for enterprises and SMEs who can't afford surprises."

**Stats block:**
- 5+ Years Operating
- USDOT # 2832041
- $750,000 ICBC Insured
- 5-Star Rated

---

### Section-by-Section Copy Direction

**Services Section:**
- Headline: "Full Truckload. No Surprises."
- Card 1: "Dry Van FTL" — "53-foot dry vans for general cargo. Full load, full accountability."
- Card 2: "Cross-Border Canada–US" — "Licensed, insured, and USDOT certified for seamless border crossings."
- Card 3: "Dedicated Freight Corridors" — "BC to California. Alberta to Ontario. Regular lanes, reliable schedules."

**Stats Section:**
- Headline: "Built on Standards, Not Just Size"
- Stat 1: "2019 — Founded in BC"
- Stat 2: "100% — On-Time Commitment"
- Stat 3: "$750K — ICBC Insured"
- Stat 4: "5★ — Broker Rated"

**Values Section:**
- Headline: "What Makes Us Different"
- Pull directly from their mission: Reliability, Safety, Communication, Efficiency, Family Culture

**Coverage Section:**
- Headline: "Trusted Freight Corridors Across North America"
- BC / Alberta / Saskatchewan / Manitoba / Ontario / Washington / Oregon / California / Idaho

**Testimonials Section:**
- Headline: "What Our Partners Say"
- Feature Glassdoor review + any broker testimonials available

**Careers Strip:**
- Headline: "Drive Your Career Forward"
- Subhead: "Truck drivers, coordinators, and operations staff — join a growing family-owned team."
- CTA: "See Open Roles"

---

### SEO Keyword Targets

Based on what top competitors rank for:

| Keyword | Intent | Page to Target |
|---------|--------|----------------|
| BC Canada USA freight carrier | Commercial | Homepage |
| FTL trucking company British Columbia | Commercial | Homepage / Services |
| cross-border FTL freight Canada | Commercial | Services |
| dry van carrier BC to California | Commercial | Services |
| full truckload carrier Abbotsford BC | Local | About / Contact |
| BC trucking company USDOT | Trust | About |
| freight carrier Canada USA cross border | Commercial | Homepage |
| truck driver jobs BC Canada | Informational | Careers |

---

## Conversion Playbook

### Primary Conversion Goal
**Quote request form submission** (name, company, origin, destination, freight type, date)

### Lead Capture Strategy
- Hero form (simplified: origin, destination, date → "Get Quote")
- Floating "Book a Load" button (gold, fixed right side on desktop)
- Contact page full form with cargo photo upload

### Social Proof Plan

| Social Proof Type | Where | Source |
|-------------------|-------|--------|
| USDOT + MC# | Trust bar (below hero) | Official credentials |
| $750K ICBC insured | Trust bar | Insurance certificate |
| 5-Star badge | Trust bar + testimonials section | Glassdoor / broker reviews |
| Driver testimonial | Testimonials slider | Glassdoor Sept 2021 |
| Certification logos | About page | FMCSA / ICBC |

### Trust Signal Checklist
- [x] USDOT number displayed
- [x] MC# displayed
- [x] ICBC insurance amount
- [x] Founded year (longevity signal)
- [x] Physical address (Abbotsford BC)
- [x] Phone number in header
- [x] Email in footer
- [x] Privacy Policy / Terms links
- [ ] FMCSA profile link
- [ ] Google Reviews widget (if available)
- [ ] Named customer testimonials (get from clients)
