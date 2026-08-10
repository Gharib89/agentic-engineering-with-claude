---
name: docs-review
description: >-
  Re-review shipped Guide chapters claim-vs-source; confirmed findings land
  as a docs-lane ticket, never direct edits.
disable-model-invocation: true
---

# docs-review

One run = one or more shipped chapters re-read claim by claim against their
live sources, ending in a `ready-for-agent` refinement ticket (or a clean
report). Claims only — the Standards axis runs at ship time inside
`docs-ship` and has no place here. Findings become tickets, never edits to
the page in this run.

## 1 · Scope

Given chapter arguments, resolve each to its file under `docs/chapters/`.
Given none, pick the stalest chapter: search this repo's issues for past
review tickets and take the chapter longest unreviewed; when the search is
inconclusive, ask which chapter to review.

**Done when** every scoped chapter is a named file.

## 2 · Review

One reviewer subagent per chapter — the full page, not a diff — all
reviewers in parallel. Each reviewer extracts every checkable claim the
page ties to an external source (linked or named), fetches the live
source, and verdicts the claim: *holds*, or *candidate finding* with the
evidence. External links are not CI-validated, so source rot is exactly
what the reviewer hunts; a 404 from `aihero.dev` is bot-UA gating, not rot
— retry with a browser `User-Agent` before recording a dead link.

**Done when** every claim on every scoped page carries a verdict.

## 3 · Verify

One adversarial verifier subagent per candidate finding, verifiers in
parallel, each framed to refute: "try to refute this finding." Refute
framing kills false positives and hardens soft findings — in the pilot
(#44) it killed the one false positive and upgraded both real findings
with stronger evidence. A candidate is **confirmed** only when its
verifier fails to overturn it.

**Done when** every candidate carries a refute verdict.

## 4 · Ticket

Zero confirmed findings: report the chapter clean and create nothing.
Otherwise open one refinement ticket per reviewed chapter batching its
confirmed findings — each finding cites its page location, the source
evidence, and the minimal fix — labeled `ready-for-agent` for the Docs
Lane. When several chapters yield only very small findings, merge them
into one ticket.

**Done when** the ticket URL is reported, or the clean report given.
