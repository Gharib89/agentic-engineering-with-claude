# Docs Lane

This repo's shipping workflow: one ticket per run, driven end to end by the custom-made `docs-ship` skill with no human merge gate. This page is the map; the skill itself (`.claude/skills/docs-ship/SKILL.md`) is the source of truth for every step.

## The lane

A run claims the ticket, isolates on a branch, writes the change, then proves it: `mkdocs build --strict` — the Verification Medium for the site — plus a diagram render check when the ticket touches diagrams, then a two-axis review (Spec axis: the ticket; Standards axis: [writing standards](../contributing/writing-standards.md)) and CI. When review and CI pass, the agent squash-merges on its own — the policy [ADR-0002](../adr/0002-auto-merge-docs-lane.md) records — and confirms the change on the live Pages URL. Auto-merge is what lets a cloud routine deliver Chapters unattended.

## Vendored skills

The skills the lane composes ([`code-review`](https://www.aihero.dev/skills-code-review), [`writing-for-agents`](https://www.aihero.dev/skills-writing-for-agents)) are vendored under `.claude/skills/` so they load in a cloud sandbox where personal skills are absent. The copies are derived: `scripts/sync-skills.py` overwrites them wholesale from `~/.claude/skills` and re-applies the project-owned frontmatter divergences, so edits belong upstream, never in the copies. The script's `SYNC` list records the model-invocation review per skill.
