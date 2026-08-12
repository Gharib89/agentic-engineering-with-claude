# Review and merge

[Chapter 6](06-validation.md) ended with a ticket that carries evidence: the highest rung of the ladder green, verdicts machine-readable, blind spots covered. What no check can supply is judgment — whether the change should exist, whether it reads the way the codebase reads, whether it means what the ticket meant. Review supplies that, and agents raise its stakes twice over: implementation is now so cheap that the merge gate is where wrong-but-working changes must be stopped, and code now lands faster than the team can learn it. This Chapter is about both pressures — landing changes **understood, not just green**.

## Judge the diff twice, against two different documents

A single read of a diff answers a blurred question — "does this look right?" — and a blurred question invites a shallow pass. The two judgments hiding inside it have different references and fail independently: a change can do exactly what the ticket asked while breaking every convention the project wrote down, and a beautifully conventional change can quietly miss half the ticket.

The principle: **review every diff along two independent axes, each against its own written reference.** The *Spec axis* reads the diff against the ticket: everything asked for is present, nothing beyond it snuck in. The *Standards axis* reads the same diff against the project's documented rules: naming, structure, style, the conventions [Chapter 2](02-project-setup.md) wrote into the project's context files. Run both as self-review — before any other reviewer, human or bot, sees the change — and run each in a fresh context rather than the one that wrote the diff, because the author's context believes in its own change. The axes only exist if their references do: a ticket too vague to review against is a planning failure ([Chapter 4](04-from-idea-to-plan.md)), and an unwritten standard cannot be an axis at all. A [code-review skill](https://www.aihero.dev/skills-code-review) packages the two-axis pass so every session runs it the same way.

!!! example "this repo — the ticket on one axis, the writing standards on the other"
    In this repo — the Guide's own source, and one of its Reference Repos —
    every Chapter ships through a two-axis review before its PR opens. The
    Spec axis checks the diff against the GitHub ticket that ordered the
    page; the Standards axis checks it against the
    [writing standards](../contributing/writing-standards.md) — depth,
    generic-first, glossary compliance. The page you are reading was judged
    on both axes, by a reviewer agent that did not write it.

## Give every reviewer a lane and the loop an exit

Automated reviewers are cheap to add, so they accumulate — a style bot, a security scanner, a spec checker, each raising findings in its own voice. Unmanaged, they fail in two directions at once: overlapping bots contradict each other on the same line, and a review loop with no defined end either runs forever or gets skipped entirely the first time a deadline hits.

The principle: **every reviewer owns an explicit lane, and the loop has a defined convergence condition.** A lane is a named scope plus the reference document it judges against — one bot, one axis, no freelancing outside it. Convergence is just as explicit: every finding is either *fixed*, after which the gates from [Chapter 6](06-validation.md) re-run, or *dispositioned* — declined with a written reason that stays visible, so the same finding does not resurface every round. Review converges when every lane reports clean or dispositioned. Without the written disposition, the loop has no memory; without the convergence condition, it has no exit.

!!! example "this repo — fix it or say why not, then re-run the gate"
    The Docs Lane — this repo's shipping workflow — defines convergence in
    one sentence of its skill: fix every finding or disposition it with a
    reason, then re-run `mkdocs build --strict`. A run cannot open its PR
    while a finding sits in limbo: every finding is fixed and re-gated, or
    declined with its reason on record.

## The human merge gate — and when to drop it

The merge gate is the last moment judgment can stop a change, and a human holding it is the default for good reason: past the gate, the change is in the product, the history, and every future agent's context. But agents compress everything upstream of the gate, so the queue in front of the one human grows — and the quiet failure is not the bottleneck, it is the rubber stamp. A human who approves faster than they can read has already dropped the gate without recording the decision.

The principle: **keep the human merge gate by default; drop it only as a recorded, revisitable decision.** Dropping it honestly requires three conditions at once: the blast radius is low, the Verification Medium plus the review lanes already catch what the gate's human would, and the human stays in the loop at a higher level — shaping specs and tickets rather than approving diffs. Record the decision and its limits as an ADR, so the day the conditions stop holding, the decision visibly stops holding too.

!!! example "crm — a live system keeps its gate"
    `crm`, a command-line client for Microsoft Dynamics 365, ends every ship
    at a human merge gate. Its changes execute against live business systems
    — real records, real integrations — so the blast radius alone fails the
    test, however green the end-to-end suite runs. The agent builds,
    verifies, and opens the PR; a human decides what merges.

!!! example "this repo — Auto-merge, with its limits written down"
    This repo's Docs Lane merges with no human at the gate: after review and
    CI pass, the agent squash-merges on its own. The decision is recorded as
    [ADR-0002](../adr/0002-auto-merge-docs-lane.md),
    and it leans on all three conditions: a docs-only repo has no runtime
    and no user data, the strict build plus two-axis review cover what a
    human gate would catch, and the human steers at the spec and ticket
    level. The same ADR names the revisit trigger — the day this repo grows
    executable surface, the decision must be revisited before that surface
    ships through the lane.

## Quiz before merge

Every merge you cannot explain widens the gap between what the repository contains and what the team understands — and the gap compounds, because next week's review is done by someone who did not understand this week's change. Green checks measure the change; nothing above measures *you*. Left alone, an agent-speed lane turns its humans into spectators of their own codebase.

The principle: **before a change merges, prove a human still understands it — by making the agent quiz you on the diff.** Flip the usual roles: instead of you interrogating the change, the agent that wrote it asks the questions — why does the change take this shape, what breaks if this line goes, where would the next feature touch. Answering takes minutes; failing to answer is a verdict, and the response is to read until you pass, not to merge anyway. The quiz is a gate artifact like any other: the change lands green *and* understood, and the human who approved it can still steer the next one.

!!! example "this repo — a lane with no one to quiz"
    The Docs Lane's Auto-merge means no human stands at the PR, so there is
    no one to take a quiz — per-page knowledge decay is a cost the lane
    accepts. What ADR-0002 does record is the counterweight: the human
    stays in the loop at the spec and ticket level, shaping every page
    before an agent writes it. Understanding is checked against the
    published Chapter, not the diff — which works precisely because the
    pages *are* the product.

## From merged to running

A merged change is judged, understood, and still invisible: nothing a user touches has changed yet. Delivery is what turns the repository's state into the product's state, and operating what you delivered is where the next idea comes from. [Chapter 8](08-delivery-and-operations.md) closes the loop.
