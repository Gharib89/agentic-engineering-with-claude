<!-- markdownlint-disable MD041 -->
<span class="guide-kicker">Chapter 8 · Out the door</span>

# Delivery and operations

[Chapter 7](07-review-and-merge.md) landed the change on the main branch. Merged is not shipped and shipped is not done — somebody still has to put the change in front of users, watch it run, and answer what comes back.

## 1. Nobody is at the desk when the merge lands

Every gate so far took people off paths where they added waiting, not judgment. All of it is refunded if the merged change then sits on the main branch until somebody remembers to deploy it: the bottleneck this Guide dismantles reassembles at the last step. So **treat the merge as the deployment decision and let a machine execute it** — build on every proposed change, deliver on every merge. The test is blunt: if every maintainer went home at merge time, would the change still reach its users? Under a green light with no gatekeeper there *is* nobody at merge time, so the answer has to be yes.

![Two last stretches from the same merge: on one side the change waits to be noticed and is then deployed by hand, on the other a delivery job fires on the merge and publishes; both end with the change live, and only one of them waited for a person](../assets/diagrams/last-stretch-to-the-user.svg#only-light)
![Two last stretches from the same merge: on one side the change waits to be noticed and is then deployed by hand, on the other a delivery job fires on the merge and publishes; both end with the change live, and only one of them waited for a person](../assets/diagrams/last-stretch-to-the-user.dark.svg#only-dark)

*The same merge, two last stretches — the difference is where the change waits.*

!!! example "this repo — nobody is around when the Guide ships"
    This repo, the Guide's own source, passes that test: the strict build runs
    on every proposed change, and a merge to `main` publishes the site with no
    human step. The conveyor belt's last check fetches the changed page from
    the live URL and finds its own new text.

## 2. Let the history cut the release

Deploying is half of releasing. The other half is deciding what the release *is* — the version, the changelog, what changed for whom — which by hand is archaeology, performed at the worst moment on other people's commits. So **encode the release meaning at commit time, and the release cuts itself**: when every commit declares its kind, a tool reads the log since the last tag and derives the version bump and the changelog. [Conventional Commits](https://www.conventionalcommits.org/) is the convention; [release-please](https://github.com/googleapis/release-please) and [semantic-release](https://semantic-release.org/) are the tools. Agents make the convention hold: a format written into the standards is applied every session, with none of the erosion deadlines used to cause.

## 3. A live system must emit its own evidence

Once the change is live the loop goes quiet. A running system either emits evidence of how it behaves, or you hear it from an angry user — [Chapter 6](06-validation.md)'s proof photo, pointed at production. So **instrument the system to answer questions nobody has asked yet, and land the data where a query can reach it**: emit telemetry in an open format — [OpenTelemetry](https://opentelemetry.io/) is the current lingua franca — into a store you can interrogate, not only a dashboard you can glance at. That line decides who can investigate: a dashboard serves a pair of eyes, a store answers a query an agent can write.

![Telemetry from the running system is drawn into fixed dashboard panels and kept as rows in a queryable store; a question nobody asked yet arrives at the store as one more query, and is barred at the dashboard, which has no panel for it](../assets/diagrams/dashboard-or-store.svg#only-light)
![Telemetry from the running system is drawn into fixed dashboard panels and kept as rows in a queryable store; a question nobody asked yet arrives at the store as one more query, and is barred at the dashboard, which has no panel for it](../assets/diagrams/dashboard-or-store.dark.svg#only-dark)

*One telemetry stream, two landing places — only one takes a question nobody had thought of yet.*

!!! example "cc-otel — monitoring the agentic workflow itself"
    `cc-otel`, a Reference Repo that collects Claude Code's own usage
    telemetry, lands sessions, tokens and costs where both audiences reach
    them: report pages for the human glance, and the data model behind them
    for queries. What it monitors is the workflow this Guide teaches.

## 4. Triage is a state machine, not an inbox

What comes back from a live system arrives raw: underspecified, duplicated, sometimes wrong about its own cause. An inbox read top to bottom does not scale, and it keeps every issue's status inside one person's head. So **run triage as a state machine whose product is a work order an agent can act on** — named sorting bins carried as labels on the issue itself, each with one owner and one question. The routing question is [Chapter 4](04-from-idea-to-plan.md)'s: could a fresh session build this without archaeology? A stuck lane moves the issue to the human bin rather than looping it, and a [triage recipe card](https://www.aihero.dev/skills-triage) keeps the judgment repeatable.

![The triage state machine: an issue enters at needs-triage; evaluation loops it through needs-info while the reporter fills gaps, or ends it at wontfix; issues that become self-contained briefs route to ready-for-agent, where the agent lane picks them up, and the rest route to ready-for-human; a blocked agent run hands its issue across to ready-for-human instead of looping](../assets/diagrams/triage-state-machine.svg#only-light)
![The triage state machine: an issue enters at needs-triage; evaluation loops it through needs-info while the reporter fills gaps, or ends it at wontfix; issues that become self-contained briefs route to ready-for-agent, where the agent lane picks them up, and the rest route to ready-for-human; a blocked agent run hands its issue across to ready-for-human instead of looping](../assets/diagrams/triage-state-machine.dark.svg#only-dark)

*Five bins, one question at each transition: any reader can see what an issue waits for.*

!!! example "this repo — the page you are reading came through those bins"
    This repo carries the five bins as GitHub labels. Its conveyor belt claims
    the oldest agent-ready issue by removing the label, so no second run picks
    it, and a stuck run moves the issue to the human bin with a one-line
    reason. This Chapter's own work order came through those bins.

## 5. The loop closes

This is the last Chapter, and it ends where [Chapter 1](01-why-this-works.md) began: operate feeds back into idea. A number that looks wrong becomes next quarter's research question; a sorted report becomes a work order. Nothing in the arc was magic: structure the project so an agent can navigate it, give every stage evidence it can check itself, keep the lifecycle and tighten its gates. This Guide shipped through the loop it describes, and so did this page.

## Real names

Every picture this Chapter used, anchored to its real term:

| The picture | The real name |
| --- | --- |
| The work order | A ticket |
| The proof photo | The **Verification Medium** |
| The recipe card | A **skill** |
| The sorting bins | The five **triage labels** |
| The green light with no gatekeeper | **Auto-merge** |
| The conveyor belt | The **Docs Lane** |
