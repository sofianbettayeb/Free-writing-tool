import { useState, useEffect, useCallback, useRef } from 'react';
import { JournalEntry, InsertJournalEntry } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import {
  initOfflineDB,
  saveEntryOffline,
  getEntriesOffline,
  deleteEntryOffline,
  addPendingSync,
  getPendingSyncs,
  removePendingSync,
  syncEntriesFromServer,
  hasPendingSyncs,
} from '@/lib/offlineStorage';

interface UseOfflineSyncResult {
  isOnline: boolean;
  isSyncing: boolean;
  hasPendingChanges: boolean;
  syncNow: () => Promise<void>;
  saveEntry: (entry: JournalEntry) => Promise<void>;
  createEntry: (data: InsertJournalEntry) => Promise<JournalEntry | null>;
  updateEntry: (id: string, data: Partial<InsertJournalEntry>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  getOfflineEntries: (userId: string) => Promise<JournalEntry[]>;
}

export function useOfflineSync(userId?: string): UseOfflineSyncResult {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const syncInProgress = useRef(false);

  useEffect(() => {
    initOfflineDB().catch(console.error);
    
    const checkPending = async () => {
      const pending = await hasPendingSyncs();
      setHasPendingChanges(pending);
    };
    checkPending();
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncNow();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const syncNow = useCallback(async () => {
    if (!navigator.onLine || syncInProgress.current) return;

    syncInProgress.current = true;
    setIsSyncing(true);

    try {
      const pendingSyncs = await getPendingSyncs();

      for (const sync of pendingSyncs) {
        try {
          if (sync.action === 'create' && sync.data) {
            const response = await apiRequest('POST', '/api/entries', sync.data);
            const serverEntry = await response.json();
            await deleteEntryOffline(sync.entryId);
            await saveEntryOffline(serverEntry);
          } else if (sync.action === 'update' && sync.data) {
            if (!sync.entryId.startsWith('offline-')) {
              await apiRequest('PATCH', `/api/entries/${sync.entryId}`, sync.data);
            }
          } else if (sync.action === 'delete') {
            if (!sync.entryId.startsWith('offline-')) {
              await apiRequest('DELETE', `/api/entries/${sync.entryId}`);
            }
          }
          await removePendingSync(sync.id);
        } catch (error) {
          console.error('Failed to sync item:', sync, error);
        }
      }

      if (userId) {
        try {
          const response = await fetch(`/api/entries?userId=${userId}`);
          if (response.ok) {
            const entries = await response.json();
            await syncEntriesFromServer(entries);
          }
        } catch (error) {
          console.error('Failed to fetch entries from server:', error);
        }
      }

      const pending = await hasPendingSyncs();
      setHasPendingChanges(pending);
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
      syncInProgress.current = false;
    }
  }, [userId]);

  const saveEntry = useCallback(async (entry: JournalEntry) => {
    await saveEntryOffline(entry);
  }, []);

  const createEntry = useCallback(async (data: InsertJournalEntry): Promise<JournalEntry | null> => {
    if (!navigator.onLine) {
      const tempId = `offline-${Date.now()}`;
      const tempEntry: JournalEntry = {
        id: tempId,
        userId: userId || '',
        title: data.title || '',
        content: data.content || '',
        tags: data.tags || [],
        wordCount: data.wordCount || '0',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await saveEntryOffline(tempEntry);
      await addPendingSync({ action: 'create', entryId: tempId, data });
      setHasPendingChanges(true);
      return tempEntry;
    }
    return null;
  }, [userId]);

  const updateEntry = useCallback(async (id: string, data: Partial<InsertJournalEntry>) => {
    const existingEntries = await getEntriesOffline(userId || '');
    const entry = existingEntries.find(e => e.id === id);
    
    if (entry) {
      const updatedEntry = { ...entry, ...data, updatedAt: new Date() };
      await saveEntryOffline(updatedEntry as JournalEntry);
    }

    if (!navigator.onLine) {
      await addPendingSync({ action: 'update', entryId: id, data });
      setHasPendingChanges(true);
    }
  }, [userId]);

  const deleteEntry = useCallback(async (id: string) => {
    await deleteEntryOffline(id);
    
    if (!navigator.onLine) {
      await addPendingSync({ action: 'delete', entryId: id });
      setHasPendingChanges(true);
    }
  }, []);

  const getOfflineEntries = useCallback(async (uid: string) => {
    return getEntriesOffline(uid);
  }, []);

  return {
    isOnline,
    isSyncing,
    hasPendingChanges,
    syncNow,
    saveEntry,
    createEntry,
    updateEntry,
    deleteEntry,
    getOfflineEntries,
  };
}
