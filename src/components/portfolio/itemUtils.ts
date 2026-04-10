/**
 * Shared utilities for portfolio item rendering.
 * Centralises logic that was previously duplicated across
 * ContentCard, ContentTable, and FocusPanel.
 */

import type { ContentType } from '../../data/schema';

// ── Labels ──────────────────────────────────────────────────────────────────

export const TYPE_LABELS: Record<ContentType, string> = {
  project:   'Project',
  article:   'Article',
  reference: 'Reference',
};

// ── Filters ──────────────────────────────────────────────────────────────────

export const FILTER_OPTIONS: { type: ContentType; label: string }[] = [
  { type: 'project',   label: 'Projects' },
  { type: 'article',   label: 'Articles' },
  { type: 'reference', label: 'References' },
];

// ── Date formatting ──────────────────────────────────────────────────────────

/** Short format: "Apr 2024" — used on cards */
export function formatDateShort(iso: string): string {
  if (!iso) return '';
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short', year: 'numeric',
  });
}

/** Long format: "April 2024" — used in the focus panel */
export function formatDateLong(iso: string): string {
  if (!iso) return '';
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'long', year: 'numeric',
  });
}

/** Medium format: "Apr 2024" — used in the table */
export function formatDateMedium(iso: string): string {
  if (!iso) return '';
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short', year: 'numeric',
  });
}

// ── YouTube ──────────────────────────────────────────────────────────────────

/** Extracts the video ID from any standard YouTube URL, or returns null. */
export function getYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === 'youtu.be') return u.pathname.slice(1).split('?')[0];
    if (u.hostname.includes('youtube.com')) return u.searchParams.get('v');
  } catch {}
  return null;
}
