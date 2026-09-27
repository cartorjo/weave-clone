# Design-system migration: progress

[#-------------------] 5% | Phase 2/5 | step 1/4: audit sweep

Weighting: Phase 1 = 5 %, Phase 2 = 15 %, Phase 3 = 10 %, Phase 4 = 65 % (split
across the approved steps by diff-size estimate, set in Phase 3), Phase 5 = 5 %.
A Phase 4 step counts only once build, lint, tests, a11y and visual QA have passed
and it's merged. Partial steps count 0 %. Only the coordinator edits this file.

## Phase 1: Team setup (5 %)
- [x] 1. Repo inspection (stack, Tailwind, component layer, icons, fonts, gates, CI, deploy)
- [x] 2. Agent definitions in .claude/agents/ (8 new, 4 existing extended), brief saved verbatim to docs/design-system-brief.md
- [x] 3a. Roster, stack adaptation, progress rules and hand-off rules in CLAUDE.md; DS handoff template in docs/handoffs/README.md
- [x] 3b. Adversarial review of the team files (4 critics, 64 issues; blockers and majors fixed)
- [x] 3c. Owner confirmed the roster and took every recommendation (2026-09-27): hand-built APG primitives, Roboto kept as a brand exception (criterion 1 max 4), Hays Glow icons kept, dark scope = navy sections with page-level auto-dark off, tokens README at styles/README.md, DS ownership rule accepted, Phase 1 committed and merged via PR

## Phase 2: Audit, read-only (15 %)
- [ ] 1. Audit sweep: auditor (4 parallel slices), a11y-perf-reviewer, bundle-analyst
- [ ] 2. Adversarial verification of every section (independent recount + claim checks)
- [ ] 3. Scores, top risks, and docs/design-system-audit.md assembled by docs-writer
- [ ] 4. Owner review of the audit

## Phase 3: Plan (10 %)
- [ ] Migration order, diff-size estimates, agent assignments, Phase 4 weights

## Phase 4: Implement (65 %)
- (steps are set in Phase 3)

## Phase 5: Close (5 %)
- [ ] Re-score, audit update, bundle delta, items still below 5 with follow-ups

## Log
- 2026-09-27: Phase 1 files written on branch ds/p1-team (worktree
  ../weave-clone-ds), fast-forwarded to origin/main 199f82f (B-51 already
  removed the state-layer overlay).
- 2026-09-27: owner confirmed Phase 1 ("do as recommended"). Phase 1 = 5 %.
  Phase 2 started.
