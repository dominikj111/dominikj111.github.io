import type { ContentItem } from '../../data/schema';

interface ContentCardProps {
  item: ContentItem;
  focused: boolean;
  onClick: () => void;
}

const TYPE_LABELS: Record<string, string> = {
  project:   'Project',
  article:   'Article',
  reference: 'Reference',
};

function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

const MAX_TAGS = 3;

export default function ContentCard({ item, focused, onClick }: ContentCardProps) {
  const visibleTags = item.tags.slice(0, MAX_TAGS);
  const extraCount  = item.tags.length - MAX_TAGS;

  return (
    <button
      className={`pf-card${focused ? ' pf-card--focused' : ''}`}
      onClick={onClick}
      aria-pressed={focused}
    >
      <div className="pf-card__type">
        <span className={`pf-type-dot pf-type-dot--${item.type}`} aria-hidden="true" />
        <span className="pf-type-label">{TYPE_LABELS[item.type]}</span>
      </div>

      <h3 className="pf-card__title">{item.title}</h3>

      <p className="pf-card__desc">{item.description}</p>

      <div className="pf-card__footer">
        <div className="pf-card__tags">
          {visibleTags.map(tag => (
            <span key={tag} className="pf-tag">{tag}</span>
          ))}
          {extraCount > 0 && (
            <span className="pf-tag">+{extraCount}</span>
          )}
        </div>
        <time className="pf-card__date" dateTime={item.createdAt}>
          {formatDate(item.createdAt)}
        </time>
      </div>
    </button>
  );
}
