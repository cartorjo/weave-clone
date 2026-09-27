# Design-system migration brief (owner, 2026-09-27, verbatim)

The stack mapping in CLAUDE.md ("Design-system migration") adapts §2 to this
repo: no component framework, Tailwind already on v4. Agents cite this file as
"brief §n".

```
You are the coordinator for the weave-clone website repo (deployed at
weave-clone-production.up.railway.app). Plan and run a full migration
of the site's UI layer off Google Material 3 onto a composable,
headless-primitive, Tailwind-based design-token system, using a team
of subagents that you create yourself.

Do not touch copy or content. Do not change the visual design intent;
change how it is implemented. Keep the site deployable after every
step.

== 1. CREATE THE TEAM ==

First inspect the repo (framework, package manager, Tailwind version,
component library, icon set, fonts, test setup, CI). Then create as
many subagents as the work needs by writing definitions into
.claude/agents/<name>.md, each with a clear role, allowed tools, and
the sections of this brief that apply to it. Add a roster and hand-off
rules to CLAUDE.md. Suggested roles - adjust, split or drop based on
what you find:

- auditor: read-only inventory and scoring
- token-architect: designs and writes the @theme / semantic token layer
- tailwind-migrator: Tailwind v3->v4 upgrade if needed, config, lint
- component-refactorer (one per component family if the count is
  large): leaf components first, then interactive components
- a11y-reviewer: contrast, focus, keyboard, reduced motion, axe runs
- visual-qa: before/after screenshots, visual diff, Lighthouse
- bundle-analyst: package removal, size delta, dead CSS
- docs-writer: audit report, tokens README, migration log

You own sequencing, review each agent's output before it merges, and
resolve conflicts. Run agents in parallel when work is independent
(e.g. component families); keep token work serial because everything
depends on it.

== 2. STACK DECISIONS (fixed, do not re-litigate) ==

- Tailwind CSS v4. Tokens live in one CSS file using @theme (--color-*,
  --font-*, --spacing-*, --radius-*, --shadow-*, --ease-*, --duration-*,
  --breakpoint-*). No tailwind.config.js theme.extend. If the repo is
  on v3, the upgrade is the first implementation step.
- Semantic tokens are CSS variables layered on the @theme primitives
  and switched via [data-theme="dark"] (fallback to
  prefers-color-scheme). Components consume only semantic utilities
  (bg-surface, text-fg-muted, border-subtle), never primitives, never
  raw hex/px/arbitrary values.
- Headless primitives: Headless UI v2 (@headlessui/react or
  @headlessui/vue, matching the repo) for Dialog, Menu, Popover,
  Listbox, Combobox, Tabs, Disclosure, Switch, Transition, styled with
  Tailwind data-* variants (data-open:, data-focus:, data-active:).
  If the repo is Svelte use Bits UI, if Solid use Kobalte, same rules.
- Anything the primitive library does not cover (Tooltip, Toast,
  Accordion, Slider) is hand-built on native elements plus WAI-ARIA
  patterns and Tailwind only, and listed as a maintained component.
- Variants via class-variance-authority; class merging via
  tailwind-merge (cn helper); every component forwards refs, accepts
  className, and is composed from parts (Card.Root, Card.Header ...).
- Icons via lucide; fonts self-hosted (next/font or @font-face); no
  Roboto, no Material Symbols.
- Lint: a Tailwind v4-compatible ESLint plugin with rules that block
  arbitrary values and raw colors, wired into CI.
- No new runtime CSS-in-JS. Bundle size equal or smaller.

== 3. DEFINITION OF DONE (score each 0-5) ==

1. Zero Material footprint: no @material/*, @mui/*, @angular/material,
   material-web, material-components-web, material-symbols, Roboto;
   no --md-sys-*, --md-ref-*, --mat-* variables; no M3 elevation,
   state-layer, ripple, shape or type-scale naming.
2. Single token source of truth in @theme, consumed everywhere.
3. Semantic-over-primitive usage with no raw values in components.
4. All interactive components on the headless primitive library.
5. Composable component API as described above.
6. Accessibility: WCAG 2.2 AA contrast for every semantic pair in
   light and dark, token-based focus-visible rings, reduced motion
   respected, keyboard behaviour intact.
7. Hygiene: no unused CSS, no duplicate tokens, lint enforced,
   tokens/README explaining the layering.

== 4. PHASES ==

Phase 1 - Team setup. Create agents and CLAUDE.md roster. Report the
roster and stop for my confirmation.

Phase 2 - Audit (read-only). auditor + a11y-reviewer + bundle-analyst
produce docs/design-system-audit.md: stack inventory; every Material
signal with file:line; every hardcoded hex/rgb/hsl/px/arbitrary value;
current token layer and dark-mode mechanism; interactive component
inventory (hand-rolled / Material / already headless); score per
criterion with one line of evidence; top risks. Stop for my review.

Phase 3 - Plan. Migration order that keeps the site deployable:
Tailwind v4 upgrade (if needed) -> tokens -> semantic layer -> leaf
components -> interactive components -> Material package removal ->
lint + CI -> docs. Estimate diff size per step and assign agents.
Stop for approval.

Phase 4 - Implement. One PR-sized commit per step. For each step the
assigned agent implements, then build + lint + tests run, visual-qa
takes screenshots of affected pages at 390px and 1440px in light and
dark and reports the diff, a11y-reviewer runs axe/Lighthouse. A
Material component is only replaced when its headless replacement
passes a11y. You review and merge. Ask me before deleting anything
that cannot be proven unused.

Phase 5 - Close. Re-score the seven criteria, update
docs/design-system-audit.md, report bundle delta, list anything still
below 5 with the reason and a proposed follow-up.

== 5. PROGRESS BAR (mandatory, whole process) ==

- Every message you send me, without exception, starts with one line
  in this exact format:
  [##########----------] 50% | Phase 4/5 | step 6/12: leaf components
  Twenty characters between the brackets, '#' done, '-' remaining,
  integer percent, current phase, current step name.
- Mirror that line plus a per-step checklist to docs/PROGRESS.md and
  update it on every state change.
- Weighting: Phase 1 = 5%, Phase 2 = 15%, Phase 3 = 10%, Phase 4 =
  65%, Phase 5 = 5%. Inside Phase 4 distribute the 65% across the
  approved steps proportionally to their diff-size estimates;
  recompute if the plan changes and say so in the line.
- A step counts as done only when build, lint, tests, a11y check and
  visual QA have all passed and it is merged. Partial steps count 0%.
- While waiting for my review or approval, the line still appears
  with the suffix "| WAITING FOR APPROVAL".
- Subagents never print the bar; only you do.

== 6. REPORTING ==

One line per completed step (after the bar). Escalate only on
blockers, visual regressions, or decisions not covered above.
```
