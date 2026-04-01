import type { ContentItem } from '../../data/schema';
import type { ViewMode } from './ContentGrid';
import ContentCard from './ContentCard';
import ContentTable from './ContentTable';

interface PinnedSectionProps {
  items: ContentItem[];
  viewMode: ViewMode;
  onViewModeChange: (m: ViewMode) => void;
  focusedId: string | null;
  onFocus: (id: string) => void;
}

export default function PinnedSection({
  items,
  viewMode,
  onViewModeChange,
  focusedId,
  onFocus,
}: PinnedSectionProps) {
  if (items.length === 0) return null;

  return (
    <section className="pf-pinned" aria-label="Featured">
      <div className="pf-pinned__header">
        <span className="pf-pinned__label">Featured</span>
        <div className="pf-toolbar__views">
          <button
            className={`pf-view-btn${viewMode === 'grid' ? ' pf-view-btn--active' : ''}`}
            onClick={() => onViewModeChange('grid')}
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
            onClick={() => onViewModeChange('table')}
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

      {viewMode === 'table' ? (
        <ContentTable items={items} focusedId={focusedId} onFocus={onFocus} />
      ) : (
        <div className="pf-pinned__grid">
          {items.map(item => (
            <ContentCard
              key={item.id}
              item={item}
              focused={item.id === focusedId}
              onClick={() => onFocus(item.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
