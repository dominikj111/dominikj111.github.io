import type { ContentType } from './schema';
import type { ViewMode } from '../components/portfolio/ContentGrid';

export interface PortfolioState {
  filters: ContentType[];
  viewMode: ViewMode;
  focusedId: string | null;
}

const KEY = 'pf-state';

const DEFAULT: PortfolioState = {
  filters:   [],
  viewMode:  'grid',
  focusedId: null,
};

export function loadState(): PortfolioState {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT };
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT };
  }
}

export function saveState(state: PortfolioState): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // sessionStorage unavailable — silently ignore
  }
}
