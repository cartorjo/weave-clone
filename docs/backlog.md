# Backlog - technical track

Scope: aesthetics, UX, frontend, components, technical SEO, accessibility,
performance. No copy items: anything needing new wording is NEEDS-OWNER with
"[TEXT: owner]". Effort: S = under 1 day, M = 1-3 days, L = 1-2 weeks.
Status: TODO / IN-PROGRESS / PARTIAL / DONE (commit) / BLOCKED / NEEDS-OWNER.
Kind: R = refactor (visual:diff must be 0), A = aesthetic (before/after crops,
owner approval before merge), T = technical.

Reconciled 2026-09-25 against the M3 review fixes (PRs #1-#3) and the owner
decisions below.

## Owner decisions (recorded, not to be reversed)
- 44px minimum target (min-h-11, .text-link) instead of M3 48dp.
- Required form fields unmarked; only "(optional)" is marked.
- #4597ce stays as --color-info.
- Filter values without a reference are disabled, not hidden (26.09., B-42).
- Spacing tokenized as shipped (--space-legacy-*); an 8px snap is B-18.
- Industry tiles are static content, not links (24.09).
- Karriere gets an application route to info@emposo.eu (2026-09-25; this
  supersedes the earlier "no CTA on Karriere").
- Contact form and applications go to info@emposo.eu via mailto.
- noindex everywhere until live on emposo.de (INDEXABLE=true only there).
- Privacy policy: the current emposo.de text is mirrored until the Legal
  ticket delivers an Emposo policy.

## Sprint 1 - foundations

- B-01 Component inventory and contracts (M, T) - DONE (f66429a; contracts at the end of docs/components.md)
  Done: German canon in docs/components.md for the main components (eyebrow,
  display heading, text link, fact grid, box trio, CTA, reference card,
  industry tile, expander, management card, job card, tag, filter chip, facts,
  header/menu; state-layer and text-field rules under Grundregeln).
  Remaining: one contract per component in the template at the end of
  docs/components.md (props, slots, states, variants, a11y); duplicated
  markup list with file paths; deprecation plan per duplicate.
  Agents: design-system-engineer -> qa-reviewer.

- B-02 Link every card and tile (S) - NEEDS-OWNER
  Conflicts with the 24.09 decision that industry tiles are static. Reference
  and expertise cards are already whole-card links. Needs an owner decision
  before any tile becomes a link.

- B-03 Metadata baseline and check gate (S, T) - DONE (7cdb240, b4b17b4, 9e936ac)
  Canonical, OG, Twitter, page-specific og:image, lang on every page;
  check:meta fails on missing tags, duplicates, missing share images, invalid
  JSON-LD. Length guidance goes to B-22.

- B-04 Motion and no-JS safety (S, T) - DONE (ad59ed5)
  Done: countup markup holds the final values and animates only when
  motion is allowed; Lenis off under prefers-reduced-motion; only the filter
  bar (useless without JS) is hidden until JS.
  Remaining: a check that fails if dist/ contains animation-only content
  (text/numbers set only by JS, elements hidden until scroll).
  Agents: frontend-engineer -> a11y-perf-reviewer -> qa-reviewer.

- B-05 Contact form backend (S-M, T) - NEEDS-OWNER
  The owner confirmed mailto to info@emposo.eu (2026-09-25). A same-origin
  POST backend changes hosting (Railway process + mail delivery) and needs a
  success page ("[TEXT: owner]"). Decide before building.

- B-06 Card type-eyebrow and date slots (S, T) - CLOSED (not needed: cards already carry industry/discipline eyebrows; no type or date data exists, and empty props would be dead code)
  Renderer accepts type and date props; values only from existing site-data
  fields (no new labels); empty slots render nothing. No dates exist today.
  Agents: design-system-engineer -> frontend-engineer -> qa-reviewer.

## Sprint 2 - templates, navigation, aesthetics

- B-07 Consolidate renderers (M, R) - DONE (443183d, f66429a: pageHero/breadcrumb/trustStrip; guards in check:content)
  Done: cta() (6ed20d4), chip() (e4cf4a1), companyFacts(), jobsList(),
  picture(decorative). Remaining: whatever B-01 lists as duplicated markup.
  visual:diff must be 0.
  Agents: design-system-engineer -> frontend-engineer -> a11y-perf-reviewer ->
  qa-reviewer.

- B-08 Page template standardization (M, R/A) - PARTIAL (443183d: one hero/breadcrumb frame for every subpage; case studies end with related + CTA)
  Shared templates with fixed slots for Leistungen, Branchen and case
  studies; related slot filled from existing site-data by tag; CTA slot uses
  existing CTA text only. Remaining NEEDS-OWNER: /branchen/ has no closing CTA
  (adding one is a page-structure decision); /about-us/ stays without, since the
  owner removed its closing CTA (d97eb48, 24.09).
  Agents: ux-ia-architect -> design-system-engineer -> frontend-engineer ->
  seo-specialist + a11y-perf-reviewer -> qa-reviewer.

- B-09 Navigation and mobile menu hardening (S-M, T) - DONE (c551fb7)
  Mobile menu (details/summary) already closes on Escape and link click and
  has aria-current. Remaining: focus return on close, focus containment while
  open, safe-area insets for the sticky header, no hover-only affordances.
  Agents: ux-ia-architect -> frontend-engineer -> a11y-perf-reviewer -> qa-reviewer.

- B-10 Focus, contrast and state audit (S, T) - DONE (123aa49, evidence table in docs/components.md)
  Done in the M3 fixes: chip outline 3:1, card focus halo, state layer,
  on-dark roles >= 7.58:1. Remaining: every state of every component in
  docs/components.md measured (4.5:1 text, 3:1 UI) with evidence.
  Agents: a11y-perf-reviewer -> design-system-engineer -> qa-reviewer.

- B-18 Spacing snap to the 4px/8px grid (S, A) - DONE (ecf0321, owner-approved 2026-09-26)
  Set --space-legacy-N to 8px multiples in styles/main.css (one-file change),
  migrate the ~100 one-off spacing values to the nearest step.
  Before/after crops per page for owner approval.
  Agents: design-system-engineer -> a11y-perf-reviewer -> qa-reviewer.

- B-19 Headline scale consolidation (M, A) - DONE (6596a4b, owner-approved 2026-09-26)
  About 30 one-off fluid clamp() headline sizes become a few named headline
  roles; before/after crops per page for owner approval.
  Agents: design-system-engineer -> qa-reviewer.

## Sprint 3 - discoverability and performance

- B-11 Structured data and sitemap (S-M, T) - DONE (b1df34f)
  Done: Organization + WebSite + WebPage on every page, BreadcrumbList on
  every subpage, Service x8 on /portfolio/, Article on case studies, sitemap,
  robots, 301s for all 53 legacy URLs, noindex via INDEXABLE; gated in
  check:meta. Follow-ups: B-30, B-31.

- B-12 Image and font performance budget (S-M, T) - DONE (73f5b0f)
  Done: 960w rung, hero fetchpriority, fonts preloaded with font-display:
  swap (all five faces), width/height set.
  Remaining: per-page image weight budget enforced in a check; CSS size
  reported.
  Agents: a11y-perf-reviewer -> frontend-engineer -> qa-reviewer.

- B-13 Filters without JS (S-M, T) - PARTIAL (without JS every project stays visible, gated by smoke; real no-JS filtering needs a radio-input rework or per-filter URLs = NEEDS-OWNER)
  The filterable grids exist on /branchen/ and /case-studies/ (keyboard model
  e4cf4a1). Remaining: a no-JS path (all projects stay visible today; decide
  between static filtered views and query-string handling).
  Agents: ux-ia-architect -> frontend-engineer -> a11y-perf-reviewer -> qa-reviewer.

- B-14 Automated accessibility checks (S, T) - DONE (6bb8dfa: CI runs check + smoke + contrast on every PR; no Lighthouse)
  Done: npm run smoke runs axe on the core routes plus overflow, console,
  CSP and flow checks. Remaining: document thresholds; CI only if the owner
  wants it (Lighthouse in CI is a recorded won't-do in emposo-wp).

## Sprint 4 - from the 2026-09-26 benchmark review (docs/review/benchmark-patterns.md)

Ranked by impact x effort. Evidence in .visual/review/ (gitignored).

- B-24 Header-height token matches the real header (S, R) - DONE (5db69fe)
  --header-h says 78px; the header renders 97px at 1400 (min-height 6rem)
  and 80px at 390, so anchored sections land with ~6px clearance and the
  mobile-menu max-height and hero literal 4.86rem are off.
  Acceptance: --header-h/--header-h-scrolled equal the measured heights;
  header, hero and scroll-margin read the tokens; anchors land >= 16px below
  the header; visual:diff 0 apart from scroll-margin.
  Agents: design-system-engineer -> frontend-engineer -> qa-reviewer.

- B-25 Reflow at 200% text (S, T) - DONE (7302372) (also fixed: mobile collage cards were 259px in a 355px column)
  At 390 with 32px text, /kontakt/ clips its form (grid track resolves to the
  select's min-content, 445px in 355px) and the homepage reference cards.
  Acceptance: Page.setFontSizes 32 at 390: no element in main past x=390 on
  / and /kontakt/; default size visual:diff 0.
  Agents: design-system-engineer -> frontend-engineer -> a11y-perf-reviewer -> qa-reviewer.

- B-26 Smoke covers every route (S, T) - DONE (415609e)
  axe on 24 routes x 390/1400, a 200%-text check, and a Tab walk (trap / no
  outline fails) in npm run smoke; an injected regression turns it red.
  Agents: frontend-engineer -> a11y-perf-reviewer -> qa-reviewer.

- B-27 Discipline anchors and Service.url (S, T) - DONE (e50a17b)
  Each .discipline-cell on /portfolio/ gets its slug as id; the case-study
  discipline link goes to /portfolio/#<slug>; each Service node gets that
  url. Acceptance: check:content validates the anchors, check:meta the
  Service urls; check:copy unchanged.
  Agents: frontend-engineer -> seo-specialist -> qa-reviewer.

- B-28 Related slot always shows 2 cards (S, T) - DONE (eaaa247)
  3 case studies (managed-service, multi-site-transition,
  technische-dokumentation) show 1. Fill from other projects in a fixed order
  once discipline/industry matches run out; no new strings.
  Agents: frontend-engineer -> qa-reviewer.

- B-29 One URL form at the server (S, T) - DONE (7a4df91) (known serve limits: /404 answers 200 as the noindex error page; legacy URLs take 2 hops)
  /x and /x/ both answer 200; /x/index.html takes 2 hops to the
  non-canonical form; /404 answers 200. Acceptance (smoke, local serve):
  every sitemap URL 200; slashless form one 301 to the slash form;
  /x/index.html <= 2 hops to the canonical; /404 and /nope/ answer 404.
  Agents: seo-specialist -> frontend-engineer -> qa-reviewer.

- B-30 lastmod and dateModified from git (S, T) - DONE (9746ae5)
  sitemap.xml <lastmod> and WebPage.dateModified from the last commit date
  of each page's sources (a real date, never invented); check:meta asserts
  presence and agreement.
  Agents: seo-specialist -> frontend-engineer -> qa-reviewer.

- B-31 Organization logo and contactPoint (S, A) - TODO
  A standalone PNG of the existing brand logo (fixed colours, text outlined,
  >= 112px) and contactPoint from the email/phone already in the graph.
  Owner signs off the exported asset.
  Agents: design-system-engineer -> frontend-engineer -> qa-reviewer.

- B-32 Share images at 1200x630 (S-M, A) - TODO
  Crops of each hero (no new photography) so summary_large_image does not
  cut 3:2 images; check:meta compares og:image with the hero's crop instead
  of the hero file. Owner approves the crops.
  Agents: a11y-perf-reviewer -> frontend-engineer -> qa-reviewer.

- B-33 Font payload budget (S-M, T) - DONE (3e1519c) (139 -> 85 KiB, pixel-identical; arrows keep rendering in the fallback font)
  Fonts are 139 KiB on every route (5 faces, 2 preloaded) and
  00-fonts.css is a second blocking stylesheet. Measure the faces each route
  uses, then subset or drop faces without visual change and fold the
  stylesheet into site.css. Acceptance: smoke reports font KiB per route with
  a budget; one blocking stylesheet; visual:diff 0.
  Agents: a11y-perf-reviewer -> design-system-engineer -> frontend-engineer -> qa-reviewer.

- B-34 ~800w rung for industry tiles (S, T) - DONE (8fe680a) (/branchen/ 591 -> 437 KiB at 390x2)
  /branchen/ at 390x2 loads 1091w tiles for a 710px need. Acceptance:
  /branchen/ <= 450 KiB images at 390x2; visual:diff 0.
  Agents: frontend-engineer -> a11y-perf-reviewer -> qa-reviewer.

- B-35 Tokens for the remaining literals (S, R) - DONE (25a50bf)
  --target-min (44px, today spelled 44px / 2.75rem / min-h-11), icon sizes,
  letter-spacing and line-height roles, and the 5 headline rems B-19 missed,
  all at current values. Acceptance: no such literals in styles/07-11;
  visual:diff 0.
  Agents: design-system-engineer -> qa-reviewer.

- B-36 Contracts for shared frames; canon drift (S, docs) - DONE (38f0e4c)
  Contracts for page-section, site-footer, reference-grid, section-more,
  legal-copy and 7 smaller blocks; fix the canon rows that contradict the
  code (job card "KEIN Bewerben-Link", Kennzahlen on Karriere, "Stand"
  date) and the stale 1280px comment in 07-header.css.
  Agents: design-system-engineer -> qa-reviewer.

- B-37 One line-height and weight per headline role (M, A) - TODO
  h3 renders in 12 styles at 1400 (inherited 1.5 on large headlines,
  weights 300/400 at one size). Acceptance: <= 6 h3 styles; crops per page.
  Agents: design-system-engineer -> a11y-perf-reviewer -> qa-reviewer.

- B-38 Merge near-duplicate values (S, A) - TODO
  0.9-0.98rem small text -> 2 roles; one orange-rule weight (2px vs 3px);
  close breakpoint pairs (640/650, 992/1000); ink aliases. Crops per page.
  Agents: design-system-engineer -> qa-reviewer.

- B-39 Named fluid spacing steps (M, A) - TODO
  14 one-off spacing clamps with minimums off the 8px grid -> 3-4 named
  fluid steps. Crops at 390/1000/1400.
  Agents: design-system-engineer -> frontend-engineer -> qa-reviewer.

- B-40 Footer bottom row on one baseline (S, A) - TODO
  Copyright sits ~13px above the legal links' baseline. Acceptance: same
  baseline within 1px at 1000/1400.
  Agents: design-system-engineer -> qa-reviewer.

- B-41 Filter state in the URL (S-M, T) - DONE (filters write ?branche= / ?leistung= via replaceState, a load restores them, disabled/unknown values ignored; smoke asserts URL + reload, negative-tested)
  Selecting a filter writes ?branche= / ?leistung= (history.replaceState);
  loading the URL restores it; no JS = all projects visible (smoke).
  Agents: ux-ia-architect -> frontend-engineer -> a11y-perf-reviewer -> qa-reviewer.

## Later / owner decisions

- B-15 English route scaffold /en/ with hreflang (L) - NEEDS-OWNER (content needed)
- B-16 Karriere apply path (S) - DONE (bfb37cf; owner request 2026-09-25)
- B-17 Person/expert page template (M) - NEEDS-OWNER (consented people and photos)
- B-20 Persistent navigation 840-1199px (S) - NEEDS-OWNER: the inline nav
  starts at 1200px; below that it needs shorter labels (copy) or an icon nav
  (design).
- B-21 Strings written by agents on 2026-09-25 - DONE (owner approved all, 2026-09-26):
  application link "Bewerbung an info@emposo.eu" and subjects "Bewerbung:
  <Stelle>"; the "Keine passende Position dabei? ... Initiativbewerbung" line;
  the meta descriptions of /cookies/, /barrierefreiheit/, /sitemap/; the five
  German form error messages in js/06-work.js; the screen-reader suffixes
  " – <Name>" on expander toggles. Approve or reword; changes go through
  npm run copy:accept.
- B-22 Metadata length guidance (NEEDS-OWNER): check:meta lists 22
  descriptions under 140 characters and 2 case-study titles over 60.
  Rewording is owner work.
- B-23 WordPress port parity (L) - NEEDS-OWNER (platform decision)
  Measured 2026-09-26: emposo-wp pins reference/static at c471ef0, 141
  commits / 47 source files behind this repo. Its route contract has 42
  routes; 19 no longer exist here (/expertise/ + 11 subpages, 4
  /portfolio/<mode>/ pages, 5 /branchen/<industry>/ pages, /zertifizierungen/),
  and its PHP templates and CSS are hand ports (5 of 6 stylesheets already
  differ from the pin). Catching up = re-port, not sync (several days).
  Decide first which platform goes live on emposo.de: if the static site
  launches, the WordPress port is paused; if WordPress launches, it must be
  re-ported, and the SEO work (301 map, noindex switch) moves to its
  Cloudflare rules / wp-config. Done meanwhile: emposo-wp#37 mirrors the
  2026-09-25 hero/header/CTA fixes.
- B-42 Zero-result filter chips (S) - DONE: owner decision 26.09. "disable
  them". Values no project carries (today aerospace, technology,
  produktion-industrialisierung, software-cloud) render `disabled` at build
  time, labels unchanged; they re-enable when a matching reference is added.
- B-43 Breadcrumb as nav landmark (S) - NEEDS-OWNER: nav > ol with
  aria-current needs a nav label ([TEXT: owner]).
- B-44 One listing URL (M) - NEEDS-OWNER: /branchen/ and /case-studies/ render
  the same project list; either /branchen/ links to /case-studies/ or
  /case-studies/ gets a nav entry ([TEXT: owner] label).
- B-45 Keep-exploring links on /karriere/ and /kontakt/ (S) - NEEDS-OWNER:
  a heading ([TEXT: owner]) plus existing link labels.
- B-46 Metadata facts (S) - NEEDS-OWNER: sameAs profile URLs, Article
  author/publication dates, home title order, "Case Study" vs "Projekte".
