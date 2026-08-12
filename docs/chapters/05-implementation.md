# Implementation

[Chapter 4](04-from-idea-to-plan.md) ended with tracer-bullet tickets an agent can build from a fresh session. This Chapter is the build itself — and it holds no new methodology. The disciplines that keep agent-written code maintainable are the ones your team already knows: test-first development, isolated workspaces, minimal diffs, deep modules. What changes is who runs them. The agent executes each discipline at machine speed, which means each one either compounds or collapses — a good habit pays out on every iteration, and a skipped one corrupts the codebase faster than a human ever could.

## TDD: the agent's tightest feedback loop

[Chapter 1](01-why-this-works.md) replaced supervision with feedback loops, and loops come in radii. Production telemetry answers in days; CI and review in hours; the local build gate in minutes; a failing test in seconds. The tighter the loop, the more iterations an agent completes before its context runs out — so the discipline that hands it the tightest loop wins by default. That discipline is TDD: write a failing test first, make it pass, then refactor while the test pins the behavior. Red, green, refactor — the same cycle as ever, except the agent turns the crank, and a [tdd skill](https://www.aihero.dev/skills-tdd) makes the cycle the default shape of feature work.

![Agent feedback loops: a change flows out through the failing test, the local build gate, CI and review, and production telemetry, and each gate feeds back to the agent on a longer return loop — seconds, minutes, hours, days; the agent iterates on the innermost loop, before the change ever leaves the machine](../assets/diagrams/agent-feedback-loops.svg#only-light)
![Agent feedback loops: a change flows out through the failing test, the local build gate, CI and review, and production telemetry, and each gate feeds back to the agent on a longer return loop — seconds, minutes, hours, days; the agent iterates on the innermost loop, before the change ever leaves the machine](../assets/diagrams/agent-feedback-loops.dark.svg#only-dark)

Test-first matters more with agents than it ever did with humans, for one reason: a test written before the code is an executable statement of the goal that the agent cannot argue with. "Done" stops being the agent's own claim and becomes a run that flips from red to green. Reverse the order and the guarantee inverts — a test written after the code, by the same agent that wrote the code, verifies what the code does rather than what the ticket asked, and it passes by construction. Watching the test fail first also proves the test *can* fail, which is the difference between a check and a decoration.

!!! example "crm — a failing test is the ticket, translated"
    `crm`, a command-line client for Microsoft Dynamics 365, ships every
    change behind `pytest`. A new operation starts as a test that invokes
    the not-yet-existing command and asserts on its output — red. The agent
    then builds until the run turns green and refactors with the suite as a
    safety net, iterating against the test runner for entire stretches in
    which no human reads a line.

## One ticket, one worktree

Agents parallelize; a working tree does not. The moment two sessions build in the same checkout, each one's half-written state leaks into the other's gates: diffs mix, builds check code from two tickets at once, and neither session can trust what it verifies. The discipline is isolation — **each session builds its ticket in its own workspace on its own branch**, and work reaches the shared branch only through the project's lane, never by hand. Git ships this natively as [worktrees](https://git-scm.com/docs/git-worktree): many working directories off one repository, cheap to create and discard.

The why is the economics again. Running agents in parallel now costs nearly nothing, so parallel sessions become the normal case, not the exception — and isolation is what makes the normal case safe. It also keeps every gate honest: with one ticket per worktree, the diff a gate checks is exactly that ticket's diff, which is the precondition for the review axis in [Chapter 7](07-review-and-merge.md) meaning anything.

!!! example "this repo — every Chapter builds in its own worktree"
    In this repo — the Guide's own source, and one of its Reference Repos —
    the Docs Lane's first move after claiming a ticket is to create a
    worktree named for the ticket's branch. The page you are reading was
    written in one. A concurrent session shipping another Chapter never saw
    this page half-written, and the strict build that gated this page ran
    against this ticket's changes alone.

## Surgical changes: every line traces to the ticket

An agent asked to fix one thing will happily improve five others — rename variables it dislikes, reformat what it passes, refactor what it was never asked to touch. Each improvement may even be right, and the discipline still says no: **a change contains only lines that trace to its ticket**. Match the existing style even where you would choose differently; clean up orphans your own change created; when you meet an adjacent problem, record it as a new issue instead of fixing it in place. The rule is enforced the same way any standing rule is — written into the agent's always-loaded context file, the contract [Chapter 2](02-project-setup.md) established.

The why comes from where the cost moved. Implementation is cheap now, so the expensive gate is review — and every line in a diff bills against the reviewer's attention. A 200-line diff wrapped around a 50-line fix does not just waste that attention, it spends it on noise exactly where the signal needs it most. Scope creep also entangles tickets: a drive-by refactor belongs to no ticket, so no test pins it, no reviewer expects it, and no history explains it.

!!! example "this repo — the Spec axis reads every diff against the ticket"
    The Docs Lane reviews every diff along two axes before merge, and the
    Spec axis asks one question of each change: what in the ticket requires
    it? A line that maps to nothing in the ticket is a finding, and
    findings block the auto-merge until fixed or dispositioned. The page
    you are reading passed that axis before it shipped — its diff was one
    Chapter and one diagram, nothing else.

## Module depth decides how far the agent can go

[Chapter 1](01-why-this-works.md) claimed the agent struggles exactly where a new hire would; module depth is the design property that claim cashes out to. A deep module — small interface, rich functionality behind it, in the sense of Ousterhout's [*A Philosophy of Software Design*](https://web.stanford.edu/~ouster/cgi-bin/book.php) — lets an agent work at the surface: it reads the interface, calls it, and the implementation never enters its context window. A shallow module hides nothing, so the agent must read through it, and through what that touches — until the window fills and the agent's effective radius ends, and in practice sooner: [the Smart Zone fades long before that](03-equipping-the-agent.md#size-the-work-to-the-smart-zone). **How deep your modules are is how far the agent can navigate before it drowns**; depth is not an aesthetic preference but the multiplier on how much of the repo one session can command.

Left unguided, agent-written code drifts shallow — one more wrapper, one more parameter, one more layer that hides nothing — because each shallow addition is locally the easy next token. The counterweight is the refactor step of the TDD cycle plus a vocabulary for what better looks like: a [codebase-design skill](https://www.aihero.dev/skills-codebase-design) gives the agent the deep-module vocabulary to evaluate its own interfaces, so the third beat of red-green-refactor deepens the design instead of merely rearranging it.

!!! example "crm — seventy commands ride one deep engine"
    `crm` keeps every operation in its own module riding a shared core
    engine, and the engine is deep: one call sends a request, and
    everything behind it — which authentication a deployment speaks,
    retries, paging — stays hidden. An agent adding a command reads the
    engine's interface, not its internals, so the whole job fits one small
    context: the new module, the interface, the test. Seventy commands
    later, that is still true.

## From built to verified

A ticket built this way ends in a specific place: tests green, diff surgical, design no shallower than it started. What it does not yet have is proof in the project's own Verification Medium — tests are one such medium, and not every project's truth fits in an assertion. [Chapter 6](06-validation.md) is about choosing that medium and sharpening it until the agent can verify its own work without you in the room.
