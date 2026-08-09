#!/usr/bin/env bash
# PostToolUse hook: autoformat any markdown file the agent edits or writes,
# using the same tool and config (.markdownlint-cli2.jsonc) as the CI gate.
# Always exits 0 — formatting failures must never block the agent's work.
set -u
file_path=$(jq -r '.tool_input.file_path // empty' 2>/dev/null)
case "$file_path" in
  *.md) npx --yes markdownlint-cli2 --fix "$file_path" >/dev/null 2>&1 || true ;;
esac
exit 0
