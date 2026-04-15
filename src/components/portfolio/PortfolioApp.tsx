import { useState, useEffect, useRef, useCallback } from 'react';
import type { ContentType } from '../../data/schema';
import { CONTENT_ITEMS } from '../../data/content';
import { isContentType } from '../../data/schema';
import { loadState, saveState } from '../../data/portfolioState';
import type { ViewMode } from './ContentGrid';

import LandingIntro from './LandingIntro';
import FilterSidebar from './FilterSidebar';
import ContentGrid from './ContentGrid';
import FocusPanel from './FocusPanel';
import PinnedSection from './PinnedSection';

// ---------------------------------------------------------------------------
// Synchronous initial state — runs before first paint (no useEffect needed)
// ---------------------------------------------------------------------------

interface InitialState {
  introVisible: boolean;
  filters: Set<ContentType>;
  focusedId: string | null;
  viewMode: ViewMode;
  pinnedViewMode: ViewMode;
  searchQuery: string;
  /** True when state was restored from storage — suppresses panel slide animation */
  restored: boolean;
}

function computeInitialState(): InitialState {
  const defaults: InitialState = {
    introVisible:   true,
    filters:        new Set(),
    focusedId:      null,
    viewMode:       'table',
    pinnedViewMode: 'grid',
    searchQuery:    '',
    restored:       false,
  };

  // During SSR window is not available — client:only means this never runs on
  // server, but guard defensively anyway.
  if (typeof window === 'undefined') return defaults;

  // Detect navigation back from an article/about page early — needed to
  // suppress focus restoration even when URL params are present (browser
  // back button restores the previous URL including ?focus=id).
  const fromArticle =
    document.referrer !== '' &&
    (() => { try { const u = new URL(document.referrer); return u.origin === window.location.origin && (u.pathname.startsWith('/blog/') || u.pathname.startsWith('/about')); } catch { return false; } })();

  // Explicit URL params (shared link) take highest precedence,
  // EXCEPT the focus param is suppressed when returning from an article so
  // the browser back button doesn't reopen a panel the user navigated away from.
  const params = new URLSearchParams(window.location.search);
  const f      = params.get('f');
  const focus  = params.get('focus');
  const view   = params.get('v');
  const q      = params.get('q') ?? '';

  if (f || focus || view || q) {
    const saved = loadState();
    return {
      introVisible:   false,
      filters:        new Set((f ?? '').split(',').filter(isContentType) as ContentType[]),
      focusedId:      fromArticle ? null : focus,
      viewMode:       view === 'grid' ? 'grid' : 'table',
      pinnedViewMode: saved.pinnedViewMode,
      searchQuery:    q,
      restored:       true,
    };
  }

  // Only restore state when navigating back from an article page.
  // Logo clicks (referrer = /) and fresh visits (no referrer) show the intro.

  if (fromArticle) {
    const saved    = loadState();
    const hasState = saved.filters.length > 0 || saved.focusedId || saved.viewMode !== 'table' || saved.searchQuery;
    if (hasState) {
      return {
        introVisible:   false,
        filters:        new Set(saved.filters),
        focusedId:      null,
        viewMode:       saved.viewMode,
        pinnedViewMode: saved.pinnedViewMode,
        searchQuery:    saved.searchQuery ?? '',
        restored:       false,
      };
    }
  }

  // No session state — read localStorage only for pinned view preference.
  // Main viewMode is intentionally not persisted across sessions so the
  // table default is always applied on fresh visits.
  try {
    const pinnedView = localStorage.getItem('pf-pinned-view') as ViewMode | null;
    if (pinnedView === 'table' || pinnedView === 'grid') defaults.pinnedViewMode = pinnedView;
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
  const [viewMode, setViewMode]               = useState<ViewMode>(init.viewMode);
  const [pinnedViewMode, setPinnedViewMode]   = useState<ViewMode>(init.pinnedViewMode);
  const [searchQuery, setSearchQuery]         = useState<string>(init.searchQuery);
  // Raw input value — debounced into searchQuery
  const [searchInput, setSearchInput] = useState<string>(init.searchQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

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
    if (init.searchQuery)          p.set('q', init.searchQuery);
    const qs = p.toString();
    history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync state → sessionStorage + URL on every change (after intro is dismissed)
  useEffect(() => {
    if (introVisible) return;
    const filters = [...activeFilters] as ContentType[];
    saveState({ filters, viewMode, pinnedViewMode, focusedId, searchQuery });
    const p = new URLSearchParams();
    if (filters.length > 0)    p.set('f', filters.join(','));
    if (focusedId)              p.set('focus', focusedId);
    if (viewMode === 'table')   p.set('v', 'table');
    if (searchQuery)            p.set('q', searchQuery);
    const qs = p.toString();
    history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname);
  }, [introVisible, activeFilters, focusedId, viewMode, pinnedViewMode, searchQuery]);

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

  const handleSearchInput = useCallback((value: string) => {
    setSearchInput(value);
    if (debounceRef.current !== undefined) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchQuery(value);
      debounceRef.current = undefined;
    }, 280);
  }, []);

  const clearSearch = useCallback(() => {
    if (debounceRef.current !== undefined) { clearTimeout(debounceRef.current); debounceRef.current = undefined; }
    setSearchInput('');
    setSearchQuery('');
  }, []);

  const pinnedItems    = CONTENT_ITEMS.filter(i => i.pinned);
  const streamItems    = CONTENT_ITEMS.filter(i => !i.pinned);
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
          searchInput={searchInput}
          onSearchInput={handleSearchInput}
          onClearSearch={clearSearch}
        />

        <main className="pf-main">
          <PinnedSection
            items={pinnedItems}
            viewMode={pinnedViewMode}
            onViewModeChange={setPinnedViewMode}
            focusedId={focusedId}
            onFocus={setFocusedId}
          />

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
            items={streamItems}
            activeFilters={activeFilters}
            viewMode={viewMode}
            focusedId={focusedId}
            onFocus={setFocusedId}
            onClearFilters={clearFilters}
            searchQuery={searchQuery}
            onClearSearch={clearSearch}
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
