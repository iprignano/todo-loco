import { openDB, type IDBPDatabase } from 'idb';
import { debounce } from 'es-toolkit';
import type { BoardState } from '../types';

const DB_NAME = 'todo-loco-db';
const DB_VERSION = 1;
const STATE_STORE = 'state';
const ROOT_KEY = 'root';

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(database) {
        if (!database.objectStoreNames.contains(STATE_STORE)) {
          database.createObjectStore(STATE_STORE);
        }
      },
    });
  }
  return dbPromise;
}

export async function loadState<T = BoardState>(): Promise<T | undefined> {
  const db = await getDb();
  return (await db.get(STATE_STORE, ROOT_KEY)) as T | undefined;
}

export function saveStateDebounced<T = BoardState>(state: T): void {
  debounce((s: T) => {
    void saveState(s);
  }, 150)(state);
}

export async function saveState<T = BoardState>(state: T): Promise<void> {
  const db = await getDb();
  await db.put(STATE_STORE, state, ROOT_KEY);
}
