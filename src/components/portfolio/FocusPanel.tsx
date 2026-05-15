import { useRef } from 'react';
import type { ContentItem } from '../../data/schema';
import { TYPE_LABELS, formatDateLong, getYouTubeId } from './itemUtils';

interface FocusPanelProps {
  item: ContentItem | null;
  onClose: () => void;
  /** Skip slide transition — used when restoring state on first render */
  instant?: boolean;
}

function renderContent(content: string) {
  return content.split('\n\n').map((para, i) => (
    <p key={i}>{para}</p>
  ));
}

export default function FocusPanel({ item, onClose, instant = false }: FocusPanelProps) {
  const isOpen   = item !== null;
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const pauseYouTube = () => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }),
      '*',
    );
  };

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
            {item.createdAt && (
              <time className="pf-panel__date" dateTime={item.createdAt}>
                {formatDateLong(item.createdAt)}
              </time>
            )}
            {item.meta?.status && (
              <span className={`pf-panel__status pf-panel__status--${item.meta.status}`}>
                {item.meta.status}
              </span>
            )}
            {item.tags.length > 0 && (
              <div className="pf-panel__tags">
                {item.tags.map(tag => (
                  <span key={tag} className={`pf-tag${tag === 'draft' ? ' pf-tag--draft' : ''}`}>{tag}</span>
                ))}
              </div>
            )}
          </div>

          {/* YouTube embed */}
          {item.url && (() => {
            const ytId = getYouTubeId(item.url);
            return ytId ? (
              <div className="pf-panel__yt-embed">
                <iframe
                  ref={iframeRef}
                  src={`https://www.youtube.com/embed/${ytId}?enablejsapi=1`}
                  title={item.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            ) : null;
          })()}

          {/* Body */}
          <div className="pf-panel__body">
            <div className="pf-panel__content">
              {renderContent(item.content)}
            </div>

            {/* Actions */}
            {(item.url || item.slug || item.siteUrl) && (
              <div className="pf-panel__actions">
                {item.slug && (
                  <a
                    href={`/blog/${item.slug}`}
                    className="pf-panel__link pf-panel__link--primary"
                  >
                    Read article →
                  </a>
                )}
                {item.url && (() => {
                  const isYT = !!getYouTubeId(item.url!);
                  const hasSiteUrl = !!item.siteUrl;
                  return (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`pf-panel__link ${item.slug || hasSiteUrl ? 'pf-panel__link--outline' : 'pf-panel__link--primary'}`}
                      onClick={isYT ? pauseYouTube : undefined}
                    >
                      {isYT ? 'Watch on YouTube →' : item.type === 'reference' ? 'Visit →' : 'View on GitHub →'}
                    </a>
                  );
                })()}
                {item.siteUrl && (
                  <a
                    href={item.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pf-panel__link pf-panel__link--primary"
                  >
                    Visit live site →
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
