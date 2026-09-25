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
  Done: Organization + WebSite + WebPage on every page, sitemap.xml,
  robots.txt, 301s for all 53 legacy URLs (gated), noindex via INDEXABLE.
  Remaining: BreadcrumbList on subpages, Service on Leistungen, Article on
  case studies, using only fields that exist in data (no invented
  author/date); validated in check:meta.
  Agents: seo-specialist -> frontend-engineer -> qa-reviewer.

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
