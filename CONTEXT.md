# Agentic Engineering Guide

The context is a documentation project: an MkDocs site teaching the ITWorx team full-SDLC engineering with Claude Code, built inside the workflow it teaches.

## Language

**The Guide**:
The deliverable — the MkDocs Material site built from `docs/`.
_Avoid_: handbook, manual, playbook

**Chapter**:
One top-level page of the Guide covering one SDLC theme. Eight exist.
_Avoid_: section, article

**Example Box**:
A labeled block inside a chapter showing a generic principle applied in one reference repo.
_Avoid_: case study, sample

**Reference Repo**:
A real project the Guide draws examples from: `crm` (Dynamics 365 CLI), `cc-otel` (telemetry + Power BI), and this repo itself.
_Avoid_: demo project

**Living Lab**:
The doctrine that this repo is built using the workflow the Guide teaches, so its own history supplies worked examples.

**Verification Medium**:
The project-specific evidence an agent uses to know a change is done — tests for a CLI, screenshots for a report, a strict build for docs. Central concept of the validation chapter and of the docs lane.
_Avoid_: acceptance criteria, definition of done

**Quick Start**:
The Home page's role — a phase-grouped TL;DR of the whole Guide, communicated diagram-first, with chapter links as the detail layer and an external-resources section. A summary, not a tutorial.
_Avoid_: getting-started guide, tutorial, onboarding

**Docs Lane**:
This repo's shipping workflow (the `docs-ship` skill): strict build + diagram checks + two-axis review, ending in auto-merge.
_Avoid_: pipeline

**Auto-merge**:
Merging a PR after review passes with no human merge gate. Policy of the docs lane only.

**Tracer Bullet**:
A ticket cut as a thin end-to-end slice — it travels every layer and ends in something a user or a check can see, proving the path rather than building a layer.

**Wayfinder Map**:
A living issue for an effort too foggy to spec in one session: notes, decisions-so-far, and the fog (the open questions), with typed child tickets (research, prototype, grilling, task) linked by blocking edges; the unblocked children are the frontier.
_Avoid_: epic
