---
name: Portfolio SPA architecture
description: Architecture, palette, and component layout of the portfolio SPA built for the main index page
type: project
---

The main index page is a React SPA (client:load) at src/pages/index.astro mounting PortfolioApp.tsx.

Color palette (strict — do not change without user approval):
- #1f363d darkest, #40798c primary, #70a9a1 secondary, #9ec1a3 accent, #cfe0c3 lightest

**Why:** User specified a strict 5-color palette as the design foundation.
**How to apply:** All portfolio styles use --pf-* CSS vars defined in portfolio.css. UC library tokens (--uc-*) are remapped to this palette in portfolio.css.

SPA component tree:
- PortfolioApp.tsx — state (introVisible, activeFilters, focusedId), URL sync, keyboard
- LandingIntro.tsx — fixed overlay, fades out on click, shows grid peeking at bottom
- FilterSidebar.tsx — sticky left nav, custom filter buttons (not using library FilterPill)
- ContentGrid.tsx — CSS grid (3→2→1 col), two-phase animation (exit 230ms → enter fade)
- ContentCard.tsx — individual card, stable height with min-height: 168px
- FocusPanel.tsx — position:fixed right-side slide, bottom-sheet on mobile

Data layer: src/data/schema.ts (types) + src/data/content.ts (11 items: 4 projects, 4 articles, 3 references)

URL state: ?f=project,article (filters) + ?focus={id} (open panel). Intro skipped when URL has params.

Layout constraint: NO masonry, NO reflow animations. Only opacity + transform(scale) transitions.
