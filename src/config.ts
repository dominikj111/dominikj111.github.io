/**
 * Site configuration — the only file you need to edit when using this as a template.
 *
 * Steps to personalise:
 * 1. Update every value in this file.
 * 2. Set `site` in astro.config.mjs to your GitHub Pages URL.
 * 3. Replace src/assets/blog-placeholder-1.jpg with your own OG fallback image.
 * 4. Add your content to src/data/content.ts.
 * 5. Write blog posts in src/content/blog/.
 */

// ── Identity ────────────────────────────────────────────────────────────────

/** Your display name — used in meta tags, JSON-LD, and author fields. */
export const AUTHOR_NAME = 'Dominik J.';

/** Short handle / logo text shown in the sidebar. */
export const SITE_HANDLE = 'dominikj111';

/** One-line role shown under the logo and on the landing intro. */
export const AUTHOR_TAGLINE = 'Software Engineer';

// ── Site metadata ────────────────────────────────────────────────────────────

export const SITE_TITLE = 'dominikj111';

export const SITE_DESCRIPTION =
  'Projects, articles, and references — a knowledge hub for a software engineer.';

/** Landing intro sub-text shown before the user enters the portfolio. */
export const INTRO_SUBTEXT =
  'A knowledge hub for things I build, write about, and find worth sharing. Identity emerges from the work.';

// ── Social links ─────────────────────────────────────────────────────────────
//
// Each entry: { href, label }
// Icons are inlined SVGs defined in the sidebar components.
// Remove or add entries freely — the sidebar renders whatever is in this array.

export interface SocialLink {
  href: string;
  label: string;
}

export const SOCIALS: SocialLink[] = [
  { href: 'https://github.com/dominikj111',              label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/dominikj111/',    label: 'LinkedIn' },
  { href: 'https://www.reddit.com/user/domino_master/',  label: 'Reddit' },
  { href: 'https://crates.io/users/dominikj111',         label: 'crates.io' },
  { href: 'https://www.npmjs.com/~domino2',              label: 'npm' },
];
