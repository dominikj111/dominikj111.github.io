# Personal Portfolio & Blog

My personal GitHub Pages site - a portfolio, blog, and front-end sandbox built with **Astro**, **React**, and my custom **UI Components Library**.

🔗 **Live Site:** [dominikj111.github.io](https://dominikj111.github.io)

## 🎯 Purpose

This site serves multiple purposes:

- **Portfolio** - Showcase my projects (DesktopWeaver, Platonium, etc.)
- **Blog** - Write about topics I'm curious about
- **CV/Resume** - Professional background and experience
- **Front-end Sandbox** - Experiment with new ideas and technologies
- **Real-world Testing Ground** - First application using own [@ui-components-library](../my-saas/ui-components-library)

## 🛠️ Tech Stack

- **Framework:** [Astro](https://astro.build) - Content-focused static site generator
- **UI Components:** Custom React components from `@ui-components-library/react`
- **Styling:** Tailwind CSS v4 + DaisyUI
- **Content:** MDX for blog posts and project pages
- **Deployment:** GitHub Pages (static)

## 🏗️ Architecture

```()
Astro (Static Site Generator)
  ├── Static pages (.astro files)
  ├── React islands (interactive components from ui-components-library)
  └── MDX content (blog posts, project showcases)
```

**Islands Architecture:** Most content is pre-rendered HTML. React components from the UI library are loaded only where interactivity is needed (`client:load`, `client:visible`).

## 📁 Planned Structure

```()
src/
├── pages/
│   ├── index.astro              # Homepage
│   ├── about.astro              # About me / CV
│   ├── projects/
│   │   ├── index.astro          # Projects listing
│   │   ├── desktop-weaver.astro # DesktopWeaver project
│   │   └── platonium.astro      # Platonium platform
│   └── blog/
│       ├── [...slug].astro      # Blog post template
│       └── index.astro          # Blog listing
├── components/
│   └── (React components from ui-components-library)
├── layouts/
│   ├── Layout.astro             # Base layout
│   └── BlogPost.astro           # Blog post layout
└── content/
    └── blog/
        ├── post-1.mdx
        └── post-2.mdx
```

## 🎨 UI Components Library Integration

This is the **first real-world application** using the custom UI Components Library.

### Interactive Components Need React Wrappers

```tsx
// src/components/InteractiveButton.tsx
import { Button } from '@ui-components-library/react';

export default function InteractiveButton() {
  return (
    <Button onClick={() => console.log('click')}>
      Click me
    </Button>
  );
}
```

```astro
---
import InteractiveButton from '../components/InteractiveButton.tsx';
---
<InteractiveButton client:load />
```

**Benefits:**

- Test library components in production
- Shape the library based on real needs
- Discover integration issues early
- Demonstrate library capabilities

## 🚀 Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Deploying a separate tool under a subpath (e.g. `/benchmark/`)

Because this repo is a **user pages** repo (`dominikj111.github.io`), your site is served from the root:

- Main site: `https://dominikj111.github.io/`
- Sub-tool: `https://dominikj111.github.io/benchmark/`

There are two good ways to host a “separate project” (like a benchmark tool) under a subdirectory.

Note: to run the deploy script in this repo, use `pnpm run deploy` (or `pnpm deploy:docs`). `pnpm deploy` is a different pnpm command and will error unless you’re inside a pnpm workspace.

### Option A (simplest): drop prebuilt static files into `public/benchmark/`

If your benchmark tool can be built to a folder containing `index.html` (and assets), copy the build output into:

- `public/benchmark/`

Then run:

```bash
pnpm build
```

Astro will copy `public/benchmark/**` into the final output at `docs/benchmark/**`.

### Option B (fully separate app build): build into `docs/benchmark/` *after* `astro build`

If your benchmark is its own build system (Vite/React/etc.), configure it so that:

1) Its asset base path is `/benchmark/`
2) Its output directory is `../docs/benchmark` (relative to the benchmark project)
3) You build **Astro first**, then the benchmark app (Astro clears `docs/` on build)

Example for a Vite app living at `tools/benchmark/vite.config.ts`:

```ts
import { defineConfig } from 'vite';

export default defineConfig({
  // critical for GitHub Pages subdirectory hosting
  base: '/benchmark/',
  build: {
    outDir: '../../docs/benchmark',
    emptyOutDir: true,
  },
});
```

Build order:

```bash
pnpm build
pnpm --dir tools/benchmark build
```

### GitHub Pages settings

In GitHub repo settings → **Pages**, set:

- Source: **Deploy from a branch**
- Branch: your default branch (often `main`)
- Folder: `/docs`

If you want, I can wire this up end-to-end (scripts + optional GitHub Action) once you tell me what the benchmark tool is built with (Vite/React, plain HTML, another Astro app, etc.) and where its source lives.
