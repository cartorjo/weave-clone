# Phase 3 — Results

Measured **8 September 2026** against the working tree at the final Batch 6 commit,
served locally (`npx serve`, port 8080). Method identical to the Phase 0/1 evidence:
cached Lighthouse 12.8.2 (simulated throttling — lab values, not field p75), cached
Puppeteer + axe-core 4.13, system Chrome headless. Raw evidence:
`audit-evidence/final/` (verify.json, lighthouse-summary.json, lh-*.json).

Scope of this round (user request, 8 Sep): image display on category/detail pages,
header/spacing defects, a megamenu linking to dedicated pages, aesthetic lift —
implemented on top of the earlier Batch A accessibility fixes, plus the quick wins
from the Phase 1 audit. 17 pages now ship (7 original incl. 404 was absent, 10 new).

## Before / after

| Metric | Before (Phase 0/1) | After |
|---|---|---|
| Pages | 6 (+ bare-text 404) | 17 incl. branded 404; all generated from shared partials |
| axe violations (all pages, 1440 + 390, incl. lazy-loaded state) | 84–24 contrast nodes/page + 8–10 target-size nodes/page | **0 nodes on all 17 pages** |
| Lighthouse accessibility | 90–93 mobile / 95–97 desktop | **100 on all 18 audited profiles** |
| Lighthouse best practices | 96 / 100 | **100 / 100** |
| Lighthouse performance (mobile) | 75 (Portfolio) – 99 | **97–99** |
| Portfolio page weight | 9,964,564 B (9.8MB CSS-background JPEG) | **208,974 B** |
| Portfolio LCP (simulated mobile) | 49.88 s | **2.11 s** |
| Page weight, all measured pages | 140KB–9.96MB | **194–295KB** (budget ≤800KB) |
| Requests per page | 10–15 | 10–15 (budget ≤30) |
| CLS / TBT | 0 / 0–14ms | 0 / 0 |
| Largest deployed image | 26.6MB (pharma.jpg available; 9.8MB fetched) | 149KB (largest 1600w AVIF); JPEG fallbacks ≤ ~400KB, masters out of markup in assets/src/ |
| Header | CTA 0px from KARRIERE; header off content grid (~125px @1920) | 24px min gap (measured 1280/1440/1920); header container Δ0px vs content container |
| Root/rem system | 16px root but geometry authored for 14.4px (spacing ×1.11–×2.8) | recalibrated: fluid clamps, section rhythm 32px@320 → 144px@1440 |
| Type system | utility ladders froze h2 at 60px (768–1439px), 60→96px cliff @1440, h1=h2 | fluid editorial clamps govern; h1 > h2 at every width; German hyphenation (8+ letter words) |
| Nav | dropdowns → in-page anchors; mobile menu missing all sub-pages | megamenu → dedicated pages; grouped mobile menu with 14 destinations; aria-current stamped per page |
| Images on category/detail pages | none in content blocks; AVIF served without Content-Type (broken in strict engines) | case cards carry imagery; WebP+bounded-JPEG fallbacks; `Content-Type: image/avif` via serve.json |
| Shared markup | header/footer hand-copied 6×, 10 drift points | one partial each, stamped per page; `npm run check` covers all 17 outputs |
| Horizontal overflow / clipped text | none (66 samples) | none (17 pages × 10 widths incl. 320/1920/960-landscape) |
| Console errors | 0 | 0 |
| No-JS | filter buttons visible but dead | filter UI hidden until JS init; all cards + counts static; nav/menus native |

Lighthouse SEO stays 63 by design: every page carries the intentional preview
`noindex, nofollow` (launch metadata is an explicit owner decision, out of scope).
Mobile LCP lab values (2.1–2.55s) sit slightly above the ≤2.0s budget line, same
band as the 1.95–2.4s baseline for non-broken pages — single simulated runs on a
local server, not p75 field data; the dominant cost is the simulated 4× CPU +
1.6Mbps profile against full-viewport hero imagery.

## Definition of Done — line by line

| Line | Status | Evidence |
|---|---|---|
| Zero P0/P1 findings open | **Pass** | P1s: root scaling (recalibrated), orange contrast (accent tokens; axe 0), target sizes (axe target-size 0), Portfolio 9.8MB image (now 209KB `<picture>`) |
| axe: zero violations on every page | **Pass** | verify.json: 0 nodes, 17 pages × 2 viewports, post-scroll |
| Full keyboard operability, visible focus | **Pass (tested set)** | skip link → #main; megamenu Enter/Escape+refocus; exclusive panels; mobile menu; focus styles unchanged from audited pass |
| Contrast AA against rendered background | **Pass (axe-measurable set)** | axe color-contrast: 0; text-over-image cases remain manual-review by nature |
| Lighthouse mobile ≥95/100/≥95/≥95 | **Perf/A11y/BP pass; SEO 63** | intentional preview noindex; launch SEO is a pending owner decision |
| Performance budgets (§5) | **Pass except LCP lab 2.1–2.55s vs ≤2.0** | see note above; all byte/request/CLS budgets met |
| Tailwind built + purged, no CDN | **Pass** | CLI build; @source scans authoring sources |
| Zero unjustified arbitrary values | **Pass** | the five skip-link arbitrary utilities removed with the old skip link; none introduced |
| Total JS ≤30KB compressed; usable without JS | **Pass** | same five scripts + ~20 added lines; baseline measured 8.7KB gzip; no-JS checks green |
| No console errors; HTML validates | **Console pass; validator not run** | no HTML validator available offline (unchanged from Phase 1; CI proposal pending approval) |
| No layout break/overflow at tested viewports | **Pass** | 17 pages × 10 widths: no overflow, no clipped text |
| Pre-existing links/forms/tracking work | **Pass** | all former anchor destinations resolve (ids kept); anchors land below sticky header; mailto form + preselect verified incl. new `?interesse=` path; no tracking existed |
| Security headers; no secrets | **Unchanged/out of scope** | hosting unknown (owner decision); no secrets in source (Phase 1 scan; nothing secret added) |

## Still open (owner decisions, unchanged from the fix plan)

Legal/privacy page content (footer `#` placeholders), HTTP form backend vs
documented mailto, launch SEO (canonical/OG/robots/sitemap + removing noindex),
production security/caching headers, CI guard installation (axe/LHCI/html-validate
proposal stands), real-device Safari/zoom/screen-reader passes, and the P3
consolidation of the seven legacy numbered grids onto `.fact-grid` (new pages
already use it).
