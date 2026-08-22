<!-- markdownlint-disable MD041 -->
<span class="guide-kicker">Chapter 4 · Idea to plan</span>

# From idea to plan

Cheap implementation makes the plan the expensive part: as [Chapter 1](01-why-this-works.md) warned, a vague one ships working code that solves the wrong problem by lunchtime. So stop writing it alone — let the agent interview you, then cut the answers into a blueprint and its work orders.

![The idea-to-ship chain: an idea passes through the interview, research, and domain modeling into a spec, which is cut into tickets that feed the build loop](../assets/diagrams/idea-to-ship-chain.svg#only-light)
![The idea-to-ship chain: an idea passes through the interview, research, and domain modeling into a spec, which is cut into tickets that feed the build loop](../assets/diagrams/idea-to-ship-chain.dark.svg#only-dark)

*Planning is a chain: interview, research, and naming feed one blueprint, cut into work orders the build loop picks up.*

## 1. Facts are the agent's job; decisions are yours

Every question a planning session raises falls on one side of a line. A question of fact — what the platform supports, what the standard says — has an answer out in the world, so the agent fetches it instead of asking you. A question of decision — scope, trade-offs, acceptable risk — has none; someone has to make one. The interview ends when every open question is a decision, made and written down.

![Every question resolves one way or the other: a fact the agent fetches from the primary source, or a decision a human makes — and both land in the plan](../assets/diagrams/fact-or-decision.svg#only-light)
![Every question resolves one way or the other: a fact the agent fetches from the primary source, or a decision a human makes — and both land in the plan](../assets/diagrams/fact-or-decision.dark.svg#only-dark)

*Every question resolves one way or the other — the agent fetches the fact, a human makes the decision — both land in the plan.*

So do not brief the agent — let it grill you. An interview skill that pushes back relentlessly holds that line; the Guide's toolkit builds on Matt Pocock's [grilling skill](https://www.aihero.dev/skills-grill-with-docs).

!!! example "crm — protocol facts researched, scope decided"
    `crm`, a command-line client for Microsoft Dynamics 365, met both kinds
    when authentication was planned. What each deployment speaks — NTLM
    on-premises, OAuth in the cloud — is a fact, settled from vendor
    documentation. Whether to support both was a human decision, recorded.

## 2. Read the primary source, then write down what you found

Every plan rests on claims about the world outside the repo — what an API returns, what a format allows, what it costs. A model's trained knowledge is a snapshot that ages from the day it was taken, so "the agent remembers the API" is not evidence; the current documentation is. Research is its own step with its own deliverable: a findings file committed with its sources, which a [research skill](https://www.aihero.dev/skills-research) produces. Reading that stays in a session's context dies with it; the file becomes project memory every later session inherits.

!!! example "cc-otel — read the telemetry docs before the first report"
    `cc-otel`, a project that lands Claude Code usage telemetry in Power BI
    reports, hangs on one fact: which metrics and events Claude Code emits.
    The official telemetry documentation answered it, written down before
    the first report was designed — so later sessions build on verified
    names.

## 3. Name each concept the moment it appears

The interview and the research keep turning up concepts that need names. Name each one where it appears: define the term once in the shared phrasebook, list beside it the synonyms the project refuses, and write any system-shaping choice into the decision diary then and there. A [domain-modeling skill](https://www.aihero.dev/skills-domain-modeling) makes both moves routine; there is no modeling phase, only the rule. [Chapter 2](02-project-setup.md) scaffolded both files empty; planning is when they fill. Agents repeat back the vocabulary you give them, so a term pinned here reaches every page that follows.

## 4. The blueprint is a parent, not a work order

The decisions, the findings, and the settled vocabulary converge in one blueprint: the problem, the solution's shape, the decisions made — with the options rejected — and what is out of scope. It is the relay baton: the next session reads the decisions, never the chat that produced them, and a [to-spec skill](https://www.aihero.dev/skills-to-spec) drives the dialogue into it. But nothing builds the blueprint itself, so it never enters a queue.

## 5. Every work order is a tracer bullet

What enters the queue are work orders cut from it — a [to-tickets skill](https://www.aihero.dev/skills-to-tickets) does the cutting — and each is a **Tracer Bullet**: a thin slice through every layer that ends in something a check can see.

![A built band running across one layer ends in nothing a check can see; the same band running down through every layer ends in something a check can see](../assets/diagrams/tracer-bullet-slice.svg#only-light)
![A built band running across one layer ends in nothing a check can see; the same band running down through every layer ends in something a check can see](../assets/diagrams/tracer-bullet-slice.dark.svg#only-dark)

*The same amount built, turned ninety degrees: across one layer it reaches no check, down through all three it reaches one.*

Each work order carries its goal, the proof photo that shows it done, and pointers to the context it needs. Order lives in blocking edges, not in anyone's head, so "what can start now?" is a query against the job board.

!!! example "this repo — one blueprint, eight tracer bullets"
    In this repo — the Guide's own source — the spec is one parent issue
    holding the problem statement and every decision. Its tickets are
    sub-issues, one per Chapter, each shipping one page end to end. This
    page's ticket blocked on the one that built the shipping workflow:
    until that existed, no query would surface this page as ready.

## 6. Too foggy for a blueprint? Map the fog first

Some efforts resist a single interview: the unknowns interlock, each answer moving the others, and forcing a blueprint there only launders guesses. Map the effort instead, with a [wayfinder skill](https://www.aihero.dev/skills-wayfinder): a **Wayfinder Map** holds notes, the decisions so far, and the fog of open questions ahead.

![A wayfinder map: one map record holds notes, decisions-so-far, and the fog; each open question becomes a typed child — research, prototype, grilling — on the unblocked frontier, the frontier blocks the task whose work is already clear, and resolved children write their answers back to the map; when the fog is empty the map converges on a spec, or ships piecewise straight off the map](../assets/diagrams/wayfinder-map.svg#only-light)
![A wayfinder map: one map record holds notes, decisions-so-far, and the fog; each open question becomes a typed child — research, prototype, grilling — on the unblocked frontier, the frontier blocks the task whose work is already clear, and resolved children write their answers back to the map; when the fog is empty the map converges on a spec, or ships piecewise straight off the map](../assets/diagrams/wayfinder-map.dark.svg#only-dark)

*Each open question becomes a child typed by what resolves it, and every answer written back shrinks the fog.*

You buy information before you commit, and the map either converges on a blueprint or ships work piecewise off itself. Either way the plan ends as work orders an agent can build without you in the room — where [Chapter 5](05-implementation.md) starts.

## Real names

Each picture above, in real terms:

| The picture | The real name |
| --- | --- |
| The blueprint | The **spec** |
| The work order | A **ticket** — one self-contained unit of work |
| The relay baton | The **Handoff Artifact** |
| The proof photo | The **Verification Medium** |
| The shared phrasebook | `CONTEXT.md`, the glossary |
| The decision diary | The ADR log |
| The job board | The issue tracker |
