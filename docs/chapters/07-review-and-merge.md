<!-- markdownlint-disable MD041 -->
<span class="guide-kicker">Chapter 7 · The last look</span>

# Review and merge

[Chapter 6](06-validation.md) handed the work order its proof photo: the checks are green. Green says the change works — it never says the change should exist, reads the way the codebase reads, or means what the work order meant.

## 1. Read the diff twice, against two different documents

One read asks one blurred question: "does this look right?" Two questions hide inside it and fail independently: a change can do all the work order asked while breaking every written rule. So **read it twice, each pass against its own document**: the *Spec axis* against the work order, the *Standards axis* against the rules from [Chapter 2](02-project-setup.md).

![One read lands on nothing but the question it asked; two passes each land on one document — the work order and the written rules.](../assets/diagrams/two-axis-review.svg#only-light)
![One read lands on nothing but the question it asked; two passes each land on one document — the work order and the written rules.](../assets/diagrams/two-axis-review.dark.svg#only-dark)

*One read asks a blurred question; two passes each ask one question of one document.*

An axis needs its document: a work order too vague to check is a planning failure ([Chapter 4](04-from-idea-to-plan.md)); an unwritten rule is no axis at all. Run both as self-review in a fresh session: the context that wrote it believes in it. A [code-review recipe card](https://www.aihero.dev/skills-code-review) runs both the same way.

## 2. Every reviewer gets one lane, and every finding gets one of two doors

Automated reviewers are cheap, so they pile up — a style bot, a security scanner, a spec checker, each in its own voice. So **give every reviewer one lane, and every finding one of two doors**: a lane is a named scope plus the single document it judges against, and the doors are *fixed*, which re-runs [Chapter 6](06-validation.md)'s gates, or *dispositioned* — declined with a written reason that stays visible.

![A finding raised in a lane leaves by one of two doors — fixed, which re-runs the gates, or declined with its reason on record — and review ends only once none is left between them.](../assets/diagrams/finding-two-doors.svg#only-light)
![A finding raised in a lane leaves by one of two doors — fixed, which re-runs the gates, or declined with its reason on record — and review ends only once none is left between them.](../assets/diagrams/finding-two-doors.dark.svg#only-dark)

*Two doors are what let review end: fixed and re-gated, or declined with its reason on record.*

Without the written reason the loop has no memory, and the same finding returns every round; without the two doors it has no exit at all.

!!! example "this repo — fix it or say why not, then re-run the gate"
    This repo — the Guide's own source, and one of its Reference Repos —
    keeps that exit in one sentence of its conveyor belt's recipe card: fix
    every finding or disposition it, then re-run `mkdocs build --strict`.

## 3. The gatekeeper leaves only by recorded decision

Past the merge gate the change is in the product, the history, and every future agent's context, so a human standing there is the default. Agents make everything upstream cheap, so the queue in front of that one human grows — and the quiet failure is the rubber stamp, not the queue. Dropping the gate honestly takes three conditions at once: low blast radius, a proof photo and review lanes that already catch what that human would, and a human still steering upstream instead of approving diffs.

![Three conditions — low blast radius, the proof photo covering it, a human steering upstream — converge on one junction: all three holding gives a green light with no gatekeeper, any one failing puts the gatekeeper back.](../assets/diagrams/merge-gate-conditions.svg#only-light)
![Three conditions — low blast radius, the proof photo covering it, a human steering upstream — converge on one junction: all three holding gives a green light with no gatekeeper, any one failing puts the gatekeeper back.](../assets/diagrams/merge-gate-conditions.dark.svg#only-dark)

*The green light stands on three conditions at once; the one that stops holding puts the gatekeeper back.*

So **write the swap and its limits in the decision diary**, and the day one condition stops holding, the green light visibly stops too.

!!! example "crm — a live system keeps its gatekeeper"
    `crm`, a command-line client for Microsoft Dynamics 365, ends every ship
    at a human. Its changes run against live business systems — real records,
    real integrations — so the blast radius alone fails the first condition,
    however green the suite runs.

!!! example "this repo — a green light with its limits written down"
    This repo's conveyor belt merges with nobody at the gate, recorded as
    [ADR-0002](../adr/0002-auto-merge-docs-lane.md): no runtime and no user
    data, the strict build plus the two axes covering what a human would, the
    human steering at blueprint level. The same entry names the revisit
    trigger — the day this repo grows executable surface.

## 4. Prove a human still understands what merged

Every merge nobody can explain widens the gap between what the repository holds and what the team knows — and it compounds: next week's review falls to someone who missed this week's change. The checks measure the change; nothing above measures *you*. So **flip the roles before merge — let the agent that wrote the diff quiz you on it**: why this shape, what breaks without this line. Failing to answer is a verdict; the response is to read until you pass, not to merge anyway. Where nobody stands at the gate, nobody takes the quiz either — so the counterweight moves upstream, into the blueprint.

## 5. From merged to running

A merged change is judged, understood — and still invisible: nothing a user touches has changed yet. Turning the repository's state into the product's state, then operating what you shipped, is [Chapter 8](08-delivery-and-operations.md).

## Real names

Every picture this Chapter used, anchored to its real term:

| The picture | The real name |
| --- | --- |
| The work order | A ticket |
| The blueprint | The **spec** |
| The proof photo | The **Verification Medium** |
| The decision diary | The ADR log |
| The recipe card | A **skill** |
| A lane | One reviewer's scope, plus the document it judges against |
| The two doors | Fixed, or dispositioned with a written reason |
| The green light with no gatekeeper | **Auto-merge** |
| The conveyor belt | The **Docs Lane** |
