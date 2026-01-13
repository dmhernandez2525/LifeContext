import { storage, AppSettings, getSettings, updateSettings, exportAllData, getRecordings, getJournalEntries, getBrainDumps, getTasks } from '../lib/storage';

// Types
export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';
export type CloudProvider = 'icloud' | 'google' | 'dropbox' | 'none';

export interface SyncState {
  status: SyncStatus;
  lastSyncedAt: string | null;
  provider: CloudProvider;
  errorMessage?: string;
}

// Listeners
type SyncListener = (state: SyncState) => void;

class SyncService {
  private listeners: SyncListener[] = [];
  private state: SyncState = {
    status: 'idle',
    lastSyncedAt: null,
    provider: 'none',
  };

  private syncInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Load initial state from storage if available
    const savedSyncData = storage.getString('sync_state');
    if (savedSyncData) {
      try {
        const parsed = JSON.parse(savedSyncData);
        this.state = {
          ...this.state,
          lastSyncedAt: parsed.lastSyncedAt,
          provider: parsed.provider || 'none',
        };
      } catch (e) {
        console.warn('Failed to parse saved sync state');
      }
    }
  }

  // --- Public API ---

  public getState() {
    return this.state;
  }

  public subscribe(listener: SyncListener) {
    this.listeners.push(listener);
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public async setProvider(provider: CloudProvider) {
    this.updateState({ provider });
    if (provider !== 'none') {
        // Trigger initial sync
        await this.syncNow();
    }
  }

  public async syncNow(): Promise<void> {
    if (this.state.provider === 'none') {
        this.updateState({ errorMessage: 'No cloud provider selected' });
        return;
    }

    if (this.state.status === 'syncing') return;

    this.updateState({ status: 'syncing', errorMessage: undefined });

    try {
        // 1. Export Data
        const payload = await exportAllData(); // Returns uri currently, but we can simulate payload generation
        
        // 2. Simulate Network Delay (Upload)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 3. Mock Success
        this.updateState({ 
            status: 'success', 
            lastSyncedAt: new Date().toISOString() 
        });
        
    } catch (error) {
        console.error('Sync failed:', error);
        this.updateState({ 
            status: 'error', 
            errorMessage: error instanceof Error ? error.message : 'Unknown sync error' 
        });
    } finally {
        // Reset to idle after a moment if success
        if (this.state.status === 'success') {
             setTimeout(() => {
                 this.updateState({ status: 'idle' });
             }, 3000);
        }
    }
  }

  public enableAutoSync(intervalMs: number = 5 * 60 * 1000) {
      if (this.syncInterval) clearInterval(this.syncInterval);
      this.syncInterval = setInterval(() => {
          if (this.state.provider !== 'none') {
              this.syncNow();
          }
      }, intervalMs);
  }

  public disableAutoSync() {
      if (this.syncInterval) {
          clearInterval(this.syncInterval);
          this.syncInterval = null;
      }
  }

  // --- Internal ---

  private updateState(updates: Partial<SyncState>) {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
    // Persist critical state (provider, lastSynced)
    storage.set('sync_state', JSON.stringify({
        lastSyncedAt: this.state.lastSyncedAt,
        provider: this.state.provider
    }));
  }

  private notifyListeners() {
    this.listeners.forEach(l => l(this.state));
  }
}

export const syncService = new SyncService();
