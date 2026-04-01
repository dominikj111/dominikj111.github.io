import { useState, useEffect, useRef } from 'react';
import type { ContentType } from '../../data/schema';
import { CONTENT_ITEMS } from '../../data/content';
import { isContentType } from '../../data/schema';
import { loadState, saveState } from '../../data/portfolioState';
import type { ViewMode } from './ContentGrid';

import LandingIntro from './LandingIntro';
import FilterSidebar from './FilterSidebar';
import ContentGrid from './ContentGrid';
import FocusPanel from './FocusPanel';

// ---------------------------------------------------------------------------
// Synchronous initial state — runs before first paint (no useEffect needed)
// ---------------------------------------------------------------------------

interface InitialState {
  introVisible: boolean;
  filters: Set<ContentType>;
  focusedId: string | null;
  viewMode: ViewMode;
  /** True when state was restored from storage — suppresses panel slide animation */
  restored: boolean;
}

function computeInitialState(): InitialState {
  const defaults: InitialState = {
    introVisible: true,
    filters: new Set(),
    focusedId: null,
    viewMode: 'grid',
    restored: false,
  };

  // During SSR window is not available — client:only means this never runs on
  // server, but guard defensively anyway.
  if (typeof window === 'undefined') return defaults;

  // Explicit URL params (shared link) take highest precedence
  const params = new URLSearchParams(window.location.search);
  const f      = params.get('f');
  const focus  = params.get('focus');
  const view   = params.get('v');

  if (f || focus || view) {
    return {
      introVisible: false,
      filters:      new Set((f ?? '').split(',').filter(isContentType) as ContentType[]),
      focusedId:    focus,
      viewMode:     view === 'table' ? 'table' : 'grid',
      restored:     true,
    };
  }

  // Only restore state when navigating back from an article page.
  // Logo clicks (referrer = /) and fresh visits (no referrer) show the intro.
  const fromArticle =
    document.referrer !== '' &&
    (() => { try { const u = new URL(document.referrer); return u.origin === window.location.origin && u.pathname.startsWith('/blog/'); } catch { return false; } })();

  if (fromArticle) {
    const saved    = loadState();
    const hasState = saved.filters.length > 0 || saved.focusedId || saved.viewMode !== 'grid';
    if (hasState) {
      return {
        introVisible: false,
        filters:      new Set(saved.filters),
        focusedId:    null,
        viewMode:     saved.viewMode,
        restored:     false,
      };
    }
  }

  // No session state — still check localStorage for the persisted view preference
  try {
    const view = localStorage.getItem('pf-view') as ViewMode | null;
    if (view === 'table') defaults.viewMode = 'table';
  } catch {}

  return defaults;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PortfolioApp() {
  // All initial state computed synchronously — no flash, no useEffect needed
  const [init] = useState<InitialState>(computeInitialState);

  const [introVisible, setIntroVisible] = useState(init.introVisible);
  const [introExiting, setIntroExiting] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Set<ContentType>>(init.filters);
  const [focusedId, setFocusedId]         = useState<string | null>(init.focusedId);
  const [viewMode, setViewMode]           = useState<ViewMode>(init.viewMode);

  // After first render, `instant` should be false so subsequent panel opens animate normally
  const instantRef = useRef(init.restored);
  useEffect(() => { instantRef.current = false; }, []);

  // Sync restored state to URL on mount (only when restored, to avoid overwriting clean /)
  useEffect(() => {
    if (!init.restored) return;
    const p = new URLSearchParams();
    const f = [...init.filters];
    if (f.length > 0)              p.set('f', f.join(','));
    if (init.focusedId)            p.set('focus', init.focusedId);
    if (init.viewMode === 'table') p.set('v', 'table');
    const qs = p.toString();
    history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync state → sessionStorage + URL on every change (after intro is dismissed)
  useEffect(() => {
    if (introVisible) return;
    const filters = [...activeFilters] as ContentType[];
    saveState({ filters, viewMode, focusedId });
    const p = new URLSearchParams();
    if (filters.length > 0)    p.set('f', filters.join(','));
    if (focusedId)              p.set('focus', focusedId);
    if (viewMode === 'table')   p.set('v', 'table');
    const qs = p.toString();
    history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname);
  }, [introVisible, activeFilters, focusedId, viewMode]);

  // Escape closes focus panel
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && focusedId) setFocusedId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [focusedId]);

  // --- Handlers -------------------------------------------------------------
  const dismissIntro = () => {
    setIntroExiting(true);
    setTimeout(() => setIntroVisible(false), 460);
  };

  const toggleFilter = (type: ContentType) => {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type); else next.add(type);
      return next;
    });
  };

  const clearFilters = () => setActiveFilters(new Set());

  const focusedItem    = CONTENT_ITEMS.find(i => i.id === focusedId) ?? null;
  const filterSummary  = activeFilters.size > 0
    ? [...activeFilters].map(f => f.charAt(0).toUpperCase() + f.slice(1) + 's').join(' + ')
    : null;

  return (
    <>
      {introVisible && (
        <LandingIntro exiting={introExiting} onDismiss={dismissIntro} />
      )}

      <div className="pf-app">
        <FilterSidebar
          activeFilters={activeFilters}
          onToggle={toggleFilter}
          onClear={clearFilters}
          items={CONTENT_ITEMS}
        />

        <main className="pf-main">
          <div className="pf-toolbar" aria-live="polite">
            <div className="pf-toolbar__label">
              <span className={`pf-toolbar__filter-text${filterSummary ? ' pf-toolbar__filter-text--visible' : ''}`}>
                {filterSummary && (
                  <>
                    <strong>{filterSummary}</strong>
                    <button className="pf-toolbar__clear" onClick={clearFilters}>clear</button>
                  </>
                )}
              </span>
            </div>

            <div className="pf-toolbar__views">
              <button
                className={`pf-view-btn${viewMode === 'grid' ? ' pf-view-btn--active' : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view" title="Grid view"
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                  <rect x="1" y="1" width="5" height="5" rx="1" fill="currentColor"/>
                  <rect x="9" y="1" width="5" height="5" rx="1" fill="currentColor"/>
                  <rect x="1" y="9" width="5" height="5" rx="1" fill="currentColor"/>
                  <rect x="9" y="9" width="5" height="5" rx="1" fill="currentColor"/>
                </svg>
              </button>
              <button
                className={`pf-view-btn${viewMode === 'table' ? ' pf-view-btn--active' : ''}`}
                onClick={() => setViewMode('table')}
                aria-label="Table view" title="Table view"
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                  <rect x="1" y="2"   width="13" height="2" rx="1" fill="currentColor"/>
                  <rect x="1" y="6.5" width="13" height="2" rx="1" fill="currentColor"/>
                  <rect x="1" y="11"  width="13" height="2" rx="1" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>

          <ContentGrid
            items={CONTENT_ITEMS}
            activeFilters={activeFilters}
            viewMode={viewMode}
            focusedId={focusedId}
            onFocus={setFocusedId}
            onClearFilters={clearFilters}
          />
        </main>
      </div>

      <div
        className={`pf-overlay${focusedItem ? ' pf-overlay--active' : ''}`}
        onClick={() => setFocusedId(null)}
        aria-hidden="true"
      />

      <FocusPanel
        item={focusedItem}
        onClose={() => setFocusedId(null)}
        instant={instantRef.current}
      />
    </>
  );
}
