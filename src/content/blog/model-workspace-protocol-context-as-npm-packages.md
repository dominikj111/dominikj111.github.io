---
title: 'Your Folder Tree Is Already a Context Engine'
description: "Jake Van Clief's Model Workspace Protocol reframes AI context engineering as filesystem architecture. For JS/TS developers, the insight goes further: Node.js module resolution is already a context cascade engine — and npm packages are the missing distribution layer."
pubDate: 'May 15 2026'
updatedDate: 'May 15 2026'
tags: ['draft', 'ai', 'context-engineering', 'icm', 'mwp', 'npm', 'typescript', 'workflow']
---

My path to structured AI workflows went through the same stages I suspect many developers hit, in roughly the same order.

First, long prompts — detailed descriptions of what I want, repeated in full every session. Then I noticed the repetition and pulled the stable parts into files I could reference explicitly. Then I discovered `CLAUDE.md` and put the always-true stuff there to stop retyping it. Then agents: one agent per task, invoked by name. And eventually, when I wanted to reduce the typing further, I started thinking about chaining agents together.

That last step is where things quietly get complicated — though not for the reason I initially assumed.

Modern AI assistants handle agent context passing reasonably well. When Claude spawns a sub-agent, it constructs the briefing prompt itself, injecting whatever context it judges relevant. Technically, information does transfer. Sessions can persist state through memory documents. The naive "agents start blank" criticism isn't quite right.

The actual problem is subtler: **the human drops out of the context-authoring role.** When the AI constructs the handoff between stages, it decides what was important. When an AI-managed memory document captures your preferences, it's reconstructing what it inferred about you. This is approximation, not instruction.

Compare that to a `perspective.md` file you wrote yourself: "when in doubt, prefer explicit over clever; never introduce abstractions the codebase hasn't earned yet; error messages are for the next developer who hits this, not for the system log." That's your judgment, in your words, reviewed by you. An AI reconstructing that from session history will get close. It won't get it right in the edge cases — which is exactly when it matters most.

The context you built up in steps 2 and 3 — the reference files, the `CLAUDE.md` — is valuable precisely because it's human-authored. Chaining agents hands that authorship back to the AI.

The irony is that steps 2 and 3 were already the right direction. I was building ICM without knowing it had a name.

## What ICM / MWP Actually Is

Jake Van Clief's Interpretable Context Methodology — also called Model Workspace Protocol (MWP) — was published in [arXiv:2603.16021v1](https://arxiv.org/html/2603.16021v1) in March 2026. Its central thesis is disarmingly simple: if a workflow's prompts and context already exist as numbered folders and markdown files, you do not need an orchestration framework.

The filesystem *is* the architecture.

Five design principles underpin this. Each stage handles exactly one job. Every interface is plain text — markdown and JSON, human-readable at every layer. Agents receive only the context relevant to their stage, which prevents the "lost in the middle" degradation Liu et al. identified in long-context LLM performance. Every intermediate output stays readable between stages, keeping the human genuinely in the loop. And you configure the factory once, then run it repeatedly.

These principles produce what the paper calls a five-layer context hierarchy. Layer 0 carries global project identity (~800 tokens). Layer 1 is routing — which stage handles what. Layer 2 is stage-specific contracts: input, process, output. Layer 3 is reference material: voice, conventions, design systems. Layer 4 is working artifacts from the current run. A focused stage loads 2,000–8,000 tokens. A monolithic approach loading everything simultaneously exceeds 40,000.

Two mechanisms make the human review gate work in practice. First, every stage boundary requires a human decision: the agent writes, you read, edit, approve. The approved output is the *only* input for the next stage. No agent-to-agent handoff. If you edit, the edit is truth. Second, instead of vector databases and RAG, project state lives in specific named files with known paths. The AI loads what it needs by path. No retrieval uncertainty, no stale embeddings — just predictable lookups.

