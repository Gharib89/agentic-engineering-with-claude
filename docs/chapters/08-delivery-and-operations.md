# Delivery and operations

[Chapter 7](07-review-and-merge.md) ended at the merge — the change understood, gated, and landed on the main branch. Merged is not shipped, and shipped is not done: someone has to deliver the change to its users, watch it run, and deal with what comes back. This Chapter covers that last arc of the loop — delivery, monitoring, and triage — and its single theme is continuity: the same disciplines that let an agent build a change unattended ([Chapter 6](06-validation.md)'s Verification Medium, [Chapter 4](04-from-idea-to-plan.md)'s ticket shaping) are what let the loop keep running after the merge, when nobody is watching at all.

## Merged is not shipped — automate the distance

Everything before this point removed humans from paths where they added latency, not judgment: the agent verifies its own work, review gates run in lanes, a green PR can merge itself. All of that is wasted if the merged change then waits for a person to deploy it. Whatever distance remains between the main branch and the user must be a machine's job — build on every proposed change, deliver on every merge — or the bottleneck the whole Guide dismantles simply reassembles at the end.

The principle: **a merge is a deployment decision, and automation executes it.** Continuous integration proves each proposed change against the project's gates; continuous delivery ships each merged one without asking anyone. The tools are whatever CI service hosts the repo — GitHub Actions for the projects in this Guide — and the test of the setup is blunt: if every maintainer went home at merge time, would the change still reach its users? An agent-run loop needs the answer to be yes, because in an unattended lane there *is* no one at merge time.

!!! example "this repo — nobody is around when the Guide ships"
    This repo — the Guide's own source, and one of its Reference Repos —
    runs its delivery on exactly that test. CI runs `mkdocs build --strict`
    on every PR; a merge to `main` deploys the built site to GitHub Pages
    with no human step between. The Docs Lane merges its own PRs
    (auto-merge, ADR-0002), often from an unattended cloud run — which is
    only safe because delivery is automated too: the lane's last check
    fetches the changed page from the live URL and finds its own new text.

## Let the history cut the release

Releasing has a second half beyond deploying: deciding what the release *is* — the version number, the changelog, what changed for whom. Done by hand, that is archaeology performed at the worst time, by someone reconstructing weeks of other people's work. The alternative is to make the history itself machine-readable: when every commit declares its kind in a convention — a fix, a feature, a breaking change — a tool can read the log since the last release and derive the version bump, the changelog, and the release notes mechanically.

The principle: **encode release meaning at commit time, so the release cuts itself.** The convention to reach for is [Conventional Commits](https://www.conventionalcommits.org/), and tools like [release-please](https://github.com/googleapis/release-please) or [semantic-release](https://semantic-release.gitbook.io/) turn the convention into tagged, documented releases with no human authoring step. Agents make the convention cheap to keep: a commit format written into the project's standards is applied by every agent session with total consistency — the discipline that used to erode under deadline pressure now holds by default.

!!! example "this repo — typed commits, and a release that degenerates to the deploy"
    Every commit in this repo is typed — `docs:` for Guide content, `feat:`
    for lane machinery, `fix:`, `chore:` — a rule the agent applies on every
    ticket without being reminded. A docs site has no version number, so the
    release degenerates to the deploy itself; the convention still pays
    twice: the log is a queryable record of what shipped when, and the
    Living Lab mines it for the worked examples the Guide quotes.

## Operations must emit evidence

Once the change is live, the loop does not stop — it goes quiet. A system in production either emits evidence of how it behaves, or it emits nothing and you find out from an angry user. [Chapter 6](06-validation.md) built machine-readable evidence for changes under development; monitoring is the same idea pointed at the running system: telemetry emitted continuously, landing somewhere queryable, so "how is it behaving?" has an answer that does not require anyone to have been watching.

The principle: **instrument the system to answer questions you have not asked yet, and land the data where a query can reach it.** Emit telemetry in an open format — [OpenTelemetry](https://opentelemetry.io/) is the current lingua franca — and route it to a store you can interrogate, not only a dashboard you can glance at. The distinction matters more with agents in the loop: a dashboard serves a human's eyes, but a queryable store lets an agent pull the numbers into an investigation — the operations counterpart of a machine-readable verdict.

!!! example "cc-otel — monitoring the agentic workflow itself"
    `cc-otel`, a Reference Repo, is a monitoring build-out end to end: it
    collects the usage telemetry Claude Code emits — sessions, tokens,
    costs, per team and per project — and lands it where both audiences
    can reach it: Power BI report pages for the human glance, and the
    data model behind them for queries — the same figures the project's
    numeric checks pull ([Chapter 6](06-validation.md) shows that
    pairing). The subject being monitored is the agentic workflow this
    Guide teaches: adoption and cost stop being anecdotes and become
    queryable data.

## Triage is a state machine, not an inbox

What comes back from a live system — bug reports, requests, questions — arrives raw: underspecified, duplicated, sometimes wrong about its own cause. Raw issues cannot be worked; an inbox someone reads top to bottom does not scale and leaves every issue's status in that someone's head. The way through is to treat triage as a state machine: a small set of named states, carried as labels on the issue itself, with a clear owner and question at each transition — so any human or agent can look at any issue and know exactly what it is waiting for.

The principle: **triage's product is a brief an agent can act on, and the states exist to manufacture it.** An issue enters as *needs triage*; evaluation either sends it back for detail (*needs info* — waiting on the reporter), rules it out (*wontfix* — closed with the reason), or routes it to a queue. The routing question is the one [Chapter 4](04-from-idea-to-plan.md) taught for tickets: is this issue now a self-contained brief — reproduction, context, an evidence bar — that a fresh session could build without archaeology? Yes routes it to the agent queue (*ready for agent*); no — it needs judgment, access, or hands an agent lacks — routes it to a human (*ready for human*). Agent lanes drain their queue oldest-first, and a lane that gets stuck hands the issue across to the human queue rather than looping it.

![The triage state machine: an issue enters at needs-triage; evaluation loops it through needs-info while the reporter fills gaps, or ends it at wontfix; issues that become self-contained briefs route to ready-for-agent, where the agent lane picks them up, and the rest route to ready-for-human; a blocked agent run hands its issue across to ready-for-human instead of looping](../assets/diagrams/triage-state-machine.svg)

!!! example "this repo — the page you are reading traveled this machine"
    This repo runs the five states as GitHub labels (`needs-triage`,
    `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). The
    Docs Lane picks the oldest `ready-for-agent` issue, removes the label
    as its claim — so no second run picks the same ticket — and a run that
    cannot finish adds `ready-for-human` with a one-line reason instead of
    returning the ticket to the queue. This Chapter's own issue entered
    that machine as a ticket, was claimed by an agent run, and closed when
    the PR merged.

## The loop closes

This is the last Chapter, and it ends where [Chapter 1](01-why-this-works.md) began: *operate feeds back into idea*. The telemetry you land and the issues you triage are next quarter's inputs — a monitoring number that looks wrong becomes a research question, a triaged report becomes a ticket, and both enter the front of the loop [Chapter 4](04-from-idea-to-plan.md) runs. Nothing in the arc was magic: structure the project so an agent can navigate it, give every stage evidence it can check itself, keep the lifecycle and tighten its gates. The Guide you just finished shipped through the loop it describes — and so did this page.
