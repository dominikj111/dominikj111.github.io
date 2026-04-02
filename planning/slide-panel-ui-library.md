# UI Library Extraction Candidates

Components built in `my-github-pages` that are generic enough to live in `@ui-components-library/react`.
None of these should be moved until the pattern has stabilised in the portfolio.

---

## 1. `SlidePanel` (from `FocusPanel.tsx`)

**Status:** Implemented in portfolio as `FocusPanel.tsx`. Ready to extract.

**What it is:** A position-fixed side/bottom drawer that slides in from the right on desktop (`translateX`) and becomes a bottom sheet on mobile (`translateY`). Dims background via overlay. No Radix Dialog — intentionally does **not** trap focus (background remains interactive).

**Library gap:** `item-panel.tsx` already exists but is a completely different concept — a list manager for pinning/renaming items. The slide-in panel shell primitive does not exist anywhere in the library.

### SlidePanel API

```tsx
<SlidePanel
  open={boolean}
  onClose={() => void}
  side?: 'right' | 'left'
  width?: string
  mobileMode?: 'bottom-sheet' | 'fullscreen'
  overlayBlur?: boolean
  overlayDismiss?: boolean
  aria-label?: string
>
  {children}
</SlidePanel>
```

No header/body/footer slots — raw container, consumers structure the interior.

### SlidePanel extraction steps

1. **Strip FocusPanel.tsx** — remove all portfolio-specific JSX (type label, title, meta, content, links). Keep only the `<aside>` shell + overlay `<div>`.
2. **Create `packages/react/src/ui/slide-panel.tsx`** — extract the shell with `uc-slide-panel` class naming.
3. **Move CSS** from `portfolio.css` to library styles. Key tokens:

   ```css
   --uc-panel-width: min(580px, 46vw);
   --uc-panel-bg: var(--uc-color-card);
   --uc-panel-shadow: -6px 0 36px rgba(0,0,0,0.1);
   --uc-overlay-bg: rgba(0, 0, 0, 0.38);
   --uc-overlay-blur: 2px;
   ```

4. **Export** from `packages/react/src/index.ts`.
5. **Update `llms.txt`** in the library repo — add `SlidePanel` under Primitives.
6. **Update portfolio** — replace `FocusPanel.tsx` shell with `<SlidePanel>` import; keep interior content as `FocusPanelContent`.
7. **Validate** — dev mode, mobile bottom-sheet, Escape key (handled in `PortfolioApp`, not inside panel).

**What stays in portfolio:** All interior markup — type dot, title, meta row, content paragraphs, YouTube embed, action links. That is the consumer, not the primitive.

> Do **not** use Radix Dialog as base — it traps focus and disables scroll. The slide panel should leave the background interactive.

---

## 2. `ViewToggle` (from `PortfolioApp.tsx` + `PinnedSection.tsx`)

**Status:** Duplicated in two portfolio components. No equivalent exists in the library.

**What it is:** A compact group of icon-toggle buttons for switching between display modes (e.g. grid vs table). Currently `pf-view-btn` buttons with inline SVG icons.

**Library gap:** `toggle-button.tsx` is a split-pill boolean toggle — a different shape and purpose. Icon-based display-mode switchers are absent.

### ViewToggle API

```tsx
<ViewToggle
  value={string}
  onChange={(value: string) => void}
  options={[{ value: string; icon: ReactNode; label: string }]}
/>
```

### ViewToggle rationale

- Zero domain logic — just maps a value to an active button state
- Identical code currently lives in two portfolio components
- Reusable in any data-heavy UI: list/table/kanban switchers, card/row switchers

### ViewToggle extraction steps

1. Extract `pf-view-btn` + `pf-toolbar__views` into `packages/react/src/view-toggle.tsx`.
2. Rename classes to `uc-view-toggle` / `uc-view-btn`.
3. Export from index.
4. Portfolio imports `ViewToggle`, passes grid/table SVG icons as the `options` array.

---

## 3. `SearchInput` (from `FilterSidebar.tsx`)

**Status:** Implemented as `.pf-search-bar`. No equivalent in the library.

**What it is:** A search input with a leading icon, optional `disabled` state (greyed + `cursor: not-allowed`), and a `×` clear button that appears when there is text.

