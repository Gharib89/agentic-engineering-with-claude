# Docs Tooling

Formatting and spelling belong to machines so agents never spend turns on them. This page is the inventory: what runs, when, and what was reviewed and rejected.

## What runs

- **Autoformat hook** — a `PostToolUse` hook (`.claude/settings.json` → `.claude/hooks/format-markdown.sh`) runs `markdownlint-cli2 --fix` on every markdown file the agent edits or writes. It never blocks: formatting failures exit 0 and the gate catches what the fixer cannot.
- **Lint gate** — the `lint` job in CI runs `markdownlint-cli2` on every pull request and push to main.
- **Spell gate** — `codespell` runs in the same CI job. False positives (names, domain terms) go in `.codespellrc`, not inline.
- **Strict build** — `mkdocs build --strict` stays the Verification Medium for the site itself: nav, internal links, anchors. It verifies structure, not rendering — an admonition body indented three spaces instead of four builds clean yet renders as a plain paragraph — so when a change touches admonitions or embedded diagrams, pair the build with a render check (the diagram skill's per-frame verification, or the live page after deploy).

Hook and gate read the same config, `.markdownlint-cli2.jsonc`, so formatter and linter cannot drift. Rules tuned there:

- `MD013` off — prose lines stay unwrapped; hard wraps churn diffs and agent edits.
- `MD007` indent 4 — python-markdown (MkDocs) only renders nested lists indented 4 spaces.
- `MD046` off — Material admonition bodies are indented and would misread as inconsistent code-block style.

## Diagram variants

Every diagram ships two SVGs from one `.excalidraw` source: `<stem>.svg` (light) and `<stem>.dark.svg` (the diagram skill's dark export). Pages embed the pair with Material's hash suffixes, and the theme toggle picks one:

```markdown
![alt text](../assets/diagrams/<stem>.svg#only-light)
![alt text](../assets/diagrams/<stem>.dark.svg#only-dark)
```

Both refs carry the same alt text. A new or changed diagram is not done until both variants are re-exported and both refs are in place.

## Reviewed and rejected

- **Markdown LSP** (marksman) — agents here edit prose, not code; the lint gate plus strict build already surface everything its diagnostics would, so harness wiring earns nothing back.
- **External link checker** (lychee and kin) — outbound-URL checks are network-flaky and fail pull requests for other people's outages, and the strict build already validates internal links. Revisit as a scheduled job if dead outbound links become a real problem.
- **Separate formatter** (Prettier, mdformat-mkdocs) — a second tool from a second ecosystem must be kept rule-aligned with the linter forever; `markdownlint-cli2 --fix` covers the normalization the Guide needs at zero alignment cost.
