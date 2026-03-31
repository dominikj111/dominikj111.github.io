import type { ContentItem } from '../../data/schema';

interface ContentTableProps {
  items: ContentItem[];
  focusedId: string | null;
  onFocus: (id: string) => void;
}

const TYPE_LABELS: Record<string, string> = {
  project:   'Project',
  article:   'Article',
  reference: 'Reference',
};

function formatDate(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

const MAX_TAGS = 4;

export default function ContentTable({ items, focusedId, onFocus }: ContentTableProps) {
  if (items.length === 0) return null;

  return (
    <table className="pf-table" role="grid">
      <thead>
        <tr>
          <th className="pf-table__th pf-table__th--type">Type</th>
          <th className="pf-table__th pf-table__th--title">Title</th>
          <th className="pf-table__th pf-table__th--tags">Tags</th>
          <th className="pf-table__th pf-table__th--date">Date</th>
        </tr>
      </thead>
      <tbody>
        {items.map(item => {
          const visibleTags = item.tags.slice(0, MAX_TAGS);
          const extra       = item.tags.length - MAX_TAGS;
          const focused     = item.id === focusedId;

          return (
            <tr
              key={item.id}
              className={`pf-table__row${focused ? ' pf-table__row--focused' : ''}`}
              onClick={() => onFocus(item.id)}
              tabIndex={0}
              role="row"
              aria-pressed={focused}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onFocus(item.id); }}
            >
              <td className="pf-table__td pf-table__td--type">
                <span className={`pf-type-dot pf-type-dot--${item.type}`} aria-hidden="true" />
                <span className="pf-type-label">{TYPE_LABELS[item.type]}</span>
              </td>
              <td className="pf-table__td pf-table__td--title">
                <span className="pf-table__title">{item.title}</span>
                {item.description && (
                  <span className="pf-table__desc">{item.description}</span>
                )}
              </td>
              <td className="pf-table__td pf-table__td--tags">
                <div className="pf-card__tags">
                  {visibleTags.map(tag => (
                    <span key={tag} className="pf-tag">{tag}</span>
                  ))}
                  {extra > 0 && <span className="pf-tag">+{extra}</span>}
                </div>
              </td>
              <td className="pf-table__td pf-table__td--date">
                <time dateTime={item.createdAt}>{formatDate(item.createdAt)}</time>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
