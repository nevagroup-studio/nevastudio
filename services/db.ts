import type { HistoryItem, LibraryItem } from '../types';

const DB_NAME = 'AIComplexDB';
const HISTORY_STORE_NAME = 'history';
const LIBRARY_STORE_NAME = 'library';
const DB_VERSION = 2;
const HISTORY_FALLBACK_KEY = 'neva-history-fallback';
const LIBRARY_FALLBACK_KEY = 'neva-library-fallback';

type StoreName = typeof HISTORY_STORE_NAME | typeof LIBRARY_STORE_NAME;
type StoreItem = HistoryItem | LibraryItem;

let db: IDBDatabase | null = null;
let useLocalFallback = false;

const isBrowser = typeof window !== 'undefined';

const sortByNewest = <T extends { id: string }>(items: T[]) => items.sort((a, b) => Number(b.id) - Number(a.id));

const fallbackKeyForStore = (storeName: StoreName) =>
  storeName === HISTORY_STORE_NAME ? HISTORY_FALLBACK_KEY : LIBRARY_FALLBACK_KEY;

const readFallbackStore = <T extends StoreItem>(storeName: StoreName): T[] => {
  if (!isBrowser) return [];

  try {
    const raw = window.localStorage.getItem(fallbackKeyForStore(storeName));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? sortByNewest(parsed as T[]) : [];
  } catch {
    return [];
  }
};

const writeFallbackStore = <T extends StoreItem>(storeName: StoreName, items: T[]) => {
  if (!isBrowser) return;
  window.localStorage.setItem(fallbackKeyForStore(storeName), JSON.stringify(sortByNewest([...items])));
};

