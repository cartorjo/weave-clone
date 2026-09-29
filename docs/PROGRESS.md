# Design-system migration: progress

[####----------------] 20% | Phase 3/5 | step 3/3: owner approval | WAITING FOR APPROVAL

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
- [x] 1. Audit sweep: auditor (4 slices), a11y-perf-reviewer, bundle-analyst, on origin/main 199f82f
- [x] 2. Adversarial verification of every section (all 6 corrected: 65 corrections, 57 omissions added)
- [x] 3. Scores (scorer, challenger, judge) and top risks. docs/design-system-audit.md and its appendix assembled; completeness critic (20 gaps, one fix loop); delta note up to 6e6a3d5
- [x] 4. Owner reviewed the audit and merged it (PR #36, 2026-09-27). Scores: c1 3, c2 3, c3 2, c4 2, c5 1, c6 3, c7 2 = 16/35

## Phase 3: Plan (10 %)
- [x] 1. Plan drafted: docs/design-system-plan.md (paused 2026-09-27, resumed 2026-09-29)
- [x] 2. Plan rebased onto origin/main 9545bc3 (after the English layer) and adversarially reviewed: 29 stale facts and 14 issues, all accepted
- [ ] 3. Owner approval of the plan and of owner items O-1 to O-11 (waiting)

## Phase 4: Implement (65 %), proposed and pending approval; weights by diff-size estimate
- [ ] DS-01 Harness for both languages (4.2) · [ ] DS-02 A11y regression gates (3.5) · [ ] DS-03 Criterion-6 fixes, Kind A (0.7)
- [ ] DS-04 One token source, M3 names (4.3) · [ ] DS-05 Semantic layer + navy dark scopes (2.5) · [ ] DS-06 cva/cn/parts helper (2.9)
- [ ] DS-07 Lint ratchet in CI (3.5) · [ ] DS-08 Typography and links (5.9) · [ ] DS-09a Page frames (3.8) · [ ] DS-09b Legal and lists (4.1)
- [ ] DS-10 Page hero and breadcrumb (3.8) · [ ] DS-11 Cards A and media (2.0) · [ ] DS-12a Cards B, portfolio/about (4.1) · [ ] DS-12b Cards B, home/404/karriere (2.7)
- [ ] DS-13 Header/footer chrome, base, fonts, logo, icons (2.4) · [ ] DS-14 Disclosure incl. language switch (4.7) · [ ] DS-15 Form field (2.4)
- [ ] DS-16 Filter chips (2.2) · [ ] DS-17 M3 guard, lint blocking, CI (1.4) · [ ] DS-18 Docs (3.9)

## Phase 5: Close (5 %)
- [ ] Re-score, audit update, bundle delta, items still below 5 with follow-ups

## Log
- 2026-09-27: Phase 1 files written on branch ds/p1-team (worktree
  ../weave-clone-ds), fast-forwarded to origin/main 199f82f (B-51 already
  removed the state-layer overlay).
- 2026-09-27: owner confirmed Phase 1 ("do as recommended"). Phase 1 = 5 %.
  Phase 2 started.
- 2026-09-27: owner asked to use only the needed resources and avoid parallel
  work. Idle peer sessions were checked and reported safe to close, the
  weave-clone-cases worktree was removed, and 2 merged remote branches were
  deleted. DS steps now run one at a time (CLAUDE.md hand-off rule 3).
- 2026-09-27: Phase 2 audit done (18 agents, pinned to 199f82f; the peer's
  #32/#14/#33/#34 landed meanwhile, see the audit's delta note). Waiting for
  owner review.
- 2026-09-27: owner merged the audit (PR #36). Phase 2 = 15 %, total 20 %.
- 2026-09-27: 13 merged remote branches deleted (owner). Phase 3 paused by the owner.
- 2026-09-29: Phase 3 resumed on origin/main 9545bc3; plan reviewed and revised (20 steps, 4,545 lines). Waiting for owner approval.
