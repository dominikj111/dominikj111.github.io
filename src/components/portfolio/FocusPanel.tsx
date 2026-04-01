import type { ContentItem } from '../../data/schema';

interface FocusPanelProps {
  item: ContentItem | null;
  onClose: () => void;
  /** Skip slide transition — used when restoring state on first render */
  instant?: boolean;
}

const TYPE_LABELS: Record<string, string> = {
  project:   'Project',
  article:   'Article',
  reference: 'Reference',
};

function formatDate(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

function renderContent(content: string) {
  return content.split('\n\n').map((para, i) => (
    <p key={i}>{para}</p>
  ));
}

export default function FocusPanel({ item, onClose, instant = false }: FocusPanelProps) {
  const isOpen = item !== null;

  return (
    <aside
      className={[
        'pf-panel',
        isOpen    ? 'pf-panel--open'    : '',
        instant   ? 'pf-panel--instant' : '',
      ].filter(Boolean).join(' ')}
      aria-label={item ? `Details: ${item.title}` : 'Content details'}
      aria-hidden={!isOpen}
      role="complementary"
    >
      {item && (
        <>
          {/* Header */}
          <div className="pf-panel__header">
            <div className="pf-panel__header-content">
              <div className="pf-panel__type-row">
                <span
                  className={`pf-type-dot pf-type-dot--${item.type}`}
                  aria-hidden="true"
                />
                <span className="pf-type-label">{TYPE_LABELS[item.type]}</span>
              </div>
              <h2 className="pf-panel__title">{item.title}</h2>
            </div>
            <button
              className="pf-panel__close"
              onClick={onClose}
              aria-label="Close panel"
            >
              ✕
            </button>
          </div>

          {/* Meta row */}
          <div className="pf-panel__meta">
            <time className="pf-panel__date" dateTime={item.createdAt}>
              {formatDate(item.createdAt)}
            </time>
            {item.meta?.status && (
              <span className={`pf-panel__status pf-panel__status--${item.meta.status}`}>
                {item.meta.status}
              </span>
            )}
            {item.tags.length > 0 && (
              <div className="pf-panel__tags">
                {item.tags.map(tag => (
                  <span key={tag} className="pf-tag">{tag}</span>
                ))}
              </div>
            )}
          </div>

          {/* Body */}
          <div className="pf-panel__body">
            <div className="pf-panel__content">
              {renderContent(item.content)}
            </div>

            {/* Actions */}
            {(item.url || item.slug) && (
              <div className="pf-panel__actions">
                {item.slug && (
                  <a
                    href={`/blog/${item.slug}`}
                    className="pf-panel__link pf-panel__link--primary"
                  >
                    Read article →
                  </a>
                )}
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`pf-panel__link ${item.slug ? 'pf-panel__link--outline' : 'pf-panel__link--primary'}`}
                  >
                    {item.type === 'reference' ? 'Visit →' : 'View project →'}
                  </a>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </aside>
  );
}
