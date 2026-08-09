---
name: docs-ship
description: >-
  Ship one docs ticket through the Docs Lane end to end — claim, isolate,
  write, strict build, two-axis review, PR, auto-merge (ADR-0002). Use when
  the user asks to ship a docs ticket, or on a cloud routine fire (pick the
  oldest open `ready-for-agent` ticket, one per fire).
---

# docs-ship

One run = one ticket → one merged PR → the change live on the site. The
Verification Medium for this repo is `mkdocs build --strict` plus the live
Pages URL; every step below ends on evidence from one of the two.

## 1 · Pick and claim

Given a ticket number, use it. Otherwise pick the oldest open
`ready-for-agent` issue:

```bash
gh issue list --label ready-for-agent --state open \
  --json number,title,createdAt --jq 'sort_by(.createdAt) | .[0]'
```

A spec issue is the parent of its tickets and never carries
`ready-for-agent`; if the queue is empty, report "nothing ready" and stop.

Claim so no other run picks the same ticket: remove `ready-for-agent`, then
comment one line naming the branch you are about to create. Read the full
ticket — body and comments — before touching a file.

**Done when** the issue no longer carries `ready-for-agent` and the claim
comment is visible.

## 2 · Isolate

Local session: a worktree on branch `<type>/<slug>-<n>` — `docs` for Guide
content, `feat` for lane machinery. Cloud fire: the sandbox branch is the
isolation; switch it to the conventional name before the first commit.

**Done when** you are on the named branch with a clean status.

## 3 · Write

Hold `docs/contributing/writing-standards.md` and the `CONTEXT.md`
vocabulary while writing — the Standards review axis in step 5 checks the
diff against exactly those rules.

A ticket that needs a new or changed diagram forks on the excalidraw
plugin:

- Plugin present (local sessions): invoke the `excalidraw-diagram` skill;
  its own gate and per-frame render verification are the diagram check.
- Plugin absent (every cloud fire): the diagram cannot be verified, so the
  ticket is a **blocked hand-off** (below).

**Done when** every acceptance criterion in the ticket maps to a change in
the diff.

## 4 · Gate

```bash
mkdocs build --strict
```

Markdown lint and spelling run in CI; the strict build is the local gate.

**Done when** it exits 0.

## 5 · Two-axis review

Invoke the `code-review` skill on the branch diff — Spec axis: the ticket;
Standards axis: `docs/contributing/writing-standards.md`. Fix every finding
or disposition it with a reason, then re-run the step 4 gate.

**Done when** both axes report clean or every finding is dispositioned.

## 6 · PR and auto-merge

Open a PR with `Closes #<n>` in the body. Poll CI with a short delay and a
capped number of attempts — a bounded poll, never a background monitor.
When every check is green, merge without waiting for a human (ADR-0002):
squash-merge and delete the branch. If CI cannot be made green, that is a
blocked hand-off — leave the PR open and note its URL in the hand-off
comment.

Then verify the ship end to end:

1. Merged state confirmed via REST (`gh api repos/{owner}/{repo}/pulls/<pr>`
   → `merged: true`), not the merge command's exit code.
2. The issue closed by the merge.
3. The live site serves the change: fetch the changed page under the
   `site_url` in `mkdocs.yml` and find text from this diff (Pages deploys
   take a minute or two — re-fetch on a bounded poll too).

**Done when** all three hold.

## Blocked hand-off

A run that cannot reach a merged PR — underspecified ticket, diagram work
in a cloud fire, CI stuck red — hands the ticket to a human and stops: add
`ready-for-human`, comment the one-line reason (plus the PR URL if one
exists). Leave `ready-for-agent` off, so the queue never loops the same
ticket back to the next fire.

## Cloud fire

A fire is unattended — no human to ask, so every fork above resolves to
"stop" (empty queue, blocked hand-off) rather than "wait". Two sandbox
facts change the mechanics, nothing else:

- **`gh` repo/PR/issue endpoints return 403** behind the sandbox egress
  proxy. Route GitHub reads and writes through the `mcp__github__*`
  connector; the `git` CLI still works for local branch/commit/push. Map:
  `list_issues` (labels/state/orderBy) for the picker; `issue_read` +
  `issue_write` for the claim and hand-off label edits (`issue_write`
  **replaces** the whole label set — read labels first, write the modified
  set); `add_issue_comment`; `create_pull_request`; `pull_request_read`
  (`method=get` for `mergeable`, `get_check_runs` for CI) as the bounded
  poll; the connector's merge method (`merge_pull_request`) with squash for
  step 6. If the connector is absent or a merge call is denied, that is a
  blocked hand-off with the PR URL.
- **Subagent and task-list tools are absent.** Run the `code-review` axes
  inline in the main thread; keep the phase list as a markdown checklist.
