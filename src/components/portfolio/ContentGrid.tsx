import { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
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
}

function filterItems(items: ContentItem[], filters: Set<ContentType>): ContentItem[] {
  if (filters.size === 0) return items;
  return items.filter(i => filters.has(i.type));
}

export default function ContentGrid({
  items,
  activeFilters,
  viewMode,
  focusedId,
  onFocus,
  onClearFilters,
}: ContentGridProps) {
  const [visibleItems, setVisibleItems] = useState<ContentItem[]>(() =>
    filterItems(items, activeFilters),
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number | undefined>(undefined);

  // Re-run when filters OR view mode changes
  const filterKey = [...activeFilters].sort().join(',');
  const stateKey  = `${filterKey}|${viewMode}`;

  useEffect(() => {
    const next    = filterItems(items, activeFilters);
    const nextKey = next.map(i => i.id).join(',');
    const currKey = visibleItems.map(i => i.id).join(',');
    // Skip purely-visual viewMode changes (items unchanged) — no fade needed
    if (nextKey === currKey && filterKey === stateKey.split('|')[0]) return;

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
  }, [filterKey]);

  const isEmpty = visibleItems.length === 0;

  return (
    <div ref={containerRef} className="pf-content-container">
      {isEmpty ? (
        <div className="pf-grid">
          <div className="pf-grid-empty">
            <p className="pf-grid-empty__title">No results</p>
            <p className="pf-grid-empty__desc">
              {activeFilters.size > 0
                ? 'No content matches the selected filters.'
                : 'No content yet.'}
            </p>
            {activeFilters.size > 0 && (
              <button className="pf-grid-empty__btn" onClick={onClearFilters}>
                Clear filters
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
