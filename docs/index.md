# Agentic Engineering with Claude Code

The Guide teaches the full software development lifecycle with Claude Code — idea to production to operations. This page is the Quick Start: the whole method at a glance, communicated through its diagrams, with every Chapter one click away for the details.

## The premise: clean code is agent leverage

AI agents amplify the codebase they work in: code that is easy to change lets an agent find the right place to work, and code that is easy to test gives it a feedback loop to verify its own changes. The principles of good software design were written for human teams, but they pay out double with agents — clean in, clean out. [Chapter 1](chapters/01-why-this-works.md) develops this thesis in full.

## Prerequisites

Basic working knowledge is enough — the Guide does not assume expertise in any of these:

- DevOps basics
- CI/CD
- The command line
- Bash
- Git
- Claude Code — installed and used at least once, with a rough idea of its extension points: hooks, skills, plugins, MCP servers, and LSP integrations. The Guide teaches how to use them well.

## The method at a glance

The whole method is one loop — idea, plan, implement, validate, review, deliver, operate, and operate feeds the next idea — standing on foundations you lay once per project. At every stage an agent has a role: doing the work, or checking it.

![The SDLC loop: idea, plan, implement, validate, review, deliver, operate — and operate feeds back into idea](assets/diagrams/sdlc-loop.svg#only-light)
![The SDLC loop: idea, plan, implement, validate, review, deliver, operate — and operate feeds back into idea](assets/diagrams/sdlc-loop.dark.svg#only-dark)

### Foundations

The ground the loop stands on. Why clean architecture and clear context make agents effective ([Chapter 1](chapters/01-why-this-works.md)); how to scaffold a repo for agentic work — CLAUDE.md, CONTEXT.md, ADRs, an issue tracker, one canonical standards doc, guardrails ([Chapter 2](chapters/02-project-setup.md)); and how to equip the agent with skills, MCP servers, custom tools, and context discipline ([Chapter 3](chapters/03-equipping-the-agent.md)).

### Idea to plan

An idea becomes a spec through an interview that leaves nothing silently assumed, research against primary sources, and domain modeling that pins the vocabulary down. The spec is cut into self-contained tickets that feed the build loop ([Chapter 4](chapters/04-from-idea-to-plan.md)).

![The idea-to-ship chain: an idea passes through the interview, research, and domain modeling into a spec, which is cut into tickets that feed the build loop](assets/diagrams/idea-to-ship-chain.svg#only-light)
![The idea-to-ship chain: an idea passes through the interview, research, and domain modeling into a spec, which is cut into tickets that feed the build loop](assets/diagrams/idea-to-ship-chain.dark.svg#only-dark)

### Build and validate

The agent implements test-first, isolated in a worktree, holding the codebase's own standards ([Chapter 5](chapters/05-implementation.md)). What makes it autonomous is the Verification Medium: project-specific evidence — a test suite, a screenshot loop, a strict build — that lets the agent check its own work instead of asking you ([Chapter 6](chapters/06-validation.md)).

### Ship and operate

Changes land understood, not just green: self-review, review lanes matched to risk, and merge gates ([Chapter 7](chapters/07-review-and-merge.md)). After the merge, CI/CD and releases, monitoring, and a triage state machine that turns incoming issues into agent-ready briefs ([Chapter 8](chapters/08-delivery-and-operations.md)).

## Start here

Read the premise, then act: scaffold your repo with [Chapter 2](chapters/02-project-setup.md) and cut your first ticket. The loop teaches itself once it turns.

## Go deeper

The source material behind the Guide, in three buckets.

### Foundations to read

- [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) — Anthropic. The foundational taxonomy of agent patterns: workflows versus agents, simple composable patterns over frameworks.
- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — Anthropic. Context is the scarce resource: just-in-time retrieval, compaction, subagents — the theory behind Claude Code's design.
- [A Philosophy of Software Design](https://web.stanford.edu/~ouster/cgi-bin/book.php) — John Ousterhout. Deep modules and complexity as the enemy: the design vocabulary that transfers directly to writing specs and reviewing agent output.

### Practice

- [The New SDLC With Vibe Coding](https://www.kaggle.com/whitepaper-the-new-SDLC-with-vibe-coding) — Google/Kaggle whitepaper. The spectrum from vibe coding to agentic engineering, and the thesis that generation is solved — the remaining work is specification and verification.
- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices) — Anthropic. The distilled day-to-day practice: verification loops, plan mode, CLAUDE.md hygiene, context management.
- [How Anthropic teams use Claude Code](https://claude.com/blog/how-anthropic-teams-use-claude-code) — Anthropic. Concrete internal-team workflows across product, security, legal, and data science.
- [mattpocock/skills](https://github.com/mattpocock/skills) and [AI Hero](https://www.aihero.dev) — Matt Pocock. The skills collection the Guide's practice adapts, and the pedagogy behind it.

### Evidence

- [DORA 2025: State of AI-assisted Software Development](https://dora.dev/dora-report-2025/) — DORA / Google Cloud. Survey evidence that AI amplifies existing team capability rather than fixing it: individual throughput rises, delivery stays flat unless workflows improve.
- [Measuring the impact of early-2025 AI on experienced developer productivity](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) — METR. The randomized trial where AI made experienced developers 19% slower while they believed they were faster — the strongest case for verification over vibes.
