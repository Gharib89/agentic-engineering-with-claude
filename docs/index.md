# Agentic Engineering with Claude Code

The Guide teaches the full software development lifecycle with Claude Code — idea to production to operations. Each principle is stated generically, then grounded in Example Boxes drawn from real Reference Repos. This repo is a Living Lab: the Guide ships through the same workflow it teaches.

## The premise: clean code is agent leverage

AI agents amplify the codebase they work in. Code that is easy to change — modular, well named, with clear seams and honest interfaces — lets an agent find the right place to work without dragging half the repo into its context. Code that is easy to test gives the agent a feedback loop: it can make a change, run the tests, and know on its own whether the change is correct. The principles of good software design (small units, separation of concerns, dependencies pointing inward, tests that pin behavior) were written for human teams, but they pay out double with agents: an agent does not apply architectural judgment on its own, so the structure it follows is the structure your codebase and conventions give it. Clean in, clean out. Measured on real tasks, agents working in cleaner code use fewer tokens and revisit far fewer files to finish the same job.

[Chapter 1](chapters/01-why-this-works.md) develops this thesis in full.

## Prerequisites

Basic working knowledge is enough — the Guide does not assume expertise in any of these:

- DevOps basics
- CI/CD
- The command line
- Bash
- Git
- Claude Code — installed and used at least once, with a rough idea of its extension points: hooks, skills, plugins, MCP servers, and LSP integrations. The Guide teaches how to use them well.

## Chapters

1. [Why this works](chapters/01-why-this-works.md) — the thesis: why clean architecture and clear context make agents effective.
2. [Project setup](chapters/02-project-setup.md) — scaffold a repo for agentic work: CLAUDE.md, CONTEXT.md, ADRs, issue tracker, standards, guardrails.
3. [Equipping the agent](chapters/03-equipping-the-agent.md) — skills, MCP servers, custom tools, and context discipline.
4. [From idea to plan](chapters/04-from-idea-to-plan.md) — grilling, research, domain modeling, spec, and tickets.
5. [Implementation](chapters/05-implementation.md) — TDD, worktree discipline, and clean code with AI.
6. [Validation](chapters/06-validation.md) — the Verification Medium: give the agent something it can check itself.
7. [Review and merge](chapters/07-review-and-merge.md) — self-review, review lanes, and merge gates.
8. [Delivery and operations](chapters/08-delivery-and-operations.md) — CI/CD, releases, monitoring, and triage.
