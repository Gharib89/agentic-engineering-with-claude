# Equipping the agent

[Chapter 2](02-project-setup.md) built the project's memory — the files that tell an agent what the project is and how it decides. Memory alone still leaves the agent working half-blind: it recalls libraries as they looked at training time, it cannot see behind your domain's walls, and it reinvents its process every session. This Chapter is about capability — giving the agent eyes and hands: skills that package process, documentation servers that replace recall with lookup, custom tools where the domain demands them, and the context discipline that keeps all of it affordable.

## One window, many sources

Everything an agent knows in a session arrives through one finite context window, so equipping an agent is really curating what flows into that window, and when. The sources are few and nameable: the always-loaded front door (`CLAUDE.md`), the project memory behind it read on demand (the glossary, the ADR log, the standards doc), skills that load when a task matches them, MCP servers that fetch live knowledge from outside the repo, and tools whose results return as observations.

![Agent context sources: CLAUDE.md always loaded; the glossary, ADR log, and standards doc read on demand; skills loaded on match; MCP servers fetched live; custom tools returning observations — all feeding one context window](../assets/diagrams/agent-context-sources.svg#only-light)
![Agent context sources: CLAUDE.md always loaded; the glossary, ADR log, and standards doc read on demand; skills loaded on match; MCP servers fetched live; custom tools returning observations — all feeding one context window](../assets/diagrams/agent-context-sources.dark.svg#only-dark)

The picture is worth holding because every equipment decision in this Chapter is the same decision asked again: does this knowledge ride along always, load on demand, or get fetched at the moment of need? The later it loads, the less it costs the window — Chapter 2's "size is a tax" rule, extended from one file to everything the agent touches.

## Package the process: skills

The first time you walk an agent through a multi-step procedure, the explanation lives in the chat and dies with it; the second time, you are already retyping it worse. A procedure worth running twice belongs in a **skill**: a versioned instruction file the agent loads when a matching task arrives. That single move changes the procedure's nature — process stops being something you prompt well and becomes an artifact: written once, reviewed like code, improved by diff, shared across the team. In Claude Code the mechanics are [agent skills](https://code.claude.com/docs/en/skills); the principle is older than the feature — checklists beat memory.

A skill differs from the front door by load time, not by content type. `CLAUDE.md` carries the standing rules every session needs; a skill carries one procedure, and costs nothing until a task matches it. When a rule keeps applying everywhere, it belongs in the front door; when it only applies while shipping a release or triaging a bug, it belongs in a skill.

You also rarely start from zero. Published skill collections — Matt Pocock's, the origin of this Guide's toolkit — are inspiration and raw material: adopt what is good, build what is missing, and where a published skill and your proven practice differ, your practice wins.

!!! example "this repo — the Docs Lane is one skill"
    This repo — the Guide's own source, and one of its Reference Repos —
    ships every Guide ticket through `docs-ship`, a project skill
    that packages the whole lane: claim the ticket, isolate on a branch,
    write, gate on the strict build, run the two-axis review, merge. The
    process is a file, so changing the process is a PR — when the lane
    learns a lesson, the skill's diff is the lesson, reviewed like any
    other change.

## Look it up, never recall: documentation MCP servers

An agent's built-in knowledge of every library, SDK, and API froze at its training cutoff; the libraries kept moving. Asked from memory, the agent answers with the most dangerous kind of wrong: plausible, confident, and shaped like last year's API. The fix is structural, not exhortative — wire current documentation in as a tool the agent can call, then make lookup the standing rule. [MCP servers](https://code.claude.com/docs/en/mcp) are the wiring: context7 serves versioned open-source library docs, Microsoft Learn serves the Microsoft and Azure estate, and one line in the front door — a library question means a lookup, never recall — turns the tool into a habit.

The why is the same asymmetry as every guardrail in Chapter 2: a hallucinated API call costs a debugging session downstream; a lookup costs seconds. Give the agent eyes on the current docs and the whole class of "it compiled, but that parameter was renamed two versions ago" disappears.

!!! example "crm — Dynamics 365 answers come from Microsoft Learn"
    `crm`, a command-line client for Microsoft Dynamics 365, lives against
    one of the largest versioned API surfaces there is — Web API endpoints,
    FetchXML, metadata queries. Agents working on it resolve those questions
    through the Microsoft Learn MCP server, so a query the agent writes
    matches the documentation as it stands today, not as the training data
    remembers it.

## Build the missing tool

Skills package process and MCP servers fetch knowledge, but some feedback exists only behind a surface no off-the-shelf tool exposes — a proprietary renderer, an internal system, a screen. When the project's Verification Medium lives behind such a wall, the loop from [Chapter 1](01-why-this-works.md) breaks at exactly the step that matters: the agent can change the work but cannot see the result. That is the signal to build a **custom tool** — the smallest bridge that turns "the agent cannot see this" into a command the agent can run.

Keep the bridge boring: command-line shaped, doing one thing, returning something an agent can read — an exit code, a file, an image. The tool is not a product; it is a prosthetic eye or hand, and its whole value is measured by the feedback loop it closes.

!!! example "cc-otel — a screenshot bridge gives the agent eyes on Power BI"
    `cc-otel`, a telemetry project that lands Claude Code usage data in
    Power BI reports, has a Verification Medium no test framework can reach:
    whether a report page *looks* right after a change. Its answer is a
    small custom bridge that renders a report page and hands back a
    screenshot. With that one tool, visual checking becomes a loop the agent
    runs alone — change the report, render, inspect the image, iterate —
    instead of a human staring at dashboards after every edit.

## Delegate noise, not size

Everything this Chapter adds competes for the same context window, and the window is where the agent thinks. The discipline that keeps it spendable is not rationing information — an under-informed agent guesses, and guesses are costlier than tokens. The discipline is choosing where raw volume lands: work that must *read a lot to conclude a little* — searching a codebase, digesting long documentation, sweeping logs — goes to a subagent, which burns its own context window and returns only the conclusion. The main session keeps the goal, the decisions, and the diff.

Size alone is no reason to delegate; a long task whose every step informs the next belongs in the main thread, however big. Noise is the reason — pages read per sentence of conclusion. Delegate the noisy work, keep the decisions.

!!! example "this repo — the review reads everything so the shipper doesn't"
    The Docs Lane's two-axis review fans out as subagents: one reads the
    full diff against the ticket (Spec axis), one against the writing
    standards (Standards axis). Each burns its own context on the raw
    reading and returns a short list of findings. The shipping session never
    loads the review's reading — it acts on the findings, keeping its own
    window on the ticket.

## From equipped to directed

An equipped agent can look up what it does not know, run the processes the team trusts, see the surfaces the domain hides, and keep its head clear while doing so. What it cannot do is decide what to build. [Chapter 4](04-from-idea-to-plan.md) turns to exactly that — shaping an idea into a spec and tickets an agent can execute without you in the room.
