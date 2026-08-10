# Findings: smart zone and context management — primary sources

> **Status**: research findings for ticket [#40](https://github.com/Gharib89/agentic-engineering-with-claude/issues/40), part of wayfinder map #39.
> **Location note**: this file lives in `research/` at repo root, deliberately **outside** `docs/` — the repo has no findings convention yet, and `docs/` is gated by `mkdocs build --strict` with an explicit nav. This is raw project memory for the spec grilling to cite, not a Guide chapter.
> **Access note**: `aihero.dev` returns 404 to bot fetches. All AI Hero dictionary quotes below were taken live from the GitHub mirror [`mattpocock/dictionary-of-ai-coding`](https://github.com/mattpocock/dictionary-of-ai-coding) (README, fetched 2026-08-10); the canonical URLs are `https://www.aihero.dev/ai-coding-dictionary/<term>`. All other sources were fetched live on 2026-08-10.

## 1. Smart zone — definition

The AI Hero dictionary ([smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone), via mirror) defines it:

> "Early in a session the agent is in a 'smart zone' — sharp, focused, recall is good. As the session grows it drifts into a 'dumb zone': sloppier, forgetful, more mistakes — and more faithfulness hallucinations. Same model, same harness — just more context. The felt effect of attention degradation."

Two load-bearing corollaries from the same entry:

> "The zones don't track the context window limit. A session can be deep in the dumb zone with most of the window still free: the limit is where the harness refuses to continue, but quality falls off long before that. Plan around the smart zone, not the window — the practical budget for a task is the tokens the agent works well within, not the tokens it can technically hold."

> "The smart zone is a budget, and unrelated work spends it. Every task done in a session uses up tokens, so starting a second task in the same session means starting it closer to the dumb zone. Doing one task per session gives each task the sharpest part of the session. When a single task is bigger than one smart zone, split it: hand off or compact at a natural boundary, and let a fresh session do the next piece."

### Mechanism: attention budget and attention degradation

- Dictionary, [attention budget](https://www.aihero.dev/ai-coding-dictionary/attention-budget): "Each token has a finite amount of influence to distribute across the rest of the context. Heavy influence on one relationship leaves less for others. The budget is per-token and doesn't grow when the context does, which is why long sessions dilute." And: "An instruction that was the loudest thing at 10k tokens of context is background hum at 150k. This is the mechanism behind attention degradation: the model doesn't forget; the signal gets lost in the noise."
- Dictionary, [attention degradation](https://www.aihero.dev/ai-coding-dictionary/attention-degradation): "It's gradual, which is what makes it hard to catch from inside the session. There's no error and no threshold; each turn is only slightly worse than the last, and by the time the slips are obvious you've been in the dumb zone for a while." Recovery: "You recover by removing context, not adding more. Re-pasting the ignored instruction adds another competitor to the same crowded window and helps only briefly."
- Anthropic, [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents): "Like humans, who have limited working memory capacity, LLMs have an 'attention budget' that they draw on when parsing large volumes of context." And: "Studies on needle-in-a-haystack style benchmarking have uncovered the concept of context rot: as the number of tokens in the context window increases, the model's ability to accurately recall information from that context decreases." Core rule: "Good context engineering means finding the smallest possible set of high-signal tokens that maximize the likelihood of some desired outcome."
- Chroma, [Context Rot](https://www.trychroma.com/research/context-rot) (18 LLMs tested): "Large Language Models (LLMs) are typically presumed to process context uniformly—that is, the model should handle the 10,000th token just as reliably as the 100th. However, in practice, this assumption does not hold." Finding: "models do not use their context uniformly; instead, their performance grows increasingly unreliable as input length grows."
- NoLiMa, [arXiv:2502.05167](https://arxiv.org/abs/2502.05167) (13 LLMs claiming ≥128K context): "While they perform well in short contexts (<1K), performance degrades significantly as context length increases. At 32K, for instance, 11 models drop below 50% of their strong short-length baselines." Cause: "these declines stem from the increased difficulty the attention mechanism faces in longer contexts when literal matches are absent."
- Anthropic platform docs, [Context windows](https://platform.claude.com/docs/en/build-with-claude/context-windows), name the phenomenon in official docs: "A larger context window allows the model to handle more complex and lengthy prompts, but more context isn't automatically better. As token count grows, accuracy and recall degrade, a phenomenon known as *context rot*. This makes curating what's in context just as important as how much space is available." Note: the same page lists 1M-token windows as the default for Opus 4.6+ / Sonnet 4.6+ / Fable 5 — a bigger window widens the harness limit, not the smart zone.

## 2. Debated thresholds — each source quoted exactly

The three figures the ticket names come from different sources measuring different things. No two agree, and the dictionary itself flags the debate.

| Figure | Owning source | Exact quote |
| --- | --- | --- |
| **125K–150K** | AI Hero dictionary, smart-zone entry (mirror) | "On frontier models, the dumb zone commonly begins around 125K-150K tokens — though this is debated." |
| **40%–60% of window** | HumanLayer [ace-fca](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/main/ace-fca.md) | "Essentially, this means designing your ENTIRE WORKFLOW around context management, and keeping utilization in the 40%-60% range (depends on complexity of the problem )." |
| **~170K** | Geoff Huntley, as quoted inside ace-fca | "The name of the game is that you only have approximately **170k of context window** to work with. So it's essential to use as little of it as possible. The more you use the context window, the worse the outcomes you'll get." |
| **~113K (evidence for the ~100K claim)** | Chroma, Context Rot, LongMemEval experiment | Full prompts "average out to ~113k tokens" while "Focused prompts average to ~300 tokens", and "Across all models, we see significantly higher performance on focused prompts compared to full prompts." |
| **32K (degradation starts far lower)** | NoLiMa abstract | "At 32K, for instance, 11 models drop below 50% of their strong short-length baselines. Even GPT-4o, one of the top-performing exceptions, experiences a reduction from an almost-perfect baseline of 99.3% to 69.7%." |

**Caveat on "~100K"**: no fetched primary source states "~100K" verbatim as a smart-zone boundary. The nearest anchors are Chroma's ~113K full-prompt average (where degradation is measured) and Huntley's 170K working figure. The aihero.dev per-term pages could not be verified live (404 to bots), so if a "~100K" phrasing exists there it is unconfirmed. The honest summary: **the boundary is contested and task-dependent; every source agrees degradation begins well before the window limit, and NoLiMa shows measurable damage as early as 32K.**

## 3. /clear vs intentional /compact vs auto-compact — the ranking

All sources converge on the same ordering: **/clear when nothing needs to carry > intentional /compact at a boundary you choose > autocompact as the fallback to avoid.**

### /clear — first choice between tasks

- Dictionary, [clearing](https://www.aihero.dev/ai-coding-dictionary/clearing): "Clearing is the cure for a polluted context." And: "Compare compaction, which summarises the session into the new context instead of starting empty. Clearing is the blunter tool: nothing carries over, including the junk."
- Claude Code [best practices](https://code.claude.com/docs/en/best-practices): "Use `/clear` frequently between tasks to reset the context window entirely." And: "If you've corrected Claude more than twice on the same issue in one session, the context is cluttered with failed approaches. Run `/clear` and start fresh with a more specific prompt that incorporates what you learned. A clean session with a better prompt almost always outperforms a long session with accumulated corrections."
- Claude Code [costs](https://code.claude.com/docs/en/costs): "`/compact` reads the conversation it summarizes, so compacting a large context is itself a large request. When you want a fresh start instead of continuity, `/clear` costs nothing."

### Intentional /compact — when continuity must carry

- Dictionary, [compaction](https://www.aihero.dev/ai-coding-dictionary/compaction): "A handoff done in-memory: the previous session's history is summarised, and the summary seeds a fresh session. Lossy by design." Steering: "The summary is written by the model, so it can be prompted. 'Preserve the schema decisions' makes the generated artifact more deliberate. Timing matters too — compact at a phase boundary, after the plan is settled, not mid-task."
- Claude Code best practices: "For more control, run `/compact <instructions>`, like `/compact Focus on the API changes`" and CLAUDE.md can carry standing compaction instructions ("When compacting, always preserve the full list of modified files and any test commands").
- ace-fca names the manual pattern "intentional compaction": "as your context starts to fill up, you probably want to pause your work and start over with a fresh context window", with a prompt like "Write everything we did so far to progress.md, ensure to note the end goal, the approach we're taking, the steps we've done so far, and the current failure we're working on". Its strongest form is "frequent intentional compaction": "designing your entire development process around context management, keeping utilization in the 40-60% range, and building in high-leverage human review at exactly the right points" via a "research, plan, implement" workflow.
- Anthropic engineering post frames compaction the same way: "Compaction is the practice of taking a conversation nearing the context window limit, summarizing its contents, and reinitiating a new context window with the summary."

### Autocompact — the fallback to not let fire

- Dictionary, [autocompact](https://www.aihero.dev/ai-coding-dictionary/autocompact): "Compaction is lossy, and autocompact is lossy at a moment you didn't choose. A manual compact happens at a phase boundary, when you can tell the model what to preserve. Autocompact fires mid-task, whenever the threshold is hit — possibly halfway through a refactor, with the summary deciding for itself which of your decisions were worth keeping." Verdict: "The defence is to not let it fire."
- Claude Code docs confirm the mechanics and the losses: "Claude Code compacts automatically as you approach the limit, so a full context window doesn't end your session" ([context window](https://code.claude.com/docs/en/context-window)); "It clears older tool outputs first, then summarizes the conversation if needed. Your requests and key code snippets are preserved; detailed instructions from early in the conversation may be lost" ([how Claude Code works](https://code.claude.com/docs/en/how-claude-code-works)). What survives is documented: path-scoped rules and nested CLAUDE.md are "Lost until a matching file is read again"; skill re-injection is "capped at 5,000 tokens per skill and 25,000 tokens total; oldest dropped first" (context-window page). The trigger is tunable: "run `/autocompact` with a token count, like `/autocompact 500k`, to set how full the context window gets before the automatic pass runs" (accepted range 100K–1M).

## 4. Handoff-artifact pattern

- Dictionary, [handoff](https://www.aihero.dev/ai-coding-dictionary/handoff): "The receiving session starts with zero context — the model is stateless, and nothing from the old session is visible to the new one. Whatever the next session needs has to be carried explicitly; everything else is gone. 'No return path' is the constraint that shapes the carry." Failure mode: "The visible failure of a bad handoff is relitigation: the new session re-opens decisions the old one had settled, because the carry recorded what was decided but not why. Judge a handoff by what a session with zero context could do with it."
- Dictionary, [handoff artifact](https://www.aihero.dev/ai-coding-dictionary/handoff-artifact): "A document used as the carry mechanism for a handoff — written to the environment by one session to be read by another. Specs, tickets, and plan docs are all handoff artifacts." Quality bar: "A good artifact is written to be read into a session that has zero context. Concrete file paths rather than 'the file we discussed'. What was decided and why, so the next session doesn't relitigate it. What's done and what's left." Advantage over compaction: "it lives on disk where you can read and correct it before anything depends on it, and it can be reused — the same spec can brief five parallel sessions."
- The artifact is a secondary source and must be verifiable: "Where a claim matters, the next session should verify it against the primary source — the code, the tests — rather than inherit it" (handoff-artifact entry). A well-made one carries "a context pointer back to its original" ([secondary source](https://www.aihero.dev/ai-coding-dictionary/secondary-source) entry).
- Anthropic engineering post, same pattern as "structured note-taking": "Structured note-taking, or agentic memory, is a technique where the agent regularly writes notes persisted to memory outside of the context window."
- Anthropic platform docs: "For agents that span multiple sessions, design your state artifacts so that context recovery is fast when a new session starts" ([context windows](https://platform.claude.com/docs/en/build-with-claude/context-windows)).
- ace-fca's `progress.md` prompt (quoted in §3) is the same pattern; its research → plan → implement flow passes a written artifact between phases, and "For complex work, I'll often compact the current status back into the original plan file after each implementation phase is verified."

## 5. Ticket-sized-to-one-smart-zone rule

- Dictionary, [ticket](https://www.aihero.dev/ai-coding-dictionary/ticket): "The defining constraint is the size: one session. A ticket should be completable before the session drifts out of the smart zone — and that constraint is testable. If sessions on your tickets routinely degrade before the work is done, the tickets are too big; split them. If each session spends most of its context on setup before doing five minutes of work, they're too small; merge them."
- Dictionary, [spec](https://www.aihero.dev/ai-coding-dictionary/spec) usage line, on multi-session work: "write it up as a spec — break it into tickets, run each one in its own session. Trying to do the whole thing in a single context will hit the dumb zone before you're halfway."
- Parallelism falls out of the same rule (ticket entry): "The dependency graph is also what unlocks parallelism. Independent tickets — the leaves of the graph — can each run in their own session at the same time."

## 6. Docs-review fan-out pattern (official workflow docs)

The [dynamic workflows](https://code.claude.com/docs/en/workflows) page documents the fan-out shapes the ticket asks about:

- **Per-file/per-page fan-out with adversarial verify** ("Audit many files for the same issue"): "Fan out one agent per file, then collect and verify the findings." Example prompt: "use a workflow to audit every route handler under src/routes/ for missing authentication checks, and adversarially verify each finding before reporting it".
- **Rank-and-dedupe** ("Review every changed file and write one summary"): "Run a reviewer per file, then hand all the findings to one agent that ranks and deduplicates them." Example prompt: "use a workflow to review every file changed in this PR for correctness issues, then merge the per-file findings into one ranked summary".
- **Deep-research claim cross-checking**: the bundled `/deep-research` workflow "Fans out web searches on a question across several angles, fetches and cross-checks the sources it finds, votes on each claim, and returns a cited report with claims that didn't survive cross-checking filtered out." Since v2.1.196, "when the verifier agents can't check a claim ... the report lists that claim as unverified instead of counting it as refuted."
- Why workflows and not one big session — the context rationale is explicit: "A workflow script holds the loop, the branching, and the intermediate results itself, so Claude's context holds only the final answer." And on the quality pattern: "it can have independent agents adversarially review each other's findings before they're reported ... so you get a more trustworthy result than a single pass."
- The [best practices](https://code.claude.com/docs/en/best-practices) page adds the adversarial-review rationale: "A reviewer running in a fresh subagent context sees only the diff and the criteria you give it, not the reasoning that produced the change, so it evaluates the result on its own terms." With a calibration warning: "A reviewer prompted to find gaps will usually report some, even when the work is sound ... Tell the reviewer to flag only gaps that affect correctness or the stated requirements, and treat the rest as optional."
- Subagents as the underlying context isolation, dictionary [subagent](https://www.aihero.dev/ai-coding-dictionary/subagent): "Run inside a subagent and the noise fills a disposable window instead — only the final report lands in the parent's context." Anthropic engineering post agrees: "each subagent might explore extensively, using tens of thousands of tokens or more, but returns only a condensed, distilled summary of its work (often 1,000-2,000 tokens)."

## Sources

| Source | URL | Access |
| --- | --- | --- |
| AI Hero dictionary (Matt Pocock) | `https://www.aihero.dev/ai-coding-dictionary/<term>` (canonical); mirror used: <https://github.com/mattpocock/dictionary-of-ai-coding> | Mirror README fetched raw, 2026-08-10; aihero.dev 404s to bot fetches |
| Anthropic — Effective context engineering for AI agents | <https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents> | Fetched live |
| Claude Code — Best practices | <https://code.claude.com/docs/en/best-practices> | Fetched live (`.md` endpoint) |
| Claude Code — Explore the context window | <https://code.claude.com/docs/en/context-window> | Fetched live (`.md` endpoint) |
| Claude Code — Manage costs effectively | <https://code.claude.com/docs/en/costs> | Fetched live (`.md` endpoint) |
| Claude Code — How Claude Code works | <https://code.claude.com/docs/en/how-claude-code-works> | Fetched live (`.md` endpoint) |
| Claude Code — Dynamic workflows | <https://code.claude.com/docs/en/workflows> | Fetched live (`.md` endpoint) |
| Chroma — Context Rot | <https://www.trychroma.com/research/context-rot> | Fetched live |
| NoLiMa — Long-Context Evaluation Beyond Literal Matching | <https://arxiv.org/abs/2502.05167> | Abstract fetched live |
| HumanLayer — Advanced Context Engineering for Coding Agents (ace-fca) | <https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/main/ace-fca.md> | Fetched raw, live |
| Anthropic platform — Context windows | <https://platform.claude.com/docs/en/build-with-claude/context-windows> | Fetched live (`.md` endpoint) |
