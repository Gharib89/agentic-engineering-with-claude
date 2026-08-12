# From idea to plan

[Chapter 1](01-why-this-works.md) ended on a warning: when implementation is cheap, a vague plan produces working code that solves the wrong problem by lunchtime. This Chapter is the counter. Before any code, the idea is turned into shared understanding — an interview that separates facts from decisions, research against primary sources, a domain model that grows as you go, and finally a spec cut into tickets an agent can build from a fresh session. When the effort is too foggy even for that, you map the decisions first. Planning stops being a document you write alone and becomes a dialogue the agent drives.

![The idea-to-ship chain: an idea passes through the interview, research, and domain modeling into a spec, which is cut into tickets that feed the build loop](../assets/diagrams/idea-to-ship-chain.svg#only-light)
![The idea-to-ship chain: an idea passes through the interview, research, and domain modeling into a spec, which is cut into tickets that feed the build loop](../assets/diagrams/idea-to-ship-chain.dark.svg#only-dark)

## The interview: facts are the agent's job, decisions are yours

Do not brief the agent — let it interview you. A planning session opens with the agent asking hard questions about the idea, and every question it raises sorts into one of two piles. Questions of fact — what does the platform support, what does the standard say, what does the existing system do — are the agent's own job: it can go find the answers, and it should never ask you for them. Questions of decision — what is in scope, which trade-off wins, how much risk is acceptable — belong to the human: they cannot be looked up, only made. The interview is done when every open question is a decision, and every decision is made and written down.

The why is the economics of [Chapter 1](01-why-this-works.md): an idea in one person's head is not shared understanding, and an agent that guesses at decisions builds the wrong product at full speed. An interview skill that grills relentlessly — Matt Pocock's [grilling skill](https://www.aihero.dev/skills-grill-with-docs) is the one the Guide's toolkit builds on — knows which pile each question belongs to, and turns the fuzzy front of a project into an explicit list of calls the human actually made.

!!! example "crm — protocol facts researched, scope decided"
    `crm`, a command-line client for Microsoft Dynamics 365, faced two very
    different questions when authentication was planned. What each
    deployment speaks — on-premises servers use NTLM, the cloud service
    uses OAuth — is a fact, and the agent resolved it from vendor
    documentation without asking anyone. Whether the tool should support
    both deployments was a decision, made by a human and recorded — not
    guessed at by an agent mid-implementation.

## Research: primary sources before commitment

Every plan rests on claims about the world outside the repo — what an API returns, what a format allows, what a service costs. Each such claim gets researched against primary sources: official documentation, the standard, the observable behavior of the real system. A model's trained knowledge is a snapshot that ages from the day it was taken, so "the agent remembers the API" is not evidence; the current docs are. That makes research a first-class activity of the lifecycle, not something folded silently into coding — it has its own deliverable, a findings document committed to the repo with sources cited, which is exactly what a [research skill](https://www.aihero.dev/skills-research) produces on demand.

The written findings are the point. Research that lives in one session's context dies with the session; a findings file turns one session's reading into project memory that every later session — and every human — inherits. The cost asymmetry is the same as the ADR's in [Chapter 2](02-project-setup.md): an hour of reading is cheap against a week of building on a false claim.

!!! example "cc-otel — read the telemetry docs before the first report"
    `cc-otel`, a Reference Repo that collects Claude Code usage telemetry
    and lands it in Power BI reports, depends entirely on one factual
    question: which metrics and events Claude Code actually emits. The
    answer came from the official telemetry documentation, researched and
    written down before the first report was designed — so later sessions
    build on verified event names instead of re-deriving or hallucinating
    them.

## Model the domain as you go

The interview and the research keep surfacing concepts that need names. Name each one the moment it appears: define the term once in the project glossary, list the synonyms the project refuses to use beside it, and when a discussion settles a choice that shapes the system, record it as an ADR then and there. This is domain modeling as a habit, not a phase — no up-front modeling workshop, just a rule that no concept leaves the planning conversation unnamed and no decision leaves it unrecorded; a [domain-modeling skill](https://www.aihero.dev/skills-domain-modeling) makes both moves routine.

[Chapter 2](02-project-setup.md) scaffolded the empty glossary and ADR log; planning is when they fill. The why is the same mirror effect from that Chapter: agents repeat the vocabulary you give them, so a term pinned during planning propagates into every issue, test name, and page that follows — one concept, one word, everywhere.

!!! example "this repo — Verification Medium was named during planning"
    In this repo — the Guide's own source, and one of its Reference Repos —
    the term *Verification Medium* (the evidence an agent checks its own
    work against) did not exist before the Guide was planned. The concept
    kept recurring in the spec conversation under shifting names, so it was
    defined once in the glossary at the repo root, avoided synonyms listed
    beside it. The writing standards now grep every diff for those
    synonyms: a word coined during planning became an enforceable rule for
    the whole project.

## The spec and its tracer-bullet tickets

The interview's decisions, the research findings, and the settled vocabulary converge in a spec: the problem, the shape of the solution, the user stories, the decisions made — with the options rejected — and what is out of scope. The spec is the durable record of the dialogue; the next session reads the decisions, never the chat that produced them — and a [to-spec skill](https://www.aihero.dev/skills-to-spec) drives the dialogue into exactly this document. And the spec is a parent, not a work item: nothing builds "the spec", so it never enters a work queue.

What enters the queue are tickets cut from the spec — a [to-tickets skill](https://www.aihero.dev/skills-to-tickets) does the cutting — and each one is a tracer bullet: a thin slice that travels the whole distance — through every layer, ending in something a user or a check can see — rather than a layer built in isolation. Each ticket is self-contained in the sense [Chapter 2](02-project-setup.md) demanded: the goal, the checks that prove it done, pointers to the context it needs. Order lives in explicit blocking edges between tickets, not in anyone's head — which makes "what can start right now?" a machine-readable query over the unblocked frontier, so an agent picks its next ticket with no human dispatcher.

!!! example "this repo — a spec with eight tracer bullets"
    The Guide's spec is one parent issue holding the problem statement, the
    user stories, and every implementation decision. Its tickets are
    sub-issues, one per Chapter — each a tracer bullet that ships one page
    end to end, from claim to live site, through the Docs Lane. The ticket
    for this page carried an explicit blocking edge to the Docs Lane ticket:
    until the lane existed, no queue query would surface this page as ready
    to build.

## Too foggy to spec? Map the decisions first

Some efforts resist a single interview: the unknowns interlock, and each answer moves the others. Forcing a spec there just launders guesses into decisions. Map the effort instead, with a [wayfinder skill](https://www.aihero.dev/skills-wayfinder). A wayfinder map is a living record with three parts — notes, the decisions made so far, and the fog: the open questions still ahead. Each question in the fog becomes a child ticket typed by what resolves it: **research** when an answer exists in primary sources, **prototype** when the answer only comes from building something throwaway, **grilling** when it is a genuine human decision needing an interview, and **task** when the work is already clear. Blocking edges connect the children, and the frontier — unblocked children — is where work happens.

![A wayfinder map: one map record holds notes, decisions-so-far, and the fog; each open question becomes a typed child — research, prototype, grilling — on the unblocked frontier, the frontier blocks the task whose work is already clear, and resolved children write their answers back to the map; when the fog is empty the map converges on a spec, or ships piecewise straight off the map](../assets/diagrams/wayfinder-map.svg#only-light)
![A wayfinder map: one map record holds notes, decisions-so-far, and the fog; each open question becomes a typed child — research, prototype, grilling — on the unblocked frontier, the frontier blocks the task whose work is already clear, and resolved children write their answers back to the map; when the fog is empty the map converges on a spec, or ships piecewise straight off the map](../assets/diagrams/wayfinder-map.dark.svg#only-dark)

Every resolved child writes its answer back to the map, and the fog recedes. Some efforts converge on a spec once enough is known; others ship piecewise straight off the map. Either way the point is the same: under fog of war, you buy information before you commit — and the map keeps a multi-session effort coherent, because any fresh session can read where the effort stands and pick up the frontier.

!!! example "this repo — a map is one issue, fog and all"
    This repo wires the wayfinder shape into its issue tracker: the map is
    a single labeled GitHub issue holding notes, decisions-so-far, and the
    fog; children are sub-issues typed research, prototype, grilling, or
    task; blocking edges use GitHub's native issue dependencies. "What is
    unblocked?" is one query against the tracker — the
    [issue-tracker agent doc](../agents/issue-tracker.md) records the whole
    mapping, so any session can run a wayfinding operation without
    reinventing it.

## From plan to build

A plan that ends as self-contained, tracer-bullet tickets is a plan an agent can execute without you in the room. [Chapter 5](05-implementation.md) picks up the first ticket and builds it — and the loop from [Chapter 1](01-why-this-works.md) carries the rest: the sharper the plan going in, the more the later gates can trust what comes out.
