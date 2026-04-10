export type ContentType = 'project' | 'article' | 'reference';
export type ProjectStatus = 'active' | 'wip' | 'archived';

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  /** Short description shown on card (1–2 sentences) */
  description: string;
  /** Full content — paragraphs separated by double newline */
  content: string;
  tags: string[];
  /** ISO date string YYYY-MM-DD */
  createdAt: string;
  updatedAt?: string;
  /** Blog slug → links to /blog/{slug} (articles only) */
  slug?: string;
  /** Primary URL — GitHub repo, reference link, or YouTube */
  url?: string;
  /** Live site URL — shown as a second button alongside the GitHub url */
  siteUrl?: string;
  /** Pin to the featured section above the main stream */
  pinned?: boolean;
  meta?: {
    status?: ProjectStatus;
    tech?: string[];
  };
}

export function isContentType(value: string): value is ContentType {
  return value === 'project' || value === 'article' || value === 'reference';
}
