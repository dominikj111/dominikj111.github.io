import { useState, useEffect } from 'react';
import type { ContentType } from '../../data/schema';
import { CONTENT_ITEMS } from '../../data/content';
import { isContentType } from '../../data/schema';
import { loadState, saveState } from '../../data/portfolioState';
import type { ViewMode } from './ContentGrid';

import LandingIntro from './LandingIntro';
import FilterSidebar from './FilterSidebar';
import ContentGrid from './ContentGrid';
import FocusPanel from './FocusPanel';

export default function PortfolioApp() {
  const [introVisible, setIntroVisible] = useState(true);
  const [introExiting, setIntroExiting] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Set<ContentType>>(new Set());
  const [focusedId, setFocusedId]         = useState<string | null>(null);
  const [viewMode, setViewMode]           = useState<ViewMode>('grid');

  // --- Initialise: URL params take precedence, then sessionStorage, else show intro ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const f      = params.get('f');
    const focus  = params.get('focus');
    const view   = params.get('v');

    if (f || focus || view) {
      // Explicit URL state (e.g. shared link) — use it, skip intro
      setIntroVisible(false);
      if (f)    { setActiveFilters(new Set(f.split(',').filter(isContentType) as ContentType[])); }
      if (focus)  setFocusedId(focus);
      if (view === 'table') setViewMode('table');
    } else {
      // Only restore from sessionStorage when navigating back from within the site.
      // A direct/fresh visit to "/" always shows the intro regardless of stored state.
      const fromSameSite =
        document.referrer !== '' &&
        new URL(document.referrer).origin === window.location.origin;

      if (fromSameSite) {
        const saved = loadState();
        const hasState = saved.filters.length > 0 || saved.focusedId || saved.viewMode !== 'grid';
        if (hasState) {
          setIntroVisible(false);
          setActiveFilters(new Set(saved.filters));
          setFocusedId(saved.focusedId);
          setViewMode(saved.viewMode);
          const p = new URLSearchParams();
          if (saved.filters.length > 0)  p.set('f', saved.filters.join(','));
          if (saved.focusedId)            p.set('focus', saved.focusedId);
          if (saved.viewMode === 'table') p.set('v', 'table');
          const qs = p.toString();
          history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname);
        }
      }
    }
  }, []);

  // --- Sync state → sessionStorage + URL on every change -------------------
  useEffect(() => {
    if (introVisible) return;

    const filters = [...activeFilters] as ContentType[];
    saveState({ filters, viewMode, focusedId });

    const p = new URLSearchParams();
    if (filters.length > 0) p.set('f', filters.join(','));
    if (focusedId)           p.set('focus', focusedId);
    if (viewMode === 'table') p.set('v', 'table');
    const qs = p.toString();
    history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname);
  }, [introVisible, activeFilters, focusedId, viewMode]);

  // --- Keyboard: Escape closes focus panel ----------------------------------
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

  const resetToIntro = () => {
    setActiveFilters(new Set());
    setFocusedId(null);
    setViewMode('grid');
    setIntroExiting(false);
    setIntroVisible(true);
    history.replaceState(null, '', window.location.pathname);
  };

  const focusedItem = CONTENT_ITEMS.find(i => i.id === focusedId) ?? null;

  const filterSummary = activeFilters.size > 0
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
          onLogoClick={resetToIntro}
          items={CONTENT_ITEMS}
        />

        <main className="pf-main">
          <div className="pf-toolbar" aria-live="polite">
            <div className="pf-toolbar__label">
              <span className={`pf-toolbar__filter-text${filterSummary ? ' pf-toolbar__filter-text--visible' : ''}`}>
                {filterSummary && (
                  <>
                    <strong>{filterSummary}</strong>
                    <button className="pf-toolbar__clear" onClick={clearFilters}>
                      clear
                    </button>
                  </>
                )}
              </span>
            </div>

            <div className="pf-toolbar__views">
              <button
                className={`pf-view-btn${viewMode === 'grid' ? ' pf-view-btn--active' : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
                title="Grid view"
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
                aria-label="Table view"
                title="Table view"
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                  <rect x="1" y="2"  width="13" height="2" rx="1" fill="currentColor"/>
                  <rect x="1" y="6.5" width="13" height="2" rx="1" fill="currentColor"/>
                  <rect x="1" y="11" width="13" height="2" rx="1" fill="currentColor"/>
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

      <FocusPanel item={focusedItem} onClose={() => setFocusedId(null)} />
    </>
  );
}
