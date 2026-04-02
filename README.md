# Portfolio + Blog — Astro GitHub Pages Template

A portfolio and blog platform built with **Astro 5**, **React**, and **Tailwind CSS v4**.
Deployable to GitHub Pages for free in minutes.

Live demo: <https://dominikj111.github.io>

---

## The idea

Most personal sites treat projects, blog posts, and links as separate sections — a projects page, a blog page, a bookmarks page. You navigate between them. They live in silos.

This template is built around a different idea: **a single content stream where projects, articles, and references are first-class equal citizens**. Everything is in one filterable, searchable view. You open a detail panel without leaving the page. You share a URL that restores exactly the filter and focus state you had. The blog is part of the same space, not a separate destination.

It is closer to a personal knowledge hub than a traditional portfolio site.

### How it compares

| Approach                     | Structure                                  | Navigation                    | Search                                    |
| ---------------------------- | ------------------------------------------ | ----------------------------- | ----------------------------------------- |
| **This template**            | Single unified stream; type filters        | In-page panel, no page reload | Inline fuzzy search (Fuse.js), URL-synced |
| Docusaurus / Hugo / Jekyll   | Separate pages per section                 | Full page navigation          | Usually a separate search page or plugin  |
| AstroPaper, Astrowind, Dante | Blog-first with optional portfolio section | Full page navigation          | Separate `/search` page                   |
| Notion / Bear public pages   | Document tree                              | Click into each document      | Full-text within the tool                 |

**Key differences:**

- No "projects page" vs "blog page" separation — one stream, filter by type
- Detail panel slides in over the content — context never lost
- Filter + search + focused item all live in the URL — shareable, bookmarkable, back-button-safe
- YouTube references embedded inline — not just links
- Pure static output — no server, no database, no CMS account required

---

## Features

- Filterable, searchable content stream (projects, articles, references)
- Slide-in focus panel with YouTube embed support
- Featured/pinned items section
- Grid and table view modes, persisted across sessions
- Full-text fuzzy search (Fuse.js) with URL state sync
- Blog with MDX support, RSS feed, and sitemap
- SEO: canonical URLs, Open Graph, JSON-LD structured data
- Responsive — mobile sidebar collapses to top bar

---

## Use as a Template

### 1. Fork or clone

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git my-blog
cd my-blog
pnpm install
```

### 2. Personalise

Edit **`src/config.ts`** — this is the only file you need to change to make it yours:

```ts
export const AUTHOR_NAME    = 'Your Name';
export const SITE_HANDLE    = 'yourhandle';
export const AUTHOR_TAGLINE = 'Your Role';
export const SITE_TITLE     = 'yourhandle';
export const SITE_DESCRIPTION = 'Your site description.';
export const INTRO_SUBTEXT  = 'Your landing intro copy.';

export const SOCIALS = [
  { href: 'https://github.com/yourhandle', label: 'GitHub' },
  // add more — see supported labels below
];
```

Supported social icon labels (add SVG to the icon maps in `FilterSidebar.tsx` and `BlogSidebar.astro` for any new ones):
`GitHub`, `LinkedIn`, `Reddit`, `crates.io`, `npm`

Update **`astro.config.mjs`**:

```js
site: 'https://yourusername.github.io',
```

### 3. Add your content

Edit **`src/data/content.ts`** — append items to `CONTENT_ITEMS`:

```ts
{
  id: 'my-project',
  type: 'project',          // 'project' | 'article' | 'reference'
  title: 'My Project',
  description: 'One-line summary.',
  content: 'Longer description.\n\nSupports paragraphs.',
  tags: ['rust', 'cli'],
  createdAt: '2024-06-01',
  url: 'https://github.com/you/project',
  pinned: true,             // appears in Featured section
}
```

YouTube URLs are automatically detected — they render an embedded player in the focus panel.

Write blog posts as Markdown/MDX in **`src/content/blog/`**.

### 4. Deploy to GitHub Pages

```bash
pnpm run deploy
```

In your GitHub repo settings → **Pages**, set source to **Deploy from a branch**, branch `main`, folder `/docs`.

Your site will be live at `https://yourusername.github.io`.

---

## Development

```bash
pnpm install   # install deps
pnpm dev       # dev server → http://localhost:4321
pnpm build     # build → docs/
pnpm preview   # preview production build
```

---

## Tech Stack

| Layer         | Technology                             |
| ------------- | -------------------------------------- |
| Framework     | Astro 5 (static, `docs/` output)       |
| Interactivity | React islands (`client:only`)          |
| Styling       | Tailwind CSS v4 + DaisyUI + custom CSS |
| Search        | Fuse.js (client-side fuzzy)            |
| Content       | Astro content collections (MDX)        |
| Deployment    | GitHub Pages                           |

---

## Free Hosting Alternatives to GitHub Pages

All of these support deploying a static site from a git repo with no payment required. The deploy model is the same — push to git, site rebuilds automatically.

| Service              | CDN / Edge         | Free bandwidth | Notes                                                             |
| -------------------- | ------------------ | -------------- | ----------------------------------------------------------------- |
| **Cloudflare Pages** | Global edge (best) | Unlimited      | Strongest free tier; connect your cloned repo, output dir `docs/` |
| **Vercel**           | Edge network       | 100 GB/mo      | Connect your cloned repo, set output dir to `docs/`               |
| **Netlify**          | CDN                | 100 GB/mo      | Connect your cloned repo, set publish dir to `docs/`              |
| **Render**           | CDN                | 100 GB/mo      | Static sites always-on on free plan                               |
| **GitLab Pages**     | Minimal            | 10 GB/mo       | Push your clone to GitLab, configure CI to publish `docs/`        |

The workflow is the same for all of them — after you've set up your own repo (see [Use as a Template](#use-as-a-template) above):

1. Push your personalised repo to GitHub (or GitLab for GitLab Pages)
2. Connect the repo to the hosting service dashboard
3. Set the publish/output directory to `docs/` (the pre-built static output committed by `pnpm run deploy`), or configure the platform to run `pnpm build` itself and point at `docs/`

For **Cloudflare Pages** specifically (recommended for best global performance):

1. Connect your GitHub repo in the Cloudflare dashboard
2. Set build command: `pnpm build` and output directory: `docs/`
3. Custom domain: add a CNAME in Cloudflare DNS — apex domains work too

---

## Hosting Sub-apps Under a Subdirectory

Because this is a user pages repo (`username.github.io`), the site lives at the root. To host a separate tool at `/benchmark/`:

**Option A — drop static files:** Copy the built output into `public/benchmark/`. Astro will include it in `docs/benchmark/` on next build.

**Option B — separate build:** Configure the sub-tool with `base: '/benchmark/'` and `outDir` pointing to `docs/benchmark/`, then build Astro first (it clears `docs/`) and the sub-tool second.
