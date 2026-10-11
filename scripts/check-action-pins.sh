#!/usr/bin/env bash
set -euo pipefail

root=$(cd "$(dirname "$0")/.." && pwd)
status=0

while IFS= read -r file; do
  line_no=0
  while IFS= read -r line || [ -n "$line" ]; do
    line_no=$((line_no + 1))
    case "$line" in
      *uses:*) ;;
      *) continue ;;
    esac
    ref=$(printf '%s\n' "$line" | sed -n 's/^[[:space:]]*-[[:space:]]*uses:[[:space:]]*//; s/^[[:space:]]*uses:[[:space:]]*//; s/[[:space:]].*//; p')
    case "$ref" in
      ""|./?*|\$/?*) continue ;;
    esac
    pin=${ref##*@}
    if ! printf '%s\n' "$pin" | grep -Eq '^[0-9a-f]{40}$'; then
      echo "::error file=${file},line=${line_no}::SHA 固定されていない uses です: ${ref}"
      status=1
    fi
  done < "$file"
done < <(find "$root/.github/workflows" -type f \( -name '*.yml' -o -name '*.yaml' \) | sort)

exit "$status"
