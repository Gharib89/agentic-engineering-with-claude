# Agentic Engineering with Claude Code

## Goal

This repo produces **the guide**: an MkDocs Material site teaching the ITWorx team how to run a full SDLC — idea to production to operations — with Claude Code. Markdown source lives under `docs/`; `mkdocs build --strict` is the build gate.

The repo is a **living lab**: the guide is built with the same workflow it teaches. Work arrives as GitHub issues (spec → tickets), ships through the project's docs lane, and the repo's own history doubles as the guide's worked examples.

Editorial doctrine, binding for every chapter:

- **Generic first** — state each principle so it fits any project; concrete material goes in labeled example boxes (`crm`, `cc-otel`, this repo).
- **Main ideas, not mechanics** — the principle, the why, and which tool to reach for; link out for command-level detail.
- **Own practice wins** — where Matt Pocock's skills and our proven practice differ, ours wins; his skills are inspiration and toolkit, adopted and customized to our needs.

## Agent skills

### Issue tracker

Issues live in this repo's GitHub Issues (via `gh` CLI). See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-label vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` + `docs/adr/` at repo root. See `docs/agents/domain.md`.
