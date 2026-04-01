import type { ContentType } from './schema';
import type { ViewMode } from '../components/portfolio/ContentGrid';

export interface PortfolioState {
  filters: ContentType[];
  viewMode: ViewMode;
  focusedId: string | null;
}

const KEY      = 'pf-state';
const VIEW_KEY = 'pf-view';

const DEFAULT: PortfolioState = {
  filters:   [],
  viewMode:  'grid',
  focusedId: null,
};

export function loadState(): PortfolioState {
  try {
    const raw      = sessionStorage.getItem(KEY);
    const session  = raw ? JSON.parse(raw) : {};
    const viewMode = (localStorage.getItem(VIEW_KEY) as ViewMode | null) ?? DEFAULT.viewMode;
    return { ...DEFAULT, ...session, viewMode };
  } catch {
    return { ...DEFAULT };
  }
}

export function saveState(state: PortfolioState): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(state));
    localStorage.setItem(VIEW_KEY, state.viewMode);
  } catch {
    // storage unavailable — silently ignore
  }
}
