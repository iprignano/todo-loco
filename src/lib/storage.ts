import { debounce } from 'es-toolkit';
import type { BoardState } from '../types';

const STATE_STORE_KEY = 'tl_state';
export async function loadState<T = BoardState>(): Promise<T | undefined> {
  return localStorage.getItem(STATE_STORE_KEY)
    ? JSON.parse(localStorage.getItem(STATE_STORE_KEY)!)
    : undefined;
}

export function saveStateDebounced<T = BoardState>(state: T): void {
  debounce((s: T) => {
    void saveState(s);
  }, 150)(state);
}

export async function saveState<T = BoardState>(state: T): Promise<void> {
  localStorage.setItem(STATE_STORE_KEY, JSON.stringify(state));
}
