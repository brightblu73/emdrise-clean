#!/usr/bin/env bash
# EMDRise Git Pre-Push Security Hook
# To install: mkdir -p .git/hooks && cp git-security-hook.sh .git/hooks/pre-push && chmod +x .git/hooks/pre-push

set -e

# Search staged content & working tree for obvious secret patterns.
# (Price IDs are not sensitive; we scan but do not block on them.)
PATTERNS=(
  "sk_test_"          # Stripe secret key (test)
  "sk_live_"          # Stripe secret key (live)
  "whsec_"            # Stripe webhook secret
  "SUPABASE_SERVICE_ROLE_KEY"
  "-----BEGIN PRIVATE KEY-----"
)

# Files that are allowed to contain secrets locally but must not be committed
BLOCKED_PATHS_REGEX='(^|/)\.env(\.|$)|(^|/)\.replit/secrets|attached_assets/'

# 1) Ensure no blocked files are staged
if git diff --cached --name-only | grep -E "$BLOCKED_PATHS_REGEX" >/dev/null; then
  echo "⛔ Refusing to push: staged changes include environment/secret files."
  echo "   Unstage them (git restore --staged <file>) and try again."
  exit 1
fi

# 2) Scan staged snapshot text for secret patterns
STAGED_TMP=$(mktemp)
git diff --cached | sed 's/\x00//g' > "$STAGED_TMP"

for p in "${PATTERNS[@]}"; do
  if grep -E "$p" -n "$STAGED_TMP" >/dev/null; then
    echo "⛔ Refusing to push: found a value that looks like a secret ("$p") in staged changes."
    echo "   Remove/replace with a placeholder or move it to Replit Secrets."
    rm -f "$STAGED_TMP"
    exit 1
  fi
done

rm -f "$STAGED_TMP"
echo "✓ Security check passed. Proceeding with push."
exit 0