const useFallback = (error?: unknown) => {
  useLocalFallback = true;
  if (error) {
    console.warn('IndexedDB unavailable, falling back to localStorage.', error);
  }
};

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (!isBrowser || typeof indexedDB === 'undefined') {
      useFallback();
      reject(new Error('IndexedDB unavailable'));
      return;
    }

    if (useLocalFallback) {
      reject(new Error('Using localStorage fallback'));
      return;
    }

    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      useFallback(request.error);
      reject(request.error ?? new Error('Database error'));
    };

    request.onsuccess = () => {
      db = request.result;
      db.onclose = () => {
        db = null;
      };
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const dbInstance = (event.target as IDBOpenDBRequest).result;
      if (!dbInstance.objectStoreNames.contains(HISTORY_STORE_NAME)) {
        dbInstance.createObjectStore(HISTORY_STORE_NAME, { keyPath: 'id' });
      }
      if (!dbInstance.objectStoreNames.contains(LIBRARY_STORE_NAME)) {
        dbInstance.createObjectStore(LIBRARY_STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

const withFallback = async <T>(
  storeName: StoreName,
  action: (database: IDBDatabase) => Promise<T>,
  fallbackAction: () => T | Promise<T>,
): Promise<T> => {
  if (useLocalFallback) {
    return fallbackAction();
  }

  try {
    const database = await openDB();
    return await action(database);
  } catch (error) {
    useFallback(error);
    return fallbackAction();
  }
};

export const addHistoryItemToDB = async (item: HistoryItem): Promise<void> => {
  return withFallback(
    HISTORY_STORE_NAME,
    async (database) =>
      new Promise((resolve, reject) => {
        const transaction = database.transaction([HISTORY_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(HISTORY_STORE_NAME);
        const request = store.put(item);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }),
    () => {
      const items = readFallbackStore<HistoryItem>(HISTORY_STORE_NAME).filter((entry) => entry.id !== item.id);
      items.unshift(item);
      writeFallbackStore(HISTORY_STORE_NAME, items);
    },
  );
};

export const getAllHistoryItemsFromDB = async (): Promise<HistoryItem[]> => {
  return withFallback(
    HISTORY_STORE_NAME,
    async (database) =>
      new Promise((resolve, reject) => {
        const transaction = database.transaction([HISTORY_STORE_NAME], 'readonly');
        const store = transaction.objectStore(HISTORY_STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => resolve(sortByNewest(request.result as HistoryItem[]));
        request.onerror = () => reject(request.error);
      }),
    () => readFallbackStore<HistoryItem>(HISTORY_STORE_NAME),
  );
};

export const clearHistoryFromDB = async (): Promise<void> => {
  return withFallback(
    HISTORY_STORE_NAME,
    async (database) =>
      new Promise((resolve, reject) => {
        const transaction = database.transaction([HISTORY_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(HISTORY_STORE_NAME);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }),
    () => {
      writeFallbackStore<HistoryItem>(HISTORY_STORE_NAME, []);
    },
  );
};

export const trimHistoryInDB = async (maxItems: number): Promise<void> => {
  return withFallback(
    HISTORY_STORE_NAME,
    async (database) => {
      const items = await new Promise<HistoryItem[]>((resolve, reject) => {
        const transaction = database.transaction([HISTORY_STORE_NAME], 'readonly');
        const store = transaction.objectStore(HISTORY_STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => resolve(sortByNewest(request.result as HistoryItem[]));
        request.onerror = () => reject(request.error);
      });

      if (items.length <= maxItems) return;

      await new Promise<void>((resolve, reject) => {
        const transaction = database.transaction([HISTORY_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(HISTORY_STORE_NAME);
        const overflowItems = items.slice(maxItems);

        overflowItems.forEach((entry) => store.delete(entry.id));

        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      });
    },
    () => {
      const items = readFallbackStore<HistoryItem>(HISTORY_STORE_NAME).slice(0, maxItems);
      writeFallbackStore(HISTORY_STORE_NAME, items);
    },
  );
};

export const addLibraryItemToDB = async (item: LibraryItem): Promise<void> => {
  return withFallback(
    LIBRARY_STORE_NAME,
    async (database) =>
      new Promise((resolve, reject) => {
        const transaction = database.transaction([LIBRARY_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(LIBRARY_STORE_NAME);
        const request = store.put(item);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }),
    () => {
      const items = readFallbackStore<LibraryItem>(LIBRARY_STORE_NAME).filter((entry) => entry.id !== item.id);
      items.unshift(item);
      writeFallbackStore(LIBRARY_STORE_NAME, items);
    },
  );
};

export const getAllLibraryItemsFromDB = async (): Promise<LibraryItem[]> => {
  return withFallback(
    LIBRARY_STORE_NAME,
    async (database) =>
      new Promise((resolve, reject) => {
        const transaction = database.transaction([LIBRARY_STORE_NAME], 'readonly');
        const store = transaction.objectStore(LIBRARY_STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => resolve(sortByNewest(request.result as LibraryItem[]));
        request.onerror = () => reject(request.error);
      }),
    () => readFallbackStore<LibraryItem>(LIBRARY_STORE_NAME),
  );
};

export const deleteLibraryItemFromDB = async (id: string): Promise<void> => {
  return withFallback(
    LIBRARY_STORE_NAME,
    async (database) =>
      new Promise((resolve, reject) => {
        const transaction = database.transaction([LIBRARY_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(LIBRARY_STORE_NAME);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }),
    () => {
      const items = readFallbackStore<LibraryItem>(LIBRARY_STORE_NAME).filter((entry) => entry.id !== id);
      writeFallbackStore(LIBRARY_STORE_NAME, items);
    },
  );
};

export const deleteMultipleLibraryItemsFromDB = async (ids: string[]): Promise<void> => {
  return withFallback(
    LIBRARY_STORE_NAME,
    async (database) =>
      new Promise((resolve, reject) => {
        const transaction = database.transaction([LIBRARY_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(LIBRARY_STORE_NAME);

        ids.forEach((id) => store.delete(id));

        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      }),
    () => {
      const items = readFallbackStore<LibraryItem>(LIBRARY_STORE_NAME).filter((entry) => !ids.includes(entry.id));
      writeFallbackStore(LIBRARY_STORE_NAME, items);
    },
  );
};

export const clearLibraryFromDB = async (): Promise<void> => {
  return withFallback(
    LIBRARY_STORE_NAME,
    async (database) =>
      new Promise((resolve, reject) => {
        const transaction = database.transaction([LIBRARY_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(LIBRARY_STORE_NAME);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }),
    () => {
      writeFallbackStore<LibraryItem>(LIBRARY_STORE_NAME, []);
    },
  );
};