**Library gap:** `data-header.tsx` embeds a search input, but only as part of a large compound component. A standalone `SearchInput` primitive is absent. The base `Input` in `ui/input.tsx` has no icon slot or clear button.

### SearchInput API

```tsx
<SearchInput
  value={string}
  onChange={(value: string) => void}
  placeholder?: string
  disabled?: boolean
  onClear?: () => void
  className?: string
/>
```

### SearchInput rationale

- No domain logic
- The disabled+greyed pattern (used on article pages) is a common UX need
- `DataHeader` could be refactored to use this internally

### SearchInput extraction steps

1. Create `packages/react/src/search-input.tsx`.
2. Move `.pf-search-bar*` CSS to library, renamed to `uc-search-input*`.
3. Export from index.
4. Portfolio replaces `.pf-search-bar` JSX in `FilterSidebar.tsx` and `BlogSidebar.astro` with the import.

---

## Library inventory reference

Existing components checked for overlap (none cover the three gaps above):

| Component | What it does | Overlap with candidates? |
| --- | --- | --- |
| `item-panel.tsx` | List manager — pin/rename/remove items | None — different concept from SlidePanel |
| `toggle-button.tsx` | Split-pill boolean toggle `[Label \| on/off]` | Shape mismatch for ViewToggle |
| `filter-pill.tsx` + `pill-strip.tsx` | Removable filter chips | Could replace sidebar filter buttons in a future refactor |
| `data-header.tsx` | Full compound header — search + toolbar + sort | Too heavy; SearchInput would be its building block |
| `empty-state.tsx` | Empty list placeholder | Portfolio has its own inline version |

---

## Architecture goal: library-first SPA

The long-term aim is for the portfolio SPA to be as thin as possible — focused entirely on application logic, with zero re-implemented primitives. Every generic UI piece should live in `@ui-components-library/react` and be pulled in as a dependency.

This mirrors a deliberate pattern: treat the UI library as a Lego brick factory. The SPA assembles bricks; it does not manufacture them. A new project should be able to reuse the same bricks without reimplementing them.

### Existing library components to pull into the portfolio (next iteration)

These already exist in `@ui-components-library/react` and could replace current portfolio implementations:

| Library component | Replaces in portfolio | Notes |
| --- | --- | --- |
| `filter-pill.tsx` + `pill-strip.tsx` | Sidebar filter buttons (`.pf-filter-btn`) | FilterPill supports `selected`, `count`, and `onRemove`. Would need `--uc-pill-hl` CSS token already mapped in `portfolio.css`. Sidebar clear button maps to `PillStrip.onClearAll`. |
| `empty-state.tsx` | Inline empty grid message in `ContentGrid.tsx` | Currently hardcoded `<div class="pf-grid-empty">`. EmptyState is generic and themeable. |
| `badge.tsx` | Type label spans (`.pf-type-label`) on cards and in the panel | Badge already used elsewhere; could replace the dot+label pattern. |
| `skeleton.tsx` | Could add loading shimmer on initial hydration (currently none) | Not blocking, but good UX when content count grows. |

### What should permanently stay in the portfolio

Components that are specific to the portfolio's domain and content model — not extractable:

- `PortfolioApp.tsx` — SPA root, state machine, URL sync, session persistence
- `FocusPanelContent` (interior of FocusPanel) — type dot, YouTube embed, action links
- `LandingIntro.tsx` — the intro overlay is domain-specific copy and animation
- `ContentGrid.tsx` — Fuse.js integration, two-phase animation, filter composition
- `PinnedSection.tsx` — the "Featured" concept is domain-specific
- All data files (`content.ts`, `schema.ts`, `portfolioState.ts`)

### Desired end state

```text
PortfolioApp
  ├── FilterSidebar
  │     ├── SearchInput          ← from library
  │     ├── FilterPill (×3)      ← from library
  │     └── PillStrip            ← from library
  ├── PinnedSection
  │     ├── ViewToggle           ← from library (after extraction)
  │     └── ContentCard (×n)     ← candidate for library
  ├── ContentGrid
  │     ├── ViewToggle           ← from library (after extraction)
  │     ├── ContentCard (×n)     ← candidate for library
  │     ├── ContentTable (×n)    ← candidate for library
  │     └── EmptyState           ← from library
  └── SlidePanel                 ← from library (after extraction)
        └── FocusPanelContent    ← stays in portfolio (domain-specific)
```
