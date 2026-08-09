# Project setup

An agent begins every session knowing nothing but what the project can tell it. [Chapter 1](01-why-this-works.md) argued that structure must be legible to a newcomer; this Chapter is the scaffold that makes it so — six artifacts you can set up in one sitting, before the first feature. Together they are the project's memory: everything the agent needs that the code itself cannot say. None of them is new invention. Each is a document or a check your team arguably should have kept anyway; the agent just turns "should" into "must".

## Give the agent a front door: CLAUDE.md

Every project needs one file the agent reads at the start of every session: what the project is, what the goal is, which rules always apply, and where to look for everything else. In Claude Code that file is `CLAUDE.md` at the repo root, loaded automatically into every conversation — the mechanics live in the [memory docs](https://code.claude.com/docs/en/memory).

Because it rides along on every single prompt, its size is a tax on every piece of work the agent does. The discipline that follows: keep it to standing rules and pointers, not prose. State the goal, name the doctrine, then link to the deeper docs — the agent reads those on demand, when the task actually touches them. A front door is not a library; it is a sign telling you which room to enter.

!!! example "this repo — a front door of pointers"
    This repo — the Guide's own source, and one of its Reference Repos — keeps
    its `CLAUDE.md` to two screens: the goal (the Guide, its build gate), the
    editorial doctrine, and one-line pointers to separate agent docs for the
    issue tracker, triage labels, domain docs, docs tooling, and the Docs
    Lane. An agent shipping a ticket loads the two screens always, and the
    tracker conventions only when it touches the tracker.

## Name things once: the CONTEXT.md glossary

Agents mirror the vocabulary you give them. If the project calls the same concept three names, the agent will use all three — in code, in issues, in docs — and every future reader, human or agent, pays for the ambiguity. So the second artifact is a ubiquitous-language glossary: each domain term defined once, and, just as important, the synonyms the project refuses to use listed next to it.

The avoided-synonym list is what turns vocabulary from taste into a check. "Use consistent terminology" is unenforceable; "these five words never appear" is a grep. Keep the glossary in a `CONTEXT.md` at the repo root, and grow it through the work itself — when a page or a spec needs a concept the glossary lacks, that is the moment to define it, not to coin wording in place.

!!! example "this repo — synonyms you can grep for"
    This repo's `CONTEXT.md` defines the Guide's terms — a top-level page is a
    *Chapter*; the evidence an agent checks itself against is the
    *Verification Medium* — and beside each term lists the near-synonyms the
    project refuses to use.
    The writing standards turn that list into a mechanical check: grep the
    diff for avoided synonyms, pass on zero hits.

## Write decisions down: the ADR log

Chapter 1 made the point that an agent applies no architectural judgment of its own — it follows the structure it is given. The same holds for decisions. An agent that cannot see *why* the project chose its database, its delivery format, or its merge policy will sooner or later relitigate the choice, or quietly contradict it. Sessions are short-lived; a decision that lives only in a past conversation is a decision the next session never made.

The remedy is the architecture decision record: a short file per decision stating the choice, the why, and the options rejected. Keep them in `docs/adr/`, numbered, immutable once accepted. The payoff is asymmetric — a decision takes five minutes to record and saves every future session the cost of rediscovering or undoing it. Agents are told to flag conflicts with an ADR rather than silently override it, which converts "the agent went rogue" into a reviewable, explicit disagreement.

!!! example "this repo — an ADR that ends a debate before it starts"
    ADR-0002 in this repo records that the Docs Lane auto-merges: after review
    passes, the agent merges its own PR, because a docs-only repo has a low
    blast radius and the strict build plus two-axis review already catch what
    a human gate would. Any agent (or human) arriving with the usual
    expectation of a human merge gate finds the deviation recorded, reasoned,
    and settled — it ships through Auto-merge instead of "fixing" the lane.

## Let the tracker remember: issues as agent memory

The issue tracker is the project's long-term memory, and agents make that literal. A session is ephemeral; the tracker persists. Work should arrive as issues shaped so that a fresh session — no chat history, no human nearby — can pick one up and build it: the goal, the checks that prove it done, and explicit blocking edges to the work it depends on. A ticket that meets this bar is self-contained; everything short of it is archaeology the agent must perform before it can start.

The same record works in both directions. Closed issues, their comments, and the PRs that closed them are durable answers to "why is the code like this?" — searchable by the next session the way tribal knowledge never is. The tool is whichever tracker your team already runs, with one requirement: the agent must be able to operate it end to end — read, comment, label, close — from the command line or an API.

!!! example "this repo — this Chapter was a ticket"
    The page you are reading arrived as a ticket in this repo's GitHub
    Issues: a sub-issue of the Guide's spec, carrying its goal, the checks
    that prove it done, and a blocking edge to the Docs Lane ticket it needed
    first. When its label said ready, an agent claimed it, wrote the page,
    and shipped it — with the whole trail left in the tracker as memory.

## One standards doc, every reviewer derives from it

Quality rules multiply hiding places: a style guide here, a review checklist there, a lint config nobody reads, and the strongest opinions living in one reviewer's head. Copies drift, and an agent reviewer — which follows rules literally — will enforce whichever copy it happened to read. The fix is structural: one canonical standards document, and every reviewer, human or agent, *derives* its checklist from that document rather than owning a private copy.

This changes what a review disagreement means. When two reviewers disagree, the question is no longer who outranks whom but what the standards doc actually says — and if the doc is silent, the fix is a change to the doc, which upgrades every future review at once. Write each rule with its check: what a reviewer looks at, and what passing looks like.

!!! example "this repo — the Standards axis reads one file"
    This repo's `docs/contributing/writing-standards.md` is the canon: five
    rules, each ending in an explicit **Check** a reviewer can run against a
    diff. The Docs Lane's review runs two axes — Spec (does the change match
    the ticket?) and Standards — and the Standards axis derives from exactly
    that file. Sharpening a rule there retunes every review after it.

