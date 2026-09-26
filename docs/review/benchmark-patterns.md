# Benchmark patterns - mckinsey.com (technical track)

Last review: 2026-09-26 (previous: 2026-09-25). Patterns and anti-patterns only; no copy.

Coverage 2026-09-26: mckinsey.com blocks automated access (403 / HTTP/2
errors for curl, headless Chrome and WebFetch). Re-verified only from two
archived snapshots: [A] http://web.archive.org/web/20260801124314/https://www.mckinsey.com/industries
and [B] http://web.archive.org/web/20260915131711/https://www.mckinsey.com/careers/home.
Everything not citing [A] or [B] is carried over from 2026-09-25 and marked
"not re-verified". The own site was measured in full (24 routes, dist/ and
the served build); raw evidence is in the gitignored .visual/review/.

## IA and navigation
- UNCHANGED [A]: URLs mirror the IA; all 26 industry tiles link to
  /industries/<slug>/how-we-help-clients.
- UNCHANGED [A]: hub pages end with a "Featured" block, a short "Keep
  exploring" link list and a "Connect" block; careers ends with a longer
  exploring list [B].
- Not re-verified: five top-level doors, megamenu, practice-level contact
  forms, "More ..." series links.
- Own site (NEW): 23 routes, click depth <= 2, 0 broken links, 0 orphans.
  /case-studies/ duplicates the /branchen/ project list and is not in the
  primary nav. Case-study discipline links land at the top of /portfolio/
  (discipline cells have no ids).

## Templates
- UNCHANGED [B]: careers splits "learn more / ready to apply" (tabs) ->
  audience links -> carousel -> exploring list -> compliance statements.
- Not re-verified: service-line and article templates.
- Own site (NEW): every subpage shares one hero/breadcrumb frame (B-07).
  Case studies run hero -> facets -> related -> CTA, but the related slot
  shows 1 card instead of 2 on 3 case studies.

## Components
- UNCHANGED [A]: one card component with a hover modifier (29 cards), card
  titles still set as H5 (anti-pattern).
- NEW [B]: named icon sizes (size-lg/xl/xxl); named type steps (ts-1..7)
  independent of heading level; named grid gutters.
- Own site (NEW): canon contracts exist for 12 components; shared frames
  (page-section, site-footer, reference-grid, section-more, legal-copy) and
  7 smaller blocks have none. h3 renders in 12 computed styles at 1400
  (inherited line-heights on large headlines). The 44px target, icon sizes,
  letter-spacing and 5 headline sizes are still literals.

## CTAs and forms
- UNCHANGED [A][B]: several conversion paths per page (search jobs, apply,
  contact).
- Own site: inline form on / and /kontakt/ (mailto, owner decision);
  4 of 15 filter values match 0 projects; filter state is not in the URL.

## Metadata and structured data
- UNCHANGED [A]: title pattern "<Page> | <Section> | Brand".
- NEW [A][B]: no JSON-LD, no hreflang, no og:image dimensions in either
  archived page; share images are crop-parameterised (1536x1536 og,
  car=42:25 twitter). Careers title repeats its section (anti-pattern).
- Own site (NEW): canonical, OG, Twitter, JSON-LD @graph on all 23 routes;
  BreadcrumbList on 22 subpages, Service x8, Article x10 (ahead of the
  benchmark). Gaps: Organization has no logo/contactPoint; Article has no
  dates; Service has no url; WebPage has no dateModified; sitemap has no
  lastmod; share images range 1.5:1-1.96:1 (summary_large_image crops
  ~1.91:1).
- Own site crawlability (NEW): /x and /x/ both answer 200;
  /x/index.html redirects twice to the non-canonical form; /404 answers
  200 (soft 404).

## Accessibility
- NEW [A]: no H1 in the server HTML, 26 H5 before the first H2.
- UNCHANGED [B]: duplicated H1; H3 before any H2; six buttons share one id;
  primary link with an empty aria-label.
- Own site (NEW): axe 0 violations on 24 routes x 390/1400 x motion on/off
  (96 runs); one H1 and no skipped levels on 24/24; keyboard: no traps,
  every stop outlined; reduced motion: 0 running animations. Gaps:
  200% text at 390 clips /kontakt/ (form column 445px in 355px) and the
  homepage reference cards; the breadcrumb is a <p>, not nav > ol with
  aria-current.

## Performance
- NEW [A][B]: 8 font preloads, 17-18 external scripts (1-2 blocking),
  0 of 20 images with width/height (CLS risk).
- Own site (NEW): all images AVIF with dimensions, heroes eager, CLS
  <= 0.0004, 0 third-party requests, scripts deferred, CSS 9 KiB brotli.
  Fonts are the largest cost: 5 Roboto faces, 139 KiB on every route (87%
  of the lightest pages), 2 preloaded, 00-fonts.css a second blocking
  stylesheet. /branchen/ at 390x2 loads 1091w tiles for a 710px need
  (591 of 750 KiB image budget).

## Mobile
- Not re-verified: benchmark mobile navigation.
- Own site: sticky header 81/69px at 390; native details menu, 44px items,
  closes on Escape/outside click/focus-out; no overflow at 390.

## Anti-patterns observed (avoid)
- Placeholder og:image and broken twitter:image (2026-09-25, not re-verified).
- Card titles as H5 for size; no H1 in server HTML [A]; duplicated H1 [B].
- Empty alt on content images; images without width/height [A][B].
- Animated counters rendering "0" in server HTML (2026-09-25).
- A tile linking to the wrong section (Social Sector -> public-sector) [A].
- Duplicate ids and empty aria-labels on interactive elements [B].
