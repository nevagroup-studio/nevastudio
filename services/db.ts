import type { HistoryItem, LibraryItem } from '../types';

const DB_NAME = 'AIComplexDB';
const HISTORY_STORE_NAME = 'history';
const LIBRARY_STORE_NAME = 'library';
const DB_VERSION = 2;

let db: IDBDatabase;

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Database error:', request.error);
      reject('Database error');
    };

    request.onsuccess = () => {
      db = request.result;
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

export const addHistoryItemToDB = async (item: HistoryItem): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([HISTORY_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(HISTORY_STORE_NAME);
    const request = store.put(item);

    request.onsuccess = () => resolve();
    request.onerror = () => {
        console.error('Error adding item to DB:', request.error);
        reject(request.error);
    };
  });
};

export const getAllHistoryItemsFromDB = async (): Promise<HistoryItem[]> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([HISTORY_STORE_NAME], 'readonly');
    const store = transaction.objectStore(HISTORY_STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      // IndexedDB getAll doesn't guarantee order, so we sort by ID (timestamp) descending
      const sortedHistory = request.result.sort((a, b) => Number(b.id) - Number(a.id));
      resolve(sortedHistory);
    };
    request.onerror = () => {
        console.error('Error getting all items from DB:', request.error);
        reject(request.error);
    };
  });
};

export const clearHistoryFromDB = async (): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([HISTORY_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(HISTORY_STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => {
        console.error('Error clearing DB:', request.error);
        reject(request.error)
    };
  });
};

export const trimHistoryInDB = async (maxItems: number): Promise<void> => {
    const db = await openDB();
    const transaction = db.transaction([HISTORY_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(HISTORY_STORE_NAME);
    const countRequest = store.count();

    countRequest.onsuccess = () => {
        const count = countRequest.result;
        if (count > maxItems) {
            const cursorRequest = store.openCursor(null, 'next'); // oldest items first
            let itemsToDelete = count - maxItems;
            cursorRequest.onsuccess = (event) => {
                const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
                if (cursor && itemsToDelete > 0) {
                    cursor.delete();
                    itemsToDelete--;
                    cursor.continue();
                }
            };
        }
    };
};

// --- Library Functions ---

export const addLibraryItemToDB = async (item: LibraryItem): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([LIBRARY_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(LIBRARY_STORE_NAME);
    const request = store.put(item);

    request.onsuccess = () => resolve();
    request.onerror = () => {
        console.error('Error adding item to Library DB:', request.error);
        reject(request.error);
    };
  });
};

export const getAllLibraryItemsFromDB = async (): Promise<LibraryItem[]> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([LIBRARY_STORE_NAME], 'readonly');
    const store = transaction.objectStore(LIBRARY_STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const sortedLibrary = request.result.sort((a, b) => Number(b.id) - Number(a.id));
      resolve(sortedLibrary);
    };
    request.onerror = () => {
        console.error('Error getting all items from Library DB:', request.error);
        reject(request.error);
    };
  });
};

export const deleteLibraryItemFromDB = async (id: string): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([LIBRARY_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(LIBRARY_STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => {
        console.error('Error deleting item from Library DB:', request.error);
        reject(request.error)
    };
  });
};

export const deleteMultipleLibraryItemsFromDB = async (ids: string[]): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([LIBRARY_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(LIBRARY_STORE_NAME);
    
    ids.forEach(id => {
      store.delete(id);
    });

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => {
        console.error('Error deleting multiple items from Library DB:', transaction.error);
        reject(transaction.error);
    };
  });
};

export const clearLibraryFromDB = async (): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([LIBRARY_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(LIBRARY_STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => {
        console.error('Error clearing Library DB:', request.error);
        reject(request.error)
    };
  });
};
