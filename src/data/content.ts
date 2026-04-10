import type { ContentItem } from './schema';

export const CONTENT_ITEMS: ContentItem[] = [
  // ── Pinned / Featured ─────────────────────────────────────────────────────
  {
    id: 'engram',
    type: 'project',
    title: 'Engram',
    description:
      'A deterministic reasoning kernel — symbolic AI that navigates a directed concept graph, asks targeted breaking questions, and emits typed action contracts. No GPU, no API key, no retraining.',
    content:
      'Engram is a finite-state reasoning engine built around a directed graph of concepts. Given a query, it spreads activation through edges, resolves ambiguity via targeted breaking questions, and emits a typed action contract for a separate execution layer. Every reasoning path is auditable; same input always produces the same output.\n\nThe design sits at the intersection of expert systems, task-oriented dialogue, and reinforcement-learned policy graphs. Edge weights update from session feedback without retraining — or stay frozen for compliance deployments. Raw input text is discarded at the tokeniser boundary and never enters any storage layer: privacy is structural, not policy.',
    tags: ['rust', 'ai', 'symbolic-ai', 'graph', 'reasoning', 'deterministic'],
    createdAt: '2026-04-01',
    pinned: true,
    url: 'https://dominikj111.github.io/engram/',
    meta: { status: 'active', tech: ['Rust', 'Graph traversal', 'Reinforcement learning'] },
  },
  {
    id: 'weaver-desktop',
    type: 'project',
    title: 'Weaver Desktop',
    description:
      'A lightweight desktop environment for embedded Linux and SBCs. Pure GUI thin-client — all system operations delegated to the workmeshd daemon. Target footprint: <50 MB RAM.',
    content:
      'Weaver Desktop is built with Rust and egui for Raspberry Pi Zero, cyberdecks, kiosks, and resource-constrained Linux. The UI never touches privileged operations — it delegates hardware control, service management, and device abstraction to a system daemon. The same binary reshapes into a traditional desktop, kiosk, cyberdeck control panel, or industrial HMI through configuration templates.\n\nThe key design idea: Weaver doesn\'t know about GPIO pins or system services — it knows about devices and panels. A 230 V relay becomes "Desk Socket", an I2C sensor becomes "Current: 2.4 A". Part of the wider WorkMesh ecosystem alongside the workmeshd daemon and a planned secure P2P platform.',
    tags: ['rust', 'egui', 'desktop', 'embedded', 'linux', 'raspberry-pi', 'iot'],
    createdAt: '2026-03-01',
    pinned: true,
    url: 'https://github.com/dominikj111/Weaver-Desktop',
    meta: { status: 'active', tech: ['Rust', 'egui', 'Linux', 'GPIO'] },
  },
  {
    id: 'jigsawflow',
    type: 'project',
    title: 'JigsawFlow',
    description:
      'A capability-driven microkernel architecture for offline-first, hot-swappable, language-agnostic applications. Components access capabilities through trait/interface contracts via a singleton registry — no direct coupling.',
    content:
      'JigsawFlow inverts the traditional plugin model: the entire application is modular. A minimal microkernel enforces interface contracts, manages component lifecycle, and enables hot-swapping without restart. Components discover capabilities through a singleton registry and degrade gracefully when optional capabilities are missing — no catastrophic failures.\n\nInspired by PLC systems and automotive component standardisation. The long-term vision is a community-driven ecosystem where standardised trait/interface contracts let a Rust data-processing component interoperate with a PHP web component or an industrial PLC module — all hot-swappable, offline-first, fully auditable. Released CC0 (code) + CC BY-SA (documentation).',
    tags: ['architecture', 'microkernel', 'modular', 'language-agnostic', 'offline-first', 'oss'],
    createdAt: '2026-01-01',
    pinned: true,
    url: 'https://github.com/dominikj111/JigsawFlow',
    meta: { status: 'active', tech: ['Rust', 'TypeScript', 'Language-agnostic spec'] },
  },
  {
    id: 'singleton-registry',
    type: 'project',
    title: 'singleton-registry',
    description:
      'A thread-safe singleton registry crate for Rust. Create isolated registries for any type — the foundational primitive behind the JigsawFlow architecture. Published on crates.io.',
    content:
      '`define_registry!(name)` creates an isolated, thread-safe store for any type using `Arc` and `Mutex`. Each type has exactly one instance per registry. Values can be overridden at runtime — existing `Arc` references remain valid, enabling hot-swap of configurations and services without breaking in-flight operations.\n\nDesigned as the infrastructure layer for the JigsawFlow microkernel: consumers depend on trait contracts registered in the registry, never on concrete implementations. Also useful standalone for application singletons, test isolation (register mock implementations without mocking libraries), and shared resources across threads.',
    tags: ['rust', 'crate', 'registry', 'singleton', 'jigsawflow', 'published'],
    createdAt: '2026-02-01',
    pinned: true,
    url: 'https://crates.io/crates/singleton-registry',
    meta: { status: 'active', tech: ['Rust'] },
  },

  // ── Projects ──────────────────────────────────────────────────────────────
  {
    id: 'ui-components-library',
    type: 'project',
    title: 'UI Components Library (private)',
    description:
      'A theming-first React component library built on Radix UI primitives and CSS custom properties — the design system powering this site.',
    content:
      'A monorepo component library designed for real-world SaaS applications. The core principle is that every visual attribute is driven by CSS custom properties, making the components drop-in compatible with any color system without modifying source code.\n\nThe library is organized into three packages: @ui-components-library/react (primitives + higher-level components), @ui-components-library/react-editors (rich-text, markdown, and code editors), and @ui-components-library/shared (utilities).\n\nBuilt on Radix UI for accessible primitives, class-variance-authority for variant management, and Lucide for iconography. The theming contract is strict: no hardcoded colors anywhere — only --uc-* CSS tokens that consumers can override at :root.',
    tags: ['react', 'typescript', 'design-system', 'radix-ui', 'monorepo'],
    createdAt: '',
    meta: { status: 'active', tech: ['React', 'TypeScript', 'Radix UI', 'pnpm workspaces'] },
  },
  {
    id: 'iced-shell',
    type: 'project',
    title: 'Iced Application Shell',
    description:
      'A comprehensive application shell built with the iced GUI framework — modals, overlays, context menus, toast notifications, theming, and keyboard shortcuts. Reference implementation and reusable foundation for iced apps.',
    content:
      'Iced Application Shell demonstrates production-ready patterns for Rust GUI development: a unified overlay system, context menus with smart edge-repositioning, slide-in animations, multiple colour themes (Dracula, Nord, Solarized, Gruvbox, Catppuccin, Tokyo Night), and adjustable typography. All interactions driven by keyboard shortcuts with clean message-based state updates.\n\nBuilt as both a learning resource and a practical starting point for new iced applications. The shell encapsulates the hard parts — focus management, toast lifecycle, window-size-aware positioning — so consuming code stays clean. A library crate extraction and Shell API are planned.',
    tags: ['rust', 'iced', 'gui', 'desktop', 'reference', 'theming'],
    createdAt: '2025-11-01',
    url: 'https://github.com/dominikj111/iced-shell',
    meta: { status: 'active', tech: ['Rust', 'iced', 'tokio'] },
  },
  {
    id: 'chart-sense',
    type: 'project',
    title: 'Chart Sense',
    description:
      'Reverse-engineer chart properties from PNG images using machine learning. Chart type classifier achieves 100% accuracy on controlled evaluation data. Designed for automated visual testing of chart rendering engines.',
    content:
      'Chart Sense takes a chart image and extracts structured properties — chart type, colours, labels, data values — using the best method for each property: sklearn Random Forest for classification, computer vision for colour extraction, OCR for text, and neural networks for complex visual patterns. The multi-method pipeline is modular: each extractor improves independently.\n\nTraining data is generated automatically via a ViteJS + ECharts frontend captured by Playwright — 1000+ labelled chart images produced without manual annotation. The sklearn classifier (100% accuracy, ~500 KB model) is production-ready; deep learning extractors for precise value reading are in development.',
    tags: ['python', 'machine-learning', 'computer-vision', 'sklearn', 'playwright', 'testing'],
    createdAt: '2026-02-01',
    url: 'https://github.com/dominikj111/chart-sense',
    meta: { status: 'active', tech: ['Python', 'sklearn', 'Playwright', 'TensorFlow', 'ViteJS'] },
  },
  {
    id: 'graphql-query-builder',
    type: 'project',
    title: 'GraphQL Tiny Lab',
    description:
      '"Learn GraphQL by shaping live data in a playful visual lab." A browser SPA with a Visual Query Builder, live GraphQL request payload panel, and result payload viewer backed by mocked generated data.',
    content:
      'An interactive playground for learning GraphQL without a real backend. The Visual Query Builder lets you compose queries by selecting fields and arguments; the request and result panels update in real time against a mocked data layer. The aim is to make the request/response cycle tangible before connecting to a production API.\n\nBuilt with React and TypeScript on Vite. The mock data layer generates plausible structured responses, so learners can explore field selection, nesting, and query arguments without any server setup.',
    tags: ['graphql', 'react', 'typescript', 'visual-builder', 'learning'],
    createdAt: '2026-04-01',
    url: 'https://github.com/dominikj111/graphql',
    meta: { status: 'active', tech: ['React', 'TypeScript', 'GraphQL', 'ViteJS'] },
  },
  {
    id: 'llm-sandbox',
    type: 'project',
    title: 'LLM Sandbox',
    description:
      'Personal LLM playground — Dockerised solutions for diffusion models, Jupyter Notebooks, and Llamafile. Run local AI models with zero host pollution.',
    content:
      'A collection of Docker Compose stacks for experimenting with local AI: image diffusion pipelines, Jupyter Notebook environments for data exploration, and Llamafile setups for running quantised language models entirely offline. Each stack is self-contained — start, experiment, remove, no residue on the host system.',
    tags: ['docker', 'llm', 'ai', 'diffusion', 'jupyter', 'python'],
    createdAt: '2025-01-01',
    url: 'https://github.com/dominikj111/LLM',
    meta: { status: 'active', tech: ['Docker', 'Python', 'Jupyter', 'Llamafile'] },
  },
  {
    id: 'wave-docker-starter',
    type: 'project',
    title: 'Wave SaaS Docker Starter',
    description:
      'Production-ready Docker development environment for the Wave SaaS platform. Wave core stays pristine inside containers; all customisation via bind-mounted plugin and theme directories. One-command setup.',
    content:
      'The starter solves the Wave upgrade problem: keep the Wave core unmodified inside the container while developing plugins and themes via bind mounts. Child-parent theme inheritance means only changed components are overridden. Switching to a new Wave version is a container rebuild, not a merge conflict.\n\nFull stack out of the box: PHP 8.2, Nginx, MariaDB, phpMyAdmin, and Mailpit for email testing. Custom plugins ship in the `/plugins` directory and demonstrate real Laravel/Wave integration patterns. Environment configuration via `docker-compose.yml` overrides.',
    tags: ['docker', 'laravel', 'php', 'saas', 'wave', 'devops'],
    createdAt: '2025-12-01',
    url: 'https://github.com/dominikj111/wave-docker-starter',
    meta: { status: 'active', tech: ['Docker', 'PHP 8.2', 'Laravel', 'Nginx', 'MariaDB'] },
  },
  {
    id: 'npm-simple-comparator',
    type: 'project',
    title: 'simple-comparator',
    description:
      'Lightweight JavaScript object comparison utility. Published on npm under BSD-3-Clause.',
    content:
      'A minimal, dependency-free utility for comparing JavaScript objects and values. Handles deep equality, type coercion edge cases, and circular references cleanly. Published and maintained on npm.',
    tags: ['npm', 'javascript', 'typescript', 'utility', 'published'],
    createdAt: '2026-02-01',
    url: 'https://www.npmjs.com/package/simple-comparator',
    meta: { status: 'active', tech: ['JavaScript', 'TypeScript', 'Node.js'] },
  },
  {
    id: 'npm-prutill',
    type: 'project',
    title: 'prutill',
    description:
      'Utility library for common JavaScript/TypeScript programming tasks. Published on npm under Apache-2.0.',
    content:
      'A collection of focused utility functions for everyday JavaScript and TypeScript tasks — string manipulation, array helpers, and object utilities that are too small for dedicated packages but too useful to rewrite per project.',
    tags: ['npm', 'javascript', 'typescript', 'utility', 'published'],
    createdAt: '2025-04-01',
    url: 'https://www.npmjs.com/package/prutill',
    meta: { status: 'active', tech: ['JavaScript', 'TypeScript', 'Node.js'] },
  },
  {
    id: 'npm-call-to-promise',
    type: 'project',
    title: 'call-to-promise',
    description:
      'Converts callback-based functions to Promise-based functions. Published on npm under BSD-3-Clause.',
    content:
      'A small utility that wraps Node.js-style callback APIs (last argument is `(err, result)`) into Promises without boilerplate. Useful for modernising legacy code or third-party libraries that haven\'t adopted the Promise/async pattern.',
    tags: ['npm', 'javascript', 'typescript', 'async', 'promise', 'published'],
    createdAt: '2025-03-01',
    url: 'https://www.npmjs.com/package/call-to-promise',
    meta: { status: 'active', tech: ['JavaScript', 'TypeScript', 'Node.js'] },
  },

  // ── Articles ──────────────────────────────────────────────────────────────
  {
    id: 'article-markdown-guide',
    type: 'article',
    title: 'Markdown Style Guide',
    description:
      'A reference for Markdown formatting conventions used in this site — headings, code blocks, callouts, and more.',
    content:
      'A practical style guide covering the Markdown conventions used across this site. Useful as both a reference for writing new posts and as a test page for styling.\n\nCovers headings hierarchy, inline code vs code blocks, blockquotes for callouts, table formatting, and how to handle images with captions.',
    tags: ['writing', 'markdown', 'reference'],
    createdAt: '2022-08-01',
    slug: 'markdown-style-guide',
  },

  // ── Videos ────────────────────────────────────────────────────────────────
  {
    id: 'video-morning-coffee',
    type: 'reference',
    title: 'Morning Coffee — The Good Life No.18',
    description:
      'Calm, uplifting chillout house lounge mix — good background music for a focused morning.',
    content:
      'A relaxing chillout house set perfect for starting the day. Happy, soothing background music that stays out of the way while you work.',
    tags: ['music', 'chill', 'focus'],
    createdAt: '2024-04-01',
    url: 'https://www.youtube.com/watch?v=SSuCyZlksrI',
  },
];