The paper's most useful distinction is between references and agents. An agent is a separate session: token-expensive to brief, carrying none of the texture of the main session, producing output that needs review before you can trust it. A reference is a markdown file loaded into the *same* session. It costs near-zero additional tokens, shapes every sentence the AI writes from that point forward, and accumulates your perspective over time. An agent is a worker you brief for a task. A reference is part of how you think, loaded into the AI so it thinks the same way.

Most "I want an agent for X" instincts are actually "I want the AI to keep X in mind." That is a reference, not an agent.

## The Folder Tree as Context Concatenation Machine

The paper describes its folder structure primarily in terms of workflow stages. The practitioner insight is sharper than that.

The folder tree is not just a workflow container. It is a **context concatenation machine**.

When you are deep in a task folder, every parent folder's context file has already loaded. Each level adds a layer of specificity. A task file at `dev/browser-sdk/phase-6/00_intent.md` inherits all three ancestor context layers before it even begins. The deeper you go, the more specific the concatenated context — without any agent re-briefing or token-expensive reconstruction.

```text
workspaces/
├── CONTEXT.md              ← identity, broad goals (loads always)
├── dev/
│   └── CONTEXT.md          ← dev standards, active skills, coding conventions
├── testing/
│   └── CONTEXT.md          ← test layout, coverage rules, what not to mock
├── debugging/
│   └── CONTEXT.md          ← reproduce → root-cause → fix discipline
└── releasing/
    └── CONTEXT.md          ← checklist, version tagging, migration notes
```

You never load testing context when doing development work, and vice versa. The room structure is the scoping mechanism. No search, no retrieval — the hierarchy encodes the scope.

If you've worked in a Node.js project, this structure is already familiar. Node.js module resolution walks up the directory tree until it finds the closest match. It is already a cascading lookup algorithm. The only novelty here is that the thing being cascaded is AI context instead of code imports.

## Where the Paper's Model Falls Short for Software Projects

Van Clief's examples are content pipelines: video production, course decks. These map cleanly to the five layers. But a software codebase carries a category of reference material that the paper doesn't fully account for.

The simplest example is a unit test. A reference file might say "all public API methods must return a `Result` type; never throw." A unit test already encodes that same constraint as executable code. Before loading the reference into a pipeline stage, you run the tests. Pass means the codebase is consistent with the constraint you're about to load. Fail means the AI would be reasoning from a false premise — and you want to know that before the stage begins, not after.

A `check-sync.sh` script that greps both sides of a TS/Rust API boundary for type divergence is the same idea at a coarser level — useful when there's no test harness for the constraint, but unit tests are the better anchor where they exist. They're already written, already understood by every developer on the project, and their output is unambiguous.

The paper's layers don't have a slot for this. These are Layer 3 references that also function as pre-flight checks: run them, get a pass/fail, load the reference only if the system is in a consistent state.

This is a real implementation gap worth naming. MWP as described works for content pipelines. Applying it to a software codebase requires a sixth category: **verified references** — constraints expressed as markdown *and* a check that confirms the codebase currently satisfies them. For most teams, that check already exists as a test suite.

The compiler metaphor captures the full picture better than "pipeline":

- Source files are CONTEXT.md files, intent files, and reference material
- Compilation passes are pipeline stages: explore → plan → implement → verify
- The human review gate is the linker step — you inspect the intermediate representation before the next pass runs
- Verified references are the type checker — they reject the build before bad assumptions propagate

A compiler doesn't load everything at once. It loads what each pass needs, with the right inputs per pass, and a human validates each intermediate. The folder-tree approach outperforms a single massive prompt for the same reason a multi-pass compiler outperforms a single-pass one.

## Workspaces as npm Packages

This is the part that isn't in the paper.

In a TypeScript or JavaScript project, Node.js module resolution is already installed. It already walks the directory tree. It already has a distribution mechanism — npm — with versioning, composability, and a registry that developers use daily.