## Guardrails in hooks, not prompt text

The last artifact is a boundary line: any rule a machine can check should be enforced by a machine, not written into the agent's instructions. A prompt-text rule is probabilistic — usually followed, sometimes not, and silently so. A hook is deterministic: it fires on every matching action, costs nothing from the context window, and cannot forget. Formatting, lint, spelling, commit hygiene — none of these deserve a sentence in `CLAUDE.md` when a hook can own them outright.

The division of labor that results is the one to aim for: instructions carry judgment (what to build, what wins when principles conflict), hooks and gates carry mechanics (what a formatter or linter can decide). In Claude Code, [hooks](https://code.claude.com/docs/en/hooks) attach to events such as "after the agent edits a file"; the same checks then run again as CI gates, so nothing depends on the agent remembering anything. Every rule moved from prose to a hook makes the front door shorter and the enforcement stronger at the same time.

!!! example "this repo — formatting the agent never thinks about"
    In this repo, a hook runs the markdown autoformatter on every file the
    agent edits or writes, and CI runs the same linter as a gate on every PR
    — both reading one shared config, so fixer and gate cannot drift.
    `CLAUDE.md` says nothing about formatting; no prompt asks the agent to
    remember indentation rules. The machine owns the rule, so no session can
    break it.

## The one-sitting scaffold

Six artifacts, one afternoon: a `CLAUDE.md` front door of pointers, a `CONTEXT.md` glossary with avoided synonyms, an ADR log, a tracker the agent can operate with self-contained tickets, one canonical standards doc, and hooks owning every mechanical rule. Scaffold them thin and let the work fill them in — an empty glossary and a two-entry ADR log are healthy signs of a young project, not gaps to backfill speculatively.

The scaffold is memory; the next step is capability. [Chapter 3](03-equipping-the-agent.md) equips the agent that walks through this front door — skills, documentation access, and the tools it needs to act.
