# ===== EMDRise Git Safety Check (read-only) =====
set -e

echo "→ 1) Remotes"
git remote -v || true
echo

echo "→ 2) Fetching all branches (no code changes)"
git fetch --all --prune
echo

echo "→ 3) Local & remote branches"
echo "Local:"
git branch -vv || true
echo
echo "Remote:"
git branch -r || true
echo

# Detect a second local branch (if any) besides main/master
PRIMARY_BRANCH=$(git for-each-ref --format='%(refname:short)' refs/heads | grep -E '^(main|master)$' | head -n1)
[ -z "$PRIMARY_BRANCH" ] && PRIMARY_BRANCH=main
OTHER_BRANCH=$(git for-each-ref --format='%(refname:short)' refs/heads | grep -v "^$PRIMARY_BRANCH$" | head -n1)

echo "→ 4) Ahead/behind counts"
if [ -n "$OTHER_BRANCH" ]; then
  echo "Comparing $PRIMARY_BRANCH ↔ $OTHER_BRANCH"
  git rev-list --left-right --count "$PRIMARY_BRANCH...$OTHER_BRANCH" \
    | awk '{print "Ahead of", "'$PRIMARY_BRANCH':", $2, " | Ahead of", "'$OTHER_BRANCH':", $1}'
else
  echo "Only one local branch ($PRIMARY_BRANCH) found."
fi
echo

echo "→ 5) Working tree status (uncommitted changes)"
git status --porcelain=v1
echo

echo "→ 6) Uncommitted diff summary"
git diff --stat || true
echo

echo "→ 7) Check if any .env files are tracked (they should NOT be)"
git ls-files -- .env* */.env* || true
echo

echo "→ 8) Quick secret scan in tracked files (Supabase/API keys)"
git grep -nE '(SUPABASE|VITE_SUPABASE|ANON_KEY|SERVICE_ROLE|API_KEY)' || echo "No obvious matches in current files."
echo

echo "→ 9) Quick secret scan in history (signals only; no contents shown)"
git log --all -n 1 -S 'VITE_SUPABASE' --oneline || echo "No history hits for VITE_SUPABASE."
git log --all -n 1 -S 'SUPABASE_ANON' --oneline || echo "No history hits for SUPABASE_ANON."
echo

echo "→ 10) Large files check (top 15 by size in repo history)"
git rev-list --objects --all | \
  git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | \
  awk '/^blob/ {print $3, $4}' | sort -n | tail -15 | numfmt --to=iec --suffix=B --padding=7 | awk '{print $0}'
echo
echo "===== Inspection complete. No changes were made. ====="