What if workspace context files were published as npm packages?

```bash
npm install @org/ai-workspace-base
npm install @org/ai-workspace-rust-conventions
npm install @org/ai-workspace-browser-sdk
```

Each package contributes CONTEXT.md files, skill templates, and pipeline templates into the project tree under `node_modules/`. These merge naturally with Node.js module resolution — the algorithm is already written. You are using it for AI context instead of code imports.

The folder tree becomes the context graph. npm becomes the distribution mechanism.

This unlocks a specific kind of composability that doesn't exist today. Teams share linting configurations through `@org/eslint-config`. They share TypeScript strictness presets through `@org/tsconfig`. They share commit message conventions through `@org/commitlint-config`. These are conventions about how the codebase should behave, versioned and distributed independently of product code.

AI workspace conventions are the same kind of artifact. They describe how the AI should think about the codebase — which constraints apply in which rooms, which patterns to enforce, which voice to adopt. There is no principled reason these should live only inside individual project repositories, hand-copied between teams.

A concrete composition model:

```text
@org/ai-workspace-base       ← identity, rules, perspective, graduation path
@org/ai-workspace-rust       ← Rust error handling conventions, no-unwrap policy, test layout
@org/ai-workspace-browser-sdk ← tRPC contract enforcement, UI boundary rules, bundle constraints
```

A new developer joins the project, installs dependencies, and the AI workspace conventions are already in the tree — the same way ESLint rules and TypeScript configuration are already in the tree. They don't need to learn custom terminology cold, because the root CONTEXT.md explains the convention by being an instance of it.

The versioning benefit is underappreciated. When Rust conventions evolve, you bump the package version and update the lockfile. The change is explicit, reviewable, and rollbackable — the same properties your code dependencies have. The current alternative is noticing that the Rust conventions in one project have drifted from the ones in another project, and manually reconciling them.

## Honest Tradeoffs

The paper is clear about its limitations and the article should be equally direct about them.

The method has been tested with Claude Opus 4.6 and Sonnet 4.6 only — cross-model behavior is unstested. The community in the study was 52 users in an invite-only setting; the U-shaped intervention finding (heavy editing at stage 1, light in the middle, heavy at the final stage) is observational, not a controlled experiment. There is no ablation study, no comparison against baselines, no formal evaluation metric.

It does not work for real-time multi-agent collaboration. It does not work for high-concurrency systems. It does not work for complex automated branching logic where stages need to diverge dynamically based on machine-generated outputs. These are not edge cases — they are entire workflow categories where a different architecture is correct.

The npm package idea is a proposal, not a proven pattern. It hasn't appeared in the literature. It has not been tested in a multi-team production environment. The composability story is compelling in theory; whether `node_modules/` is the right location for AI workspace files — given that it's gitignored by default, tooling-heavy, and subject to hoisting behavior — is an open question. A simpler version using a local `ai-workspaces/` directory with a custom resolution algorithm might be more practical before package registries gain native support for the pattern.

The method requires deliberate setup per task. Writing a `00_intent.md` before each pipeline, reviewing output before passing it forward, maintaining reference files as the project evolves — these are non-trivial costs. The payoff is outputs that sound like you built them, failure modes that surface at review gates rather than downstream, and an AI that gets more useful over time as the reference files mature. Whether that payoff justifies the overhead depends on your project's complexity and how much you care about the AI's outputs sounding like your codebase.

## What to Try First

If the argument is persuasive but the full method feels like too much scaffolding, the smallest useful version is this: write one `perspective.md` file and load it explicitly. Not rules (you probably already have those implicitly), not a pipeline structure — just a file that encodes your taste decisions and judgment calls for ambiguous cases. The things where you keep editing AI output to match your voice. The file that, once loaded, makes the AI produce less of the uncanny-valley-correct output that reads like a technical document rather than your code.

That single file is where the method's value concentrates. Everything else is the structure that makes it scale.
