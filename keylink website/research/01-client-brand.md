# Phase 1: Client Brand Extraction — Keylink Transport Inc.

## Brand Snapshot
- **Company:** Keylink Transport Inc.
- **Primary Color:** #17A6E8 (bright sky blue — buttons, links, highlights)
- **Secondary Color:** #FFFFFF (white — backgrounds, text on dark)
- **Accent Color:** #B0C9D9 (steel blue — light section backgrounds)
- **Supporting Neutral:** #9690A5 (muted gray-purple — secondary text)
- **Dark:** #000000 / #1A1A1A (used for section backgrounds, headline text)
- **Fonts:** Not explicitly declared (Squarespace-hosted — visual inspection suggests a clean sans-serif system; likely Inter or similar geometric sans for body)
- **Tone:** Professional-but-personal ("family-owned," "we know our customers by name")
- **Core Message:** "Canada–USA freight you can count on — delivered on time, every time, at up to 90% off carrier direct pricing."

---

## Logo

- **Primary Logo URL:** https://images.squarespace-cdn.com/content/v1/687e6bf7e2cc09231aa3fe36/d5959749-1b76-4811-a924-2311d975ac1c/Logo+keylink.png
- **Downloaded to:** `site/assets/logo-keylink.png`
- **Format:** PNG on transparent or white background
- **Usage:** Header/nav on all pages, Open Graph

---

## Brand Colors (Extracted from CSS)

| Role | Hex / Value | Notes |
|------|-------------|-------|
| Primary | `#17A6E8` | CTA buttons, links, accents |
| White | `#FFFFFF` | Backgrounds, nav text |
| Steel Blue | `#B0C9D9` | rgba(176,201,217,1) — light bg sections |
| Muted Gray | `#9690A5` | Supporting text |
| Dark | `#1A1A1A` | Section backgrounds (hero, footer) |

---

## Typography

- **Platform:** Squarespace (fonts loaded via Squarespace CDN, not Google Fonts link found in HTML)
- **Visual inspection:** Clean geometric sans-serif — headings appear bold and uppercase-leaning; body is regular weight
- **Recommended equivalent:** Likely **DM Sans** or **Inter** (heading) + **Inter** (body) based on visual style
- **Heading style:** Bold, large, with selective bold words highlighted (e.g., "**Canada–USA** Freight You Can Count On")

---

## Tone of Voice

- **Overall:** Professional, direct, family-owned warmth
- **Headlines:** Punchy, results-oriented ("Canada–USA Freight You Can Count On")
- **Body copy:** Confident but approachable — avoids corporate jargon; uses "we" language heavily
- **Personality:** Trustworthy, transparent, no-nonsense
- **Unique differentiator language:** "We know our customers by name" / "big enough to deliver, small enough to care"

---

## Key Messaging

### Primary Headline
> **"Canada–USA Freight You Can Count On"**

### Supporting Value Props
1. Save up to 90% off carrier direct pricing
2. On-time deliveries, clear communication, no-nonsense approach
3. Family-run operation with the capabilities of a national carrier
4. Responsiveness, transparency, and accountability

### Tagline (footer)
> "Proudly based in Abbotsford, BC | Licensed Canada–USA Carrier"

### Mission
> "To provide safe, reliable, and cost-effective freight transportation services while building long-term relationships rooted in integrity, accountability, and respect."

### Vision
> "To become Western Canada's most trusted name in full-truckload logistics — a carrier known not for its size, but for its standards."

### Values
- Reliability, Safety, Communication, Efficiency, Family Culture

---

## Existing Content — All Pages

### HOME PAGE
**Hero:** "Canada–USA Freight You Can Count On" + "Save up to 90% off carrier direct pricing when you book with KeyLink Transport."
**CTA:** "Get a Quote" → /contact

**About Section:**
- Founded 2019, BC-based FTL carrier
- HQ: Abbotsford, BC + Calgary, AB
- Cross-border Canada–US specialist
- USDOT 2832041 | MC# 946449
- $750,000 BIPD ICBC-insured
- 5-Star Rated by Industry Brokers & Customers
- 1,500+ truckloads/month

