import type { ContentType } from './schema';
import type { ViewMode } from '../components/portfolio/ContentGrid';

export interface PortfolioState {
  filters: ContentType[];
  viewMode: ViewMode;
  pinnedViewMode: ViewMode;
  focusedId: string | null;
  searchQuery: string;
}

const KEY             = 'pf-state';
const VIEW_KEY        = 'pf-view';
const PINNED_VIEW_KEY = 'pf-pinned-view';

const DEFAULT: PortfolioState = {
  filters:        [],
  viewMode:       'grid',
  pinnedViewMode: 'grid',
  focusedId:      null,
  searchQuery:    '',
};

export function loadState(): PortfolioState {
  try {
    const raw      = sessionStorage.getItem(KEY);
    const session  = raw ? JSON.parse(raw) : {};
    const viewMode       = (localStorage.getItem(VIEW_KEY)        as ViewMode | null) ?? DEFAULT.viewMode;
    const pinnedViewMode = (localStorage.getItem(PINNED_VIEW_KEY) as ViewMode | null) ?? DEFAULT.pinnedViewMode;
    return { ...DEFAULT, ...session, viewMode, pinnedViewMode };
  } catch {
    return { ...DEFAULT };
  }
}

export function saveState(state: PortfolioState): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(state));
    localStorage.setItem(VIEW_KEY,        state.viewMode);
    localStorage.setItem(PINNED_VIEW_KEY, state.pinnedViewMode);
  } catch {
    // storage unavailable — silently ignore
  }
}
