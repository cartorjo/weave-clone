# Design-system audit (Phase 2)

- **Date:** 2026-09-27
- **Audited commit:** origin/main `199f82f`. The worktree `weave-clone-ds` sits at `606227e` on branch `ds/p1-team`, which is `199f82f` plus the Phase 1 (DS-00) docs. Those docs are excluded from every count (list below).
- **Brief:** [docs/design-system-brief.md](design-system-brief.md), cited as "brief §n". This document covers brief §4 Phase 2: stack inventory, every Material signal with file:line, every hard-coded value, the token layer and dark-mode mechanism, the interactive component inventory, a score per criterion with one line of evidence, and the top risks.
- **Adaptation and owner decisions of 2026-09-27** (CLAUDE.md:137-156, "Repo adaptation of brief §2 (owner confirmed 2026-09-27)"):
  - There is no component framework (static HTML from assemble.mjs, vanilla JS). Interactive components are hand-built primitives on native elements and WAI-ARIA APG patterns, with Headless UI v2's data-\* contract, listed as maintained components (CLAUDE.md:138-141).
  - Parts, cva variants and cn run at build time in content/render.mjs. cn is tailwind-merge extended with every custom @theme key. Attribute passthrough stands in for ref forwarding (:142-144).
  - No new runtime JS dependency without owner approval (:145).
  - Tailwind is already v4.3 and CSS-first, so there is no upgrade step. Numeric `--spacing-<n>` stays forbidden (:146-147).
  - Roboto stays as the brand face: a documented brand exception, so criterion 1 is scored at most 4 (:149-150).
  - The supplied Hays Glow icons stay; no lucide (:151).
  - `[data-theme="dark"]` scopes today's navy sections. The page-level prefers-color-scheme fallback is built dark-ready but stays off until the owner approves a dark design (:152-154).
  - The tokens README is styles/README.md (:155).
  - Every DS step is Kind R (:156), i.e. visual:diff 0 (CLAUDE.md:123-124).
- **Served site for all runtime checks:** `http://localhost:8180`, which is `serve .` of the worktree, as in CI. dist/ was already built and was not rebuilt. Every tool ran with `BASE=http://localhost:8180`.
- **Evidence directory:** `E=/Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2` (the local docs repo, gitignored; hand-off rule 7, CLAUDE.md:205-206). Relative evidence paths such as `verify-4/…`, `a11y-verify/…`, `bundle-verify/…` or `E/…` are relative to E. Section 7 also uses `A` and `V` for two of its subdirectories; it defines them where it starts.
- **Worktree untouched:** `git -C /Users/jose/workspace/emposo-new-website/weave-clone-ds status --porcelain | wc -l` printed 0 before and after every slice, verifier and judge pass. The only files this phase adds are this document and [its appendix](design-system-audit-appendix.md), so since they were written the same command prints 2 (`?? docs/design-system-audit-appendix.md`, `?? docs/design-system-audit.md`). With those two excluded it prints 0: `git -C /Users/jose/workspace/emposo-new-website/weave-clone-ds status --porcelain -- . ':!docs/design-system-audit.md' ':!docs/design-system-audit-appendix.md' | wc -l`. For the same reason, whole-tree greps in this document pass `--exclude='design-system-audit*.md'`.
- **Full listings:** the brief asks for every Material signal and every hard-coded value with file:line. The complete tables are in [docs/design-system-audit-appendix.md](design-system-audit-appendix.md): A Material signals, B hard-coded values, C token table, D unused CSS. This document keeps the per-file summaries.
- **Status:** Phase 2 stops here for the owner's review (brief §4).

**Delta since the audited commit (checked 2026-09-27 against origin/main `43154c9`).** Six commits landed after `199f82f` while this audit ran. None adds a Material signal, a raw value or a token, so the counts and scores stand. Only file:line references in two files move:
- #31 `3483a5d` DS-00: the Phase 1 docs, excluded above.
- #32 `01e21b2` B-52 removed the /case-studies/ listing page. There are now 36 routes, and /case-studies/ is a 301 to /branchen/. In content/render.mjs the `cta('case-studies')` entry and its `fragment` case are gone (-1 line each) and EXPLORE lost one entry, so render.mjs references after those points are 1-2 lines lower. Also changed: pages.mjs, serve.json, partials/footer.html, sections/06-work.html and the route lists in tools/visual/{lib,smoke,contrast,components}.mjs. pages/case-studies.html is deleted, so its 6 references in this document are historical.
- #14 `9411239`: the smoke 200% gate waits for German hyphenation, and the CI runner is pinned (tools/visual/smoke.mjs, lib.mjs, .github/workflows/check.yml).
- #33 `15b5187`: `npm run merge` merges only after `gh pr checks` reports green (package.json, CLAUDE.md).
- #35 `43154c9`: tools/merge.sh; `npm run merge -- <pr>` waits for reported checks (package.json).
- #34 `6e6a3d5` B-53: `.reference-card h3` gains `overflow-wrap: anywhere` plus a 4-line comment in styles/10-feedback.css. References to 10-feedback.css after that rule are 4 lines lower.
Phase 3 plans on top of the current main, and every step re-resolves lines against its own base SHA.

**Excluded as migration meta (listed once, never counted).** These files mention Material terms by necessity and are not Material footprint:
- whole files: docs/design-system-brief.md, docs/PROGRESS.md, and .claude/agents/{auditor,token-architect,tooling-engineer,component-refactorer,interactive-refactorer,visual-qa,bundle-analyst,docs-writer}.md;
- appended sections, with ranges from `git diff -U0 199f82f..HEAD`: .claude/agents/a11y-perf-reviewer.md:31-42, qa-reviewer.md:24-40, site-coordinator.md:32-39, design-system-engineer.md:32-33, CLAUDE.md:117-210 (the "Design-system migration" section), and the DS template at docs/handoffs/README.md:27-53;
- scanned normally although Phase 1 touched them: design-system-engineer.md:6 and :17, and CLAUDE.md:45, which were edited in place. :6 was a colour change (teal → cyan); :17 and CLAUDE.md:45 only dropped "state layer". None of the three yields a signal row; :17 and :45 yield only adjacent "scrims" rows.

## Contents

- [Scores](#scores)
- [Top risks](#top-risks)
- [1. Stack inventory](#1-stack-inventory)
- [2. Material signals (criterion 1)](#2-material-signals-criterion-1)
- [3. Hard-coded values](#3-hard-coded-values)
- [4. Token layer and dark-mode mechanism](#4-token-layer-and-dark-mode-mechanism)
- [5. Interactive component inventory](#5-interactive-component-inventory)
- [6. Component API](#6-component-api)
- [7. Accessibility and performance baseline](#7-accessibility-and-performance-baseline)
- [8. Bundle and dead-code baseline](#8-bundle-and-dead-code-baseline)
- [Corrections applied in this document](#corrections-applied-in-this-document)

**Mapping to the auditor's items.** .claude/agents/auditor.md:19-26 lists seven inventory items and asks for sections "numbered as above" (:34). They sit here as follows: item 1 stack → §1; 2 Material signals → §2; 3 raw values → §3; 4 token layer and dark mode → §4; 5 interactive components → §5; 6 component API → §6; 7 scores and top risks → [Scores](#scores) and [Top risks](#top-risks), unnumbered and placed first. §7 and §8 here are the a11y-perf-reviewer and bundle-analyst baselines that brief §4 Phase 2 adds. So "item 7" in auditor.md, and in the Phase 5 re-score, means the Scores section, not §7.

## Scores

One line of evidence per criterion: the deciding fact and its main citation. The full, judged evidence with every count and command is under [Score evidence](#score-evidence). Caps are owner ceilings applied after scoring.

| # | Criterion | Score/5 | Cap | Evidence |
|---|---|---|---|---|
| 1 | Zero Material footprint | **3** | Roboto brand exception, max 4 (CLAUDE.md:149-150); not binding at 3 | 0 Material packages and 0 --md-sys/--md-ref/--mat- variables, but the M3 type-scale roles persist as 17 token names in styles/ (106 occurrences, 87 of 164 type-token reads) and as .display-large in 23 files; one rename step removes them, so 3 (the Roboto cap of 4 is not binding). |
| 2 | Single token source of truth in @theme, consumed everywhere | **3** | none | Only 77 of the 122 token names sit in @theme (styles/main.css:63-177; 42 more in the unlayered :root at :179-249, 9 declarations in 09/10/11), and only 3 of those 77 reach markup as utilities. |
| 3 | Semantic-over-primitive usage, no raw values in components | **2** | none | 0 arbitrary values, but 426 raw values remain outside the token definitions (297 design literals in styles; Appendix B), and 104 of 180 colour var() reads go to hue primitives (E/judge-colour-reads.txt). |
| 4 | Interactive components on the headless primitive library (adapted: hand-built APG primitives + Headless UI v2 data-\* contract) | **2** | none | 0 Material components and 11 of 12 behaviours hand-rolled on native elements (Lenis is vendored), but the Headless UI data-\* state contract is absent on all 4 widget families (grep → 0, §5.2) and only 6 of 12 have a contract block in docs/components.md. |
| 5 | Composable component API | **1** | none | 0 cva/cn/parts, and only 1 of 17 render.mjs renderers (pageHero, content/render.mjs:27) takes class input, with 0 of 21 taking attribute passthrough. |
| 6 | Accessibility | **3** | none | AA holds for every rendered text pair except two lemon glyphs (09-page-templates.css:51 2.33:1, 11-components.css:119 2.06:1) and the ring is visible on 1,100 of 1,100 walk stops, but its geometry is raw px and 3 stops are fully hidden on Shift+Tab (WCAG 2.4.11), while reduced motion, no-JS and keyboard are intact. |
| 7 | Hygiene | **2** | none | 8 CSS rules are never hit and :root:dir(rtl) (11-components.css:167) never applies, 5 same-kind duplicate token pairs remain, there is no lint (.github/workflows/check.yml:24-40), and styles/README.md does not exist. |

**Total: 16/35.**

A judge pass checked six challenges to these scores in the repo and accepted each on its evidence; no score changed, and the evidence below carries its corrections (E/judge/rulings.txt; recounts in E/score-7-challenge/recounts.txt, E/judge-typereads.txt, E/judge-colour-reads.txt).

### Score evidence

The judged evidence per criterion, with its counts and commands (commands run in the worktree unless they change directory).

- **c1 Zero Material footprint (3/5).** Roboto kept as brand exception; 0 Material packages (grep -c -iE '@material|@mui|@angular/material|material-web|material-components-web|material-symbols' package.json package-lock.json -> 0/0) and 0 --md-sys/--md-ref/--mat- vars (git grep exit 1), but M3 type-scale roles persist: 17 token names / 106 occurrences in styles (git grep -o -E -- '--(text|leading|tracking)-(display|headline|title|body|label)\[-a-z]\*|--display-(size|leading)' -- styles | wc -l), which is 17 of 46 type names (37%) but 87 of 164 type-token var() reads (53%; perl var() count, E/judge-typereads.txt), and .display-large(--light) 63x in 23 files (git grep -c -E -- 'display-large(--light)?' -- styles pages sections content | wc -l -> 23); plus --state-disabled .38 (styles/main.css:228), #ffb4ab = the M3 error tone-80 value (main.css:98-99), M3 window-size/4px/48dp comments (main.css:67, :74, :180, :229; 11-components.css:35) and the stale state-layer canon (docs/components.md:28-36, :234-238); one rename step removes all of it, so 3 not 2.
- **c2 Single token source of truth in @theme, consumed everywhere (3/5).** main.css holds 120 of 129 declarations, but only 77 of 122 names sit in @theme (styles/main.css:63-177): 42 are in an unlayered :root (:179-249, deliberately so because --spacing-&lt;n> would override numeric utilities, :182-183, so moving them is a naming and utility-emission decision) and 9 declarations sit in 09/10/11 (e.g. 11-components.css:76, :167); 697 var() reads in hand-written CSS, yet only 3 of 77 @theme tokens reach markup as utilities (text-ink, @max-content:, nav:), and values are mirrored outside the source: js/01-header.js:11 75rem, 10-feedback.css:56 56rem, 8 px sizes strings (content/render.mjs, assemble.mjs:145), and min-h-11 on 22 source sites (grep -oE 'min-h-11' pages/\*.html sections/\*.html partials/\*.html content/\*.mjs js/\*.js | wc -l -> 22; tokens.md's 21 misses render.mjs:91) resolves via Tailwind's default --spacing .25rem (node\_modules/tailwindcss/theme.css:325, imported at main.css:41), duplicating --target-min (main.css:230).
- **c3 Semantic-over-primitive usage, no raw values in components (2/5).** 0 Tailwind arbitrary values and 6 raw colours in styles (none a brand hex), but 426 raw values remain outside token definitions (428 in raw-values-work/summary.json:141, minus the 2 keyword rows at content/render.mjs:91 flagged in verify-3/checks.json); the 378 in styles include 81 structural literals (100%/1fr/50%), leaving 297 design literals (13 of them dead in .page-hero::before, 09-page-templates.css:19-29, display:none at 10-feedback.css:169), and 345 across all sources, with 52 font-weights, 9 z-index and 89 rem literals (63 distinct values) as subsets; colour is consumed as primitives: 104 of 180 colour var() reads in styles go to hue primitives (ink 57, lemon 34, bg 8, paper 4, info 1; perl var() count, E/judge-colour-reads.txt), 13 rules set color: var(--color-lemon) directly (grep -nE '(^|\[{; ])color: \*var\\(--color-lemon\\)' styles/\*.css | wc -l -> 13), and the only semantic flip (09-page-templates.css:124-125, 2 tokens) has 0 consumers in a dark scope, so semantic use holds for a minority.
- **c4 Interactive components on the headless primitive library (adapted: hand-built APG primitives + Headless UI v2 data-\* contract) (2/5).** 0 Material components; 11 of the 12 behaviours are hand-rolled on native elements and 1 (Lenis 1.2.3, assets/vendor/lenis.min.js) is a vendored third-party library (§5.2 tally), and the menu plus 8 expanders match APG Disclosure natively, but the data-\* contract is absent on all 4 widget families (menu, expanders, chips, form) (grep -rnE 'data-(open|closed|focus|active|hover|selected|disabled|checked|state|headlessui)' styles content pages sections partials js assemble.mjs pages.mjs | wc -l -> 0); the chips are off-pattern (un-pressable aria-pressed toggles; tabIndex follows selection, js/06-work.js:52, :59); the expander has no shared primitive (inlined at content/render.mjs:114, :216); and 6 of 12 have a contract block in docs/components.md (:171, :180 cards only partly, :204, :212, :227, :279), while the mobile menu, the main disclosure, has only the canon row (:72) and :234-238 lists the removed state-layer primitive as active.
- **c5 Composable component API (1/5).** 0 cva/cn/parts (grep -rnE 'class-variance-authority|tailwind-merge|\\bcva\\(|\\bcn\\(' content assemble.mjs package.json js tools | wc -l -> 0); only 1 of 17 render.mjs renderers (16 top-level functions plus the column arrow function at :62; 1 of 21 with the 4 assemble.mjs helpers of §6.1) takes class input (pageHero modifier/figureClass, content/render.mjs:27), 0 of 21 take attribute passthrough, and the most-repeated markup (31 page-section frames, which docs/components.md:251-257 documents with variant props) has no renderer.
- **c6 Accessibility (3/5).** Contrast gate PASS for 18 components (BASE=http://localhost:8180 npm run contrast -> exit 0, E/score-7/contrast.txt), but 2 of 17 focus rows (mobile menu link, filter chip) were measured with no ring (a11y-verify/contrast-rerun.json) and contrast.mjs:86 fails only a ring that exists, so the PASS says nothing about them; axe 0 violations x74; Lighthouse a11y 100 in 10/10, yet label-content-name-mismatch (weight 0, WCAG 2.5.3) fails in all 10 on the logo (partials/header.html:4, NEEDS-OWNER); reduced motion and keyboard intact, and the navy scopes ('dark') pass; but ring geometry is raw px (styles/00-base-remainder.css:20-25), the menu-link rings are clipped left and right by the panel overflow (07-header.css:102; a11y/menu-clip.log), two lemon glyphs are below AA (09-page-templates.css:51 2.33:1; 11-components.css:119 2.06:1), and 3 focus stops are fully hidden under the 69px sticky header on Shift+Tab (WCAG 2.4.11; E/score-7/obscured-confirm.txt; grep -rn scroll-padding styles | wc -l -> 0).
- **c7 Hygiene (2/5).** 8 rules never hit counting the extra probes (10, 582 B, from coverage.json loads\[] alone: cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/bundle-verify && node reanalyze.mjs), and not all are justified: :root:dir(rtl) at 11-components.css:167 sits in layer(components), loses to the unlayered :root (main.css:239) and never applies even under dir=rtl (E/judge/rtl-judge.mjs: matches true, --scrim-ink-side stays 90deg; the same declaration unlayered gives 270deg); the Tailwind .container utility (12 rules, 633 B, overridden by styles/main.css:383-390) is dead in effect; 5 same-kind exact duplicate token pairs remain (§4.5; §8.5's 11 value groups are these 5 plus 6 cross-kind groups) (e.g. --tracking-caps = --tracking-caps-slight, main.css:137-138; --color-bg = --color-on-dark #ffffff, :83/:95, two roles on one raw value), plus unused --space-28 (main.css:197); lint is absent (0 ESLint/Stylelint deps; no lint step in .github/workflows/check.yml:24-40); and styles/README.md does not exist (ls -> No such file).

### Rubric

One scale for all seven criteria, scored against brief §3 as adapted in CLAUDE.md:137-156 (owner-confirmed 2026-09-27). 5 = fully meets the criterion as adapted, for every instance in scope, and a gate enforces it where the brief asks for enforcement. 4 = met in substance; only isolated residue remains (a few sites, or comments/docs only) and no dedicated step is needed. 3 = the core requirement holds for most instances; what's unmet is residue that a dedicated step can remove (renames, consolidation, a few fixes). 2 = partly in place; some sub-requirements hold, but at least one core sub-requirement is absent or holds only for a minority of instances. 1 = isolated pieces only; the mechanism the criterion names is essentially absent. 0 = nothing in place, or the code works against the criterion. Tie-break between 3 and 2: 3 when the unmet part is residue a single step removes, 2 when a mechanism the criterion depends on doesn't exist yet. Adaptations applied: c1 treats Roboto as a brand exception with a ceiling of 4 (CLAUDE.md:149-150), and the Hays Glow icons stay (:151). c4's target is hand-built primitives on native elements and WAI-ARIA APG patterns with Headless UI v2's data-\* contract, each listed as a maintained component with a contract in docs/components.md (CLAUDE.md:138-141). In c6, 'dark' means the \[data-theme="dark"] scopes over today's navy sections, not a page theme (CLAUDE.md:152-154). Owner caps are ceilings applied after scoring. Counts come from commands re-run in this session where possible, otherwise from the verified Phase 2 sections, which name their commands.

## Top risks

Each risk states what breaks and the evidence for it. They are in the order the scoring pass listed them; per-section risks stay in their sections.

### R1. Cascade-layer placement and @theme namespace traps when tokens are consolidated

**Evidence.** Token blocks ship in three cascade positions: @theme in @layer theme, the 42-name :root unlayered (styles/main.css:179-249), and 11-components.css :root / :root:dir(rtl) in layer(components) (verify-4/layer-walk.txt:1-5). The RTL override at 11-components.css:167 never applies, even under dir=rtl: E/judge/rtl-judge.mjs gives matches true and --scrim-ink-side still 90deg, while the same declaration unlayered gives 270deg. That contradicts bundle R-10 ('keep as deliberate readiness'). Moving names into @theme emits utilities: --space-N redefines space-x/y-N, --container-max collides with max-w-max, --invert-bleed becomes a filter utility, and --duration-\* generates nothing in 4.3.3 (duration-\* reads --transition-duration).

**Impact.** No visual change: a token moved between layers silently changes which declaration wins, and a moved name can change or add shipped utilities. R-10's 'keep' rests on a rule that has no effect. Token steps are serial and come first, so this has the largest blast radius.

### R2. Tokens have consumers that a rename or merge can't see (breakpoints, Tailwind's default --spacing)

**Evidence.** grep -o '\\.container{max-width:\[0-9.]\*rem}' css/site.css | wc -l -> 11 Tailwind .container steps built from the --breakpoint-\* values; the 992/1000 merge once flipped @max-content layouts on 16 routes. 8 img sizes strings hard-code 600/700/900/1000px (content/render.mjs:10, :42, :73, :74, :152, :217; assemble.mjs:145). js/01-header.js:11 hard-codes 75rem. --breakpoint-nav ships only because the js/01-header.js:10 comment is a scanner candidate. styles/main.css:7-11 and :377-382 misdescribe the mechanism. min-h-11, the 44px target on 22 source sites (grep -oE 'min-h-11' pages/\*.html sections/\*.html partials/\*.html content/\*.mjs js/\*.js | wc -l -> 22), compiles to calc(var(--spacing) \* 11) with Tailwind's default --spacing .25rem (node\_modules/tailwindcss/theme.css:325, imported at main.css:41), not --target-min (main.css:230).

**Impact.** No visual change: a rename, a merge or even a comment edit can change layouts, image selection or the menu-close breakpoint without a build error, and a step that defines --spacing or folds it into --target-min moves every 44px target at once; contrast and axe don't measure target size.

### R3. The focus ring survives by cascade accident, and the contrast gate can't fail a missing ring

**Evidence.** 00-base-remainder.css is imported unlayered (styles/main.css:398), while 11-components.css:39 sets outline:none on the form fields inside layer(components). On the 564 navy walk stops only the white box-shadow halo is visible (ink outline 1.00:1). tools/visual/contrast.mjs:86 fails only a ring that exists and is below 3:1, and 2 focus rows (mobile menu link, filter chip) were measured unfocused (a11y-verify/contrast-rerun.json).

**Impact.** A11y: moving the ring into a layer, or tokenising its box-shadow, can remove the visible ring on the form fields or on every navy ground while contrast still passes. Only smoke's outline-exists check (tools/visual/smoke.mjs:129) catches part of this.

### R4. The gates can't see Lenis, reverse-Tab, roving-key, pseudo-element or Safari-only regressions

**Evidence.** Every smoke flow, the Tab walk and contrast emulate reduced motion, so Lenis never runs (tools/visual/smoke.mjs:122, :221; contrast.mjs:64). The Tab walk is forward-only, so today's 2.4.11 failure passes CI (E/score-7/obscured-confirm.txt: 3 elements at 0-56/0-44 under a 0-69 header). Arrow/Home/End roving, focus return after Escape and form submission are not asserted. smoke.mjs:62 keeps only violations, which drops 2,071 axe-incomplete color-contrast nodes. No gate measures CSS-generated text such as the expander '+'. The three ::-webkit-details-marker rules (styles/00-base-remainder.css:33, 07-header.css:93, 11-components.css:118) never match in Chrome, the only browser the harness runs (tools/visual/lib.mjs:8, :21). Lighthouse, which brief §4 Phase 4 runs per step, is not in the repo (grep -c lighthouse package.json package-lock.json -> 0, 0; nothing in node\_modules/.bin): the 10-run baseline in §7(g) used Lighthouse 13.5.0 from an unpinned install ("lighthouse": "^13.5.0") in an ephemeral session scratchpad (E/a11y/lh/run-lh.sh:3).

**Impact.** A11y and deployable after every step: an interactive step can break keyboard or Lenis behaviour and still merge green (e.g. the wheel over the open menu panel, F5-1), and a summary rename or a dropped marker rule brings back Safari's native disclosure triangle with every gate green. The §7(g) Lighthouse baseline can be rerun only after tooling-engineer pins Lighthouse (hand-off rule 8, CLAUDE.md:207-210).

### R5. State styling moved onto JS-set data-\* attributes would break no-JS behaviour, and no gate would notice

**Evidence.** The expander label swap (\[open] hides .expander\_\_open, :not(\[open]) hides .expander\_\_close, styles/11-components.css:121-122), the plus rotations (11-components.css:120; 07-header.css:95) and the error underline (:user-invalid, 11-components.css:47-48) all run on native state without JS. CLAUDE.md:66-67: 'no content depends on JavaScript'. Smoke's no-JS parity (tools/visual/smoke.mjs:70-91) compares only default-state visible text, on the 9 CORE routes (tools/visual/lib.mjs:10) at 1400 px.

**Impact.** A11y, no-JS and deployable: a step that replaces the native \[open]/:user-invalid selectors with data-open/data-invalid leaves a natively opened expander showing 'Mehr lesen' as its visible text and accessible name without JS, and CI stays green.

### R6. Harness and content gates key on selectors and class names that primitive swaps and renames change

**Evidence.** smoke reads details .open (tools/visual/smoke.mjs:168-171, :207), contrast sets .open (contrast.mjs:67) and selects .is-active (:15-16), and smoke selects aria-pressed (smoke.mjs:185, :194). The chips are single-select toggles with toolbar keys (js/06-work.js:44-69), and an APG Radio Group selects on arrow. tools/check-content.mjs:20 holds the retired-name regex, :59-62 detect hand-written page-hero, page-breadcrumb, page-cta and trust-strip by literal class=, and main.css:54 holds the scanner blocklist. visual:components logs "skip &lt;name>: &lt;sel> not found" and continues (tools/visual/components.mjs:54), still printing "captured 21 component shots" (:61) with exit 0, while contrast.mjs:83 fails on a missing selector; the .display-large(--light) rename touches 63 occurrences in 23 files.

**Impact.** Deployable and no visual change: a primitive swap can fail the gates on selectors rather than on behaviour, and a class rename that skips these gates either fails them or leaves them guarding names that no longer exist, so a retired name can return unnoticed. Moving the chips to Radio Group changes the keyboard contract, so it needs an owner decision (Kind A), not a Kind R step.

### R7. The Tailwind scanner has two blind spots that a utility-based refactor can hit without any error

**Evidence.** styles/main.css:54 @source not inline("filter grayscale grid hidden static table transform visible") means those bare utilities are never generated (grep -oE '(^|\[{}])\\.(grid|hidden|static|table|transform|visible|filter|grayscale)\\{' css/site.css | wc -l -> 0). assemble.mjs is not an @source (main.css:47-52 list sections, pages, pages.mjs, partials, content, js), so a class that appears only in its helpers (icon(), brand(), expandComponents) generates no CSS.

**Impact.** No visual change and deployable: the build passes and the utility silently does nothing; only visual:diff can catch it.

### R8. The B-51 leftover is load-bearing, and the canon says the opposite

**Evidence.** The :is() host list at styles/11-components.css:15-17 is the only resting source of position:relative for 13 of its 14 hosts, and the only isolation rule in the codebase (CSSOM deletion test, verify-5-6-probe.json isRule). Its specificity is (0,1,1), and an unwrapped pseudo-class added to it raises the whole list. docs/components.md:28-36 and :234-238 still document the removed overlay, its 3 deleted tokens and a reserved ::before as active, and contrast.mjs:46-48 still composites a ::before overlay.

**Impact.** No visual change: a 'dead code' cleanup or a docs-led refactor would move positioned children (nav underline, text-link arrow, card invert z-index) or re-create removed behaviour.

### R9. \[data-theme="dark"] scopes flip almost nothing until ground and content roles are split

**Evidence.** Only 2 tokens flip today (styles/09-page-templates.css:124-125), and nothing in a dark scope consumes them. 49 on-dark var() reads are hard-coded per component, 13 rules set lemon text directly, 32 --light modifiers are hand-matched, and 10 navy grounds sit outside any scope. --color-ink is both ground (16 reads) and text (29 reads); hue primitives take 104 of 180 colour reads. The breadcrumb reverts through :not(.page-section--dark):not(.page-section--deep) chains (10-feedback.css:228-232), and --accent-ink stays ink inside .page-hero (main.css:248).

**Impact.** No visual change and a11y: renaming the scope classes turns light-page breadcrumbs faint white, and applying --accent-ink naively to the separator puts ink on navy (1.00:1) on every page-hero.

### R10. check:copy is keyed per file, and copy lives inside the renderers

**Evidence.** tools/check-copy.mjs:45-47 gates only single-quoted JS strings that contain a space and an uppercase letter (10 today), compared per file at :69. js/06-work.js holds both the chips and the form, and ' Projekt'/' Projekte' (:27) and the mailto labels (:133-138) are ungated. Certifications, CTA copy, the industry vocabulary and the management bios sit in content/render.mjs:33, :93, :119-124, :161-188.

**Impact.** No copy change and deployable: splitting 06-work.js fails the gate on byte-identical strings, ungated strings can drift unnoticed, and a renderer rewrite touches copy-gated text.

### R11. The CSS budget leaves little headroom for a semantic layer

**Evidence.** tools/check-content.mjs:85 sets the budget at 64 KiB raw / 14 KiB gzip, measured with default gzipSync at :87. Today that is 52,241 B raw and 10,070 B gzip (node -e zlib.gzipSync over css/site.css), about 4.2 KiB of gzip headroom. @theme is not inline or static (styles/main.css:63), so every token that becomes referenced ships, and the migration adds an alias layer plus tokens for up to 297 design literals in styles.

**Impact.** Deployable after every step: a token step can fail npm run check on size, and any growth violates the brief's 'bundle size equal or smaller' (brief §2).

### R12. Criterion-6 fixes collide with Kind R and the copy rule

**Evidence.** The two below-AA glyphs (styles/09-page-templates.css:51, 11-components.css:119) need a colour change. The 2.4.11 fix needs scroll-padding-top, which adds to the \[id] scroll-margin-top (10-feedback.css:249) and shifts anchor jumps. The '+' name fix and the logo label (partials/header.html:4, which also fails Lighthouse label-content-name-mismatch in 10/10 runs) change accessible names. Every DS step is Kind R (CLAUDE.md:156).

**Impact.** A11y versus no visual change / no copy change: criterion 6 can't reach 5 inside Kind R steps. Each fix needs an owner decision (Kind A or NEEDS-OWNER), or the a11y gaps stay open through Phase 5.

## 1. Stack inventory

Worktree `weave-clone-ds` at 606227e (origin/main 199f82f plus Phase 1 docs). Commands for each row are listed under the table (c1-c13).

| Item | Finding | Evidence |
|---|---|---|
| Framework | None. assemble.mjs generates every shipped HTML file from partials/, pages/, sections/ and the pages.mjs manifest. JS is vanilla progressive enhancement. | README.md:3-6; CLAUDE.md:33-43 |
| Runtime JS | 5 project files (js/00-core.js, 01-header.js, 02-intent-links.js, 06-work.js, 07-countup.js), loaded per page from the manifest (e.g. pages.mjs:28). Lenis 1.2.3 is vendored at assets/vendor/lenis.min.js and loaded with `defer` (partials/head.html:16-17). It starts in js/00-core.js:35-60 and is skipped under reduced motion (:38). No bundler: esbuild is declared (package.json:39) but nothing calls it. | c1, c2, c3 |
| Package manager | npm. package-lock.json has lockfileVersion 3 and name "weave-clone" (package-lock.json:2-3). ESM package (package.json:4). Local node v24.16.0 / npm 12.0.2; CI uses node 24 (check.yml:22). | c4 |
| Dependencies | Runtime: serve ^14.2.6 (package.json:32-34). Dev (installed versions): @tailwindcss/cli 4.3.3, tailwindcss 4.3.3, axe-core 4.13.0, puppeteer-core 24.43.1, sharp 0.35.4, concurrently 9.2.4, esbuild 0.28.2 (package.json:35-43). There is no ESLint, Stylelint, class-variance-authority, tailwind-merge, clsx, lucide or Headless UI. | c5, c6 |
| Tailwind | v4.3.3, CSS-first, built with the CLI: `tailwindcss -i ./styles/main.css -o ./css/site.css --minify` (package.json:6). The entry file is styles/main.css. It sets an explicit layer order (:25) and imports theme.css plus utilities.css with `source(none)` (:41-42). Preflight is not imported (:4-7). The @source list is explicit (:47-52), with `@source not inline(...)` at :54. @theme sits at :63-177 and :root at :179-249. There is no tailwind or postcss config file. css/site.css is committed: 52,241 B raw; gzip is 10,023 B with `gzip -9` and 10,070 B by the gate's own measure (zlib gzipSync default, tools/check-content.mjs:87). The budget is 64 KiB raw / 14 KiB gzip (tools/check-content.mjs:84-88). Tailwind generates only 14 utility selectors from the markup; the rest of the styling is component CSS. The root is `html { font-size: 100% }` (styles/main.css:321-323), fixed by the Non-negotiables (CLAUDE.md:74; README.md:82 "calibrated for the user-scalable 16px root"), so every rem token and rem breakpoint scales with the visitor's default font size and px values don't (§4.7). | c7, c8, c9, c17 |
| Breakpoints as `.container` steps | Tailwind writes `.container` into css/site.css with 11 max-width steps: the 8 custom --breakpoint-\* values plus Tailwind's default md/xl/2xl (48, 80, 96rem). The hand-written, unlayered `.container` (styles/main.css:383-390) overrides them with `max-width: var(--container-max)`. The comments in main.css misstate this mechanism: :7-11 says Tailwind's `.container` is "never generated", which contradicts the output and the file's own :22-24 and :378-382. The cap list at :380 ("480/640/768/992/1440/1536") doesn't match the shipped 37.5-96rem steps. :377-378 say "no max-width below 1440" and "max-width:none", while :387 sets var(--container-max). Runtime and byte detail: §4.2 and §8.4 (I-1). | c10 |
| Component layer | No component framework. Build-time renderers live in content/render.mjs (e.g. chip() at :91). assemble.mjs expands the custom tags `<page-hero>` and `<page-crumb>` (CLAUDE.md:38-39) and the `<!-- content:name -->` includes (README.md:56). The CSS canon is styles/11-components.css, imported last (main.css:404), plus the per-area files 07-10 (main.css:399-403). Contracts are in docs/components.md. | CLAUDE.md:42-48 |
| Icons | Hays Glow set: 528 SVGs, all named `*-line.svg`, 72x72. 526 use stroke #E8730E; 2 (robot-question-line, settings-cog-2-line) use fill #E8730E. Both colours are inlined at build as currentColor (assemble.mjs:111-119, :144). The icon files themselves stay out of dist (tools/build-dist.mjs:24). Owner decision: they stay, no lucide (CLAUDE.md:151). No Material Symbols. | c11 |
| Fonts | Roboto v51, self-hosted (styles/00-fonts.css:1-3). assets/fonts holds 11 files: 5 woff2 subsets (300-700), 5 TTF masters and the OFL licence. @font-face is at styles/00-fonts.css:4-8; weights 300 and 700 are preloaded (partials/head.html:13-14); --font-sans is at styles/main.css:176; subsetting is tools/subset-fonts.sh:10. This is the owner's brand exception (CLAUDE.md:149-150). | |
| Gates | `npm run check` = build + check:content + check:meta + check:copy + `git diff --exit-code` (package.json:14). Not run here, because it rebuilds. `npm run smoke` (package.json:24, tools/visual/smoke.mjs) defaults BASE to :8080 (tools/visual/lib.mjs:7). `npm run contrast` (package.json:30) against :8180: exit 0, "PASS: 18 components". tools/visual also provides visual:snapshot/diff/pixdiff, css:shadowed and visual:components (package.json:25-29). No lint and no unit tests. Against the Phase 4 QA contract (390 and 1440 px, light and dark, brief §4 Phase 4; hand-off rule 8, CLAUDE.md:207-210): visual:snapshot defaults to 390/1000/1400 (tools/visual/snapshot.mjs:14; `--widths=` overrides it) and emulates only prefers-reduced-motion (:28, :37), and tools/visual has no colour-scheme option. visual:components shoots fixed widths (1400 and 390, components.mjs:8-19). On a missing selector it logs `skip <name>: <sel> not found` and continues (:54), then still prints "captured 21 component shots" (:61, the length of SHOTS) and exits 0, whereas contrast.mjs:83 fails on a missing selector. Lighthouse is not in the repo: the §7(g) baseline ran Lighthouse 13.5.0 from an unpinned install (`"lighthouse": "^13.5.0"`) in an ephemeral session scratchpad (E/a11y/lh/run-lh.sh:3), so it is reproducible only after tooling-engineer pins Lighthouse (hand-off rule 8). | c12, c14, c15 |
| CI | .github/workflows/check.yml runs on pull_request and on push to main (:3-6), on ubuntu-latest with node 24, npm cache (:22-23), permissions contents: read (:8-9) and a 25-minute timeout (:14). The checkout uses fetch-depth: 0 because lastmod/dateModified come from git history (:17-19). Steps: npm ci (:24), npm run check (:27), `npx serve . -l 8080` (:28-31), smoke (:33-36) and contrast (:37-40), both with CHROME_PATH=/usr/bin/google-chrome. | |
| Deploy | Railway (weave-clone-production.up.railway.app, docs/design-system-brief.md:9). `npm start` = tools/build-dist.mjs, then `serve dist -l ${PORT:-8080}` (package.json:18). dist/ gets only the shipped files (build-dist.mjs:14-25) and an X-Robots-Tag "noindex, nofollow" header unless INDEXABLE=true (:26-34). Headers and the CSP are in serve.json. No Railway config file is in the repo. Railway's build snapshot ships no .git (assemble.mjs:86-88; commit dc56c86, B-49, #27: "Railway's Railpack snapshot has no .git"), so assemble.mjs checks for a repository (`gitAvailable`, :89) and, without one, reuses the committed sitemap.xml `<lastmod>` dates (:90, :92). With git, lastModified() dates a page by the last commit that touches its own source plus `partials`, `content` and `pages.mjs` (pageSources, :85; `git status --porcelain` and `git log -1` at :94-95; an uncommitted change counts as today). That date feeds every sitemap.xml `<lastmod>` (:197) and every JSON-LD dateModified (:65, :74): 36 `<lastmod>` and 59 dateModified values on the 36 indexed routes, all 2026-09-27 today (the last commit touching those paths is 199f82f); 404.html carries none. | c13, c16 |

Commands (run in the worktree unless noted):
- c1 `ls js` → 00-core.js 01-header.js 02-intent-links.js 06-work.js 07-countup.js
- c2 `grep -o 'lenisVersion="[^"]*"' assets/vendor/lenis.min.js` → `lenisVersion="1.2.3"`
- c3 `git grep -n -w esbuild -- ':!package-lock.json'` → package.json:39 and 00-baseline.md:181 only
- c4 `node -v; npm -v` → v24.16.0, 12.0.2
- c5 `npm ls --all --depth=0` → the 8 packages above, exit 0
- c6 `grep -c -iE 'eslint|stylelint|class-variance-authority|tailwind-merge|clsx|lucide|headlessui' package.json` → 0
- c7 `git ls-files | grep -c -E -i '(^|/)(tailwind\.config|postcss\.config|eslint\.config|\.eslintrc|\.stylelintrc|railway|Procfile|nixpacks)'` → 0 (a bare `ls` glob aborts in zsh with "no matches found")
- c8 `wc -c < css/site.css; gzip -9 -c css/site.css | wc -c` → 52241, 10023; the gate's measure: `node -e 'console.log(require("zlib").gzipSync(require("fs").readFileSync("css/site.css")).length)'` → 10070
- c9 a node one-liner that collects the class selectors inside `@layer utilities{…}` of css/site.css → 14: `.@container .sr-only .container .inline-flex .min-h-11 .min-w-0 .flex-wrap .items-center .wrap-anywhere .text-ink .max-nav:hidden .nav:hidden .@max-content:col-auto .@max-content:grid-cols-1`. Confirmed through the browser CSSOM: `BASE=http://localhost:8180 node E/verify-1-2/cssom-utilities.mjs` → "utilities selectors 14"
- c10 `grep -o '\.container{max-width:[0-9.]*rem}' css/site.css | wc -l` → 11 (37.5, 40, 40.625, 43.75, 48, 56.25, 62, 62.5, 75, 80, 96rem); the CSSOM gives the same 11
- c11 `ls assets/icons | wc -l` → 528; `ls assets/icons | grep -c -- '-line\.svg$'` → 528; `grep -L 'stroke="#E8730E"' assets/icons/*.svg` → robot-question-line.svg, settings-cog-2-line.svg (both use fill="#E8730E")
- c12 `BASE=http://localhost:8180 npm run contrast` → "PASS: 18 components × states meet WCAG AA", exit=0 (E/contrast-8180.txt; the rerun in E/verify-1-2/contrast-8180.txt has identical rows)
- c13 README.md:129-131 and build-dist.mjs:29-34 (indexing switch)
- c14 `grep -rn 'scheme' tools/visual | wc -l` → 0; `sed -n '14p;28p;37p' tools/visual/snapshot.mjs` → the `'390,1000,1400'` default and the two `prefers-reduced-motion` emulations; `sed -n '54p;61p' tools/visual/components.mjs` → the `skip … not found` + `continue` line and the `captured ${SHOTS.length}` line; `sed -n '8,19p' tools/visual/components.mjs | grep -oE "\['[a-z-]+', '/" | wc -l` → 21 SHOTS entries; `sed -n '83p' tools/visual/contrast.mjs` → `if (m.missing) { failures.push(…) }`
- c15 `grep -c lighthouse package.json package-lock.json` → 0, 0; `ls node_modules/.bin | grep -ci lighthouse` → 0; `sed -n 3p /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/a11y/lh/run-lh.sh` → `LH=/private/tmp/claude-501/-Users-jose-workspace-emposo-new-website/1a0890b1-5371-4bdf-8bf1-9a887aadbd7b/scratchpad/lh/node_modules/.bin/lighthouse`, whose package.json declares `"lighthouse": "^13.5.0"` and has 13.5.0 installed
- c16 `git log -1 --format='%h %cs' -- partials content pages.mjs` → `199f82f 2026-09-27`; `grep -c '<lastmod>2026-09-27' sitemap.xml` → 36; `for f in $(node -e "import('./pages.mjs').then(m=>console.log(m.default.map(p=>p.out).join(' ')))"); do grep -o '"dateModified":"[0-9-]*"' $f; done | sort | uniq -c` → `59 "dateModified":"2026-09-27"`; `grep -c dateModified 404.html` → 0
- c17 `sed -n '320,323p' styles/main.css` → the comment "Respect browser text-size preferences; layout must not shrink the rem unit." and `html { font-size: 100%; }` on three lines; `BASE=http://localhost:8180 node /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/root-scale-probe.mjs` (output in E/root-scale-probe.txt, §4.7)
- Lighthouse and coverage belong to §7 and §8, so they are not re-run here.

**Stack risks** (one line each):
- A DS step that edits content/render.mjs, a partial or pages.mjs re-dates all 36 indexed routes to its commit day (assemble.mjs:85, :91-95), so sitemap.xml and 36 shipped HTML files change inside a Kind R step with visual:diff 0; a step that touches only styles/ or js/ doesn't.
- The no-git fallback (assemble.mjs:86-92) must survive any assemble.mjs refactor: without it the `git` calls at :94-95 run where Railway's build has no repository, which is the state dc56c86 (B-49) fixed (`git show dc56c86 -- assemble.mjs`).
- The Phase 4 QA contract isn't covered by today's harness: no 1440 default and no scheme option in visual:snapshot, a silent skip in visual:components (:54), and no pinned Lighthouse (hand-off rule 8, CLAUDE.md:207-210).

**Which gzip figure to use.** The sections quote several gzip sizes for the same 52,241 B css/site.css because they used different tools. All of them were re-run for this document, in the worktree:

| Method | Bytes | Command |
|---|---:|---|
| Node zlib, default level: **the gate's own measure** (tools/check-content.mjs:87), canonical for `npm run check` and for step deltas | **10,070** | `node -e 'const z=require("zlib"),b=require("fs").readFileSync("css/site.css");console.log(z.gzipSync(b).length)'` |
| Node zlib, level 9 (§8's size table) | 10,005 | same with `z.gzipSync(b,{level:9})` |
| gzip CLI, default level, with file name in the header (§7) | 10,088 | `gzip -c css/site.css \| wc -c` |
| gzip CLI, `-9`, with file name (§1) | 10,023 | `gzip -9 -c css/site.css \| wc -c` |
| gzip CLI, `-9 -n` (no name) | 10,014 | `gzip -9 -n -c css/site.css \| wc -c` |

`serve` transferred 11,528 B for it in the Lighthouse runs (§7(g)). Key counts with commands for §1 and §2 are at the end of §2.

## 2. Material signals (criterion 1)

### Method
- **Full table:** every signal row with file:line:col, signal, class and note is in [Appendix A](design-system-audit-appendix.md#appendix-a-material-signals) (a copy of E/material-signals.md). Every raw hit, with its disposition, is in E/classified.tsv.
- **Pipeline:** rerun from E with `node scan-material.mjs && node classify.mjs && node gen-report.mjs`. A rerun of a copy in E/verify-1-2/rerun/ gave byte-identical raw-hits.tsv, classified.tsv and material-signals.md.
- **Scan scope:** the tracked files of styles/, content/, pages/, sections/, partials/, js/, assemble.mjs, pages.mjs, tools/, package.json, package-lock.json, docs/, README.md, CLAUDE.md, .claude/agents/, .github/ and serve.json, plus the file names in assets/fonts and assets/icons.
- **Search terms:** case-insensitive: packages, material, md-sys/md-ref/--mat-, M3, elevation, state layer/--state-\*, ripple, shape, dp, sp, tone/tonal, display/headline/title/body/label, compact/medium/expanded/large, Roboto. Adjacent vocabulary was also searched (on-\*, surface, scrim, emphasized).
- **Classification:** hits inside one identifier collapse into one row (e.g. `display-large--light` = display + large). Comments are found with a real state pass per file type. Result: 1,240 raw hits, 1,160 rows, 0 unlabelled.
- **Hand decisions:** the only ones are in E/prose-labels.json. They cover 15 comment/doc lines that name a type role, and 5 specific-term lines that are not Material.
- **Migration meta:** 106 rows fall in the files excluded in the header and are not counted.

**Provenance:** the M3 patterns came from the "M3 review", a Material Design 3 conformance review (docs/backlog.md:10, :94). Its kit lives outside the repo (/Users/jose/workspace/emposo-new-website/m3-review-run/core.md:5).

### Summary

| class | rows |
|---|---|
| package | 0 |
| variable (--md-sys-\*, --md-ref-\*, --mat-\*) | 0 |
| token name | 111 (19 tokens) |
| class name | 71 (69 live, 2 retired names in a gate regex) |
| comment-only | 34 |
| doc | 52 |
| font (brand exception: Roboto in code and font files) | 27 |
| **total** | **295** |

**The 27 font rows in the auditor's six classes.** The auditor's taxonomy has six classes (.claude/agents/auditor.md:21); the seventh row above only flags the owner's brand exception (CLAUDE.md:149-150). Each font row also has one of the six role classes, so Phase 5 can compare either view:
- **token name, 1:** the `--font-sans` value at styles/main.css:176.
- **package, 26:** the self-hosted font package, which brief §3 criterion 1 lists next to the packages (docs/design-system-brief.md:73-74): the @font-face family and src ×10 (styles/00-fonts.css:4-8), the preloads ×2 (partials/head.html:13-14), the literal stack in `.emlogo-text` (styles/11-components.css:61), the subsetting script ×2 (tools/subset-fonts.sh:10) and the 11 file names in assets/fonts/.
- Folded in, the 295 signals are: package 26 (all Roboto; 0 Material packages), variable 0, token name 112, class name 71, comment-only 34, doc 52. Roboto in comments and docs (12 of the 39 Roboto rows) already sits in comment-only and doc.

**By signal:** type role display 107, body 47, headline 33, title 13, label 10, B-37 role list 4; Roboto 39; state layer 18; M3 11; window size 7; dp 3; elevation 1; shape 1; tone 1.

**By file (rows):**
- styles/10-feedback.css 51 (48 token, 3 class); styles/11-components.css 44 (25 token, 10 class, 8 comment, 1 font); styles/main.css 38 (18 token, 19 comment, 1 font); styles/00-fonts.css 12 (10 font, 2 comment); styles/09-page-templates.css 11 token; styles/08-editorial.css 9 token.
- pages/ 39 class rows in 13 files (portfolio.html 12, about-us.html 6); sections/ 10 class rows in 7 files; content/render.mjs 7 class rows.
- tools/check-content.mjs 2 class (retired); tools/visual/contrast.mjs 2 comment; tools/subset-fonts.sh 3 (2 font, 1 comment).
- partials/head.html 3 (2 font, 1 comment); assemble.mjs 1 comment; assets/fonts 11 font (file names).
- docs/components.md 22, docs/backlog.md 20, docs/feedback-2026-09-10.md 5, README.md 3, CLAUDE.md 1, docs/review/benchmark-patterns.md 1.

The per-file table with every class column is in Appendix A.

### Non-comment signals, complete

**Packages: none.**
- `grep -c -iE '@material|@mui|@angular/material|material-web|material-components-web|material-symbols' package.json package-lock.json` → package.json:0, package-lock.json:0
- `npm ls --all --parseable | grep -ciE 'material|mui|roboto|lucide|headlessui'` → 0 (the same holds for the 308 package-lock.json entries, E/verify-1-2/recounts.txt)

**Variables: none.** `git grep -c -i -E -- '--md-sys|--md-ref|--mat-' -- styles css js content partials pages sections assemble.mjs pages.mjs tools` → no output, exit=1. Across all tracked files, only the two meta files .claude/agents/auditor.md and docs/design-system-brief.md contain them.

**Token names:** 111 rows, 19 tokens.
- All type-role tokens are defined in @theme in main.css, except --display-size and --display-leading, which live in :root in 11-components.css.
- They are consumed only through var()/theme() in styles/. No JS reads them (the only getPropertyValue is --duration-countup, js/07-countup.js:27). No markup uses a text-/leading-/tracking- utility built from them: `git grep -n -E '\b(max-)?(text|leading|tracking)-(display|headline|title|body|label)' -- pages sections partials content js pages.mjs assemble.mjs` → exit=1. None is among the 14 generated utilities.
- All ship as custom properties in css/site.css, except --breakpoint-compact (see the reconciliation below). The CSSOM check lists all 17 type-role names plus --state-disabled as shipped; --breakpoint-nav is the only breakpoint that ships as a custom property.
- Share of the type layer (judge recount, comments stripped; E/judge-typereads.txt, E/score-7-challenge/recounts.txt): the 17 M3 role names are 17 of 46 type-token names but carry 87 of 164 type-token var() reads.

| token | definition | references | rows |
|---|---|---|---|
| `--text-body` | styles/main.css:109 | 08-editorial.css:65; 10-feedback.css:20,26,35,74,139,148,155,216,241,258; 11-components.css:24,69,100,140,141 | 17 |
| `--text-body-sm` | styles/main.css:108 | 08-editorial.css:56; 09-page-templates.css:112,152; 10-feedback.css:3,114,156,192,193,194,213; 11-components.css:32,50,117 | 14 |
| `--leading-body` | styles/main.css:155 | 10-feedback.css:3,44,81,116,156,170,241; main.css:331 | 9 |
| `--leading-title` | styles/main.css:149 | 10-feedback.css:80,94,185,191,212,219,234; 11-components.css:171 | 9 |
| `--leading-label` | styles/main.css:150 | 08-editorial.css:13,28,56,65; 11-components.css:50,69 | 7 |
| `--text-headline-sm` | styles/main.css:130 | 10-feedback.css:94,185,202,219,234; 11-components.css:171 | 7 |
| `--text-body-lg` | styles/main.css:110 | 08-editorial.css:38; 10-feedback.css:151,198; 11-components.css:136,138 | 6 |
| `--tracking-display` | styles/main.css:141 | 09-page-templates.css:85,111; 10-feedback.css:136,147; 11-components.css:79 | 6 |
| `--leading-headline` | styles/main.css:147 | 09-page-templates.css:151; 10-feedback.css:67,115; 11-components.css:129 | 5 |
| `--text-headline-md` | styles/main.css:131 | 09-page-templates.css:151; 10-feedback.css:67,115; 11-components.css:129 | 5 |
| `--breakpoint-compact` (M3 window size; comment at :67 calls it "the M3 compact/medium boundary") | styles/main.css:67 | theme() at 08-editorial.css:87; 10-feedback.css:304; 11-components.css:32 | 4 |
| `--text-title-fluid` | styles/main.css:129 | 10-feedback.css:80,191,212 | 4 |
| `--display-size` | styles/11-components.css:76, :90 | 11-components.css:79 | 3 |
| `--leading-display` | styles/main.css:145 | 09-page-templates.css:85,166 | 3 |
| `--text-headline-lg` | styles/main.css:133 | 09-page-templates.css:85,166 | 3 |
| `--text-label` | styles/main.css:107 | 08-editorial.css:33; 11-components.css:134 | 3 |
| `--display-leading` | styles/11-components.css:76 | 11-components.css:79 | 2 |
| `--state-disabled` (M3 state naming; its value .38 is the M3 disabled-content opacity) | styles/main.css:228 | 11-components.css:28 | 2 |
| `--text-headline-light` | styles/main.css:132 | 09-page-templates.css:111 | 2 |

**Class names:** 71 rows. `.display-large` is M3's "Display Large" role name, verbatim.

| class | CSS selectors | markup / renderer / tool | rows |
|---|---|---|---|
| `.display-large` | 10-feedback.css:42,143,276; 11-components.css:79,81,84,85,87,88,91,94 | content/render.mjs:131,152,153,154,219; pages/404.html:3,10; about-us.html:3,10,18,31; barrierefreiheit.html:1; branchen.html:2,4,5; case-studies.html:2,4; cookies.html:1; datenschutzerklaerung.html:1; impressum.html:1; karriere.html:3,18; kontakt.html:7; nutzungsbestimmungen.html:1; portfolio.html:3,7,13,52,66; sitemap.html:1; sections/02-hero.html:5; 02b-expertise.html:3; 03-models.html:4; 04-about.html:3; 05-industries.html:3; 06-work.html:3; 07b-sales-cta.html:2 | 48 |
| `.display-large--light` | 11-components.css:80 | content/render.mjs:131,152; pages/404.html:3; about-us.html:3,18; branchen.html:2; case-studies.html:2; karriere.html:3; kontakt.html:7; portfolio.html:3,13; sections/02-hero.html:5; 04-about.html:3; 07b-sales-cta.html:2 | 15 |
| `.fact-grid__label--display` | 11-components.css:112 | pages/portfolio.html:57,58,59,60,61 | 6 |
| `page-display`, `display-hero` (retired) | none | tools/check-content.mjs:20 (the gate regex that rejects retired class names; they don't ship) | 2 |

A scan of every class token in CSS selectors and class attributes (styles, pages, sections, partials, content, js) finds no other class carrying a type-role, window-size, elevation, shape, tone, ripple or state name besides BEM `__label`/`__title` parts and `.result-list--compact`.

**Font (brand exception), 27 rows:**
- styles/00-fonts.css:4-8 (10 uses: @font-face family and src)
- styles/main.css:176 (--font-sans)
- styles/11-components.css:61: `.emlogo-text` has a literal `"Roboto", system-ui, sans-serif` stack and 17.43px instead of var(--font-sans). It mirrors assets/brand/emposo-logo-neu26.svg:7 (assets/brand is outside the scan scope; assemble.mjs:126 strips that `<style>`).
- partials/head.html:13,14 (preloads)
- tools/subset-fonts.sh:10 (2 uses)
- 11 file names in assets/fonts/: Roboto-OFL.txt, roboto-{300,400,500,600,700}.{ttf,woff2}

**Doc, 52 rows:**
- docs/components.md (22). This is the canon:
  - 28, 29 `--state-hover`, 30 `--state-press`: STALE, these tokens no longer exist
  - 39 `48dp`
  - 57 Display-Heading / `display-large` / `display-hero` / `page-display`
  - 59 `__label--display` / `--display`
  - 62 `--state-disabled`
  - 64 `headline-sm-Rolle`
  - 81 `page-display`, 82 `display-hero`
  - 89 State-Layer (contrast section)
  - 228 "M3 filled field"
  - 234 `### state-layer (primitive)`; 236 `--state-hover`, `--state-press`, `--state-inset`: STALE
  - 246 `display-large`
  - 287 `__label--display`
- docs/backlog.md (20): 10 M3; 14 M3 48dp (2 rows); 19 state-layer (owner decision); 33 display heading; 35 state-layer; 94 M3 + state layer (2 rows); 105 Headline; 106 headline (2 rows); 214 headline; 226 B-37 role list (5 rows); 231 `--text-body-sm`; 348 state layer; 349 M3
- docs/feedback-2026-09-10.md (5): 27, 78, 230 Roboto; 487 Display-Überschrift; 489 `__label--display`
- README.md (3): 77 display heading + `--display-size`; 79 Roboto. Borderline, not counted: README.md:75 names "the type roles (`--text-micro` … `--text-lede-lg`)", a range that includes --text-label and --text-body\*.
- CLAUDE.md (1): 76 Roboto (Non-negotiables)
- docs/review/benchmark-patterns.md (1): 82 Roboto

**Comment-only, 34 rows:**
- assemble.mjs:123
- partials/head.html:9
- styles/00-fonts.css:1 (2 rows)
- styles/11-components.css:5, 11, 35, 73 (2 rows), 74, 109, 170
- styles/main.css:67 (3 rows), 74 (2), 98 (2), 102, 103 (2), 126, 146 (2), 166, 169, 175, 180, 229 (2)
- tools/subset-fonts.sh:2
- tools/visual/contrast.mjs:5, 46

The M3-attributed comments:
- main.css:67 "600px, the M3 compact/medium boundary"
- :74 "1200px, the M3 large boundary"
- :98 "M3 error tone 80", on `--color-error-on-dark: #ffb4ab` at :99 (the only M3 palette hex in the authoring sources)
- :166 "Exactly two elevations"
- :169 "Brand shape scale"
- :180 "4px unit (M3)"
- :229 "not M3 48dp"
- 11-components.css:35-37 "brand adaptation of the M3 filled field without container", with a 56px field box, indicator and supporting text

### State-layer leftovers (B-51), all slices

B-51 (#30) removed the overlay and its tokens. `git show 199f82f -- styles/11-components.css` shows it deleted the `::before` overlay, its hover/press rules and the `--state-*` tokens, and kept the host rule. `git grep -n -e '--state-hover' -e '--state-press' -e '--state-inset' -- styles css` → exit=1, and in css/site.css the three names occur 0 times (`--state-disabled` 2 times). No JS references the overlay: `git grep -n -i -E 'state.?layer|::before' -- js` → no hits. B-51 changed only routes in tools/visual/components.mjs and smoke.mjs (/case-studies/ → /branchen/, per `git show 199f82f -- tools/visual`). This subsection collects what §2, §5, §7 and §8 each found; the other sections point here.

1. **Selector: styles/11-components.css:15-17.** The former host list `:is(.header-contact, .mobile-menu__cta, .filter-button:where(:enabled), .contact-form button, .mobile-menu__panel a, .site-nav > a, .text-link, .expander summary, .mobile-menu summary, .site-logo, .site-footer a, .page-breadcrumb a, .reference-card__copy, a.expertise-card) { isolation: isolate; position: relative; }` is kept on purpose; the comment at :11-14 says "No state-layer overlay (owner feedback 2026-09-27 …)" and "The stacking context stays".
   - 14 members: `sed -n '15,17p' styles/11-components.css | tr ',' '\n' | grep -c '[a-z]'` → 14. It ships as 295 B.
   - Its specificity is (0,1,1), which 8 of its 14 arguments share: .contact-form button, .mobile-menu__panel a, .site-nav > a, .expander summary, .mobile-menu summary, .site-footer a, .page-breadcrumb a and a.expertise-card. `:where(:enabled)` keeps the pseudo-class out of that specificity. An unwrapped pseudo-class added to the list would raise the whole list.
   - It is a live layout rule, not dead code. A CSSOM deletion test (verify-5-6-probe.json `isRule`, 7 route/width combos) shows 13 of the 14 hosts go from relative/isolate to static/auto without it. Only `.site-nav > a` keeps relative (10-feedback.css:20); `.reference-card__copy` and `a.expertise-card` set a position only on hover/focus (:125, :130). 0 isolation rules remain after deletion. See F5-11 (§5.5) and R-9 (§8.7).
2. **Token:** `--state-disabled: .38` (styles/main.css:228), M3 state naming, and .38 is M3's disabled-content opacity. Its one consumer is 11-components.css:28 (`.filter-button:disabled`, never hit today, §8.3), its doc is docs/components.md:62, and the comment at 11-components.css:22 repeats the value as "38 % opacity".
3. **Contrast tool:** tools/visual/contrast.mjs:2-5 still says "pressed … state-layer overlay included". Lines :46-48 composite `getComputedStyle(host,'::before')` into the measured ground; the "press" state is still measured (:71). The branch is dormant: five probes on three different state sets all find zero:
   - `BASE=http://localhost:8180 node E/verify-1-2/before-branch.mjs` replays the tool's own loop (rest/hover/focus/press for 17 hosts, rest only for the static tag) → 0 of 69 measured host-states. None of the 8 ::before selectors in the served CSS gives a host a ::before with content; they are the universal reset, .page-hero::before and .result-list li::before variants (E/verify-1-2/before-branch.txt).
   - The slice's earlier probe `E/state-layer-dormant.mjs`: 0 of 54 states (18 hosts × rest/hover/press, no focus).
   - verify-5-6-probe.json `contrastHostsBefore`: 0 of 18 hosts; `node a11y/before-check.mjs` → "rows 18, rows where the ::before composite applies: 0"; bundle-verify/contrast-overlay-probe.json: 0 of 18 components with a rendered ::before at rest or on hover.
   - The gate passes: exit 0 (E/contrast-8180.txt; reruns identical in verify-1-2/contrast-8180.txt and bundle-verify/contrast.txt).
4. **Stale canon:** docs/components.md:28-36 (Grundregeln "State-Layer (Hover/Press)") still documents the overlay as live, with --state-hover .08 and --state-press .1, and says "::before ist auf diesen Komponenten dafür reserviert" (:35). Line :89 says the contrast check includes the state layer ("State-Layer verrechnet"). Lines :234-238 keep the "### state-layer (primitive)" contract with "Status: active" and the tokens --state-hover / --state-press / --state-inset. The three names now occur only in this doc (3 mentions at :29, :30, :236; 0 definitions in styles/, css/site.css and content/render.mjs). B-51 removed "(state layer)" only from the per-contract "States" lines (:173, :182, :213, :260; `git show 199f82f -- docs/components.md`).
5. **Stale measurements:** the contrast table at docs/components.md:86-112 ("gemessen 2026-09-26", before B-51) no longer reproduces. 12 of its 18 min-text values differ from today's run, and all 12 are higher now: nav link 13.91 → 17.25, filter chip selected 6.86 → 8.35, footer link 7.5 → 8.35. That fits the removed press overlay (E/verify-1-2/contrast-table-vs-run.txt).
6. **History, keep as records:** docs/backlog.md:19 (owner decision), :35 (points to the Grundregeln block), :94, :348-349.
7. **Context, not a leftover:** styles/main.css:252-254 `html { -webkit-tap-highlight-color: transparent; }` was added in the same commit (199f82f, `git log -S'tap-highlight-color'`). It is a B-51 companion, listed so it isn't reported as a leftover.

Greps behind this list: `grep -rniE "state[- ]?layer|ripple|state-hover|state-press|state-inset" --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git --exclude='design-system-audit*.md' .` prints 21 lines including meta files (bundle-verify/greps-statelayer.txt; non-meta: styles/11-components.css:11, tools/visual/contrast.mjs:5, :46, docs/components.md:28-30, :89, :234, :236, docs/backlog.md:19, :35, :94, :348), and `grep -rniE 'state[- ]?layer|state-hover|state-press|state-inset' docs README.md CLAUDE.md .claude/agents tools styles content js` with the meta files excluded.

### How the standalone counts match the table
- `git grep -o -E -- '--(text|leading|tracking)-(display|headline|title|body|label)[-a-z]*|--display-(size|leading)' -- styles | wc -l` → 106. That is 105 type-role token rows plus 1 mention in the main.css:103 comment. There are 17 distinct names; add --breakpoint-compact and --state-disabled to get the 19 tokens. Cross-check by a node per-line scan including those two: 112 occurrences = 111 token rows + 1 comment (E/verify-1-2/recounts.txt).
- `git grep -o -E -- 'display-large(--light)?' -- styles pages sections content | wc -l` → 63 (15 of them `--light`). That is 48 + 15 rows: 12 in CSS and 51 in 20 markup files plus content/render.mjs. Per file: `git grep -c -E -- 'display-large(--light)?' -- styles pages sections content | wc -l` → 23 files (the 20 markup files, content/render.mjs and the 2 CSS files). Adding 6 `fact-grid__label--display` and 2 retired names gives 71.
- `grep -o -E -- '--breakpoint-compact:' css/site.css | wc -l` → 0, because theme() is inlined at build. `grep -o '37\.5rem' css/site.css | wc -l` → 5: three `@media (max-width:37.5rem)` from the three theme() uses, plus the generated `.container` step, which accounts for one `@media (min-width:37.5rem)` and its `max-width:37.5rem`.
- `grep -o -E -- '\.display-large([^-_a-zA-Z0-9]|$)' css/site.css | wc -l` → 11, so the class ships.

### Adjacent vocabulary (listed, not counted)
None of these are in the brief's criterion-1 list, and the brief's own target names use `bg-surface` (docs/design-system-brief.md:52). They add up to 87 rows:
- `--color-on-dark` 34, `--color-on-dark-muted` 10, `--color-on-dark-faint` 5, `--color-error-on-dark` 4, "on-dark" in prose 10
- `--scrim-ink-side` 4, `--scrim-ink-top` 4, scrim/scrims in prose 4
- `--color-surface-veil` 4, surface/surfaces/surfaced in prose 8

Also adjacent (no search-term hit, so not among the 87 rows):
- **M3 colour-role vocabulary:** styles/main.css:93-94 describes the on-dark trio as "primary, secondary and tertiary emphasis".
- **Material 2 naming:** `--text-caption` (main.css:106, only reference 07-header.css:84) uses the M2 "caption" role. `git grep -n -E -- '--text-(caption|subtitle|overline|button)' -- styles` returns only those two lines.
- **M3 text-field anatomy:**
  - `.contact-form__support` for "supporting text" (11-components.css:50-53, partials/contact-form.html:1)
  - js/06-work.js:98 "Errors appear as German supporting text under each field"
  - the 56px (56dp) field height `.contact-form :is(input, select) { min-height: 3.5rem; }` at 11-components.css:40, named in the comment at :35
- **M3 component name:** "Filter chip" (11-components.css:19, content/render.mjs:91 chip()).

### Excluded and zero-hit terms
**672 hits excluded as not Material.** Every row and its reason is in E/classified.tsv; the reason table is in Appendix A. Top reasons:
- generic prose word: 143
- CSS display property: 91
- HTML label / data field: 71
- aria-label(ledby): 70
- page/document title: 66
- `*-title` ids: 62
- `<body>` / body class: 42
- BEM parts `__label` / `__title`: 28
- data field / schema.org `headline`: 28
- `--duration-medium`: 18 (fast/medium/slow, not M3's short/medium/long 1-4)
- German legal copy "Material": 18 (9 in pages/nutzungsbestimmungen.html, 9 in tools/copy-baseline.json); plus 1 copy-baseline row for "Large" (tools/copy-baseline.json:1256)
- `.result-list--compact`: 8
- `font-display`: 7
- `--leading-compact`: 6
- Hays Glow icon names ripple-line / shape-vector-\*: 3
- SVG path "M3 8.5" at render.mjs:91: 1

**Zero hits:** outside the meta files that list them, each of these returns 0 with `git grep -i -P -o`: sp units, tonal, snackbar, fab, density, emphasized, @material, @mui, @angular/material, material-web, material-components-web, material-symbols, md-sys/md-ref/--mat-.

**Out of scope (tracked, not scanned):** the root reports 00-baseline.md, 01-audit.md, 02-fix-plan.md, 03-results.md and audit-evidence/. `git grep -c -i -E 'material|\bM3\b|state.layer|elevation|ripple|roboto' -- 00-baseline.md 01-audit.md 02-fix-plan.md 03-results.md audit-evidence` → 2, 3 and 2 hits, plus 1 in each of three JSON files. None is Material:
- historical Roboto/Inter notes
- "materially" (01-audit.md:138)
- "owner material" (02-fix-plan.md:68)
- "M3" inside base64 blobs in audit-evidence/final/lh-desktop-{about-us,branchen}.json

### Risks
- `--breakpoint-compact` (37.5rem) reaches 3 media queries through theme() and is also one of the 11 generated `.container` steps. Merging breakpoint values once flipped @max-content layouts on 16 routes (the 992/1000 merge).
- styles/main.css:7-11 and :377-382 misdocument the `.container` mechanism behind that risk: they say "never generated", give stale caps and say "max-width:none", against the 11 shipped steps and the var(--container-max) rule at :387.
- The `:is()` list at 11-components.css:15-17 is a live layout rule, not dead state-layer code: it sets isolation and position:relative on 14 selectors. Its specificity follows its most specific argument, so an unwrapped pseudo-class added to it raises the whole list.
- The canon contradicts the code. docs/components.md:28-36, :89 and :234-238 document the removed overlay, three deleted tokens and a reserved ::before as active. The contrast table at :86-112 records pre-B-51 minima, 12 of which no longer reproduce.
- contrast.mjs:46-48 would composite any future decorative ::before on a measured host as an overlay and skew the ratios it reports.
- `--state-disabled` is M3-derived in both name and value (.38, main.css:228).
- `.display-large` / `--light` appear 51 times across 20 markup files and content/render.mjs, plus 12 times in CSS (63 in total, 23 files). tools/check-content.mjs:20 rejects the retired class names in output.
- main.css:104 records that the --text-\* names deliberately avoid Tailwind's default text-xs/sm/base/lg keys; @theme --text-\* keys emit utilities.
- `.emlogo-text` (11-components.css:61) hardcodes the Roboto stack and 17.43px instead of var(--font-sans).
- `#ffb4ab` (--color-error-on-dark, main.css:99) comes from the M3 error palette, according to its comment at main.css:98.

### Key counts for §1 and §2

Each entry: what was counted, the verified value, and the command that reproduces it (run in the worktree unless the command changes directory).

- **Raw hits / rows / signals (full pipeline):** 1240 raw hits; 1160 rows: 295 signal, 87 adjacent, 672 excluded, 106 migration-meta, 0 unlabelled. A rerun of a copy is byte-identical. Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/verify-1-2/rerun && node scan-material.mjs && node classify.mjs && node gen-report.mjs && for f in raw-hits.tsv classified.tsv material-signals.md; do cmp ../../$f $f && echo "$f identical"; done`
- **Signals by class:** 111 token name, 71 class name, 34 comment-only, 52 doc, 27 font (brand exception); package 0, variable 0. Command: `awk -F'\t' 'NR>1 && $7=="signal"{print $8}' /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/classified.tsv | sort | uniq -c   # cross-check: node E/verify-1-2/recounts.mjs (112 token occurrences = 111 rows + 1 comment; 63+6 class occurrences)`
- **Material packages in manifest and lockfile:** package.json:0, package-lock.json:0 (0 of 308 lockfile entries). Command: `grep -c -iE '@material|@mui|@angular/material|material-web|material-components-web|material-symbols' package.json package-lock.json; node -e 'const l=require("./package-lock.json");console.log(Object.keys(l.packages).filter(k=>/material|@mui|roboto|lucide|headless/i.test(k)).length)'`
- **Material/Roboto/lucide/headless packages installed:** 0 (of 225 output lines, which are 224 install paths plus the project root; §8.2) (corrected, see [Corrections](#corrections-applied-in-this-document)). Command: `npm ls --all --parseable 2>/dev/null | grep -ciE 'material|mui|roboto|lucide|headlessui'`
- **--md-sys / --md-ref / --mat- variables in code:** 0 (exit=1); across all tracked files only the meta files .claude/agents/auditor.md and docs/design-system-brief.md contain them. Command: `git grep -c -i -E -- '--md-sys|--md-ref|--mat-' -- styles css js content partials pages sections assemble.mjs pages.mjs tools; echo exit=$?; git ls-files -z | xargs -0 grep -I -l -i -E -- '--md-sys|--md-ref|--mat-|md-sys-|md-ref-'`
- **Type-role token occurrences in styles/:** 106 (105 token-name rows + 1 comment mention at main.css:103); 17 distinct names; with --breakpoint-compact (4) and --state-disabled (2): 112 occurrences, 19 tokens. Command: `git grep -o -E -- '--(text|leading|tracking)-(display|headline|title|body|label)[-a-z]*|--display-(size|leading)' -- styles | wc -l; node /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/verify-1-2/recounts.mjs`
- **Type-role utilities used in markup:** 0 (exit=1); none among the 14 generated utilities (CSSOM). Command: `git grep -n -E '\b(max-)?(text|leading|tracking)-(display|headline|title|body|label)' -- pages sections partials content js pages.mjs assemble.mjs; echo exit=$?; BASE=http://localhost:8180 node /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/verify-1-2/cssom-utilities.mjs`
- **.display-large / .display-large--light occurrences:** 63 (15 of them --light): 12 in CSS, 51 in 20 markup files + content/render.mjs; 23 files in all (git grep -c … | wc -l -> 23) (corrected, see [Corrections](#corrections-applied-in-this-document)). Command: `git grep -o -E -- 'display-large(--light)?' -- styles pages sections content | wc -l; node /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/verify-1-2/recounts.mjs`
- **Removed state-layer tokens still in code:** 0 (exit=1). Command: `grep -rn -E -e '--state-(hover|press|inset)' styles css js content partials pages sections tools; echo exit=$?`
- **--state-disabled lines:** 2: styles/11-components.css:28, styles/main.css:228. Command: `grep -rn -e '--state-disabled' styles`
- **M3 mentions in code/comment sources:** 7 lines: 6 comments (main.css:67,74,98,180,229; 11-components.css:35) + 1 SVG path false positive (content/render.mjs:91). Command: `git grep -n -i -P '(?<![A-Za-z0-9])(m3|md3|m2)(?![A-Za-z0-9])' -- styles js content tools partials pages sections assemble.mjs pages.mjs`
- **contrast.mjs ::before compositing branch active:** 0 of 69 host-states in the tool's own loop (17 hosts x rest/hover/focus/press + tag rest); 0 of the 8 served ::before selectors give a host a ::before with content (the slice's 0 of 54 used a different state set). Command: `BASE=http://localhost:8180 node /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/verify-1-2/before-branch.mjs`
- **Contrast gate on :8180:** exit=0, PASS: 18 components; rows identical to the slice's run. Command: `BASE=http://localhost:8180 npm run contrast; echo exit=$?`
- **docs/components.md contrast table vs today's run:** 12 of 18 min-text values no longer reproduce (all higher today; table dated 2026-09-26, before B-51). Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && node -e 'const fs=require("fs");const doc=fs.readFileSync("docs/components.md","utf8").split("\n").slice(94,112).map(l=>l.split("|").map(s=>s.trim())).map(c=>[c[1],parseFloat(c[2])]);const run=Object.fromEntries(fs.readFileSync("/Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/verify-1-2/contrast-8180.txt","utf8").split("\n").filter(l=>/ rest /.test(l)).map(l=>[l.slice(0,27).trim(),Math.min(...[...l.matchAll(/(?:rest|hover|focus|press) ([\d.]+)/g)].map(m=>+m[1]))]));const d=doc.filter(([n,v])=>run[n]!==v);console.log("rows",doc.length,"differ",d.length,"higher now",d.filter(([n,v])=>run[n]>v).length)'  # -> rows 18 differ 12 higher now 12 (per-row listing: verify-1-2/contrast-table-vs-run.txt)`
- **--breakpoint-compact in shipped CSS:** 0 custom-property definitions; 5 inlined 37.5rem values: 3 max-width media queries from theme() + 1 generated .container step (its min-width query and max-width value). Command: `grep -o -E -- '--breakpoint-compact:' css/site.css | wc -l; grep -o -E '.{0,40}37\.5rem.{0,40}' css/site.css`
- **Generated .container max-width steps:** 11. Command: `grep -o '\.container{max-width:[0-9.]*rem}' css/site.css | wc -l; BASE=http://localhost:8180 node /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/verify-1-2/cssom-utilities.mjs`
- **Tailwind utilities generated (used in markup):** 14. Command: `BASE=http://localhost:8180 node /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/verify-1-2/cssom-utilities.mjs   # CSSOM walk of @layer utilities`
- **Icons (Hays Glow):** 528, all \*-line.svg; 526 stroke="#E8730E", 2 fill="#E8730E" (robot-question-line, settings-cog-2-line). Command: `git ls-files assets/icons | wc -l; grep -L 'stroke="#E8730E"' assets/icons/*.svg`
- **css/site.css size:** 52241 B raw; 10023 B gzip -9; 10070 B by the gate's gzipSync default (check-content.mjs:87). Command: `wc -c < css/site.css; gzip -9 -c css/site.css | wc -c; node -e 'console.log(require("zlib").gzipSync(require("fs").readFileSync("css/site.css")).length)'`
- **M2 type-role names:** 2 lines: styles/07-header.css:84, styles/main.css:106 (--text-caption). Command: `grep -rn -E -e '--text-(caption|subtitle|overline|button)' styles`
- **Lint / cva / merge / headless deps:** 0. Command: `grep -c -iE 'eslint|stylelint|class-variance-authority|tailwind-merge|clsx|lucide|headlessui' package.json`
- **Config files (tailwind/postcss/eslint/stylelint/railway/Procfile/nixpacks):** 0. Command: `git ls-files | grep -c -E -i '(^|/)(tailwind\.config|postcss\.config|eslint\.config|\.eslintrc|\.stylelintrc|railway|Procfile|nixpacks)'`

## 3. Hard-coded values

Scope: every color, length, time and unitless design literal in `styles/*.css`. Also every Tailwind arbitrary value, arbitrary property and arbitrary variant, plus every literal that encodes a design value (img `sizes` strings, SVG presentation attributes, JS motion and offset numbers), in `pages/`, `sections/`, `partials/`, `content/*.mjs`, `js/`, `assemble.mjs` and `pages.mjs`. That is 42 authoring files. Comments are blanked before scanning. The full listing, grouped by file (file:line | literal | property or context | kind | note), is in [Appendix B](design-system-audit-appendix.md#appendix-b-hard-coded-values) (a copy of E/raw-values.md, 805 lines). An adversarial verification (independent recount, spot-checks, runtime re-check) is in E/verify-3/. The worktree was not modified: outside the two audit files `git -C /Users/jose/workspace/emposo-new-website/weave-clone-ds status --porcelain -- . ':!docs/design-system-audit.md' ':!docs/design-system-audit-appendix.md'` prints nothing (see the header).

Counting rules (the full text is in Appendix B, "Counting rules"):
- Token definitions do not count as raw values. These are styles/main.css:63-177 (`@theme`), :179-249 (`:root`) and :251 (`@media :root`), plus any `--*` declaration in another file, which is listed as a "token definition outside the token file".
- `var()`/`theme()` references are consumption. A `var()` fallback counts as a raw value.
- Excluded: bare `0`, keywords (`currentColor`/`inherit`/`none`/`round`), structural integers (grid lines and spans, `repeat()` counts, `calc()` operands), `scaleX(0|1)`, the RTL flip `scale: -1 1`, font-family names (one hard-coded stack is noted in 3.5), `url()` paths, and the 25 `@font-face` descriptors at styles/00-fonts.css:4-8.
- "structural" marks `100%` fills, `1fr` equal tracks and `50%` centring. These are counted but shown separately.

### 3.1 Summary by file and kind (raw values outside token definitions)

| file | color | length | time | arbitrary | other | total | of which structural |
| --- | --- | --- | --- | --- | --- | --- | --- |
| styles/00-base-remainder.css | 1 | 3 | 2 | 0 | 0 | 6 | 0 |
| styles/07-header.css | 0 | 13 | 0 | 0 | 6 | 19 | 0 |
| styles/08-editorial.css | 1 | 40 | 0 | 0 | 6 | 47 | 12 |
| styles/09-page-templates.css | 0 | 55 | 0 | 0 | 17 | 72 | 9 |
| styles/10-feedback.css | 0 | 125 | 0 | 0 | 37 | 162 | 53 |
| styles/11-components.css | 3 | 39 | 0 | 0 | 18 | 60 | 5 |
| styles/main.css (outside token blocks) | 1 | 5 | 0 | 0 | 6 | 12 | 2 |
| **styles subtotal** | **6** | **280** | **2** | **0** | **90** | **378** | **81** |
| partials/head.html (favicon data URI) | 5 | 1 | 0 | 0 | 0 | 6 | 0 |
| content/render.mjs | 0 | 27 | 0 | 0 | 3 | 30 | 0 |
| assemble.mjs | 2 | 3 | 0 | 0 | 0 | 5 | 0 |
| js/00-core.js | 0 | 0 | 0 | 0 | 2 | 2 | 0 |
| js/01-header.js | 0 | 2 | 0 | 0 | 0 | 2 | 0 |
| js/07-countup.js | 0 | 0 | 1 | 0 | 2 | 3 | 0 |
| **TOTAL** | **13** | **313** | **3** | **0** | **97** | **426** | **81** |

- The render.mjs row and the total differ from raw-values.md (32 and 428). raw-values.md also counts the keywords `stroke-linecap="round"` and `stroke-linejoin="round"` at content/render.mjs:91 as "other", although it labels them "keyword, listed for completeness". Keywords are excluded here, as `none`/`currentColor` already are. The sourced total is 428 (raw-values-work/summary.json:141); 426 = 428 minus those 2 keyword rows (verify-3/checks.json). This document uses **426**.
- Design literals: 378 in styles minus 81 structural = **297**; across all sources 426 minus 81 = **345**.
- **Zero raw values** in the other 29 scanned files: styles/00-fonts.css (descriptors only), all 13 pages/\*.html, all 7 sections/\*.html, partials/contact-form.html, partials/footer.html, partials/header.html, content/share.mjs, content/site-data.mjs, js/02-intent-links.js, js/06-work.js and pages.mjs. One caveat: partials/contact-form.html:1 has `rows="4"` on the textarea. That is a sizing attribute outside this slice's categories, so it is not counted.
- Raw CSS lengths by unit: rem 89, fr 67, px 47, % 45, em 14, vw 8, ch 5, vh 2, dvh 1, SVG user units 2.
- The 89 rem literals have 63 distinct values, and 44 of them are used once. Counted by spelling it is 64 and 45, because `0.5rem` at 07-header.css:105 and `.5rem` at 10-feedback.css:204 are one value.
- "other" in styles is mostly font-weight: 52 raw numerics (700 ×20, 600 ×12, 400 ×10, 300 ×6, 500 ×4). The rest:
  - aspect-ratio ×11
  - z-index ×9 (07-header.css:22 `100`, :29 `50`, :107 `60`; 09-page-templates.css:33, :83; 10-feedback.css:41, :69, :125, :130)
  - unitless line-height ×9 outside the `--leading-*` roles: 07-header.css:94 `1`, 09-page-templates.css:86 `1.25`, :111 `0.96`, :112 `1.42`, :152 `1.38`, :167 `1.43`, 10-feedback.css:235 `1.3`, 11-components.css:119 `1`, and the redundant fallback main.css:331 `var(--leading-body, 1.5)`
  - 45deg ×2, `scale(1.03)` at 10-feedback.css:252, `grayscale(1)` at 10-feedback.css:211, hyphenation limits at main.css:352-354, `stroke-miterlimit: 10` at 11-components.css:64, and `stroke-width='1.5'` in the chevron mask at 08-editorial.css:52
- Raw colors in styles: 6, and none is a brand hex:
  - 00-base-remainder.css:24 `var(--focus-halo, 0 0 #0000)` fallback
  - 08-editorial.css:52 `stroke='black'` inside the select-chevron mask data URI. Only its alpha is used; the rendered colour is `background-color: currentColor` (:46).
  - 11-components.css:30 `color-mix(… 15%, transparent)`, which counts as two literals (the ratio and the keyword)
  - `transparent` at 11-components.css:39 and main.css:254
- 33 raw CSS literals already equal an existing token value. This is value equality only, not proof that the token is the right semantic:
  - `2px` = `--rule-accent` ×8 (00-base-remainder.css:21, :22, :24; 10-feedback.css:21, :36, :231, :232; 11-components.css:47)
  - spacing steps ×11: `0.75rem` = `--space-3` (07-header.css:15, :19); `12px` = `--space-3` (08-editorial.css:54); `0.5rem`/`.5rem` = `--space-2` (07-header.css:105; 10-feedback.css:204 ×2); `8px` = `--space-2` (08-editorial.css:49); `1.5rem` = `--space-6`/`--spacing-cell` (07-header.css:101); `3.5rem` = `--space-14` (11-components.css:40); `2.5rem` = `--space-10` (11-components.css:70); `10rem` = `--space-40` (10-feedback.css:92)
  - `4rem` = `--space-16`/`--icon-lg` (10-feedback.css:76); `3rem` = `--space-12`/`--icon-md` (10-feedback.css:298)
  - `2.75rem` = `--target-min` (09-page-templates.css:49)
  - layout values: `56rem` = `--container-content` (10-feedback.css:56 `@container`, :72 max-width); `40rem` = `--breakpoint-sm` as a min-width at 10-feedback.css:241 (legal table) and as a max-width at 10-feedback.css:282 and 11-components.css:151; `62rem` = `--breakpoint-lg` as a max-width at 10-feedback.css:180
  - type values: `1.35rem` = `--text-expander-plus` (10-feedback.css:204, a `top` offset); `.85rem` = `--text-label` (11-components.css:143, a `top` offset); `.1em` = `--tracking-wide` (11-components.css:59, logo); `1rem` = `--text-body` (main.css:329); `1.5` = `--leading-body` (main.css:331 fallback)

### 3.2 Token definitions (not violations)

- **Token file:** styles/main.css has 120 custom-property declarations in the three token blocks, holding 155 literals (18 color, 119 length, 4 time, 14 other). Every custom-property declaration in main.css sits inside those blocks. All of them are listed in Appendix B §E1.
- **Token definitions outside the token file:** 9 declarations on 6 lines, 11 literals. No inline `style=` custom properties or JS `setProperty` exist in the markup or JS sources.

| file:line | custom property | value | scope |
| --- | --- | --- | --- |
| styles/09-page-templates.css:124 | --line-hairline | var(--color-line-light) | .page-section--dark |
| styles/09-page-templates.css:124 | --accent-ink | var(--color-lemon) | .page-section--dark |
| styles/09-page-templates.css:125 | --line-hairline | var(--color-line-light) | .page-section--deep |
| styles/09-page-templates.css:125 | --accent-ink | var(--color-lemon) | .page-section--deep |
| styles/10-feedback.css:131 | --focus-halo | 0 0 0 var(--invert-bleed) var(--color-ink) | a.expertise-card:focus-visible |
| styles/11-components.css:76 | --display-size | clamp(2.4rem, 5.8vw, 5.5rem) | :root |
| styles/11-components.css:76 | --display-leading | 1.08 | :root |
| styles/11-components.css:90 | --display-size | clamp(2.4rem, 6.5vw, 4rem) | @media (width <= theme(--breakpoint-hero)) > :root |
| styles/11-components.css:167 | --scrim-ink-side | linear-gradient(270deg, var(--color-ink) 0%, transparent 35%) | :root:dir(rtl) |

- 10-feedback.css has no on-dark custom-property override. Its only definition is `--focus-halo` at :131. The on-dark flips live in 09-page-templates.css:124-125.
- The 11-components.css:167 declaration never takes effect, even under `dir="rtl"` (§4.4, §8.3).
- `--fact-min` is read at 09-page-templates.css:104 (`var(--fact-min, 16rem)`) and defined nowhere in styles/, content/, pages/, sections/, partials/, js/, assemble.mjs, pages.mjs or tools/. At runtime on /portfolio/ (BASE=http://localhost:8180, 1440 and 800 px) `--fact-min` is empty and all 5 cells have a 256px min-height, so the fallback is the value that applies.

### 3.3 Tailwind arbitrary values: 0

- The oxide scanner (tailwindcss 4.3.3, the build's engine) found none. Over the slice's file set (sections/, pages/, pages.mjs, partials/, content/, js/ and assemble.mjs) it scanned 34 files and found 2787 candidates. That is a superset of the build's own `@source` list (styles/main.css:47-52, which leaves out assemble.mjs). With only the build's sources it scans 33 files and 2579 candidates. Neither set has a candidate containing `[` or `(`. Compiling the candidates against styles/main.css in memory gives 0 escaped `\[`/`\(` selectors, and the shipped css/site.css has 0 of each.
- Positive control: the same scanner on a probe file returns `pt-[8rem]`, `hover:text-[#dcdcc2]`, `[mask-type:luminance]`, `[&>p]:mt-2` and `bg-(--color-ink)`, 5 of 5.
- The only `[…]` utility strings anywhere in the sources are in comments, at styles/main.css:18 and :318.
- The markup is nearly utility-free. The css/site.css utilities layer holds 14 classes: `@container`, `sr-only`, `container`, `inline-flex`, `min-h-11`, `min-w-0`, `flex-wrap`, `items-center`, `wrap-anywhere`, `text-ink`, `max-nav:hidden`, `nav:hidden`, `@max-content:col-auto`, `@max-content:grid-cols-1`.
- **These are primitive, not arbitrary, and are not in the 426:**
  - `min-h-11`: 22 occurrences (partials/header.html:6-9, :11, :13; partials/footer.html:1 ×12; partials/contact-form.html:1; content/render.mjs:91, :114, :216). It compiles to `calc(var(--spacing) * 11)` = 2.75rem, the value of `--target-min`.
  - `text-ink`: 7 occurrences (pages/404.html:10, :13-17; pages/about-us.html:31).
- Custom variants such as `max-nav:hidden`/`nav:hidden` (partials/header.html:5, :11, :12), `@container` and `@max-content:*` (content/render.mjs:28, :131; pages/404.html:8-9; pages/about-us.html:29-30; pages/kontakt.html:2; pages/portfolio.html:9-49; partials/footer.html:1) are token-based. `@max-content` compiles to `@container not (min-width:56rem)`, which inlines `--container-content`.

### 3.4 Ten worst offenders

Unit of ranking: a CSS rule, cited at its selector's first line, or a single line of markup or JS. Sort: design literals (raw minus structural) descending, then all literals.

| # | where | design | all | literals | note |
| --- | --- | --- | --- | --- | --- |
| 1 | styles/09-page-templates.css:19 `.page-hero::before` | 13 | 14 | 1px, 9rem, 45vw, 46.8rem, -14rem, -7vw, -4rem, -16rem, -9vw, -5rem, 9rem, 45vw, 46.8rem (+50%) | dead: `display: none` at 10-feedback.css:169; runtime `::before` display = `none` on every page-hero route checked (portfolio, about-us, case-studies, branchen, karriere; 1440 and 800 px) |
| 2 | content/render.mjs:73 | 10 | 10 | 700px, 100vw, 1000px, 50vw, 58vw, 700px, 100vw, 1000px, 50vw, 42vw | `sizes` strings mirroring --breakpoint-stack/--breakpoint-tablet in px |
| 3 | styles/08-editorial.css:44 `.contact-form__select::after` | 7 | 7 | 8px, 1px, width='12', height='8', stroke='black', stroke-width='1.5', 12px | chevron mask data URI |
| 4 | styles/07-header.css:96 `.mobile-menu__panel` | 6 | 6 | 1px, 100dvh, 1.5rem, 100%, 0.5rem, z-index 60 | 1.5rem = --space-6, 0.5rem = --space-2 |
| 5 | styles/09-page-templates.css:156 `.portfolio-mode` | 6 | 6 | 1px, 3.78rem, 12.6rem, 0.9fr, 16.2rem, 1.1fr | one-off grid track sizes |
| 6 | partials/head.html:8 | 6 | 6 | rx="6", fill="#0A0532", fill="#F7911E" ×2, fill="white" ×2 | favicon data URI; the fills equal --color-ink/--color-lemon |
| 7 | styles/08-editorial.css:10 `.hero__grid` | 5 | 5 | 1.04fr, 17.1rem, 0.96fr, 47.7rem, 100vh | |
| 8 | content/render.mjs:42 | 5 | 5 | 600px, 100vw, 1000px, 50vw, 33vw | `sizes` mirroring --breakpoint-compact/--breakpoint-tablet in px |
| 9 | styles/00-base-remainder.css:20 `:focus-visible` | 4 | 4 | 2px, 2px, #0000, 2px | the ring; 2px = --rule-accent |
| 10 | styles/07-header.css:12 `.skip-link` | 4 | 4 | 0.75rem, 0.75rem, -180%, z-index 100 | 0.75rem = --space-3 |

- Rows #9 and #10 come from a five-way tie at 4/4. The sort key cannot break it. The other three: styles/08-editorial.css:64 `.site-footer__top` (1.15fr, 0.8fr, 0.68fr, 0.8fr), styles/11-components.css:25 `.filter-button__check` (.8em, .4em, -.05em, .8em) and content/render.mjs:152 (900px, 100vw, 50vw, 8).
- Appendix B §B2 also ranks by single line.

### 3.5 Values outside CSS

- **Breakpoints in px:** 8 img `sizes` strings mirror breakpoints: content/render.mjs:10, :42, :73 (×2), :74, :152, :217 and assemble.mjs:145. They hold 30 length literals. The px values are 600/700/900/1000px, which equal --breakpoint-compact/-stack/-hero/-tablet. The slot widths are 33/42/50/58/65/100vw.
- **js/01-header.js:11** `matchMedia('(min-width: 75rem)')` hand-mirrors --breakpoint-nav, per the comment at :10.
- **JS motion literals with no token:**
  - Lenis `lerp: 0.1` and `wheelMultiplier: 0.9` (js/00-core.js:40-41)
  - scroll offset `scrollY > 12` (js/01-header.js:41)
  - count-up fallback `900`, equal to --duration-countup, which is read at js/07-countup.js:27 (fallback at :29)
  - an ease-out cubic `Math.pow(1 - t, 3)` (:33)
  - IntersectionObserver `threshold: 0.4` (:60)
- **Type switch by character count:** `metric.length>8` at content/render.mjs:67 and :152.
- **SVG presentation attributes:**
  - filter-chip check `stroke-width="2"` (content/render.mjs:91). Its `fill="none"`, `stroke="currentColor"` and the two `round` keywords are listed in Appendix B but not counted.
  - the favicon (partials/head.html:8)
  - the icon-normalisation matchers `stroke="#E8730E"`/`fill="#E8730E"` at assemble.mjs:117-118. That is the icons' native orange, which does not ship.
- **Hard-coded font stack:** styles/11-components.css:61 `.emlogo-text { font-family: "Roboto", system-ui, sans-serif }` bypasses --font-sans (main.css:176), which has a longer fallback chain. The font-family exclusion keeps it out of the count. At runtime `.emlogo-text` computes to `Roboto, system-ui, sans-serif` at 17.43px.
- **Brand logo:** assets/brand/emposo-logo-neu26.svg has 0 presentation attributes; outside its `<style>` there is only geometry. The `<style>` is stripped at assemble.mjs:126 and re-declared in styles/11-components.css:57-64, which is counted in 11-components.css.
- **Excluded once:**
  - 528 assets/icons SVGs
  - 16 SVG geometry attributes (14 in the favicon, 2 in the chip check)
  - metadata dimensions (assemble.mjs:36 896x288, content/share.mjs:8 1200x630)
  - the 24 `tabindex="0"` in pages/datenschutzerklaerung.html (a11y, not design)
  - the migration-meta files listed in the header
  - tools/, .github/workflows/ and serve.json, on purpose. The auditor's scan list names them (.claude/agents/auditor.md:13), but they are harness and config, not page styling: tools/build-dist.mjs:14-25 ships only the pages, css/, js/, assets/, robots.txt, sitemap.xml and serve.json, which the server reads for headers, CSP and redirects. Harness literals therefore exist and are not counted, e.g. `'#222'` and `'600 16px system-ui'` in the before/after labels at tools/visual/components.mjs:38, and the default widths `'390,1000,1400'` at tools/visual/snapshot.mjs:14.
- **Default-theme values that ship:**
  - The css/site.css theme layer ships 70 variables. 69 are defined in main.css. Exactly one comes from Tailwind's defaults: `--spacing: .25rem` (node_modules/tailwindcss/theme.css:325), which `min-h-11` consumes. No default font-weight, leading, transition or colour variables ship.
  - The built-in `sr-only` utility ships raw `width/height: 1px`, `margin: -1px` and `clip-path: inset(50%)`, through 4 uses (partials/footer.html:1; content/render.mjs:114 ×2, :216).
  - The generated `.container` utility carries 11 max-width steps. Three of them, 48/80/96rem, are Tailwind's default --breakpoint-md/xl/2xl (theme.css:328, :330, :331) and are never defined in main.css. They have no visible effect because the unlayered `.container` at main.css:383-390 wins: `.container` computes to max-width 1344px at both 1440 and 800 px.
  - Two comments about that utility are stale (main.css:9-11 and :377-382; detail in §4.2). The shipped steps are 600/640/650/700/768/900/992/1000/1200/1280/1536px. Separately, 08-editorial.css:75-76 names `max-xl:/xl:` header utilities; the header actually uses `max-nav:hidden`/`nav:hidden`.

### 3.6 Commands

```
W=/Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/raw-values-work; cd $W
node candidates.mjs candidates.json       # -> scanned_files 34, candidates 2787, bracket_or_paren_candidates 0, escaped selectors 0
node extract-css.mjs css-rows.json        # -> rows 544 (378 raw, 155 token-file, 11 outside), comment literals 60; asserts the main.css ranges
node extract-markup.mjs markup-rows.json  # -> rows 42, geometry attrs (excluded) 16
node build-report.mjs                     # -> ../raw-values.md, summary.json (tot incl. the 2 `round` keywords: color 13, length 313, time 3, arbitrary 0, other 99, total 428)
BASE=http://localhost:8180 node runtime-check.mjs   # -> pageHeroBeforeDisplay none, factMinDefined (empty), factCellMinHeight 256px
```

Verification (different methods, in E/verify-3/):

```
V=/Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/verify-3
python3 $V/recount.py                               # brace-matched token blocks, regex declarations -> raw 368 (see delta table)
node $V/utilities.mjs                               # build @sources only -> 33 files, 2579 candidates; utilities.css
node $V/probe.mjs                                   # positive control -> 5 of 5
BASE=http://localhost:8180 node $V/runtime-verify.mjs   # 8 routes x 1440/800 -> runtime-verify.json
```

The independent recount (recount.py) comes to 368. The gap to 378 is exactly the literals it deliberately does not parse:

| file | recount.py | slice | delta | literals recount.py skips |
| --- | --- | --- | --- | --- |
| styles/08-editorial.css | 43 | 47 | 4 | data-URI internals at :52 (width='12', height='8', stroke='black', stroke-width='1.5') |
| styles/10-feedback.css | 159 | 162 | 3 | `@container` prelude 56rem (:56), `scale(1.03)` (:252), `grayscale(1)` (:211) |
| styles/main.css | 9 | 12 | 3 | hyphenation limits (:352-354) |
| styles/11-components.css | 60 | 60 | 0 | the `15%` mix ratio (:30) is length in recount.py, color in the slice |
| other styles files | 97 | 97 | 0 | |
| token-file definitions | 143 | 155 | 12 | 10 `--leading-*`, `--state-disabled .38`, `--ease-em` |
| definitions outside | 10 | 11 | 1 | `--display-leading: 1.08` |

Font-weight 52, z-index 9, line-height 9, aspect-ratio 11 and all unit totals agree.

Cross-check with an independent comment-stripped perl count over styles/\*.css, all statuses, re-run with exit 0: rem 179, px 53, em 21, vw 27, % 51, ms 6, fr 67, ch 5, vh 2, dvh 1.

`cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && for u in rem px em vw '%' ms fr ch; do perl -0ne 's{/\*.*?\*/}{ }gs; $c=0; $c++ while /(?<![\w#.-])-?(?:\d+\.?\d*|\.\d+)\Q'"$u"'\E(?![\w%-])/g; $t+=$c; END { print "'"$u"' $t\n" }' styles/*.css; done`

This section makes no contrast, Lighthouse or bundle-size claims, so none were re-run. The only runtime claims (`::before`, `--fact-min`, `.container`) were re-measured on 8 routes at 2 widths.

Sections of the full listing (Appendix B): A summary, B worst offenders, C repeated literals, D the CSS listing per file, E1/E2 definitions, F markup/templates/JS, G exclusions, H default-theme values, I comment literals. Verification checks and outputs: `verify-3/checks.json`.

### 3.7 Section risks

- Dead CSS: .page-hero::before (styles/09-page-templates.css:19-29, 14 raw literals) is display:none at 10-feedback.css:169 (runtime: none on every page-hero route at 1440 and 800 px). Tokenising it would carry dead values into the new layer.
- Phantom token: --fact-min is read at 09-page-templates.css:104 and defined nowhere, so the 16rem fallback is what applies (runtime: 256px).
- @container (width &lt; 56rem) at 10-feedback.css:56 hard-codes --container-content (main.css:76), while @max-content inlines the token. Changing that token would silently desync the hero scrim switch.
- Breakpoints live outside CSS in px: 8 img sizes strings (600/700/900/1000px) in content/render.mjs and assemble.mjs:145, plus 75rem in js/01-header.js:11. A breakpoint token rename cannot reach them.
- Font-weight has no token: styles contain 52 raw numerics, main.css has no --font-weight-\* namespace, and no Tailwind default ships one. This is the largest single 'other' block against criterion 3.
- Z-index has no token: 9 raw values (1, 2, 50, 60, 100) across 07-header.css, 09-page-templates.css and 10-feedback.css.
- 9 unitless line-heights sit outside the 10 --leading-\* roles. Five are near-duplicates (1.25, 1.3, 1.38, 1.42, 1.43). 0.96 and 1 ×2 have no nearby role, and main.css:331 1.5 repeats --leading-body.
- Magic-number spread: 89 raw rem literals with 63 distinct values, 44 used once. Mapping them 1:1 to tokens would inflate the token set.
- 33 raw literals equal an existing token value (e.g. 2px = --rule-accent ×8; 40rem = --breakpoint-sm as a min-width and a max-width; 62rem = --breakpoint-lg as a max-width). Value equality does not prove the token is the right semantic.
- Type tokens --display-size and --display-leading are defined in 11-components.css:76/:90, outside the single @theme source (criterion 2).
- A second font stack: 11-components.css:61 hard-codes "Roboto", system-ui, sans-serif for the logo text instead of var(--font-sans). A font-token change would not reach the logo.
- Two house easings: the js/07-countup.js:33 ease-out cubic runs next to --ease-em. The Lenis 0.1/0.9 and IntersectionObserver 0.4 motion literals have no token.
- Tailwind defaults ship unreviewed: --spacing .25rem (theme.css:325, consumed by min-h-11), the sr-only literals, and .container max-width steps at 48/80/96rem (theme.css:328, :330, :331). The comments at main.css:9-11 and :377-382 describe that utility wrongly.
- min-h-11 (22 uses) and text-ink (7) are primitive utilities, not arbitrary ones. A semantic-only lint rule will flag them.
- Reproducibility depends on the hard-coded main.css token ranges (63-177, 179-249, 251). extract-css.mjs asserts them and fails loudly if main.css moves; verify-3/recount.py finds the blocks by brace matching instead.
- Headline count: 426 here vs 428 in raw-values.md/summary.json (2 keyword rows). Downstream consumers must pick one.

### Key counts for §3

Each entry: what was counted, the verified value, and the command that reproduces it (run in the worktree unless the command changes directory).

- **Raw values, all in-scope sources (outside token definitions, keywords excluded):** 426 (color 13, length 313, time 3, arbitrary 0, other 97; 81 structural). raw-values.md/summary.json say 428 because they also count stroke-linecap/linejoin="round" at content/render.mjs:91. Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/raw-values-work && node -e 'const t=require("./summary.json").tot;const k=require("./markup-rows.json");console.log(t, "minus 2 keyword rows (render.mjs:91 round x2) =", t.total-2)'`
- **Raw values in styles/\*.css:** 378 (color 6, length 280, time 2, other 90); reconciled with the independent recount.py (368 + 10 deliberately unparsed literals). Command: `python3 /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/verify-3/recount.py | grep raw_total  # 368; delta table in verify-3/checks.json`
- **Tailwind arbitrary values / properties / variants in sources:** 0 (slice file set: 34 files / 2787 candidates; build @sources only: 33 files / 2579 candidates; 0 with \[ or (; positive control 5 of 5). Command: `node /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/verify-3/utilities.mjs && node /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/verify-3/probe.mjs`
- **Arbitrary-value selectors in shipped css/site.css:** 0 escaped \[ and 0 escaped (. Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && grep -o '\\\[' css/site.css | wc -l; grep -o '\\(' css/site.css | wc -l`
- **Token-file custom-property declarations (main.css 63-177, 179-249, 251):** 120 declarations (= all custom-property declarations in main.css), 155 literals (18 color, 119 length, 4 time, 14 other). Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && perl -0ne 's{/\*.*?\*/}{ }gs; $n=()=/(?<![\w(-])--[a-z0-9-]+\s*:/g; print "$n\n"' styles/main.css`
- **Token definitions outside the token file:** 9 declarations on 6 lines (09:124, 09:125, 10:131, 11:76, 11:90, 11:167), 11 literals; 0 inline style=/setProperty definitions in markup or JS. Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && for f in styles/0*.css styles/1*.css; do perl -0ne 's{/\*.*?\*/}{ }gs; while (/(?<![\w-])(--[a-z0-9-]+)\s*:/g) { print "'"$f"' $1\n" }' "$f"; done; grep -nE 'style=|\.style\b|setProperty|cssText' pages/*.html sections/*.html partials/*.html content/*.mjs js/*.js assemble.mjs pages.mjs`
- **Raw rem literals / distinct values / used once:** 89 / 63 distinct values (64 spellings) / 44 used once (45 by spelling). Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/raw-values-work && node -e 'const r=require("./css-rows.json").rows.filter(r=>r.status==="raw"&&r.unit==="rem");const f={};r.forEach(x=>{const v=parseFloat(x.literal);f[v]=(f[v]||0)+1});console.log(r.length,Object.keys(f).length,Object.values(f).filter(n=>n===1).length)'`
- **Raw font-weight numerics in styles:** 52 (700 x20, 600 x12, 400 x10, 300 x6, 500 x4). Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && for f in styles/00-base-remainder.css styles/0[78]-*.css styles/09-*.css styles/1*.css styles/main.css; do perl -0ne 's{/\*.*?\*/}{ }gs; print "$1\n" while /font-weight:\s*(\d+)/g' $f; done | sort | uniq -c`
- **Raw z-index / unitless line-height in styles:** 9 / 9 (8 declarations + the main.css:331 fallback). Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && grep -nE 'z-index:\s*[0-9]+' styles/*.css | wc -l; grep -noE 'line-height:\s*[0-9.]+\b' styles/*.css | wc -l`
- **Raw CSS literals equal to an existing token value:** 33 (full list in 3.1 and verify-3/checks.json). Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/raw-values-work && node -e 'require("./css-rows.json").rows.filter(r=>r.status==="raw"&&/value =/.test(r.note||"")).forEach(r=>console.log(r.file+":"+r.line,r.literal,r.note))' | wc -l`
- **Independent unit cross-check, styles/\*.css all statuses (perl, comments stripped):** rem 179, px 53, em 21, vw 27, % 51, ms 6, fr 67, ch 5, vh 2, dvh 1 (re-run, exit 0; recount.py agrees except the one @container prelude rem). Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && for u in rem px em vw '%' ms fr ch vh dvh; do perl -0ne 's{/\*.*?\*/}{ }gs; $c=0; $c++ while /(?<![\w#.-])-?(?:\d+\.?\d*|\.\d+)\Q'"$u"'\E(?![\w%-])/g; $t+=$c; END { print "'"$u"' $t\n" }' styles/*.css; done`
- **min-h-11 primitive utility occurrences (not arbitrary, not in 426):** 22 in 11 file:lines. Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && grep -oE 'min-h-11' pages/*.html sections/*.html partials/*.html content/*.mjs pages.mjs js/*.js assemble.mjs | wc -l`
- **text-ink primitive utility occurrences (not arbitrary, not in 426):** 7. Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && grep -oE '(^|[" ])text-ink([" ]|$)' pages/*.html sections/*.html partials/*.html content/*.mjs pages.mjs js/*.js | wc -l`
- **Tailwind utilities shipped in css/site.css:** 14 classes (@container, sr-only, container, inline-flex, min-h-11, min-w-0, flex-wrap, items-center, wrap-anywhere, text-ink, max-nav:hidden, nav:hidden, @max-content:col-auto, @max-content:grid-cols-1). Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && node -e 'const c=require("fs").readFileSync("css/site.css","utf8");const i=c.indexOf("@layer utilities");console.log([...new Set([...c.slice(i).matchAll(/\.((?:\\.|[\w-])+)\{/g)].map(m=>m[1].replace(/\\/g,"")))].slice(0,20))'`
- **Default theme-layer variables shipped from node\_modules:** 1 of 70 (--spacing: .25rem, node\_modules/tailwindcss/theme.css:325). Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && grep -n -- '--spacing:' node_modules/tailwindcss/theme.css; grep -o '\-\-spacing:[^;]*' css/site.css`
- **Breakpoint px mirrors in img sizes strings:** 8 strings (content/render.mjs:10, :42, :73 x2, :74, :152, :217; assemble.mjs:145), 30 length literals. Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && grep -noE "'\(max-width: [0-9]+px\)[^']*'" content/render.mjs assemble.mjs | wc -l; grep -noE '[0-9]+px|[0-9]+vw' content/render.mjs assemble.mjs | wc -l`
- **Dead raw literals in .page-hero::before:** 14 (09-page-templates.css:19-29; display:none at 10-feedback.css:169; runtime display none on 5 page-hero routes at 1440 and 800 px). Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/verify-3 && BASE=http://localhost:8180 node runtime-verify.mjs`
- **Supplied icon SVGs excluded:** 528. Command: `ls /Users/jose/workspace/emposo-new-website/weave-clone-ds/assets/icons/*.svg | wc -l`
- **Literals in comments (not counted):** 61 (60 CSS: 07 4, 08 1, 09 3, 10 6, 11 6, main 40; 1 JS at js/07-countup.js:28). Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && for f in styles/*.css; do perl -0ne '$t=0; while (m{/\*(.*?)\*/}gs) { $b=$1; $t++ while $b =~ /(?<![\w#.-])-?(?:\d+\.?\d*|\.\d+)(?:px|rem|em|ch|vw|vh|dvh|%|fr|ms|s)(?![\w%-])|#[0-9a-fA-F]{3,8}\b/g } print "'"$f"' $t\n"' "$f"; done`
- **Worktree modifications by this audit:** 0 lines outside the two audit files; the plain git status --porcelain prints 2 since they were written (?? docs/design-system-audit-appendix.md, ?? docs/design-system-audit.md). Command: `git -C /Users/jose/workspace/emposo-new-website/weave-clone-ds status --porcelain -- . ':!docs/design-system-audit.md' ':!docs/design-system-audit-appendix.md' | wc -l`

## 4. Token layer and dark-mode mechanism

Worktree `weave-clone-ds` at 606227e (origin/main 199f82f + ds/p1-team), read-only; `git status --short` was empty after the audit and after verification (since this document and its appendix were written it lists only those two files; see the header). The full per-declaration table is in [Appendix C](design-system-audit-appendix.md#appendix-c-token-table) (a copy of E/tokens.md): 129 rows with name, value, block, file:line, Tailwind namespace, P/S/C, raw/alias, reads, ships, duplicates, M3 flag, plus every read location, and a verifier errata block at the end. Scripts and JSON are in E/token-layer/; the independent recount is in E/verify-4/. Every count below comes from `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/token-layer && node scripts/counts.mjs` (output in `counts.txt`) unless another command is named, and each one was recounted by a second method in `verify-4/`.

Method, briefly: definitions come from a comment-stripping block parser over styles/\*.css (`scripts/defs.mjs`). Tailwind behaviour comes from the installed 4.3.3 itself: `__unstable__loadDesignSystem(styles/main.css)`, `candidatesToCss` over all 24,666 class-list entries (`scripts/tw-namespaces.mjs`), and the real oxide scanner over the six `@source` roots (`scripts/scan.mjs`). The real CLI (`node_modules/.bin/tailwindcss -i ./styles/main.css --minify`) run on a copy of the sources in `verify-4/copy/` produces a file byte-identical to the committed `css/site.css` (52,241 bytes, `cmp` clean), so "ships" is exact. Runtime facts come from `BASE=http://localhost:8180 node scripts/dark-probe.mjs` and an independent `BASE=http://localhost:8180 node verify-4/probe.mjs` over all 37 routes at 1440, 995 and 390 px, from `scripts/rtl-probe.mjs`, and from `verify-4/layer-probe.mjs`.

### 4.1 Summary counts

| Measure | Value |
|---|---|
| Custom-property declarations in styles/ | **129**, for **122** names (7 redefinitions). A plain grep finds 130 because the comment at 00-base-remainder.css:23 starts with `--focus-halo:`. |
| By block | main.css `@theme` 77 (main.css:63-177); main.css `:root` 42 (main.css:179-249); `@media (width < theme(--breakpoint-nav)) :root` 1 (main.css:251); 11-components.css `:root` 2 (11:76); 11-components.css `@media (width <= theme(--breakpoint-hero)) :root` 1 (11:90); 11-components.css `:root:dir(rtl)` 1 (11:167); 09-page-templates.css `.page-section--dark` 2 (09:124) and `.page-section--deep` 2 (09:125); 10-feedback.css `a.expertise-card:focus-visible` 1 (10:131) |
| Cascade layer each block ships in (css/site.css) | `@theme` → `@layer theme { :root, :host }`; main.css `:root` and its `@media` redefinition → **unlayered**; everything in 09/10/11 → `@layer components` (`node verify-4/layer-walk.mjs` → layer-walk.txt) |
| Files holding token definitions | 4 (main.css, 09, 10, 11); the tokens README `styles/README.md` doesn't exist yet (`ls styles/README.md` → No such file) |
| Root font size | `html { font-size: 100% }` (styles/main.css:321-323), fixed by CLAUDE.md:74. Every rem token and rem breakpoint assumes this user-scalable 16 px root; px mirrors don't follow it (4.7) |
| `@theme` names by namespace (77) | color 14, text 27, leading 10, tracking 7, breakpoint 8, spacing 5, shadow 2, container 1, radius 1, ease 1, font 1 |
| Non-`@theme` names (45) | space 19 (`--space-N` 15 + `--space-fluid-*` 4), icon 6, duration 4, header 2, scrim 2, display 2, and 1 each: gutter, container-max, bleed-right, rule-accent, state-disabled, target-min, invert-bleed, line-hairline, accent-ink, focus-halo |
| Generates Tailwind utilities or variants (4.3.3) | all 77 `@theme` names; 0 of 45 others (`ds.theme.get()` returns null for each) |
| Primitive / semantic / component-local | **44 / 55 / 23** (rule in the Appendix C header; printed by `node scripts/gen-tokens-md.mjs`). The split is by name and comment, not by usage: 11 of the 55 S names have exactly one `var()` read (`--accent-ink`, `--color-line-strong`, `--text-caption`, `--text-headline-light`, `--tracking-caps`, `--tracking-caps-slight`, `--spacing-section`, `--spacing-xl`, `--shadow-raised`, `--shadow-overlay`, `--state-disabled`; `node verify-4/perToken.mjs`) |
| Raw / alias | 118 declarations raw; 11 alias declarations across 6 names (`--line-hairline`, `--accent-ink`, `--scrim-ink-side`, `--scrim-ink-top`, `--bleed-right`, `--focus-halo`), holding 13 `var()` reads |
| Ship in css/site.css | 114 of 122 names. The other 8 (7 breakpoints + `--container-content`) are inlined at build. |
| Unused (0 reads anywhere) | **1**: `--space-28` (main.css:197). `/usr/bin/grep -rn --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git --exclude='design-system-audit*.md' -- '--space-28' .` → only main.css:197 and the minified css/site.css:2 |
| False-positive "unused" (no `var()` read, but consumed) | 10: 7 breakpoints (theme() only), `--container-content` (`@max-content:` variant only), `--breakpoint-nav` (theme() + `nav:`/`max-nav:`), `--duration-countup` (JS only, js/07-countup.js:27) |
| Read but never defined | 1: `--fact-min`, read at 09-page-templates.css:104 as `var(--fact-min, 16rem)`, so the fallback always applies |
| Read exactly once | 41 names, counting all read kinds: 40 have exactly one `var()`+`theme()` read, plus `--duration-countup` with its single JS read |
| Exact duplicates (same kind) | 5 pairs plus 1 token/utility pair, 1 redundant default override and 1 duplicated rule; 6 more tokens equal a Tailwind default (see 4.5, which also reconciles these 5 pairs with the 11 value groups of §8.5) |
| Near duplicates | 7 font-size pairs, 2 breakpoint pairs, 1 leading pair, 1 tracking pair, 2 fluid twins (see 4.5) |
| Names with an M3 flag (Appendix C's M3 column, 44 rows because `--display-size` has two) | 43, which is not the criterion-1 count. It is §2's 19 token names (17 type-role names + `--breakpoint-compact` + `--state-disabled`) + 4 `on-` roles (adjacent vocabulary in §2, listed but not counted) + 20 names flagged only by an adjacent comment (main.css:74, :166, :169, :180, :229; §2 counts those lines as comment-only rows): 19 + 4 + 20 = 43. By kind: 23 by name (type-role words display/headline/title/body/label ×17, `--breakpoint-compact`, `--state-disabled`, `on-` roles ×4) and 20 via an adjacent comment only (`--space-*` ×15 "4px unit (M3)" main.css:180, `--breakpoint-nav` main.css:74, `--target-min` "48dp" main.css:229, `--shadow-*` "elevations" main.css:166, `--radius-full` "shape scale" main.css:169) |

### 4.2 Tailwind namespaces as the installed 4.3.3 treats them

- **`@theme` is not `inline`/`static`** (main.css:63), so a theme variable ships only when something references it. Utility yield per token (`node scripts/tw-namespaces.mjs`): each `--color-*` gives 51 utilities (`bg-`, `text-`, `border-*-`, `accent-`, …), `--spacing-*` 123 each, `--radius-full` 15, `--text-*`/`--leading-*`/`--ease-em`/`--font-sans` 1 each, `--tracking-*` 2 each (including the negative form). `--shadow-*` gives `shadow-raised`/`shadow-overlay` with the value inlined, not as a `var()`. `--breakpoint-*` gives the `<k>:`/`max-<k>:`/`min-<k>:` variants, and `--container-content` gives 8 utilities plus `@content:`/`@max-content:`/`@min-content:`.
- **Defaults overridden** (`node scripts/dups.mjs`; defaults at node_modules/tailwindcss/theme.css): `--breakpoint-lg` 64rem → 62rem (changes every `lg:`), `--tracking-tight` -0.025em → -0.02em, `--tracking-wide` 0.025em → 0.1em, `--font-sans` (Roboto first). `--breakpoint-sm` 40rem restates the default unchanged. The default `md` 48rem, `xl` 80rem and `2xl` 96rem breakpoints are still registered.
- **The theme layer sits below everything.** Tailwind emits the `@theme` block as `@layer theme{:root,:host{…}}`, the first layer in `@layer theme, base, components, utilities` (main.css:25). The main.css `:root` block is unlayered. This decides which overrides can work (4.4, 4.7).
- **Breakpoints double as `.container` steps.** `container` appears 35 times in sources (`node verify-4/classes.mjs container`), so Tailwind emits its `.container` utility into `@layer utilities` of css/site.css with 11 `max-width` media steps: 37.5, 40, 40.625, 43.75, 48, 56.25, 62, 62.5, 75, 80 and 96rem (our 8 plus default md/xl/2xl). The unlayered `.container { max-width: var(--container-max) }` (main.css:383-390) always wins: the computed `max-width` is 1344px at 1440, 995 and 390 px on all 37 routes (dark-probe.txt; verify-4/probe.json). This is the one place in this document that details the stale comments about it (§1, §3.5 and §8.4 point here):
  - main.css:9-11 says "Tailwind's own `.container` utility is never generated". It is, and the same comment places the hand-written rule in "00-base.css", but it's at main.css:383.
  - main.css:377-382 says there's "no max-width below 1440" and that "max-width:none is LOAD-BEARING", and lists Tailwind's steps as 480/640/768/992/1440/1536. The rule actually declares `max-width: var(--container-max)` (main.css:387), and the emitted steps are the 11 above.
  - Only main.css:22-24 and 363-369 describe the current state correctly (a competing `.container` utility is generated, and the unlayered rule must win).
- **Why the `:root` split exists, verified in memory** (`node scripts/ns-probe.mjs` → ns-probe.txt, reproduced by `node verify-4/ns.mjs` with `compile()`; nothing written to WT):
  - `--space-N` in `@theme` would feed `space-x-N`/`space-y-N`. tailwindcss/dist/lib.js registers `l("space-x",["--space","--spacing"], …)`, so `--space-4` would redefine `space-x-4` (`margin-inline-start: calc(var(--space-4) * …)`). That changes no value today, since each `--space-N` is N × 0.25rem, but `--space-fluid-*` would become new `space-x-fluid-*` utilities.
  - `--container-max` in `@theme` would generate `max-w-max`, which then emits both `max-width: max-content` and `max-width: var(--container-max)`, a keyword collision.
  - `--invert-bleed` in `@theme` would become the filter utilities `invert-bleed`/`backdrop-invert-bleed`.
  - **`--duration-*` isn't a 4.3.3 namespace**, even in `@theme`: `duration-*` resolves `valueThemeKeys:["--transition-duration"]` (lib.js), and `--duration-fast` in `@theme` produced no utility, while `--transition-duration-fast` produced `.duration-fast`. The brief §2 lists `--duration-*`; in this version the key is `--transition-duration-*`.
  - `--icon-*` and `--header-*` in `@theme` generate nothing (inert names).
- **`--breakpoint-nav` ships only because of a comment.** It is the one breakpoint defined in the shipped theme layer, and only because the comment string at js/01-header.js:10 ("Keep in sync with --breakpoint-nav in styles/main.css.") is a scanner candidate. With the real CLI on a source copy, removing only the token name from that comment (the copy's js/01-header.js:10 reads `/* Keep in sync. */`) drops `--breakpoint-nav:75rem` from the output (52,241 → 52,218 bytes; `verify-4/copy/out-a.css` vs `out-b.css`; `grep -c breakpoint-nav` gives 1 and 0). The `nav:`/`max-nav:` variants don't need the custom property: they inline 75rem, and out-b.css still compiles them (`@media (min-width:75rem){.nav\:hidden{display:none}}`, `@media not all and (min-width:75rem){.max-nav\:hidden{display:none}}`; `grep -o 'min-width:75rem\|max-width:75rem' out-b.css | sort | uniq -c` gives 5 and 1, the same as out-a.css). `node scripts/why-nav-ships.mjs` agrees (`with candidate: true | without candidate: false`). Nothing reads it at runtime.
- **One Tailwind default variable ships:** `--spacing: .25rem`, needed by `min-h-11` = `calc(var(--spacing) * 11)`.

### 4.3 How tokens are consumed

1. **`var()` in hand-written component CSS carries almost everything.** There are 697 `var()` reads: 381 of `@theme` tokens, 315 of the non-`@theme` tokens and 1 of the undefined `--fact-min`. By file: 10-feedback 361, 11-components 111, 09-page-templates 99, 08-editorial 69, 07-header 40, main.css 14, 00-base-remainder 3 (`node scripts/read-ctx.mjs` then `counts.mjs`; recount `node verify-4/strip.mjs && node verify-4/perToken.mjs`). Reads that carry a fallback: `var(--leading-body, 1.5)` main.css:331, `var(--focus-halo, 0 0 #0000)` 00-base-remainder.css:24, `var(--fact-min, 16rem)` 09:104.
2. **Only 3 of the 77 `@theme` tokens reach markup as utilities or variants.** The sources contain 14 distinct valid Tailwind classes in 140 occurrences (oxide scan, `scripts/scan.mjs`), and they match the shipped `@layer utilities` exactly. The 140 is a boundary-aware count over the 33 `@source` files: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/verify-4 && node classes-boundary.mjs` → container 35, text-ink 7, `@max-content:grid-cols-1` 10, `@max-content:col-auto` 8, `max-nav:hidden` 2, `nav:hidden` 1, min-h-11 22, `@container` 8, sr-only 4, inline-flex 12, min-w-0 4, flex-wrap 3, items-center 12, wrap-anywhere 12, "files 33 total 140 regex total 140" (a token split and a lookaround regex agree per class). The slice's token-split recount `node verify-4/classes.mjs …` gave 139 because it misses the `min-h-11${…}` at content/render.mjs:91 (see the `min-h-11` note below). The three token-backed ones:
   - `--color-ink` as `text-ink` ×7 (pages/404.html:10, 13-17; pages/about-us.html:31).
   - `--container-content` as `@max-content:grid-cols-1` ×10 (pages/portfolio.html ×6, pages/404.html:9, pages/about-us.html:30, content/render.mjs:28, 131) and `@max-content:col-auto` ×8 (pages/portfolio.html:22-41).
   - `--breakpoint-nav` as `max-nav:hidden` ×2 and `nav:hidden` ×1 (partials/header.html:5, 11, 12).

   The other token-touching classes are `container` ×35 (steps overridden, see 4.2) and `min-h-11` ×22, which uses the default `--spacing` (partials/header.html:6, 7, 8, 9, 11, 13; partials/contact-form.html:1; partials/footer.html:1 ×12; content/render.mjs:91, 114, 216). The slice counted 21 because `node verify-4/classes.mjs min-h-11` misses the chip at content/render.mjs:91, where the class is followed directly by `${`; `grep -oE 'min-h-11' pages/*.html sections/*.html partials/*.html content/*.mjs js/*.js | wc -l` → 22. The remaining 74 `@theme` tokens generate utilities that no source uses. So criterion 2's "consumed everywhere" currently means `var()` in hand-written CSS, not utilities.
3. **`theme()` appears only in `@media` preludes: 17 reads, all breakpoints**, at 08:78, 87; 09:113, 118, 178, 187; 10:254, 255, 270, 291, 304; 11:32, 88, 89, 93, 150; main.css:251. There's no `theme()` inside a declaration. `@max-content` inlines `--container-content` through the variant (it compiles to `@container not (min-width:56rem)`). The parallel hand-written query `@container (width < 56rem)` (10-feedback.css:56) repeats its value as a literal.
4. **JS:** one `getPropertyValue('--duration-countup')` at js/07-countup.js:27, and one literal mirror, `matchMedia('(min-width: 75rem)')` at js/01-header.js:11, standing in for `--breakpoint-nav`. No JS or markup sets a custom property (no `setProperty`, no `style=`, no `[--x:…]` arbitrary properties in the `@source` roots).
5. **`currentColor` and `inherit`: colour that follows the ground with no token.** assemble.mjs:111-118 rewrites the supplied Hays Glow icons' `stroke="#E8730E"`/`fill="#E8730E"` to `currentColor` when it inlines them (all 528 files in assets/icons/ carry `#E8730E`; 0 generated HTML files contain it), and the inlined logo paints with `fill`/`stroke: currentColor` (11:62, 11:64; assemble.mjs:121-126), so the footer logo turns white from `.site-footer { color }`. 12 declarations in styles/ take their colour this way: 08:46, 08:73, 09:46, 10:93, 10:126, 10:132, 10:231, 11:62, 11:64, 11:81, 11:101, main.css:300.
6. **One derived colour outside the token layer:** `color-mix(in srgb, var(--color-lemon) 15%, transparent)` for the unselected chip hover (11:30). It's the only `color-mix()` in styles/.

### 4.4 Dark and on-dark mechanism, as implemented

- **There's no theme switch.** `/usr/bin/grep -rnoE 'data-theme|prefers-color-scheme|color-scheme' styles js sections pages partials content pages.mjs assemble.mjs tools serve.json` → no match (exit 1). A wider grep for `forced-colors|prefers-contrast|theme-color|light-dark(|::selection|accent-color|caret-color|scrollbar-color|@media print` over the same paths also exits 1. At runtime: 0 `[data-theme]` elements, computed `color-scheme: normal`, no `<meta name="color-scheme">` and no `<meta name="theme-color">` on any of the 37 routes at 1440, 995 or 390 px (dark-probe.txt; verify-4/probe.json).
- **Scoped flip, the only token-level mechanism.** `.page-section--dark` (09:124) and `.page-section--deep` (09:125) have identical bodies: `background: var(--color-ink); color: var(--color-on-dark); --line-hairline: var(--color-line-light); --accent-ink: var(--color-lemon)`. That's an exact duplicate rule, which the minifier merges into `.page-section--dark,.page-section--deep`. Exactly **2 tokens flip**. Their `:root` defaults are `--line-hairline: var(--color-line)` (main.css:245) and `--accent-ink: var(--color-ink)` (main.css:248). The scopes apply on 3 routes (`--dark`: pages/about-us.html:15, pages/kontakt.html:1, pages/portfolio.html:8) and 26 routes (`--deep`, the `cta()` renderer at content/render.mjs:131).
- **The flip has no effective consumer.** `--line-hairline` is read only by `.fact-grid` (09:96, 101, 116, 120) and `--accent-ink` only by `.fact-grid__label` (09:110). `.fact-grid` renders on one route, /portfolio/ (pages/portfolio.html:56, inside the `--paper` section at :47), outside any dark scope (dark-probe.txt and verify-4/probe.json: `inScope=false`). All five labels also carry `.fact-grid__label--display` (pages/portfolio.html:57-61), which hard-codes `--color-ink` (11:112) anyway.
- **Everything else on navy is hard-coded per component.** The six on-dark tokens (`--color-on-dark` 30 reads, `--color-line-light` 11, `--color-on-dark-muted` 6, `--color-on-dark-faint` 2, `--color-error-on-dark` 2, `--color-line-light-strong` 2) have 53 `var()` reads. 4 of them are the scope rules themselves; the other **49 are component selectors**: 10-feedback 19, 09-page-templates 12, 08-editorial 9, 11-components 8, 00-base-remainder 1. Every selector is listed in Appendix C, "Full read locations", and in `node verify-4/perToken.mjs`.
  - Navy grounds that set their own ink background and on-dark text without flipping any token: `.hero` (08:9), `.services` (08:21), `.contact` (08:37 + 10:152), `.page-hero` (09:13-15), `.page-hero__visual` (09:61), `.about-hero__visual` (09:170), `.site-footer` (10:158), `.header-contact__arrow` (10:27), `.contact-form select` (11:44).
  - At runtime, 10 distinct navy element signatures sit outside any scope, identical at 1440, 995 and 390 px: `.page-hero` on 28 routes (+1 `portfolio-hero`), `.page-hero__visual` on 27, `.site-footer` and `.header-contact__arrow` on 37, plus `.hero--feedback`, `.services`, home `.contact`, `select` and `.about-hero__visual`.
  - Hover/focus inverts with no scope: `.reference-card__copy` and `a.expertise-card` (10:125, 10:130); `:is(.header-contact, .mobile-menu__cta)` (10:29, 10:32).
- **`--color-ink` is both the navy ground and the ink text.** Of its 57 `var()` reads, 16 paint a background (15 `background`, 1 `background-color`: every navy ground above, the scopes, the inverts and the nav underline bar at 10:21), 3 feed the scrims and 2 the invert halos, while 29 are `color` and 4 are outline/underline ink. The last 3 are the selected-chip border (11:26), the `--accent-ink` default and `--focus-halo` (`node verify-4/prop-tally.mjs` → prop-tally.txt). `--color-on-dark` is 29 `color` reads plus the white focus-ring halo. One token serves two roles that a dark theme has to move in opposite directions.
- **Accent-as-text mostly bypasses `--accent-ink`.** Besides the one `--accent-ink` read, 13 declarations set `color: var(--color-lemon)` directly on both grounds: 08:69, 09:50, 09:51, 09:150, 09:165, 10:128, 10:134, 10:145, 10:161, 10:189, 10:221, 11:107, 11:119 (`/usr/bin/grep -nE '(^|[{; ])color: *var\(--color-lemon\)' styles/*.css`).
- **Children on navy get it through BEM `--light` modifiers**, not tokens: `eyebrow--light` ×16, `display-large--light` ×14, `text-link--light` ×1, `page-section__lede--light` ×1, i.e. 32 source occurrences. The content/render.mjs ones fan out at build time: `cta()` (render.mjs:130-131) is on 26 routes and `projectPage()` (render.mjs:152) on the 23 /case-studies/&lt;slug>/ routes (`node verify-4/classes.mjs eyebrow--light display-large--light text-link--light page-section__lede--light`). Their CSS is at 11:71, 11:80, 11:106-107, 09:137.
- **Icons and the logo need no flip.** They follow the ground through `currentColor` (4.3 item 5).
- **The breadcrumb is inverted: on-dark by default, reverted on light grounds.** `.page-breadcrumb` defaults to `--color-on-dark-faint` (09:38). Light contexts revert it with `.legal-copy .page-breadcrumb` (10:225) and with `:not(.page-section--dark):not(.page-section--deep)` chains (10:228, 10:231, 10:232). `npm run contrast` passes both today: "breadcrumb link (on dark)" rest 7.59, "breadcrumb link (light)" rest 19.43. The chain keys on the scope classes, not on the ground. `.services` (sections/04-about.html:1) and the home `.contact` (sections/07b-sales-cta.html:1) are navy `.page-section`s without `--dark`/`--deep`, so a breadcrumb inside them would get ink on navy. That's latent only: neither file contains a breadcrumb (`grep -c 'page-breadcrumb\|page-crumb'` → 0).
- **Layering decides whether a redefinition works** (rtl-probe.txt, verify-4/probe.json, verify-4/layer-probe.mjs):
  - `:root:dir(rtl) { --scrim-ink-side: … 270deg }` (11:167) sits in `layer(components)` and **never applies**. It loses to the unlayered `:root` at main.css:239 on the same element: with `dir="rtl"` the value stays `90deg`, and so does the computed `.page-hero__visual::after` gradient. The judge confirmed it independently (E/judge/rtl-judge.mjs: the selector matches, the value stays 90deg; the same declaration inserted unlayered through adoptedStyleSheets gives 270deg).
  - The rule is specific to the 42 unlayered main.css `:root` names (the other 3 non-`@theme` names, `--display-size`, `--display-leading` and `--focus-halo`, are in `@layer components`). A `@layer components { :root { … } }` sheet inserted through the CSSOM **does** override the `@theme` tokens (`--color-ink`, `--color-on-dark`, which live in `@layer theme`) and the components-layer `--display-size`. It doesn't override `--space-4`, `--line-hairline` or `--scrim-ink-side`, which only an unlayered `:root` rule changed. Aliases follow their primitive: with `--color-ink` overridden, `--accent-ink` and the scrim gradient resolve to the new colour.
  - The two `@media` redefinitions apply because each sits in its base's layer: `--header-h` 5rem at 800 px (main.css:251, unlayered) and `--display-size` (11:90, components).
  - Section-level scopes (09:124-125) work because the value reaches descendants by inheritance, not by winning on the same element.
  - `--focus-halo` is a component-local token that crosses the layer boundary. The unlayered `:focus-visible` box-shadow (00-base-remainder.css:24) beats the layered invert halo on `a.expertise-card`, so 10:131 passes the halo into that rule as `--focus-halo`.
- `--color-surface-veil` (header ground, main.css:92), `--color-paper` (4 grounds: 09:123, 10:142, 11:149, 08:24), `--color-bg` as a ground (8 reads) and `--shadow-*` have no on-dark counterpart. `:focus-visible` (00-base-remainder.css:20-25) uses a `--color-ink` outline plus a `--color-on-dark` halo on every ground, so the "on-dark" role doubles as "white".

### 4.5 Duplicates and near-duplicates (`node scripts/dups.mjs` → dups.txt)

- **Exact, same kind:**
  - `--leading-display` 1.08 (main.css:145) = `--display-leading` (11:76)
  - `--color-bg` #fff (main.css:83) = `--color-on-dark` (main.css:95): two roles, no shared primitive
  - `--tracking-caps` = `--tracking-caps-slight` .01em (main.css:137-138)
  - `--spacing-rule` 1rem (main.css:163) = `--space-4`
  - `--spacing-cell` 1.5rem (main.css:162) = `--space-6`
  - `--target-min` 2.75rem (main.css:230) = Tailwind `min-h-11` (22 uses; the slice's 21 misses content/render.mjs:91, see 4.3). The same value also appears as a literal at 09:49, in the rule that reads `var(--target-min)`.
  - `--breakpoint-sm` restates the Tailwind default.
  - The `.page-section--dark` and `--deep` bodies duplicate each other (09:124-125).
- **Equal to a still-registered Tailwind default** (node_modules/tailwindcss/theme.css), 6 tokens, so two utilities give the same value: `--tracking-wide` 0.1em = default `--tracking-widest` (theme.css:389); `--tracking-display` -0.025em = the default `--tracking-tight` (theme.css:385) that main.css:140 overrides to -0.02em; `--leading-body` 1.5 = `--leading-normal` (theme.css:393); `--text-body` 1rem = `--text-base` (theme.css:351); `--text-join-glyph` 3rem (main.css:117) = `--text-5xl` (theme.css:363); `--container-content` 56rem = `--container-4xl` (theme.css:342). dups.txt lists all 6 under "same value as default".
- **Values that repeat as literals:** `--container-content` as `56rem` (10:56); `--breakpoint-nav` as `75rem` (js/01-header.js:11); the `--font-sans` family list as `"Roboto", system-ui, sans-serif` (11:61).
- **Literal that bypasses its token:** the eyebrow's lemon rule is `height: 3px` (11:70), while `--rule-accent` 2px is "the one weight of orange accent rules" (main.css:225), which B-38 set by folding 3px rules into it. Whether that's an owner exception is for token-architect.
- **Derived but written raw:** `--color-line` and `--color-line-strong` are ink at 18%/45% alpha; `--color-surface-veil` is paper at 96%; `--shadow-*` use ink rgba. None of them references `--color-ink` or `--color-paper`.
- **Near, same kind** (thresholds ≤0.04rem / 0.02 / 0.005em / 10px):
  - Font sizes, all 0.16-0.64px apart: `--text-index`/`--text-micro`/`--text-badge` (.70/.72/.76), `--text-caption`/`--text-label` (.8125/.85), `--text-body-lg`/`--text-mode-copy`/`--text-lede-sm` (1.05/1.07/1.1), `--text-lede`/`--text-cta-copy`/`--text-lede-lg` (1.15/1.16/1.2). 14 fixed text sizes sit between 0.7 and 1.2rem.
  - Breakpoints `--breakpoint-sm`/`--breakpoint-narrow` (10px) and `--breakpoint-lg`/`--breakpoint-tablet` (8px). Per the peer session these aren't safe merges: merging 992/1000 once flipped `@max-content` layouts on 16 routes.
  - Leading `--leading-display`/`--leading-heading` (1.08/1.1); tracking `--tracking-tight`/`--tracking-display` (-.02/-.025em).
- **Fluid twins (same vw slope):** `--text-headline-md`/`--text-headline-light` are identical from 960 to 1536 px; `--spacing-xl`/`--space-fluid-xl` from 450 to 1400 px.
- **Cross-kind equal values (informational),** all from dups.txt: `--text-body` = `--spacing-rule` = `--space-4` 1rem (main.css:109, :163, :187; the spacing pair is also a same-kind pair above); `--text-lede-sm` = `--invert-bleed` 1.1rem (main.css:111, :242); `--text-join-glyph` = `--space-12` = `--icon-md` 3rem (main.css:117, :191, :235); `--icon-lg` = `--space-16` 4rem (:236, :193); `--icon-xl` = `--space-18` 4.5rem (:237, :194); `--header-h` = `--space-24` 6rem (:215, :196) and, below the nav breakpoint, `--header-h` = `--space-20` 5rem (:251, :195).
- **How these counts relate to §8.5.** §8.5's 11 exact-value groups (`cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2 && node bundle-verify/dups2.mjs` → "groups 11") group by value across kinds. They are 5 groups that hold the 5 same-kind pairs above (1.08, #fff, .01em, 1.5rem, and 1rem, which also holds the cross-kind `--text-body`) plus 6 purely cross-kind groups (1.1rem, 3rem, 4rem, 4.5rem, 6rem, and 5rem, the media-scoped `--header-h` at main.css:251, which is why §8.5 says 10 top-level groups). The token/utility pair, the redundant default, the duplicated rule and the 6 default equalities are outside both counts. Criterion 7 scores the 5 same-kind pairs.

### 4.6 Stale token references (doc / comment / tool)

- docs/components.md:28-35 (the "State-Layer (Hover/Press)" rule under Grundregeln) and :234-238 (the `state-layer (primitive)` entry, still "Status: active") document `--state-hover` .08, `--state-press` .1 and `--state-inset`. None of them exists; the overlay was removed in B-51 (#30). Classification: doc. Full B-51 list: §2, "State-layer leftovers".
- tools/visual/contrast.mjs:5 and :46 still composite a "state-layer overlay" `::before` into the measured ground. It's harmless today because no component has that `::before`, and `npm run contrast` passes. Classification: tool (§2 counts it).
- docs/backlog.md:20 says spacing is "tokenized as shipped (--space-legacy-\*)". The tokens are `--space-N` (main.css:184-198). Classification: doc.
- main.css:9-11 and :377-382 misdescribe the `.container` utility (4.2). Comment-only.
- 08-editorial.css:75-76: "max-xl:/xl: utilities in the header markup". The markup uses `max-nav:`/`nav:` (partials/header.html:5, 11, 12; `grep -c 'xl:' partials/header.html` → 0). Comment-only.

### 4.7 Risks (one line each)

- **Layer placement.** A page-level `prefers-color-scheme` block on `:root` inside a `layer(components)` file will override the 77 `@theme` tokens (all 14 colours among them) but silently miss the 42 unlayered main.css `:root` tokens, and both tokens that flip today (`--line-hairline`, `--accent-ink`) are unlayered (proven by 11:167 and verify-4/layer-probe.mjs). The owner's section-scoped `[data-theme="dark"]` works by inheritance and isn't affected.
- **Flip coverage.** `[data-theme="dark"]` will change nothing visible until the 49 hard-coded on-dark reads, the 13 direct lemon-text reads, the 32 source occurrences of `--light` modifiers (the render.mjs ones repeat on 26 and 23 routes) and the 10 unscoped navy grounds consume flipping semantic tokens. The existing flip (2 tokens) has 0 consumers in a dark scope.
- **One token, two roles.** `--color-ink` is the navy ground (16 background reads) and the ink text (29 color reads), and `--color-bg`/`--color-on-dark` share #fff with no primitive behind them. The semantic layer has to split ground and content roles before any scope can flip them.
- **Namespace traps when consolidating into `@theme`:** `--space-N` redefines `space-x/y-N`, `--container-max` collides with `max-w-max`, `--invert-bleed` becomes a filter utility, and `--duration-*` generates nothing in 4.3.3.
- **Breakpoint edits change shipped CSS.** Breakpoint tokens also emit 11 `.container` max-width steps, and near-duplicate breakpoint pairs are known to flip `@max-content` layouts when merged.
- **Hidden mirrors drift.** `75rem` in js/01-header.js:11, `56rem` in 10:56, `2.75rem` in 09:49, the Roboto list in 11:61 and the 3px eyebrow rule in 11:70 don't follow their tokens. `--breakpoint-nav` stays in css/site.css only while the js/01-header.js:10 comment exists.
- **The 16 px root is fixed, and px mirrors don't scale with it.** `html { font-size: 100% }` (main.css:321-323) stays by CLAUDE.md:74, so rem tokens, rem breakpoints and the rem mirror in js/01-header.js:11 follow the visitor's default font size, while px values don't. At a 20 px browser default and a 1400 px viewport, html computes 20px, `(min-width: 75rem)` no longer matches and the desktop nav is hidden, but `.emlogo-text` stays 17.43px (11:61) and a px bound such as `(max-width: 1000px)` in the img `sizes` strings (content/render.mjs:42, :73) doesn't move (`BASE=http://localhost:8180 node /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/root-scale-probe.mjs` → E/root-scale-probe.txt), so any step that converts between px and rem changes behaviour under enlarged text.
- **Inverted breadcrumb.** The breadcrumb is on-dark by default and reverted by `:not()` chains of specificity (0,4,0) and higher (10:228-232) that key on the scope classes, not on the ground. A scope rewrite has to reproduce that order or light-page breadcrumbs turn faint white, and a breadcrumb placed in `.services`/`.contact` would turn ink on navy.
- **Dead or undefined:** `--space-28` (0 reads) and `--fact-min` (read, never set). Removing them is safe for rendering but still needs bundle-analyst's proof under hand-off rule 5.

This section has no Lighthouse, coverage or size claims. The only cheap runtime gate that bears on it, `npm run contrast` on :8180, reproduces (PASS, exit 0, identical to E/contrast-8180.txt). The css/site.css size 52241 was confirmed with `wc -c` and a byte-identical CLI rebuild.

### Key counts for §4

Each entry: what was counted, the verified value, and the command that reproduces it (run in the worktree unless the command changes directory).

- **Custom-property declarations / unique names in styles/:** 129 / 122 (7 redefinitions); a raw grep finds 130 because the comment at 00-base-remainder.css:23 starts with --focus-halo:. Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/verify-4 && node strip.mjs | head -1; cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && /usr/bin/grep -noE '(^|[{;[:space:]])--[a-z0-9-]+[[:space:]]*:' styles/*.css | wc -l  # -> 'declarations 129 names 122' (comment-stripped); 130 with the plain grep`
- **@theme names / non-@theme names:** 77 / 45. Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/verify-4 && node perToken.mjs | head -1  # -> 'themeNames 77' (main.css:63-177 parsed separately); 122 - 77 = 45 non-@theme names`
- **@theme names by namespace:** color 14, text 27, leading 10, tracking 7, breakpoint 8, spacing 5, shadow 2, container 1, radius 1, ease 1, font 1. Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && sed -n '63,177p' styles/main.css | perl -0pe 's{/\*.*?\*/}{}gs' | grep -oE '^\s*--[a-z]+' | sed -E 's/^ *--//' | sort | uniq -c | sort -rn  # -> 27 text, 14 color, 10 leading, 8 breakpoint, 7 tracking, 5 spacing, 2 shadow, 1 each radius/font/ease/container`
- **Cascade layer of token blocks in css/site.css:** @theme -> @layer theme; main.css :root (42) + @media --header-h -> unlayered; 11 :root, :root:dir(rtl), dark/deep scopes, a.expertise-card:focus-visible -> @layer components. Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/verify-4 && node layer-walk.mjs > layer-walk.txt`
- **Primitive / semantic / component-local:** 44 / 55 / 23 (name/comment-based; 11 S names have exactly one var() read). Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2 && awk -F'|' '/^\| [0-9]+ \|/ {print $8}' tokens.md | sort | uniq -c; awk -F'|' '/^\| [0-9]+ \|/ {print $8, $3}' tokens.md | sort -u | awk '{print $1}' | uniq -c; cd verify-4 && node perToken.mjs  # -> rows C 25, P 44, S 60; names C 23, P 44, S 55; then the per-token read lists (11 S names with one var() read)`
- **Names shipped in css/site.css / inlined at build:** 114 / 8 (7 breakpoints + --container-content); plus Tailwind default --spacing (115 custom properties in site.css). Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && S=$(perl -0ne 's{/\*.*?\*/}{ }gs; print "$1\n" while /(?<![\w(-])(--[a-z0-9-]+)\s*:/g' styles/*.css | sort -u); C=$(grep -oE '[{;]--[a-z0-9-]+:' css/site.css | sed -E 's/^[{;]//; s/:$//' | sort -u); comm -12 <(echo "$S") <(echo "$C") | wc -l; comm -23 <(echo "$S") <(echo "$C") | paste -sd' ' -; comm -13 <(echo "$S") <(echo "$C")  # -> 114; the 7 breakpoints + --container-content; --spacing (115 custom properties in site.css)`
- **Real CLI build from a source copy equals committed css/site.css:** true (52241 bytes, cmp clean). Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/verify-4/copy && /Users/jose/workspace/emposo-new-website/weave-clone-ds/node_modules/.bin/tailwindcss -i ./styles/main.css -o ./out-a.css --minify && cmp out-a.css /Users/jose/workspace/emposo-new-website/weave-clone-ds/css/site.css`
- **--breakpoint-nav ships only because of the js/01-header.js:10 comment:** yes: with the comment 52241 bytes including --breakpoint-nav:75rem; with the token name removed from the comment 52218 bytes and 0 --breakpoint-nav, while the nav:/max-nav: variants still compile with 75rem inlined (5 min-width:75rem and 1 max-width:75rem in both builds). Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/verify-4/copy && diff <(sed -n 10p /Users/jose/workspace/emposo-new-website/weave-clone-ds/js/01-header.js) <(sed -n 10p js/01-header.js); /Users/jose/workspace/emposo-new-website/weave-clone-ds/node_modules/.bin/tailwindcss -i ./styles/main.css -o ./out-b.css --minify && wc -c out-a.css out-b.css && grep -c breakpoint-nav out-a.css out-b.css; grep -o 'min-width:75rem\|max-width:75rem' out-b.css | sort | uniq -c  # -> the one line where the copy differs from WT (js/01-header.js:10); 52241 and 52218 B; 1 and 0; 5 min-width, 1 max-width (out-a.css: the same 5 and 1)`
- **Unused tokens (0 reads anywhere):** 1: --space-28 (styles/main.css:197). Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/verify-4 && node perToken.mjs | grep 'zero var+theme'  # -> --container-content, --space-28, --duration-countup; the first has 18 variant uses and the last a JS read, so only --space-28 is unused`
- **False-positive unused (no var() read but consumed):** 10 (7 breakpoints, --container-content, --breakpoint-nav, --duration-countup). Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/verify-4 && node perToken.mjs | sed -n '/no var read/,/]/p'  # -> 'no var read 11'; minus --space-28 = 10`
- **Read but never defined:** 1: --fact-min (styles/09-page-templates.css:104). Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/verify-4 && node strip.mjs | grep 'read but not defined'  # -> --fact-min 09-page-templates.css:104`
- **Read exactly once:** 41 (40 by var()+theme(), plus --duration-countup's single JS read). Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/verify-4 && node perToken.mjs | grep 'exactly one var+theme read'; grep -n "getPropertyValue('--duration-countup')" /Users/jose/workspace/emposo-new-website/weave-clone-ds/js/07-countup.js  # -> 40, plus the one JS read at js/07-countup.js:27`
- **var() reads / theme() reads in styles:** 697 (381 of @theme tokens, 315 of non-@theme tokens, 1 of undefined --fact-min) / 17 (all breakpoints in @media preludes). Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/verify-4 && node strip.mjs && node perToken.mjs`
- **Tailwind classes in @source files / occurrences:** 14 / 140 (boundary-aware recount: container 35, text-ink 7, @max-content:grid-cols-1 10, @max-content:col-auto 8, max-nav:hidden 2, nav:hidden 1, min-h-11 22, @container 8, sr-only 4, inline-flex 12, min-w-0 4, flex-wrap 3, items-center 12, wrap-anywhere 12; the slice's token-split recount gave 139 because it misses the min-h-11 at content/render.mjs:91, see the min-h-11 entry below) (corrected, see [Corrections](#corrections-applied-in-this-document)). Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/verify-4 && node classes-boundary.mjs  # -> the 14 per-class counts and 'files 33 total 140 regex total 140' (token split and lookaround regex agree); the class set matches the css/site.css @layer utilities; slice recount: node classes.mjs <the 14 classes> -> 'total 139'`
- **@theme tokens reaching markup as utilities/variants:** 3 of 77: --color-ink x7, --container-content x18, --breakpoint-nav x3. Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/verify-4 && node classes.mjs text-ink @max-content:grid-cols-1 @max-content:col-auto max-nav:hidden nav:hidden`
- **min-h-11 occurrences and locations:** 22: partials/header.html:6,7,8,9,11,13; partials/contact-form.html:1; partials/footer.html:1 (x12); content/render.mjs:91,114,216. The slice's 21 (node verify-4/classes.mjs) misses content/render.mjs:91, where the class is followed directly by a template placeholder (corrected, see [Corrections](#corrections-applied-in-this-document)). Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && grep -oE 'min-h-11' pages/*.html sections/*.html partials/*.html content/*.mjs js/*.js | wc -l; grep -noE 'min-h-11' content/render.mjs   # slice recount: cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/verify-4 && node classes.mjs min-h-11`
- **JS token reads:** 1: --duration-countup js/07-countup.js:27 (plus literal mirror 75rem at js/01-header.js:11); no JS/markup sets a custom property. Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && /usr/bin/grep -rnoE -- '--breakpoint-[a-z]+|--container-content|getPropertyValue|setProperty|matchMedia\([^)]*\)' js content pages sections partials pages.mjs assemble.mjs`
- **Tokens flipped by dark scopes:** 2 (--line-hairline, --accent-ink) in 2 identical rules 09:124-125, merged by the minifier. Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && sed -n '124,125p' styles/09-page-templates.css; grep -o '\.page-section--dark,\.page-section--deep{[^}]*}' css/site.css`
- **On-dark family var() reads / outside the scope rules:** 53 / 49 (10-feedback 19, 09 12, 08 9, 11 8, 00 1). Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/verify-4 && node perToken.mjs | grep -E '^--color-(on-dark|line-light|error-on-dark)'  # -> the per-token location lists for the six on-dark tokens`
- **--color-ink reads by role:** 57 total: 16 background/background-color, 29 color, 3 scrims, 2 halo box-shadows, 4 outline/underline, 1 border, 1 --accent-ink default, 1 --focus-halo. Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/verify-4 && node prop-tally.mjs > prop-tally.txt`
- **Direct lemon-as-text reads bypassing --accent-ink:** 13. Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && /usr/bin/grep -nE '(^|[{; ])color: *var\(--color-lemon\)' styles/*.css | wc -l`
- **\[data-theme] / prefers-color-scheme / color-scheme occurrences:** 0 in sources (also 0 forced-colors, prefers-contrast, theme-color, light-dark()); 0 \[data-theme] elements, color-scheme normal, no color-scheme or theme-color meta on 37 routes at 1440/995/390. Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && /usr/bin/grep -rnoE 'forced-colors|prefers-contrast|@media print|theme-color|color-scheme|data-theme|::selection|accent-color|caret-color|scrollbar-color|light-dark\(' styles js sections pages partials content pages.mjs assemble.mjs tools serve.json; echo exit=$?; cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/verify-4 && BASE=http://localhost:8180 node probe.mjs  # -> exit=1; then the runtime fields per width in probe.json`
- **Navy grounds outside any dark scope (runtime):** 10 distinct element signatures, identical at 1440, 995 and 390 px (page-hero 28 routes +1 portfolio-hero, page-hero\_\_visual 27, site-footer 37, header-contact\_\_arrow 37, hero--feedback, services, contact, select, about-hero\_\_visual 1 each). Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/verify-4 && BASE=http://localhost:8180 node probe.mjs  # writes probe.json in verify-4/`
- **Dark scope routes / fact-grid in scope:** --dark 3 routes (/portfolio/, /about-us/, /kontakt/), --deep 26 routes; fact-grid on /portfolio/ inScope=false. Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/verify-4 && BASE=http://localhost:8180 node probe.mjs`
- **.container computed max-width:** 1344px on all 37 routes at 1440, 995 and 390 px; Tailwind .container emits 11 steps. Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/verify-4 && BASE=http://localhost:8180 node probe.mjs; grep -o '\.container{max-width:[0-9.]*rem}' /Users/jose/workspace/emposo-new-website/weave-clone-ds/css/site.css | wc -l  # -> 11`
- **RTL scrim override effective:** no (--scrim-ink-side and .page-hero\_\_visual::after stay 90deg with dir=rtl). Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/verify-4 && BASE=http://localhost:8180 node probe.mjs  # see the field rtl in probe.json`
- **components-layer :root override reach:** overrides @theme tokens (--color-ink, --color-on-dark) and --display-size; does not override the unlayered --space-4, --line-hairline, --scrim-ink-side. Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/verify-4 && BASE=http://localhost:8180 node layer-probe.mjs > layer-probe.txt`
- **--light modifier occurrences in markup sources:** 32 (eyebrow--light 16, display-large--light 14, text-link--light 1, page-section\_\_lede--light 1). Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/verify-4 && node classes.mjs eyebrow--light display-large--light text-link--light page-section__lede--light`
- **Exact / near duplicates:** 5 same-kind pairs + --target-min=min-h-11 + redundant --breakpoint-sm + duplicate rule 09:124/125 + 6 tokens equal to a Tailwind default (incl. --text-join-glyph = --text-5xl 3rem); near: 7 font-size, 2 breakpoint, 1 leading, 1 tracking, 2 fluid twins. The 5 same-kind pairs sit in 5 of the 11 value groups of §8.5; the other 6 groups are cross-kind. Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/token-layer && node scripts/dups.mjs; grep -nE -- '--(text-5xl|text-base|container-4xl|tracking-tight|tracking-widest|leading-normal):' /Users/jose/workspace/emposo-new-website/weave-clone-ds/node_modules/tailwindcss/theme.css`
- **Names with an M3 flag (Appendix C M3 column):** 43 names in 44 rows (--display-size twice): 23 by name (17 type-role names + --breakpoint-compact + --state-disabled + 4 on- roles) and 20 comment-only; = §2's 19 token names + 4 on- roles (adjacent in §2) + 20 comment-flagged names (comment-only rows in §2). Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2 && awk -F'|' '/^\| [0-9]+ \|/ && $14 !~ /^ *- *$/ {print $3}' tokens.md | wc -l; awk -F'|' '/^\| [0-9]+ \|/ && $14 !~ /^ *- *$/ {print $3}' tokens.md | sort -u | wc -l; awk -F'|' '/^\| [0-9]+ \|/ && $14 !~ /^ *- *$/ {print $14}' tokens.md | sed -E 's/ main\.css:[0-9]+//' | sort | uniq -c  # -> 44, 43, and the flag reasons`
- **npm run contrast (8180):** PASS, exit 0, 18 components; breadcrumb on dark 7.59, light 19.43; identical to phase-2/contrast-8180.txt. Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && BASE=http://localhost:8180 npm run contrast > ../ds-migration-run/phase-2/verify-4/contrast.txt 2>&1; echo exit=$?`

## 5. Interactive component inventory

Scope: the 37 generated documents in pages.mjs: 36 sitemap routes plus 404.html, 23 of them case studies. The worktree also holds 2 tracked, unmanifested outputs, case-studies/fahrzeugfunktionen/ and case-studies/technische-dokumentation/. serve.json:5-14 301-redirects both and they are absent from dist/, so they are out of scope (a raw `find` of shipped HTML gives 39).

Authoring sources: partials/, pages/, sections/, content/render.mjs, js/, styles/, assemble.mjs.

Behaviour was checked in headless Chrome against the served worktree with `BASE=http://localhost:8180 node /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/interactive-probe.mjs` (exit 0; output in `interactive-probe.json`). It was re-checked independently with `verify-5-6-probe.mjs` (exit 0; output in `verify-5-6-probe.json`), both in E. Reduced motion is emulated unless a row says otherwise. "Probe" means those runs. The full slice report is E/audit-5-6-interactive-and-api.md.

Classification against the adapted target (CLAUDE.md:138-141: hand-built primitives on native elements and WAI-ARIA APG patterns, with Headless UI v2's data-\* contract): 11 of the 12 components below are hand-rolled on native elements; 0 are Material; 0 are already headless (no library and no data-\* state contract, 5.2). The twelfth, Lenis (5.2), is a vendored third-party library that fits none of the three classes: it is neither Material nor a headless primitive, and brief §2 names no headless replacement for smooth scrolling. The tally is in 5.2.

### 5.1 Inventory

Class. = classification: hand-rolled / Material / already headless, plus "vendored third-party library" for Lenis (5.2), which fits none of the three. "M3-derived" marks a hand-rolled component whose spec comments cite Material 3 (cross-reference for §2). RM = reduced motion. The global reduce rule is styles/00-base-remainder.css:52-61, which sets every transition and animation to 0.01ms.

| # | Component (routes) | Markup source | JS | ARIA today, closest APG pattern | Class. | Keyboard as implemented | Without JS | RM | State set today |
|---|---|---|---|---|---|---|---|---|---|
| 5.1 | Skip link (all 37) | partials/header.html:1; target `<main id="main" tabindex="-1">` assemble.mjs:187; CSS 07-header.css:12-24, 00-base-remainder.css:11-13 | js/00-core.js:64-71 (`__lenis.scrollTo('#main',{immediate:true})`) | Plain in-page link. APG: none (WCAG 2.4.1 technique) | hand-rolled, native `<a>` | First Tab stop. Enter focuses `main#main` (probe: first stop `a.skip-link`, then `main#main` with Lenis on) | Native jump and focus | Slide-in 180ms becomes 0.01ms | none (CSS `:focus`) |
| 5.2 | Lenis smooth scroll (all 37) | partials/head.html:17 loads vendored assets/vendor/lenis.min.js: v1.2.3 (the file contains "1.2.3"; js/00-core.js:36 says "lenis 1.2.3"), 14,348 B, not in package.json. CSS 00-base-remainder.css:39-47 | js/00-core.js:38-61 (lerp 0.1, wheelMultiplier 0.9, gestureOrientation vertical) | none. APG: none (WCAG 2.3.3) | vendored third-party library, outside the three classes (not Material, not headless, not hand-rolled; see the 5.2 tally) | Keyboard scrolling stays native; only the wheel is smoothed (syncTouch defaults to false in the vendor file). The vendored build supports `data-lenis-prevent` / `-wheel` / `-touch` and a `prevent` option; none is used (F5-1) | Native scroll | Not created under reduce (:38). Destroyed on a live switch to reduce (:55-60). Never re-created when the preference switches back | `html.lenis` always. `lenis-scrolling` and `lenis-smooth` only while a smooth scroll runs (vendor className getter; probe htmlClass "lenis" at rest). `window.__lenis` |
| 5.3 | Header scroll state (all 37) | partials/header.html:2 `data-site-header`; CSS 07-header.css:26-42 | js/01-header.js:40-44 (passive scroll listener, hard-coded `scrollY > 12`) | none (visual only). APG: none | hand-rolled | n/a | Never compacts; static header | Class still toggles; shadow and min-height change instantly (probe: `transition-duration` 0.18s, 1e-05s under reduce; `is-scrolled` set in both) | `.is-scrolled` |
| 5.4 | Desktop nav and header CTA (all 37, at 75rem and wider) | partials/header.html:5-11 (`max-nav:hidden`). `aria-current` is stamped at build time by stampNav, assemble.mjs:153-167 (`"true"` on the 23 case studies, pages.mjs:53, :107). CSS 07-header.css:46-73, 10-feedback.css:20-33 | none | `<nav aria-label="Hauptnavigation">` plus `aria-current`. APG: none needed (flat links, no submenus) | hand-rolled, native links | Tab through 4 links and the CTA; focus-visible = underline plus ring | Identical | Underline `scaleX` 320ms is instant | `aria-current="page"` or `"true"` (build time) |
| 5.5 | Mobile menu (all 37, below 75rem) | partials/header.html:12-21: `<details id="mobile-menu" class="nav:hidden">`, a summary with `aria-label`, and a second `<nav aria-label="Hauptnavigation">` repeating the link list. CSS 07-header.css:75-120, 10-feedback.css:34-38 | js/01-header.js:13-38 | Native details/summary (probe: AX role DisclosureTriangle, `expanded` false/true). No `aria-expanded` or `aria-controls` attribute (0). APG: Disclosure (Show/Hide), "Disclosure Navigation Menu" example | hand-rolled on native `<details>`. Its 75rem breakpoint is commented as "the M3 large boundary" (main.css:74) | Enter or Space toggles (native). Escape closes and refocuses the summary (:17-22). Tab past the last link closes it and focus moves on into main (focusout, :28-30). Outside click closes it (:31-33); so does a link click (:23-25) and crossing 75rem (:35-37, `matchMedia('(min-width: 75rem)')` copies --breakpoint-nav, main.css:74). No focus trap, by design (:26-27). All confirmed by the probe. With Lenis on, the wheel over an overflowing panel scrolls the page (F5-1) | Toggles natively. Escape and outside click do nothing. `aria-label` stays "Menü öffnen" while open (probe) | "+" rotate (07-header.css:94-95) is instant | `[open]`; summary `aria-label` toggles between "Menü öffnen" and "Menü schließen" (:15) |
| 5.6 | Expander disclosure (/about-us/ x6 management cards, labelled "Mehr lesen"/"Weniger anzeigen"; /karriere/ x2 jobs, labelled "Zur vollständigen Ausschreibung"/"Weniger anzeigen") | content/render.mjs:216 (management) and :114 (jobsList): two inline copies, no expander renderer. The jobs body also holds a mailto `.text-link` with sr-only text. CSS 11-components.css:114-122 | none | Native details/summary. The label swap is CSS `display` on `.expander__open` / `__close` (:121-122), plus an sr-only " – name". APG: Disclosure (Show/Hide) | hand-rolled on native `<details>` | Enter or Space (native); no Escape; focus stays on the summary (probe) | Fully works | "+" rotate 320ms is instant | `[open]` |
| 5.7 | Filter chip groups (/branchen/, /case-studies/, both via `content:projects-all`, pages/branchen.html:5, pages/case-studies.html:4). Per page: 2 groups, 16 chips, 0 disabled today, 23 cards | content/render.mjs:78-97 (chip :91, groups :92-95, bar, count and empty state :96). CSS 11-components.css:19-32, :154-158; 09-page-templates.css:194; 08-editorial.css:29-34, :91; 10-feedback.css:107, :139-140, :310-312 | js/06-work.js:9-94 | `<div role="group" aria-label>` of `<button aria-pressed>`; count `<p aria-live="polite">`. APG: toggle Button plus roving tabindex (the Toolbar technique). The semantics are single-select, so the closest APG pattern is Radio Group | hand-rolled. M3 "filter chip" naming (docs/components.md:171) and M3 38% disabled opacity (`--state-disabled`, main.css:228) | One Tab stop per group, on the selected chip, so the bar has 2 stops (:57-59). ArrowRight/Down go next, ArrowLeft/Up go back, with wrap (probe: ArrowRight at End lands on "Alle"; ArrowLeft on the first chip wraps to the last). Home and End work. Disabled chips are skipped (:64). Arrows only move focus; Space or Enter selects. Pressing the selected chip again keeps it pressed (probe), so the user can never un-press it. `tabIndex` follows the selection, not focus (:52). Consequence: after arrowing to an unselected chip, Shift+Tab lands on the same group's selected chip instead of leaving the bar (probe: automotive, Shift+Tab, industry "Alle") | Bar hidden (`.js-only`, 09-page-templates.css:194); all 23 cards and "23 Projekte" shown (probe) | 180ms colour transitions are instant | `.is-active`, `aria-pressed`, `tabIndex` 0/-1 (:50-52). `disabled` at build (render.mjs:91). `[hidden]` on cards (:24, which needs 10-feedback.css:107). `#project-count` text (:27). `#project-empty[hidden]` (:28). `.js-only` removed from the bar (:92-94). URL `?branche=` / `?leistung=` via replaceState (:33-42), restored on load (:82-88) |
| 5.8 | Contact form and validation (/ via sections/07b-sales-cta.html:2, /kontakt/ via pages/kontakt.html:10; both use `<!-- partial:contact-form -->`) | partials/contact-form.html:1; CSS 11-components.css:34-53; 08-editorial.css:37-61, :92-93; 10-feedback.css:155-157 | js/06-work.js:96-143 (inside the portfolio-filter file) | Each `<label>` wraps its control. `aria-describedby` points to a support span. `aria-invalid`. Hint `<p aria-live="polite" hidden>`. APG: no widget pattern (WAI Forms tutorial: validation and notifications). Headless UI v2 analogue: Field/Label/Description/Input/Select/Textarea | hand-rolled on a native form. M3-derived: "brand adaptation of the M3 filled field" (11-components.css:34-38: 56px box, indicator, "supporting text"); error colour `#ffb4ab` = "M3 error tone 80" (main.css:98); docs/components.md:227-228 | Native order: 5 fields, submit, Datenschutz link. An invalid submit focuses the first invalid field (:129-130; probe on / and /kontakt/: `input[name=name]`). Fields are re-checked live only once marked invalid (:122-125). No validation on blur (:98-101) | Native constraint validation with browser-language bubbles, then a native `action="mailto:…" method="post" enctype="text/plain"` submit (probe: `noValidate` false, `checkValidity()` false when empty). The error underline still shows via `:user-invalid` (11-components.css:47-48; probe: 2px, rgb(255,180,171)). With JS: `noValidate` (:121) and a `mailto:` URL with subject and body (:131-141) | Border transition is instant | After the first submit, `aria-invalid` "true"/"false" on every field, including the optional `company` (:117). Support span text (:118). `form.noValidate` |
| 5.9 | Intent preselect (/kontakt/; also loaded on /, pages.mjs:28, :92) | Hint `data-contact-hint` in partials/contact-form.html:1. The only consumer link is pages/barrierefreiheit.html:1 `href="/kontakt/?interesse=Anderes%20Anliegen"` | js/02-intent-links.js:8-36 (header comment :1-3 still cites the removed homepage career routes) | Hint `aria-live="polite"`. APG: none | hand-rolled | n/a (plain link) | Lands with nothing preselected | n/a | `select.value`; hint `hidden` and text (:19-23). Probe: `?interesse=Anderes%20Anliegen` preselects and shows the hint; an unknown value is ignored |
| 5.10 | Count-up (/ via sections/03-models.html:6, /about-us/ via pages/about-us.html:34; 4 values each) | content/render.mjs:50-58 (`.company-facts__value` span inside each `dt`, :57) | js/07-countup.js:11-65 (loaded pages.mjs:28, :65) | none (static dl/dt/dd). APG: none (WCAG 2.3.3) | hand-rolled | n/a | Final values are in the HTML (enforced by check-content.mjs:28-30) | Skipped if reduce matches when it triggers (:49), and without IntersectionObserver (:13). An animation already running is not stopped | The value span's textContent is rewritten every frame (:35; the JS variable is named `dt`), and the exact string is restored (:39). Duration is read via `getPropertyValue('--duration-countup')` (:27-29; ships as ".9s"; fallback 900 hard-coded). Probe, motion allowed: "1133", "141+", "1.631+", "2" at 250ms on /about-us/ ("924", "115+", "1.331+", "2" at 200ms on /), then "2014", "250+", "2.900+", "4". Reduced: final values at once |
| 5.11 | Legal-table scroll regions (/datenschutzerklaerung/ x24) | pages/datenschutzerklaerung.html:231, 288, 521, 607, 677, 711, 844, 904, 1030, 1172, 1310, 1336, 1421, 1451, 1549, 1679, 1798, 1924, 2065, 2362, 2394, 2414, 2560, 2621; CSS 10-feedback.css:240-244 | none | `role="region" aria-label="Tabelle n" tabindex="0"`. APG: none (landmark region; axe scrollable-region-focusable) | hand-rolled, native | Tab stop; arrow keys scroll (probe at 390px: overflows, `scrollLeft` 80 after 2x ArrowRight) | Same | n/a | static |
| 5.12 | Card links with an invert state, CSS only: reference cards (render.mjs:75; / x4, /branchen/ and /case-studies/ x23, 2 related on each case study) and expertise cards (pages/404.html:13-17 x5) | as listed; CSS 10-feedback.css:106-134, :251-252 | none | One link per card, decorative image; the inner "Case Study lesen" `.text-link` is a span. APG: none (link) | hand-rolled, native links | Tab. Focus-visible gets the same navy invert as hover (:130-134), plus the ring with `--focus-halo` (00-base-remainder.css:20-25) | Same | Invert is instant. Image zoom is gated by `(hover:hover) and (prefers-reduced-motion:no-preference)` (10-feedback.css:251-252) | none (`:hover`/`:focus-visible`; `[hidden]` from 5.7) |

The runtime in js/00-core.js:14-32 and :73-82 is in js/ but isn't a component. It defines `window.__mq` (the reduced-motion MediaQueryList) and the `window.__onReady` queue, which runs on DOMContentLoaded and wraps each callback in try/catch. Every section script bails without it: 01-header.js:5, 02-intent-links.js:6, 06-work.js:6, 07-countup.js:9 (`grep -n 'if (!window.__onReady) return;' js/*.js`).

The other CSS-only link states are native links with no JS: the text-link arrow slide (11-components.css:100-107), the breadcrumb (09-page-templates.css:46-50, 10-feedback.css:231-232), footer links (08-editorial.css:68-69) and the logo. Their transitions fall under the global reduce rule. The global focus ring is 00-base-remainder.css:20-29. No other behaviour exists: sources contain no video, iframe, dialog, popover, inert, target="_blank" or keyframes (`grep -rnoE '<(video|iframe|dialog)\b|\b(popover|inert|target="_blank")\b|@keyframes' styles content pages sections partials js`; the only hits are comments).

Contract coverage in the canon (judge recount, `grep -n "^### \|^#### \|^| Header/Menü" docs/components.md`, E/score-7-challenge/recounts.txt): 6 of the 12 behaviours have a contract block in docs/components.md (:171 filter-chip, :180 reference-card (cards only partly), :204 company-facts, :212 expander, :227 text-field, :279 legal-copy). The mobile menu, the main disclosure, has only the canon row at :72, and :234-238 still lists the removed state-layer primitive as active.

### 5.2 Tallies

| Measure | Value | Command |
|---|---|---|
| Components with behaviour | 12 (5.1-5.12) | table above |
| Classification of the 12 | hand-rolled 11 (5.1, 5.3-5.12); vendored third-party library 1 (5.2 Lenis 1.2.3, assets/vendor/lenis.min.js, loaded at partials/head.html:17); Material 0; already headless 0 | Class. column above; `grep -o 'lenisVersion="[^"]*"' assets/vendor/lenis.min.js` gives `lenisVersion="1.2.3"` |
| Material components (MDC, material-web, @mui) | 0 | `grep -rniE '@material\|@mui\|material-web\|material-components\|material-symbols\|mdc-' styles content pages sections partials js assemble.mjs pages.mjs package.json \| wc -l` gives 0 |
| M3 lineage in interactive specs (comments and docs, cross-ref §2) | 6 source comments: 11-components.css:35 (text field); main.css:67 (--breakpoint-compact, used by the chip at 11-components.css:32), :74 (--breakpoint-nav, mirrored in 01-header.js:11), :98 (form error colour), :180, :229 (target size). Plus docs/components.md:228 | `grep -rniE '\bM3\b' styles content js partials` |
| Already headless (a library, or Headless UI's data-\* state contract) | 0 | `grep -rnE 'data-(open\|closed\|focus\|active\|hover\|selected\|disabled\|checked\|state\|headlessui)' styles content pages sections partials js assemble.mjs pages.mjs \| wc -l` gives 0. Cross-check: `grep -rhoE 'data-[a-z][a-z-]*' … \| sort \| uniq -c` lists 11 names, all site hooks |
| `aria-expanded` / `aria-controls` / `aria-haspopup` anywhere | 0 | `grep -rhoE 'aria-[a-z]+' styles content pages sections partials js assemble.mjs pages.mjs \| sort \| uniq -c` gives only current, describedby, hidden, invalid, label, labelledby, live, pressed |
| `aria-pressed` | 2 sites: render.mjs:91, 06-work.js:51 | `grep -rnoE 'aria-pressed' styles content pages sections partials js assemble.mjs pages.mjs` |
| Native `<details>` in sources | 3 templates: header.html:12 (menu), render.mjs:114 and :216 (expander). Rendered: 1 menu per page, plus 6 on /about-us/ and 2 on /karriere/ | `grep -rnoE '<details[^>]*>' styles content pages sections partials js`; the shipped HTML gives 35 pages with 1, about-us 7, karriere 3 |
| Filter chips / groups / disabled / cards (per page, on each of 2 routes) | 16 / 2 / 0 / 23 | `grep -o '<button class="filter-button' branchen/index.html \| wc -l`, and the same on case-studies/index.html |
| tabindex in sources | assemble.mjs:187 (`main`, -1); 06-work.js:52, :59 (roving); 24x `tabindex="0"` in datenschutzerklaerung.html | `grep -rnoiE 'tabindex="[^"]*"\|tabIndex' styles content pages sections partials js assemble.mjs pages.mjs` |
| `aria-live` | render.mjs:96 (count), contact-form.html:1 (hint) | `grep -rnoE 'aria-live="[^"]*"' …` |
| `data-lenis-prevent` in sources | 0 (the vendored Lenis supports it) | `grep -rn 'lenis-prevent' styles content pages sections partials js` gives nothing; `grep -oE 'lenis-prevent[a-z-]*' assets/vendor/lenis.min.js` gives 3 variants |
| `[data-contact-interest]` markup consumers | 0 (the only 2 hits are js/02-intent-links.js:31, :33) | `grep -rnE 'data-contact-interest' styles content pages sections partials` gives nothing; probe: 0 on /, /kontakt/, /barrierefreiheit/ |

### 5.3 Script loading per route

The per-route counts come from `node -e "import('./pages.mjs').then(m=>{const by={};for(const x of m.default){const k=x.scripts.join(',');by[k]=(by[k]||0)+1}console.log(by)})"`:

- 32 routes load core and header only.
- 2 add work.
- 1 adds countup.
- / loads all five.
- /kontakt/ loads core, header, intent-links and work.

Counting `<script src="/js/…">` in the shipped HTML confirms this. It gives 34 core-and-header routes, because it includes the 2 orphan case-study pages.

| Script | Loaded on (pages.mjs) | Does work on | Inert on |
|---|---|---|---|
| assets/vendor/lenis.min.js | all 37 (partials/head.html:17) | all (unless reduce) | - |
| js/00-core.js | all 37 | all | - |
| js/01-header.js | all 37 | all | - |
| js/02-intent-links.js | / (:28), /kontakt/ (:92) | /kontakt/?interesse= | the click path (:31-35) everywhere; / has no inbound `?interesse=` link |
| js/06-work.js | / (:28), /case-studies/ (:46), /branchen/ (:74), /kontakt/ (:92) | chips on /branchen/ and /case-studies/; form on / and /kontakt/ | the chip half on / and /kontakt/; the form half on /branchen/ and /case-studies/ |
| js/07-countup.js | / (:28), /about-us/ (:65) | both | - |

### 5.4 State-layer leftovers on interactive components (B-51)

All B-51 leftovers, with each probe's denominator, are listed once in §2, "State-layer leftovers (B-51), all slices". For the interactive components the relevant ones are the 14-host `:is()` rule at styles/11-components.css:15-17 (13 of its hosts get their resting `position: relative` only from it, F5-11), `--state-disabled` on the filter chip (main.css:228, read at 11-components.css:28), and the dormant `::before` branch in tools/visual/contrast.mjs:46-48. `html { -webkit-tap-highlight-color: transparent; }` (main.css:252-254, added in 199f82f) is a B-51 companion, not a leftover.

### 5.5 Findings

| # | Finding | Evidence | Risk |
|---|---|---|---|
| F5-1 | With Lenis on, the mouse wheel over the open, overflowing mobile-menu panel scrolls the page instead of the panel | Probe at 1000x300: panel scrollHeight 283 > clientHeight 194. Wheel deltaY 120 with Lenis: `panel.scrollTop` 0, `scrollY` 108. Reduce (no Lenis): 89 / 0. Reproduced by verify-5-6-probe. At 390x420 the panel doesn't overflow (283/283). 07-header.css:101-102 `overflow-y:auto`. No `data-lenis-prevent` in sources, although the vendored 1.2.3 supports it | Menu links below the fold can't be reached by wheel on short or zoomed desktop windows |
| F5-2 | The expander's CSS "+" glyph is part of the summary's accessible name | Probe AX names end in " +" on every expander: the management toggles ("Mehr lesen – ‹name› +", /about-us/, labels from content/render.mjs:216) and the job toggles ("Zur vollständigen Ausschreibung – ‹job title› +", /karriere/, content/render.mjs:114). 11-components.css:119 `content: '+'` has no empty alt text; the menu uses an `aria-hidden` span instead (header.html:13) | Screen readers announce "plus" on 8 toggles |
| F5-3 | Form error text is inside the `<label>`, so it becomes part of the field's accessible name as well as its description. Errors aren't live | Probe AX, name field: name "Ihr Name Bitte geben Sie Ihren Namen an.", description the same message. The select and the email field behave the same way. Support spans have no `aria-live`; contact-form.html:1 | The name changes with validation state, and errors on non-focused fields are silent |
| F5-4 | The filter chips are single-select but exposed as toggle buttons (`aria-pressed`) that the user can't un-press | Probe: pressing the selected chip leaves it `pressed=true`. 06-work.js:44-55 un-presses siblings | Moving to radiogroup/radio (Headless RadioGroup analogue) changes roles and states that smoke.mjs:185, :194 (`aria-pressed`) and contrast.mjs:15-16 (`.is-active`) select on |
| F5-5 | Count-up writes intermediate numbers into the real text node | Probe: "1133" for 2014 at 250ms (/about-us/), "924" at 200ms (/); 07-countup.js:35 | Assistive tech, or a copy during the 900ms, reads wrong figures |
| F5-6 | Dead code: the `[data-contact-interest]` click path | 02-intent-links.js:31-35; 0 consumers (5.2). The last markup consumer, sections/07ab-career.html:5 (`git grep -n data-contact-interest f5c88e8 -- sections`), was removed in 275a42c (`git log -S'data-contact-interest' -- sections pages partials content`). The file comment :1-3 still describes it | Deleting it needs bundle-analyst's proof |
| F5-7 | Two unrelated components share js/06-work.js, and each half is inert on half its routes | 06-work.js:9-94 chips, :96-143 form; 5.3 | An interactive refactor of one family touches the other's file and routes |
| F5-8 | JS holds copies of CSS tokens and magic numbers | 01-header.js:11 `75rem` (mirrors main.css:74); 01-header.js:41 `12`; 07-countup.js:29 fallback `900` (main.css:224); 00-core.js:39-43 Lenis params (comment at main.css:222-223) | Token renames or merges (e.g. --breakpoint-nav) silently desync the menu-close breakpoint |
| F5-9 | check:copy gates 10 of the JS UI strings, keyed per file. It doesn't gate the rest | tools/check-copy.mjs:45-47 keeps only single-quoted literals that still contain a space after trimming (:18) and an uppercase letter. Gated (tools/copy-baseline.json `js`): 01-header.js:15 "Menü schließen", "Menü öffnen"; 02-intent-links.js:21 (2 fragments); 06-work.js:103-106 (5 messages), :141 "Emposo Anfrage:". Ungated: 06-work.js:27 " Projekt"/" Projekte", and :133-138 the mailto body labels "Name:", "Unternehmen:", "E-Mail:", "Interesse:", "Nachricht:". Comparison is per file (:69) | Gated strings fail if moved to another file (e.g. splitting 06-work.js, F5-7) even when byte-identical. The ungated strings can change without the gate noticing |
| F5-10 | Without JS, the menu's `aria-label` stays "Menü öffnen" while it is open | Probe (JS off): open=true, label "Menü öffnen". header.html:13 static label | Minor mismatch (the expanded state is still exposed natively) |
| F5-11 | The B-51 `:is()` list (14 hosts) is the only resting source of `position: relative` for 13 of them, and the only `isolation` in the codebase | 11-components.css:15-17. CSSOM deletion test (verify-5-6-probe.json `isRule`, 7 route/width combos): 13 hosts go from relative/isolate to static/auto. Only `.site-nav > a` keeps relative (10-feedback.css:20); `.reference-card__copy` and `a.expertise-card` set a position only on hover/focus (:125, :130). 0 isolation rules remain after deletion | Removing it isn't provably inert; it needs visual:diff 0 and focus-ring shots |
| F5-12 | Keyboard coverage in the gates is thin, and no interaction gate runs with Lenis | Asserted: the Tab walk on 7 routes x 2 widths (reachability, visible outline, no stuck focus; smoke.mjs:119-137), Escape closes the menu (:170-171), the first Tab stop is the skip link (:174-178). Not asserted: arrow/Home/End roving, focus return after Escape, focusout and outside-click close, the 75rem close, the aria-label toggle (read at :168, never checked at :169). The form flow (:209-218) never submits, so German messages, `aria-invalid` and first-invalid focus are untested. Every flow and the Tab walk run with `motion: 'reduce'` (:122, :221), as does contrast.mjs:64, so Lenis is never instantiated in them. `opts.open` sets `.open` directly (contrast.mjs:67), and smoke reads `.open` (smoke.mjs:168-171, :207) | Replacing `<details>` with button plus `aria-expanded` breaks those harness selectors, and keyboard or Lenis regressions (e.g. F5-1) pass CI. interactive-probe.mjs and verify-5-6-probe.mjs (E) are ready baselines |
| F5-13 | The chip group's tabIndex follows the selection, not focus, so Shift+Tab from an arrowed-to chip stays inside the bar | Probe on both routes: ArrowRight x2 lands on "automotive" (tabIndex -1). Shift+Tab then lands on "Alle" (pressed, tabIndex 0) in the same group, while Tab goes to the next group's selected chip. 06-work.js:52, :59, :68 | The APG roving-tabindex contract (tabindex moves with focus) isn't met, so an extra reverse stop appears. A Radio Group rewrite changes this on purpose, so the baseline must record it |
| F5-14 | Dead or stale interactive code and comments beyond B-51 | stampNav's `{{CUR:}}` (0 consumers) and `navGroup` (0 pages) branch, assemble.mjs:156-157, :160-161, :164; "megamenu" in README.md:43, :80 and assemble.mjs:156; `data-project-grid` (render.mjs:75) with no consumer in js/, styles/ or tools/; 02-intent-links.js:1-3; 10-feedback.css:205-207 (describes a removed hover/focus overlay on management cards, contradicted by :213-214) | Refactorers may preserve or re-create behaviour that no longer exists; deletions need bundle-analyst's proof |

## 6. Component API

The component layer is build-time only: content/render.mjs, plus the expansion helpers in assemble.mjs. Counts:

- `grep -cE '^(export )?function ' content/render.mjs` gives 16 top-level function renderers. With the `column` arrow function (render.mjs:62), `grep -cE '^(export )?function |^const column = ' content/render.mjs` gives the 17 render.mjs renderers that 6.2 counts. `escape` (:5) and `arrow` (:6) in 6.1 are a helper and a constant, and `chip` (:91) and `cell` (:103) are inner functions of `filters` and `disciplineGrid`. With the 4 assemble.mjs helpers of 6.1 (icon :114, brand :126, the partial include :141, stampNav :153-167) the denominator is 21.
- `grep -cE '^export (function|const)' content/render.mjs` gives 10 exported symbols. `node -e "import('./content/render.mjs').then(m=>console.log(Object.keys(m).length))"` also gives 10.
- `grep -rnE 'class-variance-authority|tailwind-merge|\bcva\(|\bcn\(' content assemble.mjs package.json js tools | wc -l` gives 0: no cva, no cn. None of the packages is in package.json or node_modules.

### 6.1 Renderers

| Renderer (file:line) | Signature | Renders | Consumers | className | Attr passthrough | Variants | Parts / slots |
|---|---|---|---|---|---|---|---|
| `escape` render.mjs:5 | `(value)` | HTML-escaped string | everywhere | - | - | - | - |
| `arrow` render.mjs:6 | const | `<span aria-hidden="true">→</span>` | `${arrow}` x4 (render.mjs:75, 153, 154, 216); the literal is re-typed at :114, :130, :227 | - | - | - | - |
| `picture` render.mjs:10 | `(key, sizes='(max-width: 700px) 100vw, 50vw', priority=false, decorative=false)` | `<picture>` with AVIF and WebP `<source>` plus `<img>` (width/height and alt from the manifest) | `{{image:…}}` (assemble.mjs:145), industryCards, projectCards, projectPage, management | no | no | positional booleans: `priority` (fetchpriority vs lazy), `decorative` (alt="") | none |
| `breadcrumb` render.mjs:19 | `(label, parent)` | `nav.page-breadcrumb > ol > li` | pageHero; `<page-crumb label>` (assemble.mjs:138, imported as `breadcrumbMarkup`, :22) on 7 pages | no | no | with or without parent/label | none |
| `pageHero` render.mjs:27 | `({ id, crumb, parent, modifier, figureClass, copy, figure })` | `section.page-hero > .gutter > .container > .page-hero__grid` (copy plus breadcrumb, optional figure) | `<page-hero>` in 6 pages (404, about-us, branchen, case-studies, karriere, portfolio) via assemble.mjs:132-137; projectPage (23 routes) | partial: `modifier` goes onto the section class, `figureClass` onto the figure; the only class-like inputs in the layer | no. `id` becomes aria-labelledby only; other `<page-hero>` attributes are dropped (assemble.mjs:131-136) | `modifier` string (one use: `portfolio-hero`, portfolio.html:1); `figure-class` one use (`about-hero__visual`, about-us.html:1); figure or none | slots `copy` and `figure` as raw HTML strings, not parts |
| `trustStrip` render.mjs:34 (data `certifications` :33) | `()` | `div.trust-strip > span` x3 | `content:trust-strip` (sections/03-models.html:7, pages/portfolio.html:66) | no | no | none | none |
| `industryCards` render.mjs:38 | `()` | `div.industry-cards > div.industry-tile` x N | `content:industry-cards` (sections/05-industries.html:4, pages/branchen.html:4) | no | no | none | none |
| `companyFacts` render.mjs:56 (data :50) | `()` | `dl.company-facts` | `content:company-facts` (sections/03-models.html:6, pages/about-us.html:34) | no | no | none | none |
| `column` render.mjs:62 | `(value)` | `<p>` or `ul.result-list`, by data shape | projectPage | no | no | data-shape | none |
| `metric` render.mjs:66 | `(project)` | `div.result-metric` (adds `__word` when the metric is longer than 8) | projectCards only. projectPage re-implements it inline as `.page-hero__metric` / `--word` (:152) | no | no | data-driven class | none |
| `projectCards` render.mjs:69 | `(selection=projects, filterable=false, collage=false)` | `div.reference-grid > a.reference-card` x N (inner `span.text-link`) | `fragment('projects-featured')` (collage), filters (filterable), projectPage (related) | no | `filterable` adds `data-project-grid` (no consumer) and `data-project` / `data-industry` / `data-discipline` (a fixed set) | 2 positional booleans | none (card markup inline) |
| `filters` render.mjs:78 (inner `chip` :91) | `()`; `chip(group, [key, name])` | filter bar, count, filterable grid, empty state | `content:projects-all` (pages/branchen.html:5, pages/case-studies.html:4) | no | no | chip: `key==='all'` gives `.is-active`/`aria-pressed`; `empty()` gives `disabled` | none. Industry choices are hard-coded (:93: 6 slugs including `automotive`, with their own labels), not taken from site-data `industries` (5 entries, other slugs); disciplines come from the data (:94) |
| `disciplineGrid` render.mjs:99 (inner `cell` :103) | `()` | `div.discipline-table` of `h3` plus `article.discipline-cell` | `content:disciplines` (pages/portfolio.html:7) | no | no | none | none |
| `jobsList` render.mjs:110 | `()` | `div.job-list > article.job-card` with an inline `details.expander`, plus `p.job-list__apply` | `content:jobs` (pages/karriere.html:19) | no | no | none | none (the expander is inlined, a duplicate of :216 with other labels) |
| `cta` render.mjs:125 (table `ctas` :119) | `(name='default')` | `section.page-section--deep > … > .page-cta` | `content:cta-case-studies` / `-portfolio` / `-karriere`, and projectPage's default (23 routes) | no | no | content-key table (4 entries) | data fields (eyebrow, title, copy, link, id), not parts |
| `projectPage` render.mjs:134 | `(slug)` | the whole case-study main: pageHero, Projekt section, Weitere Projekte, cta | assemble.mjs:149 `project:<slug>` (23 routes) | no | no | optional `facts` | none. Builds 2 page-section frames, the case-facets trio and a hero metric inline (:152-154) |
| `management` render.mjs:158 | `()` | `section#management` with `article.management-card` (plus an inline `details.expander`) | `content:management` (pages/about-us.html:38) | no | no | none | none. Roles and bios are inline data in the renderer (:161-188), not in site-data.mjs |
| `keepExploring` render.mjs:226 (data :225) | `()` | `section.explore` | `content:keep-exploring` (pages/karriere.html:23, pages/kontakt.html:15) | no | no | none | none |
| `fragment` render.mjs:230 | `(name)` | dispatcher, 13 cases, all consumed | `<!-- content:… -->` via assemble.mjs:142 | - | - | name | the `sitemap` case (:244) is inline markup in the switch |
| `icon` assemble.mjs:114 | `(name)` | Hays Glow SVG with `aria-hidden`, `focusable=false`, `currentColor` | `{{icon:…}}`: sections/04-about.html:7, 8, 10, 11; pages/portfolio.html:66 x3; render.mjs:57, 103, 153 x3 | no (the caller's wrapper span carries the class) | no | none | none |
| `brand` assemble.mjs:126 | `(name)` | logo SVG, `<style>` stripped | `{{brand:…}}`: partials/header.html:4, partials/footer.html:1 | no | no | none | none |
| partial include assemble.mjs:141 | `<!-- partial:name -->` | a partials/\*.html file verbatim | contact-form x2 (sections/07b-sales-cta.html:2, pages/kontakt.html:10) | no | no | none | none |
| `stampNav` assemble.mjs:153-167 | `{{CUR:key:…}}`, `{{CURATTR:key}}` | `aria-current` on nav links | 12 `{{CURATTR:}}` tokens in partials/header.html:6-19. `{{CUR:}}` has 0 consumers and `navGroup` 0 pages, so :156-157, :160-161 and :164 are dead megamenu-era code | - | - | `navExact` (live); `navGroup` (dead) | - |

### 6.2 API tallies (criterion 5)

| Measure | Value | Command or source |
|---|---|---|
| Renderers accepting className | 1 (`pageHero`: `modifier`, `figureClass`) of the 17 render.mjs renderers (16 top-level functions + `column`); 1 of 21 with the 4 assemble.mjs helpers | 6.1 |
| Renderers with attribute passthrough | 0 of 21 | 6.1 (the only extra attributes are `projectCards`' fixed `data-*` set) |
| cva variants / cn (tailwind-merge) | 0 / 0 | grep above gives 0; package.json has no such dependency |
| Composable parts (X.Root, X.Header …) | 0; slots only as HTML strings (pageHero `copy`/`figure`) | 6.1 |
| Variant mechanisms in use | positional booleans (picture, projectCards), content-key tables (cta, fragment), data-shape (column, metric) | 6.1 |
| Renderer-only patterns enforced by a gate | 4: page-hero, breadcrumb, page-cta, trust-strip (tools/check-content.mjs:57-63; pages/ and sections/ only) | source |
| Documented as renderer-only but not gated | company-facts (docs/components.md:71 "Markup nie von Hand schreiben"; check-content.mjs:28-30 checks only its values). Its contract at components.md:205 still lists karriere as a consumer, which :71 contradicts | source |
| Dead API surface | stampNav `{{CUR:}}` / `navGroup`; `data-project-grid` | `grep -rn '{{CUR:' partials pages sections content` and `grep -rn navGroup pages.mjs content` give 0 |

### 6.3 Hand-written repeated patterns with no renderer

All counts come from `node /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/component-patterns.mjs` (output `component-patterns.json` next to it). The script scans pages/, sections/, partials/ and content/render.mjs line by line; "x N" means N instances on one line. The key totals reproduce with alternative regexes over the concatenated sources: 31 frames (26 + 5), 35 gutter/container pairs, 33 eyebrows, 37 display headings (15 h1, 22 h2), 8 arrow literals and 4 `${arrow}`, 15 numbered labels.

| Pattern | Count | Instances (file:line) | Note |
|---|---|---|---|
| page-section frame `<section class="…page-section…">` | 31 (26 hand-written, 5 inline in render.mjs) | pages/404.html:7; pages/about-us.html:7, 15, 28; pages/barrierefreiheit.html:1; pages/branchen.html:4, 5; pages/case-studies.html:4; pages/cookies.html:1; pages/datenschutzerklaerung.html:1; pages/impressum.html:1; pages/karriere.html:7, 15; pages/kontakt.html:1; pages/nutzungsbestimmungen.html:1; pages/portfolio.html:7, 8, 47, 66; pages/sitemap.html:1; sections/02b-expertise.html:1; sections/03-models.html:1; sections/04-about.html:1; sections/05-industries.html:1; sections/06-work.html:1; sections/07b-sales-cta.html:1; render.mjs:131, 153, 154, 219, 227 | docs/components.md:251-257 documents it as a shared frame with variant props (paper/dark/deep, id, aria-labelledby), but no renderer exists |
| `.gutter > .container` wrapper | 35 | the 31 frames above, plus sections/02-hero.html:2, partials/header.html:3, partials/footer.html:1, render.mjs:28 | the inner half of every frame |
| Section heading: eyebrow plus display-large | eyebrow 33, display-large h1/h2 37 | eyebrow: pages/404.html:2, 10; about-us.html:2, 9, 17, 31; branchen.html:2, 4, 5; case-studies.html:2, 4; karriere.html:2, 17; kontakt.html:6; portfolio.html:2, 7, 12, 51, 66; sitemap.html:1; sections/02b-expertise.html:3; 03-models.html:3; 04-about.html:3; 05-industries.html:3; 06-work.html:3; 07b-sales-cta.html:2; partials/footer.html:1 (x3); render.mjs:131, 152, 154, 219 | the `--light` pair is hand-matched to the section ground each time |
| `.page-section__top` heading row (with `@max-content:grid-cols-1`) | 4 | pages/404.html:9; pages/about-us.html:30; pages/portfolio.html:10, 49 | plus `.page-section__lede` x3: about-us.html:32, portfolio.html:15, 54 |
| `.section-lede` | 8 | pages/about-us.html:11; branchen.html:5; karriere.html:9; portfolio.html:7, 66; sections/03-models.html:5; 05-industries.html:3; render.mjs:153 | |
| `.section-more` row | 4 | sections/02b-expertise.html:9; sections/06-work.html:5; render.mjs:153, 154 | |
| Text link with an arrow span | 10 `.text-link` sites (9 `<a>`, 1 `<span>`); arrow literal 8 vs `${arrow}` 4 | `<a>` hand-written: pages/barrierefreiheit.html:1, pages/cookies.html:1, sections/06-work.html:5. `<a>` inline in render.mjs:114, 130, 153, 154, 216, 227. `<span class="text-link">` in every reference card: render.mjs:75. Arrow literal: barrierefreiheit.html:1, cookies.html:1, 06-work.html:5, footer.html:1, render.mjs:6, 114, 130, 227 | no textLink renderer; render.mjs bypasses its own `arrow` const 3 times |
| Pill CTA with arrow circle (`.header-contact` / `.mobile-menu__cta` plus `.header-contact__arrow`) | 3 | partials/header.html:11, 19; partials/contact-form.html:1 (submit) | one CSS rule pair (10-feedback.css:26-33) serves `<a>` and `<button>` |
| Result metric (strong value plus label, `--word` class when longer than 8) | 2 implementations | render.mjs:66-67 `metric()` (`.result-metric`); render.mjs:152 inline in projectPage (`.page-hero__metric`) | the same logic copied, not reused |
| `.company-values` box trio | 4 grids; `__icon` x6 | pages/about-us.html:19 (3 articles, :20-22); pages/portfolio.html:7 (`--paper --2`, 2 articles); pages/portfolio.html:66 (3 with icons); render.mjs:153 (case-facets) | 3 hand-written, 1 rendered |
| `.expertise-card` link | 5 | pages/404.html:13, 14, 15, 16, 17 | |
| `.portfolio-mode` article | 4 | pages/portfolio.html:19, 25, 31, 37 | each repeats `@max-content:grid-cols-1` plus 2x `@max-content:col-auto` (portfolio.html:22-41) |
| `.fact-grid` step article | 5 | pages/portfolio.html:57, 58, 59, 60, 61 | |
| `.connection-step` row | 4 | sections/04-about.html:7, 8, 10, 11 | |
| `.expertise-pair` item | 2 | sections/02b-expertise.html:5, 7 | |
| Numbered label ("01" …) | 15 (14 hand-written) | pages/404.html:13-17 (`expertise-card__number`); pages/portfolio.html:20, 26, 32, 38 (`portfolio-mode__number`); pages/portfolio.html:57-61 (`fact-grid__label--display`); render.mjs:42 (`industry-tile__number`) | one visual pattern, 4 class names |
| legal-copy page frame (section, `.container.legal-copy`, `<page-crumb>`, h1) | 5 | pages/barrierefreiheit.html:1, cookies.html:1, datenschutzerklaerung.html:1, impressum.html:1, nutzungsbestimmungen.html:1 | pages/sitemap.html:1 uses the same frame without `.legal-copy` |
| legal-table scroll region | 24 | pages/datenschutzerklaerung.html:231 … 2621 (listed in 5.1) | the region label "Tabelle n" is copy |
| Contact section (`.contact__grid`, eyebrow--light, display-large--light, `.contact__note`, form partial) | 2 | sections/07b-sales-cta.html:2; pages/kontakt.html:4-10 | same block, H2 vs H1 |
| Route link lists | 5 nav lists: header x2, footer, EXPLORE, sitemap. The 404 expertise cards are a sixth list of the same routes | partials/header.html:6-9 and :15-18; partials/footer.html:1; render.mjs:225 (EXPLORE, a data array); render.mjs:244 (sitemap); pages/404.html:13-17 | 5 `<a href="/portfolio/">` counted: header.html:6, :15, footer.html:1, render.mjs:244, 404.html:14 (EXPLORE has no `<a` literal) |
| Footer link utility string `inline-flex min-h-11 items-center` | 12 | partials/footer.html:1 (x12) | |
| `details.expander` markup | 2 | render.mjs:114, 216 | inline in two renderers with different open labels; no expander renderer |
| `@max-content:grid-cols-1` / `@max-content:col-auto` | 10 / 8 | grid-cols-1: pages/404.html:9; about-us.html:30; portfolio.html:10, 19, 25, 31, 37, 49; render.mjs:28, 131. col-auto: portfolio.html:22, 23, 28, 29, 34, 35, 40, 41 | the layout variant is repeated per instance, not owned by a component |
| `<em class="text-ink">` | 2 | pages/404.html:10; pages/about-us.html:31 | |
| Homepage hero | 1 | sections/02-hero.html:1-11 | a second hero implementation outside pageHero; check-content.mjs:59 matches only `class="page-hero` |

### 6.4 Findings

| # | Finding | Evidence | Risk |
|---|---|---|---|
| F6-1 | Only pageHero takes class input, nothing takes attribute passthrough, and there are no parts, cva or cn | 6.2 | Criterion 5 starts near 0; every renderer's signature changes, and every consumer with it |
| F6-2 | The page-section frame (31) and section heading (33/37) have no renderer, yet they are the most repeated markup | 6.3 | The widest diff of the leaf steps; a frame renderer touches every route |
| F6-3 | The expander, the text link and the result metric are inlined in several renderers | render.mjs:114, 216 (expander, with different labels); :114, 130, 227 (arrow literal); :75 (span text-link); :66-67 vs :152 (metric) | A component fix must be made in 2-4 places |
| F6-4 | The same numbered-label pattern has 4 class names; the pill CTA serves `<a>` and `<button>` from one rule | 6.3 | Variant consolidation risks visual:diff transitions if the four aren't pixel-identical |
| F6-5 | Renderer-only rules are gated for 4 patterns but not for company-facts, expander, chip or reference card | check-content.mjs:57-63; components.md:71 | Hand-written forks can re-enter unnoticed |
| F6-6 | Content lives inside renderers: certifications, Kennzahlen, the filter's industry vocabulary, CTA copy table, fixed case-study and management headings, management bios, EXPLORE and the sitemap list | render.mjs:33, :50-55, :93-94, :119-124, :152-154, :161-188, :219, :225, :244. The industry chips (:93) use 6 slugs of their own, next to site-data `industries` (5, other slugs) | Moving it touches copy-gated strings, which must stay byte-identical (check:copy); the duplicated industry taxonomy can drift from site-data |
| F6-7 | Dead or drifted API surface | stampNav `{{CUR:}}` / `navGroup` (0 uses, assemble.mjs:156-164); `data-project-grid` (render.mjs:75, 0 consumers); docs/components.md:205 lists karriere as a company-facts consumer | Refactors may carry dead parameters into the new renderer signatures |

### Key counts for §5 and §6

Each entry: what was counted, the verified value, and the command that reproduces it (run in the worktree unless the command changes directory).

- **Generated documents in pages.mjs (routes):** 37 (36 sitemap URLs + 404.html; 23 case studies). On disk: 39 HTML outputs, because 2 tracked orphans are 301'd and absent from dist/. Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && node -e "import('./pages.mjs').then(m=>console.log(m.default.length))" && grep -c '<loc>' sitemap.xml && find . -name '*.html' -not -path './dist/*' -not -path './node_modules/*' -not -path './pages/*' -not -path './partials/*' -not -path './sections/*' -not -path './audit-evidence/*' -not -path './docs/*' | wc -l`
- **Material components/packages in authoring sources:** 0 packages. 6 M3 comments in styles (11-components.css:35; main.css:67, 74, 98, 180, 229); the other hits are German legal prose "Material". Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && grep -rniE 'material|\bmdc\b|\bM3\b|ripple' styles content pages sections partials js assemble.mjs pages.mjs package.json`
- **Headless UI data-\* state contract attributes:** 0 (11 data-\* names in sources, all site hooks). Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && grep -rhoE 'data-[a-z][a-z-]*' styles content pages sections partials js assemble.mjs pages.mjs | sort | uniq -c`
- **aria-expanded / aria-controls / aria-haspopup:** 0 (the aria-\* names present: current, describedby, hidden, invalid, label, labelledby, live, pressed). Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && grep -rhoE 'aria-[a-z]+' styles content pages sections partials js assemble.mjs pages.mjs | sort | uniq -c`
- **aria-pressed sites:** 2 (content/render.mjs:91, js/06-work.js:51). Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && grep -rhoE 'aria-[a-z]+' styles content pages sections partials js assemble.mjs pages.mjs | sort | uniq -c | grep pressed`
- **Expanders rendered (management / jobs):** 6 / 2 (shipped HTML: about-us 7 details incl. menu, karriere 3, the other 35 pages 1). Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && grep -o '<details class="expander"' about-us/index.html | wc -l && grep -o '<details class="expander"' karriere/index.html | wc -l`
- **Filter chips / groups / disabled / filterable cards (per page, on /branchen/ and /case-studies/ each):** 16 / 2 / 0 / 23. Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && for f in branchen/index.html case-studies/index.html; do echo $f $(grep -o '<button class="filter-button' $f | wc -l) $(grep -o 'role="group"' $f | wc -l) $(grep -oE '<button class="filter-button[^>]*disabled' $f | wc -l) $(grep -o 'data-project ' $f | wc -l); done`
- **Legal-table scroll regions (role=region tabindex=0):** 24. Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && grep -o 'role="region"' datenschutzerklaerung/index.html | wc -l`
- **data-lenis-prevent in sources / support in vendored Lenis:** 0 in sources; the vendor file handles lenis-prevent, lenis-prevent-wheel, lenis-prevent-touch. Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && grep -rn 'lenis-prevent' styles content pages sections partials js | wc -l; grep -oE 'lenis-prevent[a-z-]*' assets/vendor/lenis.min.js | sort -u`
- **\[data-contact-interest] markup consumers:** 0 (the only 2 hits are js/02-intent-links.js:31, :33). Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && grep -rnE 'data-contact-interest' styles content pages sections partials js`
- **?interesse= links:** 1 in sources (pages/barrierefreiheit.html:1), 1 shipped page (barrierefreiheit/index.html). Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && grep -rnoE 'interesse=[^"]*' pages sections partials content; grep -rlE 'interesse=' --include=index.html . | grep -v -e node_modules -e dist`
- **Routes per script set:** 32 core+header; 2 +06-work; 1 +07-countup; / all five; /kontakt/ +02-intent-links +06-work. Shipped HTML shows 34 core+header, including the 2 orphans. Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && for f in $(find . -name index.html -not -path './dist/*' -not -path './node_modules/*' -not -path './audit-evidence/*') ./404.html; do grep -oE 'src="/js/[0-9a-z-]+\.js"' $f | sed -E 's/.*js\/([^.]*)\.js"/\1/' | paste -sd, -; done | sort | uniq -c`
- **Lenis wheel over the open mobile-menu panel:** 1000x300: Lenis on panel.scrollTop 0, scrollY 108; reduce 89 / 0. 390x420: panel doesn't overflow (283/283). Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2 && BASE=http://localhost:8180 node verify-5-6-probe.mjs > verify-5-6-probe.json && node -e "console.log(JSON.stringify(require('./verify-5-6-probe.json').lenisPanelWheel))"`
- **Filter chip Shift+Tab after arrowing:** Lands on the same group's selected chip (industry=all), on both routes. Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2 && node -e "const j=require('./verify-5-6-probe.json');console.log(j['filters /branchen/'].shiftTabFromArrowedChip, j['filters /case-studies/'].shiftTabFromArrowedChip)"`
- **B-51 :is() hosts that lose position: relative when the rule is deleted:** 13 of 14 (only .site-nav > a keeps its own); 0 isolation rules remain. Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2 && node -e "const r=require('./verify-5-6-probe.json').isRule;console.log(r.onlyFromRule.length, r.ownPositionWithoutRule, r.isolationRulesLeftAfterDelete)"`
- **contrast.mjs hosts with ::before content (dead state-layer branch):** 0 of 18. Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2 && node -e "const c=require('./verify-5-6-probe.json').contrastHostsBefore;console.log(c.withBeforeContent.length,'of',c.total)"`
- **State-layer tokens shipped in css/site.css:** --state-hover 0, --state-press 0, --state-inset 0 (--state-disabled 2). Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && node -e "const s=require('fs').readFileSync('css/site.css','utf8');for(const t of ['--state-hover','--state-press','--state-inset','--state-disabled'])console.log(t,s.split(t).length-1)"`
- **JS UI strings gated by check:copy:** 10 (01-header 2, 02-intent-links 2, 06-work 6). Ungated: ' Projekt'/' Projekte' (06-work.js:27) and 5 mailto body labels (:133-138). Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && node -e "const b=require('./tools/copy-baseline.json');console.log(Object.values(b.js).flat().length, JSON.stringify(b.js))"`
- **Function renderers in content/render.mjs / exported symbols:** 16 top-level functions / 10 exported symbols; with the column arrow function (render.mjs:62) 17 renderers, and 21 with the 4 assemble.mjs helpers of §6.1 (icon, brand, partial include, stampNav). Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && grep -cE '^(export )?function ' content/render.mjs && grep -cE '^(export )?function |^const column = ' content/render.mjs && grep -nE '^const (icon|brand|partial|stampNav) = ' assemble.mjs | wc -l && node -e "import('./content/render.mjs').then(m=>console.log(Object.keys(m).length))"  # -> 16, 17, 4, 10`
- **Renderers accepting className / attribute passthrough:** 1 of 17 render.mjs renderers (pageHero modifier+figureClass; 1 of 21 with the assemble.mjs helpers) / 0 of 21. Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && sed -n '10p;19p;27p;34p;38p;56p;66p;69p;78p;99p;110p;125p;134p;158p;226p;230p' content/render.mjs`
- **cva / tailwind-merge / cn usage:** 0 (none in package.json or node\_modules). Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && ls node_modules | grep -E '^(tailwind-merge|class-variance-authority|clsx)$' | wc -l; node -e "const p=require('./package.json');console.log(Object.keys({...p.dependencies,...p.devDependencies}).join(','))"`
- **page-section frames (hand-written + inline in render.mjs):** 31 (26 + 5). Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && cat pages/*.html sections/*.html partials/*.html | grep -oE '<section[^>]*class="[^"]*page-section[ "-]' | wc -l && grep -oE '<section[^>]*class="[^"]*page-section[ "-]' content/render.mjs | wc -l`
- **Eyebrow labels / display-large h1-h2 headings:** 33 / 37 (15 h1 + 22 h2). Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && cat pages/*.html sections/*.html partials/*.html content/render.mjs | grep -oE 'class="[^"]*\beyebrow\b' | wc -l && cat pages/*.html sections/*.html partials/*.html content/render.mjs | grep -oE '<[a-z0-9]+ class="display-large' | sort | uniq -c`
- **Text-link sites:** 10 (9 &lt;a>, 1 &lt;span> in the reference card, render.mjs:75). Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && cat pages/*.html sections/*.html partials/*.html content/render.mjs | grep -oE '<(a|span) class="text-link' | sort | uniq -c`
- **Arrow span literal vs ${arrow} const use:** 8 literal / 4 const. Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && cat pages/*.html sections/*.html partials/*.html content/render.mjs | grep -oE '<span aria-hidden="true">→</span>' | wc -l && grep -oE '\$\{arrow\}' content/render.mjs | wc -l`
- **Numbered-label instances (4 class names):** 15 (14 hand-written). Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && cat pages/*.html sections/*.html partials/*.html content/render.mjs | grep -oE '__number[ "]|fact-grid__label--display' | wc -l`
- **Renderer-only patterns enforced by check:content:** 4 (page-hero, breadcrumb, page-cta, trust-strip). Command: `sed -n 55,63p /Users/jose/workspace/emposo-new-website/weave-clone-ds/tools/check-content.mjs`
- **stampNav dead branches:** {{CUR:}} 0 consumers, navGroup 0 pages, {{CURATTR:}} 12 live. Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && grep -rn '{{CUR:' partials pages sections content | wc -l; grep -rn navGroup pages.mjs content | wc -l; grep -rnoE '\{\{CURATTR:[a-z-]+\}\}' partials pages sections | wc -l`

## 7. Accessibility and performance baseline

Reviewer: a11y-perf-reviewer (Phase 2, read-only), checked by an adversarial verifier. Base: worktree `weave-clone-ds`, branch `ds/p1-team` at `606227e`, which is origin/main `199f82f` plus the DS-00 docs. The site was served by `serve .` on :8180. dist/ was not rebuilt. Slice runs: 2026-09-27, 06:54–07:22 UTC. Verifier runs: 07:33–07:56 UTC. Both ran on a machine shared with other agents (load averages 2.25–3.59, in `lh/runs.log` and from `uptime`). Evidence directories for this section: `A=/Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/a11y` (slice) and `V=/Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/a11y-verify` (verifier). The worktree was untouched: `git -C …/weave-clone-ds status --short | wc -l` printed 0 after both passes (since this document and its appendix were written it prints 2, only those two files; see the header).

Verifier reruns:
- `npm run contrast` (07:33:49–07:34:33Z): exit 0, same 18 rows.
- Two Lighthouse runs: / @390 at 07:37:52Z and /branchen/ @1440 at 07:38:02Z, both exit 0.
- An independent axe pass: 74 runs.
- Independent browser scripts: `$V/verify.mjs` with parts ring, keys, motion, obscured, pairs and alt; plus `pseudo-text.mjs`, `axe-incomplete.mjs`, `legal-table.mjs`, `form-skip.mjs`, `info-disc.mjs` and `plus-check.mjs`.
- Smoke was not re-run. Its JSON was checked instead.
- There is no coverage claim in this section, so no coverage state was re-run.

### (a) Gates: smoke and contrast

| Gate | Command (in WT) | Exit | Time (UTC) | Summary |
|---|---|---|---|---|
| smoke | `BASE=http://localhost:8180 npm run smoke -- --out=$A/smoke-run1.json` | **0** | 06:54:17–06:58:21 | `# smoke: 37 routes × 6 widths, axe 37×2, 200% text 37×2, keyboard 7×2, no-JS text 9, 8 flows ×3 widths` then `PASS: no failures` |
| contrast | `BASE=http://localhost:8180 npm run contrast -- --out=$A/contrast-run1.json` | **0** | 06:59:15–07:00:01 | `PASS: 18 components × states meet WCAG AA (text 4.5/3, boundaries 3).` |
| contrast (verifier) | `BASE=http://localhost:8180 npm run contrast -- --out=$V/contrast-rerun.json` | **0** | 07:33:49–07:34:33 | same 18 rows, same ratios |

- Both gates passed on the first run, so neither was re-run by the slice. smoke-run1.json has `fails: []` and 74 axe keys, with 0 violations in total.
- axe-core 4.13.0 ran with `runOnly: wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa, best-practice` (smoke.mjs:62). It ran 74 times (37 routes × 390/1400) and found 0 violations. An independent re-run (`node $V/axe-incomplete.mjs`) gave the same result: 74 runs, 0 violations.
  - smoke.mjs:62 keeps only `.violations`. It drops **2,071 `color-contrast` nodes that axe returned as "incomplete"** across all 74 page runs ("background color could not be determined because element contains an image node").
  - The breadcrumb "/" separator appears in none of axe's color-contrast result lists (passes, incomplete, inapplicable, violations) on any of the 74 runs. The documented reason is that axe's color-contrast rule skips text without letters or digits.
- Headings and landmarks, now measured and not only inferred from axe tags (served HTML of the 37 sitemap routes, `$V/html/`):
  - 37 of 37 routes have exactly one `<h1>`. No route skips a heading level. No H1 is duplicated for desktop and mobile.
  - Each route has 1 `<header>`, 1 `<main id="main" tabindex="-1">` and 1 `<footer>`. Every `<nav>` is labelled.
  - Two navs share the label "Hauptnavigation" (partials/header.html:5 and :14). Only one of them renders at any given width.
- Contrast minimums (contrast-run1.log, same in contrast-rerun.log):
  - Filter chip outline 3.17:1.
  - Text-field underline 4.41 at rest, 10.04 on hover, 8.35 on focus.
  - On-dark breadcrumb text 7.59.
  - Everything else is 8.35 or higher.
- **Two focus rows were measured unfocused.** The contrast rows "mobile menu link" and "filter chip" (unselected) have no `focusRing` in either run; see Gate gaps.
- Image weights from smoke, as KiB at 1400×1 / 390×2 (budget 750):
  - / 293/341
  - /portfolio/ 30/23
  - /branchen/ 619/677 (largest)
  - /case-studies/ 560/505
  - /case-studies/data2ai-platform/ 86/86
  - /about-us/ 107/133
  - /karriere/ 25/20
  - /kontakt/ 0/0
  - /404.html 0/0
- Fonts: at most 85 of 100 KiB. Nav at 1240: inline on all 37 routes.
- Images (role-file check, served HTML):
  - There are 145 `<img>` elements. None lacks `width`, `height` or `alt`.
  - 102 have `alt=""`:
    - 96 sit inside reference-card links whose text names the link.
    - 6 are management portraits next to the name's `<h3>`.
  - Both are documented as decorative (docs/components.md:187 and :286; content/render.mjs:8-10). They are not the "empty alt on content images" anti-pattern.

### (b) Focus-visible

**How it's built**
- There is one global two-tone ring at styles/00-base-remainder.css:20-25: `outline: 2px solid var(--color-ink); outline-offset: 2px; box-shadow: 0 0 0 2px var(--color-on-dark), var(--focus-halo, 0 0 #0000)`.
- **The colours are tokens** (`--color-ink` main.css:82, `--color-on-dark` main.css:95). **The geometry is not:** the 2px width, 2px offset and 2px halo spread are raw px.
  - There is no `--ring-*` or `--focus-*` token: `grep -rnE -- '--(ring|focus)[a-z-]*:' styles` only finds `--focus-halo`.
  - `--focus-halo` is a per-component hook, set only at 10-feedback.css:131 (a.expertise-card).
  - The HTML carries no Tailwind `focus:`, `focus-visible:` or `ring-` utilities.
- Supporting rules: `:focus:not(:focus-visible){outline:none}` (00-base-remainder.css:27-29), and `main:focus{outline:none}` for the skip target (:11-13).
- **Cascade fragility:** 00-base-remainder.css is imported unlayered (main.css:398), while every component file is in `layer(components)` (main.css:399-404).
  - The ring beats `.contact-form input, .contact-form select, .contact-form textarea { … outline: none }` (11-components.css:39) only because unlayered rules win.
  - If the ring moves into a layer, the ring on the form fields vanishes. contrast.mjs would still pass (see Gate gaps 1). Only smoke's outline-exists check (smoke.mjs:129) would fail.
- Component add-ons:
  - Nav underline: 10-feedback.css:25.
  - CTA invert: 10-feedback.css:32-33.
  - Card invert: 10-feedback.css:130-134.
  - Light breadcrumb underline: 10-feedback.css:232.
  - Text-link arrow slide: 11-components.css:105.
  - Field underline turns lemon at 2px: 11-components.css:46-47.
  - Skip link slides in on `:focus`: 07-header.css:24.

**Measured in a browser** (`BASE=http://localhost:8180 node $A/focus.mjs`, with `prefers-reduced-motion: reduce` emulated and Lenis off). There were 29 named components (`grep -c ' tabs=' $A/focus.log` → 29), each reached by real Tab presses and captured at dsf 2 into `$A/focus-shots/`. On top of that, forward and Shift+Tab walks ran on 10 routes × 390/1400, for 1100 stops in total (focus.json: forward 560, reverse 540). The ink outline and the white halo were measured separately against the ground, because contrast.mjs:55 reports only the larger of the two. The verifier re-read the computed ring on /portfolio/ (navy), /kontakt/ (navy), /impressum/ (light) and the selected chip: `solid 2px rgb(10, 5, 50) off 2px` plus `rgb(255, 255, 255) 0 0 0 2px` on all four (`$V/verify-ring-keys.log`).

| Ground | Stops | Ink outline : ground | White halo : ground | Visible part |
|---|---|---|---|---|
| light (#ffffff, paper #f5f0eb, header veil #f5f1ec) | 536 | ≥ 17.16 | 1.00–1.13 (acts as the gap) | ink outline |
| navy #0a0532 (hero, `.page-hero`, `.page-section--dark/--deep`, `.contact`, footer) | 564 | **1.00** (invisible) | 19.43 | white halo only |

- Every component type has a visible ring on its ground:
  - Light: skip link, logo, nav links including current, header CTA, mobile toggle, menu link and CTA, filter chip (selected and unselected), reference card, light text link and breadcrumb, legal inline link, expander toggles, expertise card, sitemap link.
  - Light, added by the verifier: the **scrollable legal-table regions**. There are 24 `div.legal-table[role=region][tabindex=0]` on /datenschutzerklaerung/, and the ring is visible there at 390 and 1400 (`$V/legal-table.log`).
  - Navy: on-dark text link and breadcrumb, footer links, input, select, textarea, submit, form privacy link.
- Walk result (focus.log): `stops without outline: 0`, and `stops where neither outline nor halo reaches 3:1 vs ground: 0`. The verifier's recount from focus.json gives the same: 0 and 0.
- Degraded but still visible:
  - **Reference card:** the copy block's navy invert (z-index 1, `--invert-bleed`, 10-feedback.css:130) paints over the lower part of the ring. The invert itself (ink on white, 19.43:1) is the indicator there. The screenshot `reference-card.png` confirms it.
  - **Mobile menu links:** `.mobile-menu__panel { overflow-y: auto }` (07-header.css:102) computes `overflow-x: auto`, and each link spans exactly the panel's inner width. The left and right ring edges are clipped for every link, and the top edge too for the first link (`$A/menu-clip.log`).
    - Verifier: first link "Leistungen" 53.45–371.45 = panel inner 53.45–371.45, link top 74.75 = panel inner top 74.75, panel padding-top 0.
    - Screenshots: `mobile-menu-link.png`, `mobile-menu-link-2nd.png` and `$V/menu-first-link-390.png` (only the bottom edge shows).
  - **Selected chip:** the halo is 2.33:1 against the lemon fill, but the outline is 19.43:1 against the ground.
- **WCAG 2.4.11 Focus Not Obscured (Minimum, AA): FAIL on Shift+Tab.**
  - Forward walk: 0 of 560 stops are covered.
  - Reverse walk: **3 of 540 stops are fully hidden** under the sticky header at 390: `/kontakt/` input "Ihr Name", `/impressum/` breadcrumb "Startseite", and `/case-studies/data2ai-platform/` "Alle Projekte".
  - **A further 38 of 540 are partly covered** (30 at 390, 8 at 1400; 20–80 % of the box). The slice's "41" counted the 3 fully hidden stops as well. Partial cover matters for AAA 2.4.12 only.
  - Confirmed twice:
    - `node $A/obscured-confirm.mjs`: `{"el":[0,56],"header":[0,69]}`. The scorer's rerun (E/score-7/obscured-confirm.txt) gives the same 3 elements: input 0–56 on /kontakt/, links 0–44 on /impressum/ and data2ai, header 0–69.
    - The verifier's own walk, with real Tab to the last footer link and then Shift+Tab (`$V/verify-motion-obscured.log`): the same single element fully hidden on each of the three routes (input 0–56, links 0–44, header bottom 69).
  - Screenshot: `focus-shots/obscured-_kontakt_390.png`.
  - **Also reproduced with Lenis active** on /kontakt/ @390 (`no-preference`): the same input is fully hidden. The other two routes were retested under reduce only.
  - Cause: the sticky header (07-header.css:26-34) with no `scroll-padding-top` anywhere (0 in styles/ and 0 in css/site.css). `scroll-margin-top` is set only on `[id]` (10-feedback.css:249).

### (c) Keyboard: behaviour today vs WAI-ARIA APG

Measured by `BASE=http://localhost:8180 node $A/keyboard.mjs` → keyboard.json. The verifier re-measured the chips, expanders, nav order, menu Escape, skip link and form with `$V/verify.mjs keys ring` and `$V/form-skip.mjs`, and every row below reproduced.

| Component | Keys today (measured) | APG pattern | Verdict |
|---|---|---|---|
| **Skip link** (partials/header.html:1) | First Tab stop at 390 and 1400. Visible: transform none, z-index 100, above the header's 50. Enter moves focus to `main#main` (tabindex=-1, on 37 of 37 routes), and the next Tab lands on the first link in main ("Startseite"). 00-core.js:64-71 only adds the Lenis jump. | not APG; WCAG 2.4.1 | matches |
| **Desktop nav** (nav header.html:5-10, CTA :11) | Tab order on /portfolio/ @1400: skip link → logo → Leistungen `[aria-current=page]` → Branchen & Projekte → Über uns → Karriere → Projekt besprechen → main ("Startseite"). ArrowRight does nothing; Enter follows the link. | plain links in a labelled `nav`; no submenus, so no APG menu pattern applies | matches |
| **Mobile menu** (native `<details id="mobile-menu">`, header.html:12-21) | AX role DisclosureTriangle, expanded false/true. No `aria-expanded` or `aria-controls` attributes; the state is native, and the role file's "aria-controls" item is not met literally. Enter and Space toggle; arrows do nothing. Once open, Tab enters the 5 panel links. Escape on a link closes the menu and returns focus to the summary (01-header.js:17-22). Tab past the last link closes it via focusout (:28-30). Shift+Tab off the summary closes it. A click outside (:31-33) or on a link (:23-25) closes it. aria-label flips between "Menü öffnen" and "Menü schließen" (:14-16). No focus trap. | Disclosure (Show/Hide): Enter/Space toggle; Escape is an extra | matches. A replacement must keep Escape + focus return and close-on-focusout. |
| **Expanders** (`details.expander`: 6 on /about-us/, 2 on /karriere/) | Enter and Space toggle. AX expanded false/true. The open/close labels swap (11-components.css:121-122) and the plus rotates (:120). Escape does nothing (verifier: still open after Escape). The AX name includes the CSS "+" from `summary::after` (11-components.css:119), e.g. "Mehr lesen – ‹name› +" (content/render.mjs:216) and "Zur vollständigen Ausschreibung – ‹job title› +" (content/render.mjs:114). | Disclosure | matches. The "+" in the name is minor; its contrast is not (see f). |
| **Filter chips** (/branchen/, /case-studies/: 2 `role="group"` with aria-label, 7 + 9 `button[aria-pressed]`, 0 disabled) | One Tab stop per group: the pressed chip (tabindex 0, others -1; 06-work.js:52,59). ArrowRight/Down and ArrowLeft/Up move and wrap; Home and End go to the ends (06-work.js:60-69). Arrows move focus only and don't select. Enter and Space select exclusively: the previous chip goes to `aria-pressed=false`, the tab stop moves, the aria-live count updates ("1 Projekt") and `?branche=` updates. Enter on the already-pressed chip keeps it pressed. Tab from the industry group goes to the pressed discipline chip. Arrows skip disabled chips (06-work.js:64), but no chip is disabled today on either page, so this path is not exercised. | **Mismatch.** The semantics are the APG Button pattern with aria-pressed, where every button is a Tab stop and toggles on and off. The keys are the APG Toolbar model, but on `role="group"`, not `role="toolbar"`. The behaviour is Radio Group (single select, although APG radios select on arrow). | operable. The pattern choice (radiogroup vs toolbar) is for Phase 3. |
| **Contact form** (/kontakt/, /) | Tab order: name → company → email → select → textarea → submit → Datenschutz link. Labels wrap their controls; `aria-describedby` points to 5 support spans; 4 fields are `required`. Enter in a field submits. JS then moves focus to the first invalid field, sets `aria-invalid="true"` and writes the German message into the described-by span (06-work.js:126-130). The verifier pressed Enter in "company": focus moved to name, and the message read "Bitte geben Sie Ihren Namen an." Valid fields get `aria-invalid="false"` (:117). Fields re-check live once invalid (:122-125): typing cleared the message. Enter in the textarea inserts a newline, and the select is native. A valid submit builds a `mailto:` (06-work.js:141), which headless Chrome does not record as a request, so it was not observable here. The `?interesse=` hint is `aria-live="polite"`, preselects the option and shows its text. | native form, no APG pattern; WCAG 3.3.1/3.3.2 | matches |
| **Legal-table regions** (24 on /datenschutzerklaerung/, `role="region" tabindex="0"` with aria-label "Tabelle n") | A Tab stop with a visible ring at 390 and 1400. "Tabelle 1" overflows at 390 and not at 1400, but is a Tab stop at both. Arrow keys scroll it: §5.1 row 5.11 measured `scrollLeft` 80 after 2× ArrowRight on the first region at 390×844 (E/interactive-probe.json `legalTable`: regions 24, overflows true, scrollLeftAfterArrows 80); this section did not re-measure it. | WCAG 2.1.1 scrollable region | reachable. A Tab stop where nothing overflows is minor. |

- No positive tabindex, in source and in served HTML:
  - Source: `find . -name '*.html' -not -path './node_modules/*' -not -path './dist/*' -not -path './audit-evidence/*' | xargs grep -oE 'tabindex="[1-9]' | wc -l` → 0.
  - Served HTML of 37 routes: `cat $V/html/*.html | grep -oE 'tabindex="[1-9][0-9]*"' | wc -l` → 0. The only values are `-1` (37 × main) and `0` (24 legal tables).
- No data-\* state attributes exist yet:
  - Source: `grep -rnoE 'data-(open|active|focus|selected|checked|disabled|state|hover)\b' js partials sections pages content | wc -l` → 0.
  - Served HTML (also checking `data-headlessui-state`): 0.
- Focus is never lost in the measured flows: Escape returns focus to the summary, a chip keeps focus after selecting, and the form moves focus to the first invalid field.

### (d) Reduced motion

Measured by `BASE=http://localhost:8180 node $A/motion-nojs.mjs` at / @1400, with a `no-preference` run as the control. The verifier reproduced it with `$V/verify.mjs motion`.

| Item | reduce | no-preference (control) | Source |
|---|---|---|---|
| Lenis | `__lenis` null, `html` class "" | instance present, `html.lenis` | 00-core.js:38-61 |
| Live switch to reduce | — | lenis true → false, class removed | 00-core.js:55-60 |
| Count-up while scrolling to the facts | **1 distinct state**: `2014 \| 250+ \| 2.900+ \| 4` (slice: 139 frames; verifier: 1.5 s of rAF samples) | 53 distinct states in both runs. The static values show before the facts enter view; the IntersectionObserver then restarts them from `0 \| 0+ \| 0+ \| 0`, and the last sample was mid-animation (`2.899+`). | 07-countup.js:49 (checked at trigger time) |
| CSS animations | 0 @keyframes in styles/ and in css/site.css; 0 `CSSKeyframesRule` in the page; `getAnimations()` empty after load | same | 00-base-remainder.css:52-60 |
| Transitions | every computed `transition-duration` is 1e-05s (0.01ms) | 0.18s / 0.32s / 0.56s | 00-base-remainder.css:52-60, main.css:219-221 |
| Card image zoom | `transform: none` | scale(1.03) | 10-feedback.css:251-253 |
| Arrow slide / plus rotation | still applied, instantly (a state change, not motion) | animated | 11-components.css:103-105,120 |

- The final numbers are in the static HTML: `curl -s http://localhost:8180/ | grep -o 'company-facts__value">[^<]*'` → 2014, 250+, 2.900+, 4.
- The comment at 00-base-remainder.css:51 says "transforms don't" survive. That is misleading: transforms still apply, just without a transition. It may mean "don't animate". This is not a WCAG issue.
- Side effect: the `*` rule gives every element a 0.01ms transition. The initial `transition-property` is `all`, so every element that declares no transition now transitions all properties. A style read right after a state change returns the transition's start value. That is why an uncorrected walk read "3px white offset 0" on 460 stops (debug-ring3.mjs). Harness code must wait a frame before reading styles. Discrete properties such as `outline-style` are not affected.
- Lenis (14,348 B) is still downloaded under reduce. It is only not started (a perf observation, not a WCAG issue).
- **Verdict: PASS.**

### (e) No-JS

Measured by motion-nojs.mjs with `setJavaScriptEnabled(false)`, and reproduced by `$V/verify.mjs motion`.

- **Mobile menu /@390: PASS.**
  - A click on the summary opens it: the panel is visible (`checkVisibility`), all 5 of 5 links are visible, and the plus is rotated 45° (07-header.css:95; matrix 0.7071).
  - A second click closes it, and Enter opens it natively.
  - Screenshot: `focus-shots/nojs-mobile-menu-open-390.png`.
  - Gaps: the aria-label stays "Menü öffnen" while open, because only 01-header.js:15 flips it (AX still reports expanded). Escape does not close the menu without JS (verifier: still open after Escape).
- **Expanders /about-us/ and /karriere/@1400: PASS.** A click opens them, `.expander__close` shows and `.expander__open` hides, the plus rotates and the body is visible. Enter closes them.
- **Filters /branchen/ and /case-studies/: by design.** `.work-filter.js-only` is `display:none` (09-page-templates.css:194). All 23 of 23 cards are visible, and "23 Projekte" is in the static HTML.
- **Form /kontakt/: PASS.** `action="mailto:info@emposo.eu" method=post enctype=text/plain`, `noValidate=false` (native validation), 4 required fields, and the empty support spans are hidden (11-components.css:51).
- Count-up figures show their final values and Lenis is `undefined`. Smoke's no-JS text check passed on its 9 core routes.

### (f) Text/background pairs in use

**There is no dark theme today.**
- In the authoring sources:
  - `grep -rn 'data-theme' styles css js partials sections pages content | wc -l` → 0.
  - `grep -rn 'prefers-color-scheme' styles css js partials | wc -l` → 0.
  - `grep -rno 'color-scheme' styles css | wc -l` → 0.
- In the shipped CSS: `grep -o 'data-theme\|prefers-color-scheme\|color-scheme' css/site.css | wc -l` → 0.
- There is no `<meta name="color-scheme">`: 0 hits in partials, pages, sections, content and js.
- There are no `forced-colors` or `prefers-contrast` rules (0).

"On-dark" today means the navy grounds set per class. These are the scopes `[data-theme="dark"]` is meant to take over (owner decision, CLAUDE.md:152-154):
- `.hero` (08-editorial.css:9)
- `.services` (:21)
- `.contact` (10-feedback.css:152, 08-editorial.css:37)
- `.site-footer` (10-feedback.css:158)
- `.page-hero` (09-page-templates.css:13-18), with its photo wells `.page-hero__visual` (:61) and `.about-hero__visual` (:170)
- `.page-section--dark` and `--deep` (09-page-templates.css:124-125)

**Navy is also painted by state, outside those scopes.** The dark scope or on-dark tokens must cover these too:
- CTA hover and focus invert: 10-feedback.css:29, :32.
- Reference and expertise card invert: :125, :130.
- The select's own ink fill: 11-components.css:44.

Measured by `BASE=http://localhost:8180 node $A/pairs.mjs`: 37 routes × 390/1400, 9,329 visible text nodes. That gives 17 fg|bg|size|over-image rows, which collapse to 9 distinct colour combinations. Grounds are composited from ancestors. In the table, white is `--color-on-dark` as text and `--color-bg` as ground.
- Verifier, a different method: `$V/verify.mjs pairs` scanned elements rather than text nodes (9,587 text-bearing elements) and found the same 9 colour combinations. Exactly one text pair is below AA: lemon on white, 12 elements on the same 6 routes, all `aria-hidden`.
- Neither scan reads CSS-generated content. `$V/pseudo-text.mjs` scanned every `::before`/`::after` with text content on 37 routes × 2 widths. It found **one more pair below AA** (the first row).

| Ratio | Text (token) | Ground (token) | Where (nodes / routes) | Verdict |
|---|---|---|---|---|
| **2.06** | #f7911e `--color-lemon` | #f5f0eb `--color-paper` | expander "+" (`.expander summary::after`, 21.6px bold, which counts as large text and needs 3:1) on /about-us/ and /karriere/ (16 / 2; 8 expanders × 2 widths). It is **not** aria-hidden: it is part of the accessible name. | **below AA.** Source: 11-components.css:119. No gate catches it: contrast.mjs's "expander toggle" row measures the label text (17.16). |
| **2.33** | #f7911e `--color-lemon` | #ffffff `--color-bg` | breadcrumb separator "/" (`span[aria-hidden]`, 15.2px) on the light-hero legal pages /impressum/, /datenschutzerklaerung/, /nutzungsbestimmungen/, /cookies/, /barrierefreiheit/, /sitemap/ (12 / 6) | **below AA.** Source: 09-page-templates.css:51. It appears in none of axe's color-contrast result lists, and contrast.mjs has no row for it. |
| 7.59 | #a2a0b1 `--color-on-dark-faint` | #0a0532 `--color-ink` | footer cities, on-dark breadcrumbs (268 / 37) | ok |
| 8.35 | ink | `--color-lemon` | CTA pills, selected chip, `.page-hero__metric` badge (flagged "over image" by the geometry check, but its own lemon fill is opaque, so that flag is a false positive) | ok |
| 8.35 | `--color-lemon` | ink | arrows, separators, portfolio numbers (normal and large) | ok |
| 10.04 | #bab9c6 `--color-on-dark-muted` | ink | on-dark ledes, portfolio copy (64 / 26) | ok |
| 17.16 | ink | #f5f0eb `--color-paper` | paper sections, normal and large (1,126 / 28) | ok |
| 17.25 | ink | #f5f1ec `--color-surface-veil` composited | header (222 / 37) | ok |
| 19.43 | ink | `--color-bg` | light body, normal and large (5,610 / 37) | ok |
| 19.43 | `--color-on-dark` | ink | navy sections, normal and large (1,691 / 37) | ok |
| 19.43 (pixel min 19.38) | `--color-on-dark` | photo `.connection-model__visual` (/@1400, aria-hidden) | pixels measured behind the text box by `node $A/overimage.mjs` | ok |

- 10-feedback.css:229-231 already records "Lemon text fails on light grounds (2.33:1)". The hover rule was fixed there, but the separator (09:51) and the "+" (11:119) were not.

**Non-text graphics rendered today:**
- `--color-info` #4597ce icon discs, `.connection-step--how .connection-step__icon` (10-feedback.css:79): 2 discs on /. Disc vs navy ground 6.08, and the ink icon on the disc 6.08. That is ok under 1.4.11. The slice listed these as "not rendered"; they are rendered (`$V/info-disc.log`).

**Pairs the tokens define but nothing renders today:**
- `--color-error-on-dark` #ffb4ab on ink: 11.45 (shown only after an invalid submit).
- A disabled chip: ink at `--state-disabled` .38 over white is 2.56:1 for text and 1.47:1 for the border. This is exempt as an inactive control, and 0 chips are disabled today.

**UI boundaries** (contrast-run1.json): the chip outline `--color-line-strong` on white is 3.17, and the field underline `--color-line-light-strong` on ink is 4.41 at rest.

### (g) Lighthouse 13.5.0

Script: `$A/lh/run-lh.sh`. Its Lighthouse is not the repo's: run-lh.sh:3 calls `/private/tmp/claude-501/-Users-jose-workspace-emposo-new-website/1a0890b1-5371-4bdf-8bf1-9a887aadbd7b/scratchpad/lh/node_modules/.bin/lighthouse`, an install of 13.5.0 from an unpinned `"lighthouse": "^13.5.0"` in an ephemeral session scratchpad, and package.json, package-lock.json and node_modules/.bin have no Lighthouse (§1 Gates, c15). This baseline can therefore be reproduced only after tooling-engineer pins Lighthouse in the harness step (hand-off rule 8, CLAUDE.md:207-210). The script ran serially with `CHROME_PATH=…/Google Chrome` and `--chrome-flags="--headless=new" --only-categories=accessibility,performance,best-practices --output=json`.
- Mobile: `--screenEmulation.width=390`, which gives 390×823 @1.75 with mobile throttling.
- Desktop: `--preset=desktop --screenEmulation.width=1440`, which gives 1440×940 @1.
- Throttling method: simulate.
- The summary comes from `node $A/lh/summarize.mjs` → summary.json. The verifier re-extracted every cell with `jq` from the 10 report JSONs, and they all match.
- The `exit=` values in runs.log are the `date` substitution's status (zsh), so they prove nothing. The evidence that each run completed is `runtimeError: null` in all 10 reports.
- **Verifier rerun** (`$V/lh/`, real `$?`, both exit 0):
  - / @390: 99/100/100, FCP 1.4 s (slice: 1.2 s, run-to-run variance), LCP 2.0 s, TBT 0 ms, CLS 0.
  - /branchen/ @1440: 100/100/100, FCP 0.3 s, LCP 0.4 s.

| Route | Width | Perf | A11y | BP | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|
| / | 390 | 99 | 100 | 100 | 1.2 s | 2.0 s | 0 ms | 0 |
| / | 1440 | 100 | 100 | 100 | 0.3 s | 0.5 s | 0 ms | 0 |
| /portfolio/ | 390 | 100 | 100 | 100 | 1.4 s | 1.5 s | 0 ms | 0 |
| /portfolio/ | 1440 | 100 | 100 | 100 | 0.3 s | 0.4 s | 0 ms | 0 |
| /branchen/ | 390 | 100 | 100 | 100 | 1.4 s | 1.7 s | 0 ms | 0 |
| /branchen/ | 1440 | 100 | 100 | 100 | 0.3 s | 0.4 s | 0 ms | 0 |
| /case-studies/data2ai-platform/ | 390 | 99 | 100 | 100 | 1.4 s | 2.0 s | 0 ms | 0 |
| /case-studies/data2ai-platform/ | 1440 | 100 | 100 | 100 | 0.3 s | 0.4 s | 0 ms | 0 |
| /kontakt/ | 390 | 100 | 100 | 100 | 1.4 s | 1.5 s | 0 ms | 0 |
| /kontakt/ | 1440 | 100 | 100 | 100 | 0.3 s | 0.4 s | 0 ms | 0 |

Failing audits (score < 1):
- **Accessibility, all 10 runs:** `label-content-name-mismatch`, with weight 0 (hidden group). The site logo's `aria-label="Emposo — Startseite"` (partials/header.html:4) does not contain the SVG's live text "The Outcome Factory".
- **Performance, all 10 runs:**
  - `render-blocking-insight`: site.css, 11,528 B transferred. It scores 0 on mobile, with an estimated saving of 410–570 ms, and 0.5 on desktop.
  - `network-dependency-tree-insight`: **roboto-400 and roboto-600 (all 10 runs) and roboto-500 (8 of 10)** are discovered through the CSS. Only 300 and 700 are preloaded (head.html:13-14).
  - `cache-insight`: this reflects the local `serve` headers, not production.
- **Performance, some runs:**
  - `image-delivery-insight` 0.5 on / @390 (13 KiB) and on /branchen/ (31 KiB @390, 6 KiB @1440).
  - FCP scores 0.98–0.99 on all 5 mobile runs.
  - LCP scores 0.97–0.99 on /, /branchen/ and data2ai @390.
  - `interactive` scores 0.99 (hidden) on / and data2ai @390.
- **Best practices:** no failing audits.

Static performance checks (served HTML, `$V/recount.log`):
- Hero `fetchpriority="high"`: 1 each on /, /portfolio/, /branchen/ and /case-studies/data2ai-platform/. /kontakt/ has no hero image. No `fetchpriority="high"` image is lazy.
- Other images are lazy (e.g. /branchen/ has 28).
- Scripts are all `defer`, with 0 non-deferred (JSON-LD excluded).
- css/site.css is 52,241 B: 10,023 B at `gzip -9`, 10,088 B at default gzip, 11,528 B transferred by `serve` (all gzip methods side by side: §1).
- JS: Lenis 14,348 B; js/\*.js total 15,670 B.
- No third-party requests: 0 non-localhost requests in the `network-requests` audit of all 10 Lighthouse runs. Smoke's CSP and failed-request checks are clean too.

### State-layer leftovers

Listed once, with every probe, in §2 ("State-layer leftovers (B-51), all slices"). For this section: the 14-member `:is()` list at styles/11-components.css:11-17 (8 of the 14 members at specificity (0,1,1); removing it can move positioned children, so it needs visual:diff), the dormant `::before` compositing at tools/visual/contrast.mjs:5, :46-48 (`node $A/before-check.mjs` → `rows 18, rows where the ::before composite applies: 0`; the only `::before` rules in css/site.css are `*`, `.page-hero`, and `.result-list li`/`--compact`, none targeting the 18 components), the stale canon at docs/components.md:28-35, :89 and :234-238, and `--state-disabled: .38` at styles/main.css:227-228 (used at 11-components.css:28). M3 references in a11y-relevant comments: main.css:98 (error-on-dark "M3 error tone 80"), main.css:229 (target "not M3 48dp") and 11-components.css:35 (text field "M3 filled field").

### Gate gaps (checks that pass without measuring)

1. **contrast.mjs cannot fail a missing ring.**
   - contrast.mjs:76 never asserts that focus actually reached the component.
   - contrast.mjs:86 fails only a ring that exists and is below 3:1 (`m.focusRing !== undefined && m.focusRing < 3`).
   - **Two** rows were measured unfocused and passed. Neither contrast-run1.json nor contrast-rerun.json has a `focusRing` for them:
     - "mobile menu link": the replay (`node $A/debug-contrast-menu.mjs`, and `$V/verify.mjs ring`) gives 120 Tabs, `focused:false`, `menuOpen:false`.
     - "filter chip" (unselected): the selector `.filter-button:enabled:not(.is-active)` targets `tabindex=-1` chips (06-work.js:52,59), which Tab can never reach. The replay gives 120 Tabs, `focused:false`, `tabindex:-1`.
2. **contrast.mjs:55** takes max(outline, halo). That is correct for a two-tone ring, but it hides the fact that on navy only the halo is visible.
3. **The smoke keyboard walk (smoke.mjs:119-137)** has three blind spots:
   - It runs forward only, so it cannot find the 2.4.11 failure.
   - It checks that an outline exists, not its contrast or whether it is clipped.
   - It reads styles right after the key press, during the 0.01ms transition. That is harmless for the existence check, because `outline-style` is discrete, but any width, colour or contrast assertion added there would read the transition's start values.
4. **smoke's axe step (smoke.mjs:62)** reports violations only. It drops the 2,071 `color-contrast` nodes that axe returned as incomplete (text over or next to images) across the 74 page runs.
   - Neither gate covers the aria-hidden lemon separator (absent from axe's color-contrast results), CSS-generated text such as the expander "+", or text over photos.

### PASS / FAIL

PASS:
- smoke exit 0; contrast exit 0 (reproduced); axe 0 violations × 74 (reproduced).
- One H1 on 37 of 37 routes, no skipped heading levels, complete and labelled landmarks.
- All 145 images have alt, width and height. The 102 `alt=""` are documented decorative card photos and portraits.
- A visible ring on 1100 of 1100 walk stops, on light and navy grounds, plus the legal-table regions.
- Skip link, nav, mobile menu, expanders and the form all match APG or native behaviour. Focus is never lost in the measured flows.
- Reduced motion: Lenis off, no animation, count-up shows final values in the static HTML.
- No-JS: disclosures open natively and look open.
- Every rendered text pair is at or above AA except two lemon glyph pairs: the "/" separator and the expander "+".
- Lighthouse: accessibility 100 in 10/10 runs, performance 99–100, best practices 100 (reproduced on 2 runs).
- Hero priority, lazy images and deferred scripts are in place, with 0 third-party requests.

FAIL (path - problem - fix - severity). Items 2 and 3 change pixels, and every DS step is Kind R, so any colour fix needs a new owner decision (Kind A) before it can ship. The "Fix" lines record the reviewer's options for that decision; none is scheduled.
1. styles/07-header.css:26-34 (sticky header), no `scroll-padding-top`.
   - Problem: the focused control is fully hidden under the header on Shift+Tab at 390 (3 of 540 reverse stops). This also reproduces with Lenis active on /kontakt/ @390.
   - Fix: add `html { scroll-padding-top: … }` from `--header-h`/`--header-h-scrolled` (main.css:215-216). Reconcile it with `[id] { scroll-margin-top: calc(var(--header-h) + var(--space-6)) }` (10-feedback.css:249), because the two add up. Left as they are, anchor jumps would land a full header height lower, which is a visual change.
   - Severity: **major** (WCAG 2.4.11 AA). This predates the migration.
2. styles/09-page-templates.css:51 - lemon "/" breadcrumb separator on white is 2.33:1 on 6 routes.
   - Fix: give the separator ink on light grounds only, for example with the light-ground selector pattern already used at 10-feedback.css:228. **Do not** simply use `var(--accent-ink)`: it flips to lemon only in `.page-section--dark/--deep` (09-page-templates.css:124-125). `.page-hero` does not redefine it (main.css:248 = ink), so every navy page-hero breadcrumb, which sits in `.page-hero` on /portfolio/, the case studies and others, would turn ink on navy at 1.00:1. Alternatively, flip `--accent-ink` inside `.page-hero` as well.
   - Severity: **blocker per the role rule "any pair below AA"**. Whether the WCAG 1.4.3 "pure decoration" exemption applies (an aria-hidden glyph whose meaning the list structure already carries) is the coordinator's call.
3. styles/11-components.css:119 - the expander "+" (`summary::after`, lemon on paper) is 2.06:1 against the 3:1 large-text minimum on /about-us/ and /karriere/ (8 expanders).
   - It is in the accessible name, so the decoration exemption is weaker than for the separator. As a state indicator it also misses 1.4.11's 3:1, although the label swap carries the state.
   - Fix: an ink "+" on light grounds (Kind A), or `content: '+' / ''` together with the argument that it is decorative (this changes the name, so it is NEEDS-OWNER under the copy rule; see #8).
   - Severity: **blocker per the role rule**; the coordinator classifies it together with #2.
4. tools/visual/contrast.mjs:76 and :86 - a focus state can be measured unfocused, or with no ring at all, and still pass. This affects 2 rows today (mobile menu link, filter chip).
   - Fix: assert `activeElement === host`, fail when `focusRing` is missing in the focus state, and focus roving-tabindex chips by arrow key.
   - Severity: **major** (a gate that can't fail) → tooling-engineer.
5. styles/00-base-remainder.css:20-25 with 11-components.css:39 - the ring geometry uses raw px, and the ring survives on the form fields only because unlayered rules win.
   - Fix: tokenise the width, offset, colour and halo, and delete `outline:none` at :39.
   - Severity: minor today, a blocker risk for the token steps.
6. styles/07-header.css:102 - the panel's `overflow-y:auto` clips the side edges of the menu-link ring (and the first link's top edge).
   - Fix: add inset padding or a negative outline offset.
   - Severity: minor.
7. js/06-work.js:44-69 (with the chip renderer, content/render.mjs:91) - toggle-button semantics with toolbar keys and radio behaviour.
   - Fix: choose APG Radio Group or Toolbar in Phase 3.
   - Severity: minor.
8. styles/11-components.css:119 - the "+" pseudo-content is part of the expander's accessible name.
   - Fix: use `content: '+' / ''`.
   - Severity: minor. This changes the accessible name, so it needs owner approval under the copy rule. See #3.
9. partials/header.html:4 - the logo's aria-label does not contain its visible live text (Lighthouse `label-content-name-mismatch`, WCAG 2.5.3).
   - NEEDS-OWNER (copy). Severity: minor.
10. js/01-header.js:15-22 - without JS the label stays "Menü öffnen" while open, and Escape doesn't close.
    - Severity: minor.
11. partials/head.html:13-14 - roboto-400, -500 and -600 are discovered through the CSS chain; only 300 and 700 are preloaded.
    - This is an observation, not a clear fix: 5 weights of about 18 KB each sit against the 100 KiB font budget (85 today), so preloading more may not pay off. Roboto stays by owner decision.
    - Severity: minor (performance).

Criterion 6, the reviewer's suggested evidence line: AA holds for every rendered text pair on light and navy except two lemon glyphs: the aria-hidden breadcrumb "/" (2.33:1) and the expander "+" in the accessible name (2.06:1). The ring is visible everywhere, but its geometry is not tokenised, and it is fully hidden on Shift+Tab (2.4.11). Reduced motion, no-JS and keyboard behaviour are intact. There is no dark theme. Suggested score: 3. (The final score and evidence line are in [Scores](#scores).)

### Section risks

- The focus ring survives on the form fields only because unlayered rules win: 00-base-remainder.css is unlayered (main.css:398), while 11-components.css:39 sets outline:none inside layer(components). If a token step moves the ring into @layer base or components, the form loses its ring. contrast.mjs would NOT catch it, because it fails only an existing ring below 3:1 (contrast.mjs:86). Only smoke's outline-exists check (smoke.mjs:129, on / and /kontakt/) would catch it.
- On navy grounds the ring is visible only through the white 2px box-shadow halo (the ink outline is 1.00:1). Any refactor that drops or overrides box-shadow on focus loses the ring on all 564 navy stops. When \[data-theme="dark"] takes over those scopes, the ring colours should come from semantic ring tokens.
- Two below-AA lemon glyph pairs need a coordinator classification (blocker vs decorative exemption) before the token steps define the semantic pair matrix: the aria-hidden breadcrumb '/' (2.33:1, 6 routes) and the expander '+' (2.06:1, which is in the accessible name, /about-us/ and /karriere/). Any colour fix is a visual change, which makes it Kind A and needs an owner decision.
- --accent-ink flips to lemon only in .page-section--dark/--deep. .page-hero keeps ink (main.css:248). A semantic 'accent text' token applied naively to the breadcrumb separator would turn the navy-hero separators ink on navy (1.00:1).
- WCAG 2.4.11 fails today on Shift+Tab (sticky header, no scroll-padding). No gate tests reverse Tab order, so a DS step could neither fix nor worsen it without anyone noticing. The fix must also reconcile the existing \[id] scroll-margin-top (10-feedback.css:249), or anchor jumps shift.
- tools/visual/contrast.mjs:76 and :86 can measure a focus state that was never reached, or has no ring, and still pass. This is seen on 'mobile menu link' and 'filter chip' (roving tabindex -1). The a11y evidence for later interactive replacements depends on this gate, so it needs an assertion in the harness step before Phase 4.
- Pseudo-element text (the expander '+') and text over or next to images (2,071 axe-incomplete nodes that smoke drops) are outside every gate. Only the throwaway scans in the evidence directories cover them.
- The filter chips mix APG patterns: toggle-button semantics, toolbar keys and radio behaviour. Replacing them with a Headless UI v2-style RadioGroup changes the keyboard contract (arrows would select). That is a behaviour change, so it needs an explicit decision rather than a Kind R refactor.
- The state-layer leftover :is() list (11-components.css:15-17) sets position:relative and isolation at specificity (0,1,1) for 14 selectors. Deleting it can move positioned children such as the nav underline ::after, the text-link arrow and the card invert z-index, so it needs a visual:diff proof.
- Navy grounds are also painted by state outside the section scopes: the CTA invert (10-feedback.css:29, :32), the card inverts (:125, :130) and the select fill (11-components.css:44). A \[data-theme="dark"] scope applied only to sections will miss them.
- The reduced-motion reset (00-base-remainder.css:52-60) gives every element a 0.01ms transition of all properties. Harness scripts that read computed styles right after an interaction get the transition's start value; the slice's first walk misread 460 stops that way.
- There are 0 forced-colors rules. In forced-colors mode the white halo, the only visible part of the ring on navy, is dropped, and the ring relies on the UA recolouring the outline. Not measured.
- Lighthouse ran on a shared machine (load average 2.25-3.6) against the local 'serve', so the cache-insight and render-blocking numbers are not production values. FCP varied 1.2 s vs 1.4 s between identical runs of / @390. Only relative comparisons between step bases run under the same conditions are meaningful.
- Lighthouse itself is not part of the repo: the 10 reports came from an unpinned 13.5.0 install ("^13.5.0") in an ephemeral session scratchpad (a11y/lh/run-lh.sh:3), so the baseline can be rerun only after tooling-engineer pins Lighthouse (hand-off rule 8, CLAUDE.md:207-210).
- No CSS/JS coverage claim exists in this section, so no coverage state was re-run here. It belongs to bundle-analyst.

### Key counts for §7

Each entry: what was counted, the verified value, and the command that reproduces it (run in the worktree unless the command changes directory).

- **smoke exit code:** 0 (PASS: no failures; 37 routes x 6 widths). Not re-run per the verifier brief; smoke-run1.json has fails \[] and 74 axe keys. Command: `node -e 'const d=require("/Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/a11y/smoke-run1.json");console.log(d.fails.length,Object.keys(d.info.axe).length)'  # -> 0 74`
- **contrast exit code:** 0 on the slice run and 0 on the verifier rerun (07:33:49-07:34:33Z); 18 rows identical. Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && BASE=http://localhost:8180 npm run contrast -- --out=/Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/a11y-verify/contrast-rerun.json; echo EXIT=$?`
- **axe violations across all smoke axe runs:** 0 over 74 runs (slice JSON) and 0 over 74 runs in an independent axe re-run. Command: `node /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/a11y-verify/axe-incomplete.mjs  # -> runs 74, violations 0 (also written to axe-incomplete.json)`
- **Tab-walk stops without a visible ring / below 3:1:** 0 of 1100 / 0 of 1100 (536 light: ink outline >=17.16; 564 navy: ink outline 1.00, white halo 19.43). Command: `node -e 'const f=require("/Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/a11y/focus.json");const s=f.walks.flatMap(w=>w.stops);console.log(s.length,s.filter(t=>t.groundDark).length,s.filter(t=>Math.max(t.outlineVsGround,t.haloVsGround)<3).length)'  # -> 1100 564 0`
- **Focus stops obscured by sticky header (WCAG 2.4.11):** fully hidden 3 of 540 reverse stops (all at 390); partly-only 38 of 540 reverse (30 at 390, 8 at 1400; the slice's 41 includes the 3 fully hidden); forward 0 of 560. Independently reproduced (1 fully hidden per route) and also with Lenis on /kontakt/ @390. Command: `node -e 'const f=require("/Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/a11y/focus.json");const s=f.walks.flatMap(w=>w.stops.map(t=>({...t,w:w.width})));console.log(s.filter(t=>t.fullyObscured).length,s.filter(t=>t.obscuredPct>0&&!t.fullyObscured).length)'; BASE=http://localhost:8180 node /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/a11y-verify/verify.mjs obscured  # -> 3 38; then the verifier's reverse-Tab walk`
- **scroll-padding rules in styles/:** 0 in styles/ and 0 in css/site.css. Command: `grep -rn 'scroll-padding' /Users/jose/workspace/emposo-new-website/weave-clone-ds/styles | wc -l; grep -c 'scroll-padding' /Users/jose/workspace/emposo-new-website/weave-clone-ds/css/site.css`
- **Rendered text pairs / colour combinations / below AA:** 17 rows / 9 combinations / 1 text-node pair below AA (lemon on white 2.33:1, 12 nodes, 6 routes; reproduced by an element-level scan: 9,587 elements, same 9 combos, same 12 below AA) PLUS 1 pseudo-element pair below AA (expander '+', lemon on paper 2.06:1, 16 instances, 2 routes). Command: `BASE=http://localhost:8180 node /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/a11y-verify/verify.mjs pairs; BASE=http://localhost:8180 node /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/a11y-verify/pseudo-text.mjs`
- **Dark-theme mechanism (data-theme / prefers-color-scheme / color-scheme):** 0 / 0 / 0 in sources and 0 in css/site.css; 0 color-scheme meta. Command: `grep -o 'data-theme\|prefers-color-scheme\|color-scheme' /Users/jose/workspace/emposo-new-website/weave-clone-ds/css/site.css | wc -l; grep -rn 'color-scheme' /Users/jose/workspace/emposo-new-website/weave-clone-ds/{partials,pages,sections,content,js} | wc -l`
- **Count-up distinct states while scrolling into view:** reduce: 1 (final values); no-preference: 53 (static values first, then a restart from 0). Command: `BASE=http://localhost:8180 node /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/a11y-verify/verify.mjs motion`
- **Static count-up figures in served HTML:** 2014, 250+, 2.900+, 4. Command: `curl -s http://localhost:8180/ | grep -o 'company-facts__value">[^<]*'`
- **@keyframes in authoring CSS:** 0 (css/site.css 0; 0 CSSKeyframesRule in the page under both motion settings). Command: `grep -c '@keyframes' /Users/jose/workspace/emposo-new-website/weave-clone-ds/css/site.css; BASE=http://localhost:8180 node /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/a11y-verify/verify.mjs motion  # kf: 0`
- **Positive tabindex in shipped HTML:** 0 (served HTML of 37 routes; only -1 x37 on main and 0 x24 on legal tables). Command: `cat /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/a11y-verify/html/*.html | grep -oE 'tabindex="[1-9][0-9]*"' | wc -l`
- **Lighthouse accessibility / performance / best-practices:** a11y 100 in 10/10; perf 99 (/ and data2ai @390), 100 elsewhere; BP 100 in 10/10; only failing a11y audit label-content-name-mismatch (weight 0). Verifier rerun: / @390 99/100/100, /branchen/ @1440 100/100/100. Command: `for f in /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/a11y/lh/*-{mobile,desktop}.json; do jq -r '[(.categories.performance.score*100|round),(.categories.accessibility.score*100|round),(.categories["best-practices"].score*100|round)]|@tsv' $f; done  # the verifier's two reruns are in /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/a11y-verify/lh/; rerunning Lighthouse needs the scratchpad install of run-lh.sh:3 (§1 Gates)`
- **contrast.mjs state-layer code paths that still apply:** 0 of 18 rows (no ::before rule in css/site.css targets any of the 18 components). Command: `grep -oE '[^{}]*::?before[^{]*\{[^}]*\}' /Users/jose/workspace/emposo-new-website/weave-clone-ds/css/site.css`
- **State-layer tokens referenced in docs but defined in styles/:** 0 definitions in styles/, css/site.css and content/render.mjs; 3 mentions remain in docs/components.md (:29, :30, :236). Command: `grep -c -- '--state-hover\|--state-press\|--state-inset' /Users/jose/workspace/emposo-new-website/weave-clone-ds/css/site.css /Users/jose/workspace/emposo-new-website/weave-clone-ds/content/render.mjs /Users/jose/workspace/emposo-new-website/weave-clone-ds/docs/components.md`
- **data-\* state attributes today:** 0 in served HTML of 37 routes (including data-headlessui-state). Command: `cat /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/a11y-verify/html/*.html | grep -oE ' data-(open|active|focus|selected|checked|disabled|state|hover|headlessui-state)(=|[ >])' | wc -l`
- **Worktree changes caused by this audit:** none: 0 lines outside the two audit files (the plain git status --short printed 0 after the verifier pass and prints 2 since this document and its appendix exist). Command: `git -C /Users/jose/workspace/emposo-new-website/weave-clone-ds status --porcelain -- . ':!docs/design-system-audit.md' ':!docs/design-system-audit-appendix.md' | wc -l`
- **State-layer leftover :is() list members:** 14 (not 13); 8 of the 14 are (0,1,1). Command: `sed -n '15,17p' /Users/jose/workspace/emposo-new-website/weave-clone-ds/styles/11-components.css | tr ',' '\n' | grep -c '[a-z]'`
- **H1 per route / skipped heading levels:** 37 of 37 routes have exactly 1 H1 / 0 skips. Command: `for f in /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/a11y-verify/html/*.html; do grep -o '<h1[ >]' $f | wc -l; done | sort | uniq -c`
- **Images: total / missing width / missing height / missing alt / alt="":** 145 / 0 / 0 / 0 / 102 (96 in reference-card links, 6 management portraits; documented decorative). Command: `I=$(cat /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/a11y-verify/html/*.html | grep -oE '<img[^>]*>'); echo "$I" | wc -l; echo "$I" | grep -vc ' width='; echo "$I" | grep -vc ' height='; echo "$I" | grep -vc ' alt='; echo "$I" | grep -c 'alt=""'  # -> 145 0 0 0 102`
- **contrast.mjs focus rows measured unfocused:** 2 of 17 focus rows (mobile menu link, filter chip). Command: `node -e 'for(const x of require("/Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/a11y-verify/contrast-rerun.json"))if(x.states.focus&&x.states.focus.focusRing===undefined)console.log(x.name)'`
- **Roboto weights discovered via the CSS chain (not preloaded):** roboto-400 and -600 in 10/10 runs, roboto-500 in 8/10; preloaded: 300, 700. Command: `for f in /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/a11y/lh/*-{mobile,desktop}.json; do jq -c '.audits["network-dependency-tree-insight"].details' $f | grep -oE 'roboto-[0-9]+' | sort -u | tr '\n' ,; echo; done`
- **Third-party requests in Lighthouse network logs:** 0 in 10/10 runs. Command: `jq '[.audits["network-requests"].details.items[] | select((.url|startswith("http://localhost:8180")|not) and (.url|startswith("data:")|not))] | length' /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/a11y/lh/*-{mobile,desktop}.json`
- **Landmarks per route:** 37/37: 1 header, 1 main#main\[tabindex=-1], 1 footer, all navs labelled (4-6 per route). Command: `for f in /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/a11y-verify/html/*.html; do echo $(grep -o '<header' $f|wc -l)/$(grep -oE '<nav[^>]*aria-label=' $f|wc -l)of$(grep -o '<nav' $f|wc -l)/$(grep -o '<main' $f|wc -l)/$(grep -o '<footer' $f|wc -l); done | sort | uniq -c`
- **axe color-contrast incomplete nodes dropped by smoke.mjs:62:** 2,071 nodes over 74 page runs; the breadcrumb separator is in no color-contrast result list on any route. Command: `node /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/a11y-verify/axe-incomplete.mjs`
- **Pseudo-element text below AA:** 1 pair: .expander summary::after '+' #f7911e on #f5f0eb 2.06:1, 21.6px bold (large, needs 3:1), 16 instances on /about-us/ and /karriere/. Command: `BASE=http://localhost:8180 node /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/a11y-verify/pseudo-text.mjs; node /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/a11y-verify/plus-check.mjs`
- **Focusable legal-table scroll regions:** 24 on /datenschutzerklaerung/, ring visible at 390 and 1400. Command: `grep -c 'class="legal-table"' /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/a11y-verify/html/datenschutzerklaerung.html; node /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/a11y-verify/legal-table.mjs`
- **Coverage state re-run:** not applicable: this section makes no CSS/JS coverage claim (bundle-analyst's slice). Command: `none (no claim to verify)`

## 8. Bundle and dead-code baseline

bundle-analyst, adversarially verified.

**Headline.** `dist/` is 27,512,966 B, and 92.7 % of that is images. 118 shipped files (7,368,765 B, 26.8 % of dist) are referenced by no shipped file. The CSS is the small story. Of 506 style rules, 8 are never hit (10 when counted from coverage.json loads[] alone, 8.3):
- 3 are WebKit-only.
- 1 depends on content (a disabled chip).
- 4 are RTL rules that no current page can reach, because no page or element sets `dir="rtl"`. The slice kept them as deliberate RTL readiness (R-10). The judge found that one of the four, `:root:dir(rtl)` at styles/11-components.css:167, never applies even under `dir="rtl"`: it matches, but it sits in `layer(components)` and loses to the unlayered `:root` at main.css:239, so `--scrim-ink-side` stays 90deg; the same declaration unlayered gives 270deg (E/judge/rtl-judge.mjs; §4.4). "Readiness" doesn't hold for that rule as written.

None of the 8 is an orphaned selector. Among the tokens, one (`--space-28`) is never read.

**Setup.** WT = `weave-clone-ds` at 606227e (origin/main 199f82f plus the Phase 1 docs). `git status --porcelain` gave 0 lines before and after, and still gave 0 after the verifier's runs (since this document and its appendix were written it gives 2, only those two files; see the header). Everything is measured from the already-built `dist/`. The served site `http://localhost:8180` is `serve .` of the WT root, not dist, so parity between the two was checked:
- `cmp` shows css/site.css, all five js/\*.js and assets/vendor/lenis.min.js are byte-identical between WT and dist.
- `diff -rq --exclude=node_modules dist .` finds only these differences outside the source dirs: assets/icons, assets/src, the two image manifests, two stale case-study dirs (see "Repo hygiene"), and serve.json (the noindex header).

Evidence is in E:
- `coverage.json` and `unused-css.md` at the root ([Appendix D](design-system-audit-appendix.md#appendix-d-unused-css) is a copy of unused-css.md).
- The analyst's files under `bundle-analyst/`.
- The verifier's independent recounts under `bundle-verify/` (the corrected section text is bundle-verify/corrected-section.md).

### 8.1 Size baseline

Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2 && node bundle-analyst/sizes.mjs > bundle-analyst/sizes.json` (exit 0). It uses Node zlib, with gzip at level 9 and brotli at quality 11. The verifier recomputed these with `wc -c`/`stat` and a separate Node zlib call and got the same numbers.

The macOS `gzip -9 -n` CLI gives slightly different bytes (site.css 10,014) because it's a different deflate implementation. Compare only Node-zlib figures (all methods side by side: §1).

The CSS gate computes its own gzip at the default level (`tools/check-content.mjs:87`, `gzipSync(css)`), which gives **10,070 B**. Compare against that number when reading `npm run check`.

| Asset | Raw B | gzip-9 B | brotli-11 B | Note |
|---|---:|---:|---:|---|
| css/site.css | 52,241 | 10,005 (gate: 10,070) | 8,847 | budget 65,536 raw / 14,336 gzip (check-content.mjs:85) |
| js/00-core.js | 2,913 | 1,201 | 984 | |
| js/01-header.js | 1,802 | 742 | 581 | |
| js/02-intent-links.js | 1,463 | 702 | 542 | |
| js/06-work.js | 6,886 | 2,348 | 1,955 | |
| js/07-countup.js | 2,606 | 1,132 | 938 | |
| js/\*.js total | 15,670 | 6,125 | 5,000 | per-file sums (separate requests) |
| assets/vendor/lenis.min.js | 14,348 | 3,982 | 3,559 | Lenis 1.2.3 (embedded `lenisVersion="1.2.3"`), vendored, loaded on every page (partials/head.html:17) |
| **Step gate: css + js/\*.js** | **67,911** | **16,130** | **13,847** | recommended gate; track the vendored file separately |
| css + js + vendor | 82,259 | 20,112 | 17,406 | |
| JS per page (script set + Lenis) | 19,063 – 30,018 | 5,925 – 10,107 | 5,124 – 8,559 | 32/37 pages load the minimum (00-core+01-header). The max is `/`. The other sets are /kontakt/ (all but 07), /branchen/ and /case-studies/ (00, 01, 06), and /about-us/ (00, 01, 07) |
| Fonts: 5 woff2 (300–700) | 87,268 | – | – | styles/00-fonts.css:4-8 |
| Fonts loaded on page load, no interaction | `/` 87,268 at 390 and 1440 | | | `/portfolio/` and `/kontakt/` load 69,760 at 390 (no 500 until the menu opens) and 87,268 at 1440. Reproduced with Resource Timing plus `document.fonts` (`bundle-verify/fonts-check.json`). By the end of the states, all 481 sweep loads have fetched all five. |
| TTF masters shipped in dist | 620,016 (5 files) | | | never referenced (see R-1) |
| HTML, 37 routes: min / median / max / total | 12,790 (404.html) / 23,145 / 305,679 (datenschutzerklaerung) / 1,200,844 | 3,370 / 6,150 / 69,528 / 298,791 | 2,800 / 5,122 / 49,356 / 238,710 | Inline SVG is 282,099 B of the total; the logo in header+footer is 5,474 B per page. JSON-LD is 84,521 B. |
| dist/ total | 27,512,966 (515 files) | | | |
| ↳ images (avif, webp, jpg, png, svg) | 25,509,131 (457 files, 92.7 %) | | | |
| ↳ everything else | 2,003,835 (58 files) | | | HTML 1,200,844 · TTF 620,016 · woff2 87,268 · CSS 52,241 · JS 30,018 · JSON 5,238 · TXT 4,457 · XML 3,753 |
| Shipped but referenced by no shipped file | 7,368,765 (118 files, 26.8 %) | | | See the breakdown below. |

Breakdown of the 118 unreferenced files (`cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2 && node bundle-analyst/orphans.mjs`, exit 0):
- **112 images, 6,744,355 B.** assets/brand has 36 files / 3,159,590 B, generated 40 / 1,962,897 and supplied 36 / 1,621,868.
  - One of the brand files is `emposo-logo-neu26.svg` (3,225 B). It's a build input that assemble.mjs:143 inlines through `{{brand:…}}`, not a content image (see R-13).
- **5 TTF, 620,016 B.**
- **Roboto-OFL.txt, 4,394 B.**

The verifier reproduced the same 118-file set, byte for byte, with a different method: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2 && node bundle-verify/orphans2.mjs` resolves every src/srcset/href/content/url()/quoted-path/`<loc>` reference.

### 8.2 Packages

- **Runtime tree.** `npm ls --omit=dev --all` exits 0. The only direct dependency is `serve@14.2.6`.
  - The tree has **90 install paths**: `npm ls --omit=dev --all --parseable | tail -n +2 | sort -u | wc -l`.
  - Those paths hold **86 distinct name@version** and 77 distinct names. The lockfile agrees: 90 non-dev entries.
- **Full tree.** `npm ls --all` exits 0.
  - It has **224 install paths**, which hold **203 distinct name@version** and 188 names. (`npm ls --all --parseable` prints 225 lines; the first is the project root, which `tail -n +2` drops. The §2 key count of 225 counts those lines.)
  - **134 install paths are dev-only.**
  - Direct devDependencies: @tailwindcss/cli 4.3.3, tailwindcss 4.3.3, axe-core 4.13.0, concurrently 9.2.4, esbuild 0.28.2, puppeteer-core 24.43.1, sharp 0.35.4.
  - Full listings are in `bundle-analyst/npm-ls-prod.txt` and `npm-ls-all.txt`.
- **What reaches the browser: no npm package code.** The browser gets:
  - css/site.css (compiled at build time by tailwindcss)
  - the five first-party js/\*.js files
  - the vendored Lenis 1.2.3, which is in neither package.json nor package-lock.json (`grep -c lenis package-lock.json` → 0)
  - five Roboto woff2 files
- **`serve`** is the production static server (package.json:18, "start"), so it runs server-side only.
- **Package candidate.** `esbuild` is referenced nowhere except package.json:39 and 00-baseline.md:181 (`bundle-analyst/greps.txt`). `npm ls esbuild` shows it as a direct devDependency only, with no dependents. It's dev-only, so removing it has no bundle effect (R-12). The other devDependencies are in use: concurrently in package.json:19 "dev", sharp in tools/optimize-\*.mjs, axe-core in tools/visual/smoke.mjs, and puppeteer-core in tools/visual/lib.mjs.

### 8.3 CSS coverage

**Method** (`bundle-analyst/coverage.mjs`, `analyze.mjs`):
- **Tracking.** Chrome/153.0.8010.54, using CDP `CSS.startRuleUsageTracking` with `takeCoverageDelta` after each state.
- **Rule inventory.** A parse of dist/css/site.css: 506 style rules, 50,117 B of rule text. @font-face (5) and grouping rules (40 @media, 4 @layer blocks, 2 @container, 1 @supports) are not counted. site.css has no @keyframes and no @property.
  - The parsed offsets equal Chrome's rule offsets.
  - The verifier's lightningcss parse gives the same 506 starts and 50,117 B (`bundle-verify/rulebytes.mjs`, `cov-default-check.json` "offsetsAgree": true).
  - All 83 "unknown" used offsets Chrome reported are @media/@layer/@container preludes, not style rules.
- **file:line mapping.** From `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && node_modules/.bin/tailwindcss -i ./styles/main.css -o /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/bundle-analyst/map/site.css --minify --map`, which writes only into E. With the sourceMappingURL comment stripped, that output is byte-identical to dist/css/site.css (`cmp` → identical, 52,241 B). The reported line is the rule's opening-brace line.

**Loads:**
- **Main pass: 148 loads.** Every route from `allRoutes()` (37) × widths 390/1440 × `prefers-reduced-motion` no-preference/reduce. States are applied cumulatively in each load, and each one is asserted:
  - default
  - mobile menu open (clicked at 390; set by attribute at 1440, where the menu is display:none)
  - every `details` open
  - one chip active on /branchen/ and /case-studies/ (the only pages with chips: 32 buttons, 0 disabled)
  - contact form submitted empty on / and /kontakt/ (4 `aria-invalid` fields and 4 support texts)
  - scrolled toward 800 px (header `.is-scrolled`)
- **Extra states in the main pass:** an empty-result filter combination, a keyboard Tab pass from the skip link (every stop matched `:focus-visible` in all 148 loads), and a sampled hover sweep.
- **Band pass: 333 loads** at 620/645/680/800/950/996/1100/1300/1600 with the brief's states.
- **`extra-probe.mjs`: 3 more loads.** Skip link activated on / @1440, a wheel scroll on / @1440, and `/kontakt/?interesse=Karriere` @1440. In that last load the hint stayed hidden, and it added 0 rules.

**Assertions.** Menu, details, chip, form and header `.is-scrolled` hold in all 481 sweep loads. The scroll depth does not reach 800 px everywhere:
- 30/481 loads end at exactly 800. Most settle at 772 (119) or 788 (276), because of the header shrink.
- Short pages stop earlier:
  - /cookies/@1440 at 554 and /barrierefreiheit/@1440 at 583 (main pass).
  - In the band pass, /impressum/ reaches 572–698 at 620–1100, and /cookies/ and /barrierefreiheit/ reach 349–615 at every band width.
- The header still switches in every load.

**Retries.**
- 40 loads (5 main, 35 band) hit protocol timeouts or stalled frames while other agents were loading the same machine. In the first runs, that was 4+1 harness timeouts and 22 rAF stalls.
- They were re-run serially and pass. In the final data, 0 loads have errors and 0 have rAF timeouts.
- `meta.retried` records this, and the original runs are kept as `*.first-run.json`. That is why `coverage-*.log` shows exit=1.

**Verifier re-run of one state.** `bundle-verify/cov-default-check.mjs` re-ran the "default" state on 8 loads, using a lightningcss parser and a single `CSS.stopRuleUsageTracking` snapshot:
- / @390 and / @1440-reduce
- /branchen/ @1440 and /kontakt/ @390-reduce
- /case-studies/ @390 and /portfolio/ @1440
- /about-us/ @390 and /404.html @1440

The used-rule sets are identical to coverage.json in all 8, with 0 differences either way.

**Where the counts come from.** They combine the 481 sweep loads in `coverage.json` loads[] with the 3 extra-probe loads, which the per-rule summary folds in (`rules[].usedExtra`, e.g. rules 499 and 504). From loads[] alone, 10 rules (582 B) are never hit and 20 (2,303 B) are extra-only. `main:focus` and `.lenis.lenis-smooth` are hit only in extra-probe. `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/bundle-verify && node reanalyze.mjs` reproduces the loads[]-only view (never 10 / 582 B, onlyExtra 20 / 2,303 B; it reads `../coverage.json`, so it runs from bundle-verify/). The per-rule summary gives the other view, 32 / 2,975 B not hit by the brief's states, 22 / 2,378 B extra-only, 2 / 90 B band-only and 8 / 507 B never: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2 && node -e 'const R=require("./coverage.json").rules,B=a=>a.reduce((s,r)=>s+r.bytes,0),x=r=>r.usedExtra&&r.usedExtra.length,b=r=>r.usedBandWidths&&r.usedBandWidths.length;const nb=R.filter(r=>!r.usedBrief),ex=nb.filter(x),bd=nb.filter(r=>!x(r)&&b(r)),nv=nb.filter(r=>!x(r)&&!b(r));console.log(nb.length,B(nb),ex.length,B(ex),bd.length,B(bd),nv.length,B(nv))'` → `32 2975 22 2378 2 90 8 507`.

| Set | Rules | Bytes |
|---|---:|---:|
| All style rules | 506 | 50,117 |
| Not hit by the brief's states at 390/1440 | 32 | 2,975 |
| ↳ hit only in extra states (hover, keyboard focus, skip link, wheel) | 22 | 2,378 |
| ↳ hit only at intermediate widths | 2 | 90 |
| **Never hit in any load (481 sweep + 3 extra-probe)** | **8** | **507** |
| Never hit, counted from coverage.json loads[] alone | 10 | 582 |

**The 8 never-hit rules. Four are reachable in another engine or content state; the four RTL rules are unreachable with today's content, and one of them doesn't apply even under `dir="rtl"`:**
- **RTL only (no page or element sets `dir="rtl"`; `querySelectorAll(':dir(rtl)')` = 0), 280 B:**
  - styles/11-components.css:164 `.site-nav>a:dir(rtl):after`
  - :165 `:is(.text-link span[aria-hidden],.header-contact__arrow,.site-footer a span[aria-hidden]):dir(rtl)`
  - :166 `svg:dir(rtl)`
  - :167 `:root:dir(rtl)`: ineffective even with `dir="rtl"` (layer order, see the headline and §4.4)
- **WebKit-only, 158 B.** Chrome 153 keeps these rules in the CSSOM (all 506 selectors are present) but never matches the `::-webkit-details-marker` pseudo-element: `CSS.supports('selector(summary::-webkit-details-marker)')` is false (`bundle-verify/webkit-parse.mjs`). The rules:
  - styles/00-base-remainder.css:33 `summary::-webkit-details-marker`
  - styles/07-header.css:93 `.mobile-menu summary::-webkit-details-marker`
  - styles/11-components.css:118 `.expander summary::-webkit-details-marker`
- **Content-dependent, 69 B:** styles/11-components.css:28 `.filter-button:disabled`. There are 0 disabled chips today, but content/render.mjs:86-91 renders a chip `disabled` for any value no project carries (the `empty()` test at :90-91).

**Top extra-state-only rules** (full list in Appendix D):
- the reference-card and expertise-card invert on hover/focus-visible, styles/10-feedback.css:125-134
- the light-ground breadcrumb, :231-232
- `.text-link` arrow slide, styles/11-components.css:103, :105
- `.skip-link:focus` (07-header.css:24) and `main:focus` (00-base-remainder.css:11)
- `.lenis.lenis-smooth` (00-base-remainder.css:45; Lenis sets this class only while wheel-smoothing)

**Band-only rules:**
- styles/10-feedback.css:258 `.connection-model__visual p` (@media ≤1000; hit at 800/950/996). The visual is display:none at ≤700 (10-feedback.css:297), so the rule matches only between 701 and 1000.
- the Tailwind `.container` step at `min-width:96rem` (hit at 1600)

**Confidence (states not covered):**
- The sweep is Chrome-only.
- Not exercised: :active, :focus-within, touch, print, forced-colors, prefers-contrast, 200 % zoom.
- Hover is sampled: one element per (element, section, ground) signature, at most 90 per load.
- Keyboard is one forward Tab pass.
- The form was only submitted empty. There's no typeMismatch, filled or valid state. The `?interesse=Karriere` preselect probe ran but the hint stayed hidden, so the preselect-hint state is not covered.
- Short pages never reach 800 px of scroll (see Assertions).

Raw data: `coverage.json` (481 loads, per-state rule indices, per-rule summary including extra-probe). Rule list: Appendix D.

### 8.4 Shadowed declarations

`npm run css:shadowed` prints `0 shadowed declarations` (exit 0). That's in `bundle-analyst/css-shadowed.txt`, and the verifier's re-run is in `bundle-verify/css-shadowed.txt`. The tool has blind spots:
- It parses only styles/07–11 (tools/visual/shadowed.mjs:7).
- It skips selectors with :hover, :focus, [open] or .is- (:53).
- It needs an identical normalized selector list in the same or top-level context (:56).
- It ignores specificity, unlayered-vs-layered wins, and `display` changes that neutralise other declarations.

Rules that coverage counts as used but that change nothing are in the appendix of unused-css.md (Appendix D, "Covered but inert"). They came from reading the sources and were checked with computed styles (`override-check.txt`, `container-check.txt`):
- **I-1: Tailwind's `.container` utility.** 12 rules, 633 B, generated because the markup uses `class="container"` (35 occurrences in sections/pages/partials/content).
  - It is fully overridden by the unlayered styles/main.css:383-390.
  - Computed max-width is 1344px on every `.container` at 12 widths from 390 to 1920 on 3 routes.
  - Stale comments: main.css:7-11 says the utility is "never generated" (detail in §4.2), and main.css:4, :11, :256, :315 and :363 cite `css/00-base.css`, which no longer exists (`ls css/` → site.css only).
- **I-2:** 09-page-templates.css:19-29 `.page-hero::before` is neutralised by 10-feedback.css:169 `display:none`.
- **I-3:** the base `.hero__*` declarations at 08-editorial.css:10-13 and :79-82, :88-90 are overridden by `.hero--feedback …` at 10-feedback.css:40-46, :271-275, :302. The only `.hero` is `.hero hero--feedback`. The probe found 0 others in 148 loads, and sections/ has one `class="hero hero--feedback"`.
- **I-4 to I-7:** same-media, later-file or `display` overrides:
  - 09:179-180 overridden by 10:277
  - 08:83 overridden by 10:277 and 10:285
  - 09:189 overridden by 10:280
  - 08:91 overridden by 10:310
- **I-8:** identical re-declarations:
  - 10:278 = 10:165
  - 10:283 = 10:144 (gap)
  - 10:312 = 08:32
  - 09:12 = main.css:336
- **I-9:** the two scoped `::-webkit-details-marker` rules duplicate the global one at 00-base-remainder.css:33.
- **I-10:** the B-51 host rule (8.6).
- **I-11 (informational, keep):** 00-base-remainder.css:56-57 `animation-duration`/`animation-iteration-count` in the reduced-motion block are inert today, because site.css has 0 `@keyframes`. It's a safety net, so it's not a candidate. The comment at main.css:393-396, which says the remainder files hold "@keyframes bodies", is stale.

### 8.5 Tokens

Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2 && node bundle-analyst/tokens.mjs > bundle-analyst/tokens.json` (exit 0). It finds 129 declarations of 122 names in styles/ (@theme, :root and component scopes). The verifier recounted with a comment-stripped grep: 129/122. A token counts as read if it has a `var()` or `theme()` read in styles/, a utility or variant use in the scanned sources, or a JS string read.

- **Not emitted in site.css but used at build time (keep):** 7 `--breakpoint-*` (compact, sm, narrow, stack, hero, lg, tablet) and `--container-content`. Tailwind 4.3.3 inlines their `theme()` and `@max-content:` reads. theme() read counts: compact 3, sm 1, narrow 2, stack 1, hero 6, lg 1, tablet 1. `@max-content:` is used 18 times.
- **Emitted but never `var()`-read in CSS: 3 of the 115 custom properties in site.css.** The 115 are 114 project tokens plus Tailwind's own `--spacing`, which `.min-h-11` reads.
  - `--breakpoint-nav`: emitted only because the comment at js/01-header.js:10 ("Keep in sync with --breakpoint-nav in styles/main.css.") is a scanner candidate, as §4.2 shows. The `nav:`/`max-nav:` variants in the markup (partials/header.html:5, :11, :12) don't need the custom property: they inline 75rem. A CLI build of a source copy with only the token name removed from that comment (verify-4/copy/out-b.css, 52,218 B) has 0 `--breakpoint-nav` and still compiles both variants (`grep -o 'min-width:75rem\|max-width:75rem' out-b.css | sort | uniq -c` → 5 and 1, as in out-a.css, which is byte-identical to css/site.css at 52,241 B). js/01-header.js:11 mirrors the value as a literal `(min-width: 75rem)`.
  - `--duration-countup`: read by JS at js/07-countup.js:27.
  - `--space-28` (styles/main.css:197, 16 B): **the one unused token**. It has no reference anywhere except its declaration and the compiled output.
- **Read but never set:** `var(--fact-min, 16rem)` at styles/09-page-templates.css:104 always resolves to 16rem.
- **Read only by a never-hit rule:** `--state-disabled` (main.css:228) is read only at 11-components.css:28 (`.filter-button:disabled`). It stays or goes with that rule.
- **Duplicates, exact value.** There are 10 value groups among top-level @theme/:root declarations, and 11 counting the media-scoped `--header-h` redefinition (`cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2 && node bundle-verify/dups2.mjs` → "groups 11"). Reconciliation with §4.5 and criterion 7: these groups match by value across kinds, while §4.5 counts pairs of the same kind. The 11 are the 5 groups that hold §4.5's 5 same-kind pairs (1.08, #fff, .01em, 1.5rem, and 1rem, which also holds the font-size `--text-body`) plus 6 purely cross-kind groups (1.1rem, 3rem, 4rem, 4.5rem, 6rem, and the media-scoped 5rem). Criterion 7 scores the 5 same-kind pairs:
  - Same role: `--tracking-caps` = `--tracking-caps-slight` = .01em (main.css:137-138), and `--leading-display` = `--display-leading` = 1.08 (main.css:145, 11-components.css:76).
  - Two spacing scales: `--spacing-cell` = `--space-6` = 1.5rem, and `--spacing-rule` = `--space-4` = `--text-body` = 1rem (main.css:162-163 vs :187-188, and :109).
  - Semantic roles on the same primitive: `--color-bg` = `--color-on-dark` = #fff (main.css:83, 95). Flag this for token-architect; it's not a deletion.
  - Cross-role equal lengths (informational):
    - `--icon-md/lg/xl` = `--space-12/16/18`
    - `--space-24` = `--header-h` = 6rem (main.css:196, :215)
    - `--space-20` = `--header-h` = 5rem, below the nav breakpoint (main.css:195, :251)
    - `--text-lede-sm` = `--invert-bleed` = 1.1rem (main.css:111, :242)
    - `--text-join-glyph` = `--space-12` = `--icon-md` = 3rem (main.css:117, :191, :235)
- **Near-twins:**
  - `--breakpoint-lg` 62rem vs `--breakpoint-tablet` 62.5rem (main.css:72-73). Merging 992/1000 once flipped the @max-content layouts on 16 routes, so bundle-analyst makes no merge recommendation.
  - `--breakpoint-sm` 40rem vs `--breakpoint-narrow` 40.625rem (main.css:68-69).
  - The text twins: main.css:114 already assigns them to B-38.

### 8.6 B-51 state-layer leftovers

Listed once, with every probe, in §2 ("State-layer leftovers (B-51), all slices"). Bundle-specific facts: the host rule at styles/11-components.css:11-17 ships as 295 B with `:is()` specificity (0,1,1); `git show 199f82f -- styles/11-components.css` shows B-51 deleted the `::before` overlay, its hover/press rules and the `--state-*` tokens and kept this rule; the contrast.mjs overlay branch (:5, :46-48) is a measured no-op on 0 of 18 components (`bundle-verify/contrast-overlay-probe.json`), and `BASE=http://localhost:8180 npm run contrast` still gives PASS, 18 components, exit 0 (`bundle-verify/contrast.txt`). The state-layer grep prints 21 lines (`bundle-verify/greps-statelayer.txt`); BSD grep printed paths without `./`, so the meta-file exclusions were applied by hand. docs/backlog.md:19, :35, :94 and :348 are history records to keep, not leftovers to remove.

### 8.7 Removal candidates (proof standard)

Nothing is proven yet: step 3 (deletion followed by visual-qa at 0 transitions) hasn't run. Labels:
- **A**: criteria 1+2 met, step 3 pending.
- **U**: unproven, needs owner.

| ID | Candidate | Shipped bytes | Status | Missing / note | Change owner |
|---|---|---:|---|---|---|
| R-1 | 5 TTF masters in dist/assets/fonts | 620,016 (dist only; 0 page bytes) | A | `grep -rl "\.ttf" dist` exits 1, and there were 0 .ttf requests in 481 loads | Exclude via SKIP_ASSETS at tools/build-dist.mjs:24. Keep the sources (tools/subset-fonts.sh:10) and Roboto-OFL.txt (license). Tech-track file, via the coordinator |
| R-2 | 111 unreferenced content images (brand 35, generated 40, supplied 36) | 6,741,130 (dist only) | U | content assets, so it's an owner decision | owner |
| R-3 | `--space-28` (main.css:197) | 16 | A | – | token-architect |
| R-4 | `var(--fact-min, 16rem)` becomes `16rem` (09:104) | – | A | never set anywhere | token-architect |
| R-5 | Tailwind `.container` utility (I-1) | 633 | U | criterion 1 fails (the rule matches); the 16-route incident | tooling-engineer (`@source not inline("container")`) |
| R-6 | `.page-hero::before` pair (I-2) | 291 (260 + 31) | U | the rule matches | component-refactorer |
| R-7 | `.hero__*` overridden declarations (I-3) and I-4 to I-8 | – | U | The rules match. For I-6, deleting 09:189 makes 10:280's `aspect-ratio:auto` redundant, so they go together | component-refactorer |
| R-8 | scoped `::-webkit-details-marker` duplicates (I-9) | 113 | U | needs a WebKit check; Chrome visual-qa can't see these | component-refactorer |
| R-9 | B-51 host rule, 11-components.css:15-17 | 295 | U | may still be load-bearing for position or stacking (§2: 13 of 14 hosts lose `position: relative` without it) | token-architect (token-architect.md:37) |
| R-10 | RTL rules, 11-components.css:164-167 | 280 | U | The slice's note: deliberate RTL readiness; keep unless the owner drops RTL. Judge: `:root:dir(rtl)` at :167 never applies, even under `dir="rtl"` (E/judge/rtl-judge.mjs), so "keep as readiness" rests on a rule with no effect; the owner decision needs that fact | owner |
| R-11 | contrast.mjs overlay branch (:46-48) | 0 (tooling) | U | B-51 leftover; a no-op on 18/18 components today (contrast-overlay-probe.json) | tooling-engineer |
| R-12 | `esbuild` devDependency | 0 | U | criterion 2 met, criterion 1 n/a (dev-only) | tooling-engineer (package.json + lock) |
| R-13 | assets/brand/emposo-logo-neu26.svg in dist | 3,225 (dist only) | U | This is a build input: assemble.mjs:143 inlines it (partials/header.html:4, footer.html:1). `grep -rl emposo-logo-neu26 dist` exits 1. No image request log was captured. Same class as assets/icons, which SKIP_ASSETS already excludes | tooling-engineer via the coordinator (tools/build-dist.mjs:24) |

**Keep:**
- `.filter-button:disabled` (content-dependent) and `--state-disabled`, which is read only there
- the global `summary::-webkit-details-marker` (Safari)
- `.lenis.lenis-smooth` and `main:focus` (both reached in extra-probe)
- `--breakpoint-*` and `--container-content` (read at build time)
- the reduced-motion `animation-*` safety net (I-11)

**Repo hygiene (not bundle):** case-studies/fahrzeugfunktionen/index.html and case-studies/technische-dokumentation/index.html are tracked. They are not in pages.mjs and not in dist, and serve.json:5-14 301-redirects both, so neither is reachable. Tech track. Any step that greps shipped HTML on disk sees their stale markup and counts 39 documents instead of 37 (§5).

### 8.8 Section risks

- Coverage is Chrome-only (Chrome/153.0.8010.54). Chrome keeps the ::-webkit-details-marker rules in the CSSOM but never matches them, so neither Chrome coverage nor Chrome visual-qa can judge them. A Safari check is needed before touching them.
- Hover is a sampled sweep and keyboard is one forward Tab pass. :active, :focus-within, touch, print, forced-colors, prefers-contrast, 200 % zoom and the ?interesse= preselect hint were not exercised, so pseudo-state rules outside the sampled set may be under-counted.
- Only 30/481 loads reached exactly 800 px of scroll. Short legal pages stop at 349–698 px, although the scrolled-header state was reached everywhere.
- 40 of 481 loads (5 main, 35 band) timed out or stalled while other agents were loading the same machine and server. They were re-run serially and pass. First-run data is kept, and coverage-\*.log shows the original exit=1.
- The never-hit count (8) depends on 3 extra-probe loads that sit outside coverage.json loads\[]. A delta check that uses loads\[] alone will see 10 never-hit rules, so use the per-rule summary or both files.
- Tailwind's .container utility is fully overridden today (computed evidence), but a past 992/1000 breakpoint merge flipped @max-content layouts on 16 routes. Treat any change to .container or --breakpoint-\* as high-risk until visual-qa shows 0 transitions.
- The 111 unreferenced content images (6.7 MB) are an owner decision; excluding them changes deploy size, not page weight. emposo-logo-neu26.svg and the TTFs are build inputs, so excluding them is a tech-track change to tools/build-dist.mjs:24, made through the coordinator.
- The B-51 host rule (11-components.css:15-17) has :is() specificity (0,1,1) across 14 selectors. Removing it can change position or stacking for positioned children and hover z-index, so it needs visual-qa including hover and focus states.
- Package counts from --parseable are install paths (90/224), not distinct packages (86/203 name@version). Compare like with like in Phase 5.
- The baseline is tied to 606227e (199f82f + Phase 1 docs). Any rebase onto a newer origin/main invalidates these numbers for delta checks.
- The gate's gzip figure (default level, 10,070 B) differs from the level-9 figure (10,005 B), and the macOS gzip CLI gives another figure (10,014 with -9 -n). Compare only Node-zlib numbers.
- This section contains no Lighthouse figure, so no Lighthouse run was reproduced. lighthouse isn't in node\_modules/.bin, and npx would fetch a package. The full smoke was not re-run.

### Key counts for §8

Each entry: what was counted, the verified value, and the command that reproduces it (run in the worktree unless the command changes directory).

- **css/site.css raw/gzip-9/brotli-11 (B):** 52,241 / 10,005 / 8,847 (gate gzip default level: 10,070). Command: `wc -c < /Users/jose/workspace/emposo-new-website/weave-clone-ds/dist/css/site.css; node -e "const z=require('zlib'),b=require('fs').readFileSync('/Users/jose/workspace/emposo-new-website/weave-clone-ds/dist/css/site.css');console.log(z.gzipSync(b).length,z.gzipSync(b,{level:9}).length,z.brotliCompressSync(b).length)"  # -> 52241; gate default 10070, l9 10005, br11 8847`
- **js/\*.js total raw/gzip/brotli (B):** 15,670 / 6,125 / 5,000. Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2 && node bundle-analyst/sizes.mjs | node -e 'const j=JSON.parse(require("fs").readFileSync(0,"utf8"));console.log(JSON.stringify(j.jsTotal))'  # -> {"raw":15670,"gzip":6125,"brotli":5000}`
- **assets/vendor/lenis.min.js raw/gzip/brotli (B):** 14,348 / 3,982 / 3,559 (Lenis 1.2.3). Command: `grep -o 'lenisVersion="[^"]*"' /Users/jose/workspace/emposo-new-website/weave-clone-ds/dist/assets/vendor/lenis.min.js; cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2 && node bundle-analyst/sizes.mjs | node -e 'const j=JSON.parse(require("fs").readFileSync(0,"utf8"));console.log(JSON.stringify(j.vendor[0]))'  # -> lenisVersion="1.2.3"; raw 14348, gzip 3982, brotli 3559`
- **Step gate css + js/\*.js raw/gzip/brotli (B):** 67,911 / 16,130 / 13,847. Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2 && node bundle-analyst/sizes.mjs | node -e 'const j=JSON.parse(require("fs").readFileSync(0,"utf8"));console.log(["raw","gzip","brotli"].map(k=>j.css[0][k]+j.jsTotal[k]).join(" "))'  # -> 67911 16130 13847 (= 52,241+15,670; 10,005+6,125; 8,847+5,000)`
- **Script sets per page:** 32 pages minimum set (00,01,Lenis); / all; /kontakt/ all but 07; /branchen/ and /case-studies/ 00,01,06; /about-us/ 00,01,07. Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds/dist && for f in $(find . -name '*.html' | sort); do grep -oE '<script[^>]*src="[^"]+"' $f | sed -E 's#.*src="/(js|assets/vendor)/([^".]+)[^"]*"#\2#' | paste -sd, -; done | sort | uniq -c  # -> 32 lenis,00-core,01-header; 2 +06-work; 1 +07-countup; 1 +02-intent-links,06-work; 1 all`
- **woff2 fonts total / loaded on load (/, /portfolio/, /kontakt/):** 87,268 B; / 87,268 @390+1440; /portfolio/ and /kontakt/ 69,760 @390, 87,268 @1440. Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2 && BASE=http://localhost:8180 node bundle-verify/fonts-check.mjs  # Resource Timing + document.fonts`
- **HTML 37 routes raw min/median/max/total (B):** 12,790 / 23,145 / 305,679 / 1,200,844 (gzip 3,370/6,150/69,528/298,791; br 2,800/5,122/49,356/238,710). Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2 && node bundle-analyst/sizes.mjs | node -e 'const j=JSON.parse(require("fs").readFileSync(0,"utf8"));console.log(j.html.count,JSON.stringify(j.html.raw),JSON.stringify(j.html.gzip),JSON.stringify(j.html.brotli),j.html.smallest,j.html.largest)'`
- **Inline SVG / JSON-LD bytes in HTML:** 282,099 / 84,521 B. Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds/dist && node -e 'const fs=require("fs"),p=require("path");const w=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?w(p.join(d,e.name)):[p.join(d,e.name)]);let s=0,j=0;for(const f of w(".").filter(f=>f.endsWith(".html"))){const t=fs.readFileSync(f,"utf8");for(const m of t.matchAll(/<svg\b[\s\S]*?<\/svg>/g))s+=Buffer.byteLength(m[0]);for(const m of t.matchAll(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g))j+=Buffer.byteLength(m[0])}console.log("svg",s,"ld+json",j)'  # -> svg 282099 ld+json 84521`
- **dist total / images / rest (B):** 27,512,966 (515 files) / 25,509,131 (457) / 2,003,835 (58). Command: `find /Users/jose/workspace/emposo-new-website/weave-clone-ds/dist -type f | wc -l; cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2 && node bundle-analyst/sizes.mjs | node -e 'const j=JSON.parse(require("fs").readFileSync(0,"utf8"));console.log(j.dist.files,j.dist.bytes,JSON.stringify(j.dist.images),JSON.stringify(j.dist.rest))'  # -> 515; 515 27512966 {"files":457,"bytes":25509131} {"files":58,"bytes":2003835}`
- **Shipped files referenced by no shipped file:** 118 files, 7,368,765 B (112 images 6,744,355 B of which 1 build-input SVG 3,225 B; 5 TTF 620,016 B; OFL 4,394 B). Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2 && node bundle-verify/orphans2.mjs  # -> orphans 118, bytes 7368765, images 112 / 6744355 (URL-extraction method; the same 118-file set as bundle-analyst/orphans.mjs)`
- **TTF references in dist:** 0 (grep exit 1). Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds/dist && grep -rl "\.ttf" .; echo exit=$?  # -> exit=1`
- **Runtime npm packages:** 90 install paths = 86 distinct name@version (77 names); serve@14.2.6 tree. Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && npm ls --omit=dev --all --parseable | tail -n +2 | sort -u | node -e 'const fs=require("fs");const ps=fs.readFileSync(0,"utf8").trim().split("\n");const nv=new Set(),n=new Set();for(const p of ps){const j=JSON.parse(fs.readFileSync(p+"/package.json","utf8"));nv.add(j.name+"@"+j.version);n.add(j.name)}console.log("paths",ps.length,"name@ver",nv.size,"names",n.size)'; npm ls --omit=dev --all >/dev/null; echo exit=$?  # -> paths 90 name@ver 86 names 77; exit=0`
- **All npm packages / dev-only:** 224 install paths = 203 distinct name@version (188 names); 134 dev-only install paths. Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && npm ls --all --parseable | tail -n +2 | sort -u | node -e 'const fs=require("fs");const ps=fs.readFileSync(0,"utf8").trim().split("\n");const nv=new Set(),n=new Set();for(const p of ps){const j=JSON.parse(fs.readFileSync(p+"/package.json","utf8"));nv.add(j.name+"@"+j.version);n.add(j.name)}console.log("paths",ps.length,"name@ver",nv.size,"names",n.size)'; npm ls --all >/dev/null; echo exit=$?  # -> paths 224 name@ver 203 names 188; exit=0; dev-only 134 = 224 - 90 runtime paths (derived)`
- **npm packages shipped to the browser:** 0. Command: `grep -rhoE '<(script|link)[^>]*(src|href)="/[^"]+\.(js|css|woff2)"' --include='*.html' /Users/jose/workspace/emposo-new-website/weave-clone-ds/dist | sed -E 's/.*(src|href)="//; s/"$//' | sort | uniq -c; grep -c lenis /Users/jose/workspace/emposo-new-website/weave-clone-ds/package.json /Users/jose/workspace/emposo-new-website/weave-clone-ds/package-lock.json  # -> only /js/*.js, /assets/vendor/lenis.min.js, /css/site.css and the 2 preloaded woff2; lenis 0 and 0`
- **Style rules in site.css:** 506 (50,117 B rule text); plus 5 @font-face, 40 @media, 4 @layer, 2 @container, 1 @supports; 0 @keyframes. Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2 && node bundle-verify/lcss-count.mjs && node bundle-verify/rulebytes.mjs  # -> styleRules 506, fontface 5, media 40, layer-block 4, container 2, supports 1; rules 506, bytes 50117`
- **Coverage loads (all assertions pass):** 481 (148 main + 333 band) + 3 extra-probe; 40 retried serially; header .is-scrolled 481/481, exact y=800 only 30/481. Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2 && node -e 'const c=require("./coverage.json"),L=c.loads;console.log(L.length,L.filter(l=>l.pass==="main").length,L.filter(l=>l.pass==="band").length,L.filter(l=>l.asserts.menu).length,L.filter(l=>l.asserts.details>=1).length,L.filter(l=>l.asserts.scrolled.header).length,L.filter(l=>l.asserts.scrolled.y===800).length,L.filter(l=>l.errors&&l.errors.length).length,L.filter(l=>l.rafTimeouts).length,c.meta.main.retried.loads,c.meta.band.retried.loads)'  # -> 481 148 333 481 481 481 30 0 0 5 35`
- **Default-state coverage re-run:** 8/8 loads identical to coverage.json (0 diffs either way). Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/bundle-verify && BASE=http://localhost:8180 node cov-default-check.mjs  # reads ../coverage.json, so it runs from bundle-verify/`
- **Rules not hit by brief states at 390/1440:** 32 (2,975 B): 22 extra-state-only (2,378 B), 2 band-only (90 B), 8 never (507 B), counting extra-probe; loads\[] alone: 20 extra-only (2,303 B), 10 never (582 B). Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2 && node -e 'const R=require("./coverage.json").rules,B=a=>a.reduce((s,r)=>s+r.bytes,0),x=r=>r.usedExtra&&r.usedExtra.length,b=r=>r.usedBandWidths&&r.usedBandWidths.length;const nb=R.filter(r=>!r.usedBrief),ex=nb.filter(x),bd=nb.filter(r=>!x(r)&&b(r)),nv=nb.filter(r=>!x(r)&&!b(r));console.log(nb.length,B(nb),ex.length,B(ex),bd.length,B(bd),nv.length,B(nv))'; cd bundle-verify && node reanalyze.mjs  # -> 32 2975 22 2378 2 90 8 507 (per-rule summary, with extra-probe); then the loads[]-only view: notBrief 32 2975, onlyExtra 20 2303, onlyBand 2 90, never 10 582`
- **Rules never hit in any load:** 8 (507 B): 4 RTL (280), 3 WebKit-only (158), 1 content-dependent (69). Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2 && node -e 'const R=require("./coverage.json").rules,B=a=>a.reduce((s,r)=>s+r.bytes,0),x=r=>r.usedExtra&&r.usedExtra.length,b=r=>r.usedBandWidths&&r.usedBandWidths.length;const nb=R.filter(r=>!r.usedBrief),ex=nb.filter(x),bd=nb.filter(r=>!x(r)&&b(r)),nv=nb.filter(r=>!x(r)&&!b(r));console.log(nb.length,B(nb),ex.length,B(ex),bd.length,B(bd),nv.length,B(nv))'; BASE=http://localhost:8180 node bundle-verify/webkit-parse.mjs; cd bundle-verify && node reanalyze.mjs  # -> last pair 8 507 (listed in Appendix D); supports false, dirMatches 0; loads[] alone: never 10 582`
- **npm run css:shadowed:** 0 shadowed declarations (exit 0). Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && npm run css:shadowed; echo exit=$?  # -> 0 shadowed declarations, exit=0 (saved copies: E/bundle-analyst/css-shadowed.txt, E/bundle-verify/css-shadowed.txt)`
- **Tailwind .container utility rules (fully overridden):** 12 rules, 633 B; computed max-width 1344px at 12 widths x 3 routes. Command: `node -e 'const s=require("fs").readFileSync("/Users/jose/workspace/emposo-new-website/weave-clone-ds/dist/css/site.css","utf8");const a=s.indexOf(".container{width:100%}"),b=s.indexOf(".inline-flex{",a),t=s.slice(a,b);console.log(Buffer.byteLength(t),(t.match(/\.container\{/g)||[]).length)'  # -> 633 12; computed widths: E/bundle-analyst/container-check.txt`
- **B-51 host rule bytes:** 295 B, 14 selectors, :is() specificity (0,1,1). Command: `node -e 'const s=require("fs").readFileSync("/Users/jose/workspace/emposo-new-website/weave-clone-ds/dist/css/site.css","utf8");const i=s.indexOf("isolation:isolate"),r=s.slice(s.lastIndexOf("}",i)+1,s.indexOf("}",i)+1);console.log(Buffer.byteLength(r),r.slice(0,40))'  # -> 295 :is(.header-contact,.mobile-menu__cta,…`
- **.page-hero::before pair (R-6):** 291 B (260 + 31). Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2 && node bundle-verify/rulebytes.mjs  # -> picked 89: 260 B, 270: 31 B`
- **Token declarations / names in styles/:** 129 / 122. Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && perl -0ne 's{/\*.*?\*/}{ }gs; print "$1\n" while /(?<![\w(-])(--[a-z0-9-]+)\s*:/g' styles/*.css | wc -l; perl -0ne 's{/\*.*?\*/}{ }gs; print "$1\n" while /(?<![\w(-])(--[a-z0-9-]+)\s*:/g' styles/*.css | sort -u | wc -l  # -> 129, 122 (saved listing: E/bundle-verify/style-decls.txt)`
- **Unused tokens:** 1 (--space-28, styles/main.css:197). Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && grep -rn --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=dist --exclude='design-system-audit*.md' -- '--space-28' . | cut -c1-40  # -> ./css/site.css:2 and ./styles/main.css:197 only`
- **Custom properties in site.css never var()-read:** 3 of 115 (114 project + Tailwind --spacing): --breakpoint-nav \[ships only because the js/01-header.js:10 comment is a scanner candidate, §4.2; the nav:/max-nav: variants inline 75rem], --space-28, --duration-countup \[JS read]. Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2 && node bundle-verify/lcss-count.mjs; cd bundle-verify && comm -3 style-names.txt site-names.txt  # -> customDeclaredRegex 115, unreadRX --breakpoint-nav, --space-28, --duration-countup; then the 8 styles-only names (7 breakpoints, --container-content) and --spacing`
- **Exact duplicate token groups:** 10 top-level value groups (11 incl. media-scoped --header-h 5rem = --space-20) = the 5 groups holding the 5 same-kind pairs of §4.5 (the 1rem one also holds --text-body) + 6 purely cross-kind groups (1.1rem, 3rem, 4rem, 4.5rem, 5rem, 6rem); criterion 7 scores the 5 same-kind pairs. Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2 && node bundle-verify/dups2.mjs  # -> 'declarations 129 names 122 groups 11' and one line per group`
- **contrast.mjs overlay branch applies:** 0 of 18 components; npm run contrast PASS exit 0. Command: `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2 && BASE=http://localhost:8180 node bundle-verify/contrast-overlay-probe.mjs; cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && BASE=http://localhost:8180 npm run contrast; echo exit=$?`
- **State-layer grep hits (incl. meta files):** 21 lines; non-meta: styles/11-components.css:11, tools/visual/contrast.mjs:5,:46, docs/components.md:28-30,:89,:234,:236, docs/backlog.md:19,:35,:94,:348. Command: `cd /Users/jose/workspace/emposo-new-website/weave-clone-ds && grep -rniE "state[- ]?layer|ripple|state-hover|state-press|state-inset" --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git --exclude='design-system-audit*.md' . | wc -l  # -> 21 (saved listing: E/bundle-verify/greps-statelayer.txt)`

## Corrections applied in this document

Where a verifier or the judge corrected a slice figure, this document uses the corrected figure. The slice texts and listings in E keep their original wording; the appendix prefaces repeat the corrections that touch the listings.

| # | Topic | Slice figure | Used here | Evidence |
|---|---|---|---|---|
| 1 | `min-h-11` occurrences | 21 (§4 text, tokens.md errata, `node verify-4/classes.mjs min-h-11`) | **22** | `grep -oE 'min-h-11' pages/*.html sections/*.html partials/*.html content/*.mjs js/*.js \| wc -l` → 22, re-run for this document; the recount misses content/render.mjs:91, where the class is followed directly by `${` (`grep -noE 'min-h-11' content/render.mjs` → 91, 114, 216). The slice's utility total of 139 comes from the same recount; the corrected total is row 15. |
| 2 | Raw values outside token definitions | 428 (raw-values.md table A, raw-values-work/summary.json:141) | **426** | the 2 keyword rows `stroke-linecap/linejoin="round"` at content/render.mjs:91 are keywords, which the counting rules exclude (verify-3/checks.json) |
| 3 | Files holding `.display-large(--light)` | 21 (scorer's first evidence line) | **23** | `git grep -c -E -- 'display-large(--light)?' -- styles pages sections content \| wc -l` → 23 (E/score-7-challenge/recounts.txt) |
| 4 | Interactive behaviours with a contract block in docs/components.md | 3 (scorer's first evidence line) | **6 of 12** | docs/components.md:171, :180, :204, :212, :227, :279 (E/judge/rulings.txt) |
| 5 | Never-hit CSS rules | 8 / 507 B | **8 / 507 B with the 3 extra-probe loads; 10 / 582 B from coverage.json loads[] alone** | the per-rule summary in coverage.json `rules[]` (one-liner in §8.3) and `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/bundle-verify && node reanalyze.mjs` for loads[] alone |
| 6 | `:root:dir(rtl)` at styles/11-components.css:167 | "RTL readiness, keep" (R-10) | **never applies, even under `dir="rtl"`** | E/judge/rtl-judge.mjs: matches true, `--scrim-ink-side` stays 90deg; the same declaration unlayered gives 270deg; also verify-4/probe.json and token-layer/rtl-probe.txt |
| 7 | Focus stops obscured on Shift+Tab | 41 | **3 fully hidden + 38 partly covered** of 540 reverse stops | a11y/focus.json recount; the slice's 41 included the 3 fully hidden stops |
| 8 | contrast.mjs focus rows measured without a ring | absent from the scorer's first c6 line | **2 of 17** (mobile menu link, filter chip), added to the c6 evidence by the judge | a11y-verify/contrast-rerun.json |
| 9 | Members of the B-51 `:is()` list | 13 | **14** | `sed -n '15,17p' styles/11-components.css \| tr ',' '\n' \| grep -c '[a-z]'` → 14 |
| 10 | Installed npm packages | "of 225 installed paths" (§2) | **224 install paths** | `npm ls --all --parseable` prints 225 lines, the first being the project root (re-run for this document); §8.2 |
| 11 | gzip size of css/site.css | 10,023 / 10,005 / 10,088 / 10,014 in different sections | **10,070 B, the gate's measure**, with the others listed by method in §1 | all five re-run for this document (§1 table) |
| 12 | `{{icon:…}}` placeholders (raw-values.md §F1 note) | "10" | **12 occurrences on 8 lines in 3 files** | `grep -o '{{icon:' pages/*.html sections/*.html partials/*.html content/*.mjs \| wc -l` → 12 (pages/portfolio.html 1 line, sections/04-about.html 4, content/render.mjs 3), re-run for this document |
| 13 | WebKit marker rules (unused-css.md wording) | "Chrome does not parse it" | **Chrome keeps the rules in the CSSOM but never matches the pseudo-element** | `CSS.supports('selector(summary::-webkit-details-marker)')` is false (bundle-verify/webkit-parse.mjs) |
| 14 | Layer of the `@theme` block (tokens.md "Block" column header) | "unlayered source" | **`@layer theme`** | verify-4/layer-walk.txt; the errata block at the end of Appendix C |
| 15 | Tailwind class occurrences in the 33 `@source` files (§4.3) | 139 (`node verify-4/classes.mjs …`) | **140** | `cd /Users/jose/workspace/emposo-new-website/ds-migration-run/phase-2/verify-4 && node classes-boundary.mjs` → "files 33 total 140 regex total 140"; the difference is the `min-h-11` at content/render.mjs:91 (row 1) |
| 16 | Tokens equal to a still-registered Tailwind default (§4.1, §4.5) | 5 | **6** | token-layer/dups.txt, "same value as default": the sixth is `--text-join-glyph` 3rem (styles/main.css:117) = `--text-5xl` (node_modules/tailwindcss/theme.css:363) |
| 17 | Arrow-key scrolling of the legal-table regions (§7(c)) | "not measured" | **measured by §5: `scrollLeft` 80 after 2× ArrowRight at 390 px** | E/interactive-probe.json `legalTable.scrollLeftAfterArrows` = 80 |
| 18 | Renderer denominator for criterion 5 (c5, §6.2) | "1 of 16" | **1 of 17 render.mjs renderers; 1 of 21 with the 4 assemble.mjs helpers** | `grep -cE '^(export )?function \|^const column = ' content/render.mjs` → 17; §6.1 lists the 4 assemble.mjs helpers |
| 19 | `git status --porcelain \| wc -l` in the worktree (header, §3, §7, §8) | 0 | **2 since the audit files exist** (`?? docs/design-system-audit-appendix.md`, `?? docs/design-system-audit.md`); 0 with those two excluded | the pathspec command in the header |

Editorial changes, no figures involved:
- The B-51 leftovers and the `.container` comment findings appeared in several slices. They are listed once (§2 and §4.2) and the other sections point there; every probe and its denominator is kept.
- The migration-meta exclusion list appears once, in the header.
- In measured accessible names, a person's name and a job title are shown as ‹name› and ‹job title›. The strings live at content/render.mjs:216 and :114.
- Paths in §7 use `A` for E/a11y and `V` for E/a11y-verify, so that `E` always means the phase-2 directory.
- Completeness-critic pass, 2026-09-27 (E/critic/gaps-draft.txt; no score changed):
  - The Scores table carries one sentence per criterion; the judged evidence lines moved, verbatim apart from the alignments below, to "Score evidence" under it.
  - Aligned wording: c4 and the §5 intro now say 11 of 12 behaviours are hand-rolled and 1 (Lenis) is a vendored library, with a tally row in §5.2; c7 names its 5 duplicates as same-kind pairs, and §4.5 and §8.5 carry the crosswalk to §8.5's 11 value groups; §8.5 now gives §4.2's mechanism for `--breakpoint-nav`; §4.1's 43 M3-flagged names carry a crosswalk to §2's 19.
  - Added facts, each verified against the worktree: the unpinned scratchpad Lighthouse (§1 Gates, §7(g), R4), the tools/visual widths, scheme gap and silent skip (§1 Gates, R6), the no-git fallback and lastmod re-dating (§1 Deploy, Stack risks), the fixed 16 px root (§1 Tailwind, §4.1, §4.7; E/root-scale-probe.txt), the role class of the 27 Roboto rows (§2 Summary, Appendix A preface), and the raw-value scope note for tools/, .github/workflows/ and serve.json (§3, Appendix B preface).
  - Key-count commands that were prose, or that ran only from E without saying so, were replaced by runnable commands with an explicit `cd` and absolute worktree paths; notes sit after a single trailing `#`. Every replaced command passed `zsh -n` and was run for this pass (outputs in E/docs-writer/cmdcheck/), except verify-4/probe.mjs, a11y-verify/verify.mjs motion and `npm run contrast`, which only gained a `cd` or lost inline prose. The edits are scripted in E/docs-writer/apply-critic-fixes.mjs and apply-critic-fixes-2.mjs; the inputs before this pass are in E/docs-writer.bak-pre-critic-fix/.
  - Mapping of the auditor's items 1-7 to this document's sections: under Contents.
