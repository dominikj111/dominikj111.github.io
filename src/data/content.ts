import type { ContentItem } from './schema';

export const CONTENT_ITEMS: ContentItem[] = [
  // ── Projects ──────────────────────────────────────────────────────────────
  {
    id: 'ui-components-library',
    type: 'project',
    title: 'UI Components Library',
    description:
      'A theming-first React component library built on Radix UI primitives and CSS custom properties — the design system powering this site.',
    content:
      'A monorepo component library designed for real-world SaaS applications. The core principle is that every visual attribute is driven by CSS custom properties, making the components drop-in compatible with any color system without modifying source code.\n\nThe library is organized into three packages: @ui-components-library/react (primitives + higher-level components), @ui-components-library/react-editors (rich-text, markdown, and code editors), and @ui-components-library/shared (utilities).\n\nBuilt on Radix UI for accessible primitives, class-variance-authority for variant management, and Lucide for iconography. The theming contract is strict: no hardcoded colors anywhere — only --uc-* CSS tokens that consumers can override at :root.',
    tags: ['react', 'typescript', 'design-system', 'radix-ui', 'monorepo'],
    createdAt: '2023-09-01',
    url: 'https://github.com/dominikj111',
    meta: { status: 'active', tech: ['React', 'TypeScript', 'Radix UI', 'pnpm workspaces'] },
  },
  {
    id: 'desktop-weaver',
    type: 'project',
    title: 'DesktopWeaver',
    description:
      'A workspace orchestration tool for defining, saving, and restoring multi-application desktop layouts across projects and contexts.',
    content:
      'Context-switching between projects is expensive. DesktopWeaver lets you define a workspace as a declarative configuration — which applications open, where they sit on screen, which URLs load, which terminal sessions start — and restore the entire environment in one command.\n\nThe goal is to eliminate the "boot-up tax" when returning to a project after days away. Workspaces are defined as portable JSON/YAML files that can be committed alongside the project itself.',
    tags: ['typescript', 'automation', 'productivity', 'electron'],
    createdAt: '2024-03-01',
    url: 'https://github.com/dominikj111',
    meta: { status: 'wip', tech: ['TypeScript', 'Electron', 'Node.js'] },
  },
  {
    id: 'platonium',
    type: 'project',
    title: 'Platonium',
    description:
      'A platform for structured knowledge sharing — connecting people through ideas rather than profiles.',
    content:
      'Platonium explores a different model for online knowledge exchange. Instead of building a social graph around people, it organizes content around ideas, arguments, and evidence — letting the quality of reasoning surface rather than the popularity of the author.\n\nThe platform is designed around structured discourse: claims link to supporting or opposing evidence, threads stay on-topic by design, and contributions are rated on clarity and logic rather than likes.',
    tags: ['react', 'platform', 'knowledge-management', 'typescript'],
    createdAt: '2024-01-15',
    meta: { status: 'wip', tech: ['React', 'TypeScript', 'Node.js'] },
  },
  {
    id: 'personal-site',
    type: 'project',
    title: 'This Site',
    description:
      'Personal knowledge hub and portfolio built with Astro, React islands, and the UI Components Library — the first real-world test of the design system.',
    content:
      'The site serves as both a portfolio and a living test environment for the UI Components Library. Every component placed on these pages is a real integration test.\n\nBuilt with Astro\'s islands architecture: the bulk of the page is pre-rendered static HTML; React components hydrate only where interactivity is needed. This keeps the JS payload minimal while preserving a rich interaction model.\n\nThe content stream layout, filter system, and focus panel are fully custom React — designed to be extracted into a reusable blogging platform when the patterns stabilize.',
    tags: ['astro', 'react', 'typescript', 'tailwind', 'static-site'],
    createdAt: '2024-06-01',
    url: 'https://dominikj111.github.io',
    meta: { status: 'active', tech: ['Astro', 'React', 'Tailwind CSS v4', 'MDX'] },
  },

  // ── Articles ──────────────────────────────────────────────────────────────
  {
    id: 'article-first-post',
    type: 'article',
    title: 'First Post',
    description:
      'Setting intentions for this space — what it is for, who it is for, and what I plan to write about.',
    content:
      'Every site needs a first post. This one is an introduction to the space itself: its purpose, its intended audience, and the rough shape of what will live here.\n\nExpect writing about software architecture, front-end craft, tool design, and the occasional deep-dive into ideas worth thinking through carefully.',
    tags: ['meta'],
    createdAt: '2022-07-08',
    slug: 'first-post',
  },
  {
    id: 'article-second-post',
    type: 'article',
    title: 'Second Post',
    description: 'Continuing the exploration — follow-up thoughts from the first entry.',
    content:
      'A continuation of the first post, refining some of the initial framing and adding context to the goals of this site.\n\nWriting in public is a forcing function for clarity. If you cannot explain a thing in writing, you probably do not understand it as well as you thought.',
    tags: ['meta', 'writing'],
    createdAt: '2022-07-15',
    slug: 'second-post',
  },
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
  {
    id: 'article-using-mdx',
    type: 'article',
    title: 'Using MDX',
    description:
      'How MDX enables mixing React components directly into Markdown — and when that is actually the right call.',
    content:
      'MDX bridges the gap between Markdown\'s readability and React\'s composability. This post explores when that bridge is worth crossing: interactive code samples, live charts, and context-aware callouts are good candidates; decorative animations are not.\n\nThe key discipline is restraint: MDX components should enhance comprehension, not compete with the text for attention.',
    tags: ['mdx', 'react', 'writing'],
    createdAt: '2022-08-15',
    slug: 'using-mdx',
  },

  // ── References ────────────────────────────────────────────────────────────
  {
    id: 'ref-astro',
    type: 'reference',
    title: 'Astro',
    description:
      'The web framework for content-driven sites. Ships zero JS by default; hydrates components on demand via the islands architecture.',
    content:
      'Astro is the right tool when content is the product. Its islands model lets you author in any framework (React, Vue, Svelte, Solid) while keeping the default output as lean static HTML.\n\nThe key insight behind Astro is that most of a content site\'s surface area does not need JavaScript at all — only the interactive islands do. This is a first-class constraint in the framework, not an optimization you bolt on afterwards.',
    tags: ['framework', 'static-site', 'islands-architecture', 'performance'],
    createdAt: '2024-02-01',
    url: 'https://astro.build',
  },
  {
    id: 'ref-radix-ui',
    type: 'reference',
    title: 'Radix UI',
    description:
      'Unstyled, accessible React primitives for building high-quality design systems. The foundation of the UI Components Library.',
    content:
      'Radix provides the hard parts — keyboard navigation, screen-reader labels, focus management, and ARIA semantics — so that component library authors can focus on visual design without re-implementing accessibility from scratch.\n\nThe primitives are deliberately unstyled. This makes them composable with any CSS approach: utility classes, CSS-in-JS, or the CSS custom property theming system used in this library.',
    tags: ['react', 'accessibility', 'primitives', 'ui-library'],
    createdAt: '2024-01-10',
    url: 'https://www.radix-ui.com',
  },
  {
    id: 'ref-islands-architecture',
    type: 'reference',
    title: 'Islands Architecture',
    description:
      'Jason Miller\'s model for shipping mostly static HTML with isolated interactive components — the pattern that makes Astro\'s performance story work.',
    content:
      'The islands architecture reimagines how we think about hydration. Rather than shipping a full React app and hydrating everything, you ship static HTML and only hydrate the interactive "islands" that actually need JS.\n\nThis cuts Time to Interactive dramatically for content-heavy sites and removes a whole class of hydration mismatch bugs. The mental model maps well to how users experience content: they read the page first, then interact with specific elements.',
    tags: ['architecture', 'performance', 'static-site', 'hydration'],
    createdAt: '2023-12-05',
    url: 'https://jasonformat.com/islands-architecture',
  },
];
