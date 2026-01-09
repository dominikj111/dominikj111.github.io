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
