<!-- markdownlint-disable MD041 -->
<span class="guide-kicker">Chapter 2 · The scaffold</span>

# Project setup

An agent starts every session knowing the code and whatever the project wrote down. So the project keeps its memory in files: six of them, set up in one sitting, before the first feature.

## 1. The note taped to the desk is read every time

One file says what the project is, which rules always apply, and where to look for the rest. In Claude Code that file is `CLAUDE.md` at the repo root, loaded into every conversation — the [memory docs](https://code.claude.com/docs/en/memory) have the mechanics.

Because it rides along on every prompt, its length taxes every piece of work. So the note carries standing rules and pointers, never prose: the goal, the doctrine, and links the agent opens when a task needs them.

![The note rides along on every prompt; the docs it points at are read only when a task touches them.](../assets/diagrams/note-on-every-prompt.svg#only-light)
![The note rides along on every prompt; the docs it points at are read only when a task touches them.](../assets/diagrams/note-on-every-prompt.dark.svg#only-dark)

*The note rides along on every prompt; the docs it points at are read only when a task touches them.*

!!! example "this repo — a note of pointers"
    This repo — the Guide's own source — keeps its `CLAUDE.md` to two screens:
    the goal, the build gate, the doctrine, and pointers to separate agent
    docs. A session loads the two screens always, the tracker conventions only
    when it touches the tracker.

## 2. The shared phrasebook names each thing once

Agents mirror the vocabulary they are given. Call one concept three names and the agent uses all three. So the phrasebook defines each domain term once, and lists beside it the near-synonyms the project refuses.

That refusal list turns vocabulary into a check: "use consistent terminology" is unenforceable, "these five words never appear" is a grep. Keep it in a `CONTEXT.md` at the repo root and grow it through the work: a missing term gets defined when a page needs it.

## 3. The decision diary outlives the conversation

An agent brings no architectural judgment of its own; it follows the structure it is given, and decisions are structure. A decision that lives only in a past conversation is one the next session never made — so it gets relitigated, or quietly contradicted.

The diary is one short file per decision — the choice, the why, the options rejected — numbered and immutable once accepted. Agents flag a conflict with an entry instead of overriding it — "the agent went rogue" becomes a reviewable disagreement.

!!! example "this repo — a diary entry that ends a debate before it starts"
    ADR-0002 in this repo records that the Docs Lane merges its own work: a
    docs-only repo has a low blast radius, and the strict build plus the review
    axes catch what a human gate would.

## 4. The job board remembers what the session forgets

Work arrives as work orders on a job board, each shaped so a fresh session can pick it up: the goal, the checks that prove it done, the blocking edges. Anything less is archaeology before the work starts.

The record works backwards too: closed work orders answer "why is the code like this?". Use whichever tracker the team runs, with one requirement: the agent can operate it end to end from a command line or an API.

![A session's context ends with it; the job board keeps the work order and the answer for the next one.](../assets/diagrams/tracker-as-memory.svg#only-light)
![A session's context ends with it; the job board keeps the work order and the answer for the next one.](../assets/diagrams/tracker-as-memory.dark.svg#only-dark)

*A session's context ends with it; the job board keeps the work order and the answer for the next one.*

!!! example "this repo — this Chapter was a work order"
    The page you are reading arrived as a work order in this repo's GitHub
    Issues: a sub-issue of the Guide's spec, with its goal, its checks, and a
    blocking edge. An agent claimed it and left the trail on the board.

## 5. One standards doc, and every reviewer derives from it

Quality rules multiply hiding places: a style guide, a review checklist, a lint config nobody reads, one reviewer's strongest opinions. Copies drift, and an agent reviewer follows whichever copy it read — so keep one canonical standards document, and have every reviewer derive its checklist from it.

That changes what a disagreement means: not who outranks whom, but what the document says — and when it is silent, the fix is a change to it.

!!! example "this repo — the Standards axis reads one file"
    This repo's `docs/contributing/writing-standards.md` is the canon: five
    rules, each ending in an explicit **Check** a reviewer runs against a diff.
    The Docs Lane derives its Standards axis from that file.

## 6. House rules belong to the machine

Any rule a machine can check belongs to the machine, not to the agent's instructions. A rule in prose is probabilistic — usually followed, sometimes not, and silently so. A house rule is deterministic: it fires on every matching action, costs nothing from the context window, and cannot forget.

![The same rule, two homes: carried in prose it is usually followed, owned by a house rule it fires on every edit.](../assets/diagrams/house-rule-vs-prompt-text.svg#only-light)
![The same rule, two homes: carried in prose it is usually followed, owned by a house rule it fires on every edit.](../assets/diagrams/house-rule-vs-prompt-text.dark.svg#only-dark)

*The same rule, two homes: carried in prose it is usually followed, owned by a house rule it fires on every edit.*

So instructions carry judgment — what wins when principles conflict — and house rules carry mechanics. In Claude Code, [hooks](https://code.claude.com/docs/en/hooks) attach to events such as "after the agent edits a file", and CI runs the same checks. Every rule moved out of prose makes the note shorter and the enforcement stronger.

!!! example "this repo — formatting the agent never thinks about"
    In this repo a house rule runs the markdown autoformatter on every file the
    agent edits, and CI runs the same linter on every pull request — one shared
    config, so fixer and gate cannot drift.

## 7. Scaffold it thin, then walk through the door

Six artifacts, one sitting: a note of pointers, a phrasebook with its refusals, a decision diary, a job board of self-contained work orders, one standards doc, and house rules for the mechanical rules. Scaffold them thin and let the work fill them: an empty phrasebook is a sign of a young project, not a gap.

The scaffold is memory; capability is next. [Chapter 3](03-equipping-the-agent.md) equips the agent that walks in.

## Real names

Every picture this Chapter used, anchored to its real term:

| The picture | The real name |
| --- | --- |
| The note taped to the desk | `CLAUDE.md` — standing project instructions |
| The shared phrasebook | `CONTEXT.md` — the project glossary |
| The decision diary | The ADR log |
| The job board | The issue tracker |
| A work order | One issue: goal, checks, blocking edges |
| A house rule | A hook — a check the harness fires on an event |
