---
status: accepted
---

# The docs lane auto-merges — no human merge gate

The reference repos (`crm`, `cc-otel`) end every ship in a human merge gate; anyone arriving from them will expect one here. This repo deviates deliberately: after the docs lane's review passes, the agent merges on its own. A docs-only repo has a low blast radius — no runtime, no users, no data — and `mkdocs build --strict` plus two-axis review already catch what a human gate would. The human stays in the loop at the spec and ticket level, not per-PR; this also lets an unattended cloud routine deliver chapters end-to-end.

## Consequences

If the repo ever grows executable surface (scripts, tooling shipped to others), this decision must be revisited before that surface ships through the lane.