**Freight Corridors Section:** "From Vancouver to Sacramento, our network moves over 1,500 truckloads. Calgary and Vancouver lead as our busiest hubs."

**Join Our Team Section:** Employee Glassdoor review: *"Great company, great guys, pays really well, understands all my concerns."* — 5 stars, Sept 2021

**Contact Section (inline):** Form + address info

### ABOUT PAGE
- Full brand story ("started with a single truck and a vision")
- Mission, Vision, Values sections
- Services: FTL Dry Van, cross-border, real-time dispatch, border documentation
- Who they serve: freight brokers, SMBs, distributors, manufacturers, retail chains, cross-border firms
- CTA: "Book a free consult" → /appointments

### APPOINTMENTS PAGE
- Booking/scheduling page (likely Squarespace scheduling widget)
- CTA: Book a consultation or shipment slot

### CONTACT PAGE
- Full quote request form
- Fields: Name, Email, Message, Date of service, File upload (goods photos), Terms consent
- Dispatch: dispatch@keylinktransport.ca
- Phone: (778) 549-8334
- Response time: "within one business day"

### CAREER PAGE (/contact-6)
- Headline: "Let's work together"
- Open roles: Truck Driver, Marketing Coordinator, Accounting Manager
- Application form with: Name, Email, Phone, Salary expectations, How did you hear about us, Message

---

## Site Architecture

```
keylinktransport.ca/
├── /                     → Homepage (hero, about snippet, freight corridors, team CTA, contact form)
├── /home                 → Redirect to /
├── /about                → Full company story, mission, vision, values, who we serve
├── /appointments         → Booking/scheduling page
├── /contact              → Quote request form + contact details
└── /contact-6            → Career / job applications page
```

**External links:**
- LinkedIn: http://linkedin.com/ (generic — no custom profile URL yet)

---

## Assets Found

| Asset | URL |
|-------|-----|
| Logo (PNG) | https://images.squarespace-cdn.com/content/v1/687e6bf7e2cc09231aa3fe36/d5959749-1b76-4811-a924-2311d975ac1c/Logo+keylink.png |
| Hero image (AI-generated truck) | https://images.squarespace-cdn.com/content/v1/687e6bf7e2cc09231aa3fe36/40136418-0f13-40b8-bb88-630450a3aded/ChatGPT+Image+Sep+6%2C+2025%2C+04_05_06+PM.png |
| Team photo 1 | https://images.squarespace-cdn.com/content/v1/5ec321c2af33de48734cc929/be8404a8-80ab-41d1-851b-e4ac02114ae5/Rectangle+17.jpg |
| Team photo 2 | https://images.squarespace-cdn.com/content/v1/5ec321c2af33de48734cc929/5f51d141-ec8e-4161-ab75-f36a938ab9b4/Rectangle+16.jpg |
| Team photo 3 | https://images.squarespace-cdn.com/content/v1/5ec321c2af33de48734cc929/fd2c36d1-39c7-4ca7-a6f4-783cd349c48b/Rectangle+18.jpg |
| About page truck image | https://images.squarespace-cdn.com/content/v1/687e6bf7e2cc09231aa3fe36/d46edd98-014a-484c-89b2-c79a67eb6f57/50883f3a-b2c3-4db4-83b3-8d401b9274f3.png |

---

## Current Site Weaknesses (Observed)

1. **Squarespace template** — visually generic, no brand differentiation
2. **No animated hero** — video element fails to load ("Unable to load video. Try again later")
3. **LinkedIn link is broken** — points to generic linkedin.com, not their profile
4. **No case studies or testimonials section** beyond one Glassdoor quote
5. **No real stats display** — "1,500 truckloads a month" is listed as a bullet point label only, no visual counter
6. **Career page has wrong URL** (/contact-6) — confusing UX
7. **No service detail pages** — no dedicated FTL page, cross-border page, etc.
8. **Favicon not customized** (likely Squarespace default)
9. **Mobile experience** is functional but not premium
10. **No trust badges visible** — USDOT/MC numbers buried in bullet list, not prominently displayed
