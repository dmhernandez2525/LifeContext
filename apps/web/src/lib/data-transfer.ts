/**
 * Data Transfer Utilities
 * Handles exporting and importing application data (JSON backups)
 */

export interface BackupData {
  version: number;
  timestamp: number;
  appName: string;
  data: Record<string, string>; // localStorage keys and values
}

const CURRENT_VERSION = 1;
const PREFIX = 'lcc-';

/**
 * Export all LifeContext data to a JSON blob
 */
export async function exportData(): Promise<void> {
  try {
    const data: Record<string, string> = {};

    // Collect all keys starting with lcc-
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(PREFIX)) {
        const item = localStorage.getItem(key);
        if (item) {
          data[key] = item;
        }
      }
    }

    const backup: BackupData = {
      version: CURRENT_VERSION,
      timestamp: Date.now(),
      appName: 'LifeContextCompiler',
      data,
    };

    // Create and download blob
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lifecontext-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Export failed:', error);
    throw new Error('Failed to export data');
  }
}

/**
 * Import data from a JSON backup
 * @param jsonData Parsed JSON data from backup file
 */
export async function importData(jsonData: unknown): Promise<void> {
  // Basic validation
  if (!jsonData || typeof jsonData !== 'object') {
    throw new Error('Invalid backup file format');
  }

  // Version check (for future migration logic)
  // Version check (for future migration logic)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((jsonData as any).appName !== 'LifeContextCompiler') {
    throw new Error('Invalid backup file: Not a LifeContext backup');
  }

  const backup = jsonData as BackupData;
  const data = backup.data;

  if (!data || typeof data !== 'object') {
    throw new Error('Backup contains no data');
  }

  try {
    // Clear existing LCC data to avoid conflicts/dangling state
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));

    // Restore data
    Object.entries(data).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });

    // Reload to apply changes
    window.location.reload();
  } catch (error) {
    console.error('Import failed:', error);
    throw new Error('Failed to restore data');
  }
}

/**
 * Wipe all LifeContext data
 */
export async function wipeData(): Promise<void> {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    window.location.reload();
  } catch (error) {
    console.error('Wipe failed:', error);
    throw new Error('Failed to wipe data');
  }
}
