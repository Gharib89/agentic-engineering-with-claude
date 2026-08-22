<!-- markdownlint-disable MD041 -->
<span class="guide-kicker">Chapter 3 · Cards, plugs, and hands</span>

# Equipping the agent

[Chapter 2](02-project-setup.md) gave the agent a memory, and memory alone leaves it half-blind: it recalls libraries as they were at training time and cannot see what your domain hides. Equipping is the fix, and every choice in it asks one question — what rides in the agent's one window, and when?

## 1. Everything arrives through one window

Everything the agent knows this session came through one finite window.

![Agent context sources: CLAUDE.md always loaded; the glossary, ADR log, and standards doc read on demand; skills loaded on match; MCP servers fetched live; custom tools returning observations — all feeding one context window.](../assets/diagrams/agent-context-sources.svg#only-light)
![Agent context sources: CLAUDE.md always loaded; the glossary, ADR log, and standards doc read on demand; skills loaded on match; MCP servers fetched live; custom tools returning observations — all feeding one context window.](../assets/diagrams/agent-context-sources.dark.svg#only-dark)

*Every source feeds one window: the note always, project memory on demand, recipe cards on match, plugs and hands on need.*

The later a thing loads, the less window it costs — [Chapter 2](02-project-setup.md)'s size-is-a-tax rule, past one file. Three of those sources are equipment you add:

<div class="grid cards" markdown>

- **Recipe card**

    ---

    The agent does not know *how your team* does this. Loads on match.

- **Universal plug**

    ---

    Its knowledge froze at the training cutoff. Fetches on need.

- **The hands**

    ---

    It cannot *see* what proves the work. Runs, and reports back.

</div>

## 2. A procedure worth running twice becomes a recipe card

Explain a multi-step procedure in the chat and it dies with the chat. Write the card instead: a **skill** ([agent skills](https://code.claude.com/docs/en/skills) in Claude Code) is a recipe card the agent picks up when a matching task arrives — and only its short description rides along, so matching is nearly free. Process stops being something you prompt well and becomes an artifact, reviewed like code.

You rarely start from zero: a bought skill pack — [Matt Pocock's collection](https://www.aihero.dev/skills-setup-matt-pocock-skills), the origin of this Guide's toolkit — is raw material, and where a published skill and your practice differ, yours wins.

!!! example "this repo — the Docs Lane is one recipe card"
    This repo ships every ticket through [`docs-ship`](../agents/docs-lane.md) — one skill
    holding the whole lane, so changing the process is a PR.

## 3. Look it up; never recall

Asked from memory, the agent gives the most dangerous kind of wrong: plausible, confident, shaped like last year's API. The fix is structural, not exhortative — wire current documentation in as a universal plug, then make lookup the standing rule. [MCP servers](https://code.claude.com/docs/en/mcp) are the wiring: context7 for versioned library docs, Microsoft Learn for the Microsoft and Azure estate. One line on the note — *a library question means a lookup, never recall* — turns the plug into a habit.

!!! example "crm — Dynamics 365 answers come from Microsoft Learn"
    `crm`, a command-line client for Microsoft Dynamics 365, works against
    one of the largest versioned API surfaces there is. Its agents resolve
    Web API, FetchXML, and metadata questions through the Microsoft Learn
    MCP server, so the query matches today's docs.

## 4. When the domain hides the surface, build the hands

Some feedback sits behind a surface no off-the-shelf tool exposes — a proprietary renderer, an internal system, a screen. When the project's proof photo, its **Verification Medium**, is behind that wall, [Chapter 1](01-why-this-works.md)'s loop breaks at the step that matters: the agent can change the work but cannot see the result. Build the hands — the smallest bridge that turns "the agent cannot see this" into a command it can run. Keep it boring — one job, one readable result.

!!! example "cc-otel — a screenshot bridge closes the loop on Power BI"
    `cc-otel`, a telemetry project that lands Claude Code usage data in
    Power BI reports, has a Verification Medium no test framework reaches:
    whether a report page *looks* right. Its bridge renders the page and
    returns a screenshot, so visual checking becomes a loop.

## 5. Send a runner for the noisy reading

The window is where the agent thinks, and the discipline is not rationing information: an under-informed agent guesses, and guesses cost more than tokens. It is choosing where raw volume lands: work that must *read a lot to conclude a little*, like searching a codebase or sweeping logs, goes to a runner sent to fetch, which burns its own window and returns the conclusion.

![Read it in the room and the whole pile lands in the main window; send a runner and only the conclusion does.](../assets/diagrams/delegated-reading.svg#only-light)
![Read it in the room and the whole pile lands in the main window; send a runner and only the conclusion does.](../assets/diagrams/delegated-reading.dark.svg#only-dark)

*Read it in the room and the whole pile lands in the main window; send a runner and only the conclusion does.*

Noise, not size, is the trigger — a long task whose steps inform each other stays in the main thread, however big. What earns a runner is pages read per sentence of conclusion.

!!! example "this repo — the review reads everything so the shipper doesn't"
    The Docs Lane's review fans out as runners: one reads the whole diff
    against the ticket, one against the writing standards. Each returns a
    short list of findings, and the shipper acts on them without reading.

## 6. Stop while the legs are fresh

A runner protects the window from noise; nothing protects it from time. Early the agent has fresh legs — the **Smart Zone**; later the same agent drifts into a dumb zone. The [attention budget](https://www.aihero.dev/ai-coding-dictionary/attention-budget) ([Anthropic's term](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)) is per-token and fixed while the window grows, so every added token dilutes the rest — a [degradation](https://www.aihero.dev/ai-coding-dictionary/attention-degradation) that is gradual and silent.

![An output-quality curve runs high through the smart zone, drops where the felt signals appear, and stays low through the dumb zone while the window is still free of its limit; below, the controls ranked 1 /clear, 2 /compact, 3 autocompact.](../assets/diagrams/smart-zone.svg#only-light)
![An output-quality curve runs high through the smart zone, drops where the felt signals appear, and stays low through the dumb zone while the window is still free of its limit; below, the controls ranked 1 /clear, 2 /compact, 3 autocompact.](../assets/diagrams/smart-zone.dark.svg#only-dark)

*Quality falls long before the window fills: the dumb zone arrives with most of the window still free.*

So you read the felt signals: relitigated decisions, sloppier edits. Published numbers disagree ([NoLiMa](https://arxiv.org/abs/2502.05167), the [AI Hero dictionary](https://www.aihero.dev/ai-coding-dictionary/smart-zone), [ace-fca](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/main/ace-fca.md), Chroma's [Context Rot](https://www.trychroma.com/research/context-rot)), so the boundary is task-dependent. Controls rank by who picks the moment: [`/clear`](https://www.aihero.dev/ai-coding-dictionary/clearing), then an intentional [`/compact`](https://www.aihero.dev/ai-coding-dictionary/compaction), then [autocompact](https://www.aihero.dev/ai-coding-dictionary/autocompact) — the same loss, unchosen. [Mechanics](https://code.claude.com/docs/en/context-window) live in the docs.

## 7. Size the work order to one set of fresh legs

A task bigger than one set of fresh legs does not get a longer session. It splits at a natural boundary, and the work crosses the [handoff](https://www.aihero.dev/ai-coding-dictionary/handoff) as a relay baton: a **Handoff Artifact** written for a reader with zero context, recording what was decided *and why*. The rule is testable — orders too big degrade before the work is done, orders too small spend their window on setup. Every Guide ticket ships through a run that handles exactly one of them. That baton is where [Chapter 4](04-from-idea-to-plan.md) starts: [specs](https://www.aihero.dev/ai-coding-dictionary/spec) and [tickets](https://www.aihero.dev/ai-coding-dictionary/ticket) are [Handoff Artifacts](https://www.aihero.dev/ai-coding-dictionary/handoff-artifact) too, written by one session to direct the next.

## Real names

Every picture, and its real name:

| The picture | The real name |
| --- | --- |
| The note taped to the desk | `CLAUDE.md` |
| The shared phrasebook | `CONTEXT.md`, the project glossary |
| The decision diary | The ADR log |
| The recipe card | A **skill** |
| The bought skill pack | A plugin |
| The universal plug | An **MCP server** |
| The hands | A custom tool, usually a small CLI |
| The proof photo | The **Verification Medium** |
| The runner sent to fetch | A subagent |
| Fresh legs | The **Smart Zone** |
| The relay baton | A **Handoff Artifact** |
| The work order | A ticket |
