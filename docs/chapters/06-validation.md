<!-- markdownlint-disable MD041 -->
<span class="guide-kicker">Chapter 6 · The proof photo</span>

# Validation

A change is done when the project's own evidence says so: the proof photo, taken by the agent, not by you. This Chapter is about choosing that photo, making its verdict machine-readable, and sharpening it as the project shows you where it lies.

## 1. The proof photo is the best one the agent can take alone

Evidence climbs rungs: a type check proves coherence in milliseconds, a unit test proves one unit does what its author meant, an end-to-end run proves the assembled system behaves, a live instance proves the change survives reality.

![The verification ladder: types prove coherence in milliseconds, unit tests prove intent in seconds, end-to-end runs prove behavior in minutes, a live instance proves reality — evidence strengthens climbing up, feedback cheapens climbing down](../assets/diagrams/verification-ladder.svg#only-light)
![The verification ladder: types prove coherence in milliseconds, unit tests prove intent in seconds, end-to-end runs prove behavior in minutes, a live instance proves reality — evidence strengthens climbing up, feedback cheapens climbing down](../assets/diagrams/verification-ladder.dark.svg#only-dark)

*Climbing up buys stronger proof; climbing down buys faster answers.*

So **your Verification Medium is the highest rung the agent can climb with no human in the loop.** Low rungs come nearly free; top rungs are an investment, and each project's truth sits on a different one — so the rung is a planning call, made while the spec is drawn ([Chapter 4](04-from-idea-to-plan.md)).

!!! example "this repo — a strict build below, the live site above"
    In this repo — the Guide's own source, and one of its Reference Repos —
    two rungs carry the work: `mkdocs build --strict` in seconds, and the
    published site, fetched after every merge.

## 2. A verdict has three answers, not two

Pass and fail are one value short: *your change is wrong* and *the instrument broke* wear the same red, and an agent that cannot tell them apart burns its fresh legs rewriting code that was never broken.

![Two faults, a failed assertion and an unreachable host, both report exit 1 on the left, and that one verdict routes to rewriting the code; on the right each fault reports its own exit code, routing one to fixing the change and the other to fixing the instrument.](../assets/diagrams/three-valued-verdict.svg#only-light)
![Two faults, a failed assertion and an unreachable host, both report exit 1 on the left, and that one verdict routes to rewriting the code; on the right each fault reports its own exit code, routing one to fixing the change and the other to fixing the instrument.](../assets/diagrams/three-valued-verdict.dark.svg#only-dark)

*One red for both faults sends the agent after working code; a verdict per fault routes each to its real fix.*

So **make every check answer three ways — clean, your bug, instrument broken — in signals a program can route on.** Distinct exit codes are the classic tool; documented output markers work where exit codes are taken. Each class has one next move: proceed, fix the change, or fix the instrument — never the code.

!!! example "crm — an expired token is not a failing command"
    `crm`, a command-line client for Microsoft Dynamics 365, runs its
    end-to-end suite against a live sandbox that can itself fail. Its
    harness reports "could not reach the instance" apart from "the assertion
    failed", so a lapsed token flags the environment instead of rewriting a
    working command.

## 3. Every instrument has a blind spot

One instrument measures one dimension, and whatever it cannot see, the agent will break with every check still green. A test suite is blind to layout; a screenshot is blind to the numbers behind the pixels. That blind spot is a property of the instrument, not a defect to remove.

![On the left one instrument measures the numbers while the layout goes unmeasured, and the check still reports green; on the right a second instrument measures the layout, so green means both dimensions held.](../assets/diagrams/paired-instruments.svg#only-light)
![On the left one instrument measures the numbers while the layout goes unmeasured, and the check still reports green; on the right a second instrument measures the layout, so green means both dimensions held.](../assets/diagrams/paired-instruments.dark.svg#only-dark)

*Two cheap instruments with different blind spots beat one stretched into an oracle.*

So **name what your medium cannot see, then close the gap with a second instrument.** Write the pair into the note taped to the desk, so the loop is "both checks pass" — not "the check I reached for passes".

!!! example "cc-otel — a screenshot cannot read the numbers"
    `cc-otel`, a telemetry project landing Claude Code usage data in Power BI
    reports, verifies visually: the agent renders a report page and inspects
    the screenshot ([Chapter 3](03-equipping-the-agent.md) built that bridge).
    But a page can look right around a wrong total, so a second headless
    check compares the figures numerically.

## 4. Write down the day green lied

Even a well-built medium returns verdicts true on their own terms and false about the work: the build passes while the page renders broken, the screenshot looks right at the wrong size. Each lie is repeatable, so one found the hard way returns every session unless somebody writes it down.

So **record each known lie next to the check it belongs to, the day it is found** — on the note taped to the desk, wherever the agent already reads. The entry says when green is not proof and which extra evidence covers the gap; a medium is sharpened one recorded lie at a time.

!!! example "this repo — a green build around a broken page"
    `mkdocs build --strict` verifies structure, not rendering: an admonition
    body indented three spaces instead of four builds clean and renders as a
    plain paragraph. That lie lives in the repo's
    [docs-tooling notes](../agents/docs-tooling.md), and it is why diagram
    work carries its own render check.

## 5. From verified to reviewed

A work order that reaches here carries evidence, not claims: the highest rung green, verdicts three-valued, blind spots paired over, known lies on record. What it lacks is judgment — no check can say whether the change should exist, or matches what the work order meant. [Chapter 7](07-review-and-merge.md) is that gate, and it gets stronger as everything else speeds up.

## Real names

Every picture this Chapter used, anchored to its real term:

| The picture | The real name |
| --- | --- |
| The proof photo | The **Verification Medium** |
| The ladder | The rungs of evidence a project can check |
| The work order | The ticket |
| The note taped to the desk | `CLAUDE.md` — standing project instructions |
| Fresh legs | The **Smart Zone** |
