---
title: "From Factory Floor to Codebase: Application Composition with JigsawFlow"
description: "Replace direct concrete coupling with capability contracts and a flat registry — no DI framework, no configuration files. The result: isolated module testing without mocking scaffolding, practical hot-swapping, and a foundation for polyglot composition across languages."
pubDate: 'Apr 13 2026'
---

<!-- markdownlint-disable MD033 -->

The coupling problem is old and well-known — import a concrete type, and you've committed to it. DI frameworks solve this, but they bring their own weight: configuration files, container setup, framework lock-in. <a href="https://github.com/dominikj111/JigsawFlow" target="_blank" rel="noopener noreferrer">JigsawFlow</a> is an architectural pattern that takes a leaner approach: define contracts, resolve implementations through a shared registry, compose explicitly in one place. No framework. No magic.

The pattern isn't new to engineering. PLC systems in factory automation have operated this way for decades: standardized interfaces, hot-swappable modules, graceful degradation when a signal is missing. Automotive ECUs follow the same discipline through CAN bus protocols. JigsawFlow brings that discipline to general-purpose software — each module is a piece, and the application is whatever shape you assemble them into. The examples below are in Rust, where traits make contracts explicit, but the pattern is language-agnostic and applies wherever you can define an interface and a shared registry. Runnable versions of every snippet live at <a href="https://github.com/dominikj111/JigsawFlow/tree/main/examples/rust" target="_blank" rel="noopener noreferrer"><code>JigsawFlow/examples/rust</code></a>.

## The Idea: Capabilities Over Direct Coupling

The pattern inverts the dependency direction: instead of depending directly on concrete types, you define *contracts* (interfaces, or traits in Rust) and resolve implementations through a shared registry at runtime. You still import contracts — the abstractions — but never the concrete implementation. The registry is the only shared dependency.

Here's what that looks like using <a href="https://github.com/dominikj111/singleton-registry" target="_blank" rel="noopener noreferrer"><code>singleton-registry</code></a>, the Rust reference implementation:

```rust
use singleton_registry::define_registry;
use std::sync::Arc;

pub trait Formatter: Send + Sync {
    fn format(&self, title: &str, body: &str) -> String;
}

define_registry!(app);

// Business logic — knows nothing about which Formatter is registered
fn generate_report(title: &str, body: &str) {
    match app::get_cloned::<Arc<dyn Formatter>>() {
        Ok(fmt) => println!("{}", fmt.format(title, body)),
        Err(_)  => eprintln!("warn: no Formatter registered, skipping"),
    }
}

// Composition lives in main — the only place that picks concrete types
fn main() {
    app::register(Arc::new(PlainFormatter) as Arc<dyn Formatter>);
    generate_report("Q1", "Revenue up 12%.");
}
```

`generate_report` doesn't import `PlainFormatter`. It asks the registry: "is there anything satisfying `Formatter`?" If yes, use it. If no, warn and continue. That last part — **graceful degradation** — is enabled by the pattern. The `Err` arm is explicit at the call site, not hidden inside a framework. Missing capabilities don't silently crash; they're handled where the code that needs them lives.

This is the service locator pattern in the sense <a href="https://martinfowler.com/articles/injection.html#UsingAServiceLocator" target="_blank" rel="noopener noreferrer">Martin Fowler described it</a>. Fowler's trade-off is real: dependencies aren't visible from a function's signature — you have to read the body to find what it looks up. JigsawFlow accepts this deliberately; it's what makes graceful degradation possible. A component that fails at construction time if a dependency is absent can't degrade — it can only crash.

## Runtime Swappability

Because capabilities are resolved at call time, you can replace them mid-execution:

```rust
app::register(Arc::new(PlainFormatter) as Arc<dyn Formatter>);
generate_report("Q1", "Revenue up 12%.");

app::register(Arc::new(MarkdownFormatter) as Arc<dyn Formatter>);
generate_report("Q2", "Projections look strong.");
```

First report comes out as plain text, second as Markdown. `generate_report` never changed. In singleton-registry's implementation, the swap is concurrency-safe: any caller that already retrieved the old `Arc` keeps a reference to the previous allocation. New lookups get the replacement. No race condition, no null reference.

This is useful for configuration-driven behavior (pick an implementation based on a flag or env variable) or switching between compiled-in strategies at runtime. It's worth being precise here: because Rust is compiled, all implementations still need to be in the binary — this is within-process swapping, not dynamic module loading. True zero-downtime hot-swapping — loading a new compiled module without restarting the process — requires dynamic library loading. The registry abstraction is already shaped to accommodate it: consumers ask for a contract, not a specific binary, so the source of the implementation can change underneath without touching the pattern.

## Cheap Testing — and Better Tests

This is where I think the pattern has its biggest practical payoff.

Because business logic functions consume the registry, not concrete implementations, tests simply register a test implementation directly — no `#[mockall::automock]`, no test double scaffolding. The full example extends `generate_report` to write through a `Sink` contract rather than directly to stdout — that's the boundary `CapturingSink` satisfies:

