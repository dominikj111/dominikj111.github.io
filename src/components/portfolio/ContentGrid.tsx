import { useState, useEffect, useRef, useMemo } from 'react';
import { flushSync } from 'react-dom';
import Fuse from 'fuse.js';
import type { ContentItem, ContentType } from '../../data/schema';
import ContentCard from './ContentCard';
import ContentTable from './ContentTable';

export type ViewMode = 'grid' | 'table';

interface ContentGridProps {
  items: ContentItem[];
  activeFilters: Set<ContentType>;
  viewMode: ViewMode;
  focusedId: string | null;
  onFocus: (id: string) => void;
  onClearFilters: () => void;
  searchQuery: string;
  onClearSearch: () => void;
}

export default function ContentGrid({
  items,
  activeFilters,
  viewMode,
  focusedId,
  onFocus,
  onClearFilters,
  searchQuery,
  onClearSearch,
}: ContentGridProps) {
  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: [
          { name: 'title',       weight: 2 },
          { name: 'description', weight: 1.5 },
          { name: 'tags',        weight: 1 },
          { name: 'content',     weight: 0.5 },
        ],
        threshold: 0.35,
        includeScore: true,
      }),
    [items],
  );

  function applyFilters(src: ContentItem[]): ContentItem[] {
    let result = src;
    const q = searchQuery.trim();
    if (q) {
      result = fuse.search(q).map(r => r.item);
    }
    if (activeFilters.size > 0) {
      result = result.filter(i => activeFilters.has(i.type));
    }
    return result;
  }

  const [visibleItems, setVisibleItems] = useState<ContentItem[]>(() =>
    applyFilters(items),
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number | undefined>(undefined);

  const filterKey = [...activeFilters].sort().join(',');
  const stateKey  = `${filterKey}|${searchQuery}`;

  useEffect(() => {
    const next    = applyFilters(items);
    const nextKey = next.map(i => i.id).join(',');
    const currKey = visibleItems.map(i => i.id).join(',');
    if (nextKey === currKey) return;

    const el = containerRef.current;
    if (!el) { setVisibleItems(next); return; }

    if (rafRef.current !== undefined) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = undefined;
    }

    el.style.transition = 'none';
    el.style.opacity    = '0';

    rafRef.current = requestAnimationFrame(() => {
      flushSync(() => setVisibleItems(next));
      rafRef.current = requestAnimationFrame(() => {
        el.style.transition = 'opacity 0.18s ease';
        el.style.opacity    = '1';
        rafRef.current = undefined;
      });
    });

    return () => {
      if (rafRef.current !== undefined) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = undefined;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateKey]);

  const isEmpty = visibleItems.length === 0;
  const hasQuery = searchQuery.trim().length > 0;

  return (
    <div ref={containerRef} className="pf-content-container">
      {isEmpty ? (
        <div className="pf-grid">
          <div className="pf-grid-empty">
            <p className="pf-grid-empty__title">No results</p>
            <p className="pf-grid-empty__desc">
              {hasQuery
                ? `Nothing matched "${searchQuery.trim()}".`
                : activeFilters.size > 0
                  ? 'No content matches the selected filters.'
                  : 'No content yet.'}
            </p>
            {(hasQuery || activeFilters.size > 0) && (
              <button
                className="pf-grid-empty__btn"
                onClick={() => { onClearFilters(); onClearSearch(); }}
              >
                Clear {hasQuery && activeFilters.size > 0 ? 'search & filters' : hasQuery ? 'search' : 'filters'}
              </button>
            )}
          </div>
        </div>
      ) : viewMode === 'table' ? (
        <ContentTable
          items={visibleItems}
          focusedId={focusedId}
          onFocus={onFocus}
        />
      ) : (
        <div className="pf-grid" role="list">
          {visibleItems.map(item => (
            <ContentCard
              key={item.id}
              item={item}
              focused={item.id === focusedId}
              onClick={() => onFocus(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
