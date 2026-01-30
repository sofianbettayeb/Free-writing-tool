import { JournalEntry, InsertJournalEntry } from '@shared/schema';

const DB_NAME = 'freewriting-offline';
const DB_VERSION = 1;
const ENTRIES_STORE = 'entries';
const PENDING_SYNC_STORE = 'pendingSync';

interface PendingSyncItem {
  id: string;
  action: 'create' | 'update' | 'delete';
  entryId: string;
  data?: Partial<InsertJournalEntry>;
  timestamp: number;
}

let db: IDBDatabase | null = null;

export async function initOfflineDB(): Promise<IDBDatabase> {
  if (db) return db;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      if (!database.objectStoreNames.contains(ENTRIES_STORE)) {
        const entriesStore = database.createObjectStore(ENTRIES_STORE, { keyPath: 'id' });
        entriesStore.createIndex('userId', 'userId', { unique: false });
        entriesStore.createIndex('updatedAt', 'updatedAt', { unique: false });
      }

      if (!database.objectStoreNames.contains(PENDING_SYNC_STORE)) {
        database.createObjectStore(PENDING_SYNC_STORE, { keyPath: 'id' });
      }
    };
  });
}

export async function saveEntryOffline(entry: JournalEntry): Promise<void> {
  const database = await initOfflineDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([ENTRIES_STORE], 'readwrite');
    const store = transaction.objectStore(ENTRIES_STORE);
    const request = store.put(entry);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function getEntriesOffline(userId: string): Promise<JournalEntry[]> {
  const database = await initOfflineDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([ENTRIES_STORE], 'readonly');
    const store = transaction.objectStore(ENTRIES_STORE);
    const index = store.index('userId');
    const request = index.getAll(userId);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || []);
  });
}

export async function getEntryOffline(id: string): Promise<JournalEntry | undefined> {
  const database = await initOfflineDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([ENTRIES_STORE], 'readonly');
    const store = transaction.objectStore(ENTRIES_STORE);
    const request = store.get(id);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export async function deleteEntryOffline(id: string): Promise<void> {
  const database = await initOfflineDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([ENTRIES_STORE], 'readwrite');
    const store = transaction.objectStore(ENTRIES_STORE);
    const request = store.delete(id);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function addPendingSync(item: Omit<PendingSyncItem, 'id' | 'timestamp'>): Promise<void> {
  const database = await initOfflineDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([PENDING_SYNC_STORE], 'readwrite');
    const store = transaction.objectStore(PENDING_SYNC_STORE);
    const syncItem: PendingSyncItem = {
      ...item,
      id: `${item.action}-${item.entryId}-${Date.now()}`,
      timestamp: Date.now(),
    };
    const request = store.put(syncItem);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function getPendingSyncs(): Promise<PendingSyncItem[]> {
  const database = await initOfflineDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([PENDING_SYNC_STORE], 'readonly');
    const store = transaction.objectStore(PENDING_SYNC_STORE);
    const request = store.getAll();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || []);
  });
}

export async function removePendingSync(id: string): Promise<void> {
  const database = await initOfflineDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([PENDING_SYNC_STORE], 'readwrite');
    const store = transaction.objectStore(PENDING_SYNC_STORE);
    const request = store.delete(id);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function clearPendingSyncs(): Promise<void> {
  const database = await initOfflineDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([PENDING_SYNC_STORE], 'readwrite');
    const store = transaction.objectStore(PENDING_SYNC_STORE);
    const request = store.clear();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function syncEntriesFromServer(entries: JournalEntry[]): Promise<void> {
  const database = await initOfflineDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([ENTRIES_STORE], 'readwrite');
    const store = transaction.objectStore(ENTRIES_STORE);
    
    let completed = 0;
    const total = entries.length;
    
    if (total === 0) {
      resolve();
      return;
    }

    entries.forEach((entry) => {
      const request = store.put(entry);
      request.onsuccess = () => {
        completed++;
        if (completed === total) resolve();
      };
      request.onerror = () => reject(request.error);
    });
  });
}

export function hasPendingSyncs(): Promise<boolean> {
  return getPendingSyncs().then(syncs => syncs.length > 0);
}
