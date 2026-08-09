#!/usr/bin/env bash
# Scoped ripgrep for oss-source-reader (token-efficient search)
set -euo pipefail

usage() {
  echo "Usage: rg-scoped.sh <search_string> <repo_path_under_ghq_root>" >&2
  echo "Example: rg-scoped.sh 'export function foo' \"\$(ghq root)/github.com/owner/repo\"" >&2
  exit 1
}

[[ $# -ge 2 ]] || usage

SEARCH="$1"
REPO_PATH="$2"

if ! command -v ghq >/dev/null 2>&1; then
  echo "ghq is not installed" >&2
  exit 1
fi

GHQ_ROOT="$(ghq root)"

case "$REPO_PATH" in
  "$GHQ_ROOT"/*) ;;
  *)
    echo "REPO_PATH must be a subdirectory of ghq root: $GHQ_ROOT" >&2
    exit 1
    ;;
esac

if [[ ! -d "$REPO_PATH" ]]; then
  echo "Repository path not found: $REPO_PATH" >&2
  exit 1
fi

rg -F "$SEARCH" "$REPO_PATH" \
  --glob '!**/test/**' \
  --glob '!**/*.test.*' \
  --glob '!**/*.spec.*' \
  --glob '!**/dist/**' \
  --glob '!**/build/**' \
  --glob '!**/node_modules/**' \
  --glob '!**/.git/**' \
  -m 50 \
  --heading \
  -n
