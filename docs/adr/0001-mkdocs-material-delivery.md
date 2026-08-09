---
status: accepted
---

# MkDocs Material site as the delivery format

The team wants a rich, visual deliverable, but agents author the content ticket-by-ticket, so the source must stay diffable and reviewable. We deliver the Guide as an MkDocs Material site built from markdown, styled with the AIWorx design tokens (`cc-otel/powerbi/branding/design-tokens.json`), with Excalidraw diagrams embedded as SVG. `mkdocs build --strict` is the build gate.

## Considered Options

- Hand-authored HTML — richest output, but agents editing HTML prose is error-prone and diffs are unreviewable.
- Claude Artifacts — fast to share, weak versioning and multi-page structure.
- Plain markdown in the repo — reviewable but a weak team deliverable.

## Consequences

The repo is public and the Guide deploys to GitHub Pages on merge to `main`. The format itself may be revisited after the first management walkthrough (2026-08-11).