```rust
struct CapturingSink(Mutex<Vec<String>>);

impl CapturingSink {
    fn new() -> Self { CapturingSink(Mutex::new(vec![])) }
    fn captured(&self) -> Vec<String> { self.0.lock().unwrap().clone() }
}

impl Sink for CapturingSink {
    fn write(&self, content: &str) {
        self.0.lock().unwrap().push(content.to_string());
    }
}

#[test]
fn report_includes_title() {
    // define_registry!(test_app) gives an isolated registry per test module
    let sink = Arc::new(CapturingSink::new());
    test_app::register(sink.clone() as Arc<dyn Sink>);
    test_app::register(Arc::new(PlainFormatter) as Arc<dyn Formatter>);

    generate_report("Q1", "Revenue up 12%.");

    assert!(sink.captured()[0].contains("Q1"));
}
```

Each module only communicates through the registry, so you test it without importing or wiring anything else — one module, the contracts it needs, nothing more. That's the TDD ideal: fully focused tests that cover exactly one piece of logic.

It also reaches boundaries that mocking libraries can't. Standard library utilities, for example, can't be decorated with `#[mockall::automock]` — but any boundary can be wrapped in a contract and satisfied by a lightweight test implementation registered directly.

Because the registry is the only shared dependency, test setup is just registering what the module under test needs — no constructor injection, no parameter threading, no shared mutable state passed around.

## Why "Microkernel"?

In operating systems, a microkernel keeps the core as small as possible — it manages only what everything else depends on, and pushes everything else (drivers, servers, filesystems) into isolated modules outside the kernel.

JigsawFlow applies the same principle at two levels. The registry is the minimal shared primitive: tiny, single-purpose, managing only in-process capability lookup. It knows nothing about your business logic. Everything else lives in modules around it — isolated, replaceable, independently testable.

The JigsawFlow Microkernel is the runtime built on that primitive. It extends capability resolution beyond the local process — adding a daemon, a CLI, and a resolution chain that reaches across local registries, LAN channels, and a global registry — while keeping the same discipline: the Microkernel itself manages nothing about your domain. It manages only where capabilities are found.

## Where This Points

What made PLCs generalize across the entire manufacturing industry was standardized interfaces. Once standard signal contracts existed, you could combine components from different vendors with confidence. The same leverage is available here — if the community converges on a set of standard contracts (`Logger`, `Storage`, `HttpClient`, `AuthProvider`, and so on), any module implementing those contracts becomes immediately composable across projects and teams without integration work.

The pattern points toward a tooling ecosystem where a CLI works like a package manager for capabilities: declare which contracts your application needs, tooling resolves and wires implementations — standard ones from a shared registry, specialised ones from focused packages, custom ones from your own codebase. Application development becomes directed composition, with the same feel as declaring dependencies in `Cargo.toml`, but at the capability level.

None of this tooling exists yet. <a href="https://github.com/dominikj111/singleton-registry" target="_blank" rel="noopener noreferrer"><code>singleton-registry</code></a> is the current starting point — a Rust reference implementation of the registry primitive, with a TypeScript port actively in development. The CLI capability manager, inter-capability communication channels, and polyglot contract tooling are open space, waiting to be built on top of the pattern.

The trajectory points toward **polyglot composition**: the same contract expressed as a Rust trait, a TypeScript interface, or a Python protocol — with implementations in any language satisfying it interchangeably. A Rust module and a Node.js service become equivalent from the consumer's perspective. That removes language choice from the architectural decision entirely.

This is also where JigsawFlow intersects with the current conversation around AI-generated software — from Jen-Hsun Huang's vision of AI turning everyone into a programmer to the emerging practice of *vibecoding*, where developers direct AI to write entire features from natural language and take an oversight role rather than sitting at the keyboard. The pitch is compelling, but the problem is structural: freeform generation without a shared vocabulary of contracts produces output that is opaque and bespoke — every artifact is one-off, boundaries are implicit, and reviewing what the AI produced means reading the whole thing rather than checking it against a known interface. There is no stable structure to build on.

JigsawFlow reframes this at two levels. At the application design level, AI becomes a reliable compositor: given a requirement, it navigates a defined contract catalog, selects which capabilities the feature needs, and generates only the business logic that wires them — output that is reviewable at a known boundary, not line by line. At the implementation level, developers still write contract implementations, with AI as assistant; the contract is the specification the AI works against, and the tests that verify compliance are the acceptance criteria. What gets committed is "an implementation of the Logger contract for Datadog" rather than "code that seems to work." That distinction — structured composition over freeform generation — makes AI contributions auditable, composable, and maintainable over time. Developers move up from writing boilerplate to designing contracts and domain logic: the parts that give an application its actual meaning.

Upcoming articles will go deeper on both: polyglot contracts across languages, and *GUI as a Contract*.

---

## References

- **<a href="https://github.com/dominikj111/JigsawFlow" target="_blank" rel="noopener noreferrer">JigsawFlow</a>** — the pattern specification, architecture docs, and multi-language examples
- **<a href="https://github.com/dominikj111/JigsawFlow/tree/main/examples/rust" target="_blank" rel="noopener noreferrer">JigsawFlow/examples/rust</a>** — runnable code for all three scenarios in this article: capability contract, runtime swap, and testing without mocks
- **<a href="https://github.com/dominikj111/singleton-registry" target="_blank" rel="noopener noreferrer">singleton-registry</a>** — the registry crate with runnable examples for basic usage, trait contracts, and singleton replacement
- **<a href="https://martinfowler.com/articles/injection.html#UsingAServiceLocator" target="_blank" rel="noopener noreferrer">Fowler, 2004 — Inversion of Control Containers and the Dependency Injection Pattern</a>** — the service locator trade-off this pattern knowingly accepts
