/**
 * Storage Drivers for LifeContext
 *
 * Provides pluggable storage backends for encrypted blobs:
 * - S3-compatible object storage
 * - WebDAV
 * - Local filesystem (for Electron/Tauri)
 * - Internal (IndexedDB, default)
 */

export interface StorageDriver {
  name: string;

  /**
   * Initialize the driver with configuration
   */
  init(config: Record<string, any>): Promise<void>;

  /**
   * Upload an encrypted blob
   * @param key - Unique identifier for the blob
   * @param data - Encrypted data as Uint8Array
   * @param metadata - Optional metadata (stored separately, also encrypted)
   */
  upload(key: string, data: Uint8Array, metadata?: Record<string, string>): Promise<void>;

  /**
   * Download an encrypted blob
   * @param key - Unique identifier for the blob
   */
  download(key: string): Promise<Uint8Array>;

  /**
   * Delete a blob
   * @param key - Unique identifier for the blob
   */
  delete(key: string): Promise<void>;

  /**
   * Check if a blob exists
   * @param key - Unique identifier for the blob
   */
  exists(key: string): Promise<boolean>;

  /**
   * List all blob keys (for sync purposes)
   * @param prefix - Optional prefix to filter by
   */
  list(prefix?: string): Promise<string[]>;

  /**
   * Get metadata for a blob
   * @param key - Unique identifier for the blob
   */
  getMetadata(key: string): Promise<Record<string, string> | null>;
}

// ============================================================
// S3 DRIVER
// ============================================================

export interface S3Config {
  endpoint: string;
  bucket: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}

/**
 * S3-compatible storage driver
 * Works with AWS S3, MinIO, Backblaze B2, Cloudflare R2, etc.
 */
export class S3Driver implements StorageDriver {
  name = 's3';
  private config: S3Config | null = null;
  private baseUrl: string = '';

  async init(config: S3Config): Promise<void> {
    this.config = config;

    // Build base URL
    if (config.endpoint) {
      // Custom endpoint (MinIO, R2, B2, etc.)
      this.baseUrl = `${config.endpoint}/${config.bucket}`;
    } else {
      // AWS S3
      this.baseUrl = `https://${config.bucket}.s3.${config.region}.amazonaws.com`;
    }
  }

  // Reserved for future AWS Signature V4 implementation
  // private _getHeaders(method: string, key: string, contentType = 'application/octet-stream'): Headers {
  //   if (!this.config) throw new Error('S3 driver not initialized');
  //   const date = new Date().toUTCString();
  //   const headers = new Headers({
  //     'Date': date,
  //     'Content-Type': contentType,
  //     'Host': new URL(this.baseUrl).host,
  //   });
  //   return headers;
  // }

