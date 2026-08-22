<!-- markdownlint-disable MD041 -->
<span class="guide-kicker">Chapter 5 · Turning the crank</span>

# Implementation

Building with an agent needs no new method: test-first, one workspace per job, small diffs, deep modules — disciplines your team already has. The agent runs them at machine speed, so each one compounds on every iteration, or collapses faster than a human could.

## 1. The tightest loop is a test that fails first

Loops come in radii: a failing test answers in seconds, the build gate in minutes, CI and review in hours, telemetry in days. The agent turns the crank on the innermost loop it has, so the discipline that hands it a seconds-long loop wins by default — and a [tdd recipe card](https://www.aihero.dev/skills-tdd) makes red, green, refactor the default shape of the work.

![Agent feedback loops: a change flows out through the failing test, the local build gate, CI and review, and production telemetry, and each gate returns on a longer loop — seconds, minutes, hours, days.](../assets/diagrams/agent-feedback-loops.svg#only-light)
![Agent feedback loops: a change flows out through the failing test, the local build gate, CI and review, and production telemetry, and each gate returns on a longer loop — seconds, minutes, hours, days.](../assets/diagrams/agent-feedback-loops.dark.svg#only-dark)

*The tighter the gate, the more iterations fit in one session.*

Order matters as much as radius. A test written first is the work order translated into something that runs, so **"done" becomes red turning green, not the agent's own claim**. Written afterwards by the agent that wrote the code, it checks what the code does — and passes by construction.

!!! example "crm — the work order, restated as a run"
    `crm`, a command-line client for Microsoft Dynamics 365, ships every
    change behind `pytest`. A new operation starts as a test calling the
    not-yet-existing command — red — and the agent builds until the run
    turns green.

## 2. One work order, one workspace

Agents run in parallel; a working tree does not. Two sessions in one checkout leak half-written state into each other — diffs mix, one gate checks two work orders at once, and **neither session can trust what it verified**. Git ships the fix: [worktrees](https://git-scm.com/docs/git-worktree), one repository, many working directories.

![One checkout shared by two sessions mixes their diffs, so the gate checks both work orders at once; one worktree per session gives each gate exactly one work order's diff.](../assets/diagrams/one-work-order-one-workspace.svg#only-light)
![One checkout shared by two sessions mixes their diffs, so the gate checks both work orders at once; one worktree per session gives each gate exactly one work order's diff.](../assets/diagrams/one-work-order-one-workspace.dark.svg#only-dark)

*Share a checkout and one gate checks two work orders at once; isolate, and every gate sees exactly one.*

It is also what makes [Chapter 7](07-review-and-merge.md)'s review axis mean anything: one workspace per work order is what keeps a diff readable as one.

!!! example "this repo — every Chapter builds in its own worktree"
    In this repo — the Guide's own source, and one of its Reference Repos —
    the Docs Lane creates a worktree named for the ticket's branch before it
    writes a line. This page was written in one, and the strict build that
    gated it saw one ticket.

## 3. Every line traces to the work order

An agent asked to fix one thing will happily improve five more, and the rule still says no: **a change contains only lines that trace to its work order.** Match the surrounding style; record an adjacent problem as a new work order. The rule lives on the note taped to the desk from [Chapter 2](02-project-setup.md), and the why is where the cost moved: implementation is cheap now, review attention is not, and every extra line bills the reviewer for noise.

!!! example "this repo — the Spec axis reads every diff against the ticket"
    The Docs Lane reviews each diff along two axes before merge. The Spec
    axis asks one question of every change: what in the ticket requires it?
    A line that maps to nothing blocks the auto-merge.

## 4. Module depth is the agent's range

[Chapter 1](01-why-this-works.md) said an agent struggles exactly where a new hire would; module depth is what that cashes out to. A deep module — small interface, rich behavior behind it, in Ousterhout's sense in [*A Philosophy of Software Design*](https://web.stanford.edu/~ouster/cgi-bin/book.php) — lets the agent work at the surface: it reads the interface, calls it, and the implementation never enters its context. A shallow module hides nothing, so the agent reads through it, and through whatever that touches, until [fresh legs fade](03-equipping-the-agent.md#size-the-work-to-the-smart-zone).

![A deep module lets the agent read one interface and stop; a shallow one makes it read through to what the interface hides, and through what that touches.](../assets/diagrams/module-depth-range.svg#only-light)
![A deep module lets the agent read one interface and stop; a shallow one makes it read through to what the interface hides, and through what that touches.](../assets/diagrams/module-depth-range.dark.svg#only-dark)

*How deep the modules are is how far the agent can navigate before it drowns.*

Agent-written code drifts shallow on its own — one more wrapper, one more layer that hides nothing — because each shallow addition is the easy next token. The counterweight is the refactor beat plus a [codebase-design recipe card](https://www.aihero.dev/skills-codebase-design) to judge interfaces by.

!!! example "crm — seventy commands ride one deep engine"
    `crm` keeps every operation in its own module over one shared core
    engine, and the engine is deep: one call sends a request, and everything
    behind it — authentication, retries, paging — stays hidden. Adding a
    command means reading that interface, never the internals.

## 5. From built to verified

A work order built this way ends with tests green, the diff surgical, and the design no shallower than it started. What it lacks is the proof photo in the project's own terms — and not every project's truth fits in an assertion. Choosing that proof is [Chapter 6](06-validation.md).

## Real names

Every picture this Chapter used, anchored to its real term:

| The picture | The real name |
| --- | --- |
| The work order | The ticket — one unit of specified work |
| The recipe card | A skill — reusable instructions the agent loads on demand |
| The note taped to the desk | `CLAUDE.md` — standing project instructions |
| Fresh legs | The **Smart Zone** — the early session where quality stays sharp |
| The proof photo | The **Verification Medium** |
