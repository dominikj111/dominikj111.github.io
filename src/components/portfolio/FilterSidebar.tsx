import type { ContentItem, ContentType } from '../../data/schema';

interface FilterSidebarProps {
  activeFilters: Set<ContentType>;
  onToggle: (type: ContentType) => void;
  onClear: () => void;
  onLogoClick: () => void;
  items: ContentItem[];
}

const FILTERS: { type: ContentType; label: string }[] = [
  { type: 'project',   label: 'Projects' },
  { type: 'article',   label: 'Articles' },
  { type: 'reference', label: 'References' },
];

export default function FilterSidebar({ activeFilters, onToggle, onClear, onLogoClick, items }: FilterSidebarProps) {
  const countByType = (type: ContentType) => items.filter(i => i.type === type).length;

  return (
    <nav className="pf-sidebar" aria-label="Content filters">
      <div className="pf-sidebar__logo-wrap">
        <a
          href="/"
          className="pf-sidebar__logo"
          onClick={e => { e.preventDefault(); onLogoClick(); }}
        >dominikj111</a>
        <p className="pf-sidebar__tagline">Software Engineer</p>
      </div>

      <div>
        <p className="pf-sidebar__section-label">Filter</p>
        <div className="pf-sidebar__filters" role="group" aria-label="Content type filter">
          {FILTERS.map(({ type, label }) => {
            const active = activeFilters.has(type);
            return (
              <button
                key={type}
                className={[
                  'pf-filter-btn',
                  `pf-filter-btn--${type}`,
                  active ? 'pf-filter-btn--active' : '',
                ].filter(Boolean).join(' ')}
                onClick={() => onToggle(type)}
                aria-pressed={active}
              >
                <span className="pf-filter-btn__dot" aria-hidden="true" />
                <span className="pf-filter-btn__label">{label}</span>
                <span className="pf-filter-btn__count">{countByType(type)}</span>
              </button>
            );
          })}
        </div>
        {activeFilters.size > 0 && (
          <button className="pf-sidebar__clear-btn" onClick={onClear}>
            Clear filters
          </button>
        )}
      </div>
    </nav>
  );
}