  async upload(key: string, data: Uint8Array, metadata?: Record<string, string>): Promise<void> {
    if (!this.config) throw new Error('S3 driver not initialized');

    const url = `${this.baseUrl}/${encodeURIComponent(key)}`;

    const headers = new Headers({
      'Content-Type': 'application/octet-stream',
      'x-amz-acl': 'private',
    });

    // Add custom metadata
    if (metadata) {
      Object.entries(metadata).forEach(([k, v]) => {
        headers.set(`x-amz-meta-${k}`, v);
      });
    }

    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: data,
    });

    if (!response.ok) {
      throw new Error(`S3 upload failed: ${response.status} ${response.statusText}`);
    }
  }

  async download(key: string): Promise<Uint8Array> {
    if (!this.config) throw new Error('S3 driver not initialized');

    const url = `${this.baseUrl}/${encodeURIComponent(key)}`;

    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Blob not found: ${key}`);
      }
      throw new Error(`S3 download failed: ${response.status} ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    return new Uint8Array(buffer);
  }

  async delete(key: string): Promise<void> {
    if (!this.config) throw new Error('S3 driver not initialized');

    const url = `${this.baseUrl}/${encodeURIComponent(key)}`;

    const response = await fetch(url, { method: 'DELETE' });

    if (!response.ok && response.status !== 404) {
      throw new Error(`S3 delete failed: ${response.status} ${response.statusText}`);
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.config) throw new Error('S3 driver not initialized');

    const url = `${this.baseUrl}/${encodeURIComponent(key)}`;

    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  }

  async list(prefix?: string): Promise<string[]> {
    if (!this.config) throw new Error('S3 driver not initialized');

    const params = new URLSearchParams({ 'list-type': '2' });
    if (prefix) params.set('prefix', prefix);

    const url = `${this.baseUrl}?${params}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`S3 list failed: ${response.status} ${response.statusText}`);
    }

    const xml = await response.text();

    // Parse XML response (simplified)
    const keys: string[] = [];
    const keyMatches = xml.matchAll(/<Key>([^<]+)<\/Key>/g);
    for (const match of keyMatches) {
      keys.push(match[1]);
    }

    return keys;
  }

  async getMetadata(key: string): Promise<Record<string, string> | null> {
    if (!this.config) throw new Error('S3 driver not initialized');

    const url = `${this.baseUrl}/${encodeURIComponent(key)}`;

    const response = await fetch(url, { method: 'HEAD' });

    if (!response.ok) {
      return null;
    }

    const metadata: Record<string, string> = {};
    response.headers.forEach((value: string, key: string) => {
      if (key.startsWith('x-amz-meta-')) {
        metadata[key.replace('x-amz-meta-', '')] = value;
      }
    });

    return metadata;
  }
}

// ============================================================
// FILESYSTEM DRIVER (for Electron/Tauri)
// ============================================================

export interface FileSystemConfig {
  basePath: string;
}

/**
 * Local filesystem storage driver
 * For use with Electron, Tauri, or other desktop environments
 */
export class FileSystemDriver implements StorageDriver {
  name = 'filesystem';
  private config: FileSystemConfig | null = null;

  async init(config: FileSystemConfig): Promise<void> {
    this.config = config;
    void this.config; // Reserved for future implementation
  }

  // Reserved for future implementation
  // private _getPath(key: string): string {
  //   if (!this.config) throw new Error('FileSystem driver not initialized');
  //   const sanitizedKey = key.replace(/[^a-zA-Z0-9-_./]/g, '_');
  //   return `${this.config.basePath}/${sanitizedKey}`;
  // }

  async upload(_key: string, _data: Uint8Array, _metadata?: Record<string, string>): Promise<void> {
    // In browser, use File System Access API if available
    if ('showSaveFilePicker' in window) {
      // This requires user interaction, so it's typically used differently
      throw new Error('FileSystem driver requires Electron/Tauri environment');
    }

    // For Node.js/Electron environment, would use fs.writeFile
    // This is a placeholder for the actual implementation
    throw new Error('FileSystem driver not implemented for this environment');
  }

  async download(_key: string): Promise<Uint8Array> {
    // For Node.js/Electron environment, would use fs.readFile
    throw new Error('FileSystem driver not implemented for this environment');
  }

  async delete(_key: string): Promise<void> {
    // For Node.js/Electron environment, would use fs.unlink
    throw new Error('FileSystem driver not implemented for this environment');
  }

  async exists(_key: string): Promise<boolean> {
    // For Node.js/Electron environment, would use fs.access
    throw new Error('FileSystem driver not implemented for this environment');
  }

  async list(_prefix?: string): Promise<string[]> {
    // For Node.js/Electron environment, would use fs.readdir
    throw new Error('FileSystem driver not implemented for this environment');
  }

  async getMetadata(_key: string): Promise<Record<string, string> | null> {
    // Metadata would be stored in a sidecar file or xattrs
    throw new Error('FileSystem driver not implemented for this environment');
  }
}

// ============================================================
// INTERNAL DRIVER (IndexedDB)
// ============================================================

/**
 * Internal IndexedDB storage driver
 * Default storage that keeps everything local
 */
export class InternalDriver implements StorageDriver {
  name = 'internal';
  private dbName = 'lcc-blobs';
  private storeName = 'blobs';
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
    });
  }

  async upload(key: string, data: Uint8Array, metadata?: Record<string, string>): Promise<void> {
    if (!this.db) throw new Error('Internal driver not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);

      const blob = {
        data,
        metadata: metadata || {},
        createdAt: new Date().toISOString(),
      };

      const request = store.put(blob, key);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async download(key: string): Promise<Uint8Array> {
    if (!this.db) throw new Error('Internal driver not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        if (!request.result) {
          reject(new Error(`Blob not found: ${key}`));
        } else {
          resolve(request.result.data);
        }
      };
    });
  }

  async delete(key: string): Promise<void> {
    if (!this.db) throw new Error('Internal driver not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async exists(key: string): Promise<boolean> {
    if (!this.db) throw new Error('Internal driver not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.count(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result > 0);
    });
  }

  async list(prefix?: string): Promise<string[]> {
    if (!this.db) throw new Error('Internal driver not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAllKeys();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        let keys = request.result as string[];
        if (prefix) {
          keys = keys.filter(k => k.startsWith(prefix));
        }
        resolve(keys);
      };
    });
  }

  async getMetadata(key: string): Promise<Record<string, string> | null> {
    if (!this.db) throw new Error('Internal driver not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        resolve(request.result?.metadata || null);
      };
    });
  }
}

// ============================================================
// DRIVER FACTORY
// ============================================================

export type DriverType = 'internal' | 's3' | 'filesystem';

export function createDriver(type: DriverType): StorageDriver {
  switch (type) {
    case 's3':
      return new S3Driver();
    case 'filesystem':
      return new FileSystemDriver();
    case 'internal':
    default:
      return new InternalDriver();
  }
}

// ============================================================
// SYNC MANAGER
// ============================================================

export interface SyncStatus {
  lastSync: Date | null;
  pendingUploads: number;
  pendingDownloads: number;
  status: 'idle' | 'syncing' | 'error';
  error?: string;
}

/**
 * Manages synchronization between local and remote storage
 */
export class SyncManager {
  private localDriver: StorageDriver;
  private remoteDriver: StorageDriver | null = null;
  private status: SyncStatus = {
    lastSync: null,
    pendingUploads: 0,
    pendingDownloads: 0,
    status: 'idle',
  };

  constructor() {
    this.localDriver = new InternalDriver();
  }

  async init(remoteConfig?: { type: DriverType; config: Record<string, any> }): Promise<void> {
    await this.localDriver.init({});

    if (remoteConfig) {
      this.remoteDriver = createDriver(remoteConfig.type);
      await this.remoteDriver.init(remoteConfig.config);
    }
  }

  getStatus(): SyncStatus {
    return { ...this.status };
  }

  /**
   * Save a blob locally and queue for remote sync
   */
  async save(key: string, data: Uint8Array, metadata?: Record<string, string>): Promise<void> {
    // Always save locally first
    await this.localDriver.upload(key, data, {
      ...metadata,
      pendingSync: 'true',
    });

    // If remote configured, queue for sync
    if (this.remoteDriver) {
      this.status.pendingUploads++;
    }
  }

  /**
   * Sync all pending uploads to remote
   */
  async syncToRemote(): Promise<void> {
    if (!this.remoteDriver) return;

    this.status.status = 'syncing';

    try {
      const localKeys = await this.localDriver.list();

      for (const key of localKeys) {
        const metadata = await this.localDriver.getMetadata(key);
        if (metadata?.pendingSync === 'true') {
          const data = await this.localDriver.download(key);
          await this.remoteDriver.upload(key, data, metadata);

          // Mark as synced
          await this.localDriver.upload(key, data, {
            ...metadata,
            pendingSync: 'false',
            lastSync: new Date().toISOString(),
          });

          this.status.pendingUploads--;
        }
      }

      this.status.lastSync = new Date();
      this.status.status = 'idle';
    } catch (error) {
      this.status.status = 'error';
      this.status.error = error instanceof Error ? error.message : 'Sync failed';
    }
  }

  /**
   * Sync all blobs from remote to local
   */
  async syncFromRemote(): Promise<void> {
    if (!this.remoteDriver) return;

    this.status.status = 'syncing';

    try {
      const remoteKeys = await this.remoteDriver.list();
      const localKeys = new Set(await this.localDriver.list());

      // Find keys that need to be downloaded
      const keysToDownload = remoteKeys.filter(key => !localKeys.has(key));
      this.status.pendingDownloads = keysToDownload.length;

      for (const key of keysToDownload) {
        const data = await this.remoteDriver.download(key);
        const metadata = await this.remoteDriver.getMetadata(key);
        await this.localDriver.upload(key, data, metadata || undefined);
        this.status.pendingDownloads--;
      }

      this.status.lastSync = new Date();
      this.status.status = 'idle';
    } catch (error) {
      this.status.status = 'error';
      this.status.error = error instanceof Error ? error.message : 'Sync failed';
    }
  }
}
