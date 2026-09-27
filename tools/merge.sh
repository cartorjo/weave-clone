#!/bin/sh
# Merge a PR only after its checks are green.
# Usage: npm run merge -- <pr>
# Waits for the checks to be reported (GitHub needs a few seconds after a push
# before `gh pr checks` sees the run), watches them with --fail-fast, then
# squash-merges. The remote branch is deleted through the API, not with
# `gh pr merge --delete-branch`, which also checks out main locally and fails
# from a worktree after the merge has already happened.
set -eu
pr="${1:?usage: npm run merge -- <pr>}"
i=0
while ! gh pr checks "$pr" >/dev/null 2>&1; do
  out=$(gh pr checks "$pr" 2>&1 || true)
  case "$out" in
    *"No checks reported"*|*"no checks reported"*) ;;
    *) break ;;
  esac
  i=$((i + 1)); [ "$i" -le 30 ] || { echo "merge: no checks reported after 5 min" >&2; exit 1; }
  sleep 10
done
gh pr checks "$pr" --watch --fail-fast
head=$(gh pr view "$pr" --json headRefName --jq .headRefName)
repo=$(gh repo view --json nameWithOwner --jq .nameWithOwner)
gh pr merge "$pr" --squash
gh api -X DELETE "repos/$repo/git/refs/heads/$head" >/dev/null && echo "merge: deleted origin/$head"
