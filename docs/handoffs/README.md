# Handoffs

One file per backlog item: <ID>.md (e.g. B-02.md). The coordinator creates it;
each agent appends its own section in order.

Template:

# <ID> - <title>
Goal:
Benchmark pattern:
Acceptance criteria:
- 
Files in scope:
Agent sequence:
Kind: R (refactor, visual:diff = 0) / A (aesthetic, crops + owner approval) / T
Out of scope: no copy changes (check:copy); ...
Evidence: npm run check exit code, npm run smoke result, visual:diff summary
(R) or visual:pixdiff crops (A).

## ux-ia-architect
## design-system-engineer
## frontend-engineer
## seo-specialist
## a11y-perf-reviewer
## qa-reviewer
Verdict: PASS / FAIL

## DS template (design-system migration steps; CLAUDE.md "Design-system migration")

DS-<n>.md stays untracked on the step branch until the coordinator's merge commit.
Reviewers return reports, and the coordinator pastes each one under its heading.

# DS-<n> - <title>
Worktree: /Users/jose/workspace/emposo-new-website/weave-clone-ds-<n>
Branch: ds/<n>-<slug>
Base SHA: <origin/main at creation>
Ports: step http://localhost:<8080+n>, base http://localhost:<9080+n>
npm ci exit code: <n>
Kind: R (visual:diff = 0) / A (owner-approved decision, crops + approval)
Implementer: token-architect / tooling-engineer / component-refactorer (<family>) / interactive-refactorer
Scope (files):
Acceptance criteria:
- 
Planned size: <diff-size estimate from the approved plan>; bundle growth budget: <0 or bytes + removing step>
Out of scope: copy (check:copy), visual intent (Kind R), other families' files.
Evidence dir: /Users/jose/workspace/emposo-new-website/ds-migration-run/DS-<n>/

## <implementer>
## a11y-perf-reviewer
## visual-qa
## bundle-analyst
## qa-reviewer
Verdict:
