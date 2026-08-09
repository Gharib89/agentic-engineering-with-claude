# Writing standards

The canonical standards every Chapter of the Guide must meet. The Docs Lane's Standards review axis derives from this doc: a reviewer — human or agent — checks each rule below against the diff, and a change passes only when every rule holds.

## 1. Depth: main ideas, not mechanics

A Chapter teaches the principle, the why, and which tool to reach for. Command-level detail — flags, option lists, full transcripts, step-by-step tool walkthroughs — lives outside the Guide: link to the official docs or to a file in a Reference Repo instead.

**Check:** a passage that reads like a man page or a terminal transcript fails; a passage that explains a decision and names the tool passes. A short command is fine when the command *is* the idea (`mkdocs build --strict` as a Verification Medium); a sequence of commands to type is not.

## 2. Generic first

State each principle so it fits any project. Body text stays project-neutral; everything concrete — repo names, file paths, real outputs — goes in an Example Box.

**Check:** remove every Example Box from the page. What remains must still teach the principle, and must name no Reference Repo.

## 3. Example Box format

An Example Box is a Material `example` admonition whose title starts with the Reference Repo it draws from — `crm`, `cc-otel`, or `this repo` — followed by an em dash and what the box shows:

```markdown
!!! example "crm — the Verification Medium is the CLI's test suite"
    `crm`, a command-line client for Microsoft Dynamics 365, ships behind
    `pytest`; the agent knows a change is done when the suite passes.
```

A box must stand alone for a reader who has never seen the Reference Repo — the Guide's audience knows none of them in advance. On the repo's first appearance on a page, the box body introduces it in one clause (what kind of project it is) before showing the principle.

**Check:** every Example Box carries exactly one Reference Repo label, the box shows a principle already stated generically in the body above it, and a reader who has never opened the Reference Repo can still say what the box proves.

## 4. Glossary compliance

Use each domain term as `CONTEXT.md` defines it, and keep its avoided synonyms out: write *the Guide*, never handbook or playbook; *Chapter*, never section; *Example Box*, never case study; *Verification Medium*, never definition of done; *Docs Lane*, never pipeline.

When a concept the page needs is missing from the glossary, that is a gap: resolve it through `/domain-modeling` so the term lands in `CONTEXT.md`, rather than coining wording in place.

**Check:** grep the diff for the avoided synonyms listed in `CONTEXT.md`; zero hits.

## 5. Public-repo hygiene

This repo is public. Every page must be safe to publish as-is:

- Placeholder hostnames and domains only (`example.com`, `contoso.crm.local`) — never internal ones.
- Placeholder identifiers — never real GUIDs, emails, tokens, or connection strings from a live system.
- Placeholder org data — invented customer names, invented record values, even inside Example Boxes drawn from a real Reference Repo.

**Check:** every hostname, GUID, email, and data value in the diff is one you invented for the page.
