# Suggestion: Generic `SlidePanel` for `@ui-components-library/react`

## Status

Implemented in `my-github-pages` as `FocusPanel.tsx`.
Ready to be extracted when the pattern stabilises.

---

## What It Is

A reusable position-fixed side/bottom drawer that:

- Slides in from the right on desktop (`translateX`)
- Becomes a bottom sheet on mobile (`translateY`)
- Dims and blurs the background via an overlay
- Supports Escape key to close
- Fully accessible (ARIA role, hidden state, close button)
- Animated with CSS transforms only — no layout reflow

---

## Brief Reasoning

`FocusPanel.tsx` in the portfolio contains no domain-specific logic. It renders:

1. An optional overlay `<div>` (dims background, dismisses on click)
2. A slide-in `<aside>` with a content slot

The same primitive would be useful for any detail panel, settings drawer, or mobile navigation in any SaaS or content site. It does not depend on content shape — it is a pure layout/animation container.

The library already has modal-adjacent components (`DropdownMenu`, `Select`) via Radix, but no slide-in panel primitive exists. This fills a common real-world gap.

---

## Component API (proposed)

```tsx
<SlidePanel
  open={boolean}
  onClose={() => void}
  side?: 'right' | 'left'            // default: 'right'
  width?: string                     // default: 'min(580px, 46vw)'
  mobileMode?: 'bottom-sheet' | 'fullscreen'  // default: 'bottom-sheet'
  overlayBlur?: boolean              // default: true
  overlayDismiss?: boolean           // default: true
  aria-label?: string
>
  {children}
</SlidePanel>

// Companion overlay (optional standalone use)
<SlidePanelOverlay open={boolean} onDismiss={() => void} />
```

No `header/body/footer` slots needed — keep it as a raw container and let consumers structure the interior.

---

## Refactor Steps

These steps assume a separate task is opened to perform the move.

### Step 1 — Strip domain content from FocusPanel.tsx

Remove all portfolio-specific JSX (type label, title, meta row, content paragraphs, action links).
What remains: the outer `<aside className="pf-panel ...">` shell + the overlay `<div>`.

### Step 2 — Create `packages/react/src/ui/slide-panel.tsx`

```
src/ui/slide-panel.tsx
src/ui/slide-panel-overlay.tsx  (optional, can be co-located)
```

Extract from the stripped shell:
- `className` logic: `pf-panel` → `uc-slide-panel`
- `open` prop controls `uc-slide-panel--open` class
- `side` prop controls direction variant class
- `mobileMode` prop switches between bottom-sheet and fullscreen CSS behavior

### Step 3 — Move CSS from `portfolio.css` → `packages/react/src/styles/vars.css` + component-level

Relevant tokens to extract:
```css
--uc-panel-width: min(580px, 46vw);
--uc-panel-bg: var(--uc-color-card);
--uc-panel-shadow: -6px 0 36px rgba(0,0,0,0.1);
--uc-overlay-bg: rgba(0, 0, 0, 0.38);
--uc-overlay-blur: 2px;
```

Rename all `pf-panel*` classes → `uc-slide-panel*`.
Rename all `pf-overlay*` classes → `uc-panel-overlay*`.

### Step 4 — Export from `packages/react/src/index.ts`

```ts
export { SlidePanel, SlidePanelOverlay } from './ui/slide-panel';
```

### Step 5 — Update `llms.txt`

Add `SlidePanel` entry under **Primitives** section with full props table and usage example.

### Step 6 — Update `my-github-pages/FocusPanel.tsx`

Replace the shell div/aside pair with:
```tsx
import { SlidePanel } from '@ui-components-library/react';

export default function FocusPanel({ item, onClose }) {
  return (
    <SlidePanel open={item !== null} onClose={onClose} aria-label={...}>
      {item && <FocusPanelContent item={item} onClose={onClose} />}
    </SlidePanel>
  );
}
```

### Step 7 — Validate

- Run the portfolio in dev mode: panel should look and behave identically
- Check mobile bottom-sheet behavior
- Keyboard (Escape) still works (handled in PortfolioApp, not inside the panel)

---

## What Stays in `my-github-pages`

`FocusPanelContent` (or inline): all portfolio-specific interior markup (type dot, title, meta, content paragraphs, action links). That is the consumer, not the primitive.

---

## Notes

- Do **not** use Radix Dialog as the base — Radix Dialog is a modal (traps focus, disables scroll). A slide panel should not trap focus; the background remains interactive (dimmed but not locked).
- The overlay's `backdrop-filter: blur()` should be opt-in via `overlayBlur` prop since it has a GPU cost.
- Keep mobile behavior as a prop, not hardcoded, so the same component can serve both navigation drawers and detail panels.
