# Design-system migration plan (Phase 3)

Based on origin/main 9545bc3 (2026-09-29)

- **Date:** 2026-09-27, rebased 2026-09-29.
- **Base:** origin/main `9545bc3`. It is 6 commits past the draft's base `42a7c6d`: #37 b46d4fe and #38 43b9b7a (the English layer: content/i18n.mjs with a `t()` dictionary, content/site-data.en.mjs, pages/en/ and sections/en/, English pages under /en/, the DE|EN language switch), #39 1a4ddaf (dist ships the English pages), #41 f2e0a91 (the language-switch view-transition JS), #42 b2ceba9 (the English privacy policy) and #43 9545bc3 (no € amounts in the cases). `git diff --shortstat 42a7c6d 9545bc3`: 124 files, +18,560/−319. Every count and file:line in this plan is re-run on 9545bc3 (Appendix A). Branch `ds/p3-plan`.
- **Inputs:** [brief](design-system-brief.md) (cited "brief §n"), CLAUDE.md "Design-system migration" (hand-off rules 1-8), `.claude/agents/`, [audit](design-system-audit.md) (audited at 199f82f) and [appendix](design-system-audit-appendix.md).
- **Owner decisions applied:** the 2026-09-27 set (hand-built APG primitives with Headless UI v2's data-\* contract, Roboto kept with c1 capped at 4, Hays Glow icons kept, `[data-theme="dark"]` scopes the navy sections with page-level auto-dark off, tokens README at styles/README.md, every step serial) and the two answers given later that day: (1) the criterion-6 fixes that change pixels are included as Kind A steps, with crops and owner approval before merge; (2) the logo name mismatch gets fixed, with the exact DE and EN strings approved here (O-1).
- **Status:** waiting for owner approval (brief §4 Phase 3). Nothing in this plan has been implemented. A review of the 42a7c6d draft was applied on 2026-09-29 (Review log).

## Contents

1. [Summary](#1-summary)
2. [Migration order](#2-migration-order)
3. [Rules this plan sets for every step](#3-rules-this-plan-sets-for-every-step)
4. [Steps DS-01 to DS-18](#4-steps)
5. [Phase 4 weights](#5-phase-4-weights)
6. [End state per criterion](#6-end-state-per-criterion)
7. [Owner items](#7-owner-items)
8. [Resource estimate](#8-resource-estimate)
- [Appendix A: counting commands](#appendix-a-counting-commands)
- [Review log](#review-log)

## 1. Summary

Twenty serial, PR-sized steps, estimated at 4,545 changed authoring lines in total. DS-09 and DS-12 are each split in two (a/b), so the other IDs stay as reviewed:

| Order | Steps | What |
|---|---|---|
| Harness | DS-01, DS-02 | The QA contract of hand-off rule 8, now covering all 72 published pages (36 DE, 36 EN) and the language switch, then regression gates for the known criterion-6 defects and the language-switch motion. Neither changes a shipped file. |
| Criterion-6 fixes (Kind A) | DS-03 | Two lemon glyphs below AA, focus hidden under the sticky header, clipped menu rings, and the logo (DE and EN) and "+" accessible names. |
| Tokens | DS-04, DS-05 | One token source in `@theme` with the M3 token names renamed, then the semantic layer with the navy `[data-theme="dark"]` scopes and the B-51 leftovers. |
| Component API and lint | DS-06, DS-07 | The build-time helper module (cva, cn, parts, and the renderers that live in assemble.mjs moved into content/), then lint landing in CI as a ratchet. |
| Leaf families | DS-08 to DS-13 | One family per step, eight steps: DS-08, DS-09a, DS-09b, DS-10, DS-11, DS-12a, DS-12b, DS-13. |
| Interactive components | DS-14 to DS-16 | Disclosure (expanders, mobile menu, language switch), form field, toggle group. |
| Close-out | DS-17, DS-18 | M3 guard with lint made blocking (this replaces "Material package removal"), then docs. |

**Why the site stays deployable after every step (on top of 9545bc3):**
- Each step is one squash commit on main. It merges only when `npm run check` (which runs check:i18n), `node tools/check-i18n.mjs --complete`, smoke, contrast and (from DS-07) lint exit 0 on the rebased tree, and after a merge the coordinator checks the Railway deploy (hand-off rule 6).
- Kind R steps have to show 0 style transitions at 390 and 1440 px, light and dark, on all 72 pages, so the deployed pages stay pixel-identical in both languages. The one Kind A step changes only the pixels and strings the owner approved.
- Every step that edits a German page or section source edits its English twin in the same diff (3.12). check:i18n fails otherwise.
- No step leaves a half-migrated name behind. Every rename rewrites all its consumers in both locales in the same step (aliases: 0, section 3.4), which works because steps run one at a time and no family branch is open during a rename.
- The token source changes first, before any component work, so later steps build on a settled layer (R1, the largest blast radius).
- Every step has a bundle budget, and any growth names the step that removes it (section 3.6). css/site.css stays under the 64 KiB / 14 KiB gzip gate (tools/check-content.mjs:92, gzip at :94): today it is 55,087 B / 10,506 B, which leaves 10,449 B raw and 3,830 B gzip of headroom.
- The Railway build has no .git (B-49). No step adds a git call to a build path, and DS-06 leaves the no-git fallback (assemble.mjs:90-96) untouched.

**Decisions that shape the plan** (details in sections 2-3; the owner confirms them in section 7):
- There is no Tailwind upgrade step: the repo is already on v4.3.3 (0 %).
- The Kind A fixes land before the token steps, because a pair below AA would block the semantic step (section 2.3).
- One-off design values become `@theme` keys read through `theme()`. Tailwind inlines them at build time, so they add 0 shipped bytes (checked in memory with the installed 4.3.3; section 3.2).
- Components keep their BEM CSS in the canon but read only semantic tokens. Renderers get parts, cva and cn.
- Lint lands early as a ratchet (DS-07) and turns fully blocking in DS-17.
- The English layer is one more consumer of every family, not a family of its own: the twins change with the family that owns their markup, and the language switch is a Disclosure variant in DS-14.

## 2. Migration order

| # | Step | Kind | Brief §4 slot |
|---|---|---|---|
| DS-01 | Harness for the migration QA contract, both languages | R | harness (hand-off rule 8) |
| DS-02 | A11y regression gates with a known-failure list | R | harness |
| DS-03 | Criterion-6 fixes: glyph contrast, focus not obscured, menu ring, accessible names | **A** | placed before tokens (2.3) |
| DS-04 | One token source and M3 token names | R | tokens |
| DS-05 | Semantic layer and `[data-theme="dark"]` navy scopes | R | semantic layer |
| DS-06 | Build-time helper module (cva, cn, parts) | R | before leaf components |
| DS-07 | Lint as a ratchet in CI | R | lint (early, 2.7) |
| DS-08 | Leaf: typography and links | R | leaf components |
| DS-09a | Leaf: page frames | R | leaf components |
| DS-09b | Leaf: legal frame, legal tables and lists | R | leaf components |
| DS-10 | Leaf: page hero and breadcrumb | R | leaf components |
| DS-11 | Leaf: cards A and media | R | leaf components |
| DS-12a | Leaf: cards B, the /portfolio/ and /about-us/ blocks | R | leaf components |
| DS-12b | Leaf: cards B, the homepage, 404 and /karriere/ blocks | R | leaf components |
| DS-13 | Leaf: header and footer chrome, base, fonts, logo, icons | R | leaf components |
| DS-14 | Interactive: Disclosure (expanders, mobile menu, language switch, header scroll state) | R | interactive components |
| DS-15 | Interactive: form field | R | interactive components |
| DS-16 | Interactive: toggle group (filter chips) | A or R (O-4) | interactive components |
| DS-17 | M3 guard, lint blocking and CI | R | "Material package removal" merged with "lint + CI" (2.6) |
| DS-18 | Docs | R | docs |

The progress bar's step ordinal follows this table (20 steps), so DS-10 is step 11 of 20.

### 2.1 Tailwind v4 upgrade: not needed (0 %)

package.json:6 builds with `tailwindcss -i ./styles/main.css`. `@tailwindcss/cli` and `tailwindcss` are 4.3.3, CSS-first, and there is no tailwind or postcss config (audit §1, commands c5 and c7). The brief's first implementation step has nothing to do, so it gets no step and 0 % weight. tooling-engineer replaces tailwind-migrator (CLAUDE.md roster).

### 2.2 Harness first (hand-off rule 8)

DS-01 delivers exactly rule 8: `--scheme`, 1440 px, a pinned Lighthouse, a harness that fails on a selector miss, and a contrast gate that fails when a ring is missing. Along the way it fixes the two focus rows the gate never reached (the mobile menu link and the unselected filter chip, audit §7 gate gap 1).

It also closes the English blind spot. `allRoutes()` imports pages.mjs only (tools/visual/lib.mjs:12-15) and `CORE` is German only (:10), so today no harness tool visits /en/: every "visual:diff 0" and a11y PASS would cover 36 of the 72 shipped pages. Tag-skeleton parity (check:i18n) proves the markup matches, not that English text wraps the same way. And `dumpInPage` skips elements with no client rects (lib.mjs:82), so the closed language-switch menu, its options, the closed mobile-menu panel and closed expander content never appear in a snapshot. DS-01 adds the English routes and an open-disclosure dump.

DS-02 adds the checks the audit found missing (R4): reverse Tab (WCAG 2.4.11), contrast of aria-hidden and CSS-generated glyphs, clipped rings, keyboard contracts (now including the language switch), the axe-incomplete contrast nodes, and a check that the language-switch view transition stays off under reduced motion. Today's defects, in both languages, go on a known-failure list, which DS-03 has to empty.

Neither step changes a shipped file. They are split because together they come to about 540 lines (293 + 244).

### 2.3 Why the Kind A step comes before the token steps

- **The blocker rule.** a11y-perf-reviewer.md says "Any pair below AA is a blocker", and token-architect.md requires every semantic pair to meet AA in light and dark. While the separator (2.33:1) and the "+" (2.06:1) are still lemon on light, the semantic step would have to encode an accent-as-text role below AA to stay Kind R, so it could never get an a11y PASS. Fixing them first means DS-05 starts with an AA-clean pair matrix.
- **Continuity.** DS-03 reaches the exact values DS-05 will give the semantic accent-text role (ink on light grounds, lemon on every navy ground including `.page-hero`). DS-05 can then re-point the glyphs with 0 transitions.
- **Cheapest.** On today's code the fix is about 47 lines, on values the audit measured exactly (styles/09-page-templates.css:51, styles/11-components.css:119, styles/07-header.css:102, styles/10-feedback.css:253, all unchanged since the audit). The CSS is shared, so one change fixes both languages. DS-02's gates prove each defect is gone.
- **Safest.** Every later Kind R step then diffs against a base that already contains the approved pixels, so no Kind A change can end up inside a Kind R diff.
- **The copy change rides along.** The name changes are two dictionary lines (content/i18n.mjs:91 and :205, the DE and EN logo labels) and one CSS line (11-components.css:119, which carries both the "+" colour fix and the "+" name fix), plus 11-components.css:189 if O-11 is approved. Because the plan approval covers the exact strings (section 7), bundling them adds no second owner pause and saves a whole reviewer chain. If the owner wants the copy in its own PR, split it off right after DS-03; the weights move by 0.1.

### 2.4 Tokens, then the semantic layer

DS-04 gives the tokens one source:
- The 42 unlayered `:root` tokens and the 11-components.css token blocks move into `@theme`, with the JS-read keys in `@theme static`.
- All 19 M3 token names are renamed, with every consumer (87 lines, 2 of them in the language switch) rewritten in the same step.

DS-05 adds the semantic roles and marks the 9 navy grounds `data-theme="dark"`: 15 source lines, because 6 of the grounds are hand-written in page and section sources that have English twins. It also handles the B-51 leftovers per R8: the `:is()` host list stays because it is load-bearing, and its comment and the stale canon are rewritten. The M3 names per c1 are done in DS-04 (tokens), DS-08 (`.display-large`), DS-12a (`.fact-grid__label--display`) and DS-15 (the "M3 filled field" comment).

### 2.5 Helper, then leaf families, then interactive components

**DS-06** builds the helper before any family needs it: cn generated from the token file, cva, parts with className and attribute passthrough, a generic `<ui-*>` tag expander, `icon()`, `brand()` and the language-switch renderer moved from assemble.mjs into content/, and a token reader for the img `sizes` strings.

**Leaf families** run in dependency order:
1. Typography and links (DS-08). Every other family uses the heading and link parts.
2. Page frames (DS-09a), then the legal frame, legal tables and lists (DS-09b). The hero and the cards sit inside the frames.
3. Hero and breadcrumb (DS-10).
4. Cards A and media (DS-11).
5. Cards B (DS-12a, then DS-12b), split at the point the draft named.
6. Chrome (DS-13). It goes last because DS-14 edits the same header partial right after it.

**Interactive components:**
1. Disclosure (DS-14) comes first: it is the largest and sets up the shared data-\* helper. The language switch is a third disclosure (Escape with focus return, focusout and outside-click close, a variant nested in the mobile menu), so it becomes a Disclosure variant on the same helper in the same step.
2. The form (DS-15) comes next.
3. The chips go last (DS-16), which gives the owner time for decision O-4.

### 2.6 "Material package removal": merged into DS-17

The repo has 0 Material packages (audit §2: 0 in package.json, package-lock.json and `npm ls`). The M3 footprint is naming, and this plan removes it in the step that owns each name (2.4). Aliases are 0 (3.4), so no alias-removal step is needed either.

What the brief's removal step is really for is making sure the footprint can't come back. DS-17 does that: it adds an M3-signal gate to check-content and removes the one unused dev package (esbuild, R-12, if O-6 approves). It is merged with "lint + CI" because both are tooling-engineer gate work on the same files, and neither is big enough to justify a reviewer chain of its own.

### 2.7 Lint: early as a ratchet (DS-07), blocking in DS-17

Lint lands right after the helper and fails CI whenever a finding count goes up, per file, against a generated baseline. DS-17 deletes the baseline and makes every rule zero-tolerance. The reasons:
- From DS-08 on, each family step gets a measurable done criterion: its rule blocks report 0 findings, and its files' counts go down.
- Code that has already been migrated can't regress unnoticed, because CI enforces the ratchet from the day lint lands.
- The final flip can't surprise anyone with hundreds of findings.
- False positives in the new rules show up while the renderers are still being converted. Examples: `min-h-11` counts as a primitive utility, and literal `class=` in template strings is invisible to the Tailwind plugin (tooling-engineer.md, Lint step).

A report-only mode would give none of that protection, and blocking from day one is impossible: there are 272 lint-relevant CSS lines, 109 literal `class=` in content/render.mjs and 6 more emitted by the language-switch renderer in assemble.mjs today (Appendix A).

### 2.8 Docs (DS-18)

- styles/README.md (the tokens README, which doesn't exist yet).
- The maintained-components list and the missing contracts in docs/components.md.
- The README.md "Design tokens" section.
- A summary header for docs/design-system-migration-log.md.

docs/components.md is also updated on every component step before qa-reviewer, and the log gets one entry after every merge (hand-off rule 6, docs-writer.md).

## 3. Rules this plan sets for every step

### 3.1 How diff size is counted

- **Changed authoring lines** = lines added plus lines deleted, as `git diff --numstat <base>...HEAD` reports them.
- **Excluded as generated:** the shipped HTML (`index.html`, `*/index.html`, 404.html, and the English outputs `en/**/index.html` and `en/404.html`), css/site.css, sitemap.xml, robots.txt, dist/, package-lock.json, tools/copy-baseline.json (written by `copy:accept`), tools/lint-baseline.json (written by `lint:baseline`), the git-ignored `.i18n/` catalogue (written by assemble.mjs, never committed), and the untracked handoff files.
- **Excluded as process overhead:** the per-merge migration-log entry and the docs/PROGRESS.md update.
- A modified line counts twice (1 deleted + 1 added).
- content/render.mjs template lines run up to 1,347 characters (line 152, the jobs list; awk `length`). When a renderer is split into parts, the old line counts once as deleted and every new line counts as added. The estimates assume about 3 new lines per rewritten template line.
- Markup lines count the German source and its English twin separately, because both are edited (3.12).
- Estimates cite the counts behind them. Commands are in the step entries and in Appendix A.

### 3.2 Implementation shape

- **Components** keep their BEM component CSS in the canon (styles/11-components.css, plus the 07-10 files where a rule already lives). They read semantic roles through `var(--color-<role>)`, and one-off design values through `theme(--<key>)`. component-refactorer.md allows this ("becomes utilities or folds into the component canon, whichever keeps the rendered result identical"). It keeps the cascade identical (Kind R) and adds no bytes.
- **Utilities** in markup stay few, and all of them are semantic. For example, `text-ink` becomes `text-fg` and `min-h-11` becomes `min-h-target`. The scanner blocklist (`@source not inline(…)`, styles/main.css:54) now also names `fixed` and `transition`, so neither can be used as a bare utility in markup.
- **One-off values.** `theme(--key)` inside a declaration is inlined at build time, and a key read only that way is not emitted. Checked in memory with node_modules/tailwindcss 4.3.3 (`compile()`, nothing written): `@theme { --size-x: 17.1rem }` plus `.a { min-width: theme(--size-x) }` compiles to `min-width: 17.1rem` with no `--size-x` in the output.
- **Semantic roles** go in a non-inline `@theme` and take their value with `theme(--<primitive>)`. Utilities then read `var(--color-<role>)`, which `[data-theme="dark"]` can switch. Primitives that nothing reads through `var()` are no longer emitted (checked in memory the same way). So the semantic layer swaps primitive declarations for role declarations instead of stacking them (R11).
- **Durations.** `--duration-*` keeps its brief name and has no utility. The `duration-*` utilities read `--transition-duration-*` and pull an `@property --tw-duration` block into site.css (checked in memory), so they aren't used. `--duration-slow` has one more reader since #38: the view-transition pseudo-elements (11-components.css:200).

### 3.3 Token naming policy (DS-04 sets it, every family follows it)

- **Literals equal to an existing token** (33 of them by the Appendix A counter; the audit lists 33 at 199f82f with a different parser) read that token.
- **Dead literals** are deleted, not tokenised, when the owner approves the deletion (O-6). An example is the 14 in `.page-hero::before` (09-page-templates.css:19-29, `display:none` at 10-feedback.css:173).
- **Font weights** (54 literals, 2 of them in the language switch) read `--font-weight-{light,normal,medium,semibold,bold}`. DS-04 re-declares these 5 in styles/main.css with Tailwind's values (theme.css:376-380), so the token file stays the single source.
- **Everything else** becomes a role-named, component-local key (`--<component>-<role>`, for example `--hero-copy-min`). The key lives in the token file's component section. Grid-track lists become one composite key per template, not one key per number. The Appendix A counter finds at most 96 distinct new values.
- **No merging of near-duplicates** inside Kind R: merging them moves pixels. That stays backlog B-38.
- No numeric `--spacing-<n>` (CLAUDE.md).
- **Exception to component-refactorer.md** ("stop and ask token-architect"): family steps add their own component-local keys under this policy. Primitives and semantic roles stay token-architect's. DS-07's duplicate-token check fails any two keys in one namespace that share a value (c7).

### 3.4 Aliases: 0

Steps are serial, so the rename steps rewrite every consumer, in both languages, in one diff:
- DS-04: 87 lines in styles/ for the 19 token names.
- DS-08: 77 lines in 41 files for `.display-large(--light)` (47 lines in 22 German files, 30 in their 19 English twins).
- DS-12a: 11 lines for `.fact-grid__label--display` (the CSS rule, pages/portfolio.html:57-61 and pages/en/portfolio.html:57-61).

Old class names go into the retired-class regex (tools/check-content.mjs:25), and old token names into DS-17's M3 guard. token-architect.md asks the plan to name the step that removes each alias; with no aliases, there is none.

### 3.5 Dark means the navy scopes

- `--scheme=dark` emulates `prefers-color-scheme: dark` and nothing else. It does not set `data-theme` on `<html>`: after DS-05 that would render a page-level dark theme the owner hasn't approved.
- The navy grounds carry their own `data-theme="dark"` from DS-05 on (15 source lines: the 9 grounds, 6 of which also have an English twin). Before that, lib.mjs holds their selectors. Either way they show up in every capture, in both languages.
- diff.mjs reports transitions inside the scopes as the "dark" column.
- A dark capture has to equal the light one, which is the proof that page-level auto-dark stays off.
- DS-01 corrects the wording in tooling-engineer.md:22 (O-5).

### 3.6 Bundle budget accounting

- **Measure:** css/site.css + js/\*.js, raw and gzip-9 (bundle-analyst.md; JS as the per-file level-9 sum, because the scripts are separate requests), with the gate's default-level gzip reported alongside.
- **Per step:** the delta against the step base has to stay within that step's budget.
- **Phase 5 total:** at most the Phase 2 baseline (67,911 raw / 16,130 gzip-9, audit §8.1) plus the tech-track deltas that landed between steps. So far those are B-53 (+23 B raw, +2 B gzip-9) and the English layer, #37 to #43 (+6,119 B raw, +1,404 B gzip-9), together +6,142 raw / +1,406 gzip-9. Today's figure is 74,053 raw / 17,536 gzip-9: css 55,087 / 10,438 and js 18,966 / 7,098, from `wc -c` and zlib level 9 (O-7). Without that allowance Phase 5 would fail by construction, because the tree is already 6,142 B above the Phase 2 baseline.
- **CSS gate:** 55,087 B / 10,506 B (gate gzip) against 65,536 / 14,336. The planned growth in DS-03 to DS-05 (about +800 B raw / +240 B gzip-9) fits.
- **Growth and its offsets:** DS-03, DS-04 and DS-05 add a little CSS. It is offset by the modifier and `:not()` rules DS-08 and DS-10 retire, and by the owner-approved dead-code deletions (O-6: R-5 −633 B, R-6 −291 B, R-10 −280 B, R-8 −171 B).
- **JS:** DS-14 adds the shared data-\* helper. DS-15 and DS-16 offset it with dead code (js/02-intent-links.js:33-37) and by moving JS comments that duplicate the new contracts into docs/components.md; 4,280 characters of the 18,966 shipped JS bytes are comments (3,469 at 42a7c6d; Appendix A). The interactive series has to end at or below DS-14's step base (interactive-refactorer.md: "JS bytes don't grow across the interactive series"). That base is at least 18,966 raw / 7,098 gzip-9 today and is re-measured when DS-14 opens. The draft's target, the Phase 2 JS baseline of 15,670 / 6,125, is unreachable without deleting shipped i18n JS (+3,296 B raw since 42a7c6d).

### 3.7 Generated churn a reviewer should expect

- A step that touches partials/, content/ or pages.mjs re-dates all 72 pages (assemble.mjs:89 `pageSources`; English pages also list pages.en.mjs): 72 HTML files plus sitemap.xml (70 URLs) change `<lastmod>` and `dateModified`.
- A step that touches a page source re-dates that German page and its English twin. `pageSources` lists `page.content`, which is the German source path for both pages, so an edit to pages/en/ or sections/en/ alone re-dates nothing. Under 3.12 every such step edits both twins, so both re-date through the German path. (The English-only gap is tech-track, outside the DS steps.)
- None of this is visible, and qa-reviewer treats it as expected output.
- DS-03's `copy:accept` rewrites 72 page entries in tools/copy-baseline.json: 36 × "Emposo — Startseite" and 36 × "Emposo — Home", one string each. The baseline now holds 72 pages, 12,478 strings and 19 JS strings.

### 3.8 Reviewer chain per step (hand-off rules 2-6)

1. visual-qa captures the baseline at step open.
2. The implementer.
3. a11y-perf-reviewer.
4. visual-qa (after).
5. bundle-analyst, when the step deletes anything or changes CSS, JS, fonts or packages.
6. docs-writer (docs/components.md on the step branch), when components changed.
7. qa-reviewer.
8. Merge. A Kind A step waits for owner approval first.
9. docs-writer appends to the migration log.

All of it runs one after another. On a FAIL the step goes back to the implementer, at most twice. For steps that change no shipped file (DS-01, DS-02, DS-07, DS-18), visual-qa's evidence is `diff -r` of dist/ against the base (identical means 0 transitions by construction; dist/ includes en/), plus the harness runs the step itself asks for.

### 3.9 Known-failure list (DS-02)

- tools/visual/known-failures.json holds one entry per defect the audit recorded, re-measured on the step base in both languages: check, route, width, element, measured value, and the removing step.
- A failure that isn't listed fails the gate.
- A listed entry that no longer reproduces also fails the gate ("stale"), so the fixing step has to delete it.
- Implementers may delete entries their step fixes. Entries are data, like selector strings; the gate logic stays tooling-engineer's.
- DS-02 also keeps the keyboard contracts as data (tools/visual/keyboard-contracts.json), so DS-14 and DS-16 can change a contract without editing gate logic.

### 3.10 Standing constraints

- js/06-work.js, js/01-header.js and js/02-intent-links.js aren't split, and the DS-14 helper in js/00-core.js takes no copy from them. check:copy keys JS strings per file (tools/check-copy.mjs:50-53, compared per file at :74; R10): 06-work.js holds 12 gated strings, 01-header.js 4 (the DE/EN menu labels, :33) and 02-intent-links.js 3, so a split or a move would fail on byte-identical strings.
- No new runtime dependency.
- No overlay state layers (owner feedback 2026-09-27).
- Native state stays the styling source: `[open]`, `aria-pressed`/`aria-checked`, `aria-invalid`, `:user-invalid`, `[aria-current]`. A data-\* mirror is never the only selector (R5).
- New selectors join the shared `:is()` host list only through `:where()` (R8).
- `html { font-size: 100% }` stays, and px mirrors stay px (the 16 px root, audit §4.7).
- **Recorded exception for DS-03:** token-architect re-values exactly the values listed in DS-03, under token-architect.md's own clause "Computed values don't change unless the plan says so". Its scope also covers content/i18n.mjs:91 and :205 and `npm run copy:accept`, for the approved strings only.

### 3.11 Gate set for a Kind R step ("G-R")

- `npm run check` exits 0 on the clean, rebased tree. It runs check:content, check:meta, check:copy and check:i18n (package.json:14).
- `node tools/check-i18n.mjs --complete` exits 0: no German fallback in the English build. Today it reports 0 fallbacks (a scratch assemble of 9545bc3, Appendix A). check:copy alone would pass a German fallback on an English page, because an added string that exists anywhere in the baseline counts as "reused (allowed)" (check-copy.mjs:63, :70).
- `npm run smoke` and `npm run contrast` exit 0, on all 72 pages from DS-01 on.
- `npm run lint` exits 0 (ratchet from DS-07, zero-tolerance from DS-17).
- visual:diff shows 0 style transitions at 390 and 1440, light and dark (dark = the navy scopes), on all 72 pages, in the default dump and the open-disclosure dump (DS-01).
- Lighthouse, median of 3 runs per category: no drop of more than 5 points against the base, on the 5 audit routes and /en/ (performance and best practices from visual-qa, accessibility from a11y-perf-reviewer).
- Bundle within the step budget.
- All of it re-run after the last rebase (hand-off rule 6).

### 3.12 English twins (check:i18n)

- 19 page and section sources have an English twin (pages/en/, 12 files; sections/en/, 7 files). partials/, content/render.mjs, pages.mjs and the CSS are shared, so a change there reaches both languages by construction.
- **Every step that edits a German page or section source edits its English twin in the same step, with the same markup.** check:i18n compares the two pages' tag skeletons: element names plus every attribute except the localized ones in `LOCALIZED_ATTRS` (tools/check-i18n.mjs:27, skeleton at :34-35). `class`, `id` and `data-theme` are all compared. Proof on a scratch copy of 9545bc3: `data-theme="dark"` added to sections/02-hero.html alone makes check-i18n exit 1 ("en/index.html: tag skeleton differs from index.html at tag 123").
- Each family's scope, acceptance greps and estimate include the twins. Greps run over `pages/*.html sections/*.html pages/en/*.html sections/en/*.html`, or `git grep` over the directories.
- **Skeleton-exempt:** the 3 verbatim legal pages (impressum, datenschutzerklaerung, nutzungsbestimmungen, check-i18n.mjs:41). Their English twins are edited by the same rule, but parity there is proven only by each step's own greps naming both files, and by visual:diff on /en/legal-notice/, /en/privacy-policy/ and /en/terms-of-use/.
- **Selector strings in check-i18n.mjs:34-35** are family selector strings, like the retired-class regex: `management-card__bio` (DS-12a), `result-metric__word` (DS-11), `page-hero__metric--word` (DS-10) and `details class="lang-switch` (DS-14). A step that renames one of them edits the string. Otherwise the gate fails: for the three class names on a text-length rule; for the switch because the skeleton stops stripping it (:34) and then compares the two switches, which differ by construction (`aria-current="true"` and `data-lang-option` sit on opposite options in DE and EN, assemble.mjs:213).
- **New copy surfaces** are frozen like the rest: the `t()` dictionary (content/i18n.mjs, 111 keys per locale), the English data overlays (content/site-data.en.mjs), and the bilingual JS literals (3.10). A renderer rewrite must not change which locale a string comes from; `--complete` in G-R catches a German fallback.
- The check-content frame rule reads only the top level of pages/ and sections/ (tools/check-content.mjs:62, `readdirSync(…).filter(f => f.endsWith('.html'))`). DS-01 makes it recursive, so the English twins are scanned from then on (0 hits today).

## 4. Steps

Each entry lists the kind, implementer, reviewers, scope, changes, acceptance criteria, gates, dependencies, risks addressed, bundle budget, rollback and the diff-size estimate with its basis. "Reviewers" follows section 3.8. Rollback is always `git revert <squash sha>` on main, then `npm run build`, `npm run check` and a Railway deploy check. For the token steps, revert later dependants first, in reverse order.

### DS-01: Harness for the migration QA contract (hand-off rule 8), both languages

- **Kind:** R. No shipped file changes.
- **Implementer:** tooling-engineer.
- **Reviewers:**
  1. visual-qa: baseline with today's harness.
  2. a11y-perf-reviewer.
  3. visual-qa: the new harness on both ports.
  4. bundle-analyst: packages change.
  5. qa-reviewer.
- **Scope:**
  - tools/visual/{lib,snapshot,diff,components,contrast,smoke}.mjs.
  - tools/visual/lighthouse.mjs (new).
  - tools/check-content.mjs:62 (the frame rule's directory walk).
  - package.json, and package-lock.json (generated).
  - .claude/agents/tooling-engineer.md:22 (one line, O-5).
- **Changes:**
  - **snapshot.mjs:** `--scheme=light|dark` emulates prefers-color-scheme only (3.5). One output directory per scheme, with the scheme recorded in meta.json. Migration evidence uses `--widths=390,1440`; the default stays 390,1000,1400 (snapshot.mjs:14).
  - **English routes:** `allRoutes()` also reads `pagesEn(pages)` from pages.en.mjs; `--routes=de|en|all` (default `all`, 72 pages; `core` stays the German CORE, plus a `CORE_EN` of their twins).
  - **Open-disclosure dump:** `--open` opens every `<details>` (the mobile menu, both language switches, the expanders) before a second dump per route, because lib.mjs:82 skips elements without client rects. visual:diff compares like with like.
  - **lib.mjs:** a `DARK_SCOPES` list and a per-element "in a dark scope" flag in `dumpInPage`. `hyphenationReady()` takes a language; smoke waits for both `de` and `en` (lib.mjs:31 probes `lang="de"` only). Hyphens are never forced off in a gate.
  - **diff.mjs:** refuses to compare different schemes or widths, and splits transitions into light grounds and dark scopes.
  - **components.mjs:** desktop shots at 1440 instead of 1400 (the SHOTS table at :8-19), plus `--scheme`. It exits 1 on a selector miss, where today it skips and still prints "captured 21" (:54, :61). New shots: the language switch open in the header slot at 1440 and in the menu slot at 390, on / and /en/, and the English legal page.
  - **contrast.mjs:**
    - `--scheme`.
    - Asserts `document.activeElement === host` before measuring a focus state (:76).
    - Fails a focus state that has no ring. Today :86 fails only a ring that exists and is below 3:1.
    - Reaches the menu link by opening the menu from its summary with the keyboard, and the unselected chip by an arrow key from the selected one.
    - New rows for the language switch on / and /en/: button, option, current option, and focus while `[open]`, where the components-layer box-shadow at 11-components.css:182 competes with the unlayered ring's halo (an R3 case). The other rows read the same tokens in both languages by construction, so German rows suffice for them.
    - Deletes the dormant B-51 `::before` overlay branch (:5 comment, :46-48; R-11).
    - Reads an optional semantic pair list (tools/visual/pairs.json, empty until DS-05) and measures each pair in both schemes.
  - **smoke.mjs:** axe, overflow and 200 % text on all 72 pages (through `allRoutes()`); no-JS parity and image weight on CORE and CORE_EN; the Tab walk on the English twins of the 7 keyboard routes (smoke.mjs:132).
  - **lighthouse.mjs** (npm script `visual:lighthouse`):
    - lighthouse 13.5.0 as a pinned devDependency, run through the CLI.
    - `CHROME_PATH` and `--chrome-flags="--headless=new"`; `--no-sandbox` only under CI.
    - Screen emulation at 390 and 1440 (the presets alone are 412 and 1350).
    - The 5 audit routes plus /en/, 3 runs each, with the median per category written to the evidence directory.
  - **check-content.mjs:** the hand-written-frame rule walks pages/ and sections/ recursively (3.12).
- **Acceptance:**
  - Each new failure mode is proven with a deliberately failing sample and a recorded exit code other than 0, then the sample is removed. The samples: a bogus components.mjs selector, a focus ring removed through the CSSOM in a throwaway run, an unreachable focus target, and a hand-written `class="page-hero"` in a throwaway pages/en/ file.
  - `npm run contrast` exits 0 and now records a `focusRing` for "mobile menu link" and "filter chip" (the 2 of 17 focus rows measured unfocused in audit §7, gate gap 1) and for the language-switch rows.
  - `snapshot.mjs --scheme=dark --widths=390,1440` runs on all 72 pages, with and without `--open`, and its diff against `--scheme=light` of the same server shows 0 transitions.
  - `npm run smoke` prints 72 routes and waits for German and English hyphenation.
  - `npm run visual:lighthouse` reproduces the audit §7(g) table within 5 points per category on its 5 routes × 2 widths, and records the first /en/ baseline.
  - `npm ls lighthouse` prints 13.5.0, and `npm ls --omit=dev` is unchanged (serve only).
  - dist/ is byte-identical to the base (`diff -r` exit 0).
- **Gates:** check, smoke and contrast exit 0; dist identity stands in for visual:diff. Lighthouse: this step establishes the pinned baseline.
- **Dependencies:** origin/main 9545bc3.
- **Risks addressed:**
  - R3: a missing ring now fails.
  - R4: Lighthouse pinned, 1440 added.
  - R6: selector misses fail.
  - R8: the tool part of the B-51 leftover.
  - The English blind spot: every later gate covers both languages.
- **Bundle budget:** 0. Nothing shipped changes.
- **Rollback:** revert. No shipped effect.
- **Diff-size estimate: 293 lines.**
  - lib 26 (the dark-scope flag 12, English routes 8, the language parameter of the hyphenation probe 6), snapshot 26 (scheme 14, `--routes` and `--open` 12), diff 10.
  - components 42: the 11 SHOTS lines, modified, plus the flag and the failure path (34), and the language-switch and legal shots (8).
  - contrast 97 (85, plus 12 for the language-switch rows), smoke 10, lighthouse.mjs 72 (new), check-content 4, package.json 4, agent file 2.
  - Basis: `wc -l tools/visual/*.mjs` (lib 101, snapshot 58, diff 68, components 63, contrast 95, smoke 244; all unchanged since 42a7c6d) and the audit §7 gate gaps 1-2.

### DS-02: A11y regression gates with a known-failure list

- **Kind:** R. No shipped file changes.
- **Implementer:** tooling-engineer.
- **Reviewers:**
  1. visual-qa (baseline).
  2. a11y-perf-reviewer.
  3. visual-qa (dist identity).
  4. qa-reviewer.
- **Scope:**
  - tools/visual/smoke.mjs and contrast.mjs, or a new tools/visual/a11y.mjs that both call. The checks run inside the existing `npm run smoke` and `npm run contrast`, so CI already runs them.
  - tools/visual/known-failures.json and tools/visual/keyboard-contracts.json (new, data).
- **Changes:**
  - **Reverse Tab walk:** Shift+Tab from the last footer link, on the 7 keyboard routes (smoke.mjs:132) and their English twins, at 390 and 1440. It fails a stop that sits fully under the sticky header (WCAG 2.4.11). English text lengths can move stops, so the twins are measured, not assumed. A `--motion=no-preference` option lets reviewers rerun it with Lenis on.
  - **Glyph contrast:** every aria-hidden text node, and every `::before`/`::after` with text content, on 72 pages × 2 widths, measured against the composited ground (4.5:1, or 3:1 for large text).
  - **axe-incomplete contrast nodes (R4):** smoke keeps only axe violations (smoke.mjs:64), which drops the axe-incomplete color-contrast nodes (2,071 on the audited routes, audit R4: text over photos and gradients). The gate records them per page and measures each distinct component signature once with the glyph scan's composited-ground sampler. A pair below AA goes on the known-failure list as NEEDS-OWNER, because its fix would be a Kind A change outside the approvals.
  - **Ring clip:** on every walk stop, a failure when an ancestor with overflow other than `visible` clips the ring box (outline width + offset).
  - **Keyboard contracts** (the expected key → effect table is data):
    - chip roving: Arrow keys, Home/End, disabled chips skipped, selection on Enter/Space, one Tab stop per group;
    - the menu: Escape closes it and returns focus to the summary, and it closes on focusout;
    - the language switch, in both slots: Escape closes it and returns focus to its button; inside the open menu, Escape closes only the switch (js/01-header.js:66, `stopPropagation`); it closes on focusout and on an outside click;
    - an invalid submit focuses the first invalid field and sets `aria-invalid`.
  - **Language-switch view transition:** only snapshot's computed-style dump runs under `no-preference` (snapshot.mjs:28); the shots (:37), smoke (:28), contrast (:64) and components (:50) emulate `reduce`, and no tool performs a cross-document navigation, so nothing observes the crossfade. A two-navigation check on / and /en/:
    - under `reduce`, the `pagereveal` after a language-option click has no `viewTransition` (the reduced-motion `@view-transition { navigation: none }`, 11-components.css:201);
    - under `no-preference`, the same click gives a transition, and a nav-link click gives none (`pageswap` calls `skipTransition()` unless `switching` is set, js/01-header.js:78, :84-87);
    - the crossfade's duration token (`--duration-slow`, 11-components.css:200) resolves to the base value.
  - **known-failures.json** (3.9) holds the defects as re-measured on the step base, each marked "removed by DS-03":
    - the 3 fully hidden reverse stops: /kontakt/ "Ihr Name", /impressum/ "Startseite" and /case-studies/data2ai-platform/ "Alle Projekte", all at 390, and whatever the reverse walk measures on their English twins;
    - the lemon separator on the 6 light-hero routes and their English twins;
    - the "+" on /about-us/, /karriere/, /en/about-us/ and /en/careers/;
    - the mobile-menu link rings at 390, in both languages, including the in-panel language options if the ring-clip check finds them clipped.
- **Acceptance:**
  - Each check has a failing sample with an exit code other than 0. For the view transition: a throwaway injected rule that turns the transition back on under reduce.
  - smoke and contrast exit 0 with the list in place.
  - Deleting any single entry makes the gate exit 1.
  - Fixing any listed defect in a throwaway CSSOM run makes the stale check exit 1.
  - The keyboard flows pass on today's behaviour.
  - The handoff lists the axe-incomplete groups with their measured ratios.
- **Gates:** check, smoke and contrast; dist identity.
- **Dependencies:** DS-01.
- **Risks addressed:** R4 (reverse Tab, pseudo-element text, roving keys, focus return, axe-incomplete nodes, the unobserved motion); R3 (clipped rings); R12 (makes the criterion-6 fixes verifiable).
- **Bundle budget:** 0.
- **Rollback:** revert.
- **Diff-size estimate: 244 lines.**
  - Reverse walk 35: the forward walk at smoke.mjs:130-148 is 19 lines, plus the header-overlap measure.
  - Glyph scan 40, axe-incomplete triage 30, ring clip 25.
  - Keyboard flows 43: today's flows at smoke.mjs:166-230 average about 12 lines each, plus 8 for the language switch.
  - View-transition check 30.
  - Known-failure handling 15 and data 18 (the file's structure and the 6 German entries 12, as drafted; 6 English entries, one line each, which inherit the check and the removing step from the German entry they twin), contracts data 8.

### DS-03: Criterion-6 fixes: glyph contrast, focus not obscured, menu ring, accessible names

- **Kind:** **A.** Owner decisions 2026-09-27 (1) and (2). Crops and owner approval before merge (WAITING FOR APPROVAL). The strings are approved with this plan (O-1, O-2, and O-11 if approved), so the copy part needs no second pause.
- **Implementer:** token-architect, with the recorded exception in 3.10.
- **Reviewers:**
  1. visual-qa (baseline).
  2. a11y-perf-reviewer: AX names and Lighthouse.
  3. visual-qa: crops and intended transitions.
  4. bundle-analyst.
  5. docs-writer.
  6. qa-reviewer.
  7. Owner approval.
- **Scope:**
  - styles/09-page-templates.css:13-18 (the `.page-hero` block) and :51 (separator).
  - styles/11-components.css:119 (expander "+"), and :189 (the language option's "✓") only if O-11 is approved.
  - styles/main.css: two new tokens, plus an `html` scroll-padding rule.
  - styles/10-feedback.css:253 (`[id]` scroll-margin-top).
  - styles/07-header.css:109-119 (panel links).
  - content/i18n.mjs:91 (`logo.label`, de) and :205 (`logo.label`, en). partials/header.html:4 reads `{{t:logo.label}}` and doesn't change.
  - tools/visual/known-failures.json (entries removed).
  - docs/components.md.
- **Changes:**
  1. **Separator and "+".** The separator (09:51) and the "+" (11:119) read `var(--accent-ink)` instead of `var(--color-lemon)`. `--accent-ink` is ink on light grounds (main.css:248) and already flips to lemon in `.page-section--dark/--deep` (09:124-125). Add the same flip to `.page-hero`, so separators on navy heroes stay lemon. Without it they would go ink on navy at 1.00:1 (R9). The CSS is shared, so the English twins get the same fix.
  2. **Focus not obscured.** `html { scroll-padding-top: var(<new token>) }`, sized to the scrolled header plus the ring and a gap. `[id] { scroll-margin-top }` shrinks by the same token, so anchor landings don't move.
  3. **Menu rings.** Mobile-menu panel links draw their focus ring inside the link box (a negative outline-offset and an inset halo, from a new token). `overflow-y: auto` (07-header.css:102) then no longer clips it. The resting layout doesn't change. `.mobile-menu__panel a` (07-header.css:109) also matches the in-panel language options (partials/header.html:20 renders them inside the panel; 11-components.css:193-194 already restyle them there), so they get the same inside ring. That is an intended transition, listed below.
  4. **Logo name.** The `logo.label` values become the O-1 strings, DE and EN.
  5. **"+" name.** The expander "+" gets `content: '+'; content: '+' / '';` (O-2). The first declaration is the fallback for browsers without alt text.
  6. **"✓" name, only if O-11 is approved.** `content: "✓"; content: "✓" / "";` at 11-components.css:189, the same pattern.
- **Acceptance:**
  - DS-02's gates pass with the DE and EN entries deleted. Measured:
    - 0 fully obscured reverse stops, in both languages;
    - separator 19.43:1 (ink on white);
    - "+" 17.16:1 (ink on paper);
    - 0 clipped rings.
  - **Anchor landings.** A throwaway probe run by visual-qa (in E) covers `#main`, `/about-us/#management`, `/branchen/#referenzen` and the 8 `/portfolio/#<discipline>` anchors, and the same ids on the English twins (/en/about-us/, /en/industries/, /en/services/), at 390 and 1440, with Lenis on and off. The landed `scrollY` equals the base within 1 px. scroll-padding and scroll-margin aren't in lib.mjs `PROPS`, so visual:diff can't see this.
  - **visual:diff** shows only the intended transitions:
    - `color` on the separator span on the 6 light routes and their 6 English twins;
    - `color` on `.expander summary::after` on /about-us/, /karriere/, /en/about-us/ and /en/careers/;
    - focus-state `outline-offset`/`box-shadow` on panel links, including the in-panel language options.
    Anything else fails.
  - **Continuity.** Computed colours equal what DS-05's accent-text role will give: ink on light, lemon in every navy scope including `.page-hero`.
  - **Copy.** After `copy:accept`, the baseline diff is exactly 72 entries: 36 × "Emposo — Startseite" → the O-1 DE string, and 36 × "Emposo — Home" → the O-1 EN string. `node tools/check-i18n.mjs --complete` exits 0.
  - **AX tree.**
    - The logo link's name is the O-1 string for its language on all 72 pages.
    - The 16 expander names (8 DE, 8 EN) lose their trailing " +".
    - With O-11: the current language option's name is "Deutsch" or "English", without "✓".
    - Lighthouse `label-content-name-mismatch` passes on the 5 Lighthouse routes and /en/, at both widths.
    - The Lighthouse accessibility score doesn't drop.
  - **Crops** (`visual:pixdiff` plus components.mjs) at 390 and 1440, light and dark:
    - the breadcrumb on /impressum/ and on /portfolio/, and on /en/legal-notice/ and /en/services/;
    - the expander, open and closed;
    - a focused menu link, and a focused in-panel language option at 390, DE and EN.
    Owner approval recorded in DS-03.md.
- **Gates:** G-R, except that visual:diff allows only the listed transitions. Plus the copy baseline diff.
- **Dependencies:** DS-02.
- **Risks addressed:** R12, R9 (the `.page-hero` flip), R3 (clipped ring).
- **Bundle budget:** +150 B raw / +50 B gzip-9 (new rules and tokens). Removed by DS-06 (R-5, −633 B) if O-6 approves, otherwise by DS-10 (R-6).
- **Rollback:** revert. This also restores the copy baseline.
- **Diff-size estimate: 47 lines.**
  - 09:51, 11:119 (colour and alt text) and 10:253: 6.
  - `.page-hero` flip 2, scroll-padding token and rule 5, panel ring 4.
  - content/i18n.mjs:91 and :205: 4.
  - known-failures entries 12 (6 German and 6 English entry lines deleted), docs 8, rounding 6.
  - O-11, if approved, adds 2.
  - Basis: the audit §7 FAIL items 1-3, 6 and 8-9, re-resolved on 9545bc3 (`grep -n "content: '+'\|page-breadcrumb span\|scroll-margin-top" styles/*.css`; `grep -n logo.label content/i18n.mjs`).

### DS-04: One token source and M3 token names

- **Kind:** R.
- **Implementer:** token-architect.
- **Reviewers:**
  1. visual-qa (baseline).
  2. a11y-perf-reviewer.
  3. visual-qa.
  4. bundle-analyst.
  5. docs-writer.
  6. qa-reviewer.
- **Scope:**
  - styles/main.css: token blocks, base literals, stale comments.
  - styles/11-components.css:73-76, :89-91 and :167: token definitions, moved out.
  - The consumers of renamed tokens in styles/07-11 and main.css, including the two `--text-body-sm` reads in the language switch (11-components.css:180, :186).
  - styles/09-page-templates.css:104.
  - docs/components.md (1 line).
- **Changes:**
  - **One `@theme` source.** The unlayered `:root` (main.css:179-249) becomes a second `@theme` block. Keys outside Tailwind's namespaces emit a variable but no utility. The `@media (width < theme(--breakpoint-nav))` `--header-h` redefinition (:251) stays unlayered, so it still wins.
  - **JS-read keys:** `--duration-countup` (js/07-countup.js:28) and `--breakpoint-nav` (read from DS-14 on) go into `@theme static`. Today `--breakpoint-nav` ships only because the js/01-header.js:26 comment names it (audit §4.2).
  - **11-components.css tokens move into the token file:**
    - `--display-size`/`--display-leading` (:76) and the hero redefinition (:90).
    - `:root:dir(rtl)` (:167) moves unlayered next to `--scrim-ink-side`, so it finally applies under `dir="rtl"`. It is deleted instead if O-6 drops RTL.
  - **Palette reset:** `--color-*: initial` at the top of `@theme`. No default-palette class exists in the sources (the 14 generated utilities, audit §3.3).
  - **Font weights:** the 5 used `--font-weight-*` keys are re-declared (3.3).
  - **Same-kind duplicates that share a role are merged:** `--tracking-caps-slight` → `--tracking-caps`, `--display-leading` → `--leading-display`, `--spacing-rule` → `--space-4`, `--spacing-cell` → `--space-6` (1, 1, 1 and 3 consumers). `--color-bg`/`--color-on-dark` waits for DS-05.
  - **`--fact-min`** becomes a token at today's 16rem (09:104). **`--space-28`** is deleted: 0 reads, bundle proof.
  - **M3 token names.** The 19 names (17 type roles, `--breakpoint-compact`, `--state-disabled`) are renamed, and all 87 consumer lines are rewritten in this step. The M3 comments at main.css:67, :74, :98, :166, :169, :180 and :229 go.
  - **Stale plumbing comments** in main.css are corrected: :1-24 ("never generated", "00-base.css"), :363-382 (caps, `max-width:none`) and :393-396 ("@keyframes bodies").
- **Acceptance:**
  - `git grep -nE -- '--(text|leading|tracking)-(display|headline|title|body|label)|--display-(size|leading)|--breakpoint-compact|--state-disabled' -- styles` exits 1.
  - Custom-property declarations outside styles/main.css are only the scoped hooks left for DS-05 (09:124-125 and the `--focus-halo` hook in 10-feedback.css). Command: the audit's perl declaration scan (§3.6).
  - css/site.css still contains `--duration-countup`, `--breakpoint-nav` and `--duration-slow`, and no longer contains `--space-28`. It has 0 default-palette variables, and the 11 `.container` steps are unchanged (`grep -o '\.container{max-width:[0-9.]*rem}' css/site.css`).
  - visual:diff shows 0 style transitions, and contrast ratios equal the base.
  - DS-02's view-transition check passes (the crossfade reads `--duration-slow` and `--ease-em`, 11-components.css:200).
  - If RTL is kept, a throwaway `dir=rtl` probe on /portfolio/ gives 270deg.
  - The handoff lists the rename map, the deletion list, and the consumers still on primitives.
- **Gates:** G-R.
- **Dependencies:** DS-03.
- **Risks addressed:** R1 (layer placement, namespace traps, the RTL override), R2 (breakpoint renames, the comment dependency), R11, c1.
- **Bundle budget:** +150 B raw / +40 B gzip-9 (rename length drift and the static block). Offset by DS-06/DS-10 deletions (O-6).
- **Rollback:** revert. DS-05 onward depend on it, so revert those first.
- **Diff-size estimate: 298 lines.**
  - Renames: 87 lines × 2 = 174. Command: `git grep -n -E -- '--(text|leading|tracking)-(display|headline|title|body|label)[-a-z]*|--display-(size|leading)|--breakpoint-compact|--state-disabled' -- styles | wc -l` → 87.
  - M3 comment lines not already among those: 6 × 2 = 12. Docs: 2.
  - Consolidation 103: block header and comment 8, static block 6, 11-components.css moves 20, `--fact-min` 3, merges 13, `--space-28` 1, palette reset 2, stale comments about 25 lines × 2 = 50.
  - Font-weight keys 7.

### DS-05: Semantic layer and `[data-theme="dark"]` navy scopes

- **Kind:** R.
- **Implementer:** token-architect.
- **Reviewers:**
  1. visual-qa (baseline).
  2. a11y-perf-reviewer: the pair matrix in both schemes.
  3. visual-qa.
  4. bundle-analyst.
  5. docs-writer: the state-layer canon.
  6. qa-reviewer.
- **Scope:**
  - styles/main.css: roles and the dark block.
  - styles/09-page-templates.css:13-18 and :124-125.
  - styles/10-feedback.css: the `--focus-halo` hook.
  - styles/00-base-remainder.css:20-25 (the ring).
  - styles/11-components.css:11-17 (comment only) and :39.
  - `data-theme="dark"` on the 9 navy grounds, 15 source lines:
    - German sources: sections/02-hero.html:1, sections/04-about.html:1, sections/07b-sales-cta.html:1, pages/kontakt.html:1, pages/about-us.html:15, pages/portfolio.html:8.
    - Their English twins (3.12): sections/en/02-hero.html:1, sections/en/04-about.html:1, sections/en/07b-sales-cta.html:1, pages/en/kontakt.html:1, pages/en/about-us.html:15, pages/en/portfolio.html:8.
    - Shared: partials/footer.html:1, content/render.mjs:65 (`pageHero`) and :168 (`cta`).
  - tools/visual/pairs.json, and lib.mjs `DARK_SCOPES` (data).
  - docs/components.md:28-36, :86-112, :89 and :234-238.
- **Changes:**
  - **Semantic roles** go in `@theme` (non-inline), valued through `theme(--<primitive>)` (3.2): surface, surface-muted, surface-veil, fg, fg-muted, fg-faint, border, border-strong, accent (the decorative lemon), accent-fg (accent used as text), focus-ring, focus-halo, error-fg, and inverse roles for the hover and focus inverts. `--color-bg`/`--color-on-dark` split into one white primitive and two roles (R9, "one token, two roles").
  - **The `[data-theme="dark"]` block** gives the roles today's on-dark values, so no pixel moves. The 9 navy grounds get the attribute. The state-painted navy (the CTA inverts at 10-feedback.css:28-33, the card inverts at :128-138, the select fill at 11-components.css:44) uses the inverse roles, not scopes.
  - **Existing flips.** The two flips at 09:124-125 move into the dark block. DS-03's `.page-hero` flip goes, because `.page-hero` is now a scope.
  - **Page-level dark.** `html[data-theme="dark"]` would work by construction, but no `prefers-color-scheme` block ships until the owner approves a dark design (0 bytes). DS-18 documents the switch.
  - **Focus ring:** colour roles plus geometry tokens (2px width, 2px offset, 2px halo). The rule stays unlayered (R3), so it keeps winning over the language switch's open-state box-shadow (11-components.css:182). `outline: none` at 11-components.css:39 is deleted: the unlayered ring already wins there, so computed styles don't change.
  - **B-51 leftovers (R8):**
    - The `:is()` host list (11-components.css:15-17) stays. It is the only resting `position: relative` for 13 of its 14 hosts.
    - Its comment (:11-14) is rewritten to say what it is (the positioning and stacking context for decorations and inverts).
    - Specificity (0,1,1) is unchanged, and new hosts join only through `:where()`.
    - docs-writer rewrites the stale state-layer canon and re-measures the contrast table, which is stale since B-51 (audit §2 item 5).
- **Acceptance:**
  - visual:diff shows 0 style transitions on all 72 pages. From this step on, the dark column has data (the 9 scopes).
  - check:i18n passes: the 6 twins carry the same attribute.
  - `npm run contrast` exits 0 including the pair matrix. Every semantic pair meets AA (4.5:1 text, 3:1 large text and UI) in light and dark, and the matrix is in the handoff.
  - A runtime probe finds 0 navy element signatures outside a scope, except the listed state inverts (audit §4.4 counts 10 today), on / and /en/.
  - Primitives no component reads through `var()` are absent from css/site.css.
  - `grep -niE 'state.?layer' docs/components.md` finds only "formerly"/"removed" notes.
  - The handoff lists the consumers still on primitives, for the families.
- **Gates:** G-R.
- **Dependencies:** DS-04.
- **Risks addressed:** R9, R3, R8, R1, R11.
- **Bundle budget:** +500 B raw / +150 B gzip-9 (the dark block). Removed by DS-08 (the `--light` modifier rules: 11-components.css:71, :80, :106-107, 09-page-templates.css:137) and DS-10 (the breadcrumb `:not()` chains, 10-feedback.css:232-236).
- **Rollback:** revert, after the dependants.
- **Diff-size estimate: 173 lines.**
  - Roles 30, dark block 19.
  - Navy grounds: 15 lines × 2 = 30. Command: `/usr/bin/grep -noE 'class="(hero|services|contact|site-footer|page-section[^"]*--(dark|deep))[ "]' sections/*.html pages/*.html partials/*.html content/render.mjs sections/en/*.html pages/en/*.html` → 14 (8 German, 6 English), plus `pageHero` at render.mjs:65.
  - Flips 6, ring 10, B-51 comment 8, pairs.json 30.
  - components.md 40: `grep -ciE 'state.?layer|--state-(hover|press|inset)' docs/components.md` → 6 lines, plus the 18-row table.

### DS-06: Build-time helper module (cva, cn, parts)

- **Kind:** R.
- **Implementer:** tooling-engineer.
- **Reviewers:**
  1. visual-qa (baseline).
  2. a11y-perf-reviewer.
  3. visual-qa.
  4. bundle-analyst: packages, plus a CSS deletion if R-5 is approved.
  5. docs-writer: the helper contract.
  6. qa-reviewer.
- **Scope:**
  - content/ui.mjs (new).
  - assemble.mjs: the expander call, the `icon()`/`brand()` move (:118-130), the language-switch renderer (:200-216; `LANG_NAME` :206, `langSwitch` :207-216), and the dead stampNav branches (:174-175, :178-179, :182).
  - styles/main.css: `@source not inline("container")`, only if O-6 approves R-5.
  - package.json: class-variance-authority 0.7.1 and tailwind-merge ^3.7 as devDependencies.
  - docs/components.md.
- **Changes:**
  - **cn** is `extendTailwindMerge` with every custom `@theme` key, generated from styles/main.css at build time. **cva** is re-exported.
  - **`part(tag, variants)`** returns `(props, children) => html`. It merges `className` and passes `id`, `data-*` and `aria-*` through, escaped.
  - **A generic `<ui-name …>…</ui-name>` expander** resolves tags to renderers registered in content/render.mjs, and runs on pages, sections and partials, in both languages. Families convert hand-written repeats without touching assemble.mjs again.
  - **`icon()`, `brand()` and the language-switch renderer** move into content/, which is an `@source` (R7), and accept className and attributes. The switch becomes a pure renderer taking the locale, both paths and the slot; the twin lookup (`pages.find`, `published`) stays in assemble.mjs. Today the switch's `min-h-11` (assemble.mjs:213, :215) and its other classes are generated only because the same classes also appear in scanned files; once DS-13 to DS-16 retire `min-h-11` elsewhere, a switch left in assemble.mjs would lose its 44 px target with the build green. After the move assemble.mjs emits no class list: its one remaining `class="` is the breadcrumb-parsing regex at :51.
  - **A token reader** converts rem breakpoints to px at 16 px, the unit today's `sizes` strings use (for DS-11).
  - **A build assertion** fails the build if cn stops keeping a custom key next to a colour key.
  - **Dead stampNav branches** (`{{CUR:}}` and `navGroup`, 0 consumers, F5-14) are deleted with proof.
  - **R-5** (if O-6 approves): the generated `.container` utility (12 rules, 633 B) stops being generated. The unlayered `.container` (main.css:383-390) keeps winning.
- **Acceptance:**
  - The assertion passes, and removing one key from the generated config fails the build (exit code other than 0).
  - Generated HTML (72 pages) and css/site.css are byte-identical to the base (`diff -r` of the outputs), except the R-5 rules if approved. That proves the renderers moved into an `@source` added no utility.
  - `npm ls --omit=dev` is unchanged.
  - With R-5, visual:diff shows 0 transitions and `.container` still computes to 1344px.
  - `grep -rn '{{CUR:' partials pages sections content` and `grep -rn navGroup pages.mjs pages.en.mjs content` → 0 before the deletion.
  - `grep -c 'class="' assemble.mjs` → 1 (the regex at :51).
  - The no-git fallback (assemble.mjs:90-96) is untouched.
- **Gates:** G-R.
- **Dependencies:** DS-05, so cn's config includes the semantic keys.
- **Risks addressed:** R7 (both renderers into an `@source`), R11 (R-5), the stack risk around the no-git fallback, F6-7.
- **Bundle budget:** 0, or −633 B raw with R-5, which offsets DS-03 and DS-04.
- **Rollback:** revert.
- **Diff-size estimate: 200 lines.**
  - ui.mjs 100: cn config 40, parts and attributes 35, tag expander 15, token reader 10.
  - assemble.mjs 74: the `icon`/`brand` move, −13 +20, is 33; the language-switch move (11 lines out, about 12 into content/, 3 call-site lines modified) 29; expander call 6; dead code 6.
  - Assertion 6, package.json 2, main.css 2, docs 16.
  - Basis: `sed -n '118,130p;171,185p;200,216p' assemble.mjs` and tooling-engineer.md, Helper step.

### DS-07: Lint as a ratchet in CI

- **Kind:** R. Nothing ships.
- **Implementer:** tooling-engineer.
- **Reviewers:**
  1. visual-qa (baseline).
  2. a11y-perf-reviewer.
  3. visual-qa (dist identity).
  4. bundle-analyst: packages.
  5. qa-reviewer.
- **Scope:**
  - eslint.config.mjs (new). Its HTML globs cover pages/en/ and sections/en/.
  - tools/lint/: a local CSS rule and the ratchet runner.
  - tools/lint-baseline.json (generated).
  - tools/check-content.mjs: a literal `class=` counter for every build-time renderer file.
  - package.json: eslint (10 or lower), eslint-plugin-better-tailwindcss 4.x, @html-eslint/parser, @eslint/css 2.x, tailwind-csstree; scripts `lint` and `lint:baseline`.
  - .github/workflows/check.yml (a lint step).
  - README.md (commands).
- **Changes:**
  - **better-tailwindcss** rules:
    - `no-unknown-classes` (detectComponentClasses; ignores `gutter` and `{{PLACEHOLDER}}`);
    - `no-restricted-classes` for arbitrary values, variants and properties, and for primitive colour utilities, with the pattern generated from the primitive names.
    - Palette classes are caught through DS-04's `--color-*: initial`.
  - **@eslint/css** runs with the tailwind4 syntax, in tolerant mode. A local rule reports, outside the token blocks:
    - hex, colour functions, named colours and non-zero px/rem/em;
    - raw font-weight, z-index and unitless line-height;
    - `var(--color-<primitive>)`.
    Raw custom-property values are regex-tested.
  - **Duplicate-token check** (3.3). Its baseline is 0 after DS-04 and DS-05, so it blocks from the start.
  - **check-content** counts literal `class="` that isn't `${cn(` or cva in content/\*.mjs and in assemble.mjs. In assemble.mjs only the breadcrumb-parsing regex at :51 is allowed (matched by its line content), so a renderer that moves back there fails.
  - **Ratchet:** `npm run lint` fails when a file's finding count, or a renderer file's literal count, rises above tools/lint-baseline.json. `npm run check` runs lint, and CI runs it next to check, smoke and contrast, with exit codes propagating (no pipes).
- **Acceptance:**
  - A failing sample per rule (exit code other than 0): an arbitrary class in a page and in an English twin, a raw hex in component CSS, a primitive `var()`, a primitive utility, a literal `class=` in render.mjs, a literal `class=` emitted by assemble.mjs, a count increase.
  - A clean run exits 0.
  - The PR checks list shows the lint job.
  - The per-file baseline is recorded in the handoff (the Phase 4 burn-down).
- **Gates:** check, smoke and contrast; dist identity.
- **Dependencies:** DS-06.
- **Risks addressed:** R7, R11 (0 bytes).
- **Bundle budget:** 0.
- **Rollback:** revert.
- **Diff-size estimate: 247 lines.**
  - eslint.config.mjs 70, the local CSS rule 80, ratchet runner 45, duplicate check 20, check-content 16 (10, plus 6 for the other renderer files and the allowlisted regex), package.json 8, CI 4, README 4.
  - Basis: tooling-engineer.md, Lint step. The literal counts today: `grep -o 'class="' content/render.mjs | wc -l` → 109 on 22 lines; `grep -o 'class="' assemble.mjs | wc -l` → 7 (6 in the language switch at :213 and :215, 1 in the regex at :51).

### Leaf family steps (DS-08 to DS-13): shared contract

- **Kind:** R. **Implementer:** component-refactorer, one family per step. **Reviewers:** the full chain in 3.8, including bundle-analyst and docs-writer. **Gates:** G-R.
- **What every family step does:**
  - Replace its lint-relevant CSS lines: literals become tokens per 3.3, and primitive colour reads become semantic roles.
  - Express its renderers as parts with cva variants and cn, accepting `className` and passing attributes through.
  - Convert its hand-written repeats in pages/, sections/ and partials/ into `<ui-*>` tags or renderer calls, in the German source and its English twin in the same diff (3.12).
  - Update its selector strings in tools/visual, the retired-class regex (check-content.mjs:25), and check-i18n.mjs:34-35 where its classes appear.
  - List every deletion.
- **Shared acceptance:**
  - visual:diff shows 0 style transitions on all 72 pages, default and `--open` dumps.
  - check:i18n passes, and `node tools/check-i18n.mjs --complete` exits 0.
  - The family's rule blocks report 0 lint findings (lint JSON filtered by the selector list in the handoff), and `lint:baseline` counts only go down.
  - Every class list in the family's renderers is `${cn(…)}` or cva.
  - A renderer called with `className` and `data-x` outputs both (a node check in the handoff).
  - The per-step grep for hand-written repeats returns 0 in the German sources and in the English twins.
  - check:copy passes unchanged.
- **Estimate formula.** The family's lint-relevant CSS lines × 2 × 1.15 (the 1.15 covers the design ratio literals in fr, % and vw on the same rules). Then add: new keys; markup lines (German plus English) × 2; rewritten render.mjs lines × 1 plus about 3 new lines per rewritten line, plus new parts; tool and regex edits; docs. The counts come from Appendix A.
- **Split trigger.** A family estimated above about 400 lines is split at a named point. DS-09 (523) and DS-12 (474) are split. DS-08 (414) is not: 218 of its lines are one mechanical rename (`.display-large`, 77 lines in 41 files) that has to land in one diff because aliases are 0, and a split would put the heading part and the link part, which every other family consumes, in two different bases.

### DS-08: Leaf: typography and links

- **Scope:** the display heading, eyebrow, section lede/more/top, statement, explore title, text link and arrow, and the pill CTA CSS (10-feedback.css:26-33). The classes: `.display-large(--light)`, `.eyebrow(--light)`, `.section-*`, `.text-link(--light)`, `.header-contact`. Their markup is in 20 German files and 19 English twins; render.mjs lines 62, 113, 152, 160, 167, 168, 189, 190, 191, 262, 265 and 273.
- **Changes:**
  - `.display-large` becomes a role-named heading class.
  - The `--light` modifiers are dropped, because the scopes now flip the roles (R9).
  - Heading and eyebrow become one part, and the text link and arrow another. The arrow is typed as a literal 8 times and as `${arrow}` 4 times; render.mjs bypasses its own constant 3 times (audit §6.3).
- **Acceptance:**
  - `git grep -nE 'display-large' -- styles pages sections content partials` exits 1 (77 lines in 41 files today), and the old name is in the retired regex.
  - `git grep -nE '(eyebrow|display-large|text-link|page-section__lede)--light' -- styles pages sections content partials` exits 1. (Scoped to the sources: the history docs keep the old names on purpose.)
  - The arrow span literal appears once in the sources (the part).
- **Dependencies:** DS-07.
- **Risks addressed:** R6 (renamed selectors in the gates), R9, R10.
- **Bundle budget:** 0. It removes the `--light` rules, offsetting DS-05.
- **Diff-size estimate: 414 lines.**
  - CSS: 28 lines → 64, plus about 8 selector-only rename lines × 2 = 16.
  - Keys: at most 7.
  - Markup: (55 German + 54 English) lines × 2 = 218.
  - render.mjs: 12 lines → 48, plus 30 for the new parts.
  - Tools 6, docs 25.
  - Basis: Appendix A (type+links 28 lines, 7 keys; markup grep 55 lines in 20 German files and 54 in 19 English twins).

### DS-09a: Leaf: page frames

- **Scope:**
  - The page-section frame: 30 frames (25 hand-written, 5 in render.mjs), plus the 25 in the English twins.
  - The `.gutter > .container` wrapper: 34 (26 hand-written, 8 in render.mjs and the partials), plus 26 in the English twins.
  - The page-cta frame (the `cta` renderer, render.mjs:162-169).
  - The frame CSS: `.subpage`, `.page-section--paper/--dark/--deep` and `.page-cta__copy` (6 lint lines).
- **Changes:** a frame part with variants (paper, dark scope, id, aria-labelledby), and the wrapper part.
- **Acceptance:**
  - `cat pages/*.html sections/*.html pages/en/*.html sections/en/*.html | grep -cE '<section[^>]*class="[^"]*page-section'` → 0 (50 today).
  - The check-content page-cta rule (:64-67), now recursive, still passes.
- **Dependencies:** DS-08.
- **Risks addressed:** R6, R10.
- **Bundle budget:** 0.
- **Diff-size estimate: 269 lines.**
  - CSS: 6 lines → 14. Keys: 3.
  - Markup: (51 German + 49 English) lines × 2 = 200.
  - render.mjs: 6 lines → 24, plus 15 for parts. Tools 1, docs 12.
  - Basis: Appendix A (the frames grep; the frames+lists CSS split 6 / 11).

### DS-09b: Leaf: legal frame, legal tables and lists

- **Scope:**
  - The legal-copy frame (5 German pages plus their 5 English twins, and the sitemap).
  - The 24 legal-table regions on pages/datenschutzerklaerung.html (:231 … :2621) and the 24 on pages/en/datenschutzerklaerung.html.
  - `result-list`, explore, and the sitemap fragment (render.mjs:289-291).
  - The lists and legal CSS (10-feedback.css:204-246, 11-components.css:141-143; 11 lint lines).
- **Changes:** a legal-table region part that emits the same "Tabelle n" / "Table n" label, taken from the page source (for example `label="Tabelle 1"`), so no string moves into the dictionary and check:copy stays unchanged; a legal frame part; list parts.
- **Acceptance:**
  - `grep -c 'class="legal-table"' pages/datenschutzerklaerung.html pages/en/datenschutzerklaerung.html` → 0 and 0 (24 and 24 today). Both files are named because the verbatim legal pages are skeleton-exempt (3.12).
  - Every shipped `aria-label="Tabelle n"` and `aria-label="Table n"` is byte-identical to the base.
  - visual:diff 0 on /impressum/, /datenschutzerklaerung/, /nutzungsbestimmungen/ and their English twins, the pages check:i18n doesn't compare.
- **Dependencies:** DS-09a.
- **Risks addressed:** R6, R10.
- **Bundle budget:** 0.
- **Diff-size estimate: 286 lines.**
  - CSS: 11 lines → 25. Keys: 5.
  - Markup: (30 German + 30 English) lines, plus the 24 + 24 legal-table closing lines, × 2 = 216.
  - render.mjs: 4 lines → 16, plus 10 for parts. Tools 1, docs 13.
  - Basis: Appendix A (the lists grep; `grep -c '</table>' pages/datenschutzerklaerung.html pages/en/datenschutzerklaerung.html` → 24, 24). The two halves sum to 32 lines more than the unsplit 523, because 12 markup lines match both greps and are touched in both steps.

### DS-10: Leaf: page hero and breadcrumb

- **Scope:**
  - `breadcrumb` and `pageHero` (render.mjs:56-65), and the project hero (:189).
  - The homepage hero (sections/02-hero.html and sections/en/02-hero.html), the hero scrims and visuals.
  - The breadcrumb colour rules (09-page-templates.css:36-51, 10-feedback.css:229-236).
  - The `@container (width < 56rem)` literal at 10-feedback.css:56.
  - The `page-hero__metric--word` selector string in check-i18n.mjs:35.
- **Changes:**
  - Hero parts (Root, Copy, Figure, Metric), with the homepage hero as a variant of the same renderer.
  - The breadcrumb colour follows the scope. That removes the `:not(.page-section--dark):not(.page-section--deep)` chains (R9).
  - `@container` reads `--container-content`.
  - If O-6 approves: the dead `.page-hero::before` pair (09:19-29 and 10-feedback.css:173, R-6) and the overridden `.hero__*` declarations (I-3, R-7) are deleted.
- **Acceptance:**
  - `grep -c ':not(.page-section--dark)' styles/10-feedback.css` → 0.
  - The breadcrumb contrast rows are unchanged (7.59 on dark, 19.43 light).
  - sections/02-hero.html and sections/en/02-hero.html have 0 `class="hero` literals.
  - The check-content hero and breadcrumb rules pass.
- **Dependencies:** DS-09b.
- **Risks addressed:** R9, R2 (the hidden 56rem mirror).
- **Bundle budget:** 0. With O-6 it shrinks by 291 B plus the I-3 bytes, offsetting DS-03 to DS-05.
- **Diff-size estimate: 269 lines.**
  - CSS: 47 lines → 108. Deletions 24. Keys about 20: at most 24, fewer if R-6 is deleted.
  - Markup: (15 German + 15 English) lines × 2 = 60.
  - render.mjs: 3 lines → 15, plus 15 for parts and the home variant.
  - Tools 2, docs 25.
  - Basis: Appendix A (hero 47 lines, 24 keys; the markup grep, 15 lines in 6 files per language).

### DS-11: Leaf: cards A and media

- **Scope:**
  - The reference card and grid, including the collage variant through cva.
  - The result metric: one part, which the inline copy at render.mjs:189 then reuses. The `result-metric__word` selector string in check-i18n.mjs:35.
  - The industry tile.
  - `picture()` (render.mjs:47-50): an options object with className and attributes.
  - The 8 `sizes` strings (render.mjs:47 (the `picture()` default), :79, :111 ×2, :112, :189, :263 and assemble.mjs:149), generated from the breakpoint tokens with the px values unchanged.
- **Acceptance:**
  - `grep -noE "'\(max-width: [0-9]+px\)" content/render.mjs assemble.mjs` → 0.
  - Every shipped `sizes="…"` attribute on all 72 pages is byte-identical to the base (`grep -rho 'sizes="[^"]*"'` over the shipped HTML, diffed).
  - The metric logic exists once.
- **Dependencies:** DS-10.
- **Risks addressed:** R2 (px mirrors of breakpoints), R7, the 16 px root (px kept on purpose).
- **Bundle budget:** 0.
- **Diff-size estimate: 140 lines.**
  - CSS: 12 lines → 28. Keys 3.
  - Markup: (7 German + 7 English) lines × 2 = 28.
  - render.mjs: 8 lines → 32, plus 25 for parts.
  - assemble.mjs 2, tools 2, docs 20.
  - Basis: Appendix A (cardsA 12 lines; the cardsA and media greps: 7 lines per language, and render.mjs lines 50, 65, 79, 105, 113, 189, 263, 278).

### DS-12a: Leaf: cards B, the /portfolio/ and /about-us/ blocks

- **Scope:**
  - Portfolio modes, the fact grid (with `.fact-grid__label--display` renamed), the discipline grid, the expertise pair, company values, company facts, the static parts of the management card (the expander stays for DS-14), about-netzwerk and the trust strip.
  - Their markup in pages/portfolio.html, pages/about-us.html and the two English twins.
  - The `management-card__bio` selector string in check-i18n.mjs:34.
- **Changes:** the numbered-label pattern (4 class names, audit §6.3) becomes one part with variants, but only where the 4 are pixel-identical (F6-4). Any that differ stay as separate variants.
- **Acceptance:**
  - `cat pages/portfolio.html pages/about-us.html pages/en/portfolio.html pages/en/about-us.html | grep -cE 'class="(portfolio-mode|fact-grid|company-values|expertise-pair)[ "_]'` → 0.
  - `git grep -n 'label--display' -- styles pages sections content partials` exits 1 (11 lines today).
  - The Kennzahlen stay final in the HTML (check-content.mjs:33-35).
  - check:copy is unchanged, including the certifications (render.mjs:70) and the management profiles in `management()` with their English overlay (R10).
- **Dependencies:** DS-11.
- **Risks addressed:** R10, R6.
- **Bundle budget:** 0.
- **Diff-size estimate: 285 lines.**
  - CSS: 43 lines (portfolio 27, about 16) → 99. Keys 10.
  - Markup: (28 German + 28 English) lines × 2 = 112.
  - render.mjs: 8 lines → 32, plus 12 for parts.
  - Tools and regex 2, docs 18.
  - Basis: Appendix A (the cardsB CSS split by block; the cardsB markup grep per file).

### DS-12b: Leaf: cards B, the homepage, 404 and /karriere/ blocks

- **Scope:**
  - The connection model and steps, the expertise intro and list, the section grounds (`.services`, `.industries`, `.work`), the tag, the expertise card (404), and the static parts of the job card (the expander stays for DS-14).
  - Their markup in sections/02b-expertise.html, sections/03-models.html, sections/04-about.html, pages/404.html and the four English twins.
- **Changes:** the rest of the numbered-label part (DS-12a).
- **Acceptance:**
  - `cat pages/*.html sections/*.html pages/en/*.html sections/en/*.html | grep -cE 'class="(expertise-card|portfolio-mode|fact-grid|company-values|connection-step|expertise-pair)[ "_]'` → 0 (the draft's whole-family grep, now over both languages).
  - check:copy is unchanged.
- **Dependencies:** DS-12a.
- **Risks addressed:** R10, R6.
- **Bundle budget:** 0.
- **Diff-size estimate: 190 lines.**
  - CSS: 25 lines (404 8, karriere 7, homepage 10) → 58. Keys 6.
  - Markup: (22 German + 22 English) lines × 2 = 88.
  - render.mjs: 4 lines → 16, plus 8 for parts.
  - Tools 2, docs 12.
  - Basis: as DS-12a. Together the halves are 475 lines, the unsplit 474 plus 1 of rounding.

### DS-13: Leaf: header and footer chrome, base, fonts, logo, icons

- **Scope:**
  - The site header layout, site nav links, skip link, and the footer (its 12 link utility strings become one part). Both partials are shared, so there are no English twins to edit.
  - The logo CSS: the literal `"Roboto", system-ui, sans-serif` stack and 17.43px at 11-components.css:61 become font and size tokens with the same values, so the computed font-family string doesn't change.
  - The `@layer base` element defaults in main.css, the reduced-motion `0.01ms` literals, styles/00-fonts.css and the icon sizes.
  - `min-h-11` → `min-h-target` on 17 sites: the 4 nav links and the header CTA (partials/header.html:6-9, :12) and the 12 footer links. The other 7 of the 24 sites go to DS-14 (the menu summary, the 2 expander summaries, the 2 language-switch sites), DS-15 (the form submit) and DS-16 (the chip).
- **Acceptance:**
  - 0 lint findings in the chrome and base rule blocks.
  - `grep -oE 'min-h-11' partials/footer.html | wc -l` → 0, and partials/header.html → 1 (the menu summary).
  - The logo text still computes to Roboto at 17.43px, on / and /en/.
- **Dependencies:** DS-12b.
- **Risks addressed:** R2 (`min-h-11` rides on the default `--spacing`), R7, the 16 px root.
- **Bundle budget:** 0.
- **Diff-size estimate: 171 lines.**
  - CSS: 28 chrome + 13 base lines → 94, minus the 3 ring lines done in DS-05, which is about 90. Keys 11.
  - Markup: 14 lines × 2 = 28 (the chrome is in the shared partials: 0 English lines).
  - Parts 20, logo 2, docs 20.
  - Basis: Appendix A (chrome 28 lines and 11 keys, base 13 lines; the markup grep, 14 lines in 3 files). The draft's 165 didn't match its own parts, which sum to 171.

### Interactive steps (DS-14 to DS-16): shared contract

- **Kind:** R, except DS-16 when O-4 is option A. **Implementer:** interactive-refactorer. **Reviewers:** the full chain in 3.8.
- **Merge rule:** a replacement merges only on an a11y-perf-reviewer PASS, backed by a keyboard walkthrough (keys → expected → observed, before and after), in both languages.
- **Every interactive step keeps:**
  - Native state as the styling source (R5).
  - data-\* state per Headless UI v2: an attribute present when true and absent when false, never `"false"`.
  - No-JS behaviour: disclosures open natively, the language switch works as links, and the mailto form works.
  - Reduced motion, including the language-switch view transition being off under reduce.
  - No new runtime dependency, and no split or move of the per-file JS strings (3.10, R10).
- **Gates:** G-R, plus DS-02's keyboard contracts, the view-transition check and the no-JS smoke run.

### DS-14: Interactive: Disclosure (expanders, mobile menu, language switch, header scroll state)

- **Scope:**
  - The two inline expanders (render.mjs:152 and :262) and the expander CSS (11-components.css:114-122).
  - The mobile menu (partials/header.html:13-23, styles/07-header.css:75-120, 10-feedback.css:35-38).
  - The language switch: its renderer (in content/ since DS-06), its CSS (11-components.css:174-194), the view transition (:196-201), and its JS (js/01-header.js:58-87). The `lang-switch` selector string in check-i18n.mjs:34.
  - js/01-header.js, and js/00-core.js (the shared helper).
- **Changes:**
  - **One Disclosure renderer** (Root, Button, Panel) serves the expanders, the menu and the language switch (a variant with the header and menu slots), with native `<details>`/`<summary>` as the state.
  - **A small delegated helper in js/00-core.js** mirrors `data-open`, `data-focus` (focus-visible only), `data-hover` (hover-capable pointers) and `data-active`. It lives in 00-core.js, so it costs no new request, and it holds no copy (3.10).
  - **The menu keeps its current behaviour:** Escape with focus return, close on focusout, outside-click and link-click close, the DE/EN aria-label swap (js/01-header.js:31-33, 4 gated strings, unchanged), and no focus trap.
  - **The language switch keeps its current behaviour,** now on the shared helper instead of its own handlers (01-header.js:58-80 duplicate the menu's): Escape inside the open switch closes only the switch, also inside the open menu (the `stopPropagation` at :66); focus returns to its button; focusout and outside click close it; a language-option click sets `switching`, and `pageswap` skips the transition for every other navigation (:78, :84-87); the `pagereveal`/`pageswap` promises are settled (:6-19, #41).
  - **Language-switch CSS** reads semantic roles and `theme()` keys: the raw `0 0 0 2px`/`3px` box-shadow (:182), `1.1em` ×2 (:183), the `1px` border and `z-index: 60` (:185), `font-weight` 400 (:180) and 500 (:188), the 6 %/11 %/6 % colour mixes (:180, :182, :187), and `--space-3`/`--space-4` used as border radii (:185-186), which become radius keys with the same values. The in-panel overrides (:193-194) stay with the panel-link rules they override.
  - **The nav breakpoint** comes from `--breakpoint-nav` via `getPropertyValue`, replacing the `75rem` mirror (js/01-header.js:27, F5-8).
  - **The header scroll state** keeps its class hook and gets a contract.
  - **`min-h-11` → `min-h-target`** on the 3 summaries and the 2 language-switch sites.
  - **If O-6 approves:** the scoped `::-webkit-details-marker` duplicates (07-header.css:93, 11-components.css:118 and :181, R-8) are deleted. The global rule (00-base-remainder.css:33) covers every summary.
- **Acceptance:**
  - Walkthroughs for all three components, on / and /en/, show no regression. DS-02's language-switch contract and view-transition check pass.
  - No-JS: all three open and close natively and look open.
  - The served DOM has 0 `data-open="false"`.
  - A probe that resizes across 1200px closes the menu there.
  - The switch's controls keep a 44 px target (`min-height` 44px on the button and options in both slots, from the `--open` dump).
  - a11y PASS.
  - JS raw and gzip-9 bytes at the end of the step are recorded as the series ceiling for DS-15 and DS-16.
- **Dependencies:** DS-13.
- **Risks addressed:** R5, R4, R6 (the `.open` and `details` selectors in smoke and contrast), R2 (the 75rem mirror), R7 (the switch's `min-h-11`), R3 (the switch's open-state shadow against the ring).
- **Bundle budget:** JS +1,200 B raw / +500 B gzip-9 for the helper, less what the language switch's own handlers save by moving onto it. Removed by DS-15 and DS-16 (3.6).
- **Diff-size estimate: 325 lines.**
  - Expander renderer and CSS 45, header.html 20, 01-header.js 30, menu CSS 45 (19 lint lines, Appendix A), helper 40, docs 45 (two contracts), tools 4.
  - Language switch 96: the renderer as a Disclosure variant 15, CSS 21 (7 lint lines × 2 × 1.15 = 16, keys 5), its handlers onto the helper 31 (23 lines out, about 8 in), its contract 20, keyboard-contract and selector data 8, the third R-8 rule 1.

### DS-15: Interactive: form field

- **Scope:**
  - partials/contact-form.html (its 4 consumers: sections/07b-sales-cta.html:2, pages/kontakt.html:10, sections/en/07b-sales-cta.html:2 and pages/en/kontakt.html:10), becoming a Field-parts renderer. Its labels are `{{t:form.*}}` tokens.
  - js/06-work.js:98-153 and js/02-intent-links.js.
  - The form CSS (11-components.css:34-53, 08-editorial.css:37-61).
- **Changes:**
  - Validation stays native constraint validation plus `aria-invalid`/`aria-describedby`. Styling comes from `[aria-invalid]` and `:user-invalid`, and `data-invalid` is a mirror through the DS-14 helper.
  - The "M3 filled field" comment (11-components.css:35-38) goes.
  - The dead click path (02-intent-links.js:33-37, 0 consumers, F5-6) is deleted with proof, and the stale header comment (:1-3) is corrected.
  - `min-h-11` → `min-h-target` on the submit button.
  - JS comments that duplicate the Field contract move to docs/components.md.
  - Not in scope: F5-3 (the error text inside the label). That would change the accessible-name composition and needs its own owner decision (O-8).
- **Acceptance:**
  - DS-02's form contract passes on /kontakt/ and /en/contact/, and the DE and EN messages (js/06-work.js:104-114) and mailto labels (:139-141) are unchanged (check:copy's 12 js/06-work.js entries identical).
  - No-JS: native validation plus the mailto submit.
  - `grep -rc 'partial:contact-form' pages sections` → 0 (4 today).
  - JS raw bytes are at least 400 B below DS-14's end.
- **Dependencies:** DS-14.
- **Risks addressed:** R5, R10, R6.
- **Bundle budget:** JS −400 B raw or more (offsets DS-14).
- **Diff-size estimate: 169 lines.**
  - Renderer 46 (42, plus 4 for the English consumers), 06-work.js 20, intent-links 10, CSS 53 (23 lint lines × 2 × 1.15) plus comment 8, comment relocation 7, docs 25.

### DS-16: Interactive: toggle group (filter chips)

- **Kind:** A if O-4 = option A (recommended); R if option B.
- **Scope:** `filters()`/`chip()` (render.mjs:116-135), js/06-work.js:9-96 (including the DE/EN count strings at :29, ungated per R10), the chip CSS (11-components.css:19-32, :157-158, 08-editorial.css:29-34), and the selector strings in contrast.mjs:15-16 and smoke.mjs:190-211 (the filter flow, which reads `aria-pressed` at :196 and :205). The chips render on /branchen/ and /en/industries/.
- **Changes:**
  - **Option A:** an APG Radio Group per group (`role="radiogroup"`/`radio`, `aria-checked`, `data-checked`). Arrows move and select; Tab enters at the checked radio.
  - **Option B:** today's `aria-pressed` buttons in `role="group"`, but with the roving tabindex following focus (06-work.js:54, :61). That fixes F5-13.
  - **Both options:**
    - Chip parts with cva variants (selected, disabled) on the token DS-04 renames from `--state-disabled`.
    - `.is-active` is retired in favour of the ARIA source.
    - Filter logic, URL sync and the count stay as they are.
    - The last `min-h-11` becomes `min-h-target`, after which Tailwind's default `--spacing` stops shipping.
    - Comment relocation for the JS budget.
    - The contract table in tools/visual/keyboard-contracts.json is updated as data.
- **Acceptance:**
  - A walkthrough against the base, in both languages.
  - The URL-restore flow passes; axe reports 0.
  - `grep -o -- '--spacing:' css/site.css` → 0. `min-h-11` is the only utility that reads `var(--spacing)` today (`.min-w-0` compiles to `min-width:0`), so this holds once its 24 sites are retired.
  - js/\*.js at or below DS-14's step base (the series result; at least 18,966 raw / 7,098 gzip-9 today, re-measured when DS-14 opens).
  - With option A: an owner try-out on the step preview before merge (WAITING FOR APPROVAL).
- **Dependencies:** DS-15 and O-4.
- **Risks addressed:** R6, R4, R10, R2.
- **Bundle budget:** JS −800 B raw or more, so the series ends at or below DS-14's step base.
- **Diff-size estimate: 153 lines.**
  - Renderer 50 (20 lines, two of them long templates), 06-work.js chip half 40, CSS 18 plus 6 for selectors, tools 4, comment relocation 10, docs 25.

### DS-17: M3 guard, lint blocking and CI (replaces "Material package removal")

- **Kind:** R.
- **Implementer:** tooling-engineer.
- **Reviewers:**
  1. visual-qa (baseline).
  2. a11y-perf-reviewer.
  3. visual-qa.
  4. bundle-analyst: deletions and packages.
  5. qa-reviewer.
- **Scope:** tools/check-content.mjs, eslint.config.mjs, tools/lint/, tools/lint-baseline.json (deleted), assemble.mjs (the `<!-- partial: -->` include, which has 0 consumers after DS-15), package.json (esbuild, R-12, if O-6 approves), .github/workflows/check.yml.
- **Changes:**
  - **M3-signal gate.** It fails on:
    - the 19 old token names, `.display-large` and the other retired names, and `--state-*`;
    - M3, elevation, state layer, 48dp and tone wording in code comments, across styles/, content/, js/, tools/, partials/, pages/, sections/ (recursively, so the English twins too), assemble.mjs, pages.mjs and pages.en.mjs.
    History docs and the Roboto brand exception are excluded by path and term.
  - **Lint becomes zero-tolerance.** The ratchet runner and baseline go, and every rule is an error, including the renderer files' literal `class=` count (must be 0, apart from the allowlisted regex at assemble.mjs:51) and the duplicate-token check.
  - The dead partial include goes.
  - A final bundle check runs against the Phase 2 baseline plus the tech-track deltas (O-7).
- **Acceptance:**
  - A failing sample per gate (exit code other than 0): a reintroduced type-role token, a `display-large` class in an English twin, an "M3" comment, a raw hex, a primitive utility, a literal `class=` in render.mjs.
  - A clean run exits 0 and CI is green.
  - `npm ls esbuild` is empty (if approved).
  - css/site.css + js/\*.js are at or below 74,053 raw / 17,536 gzip-9 (the Phase 2 baseline plus the O-7 deltas as of 9545bc3), plus any tech-track delta that lands later.
- **Gates:** G-R.
- **Dependencies:** DS-16.
- **Risks addressed:** R7, R11, c1 and c7 enforcement.
- **Bundle budget:** 0.
- **Rollback:** revert. The ratchet comes back.
- **Diff-size estimate: 100 lines.**
  - M3 gate 25, lint flip about 10, ratchet runner deletion 45 (counted once), render.mjs rule 5, partial include 6, package.json 3, CI 2, README 4.

### DS-18: Docs

- **Kind:** R. No shipped file changes.
- **Implementer:** docs-writer.
- **Reviewers:**
  1. a11y-perf-reviewer (gates).
  2. visual-qa (dist identity).
  3. qa-reviewer.
- **Scope:** styles/README.md (new), docs/components.md, README.md:66-87 ("Design tokens"), and the summary header of docs/design-system-migration-log.md.
- **Changes:**
  - **styles/README.md**, the tokens README:
    - the layering: primitives, then semantic roles, then component-local keys;
    - the namespaces and what each one emits;
    - `theme()` versus `var()`;
    - the dark scope, and the one-line switch for a page-level fallback once the owner approves a dark design;
    - the naming policy (3.3) and how to add a token;
    - lint rules and exemptions;
    - the brand exceptions (Roboto, Hays Glow) and the JS behaviour constants (section 6, c3);
    - the motion tokens and their readers, including the language-switch crossfade (`--duration-slow`, off under reduced motion).
  - **docs/components.md:** the maintained-components list with a contract for all 13 behaviours: the 12 audited ones (audit §5.1) and the language switch, whose contract (written in DS-14) includes its view transition as a motion enhancement. The ones still missing get added: skip link, Lenis (a vendored enhancement), header scroll state, count-up, intent preselect, legal-table region, and the card invert (a CSS state). Retired entries are marked deprecated, with their replacements.
- **Acceptance:**
  - `ls styles/README.md` succeeds, and every namespace prefix used in the main.css `@theme` blocks appears in it (a grep loop).
  - Every audit §5.1 behaviour and the language switch have a contract heading.
  - The M3 guard passes on the docs, history files excepted.
  - dist/ is byte-identical to the base.
- **Dependencies:** DS-17.
- **Risks addressed:** R8 (canon versus code), c7 (tokens README).
- **Bundle budget:** 0.
- **Diff-size estimate: 272 lines.**
  - README 140, components.md 68 (60, plus 8 for the language switch in the list and the motion note), README.md 44 (the 22-line section at :66-87 × 2), log header 20.

## 5. Phase 4 weights

Phase 4 has 65 % to share out, in proportion to the diff-size estimates. Recomputed on 9545bc3 for 20 steps (DS-09 and DS-12 split, every estimate recounted with the English twins); the coordinator's progress line says so when it next reports (brief §5). The steps total 4,545 lines. Each step's weight is 65 × estimate / 4,545, rounded to 0.1 with largest remainder so the total is exactly 65.0. That's 650 units of 0.1; the floors sum to 639, so the 11 largest remainders get +0.1. Progress starts at 30 % after the Phase 3 approval (P1 5 + P2 15 + P3 10), and the bar prints the rounded cumulative integer.

| Step | Estimate | 65 × e / 4,545 | Weight % | Cumulative % |
|---|---:|---:|---:|---:|
| DS-01 | 293 | 4.190 | 4.2 | 34.2 |
| DS-02 | 244 | 3.490 | 3.5 | 37.7 |
| DS-03 | 47 | 0.672 | 0.7 | 38.4 |
| DS-04 | 298 | 4.262 | 4.3 | 42.7 |
| DS-05 | 173 | 2.474 | 2.5 | 45.2 |
| DS-06 | 200 | 2.860 | 2.9 | 48.1 |
| DS-07 | 247 | 3.532 | 3.5 | 51.6 |
| DS-08 | 414 | 5.921 | 5.9 | 57.5 |
| DS-09a | 269 | 3.847 | 3.8 | 61.3 |
| DS-09b | 286 | 4.090 | 4.1 | 65.4 |
| DS-10 | 269 | 3.847 | 3.8 | 69.2 |
| DS-11 | 140 | 2.002 | 2.0 | 71.2 |
| DS-12a | 285 | 4.076 | 4.1 | 75.3 |
| DS-12b | 190 | 2.717 | 2.7 | 78.0 |
| DS-13 | 171 | 2.446 | 2.4 | 80.4 |
| DS-14 | 325 | 4.648 | 4.7 | 85.1 |
| DS-15 | 169 | 2.417 | 2.4 | 87.5 |
| DS-16 | 153 | 2.188 | 2.2 | 89.7 |
| DS-17 | 100 | 1.430 | 1.4 | 91.1 |
| DS-18 | 272 | 3.890 | 3.9 | 95.0 |
| **Total** | **4,545** | **65.000** | **65.0** | |

In units of 0.1 (650 × e / 4,545), the 11 largest remainders, and so the 11 steps that got +0.1, are DS-01 (.903), DS-09b (.902), DS-18 (.900), DS-02 (.895), DS-16 (.881), DS-12a (.759), DS-05 (.741), DS-03 (.722), DS-04 (.618), DS-06 (.603) and DS-14 (.480). The next are DS-09a and DS-10 (.471 each), so there's no tie at the cut. The script is in Appendix A.

If the plan changes (a split, a merge, O-4, O-6, O-11), the weights are recomputed with the same script and the progress line says so (brief §5).

## 6. End state per criterion

The expected scores after Phase 4 assume the owner takes the recommended options in section 7. The Phase 5 auditor re-scores against the audit's rubric.

| # | Criterion | Now | Expected | What gets it there | If below 5: reason and follow-up |
|---|---|---:|---:|---|---|
| 1 | Zero Material footprint | 3 | **4** | DS-04 renames the 19 tokens. DS-08 and DS-12a rename the classes, in both languages. DS-05, DS-15 and DS-01 remove the comments and tool leftovers. DS-17 adds the gate. 0 packages already. | **Capped at 4 by the Roboto brand exception** (owner decision, CLAUDE.md:153-154). History records in docs/backlog.md and docs/feedback-2026-09-10.md stay on purpose. Follow-up: only if the owner drops Roboto, a Kind A font step (new faces, 200 % text and hyphenation re-measured in both languages). |
| 2 | Single token source in `@theme`, consumed everywhere | 3 | **5** | DS-04 puts every token in one file; DS-05 adds the roles. The families remove the literals. DS-11 generates the `sizes` strings from tokens; DS-14 replaces the 75rem mirror. `min-h-11` → `min-h-target` on all 24 sites through DS-16. | None. |
| 3 | Semantic over primitive, no raw values in components | 2 | **5** | theme() keys for one-off values and semantic roles for colours, in every family and the language switch (DS-14). DS-17's lint blocks raw values and primitives. | Risk: the JS behaviour constants stay literals (js/00-core.js:40-41 Lenis `lerp`/`wheelMultiplier`, js/01-header.js:90 `scrollY > 12`, js/07-countup.js:30 fallback 900, :34 the cubic, :61 the observer threshold). DS-18 documents them as behaviour constants, not design tokens. If the auditor counts them, the score is 4. Follow-up: `@theme static` keys read at runtime (about +150 B JS). |
| 4 | Interactive components on headless primitives (adapted) | 2 | **5** with O-4 = A | Disclosure (expanders, menu, language switch), Field and Radio Group as APG primitives with the data-\* contract (DS-14 to DS-16). Contracts for all 13 behaviours (DS-14, DS-18). | **4 with O-4 = B:** toggle buttons that can't be un-pressed are off-pattern (F5-4). Lenis stays a vendored enhancement, documented, not a widget. |
| 5 | Composable component API | 1 | **5** | Parts, cva, cn, className and attribute passthrough on every renderer (DS-06 to DS-16), the renderers that lived in assemble.mjs moved into content/ (DS-06), and hand-written repeats converted in both languages. | Assumption: stampNav and the partial include are build plumbing. The include is deleted in DS-17; stampNav stays and takes no class. If the auditor keeps the audit's 21-item denominator literally, the score is 4. Follow-up: an attribute API for stampNav (about 10 lines). |
| 6 | Accessibility | 3 | **5** | DS-03 brings the glyphs to AA, fixes 2.4.11 and the clipped rings, and fixes the logo (DE and EN) and "+" names. DS-05 puts the ring on tokens. DS-01 and DS-02 add gates that can fail, on all 72 pages, including the axe-incomplete contrast nodes and the reduced-motion view transition. The keyboard contracts hold or improve. | Risk: DS-02's triage of the axe-incomplete nodes may find pairs below AA over photos or gradients; each becomes a NEEDS-OWNER Kind A item, and c6 stays at 4 until it is fixed. Follow-ups (outside AA): forced-colors mode isn't measured (the halo drops there); F5-3, the form error text inside the label name (O-8); 38 partly covered stops (AAA 2.4.12); the "✓" in the language option names if O-11 is declined. |
| 7 | Hygiene | 2 | **5** with O-6 approved | DS-04 removes the duplicates and DS-07's check keeps them out. DS-17 makes lint blocking. DS-18 writes styles/README.md. The O-6 deletions remove the unused and dead-in-effect CSS. | **4 if O-6 is declined:** the RTL rules (11-components.css:164-167) never run, and the `.container` utility and the overridden declarations stay dead in effect. `.filter-button:disabled` and the global `::-webkit-details-marker` are kept with a written reason (content-dependent, Safari). |

Expected total: **34/35** with the recommended options, and 31/35 if O-4 = B and O-6 is declined.

## 7. Owner items

Every string below is quoted as it stands at 9545bc3. Nothing is drafted beyond these.

**O-1. Logo accessible name, DE and EN** (decision 2026-09-27 (2); WCAG 2.5.3; Lighthouse `label-content-name-mismatch` fails 10 of 10 runs on the German pages, audit §7(g); the English label has the same gap).
- Where: content/i18n.mjs:91 (`'logo.label'`, de) and :205 (`'logo.label'`, en). partials/header.html:4 reads `aria-label="{{t:logo.label}}"` and doesn't change.
- Current:
  - DE: `Emposo — Startseite`. It is byte-identical to the label before the English layer (partials/header.html:4 at 42a7c6d), and it renders on the 36 German pages.
  - EN: `Emposo — Home`, on the 36 English pages.
  - The dash is an em dash with a space on each side in both.
- **Proposed DE: `Emposo The Outcome Factory — Startseite`**
- **Proposed EN: `Emposo The Outcome Factory — Home`**
- Why this wording:
  - The SVG is `aria-hidden="true"` (assets/brand/emposo-logo-neu26.svg:1), so the name comes only from the label.
  - The visible label reads, in order, the "EMPOSO" word mark (drawn as paths) and then the live text "The Outcome Factory" (svg:31, an SVG `<text>`). The tagline is English in both languages.
  - Each proposal starts with that visible text in reading order, then keeps the existing destination word ("— Startseite", "— Home") with the same dash.
  - Both are built only from words already in the copy baseline: "Emposo", "The Outcome Factory" (the visible tagline; in the baseline inside the footer's sr-only `footer.brand` string "Emposo — The Outcome Factory", content/i18n.mjs:100 and :214, because the SVG text is split into tspans), "Startseite" and "Home".
  - The only hard requirement is that "The Outcome Factory" appears contiguously. Today's EN label fails 2.5.3 in the same way as the DE one.
- Effect:
  - 72 page entries in tools/copy-baseline.json change through `copy:accept` in DS-03: 36 per string.
  - The footer logo isn't a link (`<div class="site-footer__brand">`), so nothing else changes.

**O-2. Expander "+" out of the accessible name** (the conditional item in decision (1)).
- The audit shows it's needed: F5-2 measured " +" at the end of all 8 German expander names, and §7 FAIL #8 gives the fix. The English pages have the same 8 expanders.
- Where: styles/11-components.css:119, currently `content: '+';`. Proposed: `content: '+'; content: '+' / '';`. The visible "+" doesn't change. The rule is shared, so all 16 names change at once.
- No words are added. check:copy doesn't read CSS, so a11y-perf-reviewer verifies the change in the AX tree.
- The resulting names (the dash inside them is an en dash, from the sr-only span):

| Where | Toggles | State | Current name | Proposed name |
|---|---|---|---|---|
| content/render.mjs:262 (management) | 6 on /about-us/ | closed | "Mehr lesen – ‹name› +" | "Mehr lesen – ‹name›" |
| | | open | "Weniger anzeigen – ‹name› +" | "Weniger anzeigen – ‹name›" |
| content/render.mjs:152 (jobs) | 2 on /karriere/ | closed | "Zur vollständigen Ausschreibung – ‹job title› +" | "Zur vollständigen Ausschreibung – ‹job title›" |
| | | open | "Weniger anzeigen – ‹job title› +" | "Weniger anzeigen – ‹job title›" |
| content/render.mjs:262 (management) | 6 on /en/about-us/ | closed | "Read more – ‹name› +" | "Read more – ‹name›" |
| | | open | "Show less – ‹name› +" | "Show less – ‹name›" |
| content/render.mjs:152 (jobs) | 2 on /en/careers/ | closed | "See the full job posting – ‹job title› +" | "See the full job posting – ‹job title›" |
| | | open | "Show less – ‹job title› +" | "Show less – ‹job title›" |

**O-3. DS-03 pixel values.** The breadcrumb "/" on the 6 light-hero pages and their English twins, and the expander "+", turn ink (#0A0532) on light grounds. Lemon stays on every navy ground. These are approved at merge from the crops. If the owner would rather keep an orange there, it needs a new AA-safe orange token, which is a brand decision and becomes NEEDS-OWNER.

**O-4. Filter chip pattern (DS-16).**
- Option A (recommended): APG Radio Group. The arrows move and select, which is a behaviour change and makes DS-16 Kind A with an owner try-out. It lets c4 reach 5.
- Option B: keep today's `aria-pressed` toggle buttons with toolbar keys and fix only the roving tabindex. DS-16 is then Kind R, and c4 stays at 4 (R6, F5-4).

**O-5. What `--scheme=dark` means (DS-01).** It emulates `prefers-color-scheme` only, and the navy scopes carry their own `data-theme` (3.5). DS-01 corrects tooling-engineer.md:22 accordingly. Please confirm.

**O-6. Deletions that can't be proven unused by coverage alone** (brief §4: "Ask me before deleting anything that cannot be proven unused"). All are recommended. Together they are the bundle offsets for DS-03 to DS-05.

| ID | What | Bytes | Step | Proof offered |
|---|---|---:|---|---|
| R-5 | The generated Tailwind `.container` utility | 633 | DS-06 | Fully overridden: `.container` computes to 1344px at 12 widths (audit §8.4 I-1). visual:diff 0. |
| R-6 | The dead `.page-hero::before` pair | 291 | DS-10 | `display: none` at 10-feedback.css:173 on every hero route. visual:diff 0. |
| R-7 | Overridden declarations I-3 to I-8 | not measured | DS-08 to DS-13, in their families | Overridden by a later, same-media rule. visual:diff 0. |
| R-8 | The scoped `::-webkit-details-marker` duplicates: 07-header.css:93, 11-components.css:118, and the language switch's at 11-components.css:181 | 171 | DS-14 | The global rule at 00-base-remainder.css:33 covers every summary. The harness has no Safari, so the proof is by logic. (113 B at 42a7c6d; the switch's rule adds 58.) |
| R-10 | The RTL rules (11-components.css:164-167) | 280 | DS-04 | No page sets `dir="rtl"`. If the owner keeps them, DS-04's layer move makes `:root:dir(rtl)` finally work, but c7 may be scored 4. |
| R-12 | The `esbuild` devDependency | 0 shipped | DS-17 | Referenced only in package.json:42. |

R-1, R-2 and R-13 (dist-only files) and the two orphan case-study HTML files are tech-track work, outside the DS steps.

**O-7. Bundle baseline.** Budgets are measured per step against the step base. The Phase 5 total has to be at or below the Phase 2 baseline (67,911 raw / 16,130 gzip-9) plus the tech-track deltas that landed on main between steps. As of 9545bc3 those are B-53 (+23 B raw, +2 B gzip-9) and the English layer #37 to #43 (+6,119 B raw, +1,404 B gzip-9), so the Phase 5 ceiling is 74,053 raw / 17,536 gzip-9 plus any later tech-track delta. Without this allowance Phase 5 fails by construction. The JS series target moves from the Phase 2 JS baseline (15,670 / 6,125) to DS-14's step base (3.6). Please confirm.

**O-8. Not planned (behaviour or name changes outside the approvals):**
- F5-1: the wheel over the open mobile-menu panel scrolls the page when Lenis is on. The fix is `data-lenis-prevent`.
- F5-3: the form error text is part of the field's accessible name.
- F5-5: the count-up writes intermediate numbers into the text.
- F5-7: js/06-work.js holds two components.
- The "✓" in the language option names, if O-11 is declined.

Each could land as a tech-track change between DS steps, but only once the owner approves it. They are listed so nobody folds them into a Kind R step.

**O-9. Implementation shape (3.2).** BEM component CSS on semantic tokens, with `theme()` for one-off values, rather than utility-first markup. component-refactorer.md already allows it. Please confirm.

**O-10. Records after approval** (coordinator):
- CLAUDE.md:127 and :160 ("Every DS step is Kind R") get a note that DS-03, and DS-16 under option A, are Kind A by the 2026-09-27 decision.
- bundle-analyst.md:18-19 ("≤ the Phase 2 baseline") get the O-7 clause ("plus the tech-track deltas the plan lists"), so the agent rule and O-7 can't disagree.
- The exceptions in 3.3, 3.10 and 3.12 go into the handoffs they affect.

**O-11. The "✓" in the language option's accessible name** (new since 42a7c6d; the same pattern as F5-2).
- Where: styles/11-components.css:189, `.lang-switch__option[aria-current]::after { content: "✓"; … }`. CSS-generated text joins the link's name, so the current option reads "Deutsch ✓" on German pages and "English ✓" on English pages. The current state is already exposed by `aria-current="true"` (assemble.mjs:213).
- Proposed: `content: "✓"; content: "✓" / "";`. The visible check mark doesn't change; the names become "Deutsch" and "English". No words are added.
- Recommended: approve it, and DS-03 carries it (2 lines, the weights move by 0.0). If declined, it stays as it is and is listed under O-8, so the approved copy set stays exactly the logo labels (DE and EN) and the "+".

## 8. Resource estimate

Everything is serial: one step, one worktree and one agent at a time (hand-off rule 3). No fan-outs. Run counts assume no FAIL loop. Each loop adds 1 implementer run plus the reruns it forces, with at most 2 loops per step.

| Step | Agent sequence | Runs |
|---|---|---:|
| DS-01 | visual-qa → tooling-engineer → a11y-perf-reviewer → visual-qa → bundle-analyst → qa-reviewer → docs-writer (log) | 7 |
| DS-02 | visual-qa → tooling-engineer → a11y-perf-reviewer → visual-qa → qa-reviewer → docs-writer (log) | 6 |
| DS-03 | visual-qa → token-architect → a11y-perf-reviewer → visual-qa → bundle-analyst → docs-writer → qa-reviewer → owner → docs-writer (log) | 8 |
| DS-04, DS-05 | visual-qa → token-architect → a11y-perf-reviewer → visual-qa → bundle-analyst → docs-writer → qa-reviewer → docs-writer (log) | 8 each |
| DS-06 | visual-qa → tooling-engineer → a11y-perf-reviewer → visual-qa → bundle-analyst → docs-writer → qa-reviewer → docs-writer (log) | 8 |
| DS-07 | visual-qa → tooling-engineer → a11y-perf-reviewer → visual-qa → bundle-analyst → qa-reviewer → docs-writer (log) | 7 |
| DS-08, DS-09a, DS-09b, DS-10, DS-11, DS-12a, DS-12b, DS-13 | visual-qa → component-refactorer → a11y-perf-reviewer → visual-qa → bundle-analyst → docs-writer → qa-reviewer → docs-writer (log) | 8 each (64) |
| DS-14 to DS-16 | visual-qa → interactive-refactorer → a11y-perf-reviewer (keyboard walkthrough) → visual-qa → bundle-analyst → docs-writer → qa-reviewer → docs-writer (log). DS-16 adds an owner try-out under option A. | 8 each (24) |
| DS-17 | visual-qa → tooling-engineer → a11y-perf-reviewer → visual-qa → bundle-analyst → qa-reviewer → docs-writer (log) | 7 |
| DS-18 | docs-writer → a11y-perf-reviewer → visual-qa → qa-reviewer → docs-writer (log) | 5 |
| **Total** | **20 steps** | **152 agent runs** |

- **Roles used in Phase 4:** 9 (tooling-engineer, token-architect, component-refactorer, interactive-refactorer, docs-writer, a11y-perf-reviewer, visual-qa, bundle-analyst, qa-reviewer). The auditor returns in Phase 5.
- **Owner pauses:** the Phase 3 approval of this plan, the DS-03 crops, and the DS-16 try-out under option A. O-4 has to be decided before DS-16 opens, O-6 before DS-04 (R-10), DS-06 (R-5) and DS-10 (R-6), and O-11 before DS-03 opens.
- **Harness cost:** covering both languages doubles the dump and smoke routes (72 instead of 36). Screenshots stay on the German CORE, its English twins and the three English legal pages, so the per-step capture grows by less than half.
- **Coordinator work per step** (not agent runs): worktree and `npm ci`, the DS-n.md handoff, one `build:dist` with the step and base ports served, rebase and regenerate, `npm run merge`, the Railway check, and docs/PROGRESS.md.

## Appendix A: counting commands

Every count here was run on 9545bc3, in the worktree, read-only. Where a count needed a build (the English fallbacks and the skeleton probe), it ran in a scratch copy: `git archive 9545bc3 | tar -x -C <scratch>`. The per-family CSS counter below writes nothing; it only prints.

```js
// node fam3.mjs  (run from any directory; reads the worktree read-only)
// The main.css line ranges (token blocks :63-249 and :251) hold at 9545bc3:
// main.css changed only at :54, in place.
import { readFileSync } from 'node:fs';
const WT = '/Users/jose/workspace/emposo-new-website/weave-clone-ds';
const files = ['00-base-remainder','00-fonts','07-header','08-editorial','09-page-templates','10-feedback','11-components','main'];
const FAM = [
  ['lang-switch', /lang-switch|view-transition/],
  ['menu', /mobile-menu/], ['chips', /filter-|work-filter|work-count|work-empty|filter-choices|filter-group/],
  ['form', /contact-form|\.contact\b|contact__/], ['expander', /\.expander/],
  ['hero', /page-hero|\.hero\b|\.hero_|hero--|about-hero|page-breadcrumb/],
  ['type+links', /eyebrow|display-large|section-lede|section-heading|section-more|statement|page-section__top|page-section__lede|services-intro|expertise-intro__heading|work__heading|\.explore__title|text-link|header-contact/],
  ['cardsA', /reference-|result-metric|industry-/],
  ['cardsB', /expertise-card|expertise-list|portfolio-mode|fact-grid|company-values|connection-|expertise-pair|discipline-|management-card|job-|company-facts|trust-strip|\.tag\b|about-netzwerk|\.services\b|\.industries\b|\.work\b/],
  ['chrome', /skip-link|site-header|site-logo|site-nav|site-footer|emlogo/],
  ['frames+lists', /result-list|legal-|sitemap-grid|explore|page-section|subpage|\.gutter|\.container|page-cta/], ['base', /^/],
];
const famOf = sel => FAM.find(([, re]) => re.test(sel))[0];
const main = readFileSync(`${WT}/styles/main.css`, 'utf8').split('\n');
const tokVals = new Set(main.slice(62, 251).map(l => (l.match(/^\s*--[a-z0-9-]+\s*:\s*([^;]+);/) || [])[1]).filter(Boolean).map(v => v.trim().replace(/^0\./, '.')));
const LINT = /(?<![\w#.(-])-?(?:\d+\.?\d*|\.\d+)(?:px|rem|em)\b|#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|\b(?:white|black|transparent)\b/g;
const WEIGHT = /font-weight:\s*(\d+)/g, ZL = /(?:z-index|line-height):\s*([\d.]+)\s*(?=[;}])/g, PRIM = /var\(--color-[a-z-]+\)/;
const out = {};
for (const f of files) {
  const src = readFileSync(`${WT}/styles/${f}.css`, 'utf8').replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' '));
  const stack = [];
  src.split('\n').forEach((line, i) => {
    const ln = i + 1, inTok = f === 'main' && ((ln >= 63 && ln <= 249) || ln === 251);
    const opens = [...line.matchAll(/([^{};]*)\{/g)].map(m => m[1].trim());
    for (const o of opens) stack.push(o && !o.startsWith('@') ? o : (stack[stack.length-1] || ''));
    const sel = opens.filter(o => o && !o.startsWith('@')).pop() || stack[stack.length-1] || '';
    if (!inTok && !/^\s*--[a-z0-9-]+\s*:/.test(line) && f !== '00-fonts') {
      const body = line.replace(/theme\([^)]*\)/g,'').replace(/@media[^{]*|@container[^{]*/g,'').replace(/var\(--[a-z0-9-]+\)/g,'');
      const lits = (body.match(LINT) || []).filter(v => !/^-?0(px|rem|em)$/.test(v));
      const w = [...body.matchAll(WEIGHT)].length, zl = [...body.matchAll(ZL)].map(m => m[1]), prim = PRIM.test(line);
      if (lits.length || w || zl.length || prim) {
        const o = (out[famOf(sel)] ??= { lines: 0, lits: 0, keys: new Set(), eq: 0, weights: 0, zl: 0, prim: 0 });
        o.lines++; o.lits += lits.length; o.weights += w; o.zl += zl.length; if (prim) o.prim++;
        if (process.env.SHOW === famOf(sel)) console.log(`${f}:${ln} | ${sel.slice(0, 70)}`);
        for (const v of lits) { const n = v.replace(/^0\./, '.').replace(/^-/, ''); if (tokVals.has(n)) o.eq++; else o.keys.add(n); }
        zl.forEach(v => o.keys.add('z/lh:' + v));
      }
    }
    for (let k = 0; k < (line.match(/\}/g) || []).length; k++) stack.pop();
  });
}
for (const [f, o] of Object.entries(out)) console.log(f, 'lines', o.lines, 'px/rem/em/colour', o.lits, 'newKeys<=', o.keys.size, 'eqToken', o.eq, 'weights', o.weights, 'z/lh', o.zl, 'colourReadLines', o.prim);
```

The `lang-switch` entry is new. Without it, the switch's 7 lines fall into `base` (20 lines, 8 keys at most), which is what the unmodified counter prints on 9545bc3; every other family prints the same numbers as on 42a7c6d. `SHOW=<family>` lists a family's lines; the DS-09 and DS-12 splits below come from it.

Output on 9545bc3 (lint-relevant CSS lines / at most this many new keys / literals equal to an existing token / font weights):

| Family | Lines | New keys at most | Equal to a token | Weights |
|---|---:|---:|---:|---:|
| type+links | 28 | 7 | 3 | 6 |
| frames+lists | 17 | 8 | 5 | 2 |
| hero | 47 | 24 | 5 | 3 |
| cardsA | 12 | 3 | 1 | 4 |
| cardsB | 68 | 16 | 4 | 22 |
| chrome | 28 | 11 | 4 | 3 |
| base | 13 | 3 | 5 | 2 |
| menu | 19 | 6 | 3 | 4 |
| form | 23 | 7 | 2 | 3 |
| chips | 8 | 5 | 0 | 2 |
| expander | 2 | 1 | 0 | 1 |
| lang-switch | 7 | 5 | 1 | 2 |
| **Total** | **272** | **96** | **33** | **54** |

The totals cross-check against the audit: 54 font weights (audit §3.1: 52 at 199f82f, plus the 2 in the language switch), 33 literals equal to a token (audit: 33, with a different token-block parser), and 147 lines that read a colour variable (142 at 42a7c6d plus the switch's 5; audit §4: 180 colour `var()` reads, counted per read, not per line). The switch's lines are 11-components.css:180, :182, :183, :185, :186, :187 and :188.

Family splits (`SHOW=frames+lists` and `SHOW=cardsB`):
- frames+lists 17 = frames 6 (09-page-templates.css:11, :123-125, :172-173) + lists and legal 11 (10-feedback.css:204-208, :227, :238-239, :245-246; 11-components.css:141, :143).
- cardsB 68 = /portfolio/ blocks 27 + /about-us/ blocks 16 (DS-12a: 43) + 404 8 + karriere 7 + homepage 10 (DS-12b: 25).

Markup and renderer lines per family (zsh). `m <name> <regex>` prints the matching lines in the German sources (pages/, sections/ and partials/), in the English twins (pages/en/, sections/en/), the file counts, and the matching render.mjs line numbers:

```sh
cd /Users/jose/workspace/emposo-new-website/weave-clone-ds
m() { printf '%-12s DE %3s in %2s | EN %3s in %2s | render.mjs: %s\n' "$1" \
  "$(cat pages/*.html sections/*.html partials/*.html | grep -cE "$2")" \
  "$(grep -lE "$2" pages/*.html sections/*.html partials/*.html | wc -l | tr -d ' ')" \
  "$(cat pages/en/*.html sections/en/*.html | grep -cE "$2")" \
  "$(grep -lE "$2" pages/en/*.html sections/en/*.html | wc -l | tr -d ' ')" \
  "$(grep -nE "$2" content/render.mjs | cut -d: -f1 | tr '\n' ',')"; }
m type+links 'eyebrow|display-large|section-lede|section-more|page-section__top|page-section__lede|text-link|statement'   # DE 55 in 20 | EN 54 in 19 | 62,113,152,160,167,168,189,190,191,262,265,273
m frames 'page-section|class="gutter"|page-cta|<page-crumb'                                                           # DE 51 in 21 | EN 49 in 19 | 65,168,190,191,265,273
m lists 'result-list|legal-copy|legal-table|sitemap-grid|explore'                                                     # DE 30 in 6  | EN 30 in 6  | 100,152,190,271,273 (271 is the EXPLORE key list)
m hero '<page-hero|class="hero|hero__|page-breadcrumb'                                                                # DE 15 in 6  | EN 15 in 6  | 59,65,189
m cardsA 'reference-|industry-|result-metric'                                                                         # DE 2 in 2   | EN 2 in 2   | 79,105,113,278
m cardsB 'expertise-card|expertise-list|portfolio-mode|fact-grid|company-values|connection-|expertise-pair|discipline-|management-card|job-|company-facts|trust-strip|class="tag|about-netzwerk|services-intro|expertise-intro'   # DE 50 in 6 | EN 50 in 6 | 72,85,94,141,142,152,190,262,263,265,279,282
m chrome 'skip-link|site-header|site-logo|site-nav|site-footer|header-contact|min-h-11'                               # DE 14 in 3  | EN 0 in 0   | 129,152,262
m media '<picture|\{\{image:|<figure'                                                                                 # DE 5 in 4   | EN 5 in 4   | 50,65,79,113,263
```

The German counts are unchanged since 42a7c6d. The German and English lines that match both the frames and the lists greps: 6 each (the frames+lists union is 75 German, 73 English). cardsB markup per file: pages/portfolio.html 25, pages/about-us.html 3 (DS-12a), sections/04-about.html 10, sections/03-models.html 2, sections/02b-expertise.html 4, pages/404.html 6 (DS-12b), the same in each English twin (`grep -cE "<cardsB regex>" pages/*.html sections/*.html pages/en/*.html sections/en/*.html`).

Other counts used in this plan:
- `git log --oneline 42a7c6d..9545bc3` → 6 commits; `git diff --shortstat 42a7c6d 9545bc3` → 124 files, +18,560/−319.
- Pages: `node -e "Promise.all([import('./pages.mjs'),import('./pages.en.mjs')]).then(([a,b])=>console.log(a.default.length, b.pagesEn(a.default).length))"` → 36 36 (`PUBLISHED = ['de', 'en']`, content/i18n.mjs:14). `git ls-files en | wc -l` → 36. `grep -c '<url>' sitemap.xml` → 70 (35 at 42a7c6d).
- `git grep -o -E -- 'display-large(--light)?' -- styles pages sections content partials | wc -l` → 101 occurrences. The same with `-n` gives 77 lines, and with `-c` 41 files (German 47 lines in 22 files, English 30 in 19).
- `git grep -n -E -- '--(text|leading|tracking)-(display|headline|title|body|label)[-a-z]*|--display-(size|leading)|--breakpoint-compact|--state-disabled' -- styles | wc -l` → 87.
- `git grep -n 'label--display' -- styles pages sections content partials | wc -l` → 11.
- `grep -o 'class="' content/render.mjs | wc -l` → 109 (on 22 lines); the same on assemble.mjs → 7 (:51 once, :213 once, :215 five times). Longest render.mjs line: `awk '{ if (length($0)>m) {m=length($0); l=NR} } END {print l, m}' content/render.mjs` → 152 1347.
- Sizes: `wc -c css/site.css js/*.js` → 55,087 and 18,966. zlib: css 10,506 at the default level (the gate's measure) and 10,438 at level 9; JS 7,098 at level 9 (per-file sum). JS comments: 4,280 characters (4,299 bytes) by the regex `/\/\*[\s\S]*?\*\/|(?<![:\\])\/\/[^\n]*/g` summed over js/\*.js; the same script gives 3,469 on 42a7c6d.
- Navy grounds: `/usr/bin/grep -noE 'class="(hero|services|contact|site-footer|page-section[^"]*--(dark|deep))[ "]' sections/*.html pages/*.html partials/*.html content/render.mjs sections/en/*.html pages/en/*.html` → 14 (8 German including render.mjs:168, 6 English), plus `pageHero` at render.mjs:65.
- `min-h-11`: `grep -noE 'min-h-11' pages/*.html sections/*.html partials/*.html content/*.mjs js/*.js pages/en/*.html sections/en/*.html assemble.mjs` → 24 sites (header 6, footer 12, contact form 1, render.mjs 3, assemble.mjs 2). `grep -o 'min-h-11' index.html | wc -l` → 25 per rendered page. `grep -oE '\.[a-z0-9:\\-]+\{[^}]*var\(--spacing\)[^}]*\}' css/site.css` → only `.min-h-11`.
- `sizes`: `grep -noE "'\(max-width: [0-9]+px\)[^']*'" content/render.mjs assemble.mjs` → 8 strings.
- Legal tables: `grep -c '</table>' pages/datenschutzerklaerung.html pages/en/datenschutzerklaerung.html` → 24, 24.
- Frames: `cat pages/*.html sections/*.html | grep -cE '<section[^>]*class="[^"]*page-section'` → 25, and 25 over the English twins; `grep -o 'class="page-section' content/render.mjs | wc -l` → 5.
- Copy baseline: `node -e 'const b=require("./tools/copy-baseline.json");const P=Object.keys(b.pages);console.log(P.length,Object.values(b.pages).flat().length,Object.values(b.js).flat().length,P.filter(p=>b.pages[p].includes("Emposo — Startseite")).length,P.filter(p=>b.pages[p].includes("Emposo — Home")).length)'` → 72 12478 19 36 36.
- `t()` keys: `node -e "import('./content/i18n.mjs').then(m=>console.log(Object.keys(m.STRINGS.de).length,Object.keys(m.STRINGS.en).length))"` → 111 111.
- English fallbacks (scratch copy): `EN=1 node assemble.mjs` → "English fallbacks: 0"; `node tools/check-i18n.mjs --complete` → exit 0. The regenerated index.html and en/index.html are byte-identical to the committed ones.
- Skeleton probe (scratch copy): `data-theme="dark"` added to sections/02-hero.html only → `node tools/check-i18n.mjs` exit 1 ("en/index.html: tag skeleton differs from index.html at tag 123"); restored → exit 0.
- `grep -oE '[^{}]*::-webkit-details-marker\{[^}]*\}' css/site.css | awk '{print length($0)}'` → 58, 55, 58 for the scoped rules and 45 for the global one (R-8 = 171 B).
- Weights (`node weights.mjs`):

```js
// node weights.mjs : largest-remainder weights in units of 0.1, total exactly 65.0
const steps = [['DS-01',293],['DS-02',244],['DS-03',47],['DS-04',298],['DS-05',173],['DS-06',200],['DS-07',247],['DS-08',414],['DS-09a',269],['DS-09b',286],['DS-10',269],['DS-11',140],['DS-12a',285],['DS-12b',190],['DS-13',171],['DS-14',325],['DS-15',169],['DS-16',153],['DS-17',100],['DS-18',272]];
const total = steps.reduce((s, [, e]) => s + e, 0), units = 650;
const raw = steps.map(([id, e]) => ({ id, e, x: units * e / total }));
raw.forEach(r => { r.floor = Math.floor(r.x); r.rem = r.x - r.floor; });
const floors = raw.reduce((s, r) => s + r.floor, 0), extra = units - floors;
[...raw].sort((a, b) => b.rem - a.rem).slice(0, extra).forEach(r => { r.plus = 1; });
let cum = 300;
console.log('total', total, 'floors', floors, 'extra', extra);
for (const r of raw) { const u = r.floor + (r.plus || 0); cum += u; console.log(r.id, r.e, (65 * r.e / total).toFixed(3), (u / 10).toFixed(1), (cum / 10).toFixed(1), r.rem.toFixed(3)); }
```

  Output: total 4545, floors 639, extra 11, then the table in section 5.

## Review log

The 42a7c6d draft was reviewed on 2026-09-29 against 9545bc3. Every finding was re-verified on 9545bc3 before it was applied: **43 findings, 43 accepted, 0 rejected.** Where the reviewer's own file:line was off, the row says so and the plan uses the corrected value.

**Stale facts**

| # | Finding | Accepted/rejected | Reason |
|---|---|---|---|
| S1 | Base 42a7c6d → origin/main 9545bc3 (6 commits) | Accepted | `git log --oneline 42a7c6d..HEAD` lists 6 commits; header, §1 and DS-01 rebased. |
| S2 | 36 routes → 72 published pages; the harness sees 36 | Accepted | pagesEn gives 36 + 36, PUBLISHED = ['de','en']; lib.mjs:12-15 imports pages.mjs only. |
| S3 | Churn: 72 HTML + sitemap (70 URLs); pages.en.mjs re-dates EN pages | Accepted | assemble.mjs:89 and `grep -c '<url>'` confirm; §3.7 also notes that EN twin edits alone re-date nothing. |
| S4 | Generated list lacks en/\*\*/index.html, en/404.html, .i18n/ | Accepted | `git ls-files en` → 36; .gitignore has /.i18n/. |
| S5 | copy:accept rewrites 72 entries; baseline 72 / 12,478 / 19 | Accepted | Reproduced with node over tools/copy-baseline.json. |
| S6 | Logo string now lives in content/i18n.mjs:91 and :205 | Accepted | header.html:4 reads `{{t:logo.label}}`; the DE output is byte-identical to 42a7c6d. |
| S7 | 8 expander names → 16 (8 DE + 8 EN) | Accepted | 6 on en/about-us, 2 on en/careers; the EN strings are in content/i18n.mjs:264-265, :272-273. |
| S8 | CSS 55,087 / 10,506 (gz9 10,438); gate at :92, gzip at :94 | Accepted | wc and zlib reproduce; headroom 10,449 / 3,830. |
| S9 | Totals 74,053 / 17,536; tech-track delta +6,142 / +1,406 | Accepted | Per-file level-9 sums reproduce 16,132 on 42a7c6d and 17,536 now. |
| S10 | JS 18,966 / 7,098; comments 4,280 | Accepted (corrected) | Reproduced; the comment figure counts characters (4,299 bytes), stated in Appendix A. |
| S11 | render.mjs line refs moved (245 → 295 lines) | Accepted | Each old line's text located in the new file; all 23 mappings match. |
| S12 | Longest line 1,347 at :152; assemble.mjs `class="` 1 → 7 | Accepted | awk reproduces 152 1347; 6 of the 7 are emitted by the switch, 1 is the regex at :51. |
| S13 | assemble.mjs refs moved; switch renderer added; header/footer inlined per page | Accepted (corrected) | Fallback :90-96 (the same span as the old :86-92), switch :200-216 with `icon()` at :215 (not :216), inlining :219-223, localizeTokens :152-154. |
| S14 | JS refs moved; view-transition and switch code added | Accepted (corrected) | Form :98-153 (not :98-152), messages :104-114 (not :104-117); the other refs match. |
| S15 | check-copy and check-content refs moved | Accepted (corrected) | check-copy JS strings :50-53, per-file JS compare :74; check-content :25, :33-35, :64-67. |
| S16 | Mobile menu at header.html:13-23 with the nested switch at :20 | Accepted | cat -n confirms; 07-header.css selectors now `.mobile-menu > summary`, line numbers unchanged. |
| S17 | 85 → 87 renamed-token consumer lines | Accepted | The two new lines are 11-components.css:180 and :186. |
| S18 | display-large 60/47/22 → 101/77/41 | Accepted | git grep reproduces; DE 47 lines in 22 files, EN 30 in 19. |
| S19 | label--display 7 → 11 source lines | Accepted | 6 DE (5 markup + CSS) + 5 EN; the DS-12a grep is now scoped to the sources. |
| S20 | 9 navy grounds → 15 source lines; pageHero :65, cta :168 | Accepted | The navy grep over the EN twins gives the 6 extra hits. |
| S21 | m() output needs the EN twins | Accepted | The DE+EN variant is in Appendix A with its output. |
| S22 | Counter: base 13 → 20; totals 265/91/32/52 → 272/96/33/54 | Accepted | The rerun reproduces it; the plan gives the switch its own family, so base stays 13. |
| S23 | min-h-11 sites 22 → 24 (assemble.mjs:213, :215) | Accepted | grep confirms; all 24 now have an owning step (DS-13 17, DS-14 5, DS-15 1, DS-16 1). |
| S24 | sizes strings at new lines | Accepted | render.mjs:47, :79, :111 ×2, :112, :189, :263, assemble.mjs:149; the draft also omitted the picture() default. |
| S25 | Scanner blocklist adds `fixed` and `transition` | Accepted | main.css:54 diff; noted in 3.2. |
| S26 | 12 behaviour contracts → 13 (the language switch) | Accepted | docs/components.md has 0 lines on either; the transition is documented inside the switch's contract. |
| S27 | Contact form has 4 consumers; bilingual messages and menu labels | Accepted | grep confirms 4 consumers; 06-work.js holds 12 gated strings, 01-header.js 4. |
| S28 | README tokens section :66-87; esbuild at package.json:42 | Accepted | Both were already off at 42a7c6d; the DS-18 estimate now uses the real 22-line section. |
| S29 | tools/visual, docs/components.md, agents, CLAUDE.md, styles 08-10 unchanged | Accepted | `git diff --stat 42a7c6d HEAD` on those paths is empty; their refs stand. |

**Issues**

| # | Finding | Accepted/rejected | Reason |
|---|---|---|---|
| I1 | check:i18n skeleton parity fails any DE-only markup change (blocker) | Accepted | Proved on a scratch copy (exit 1); new rule 3.12, twins in every scope, grep and estimate, and check:i18n named in G-R. The fix's cites are :27 and :34-35 (skeleton), :41 (VERBATIM_LEGAL). |
| I2 | No harness tool visits /en/; closed disclosures invisible (blocker) | Accepted (corrected) | DS-01 adds EN routes, the English hyphenation wait, EN rows and an `--open` dump; the no-rects skip is lib.mjs:82, not :76. |
| I3 | The JS target 15,670 / 6,125 is unreachable (blocker) | Accepted | +3,296 B of i18n JS; the series target is re-based to DS-14's step base, and O-7 is restated with the +6,142 / +1,406 delta. |
| I4 | No step owns the language switch (blocker) | Accepted (reassigned) | DS-06 moves its renderer, DS-02 gates it, DS-18 lists it; its CSS goes to DS-14 rather than DS-13, like the menu, expander, form and chip CSS, which also go with their interactive step. |
| I5 | The switch's min-h-11 sits outside the @source scan (major) | Accepted | assemble.mjs isn't an @source (main.css:47-52); DS-06 moves the renderer and asserts byte-identical CSS, and DS-07 counts literals in assemble.mjs. |
| I6 | O-1 lacks the EN string; "Emposo — Home" fails 2.5.3 (major) | Accepted | O-1 now proposes both strings; DS-03 scope is i18n.mjs:91/:205, with 72 copy entries, 72 AX names and Lighthouse on /en/. |
| I7 | O-2 covers 8 of 16 names; the "✓" joins the option name (major) | Accepted | O-2 has 16 rows; the "✓" is new owner item O-11, and falls to O-8 if declined. |
| I8 | DS-08, DS-09, DS-14 estimates off by more than 30 % (major) | Accepted | Recounted with the twins: DS-08 414 (kept whole, see the split trigger), DS-09 523 → split 269 + 286, DS-12 474 → split 285 + 190, DS-14 325. |
| I9 | Weights proportional to stale estimates; DS-13 parts sum to 171 (major) | Accepted | DS-13 corrected to 171; the Appendix A script recomputes 20 weights on 4,545 (floors 639, 11 remainders, sum 65.0). |
| I10 | No gate checks the reduced-motion view transition (major) | Accepted (corrected) | DS-02 adds the two-navigation check. The premise is half-true: snapshot's dump runs under no-preference (:28), but no tool navigates across documents. |
| I11 | Known failures and DS-03 proofs are DE only; the panel ring hits the in-panel options (major) | Accepted | DS-02 re-measures on the EN twins; DS-03 lists the in-panel options' focus change as intended and crops it at 390 in both languages. |
| I12 | The axe-incomplete contrast nodes are unmeasured (major) | Accepted | smoke keeps only violations (smoke.mjs:64); DS-02 triages them and §6 c6 names the risk. |
| I13 | Copy loophole for German fallbacks; per-file JS keys (minor) | Accepted (corrected) | G-R adds `check-i18n --complete` (exit 0 on a scratch assemble; the flag is read at :74, not :66); 3.10 covers 01-header.js and 02-intent-links.js; the legal-table label comes from the page source instead of a new t() key. |
| I14 | R-8 misses 11-components.css:181; CLAUDE.md cite (minor) | Accepted | R-8 is re-measured at 171 B; the Roboto exception is at CLAUDE.md:153-154. |

**Found while rebasing** (not in the review; verified on 9545bc3)

| # | Finding | Result |
|---|---|---|
| F1 | check-i18n.mjs:34-35 hard-codes `management-card__bio`, `result-metric__word`, `page-hero__metric--word` and `details class="lang-switch` | Added to DS-12a, DS-11, DS-10 and DS-14 as family selector strings (3.12). |
| F2 | The contact-form submit's `min-h-11` had no owning step in the 42a7c6d draft | Assigned to DS-15. |
| F3 | DS-08's `--light` grep and DS-12's `label--display` grep were unscoped, so the history docs would keep them from ever exiting 1 | Scoped to styles, pages, sections, content and partials. |
| F4 | The frame counts 31 / 35 were the audit's (they included pages/case-studies.html, removed by B-52) | 30 frames (25 + 5) and 34 wrappers at both 42a7c6d and 9545bc3; DS-09a uses them. |
| F5 | The logo text sits at svg:31, not :39 | Corrected in O-1. |
| F6 | `pageSources` (assemble.mjs:89) lists the German source for English pages, so an EN-only edit re-dates nothing | §3.7 says so; harmless under 3.12; tech-track note. |
| F7 | assemble.mjs:51 is a regex, not markup | Allowlisted in DS-06's and DS-07's literal counts. |
| F8 | bundle-analyst.md:18-19 has no clause for tech-track deltas | Added to O-10. |
| F9 | The crossfade reads `--duration-slow` (11-components.css:200), which DS-04 moves | DS-04 acceptance keeps it in css/site.css and re-runs DS-02's view-transition check. |
| F10 | Could `--spacing:` survive through another utility, which would make DS-16's check unreachable? | No: only `.min-h-11` reads `var(--spacing)` (`.min-w-0` compiles to `min-width:0`); DS-16's criterion stands. |
