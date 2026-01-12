/**
 * useCloudSync - Hook for managing cloud backup/sync
 * 
 * Supports Google Drive and OneDrive.
 * All data is encrypted before upload.
 */

import { useState, useCallback } from 'react';
import { exportData } from '@lcc/storage';

export type CloudProvider = 'google-drive' | 'onedrive' | null;

export interface CloudSyncState {
  provider: CloudProvider;
  isConnected: boolean;
  isConnecting: boolean;
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  error: string | null;
}

export interface UseCloudSyncReturn extends CloudSyncState {
  connectGoogleDrive: () => Promise<void>;
  connectOneDrive: () => Promise<void>;
  disconnect: () => void;
  sync: () => Promise<void>;
}

// Google Drive OAuth configuration
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const GOOGLE_SCOPES = 'https://www.googleapis.com/auth/drive.appdata';

// OneDrive OAuth configuration
const ONEDRIVE_CLIENT_ID = import.meta.env.VITE_ONEDRIVE_CLIENT_ID || '';
const ONEDRIVE_SCOPES = 'files.readwrite.appfolder offline_access';

export function useCloudSync(): UseCloudSyncReturn {
  const [state, setState] = useState<CloudSyncState>({
    provider: null,
    isConnected: false,
    isConnecting: false,
    isSyncing: false,
    lastSyncedAt: null,
    error: null,
  });

  // Google Drive connection using Google Identity Services
  const connectGoogleDrive = useCallback(async () => {
    if (!GOOGLE_CLIENT_ID) {
      setState(s => ({ ...s, error: 'Google Drive not configured. Set VITE_GOOGLE_CLIENT_ID.' }));
      return;
    }

    setState(s => ({ ...s, isConnecting: true, error: null }));

    try {
      // Load Google Identity Services library
      await loadGoogleIdentityServices();

      // Initialize token client
      const tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: GOOGLE_SCOPES,
        callback: async (response) => {
          if (response.error) {
            setState(s => ({
              ...s,
              isConnecting: false,
              error: response.error_description || 'Failed to connect',
            }));
            return;
          }

          // Store access token
          if (response.access_token) {
            localStorage.setItem('lcc_google_token', response.access_token);
            localStorage.setItem('lcc_cloud_provider', 'google-drive');
          }

          setState(s => ({
            ...s,
            provider: 'google-drive',
            isConnected: true,
            isConnecting: false,
          }));
        },
      });

      // Request access token
      tokenClient.requestAccessToken();
    } catch (err) {
      setState(s => ({
        ...s,
        isConnecting: false,
        error: err instanceof Error ? err.message : 'Failed to connect to Google Drive',
      }));
    }
  }, []);

  // OneDrive connection using MSAL
  const connectOneDrive = useCallback(async () => {
    if (!ONEDRIVE_CLIENT_ID) {
      setState(s => ({ ...s, error: 'OneDrive not configured. Set VITE_ONEDRIVE_CLIENT_ID.' }));
      return;
    }

    setState(s => ({ ...s, isConnecting: true, error: null }));

    try {
      // Load MSAL library
      await loadMSAL();

      const msalConfig = {
        auth: {
          clientId: ONEDRIVE_CLIENT_ID,
          redirectUri: window.location.origin,
        },
      };

      const msalInstance = new msal.PublicClientApplication(msalConfig);
      await msalInstance.initialize();

      const loginResponse = await msalInstance.loginPopup({
        scopes: ONEDRIVE_SCOPES.split(' '),
      });

      if (loginResponse.accessToken) {
        localStorage.setItem('lcc_onedrive_token', loginResponse.accessToken);
        localStorage.setItem('lcc_cloud_provider', 'onedrive');

        setState(s => ({
          ...s,
          provider: 'onedrive',
          isConnected: true,
          isConnecting: false,
        }));
      }
    } catch (err) {
      setState(s => ({
        ...s,
        isConnecting: false,
        error: err instanceof Error ? err.message : 'Failed to connect to OneDrive',
      }));
    }
  }, []);

  // Disconnect from cloud provider
  const disconnect = useCallback(() => {
    localStorage.removeItem('lcc_google_token');
    localStorage.removeItem('lcc_onedrive_token');
    localStorage.removeItem('lcc_cloud_provider');

    setState({
      provider: null,
      isConnected: false,
      isConnecting: false,
      isSyncing: false,
      lastSyncedAt: null,
      error: null,
    });
  }, []);

  // Sync data to cloud
  const sync = useCallback(async () => {
    if (!state.isConnected || !state.provider) {
      setState(s => ({ ...s, error: 'Not connected to any cloud provider' }));
      return;
    }

    setState(s => ({ ...s, isSyncing: true, error: null }));

    try {
      // Export all data (already encrypted)
      const data = await exportData();
      const jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });

      if (state.provider === 'google-drive') {
        await uploadToGoogleDrive(jsonBlob);
      } else if (state.provider === 'onedrive') {
        await uploadToOneDrive(jsonBlob);
      }

      const now = new Date();
      localStorage.setItem('lcc_last_synced', now.toISOString());

      setState(s => ({
        ...s,
        isSyncing: false,
        lastSyncedAt: now,
      }));
    } catch (err) {
      setState(s => ({
        ...s,
        isSyncing: false,
        error: err instanceof Error ? err.message : 'Sync failed',
      }));
    }
  }, [state.isConnected, state.provider]);

  return {
    ...state,
    connectGoogleDrive,
    connectOneDrive,
    disconnect,
    sync,
  };
}

// Load Google Identity Services library dynamically
async function loadGoogleIdentityServices(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).google?.accounts) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
    document.head.appendChild(script);
  });
}

// Load MSAL library dynamically
async function loadMSAL(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).msal) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://alcdn.msauth.net/browser/2.32.2/js/msal-browser.min.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load MSAL'));
    document.head.appendChild(script);
  });
}

// Upload to Google Drive App Data folder
async function uploadToGoogleDrive(blob: Blob): Promise<void> {
  const token = localStorage.getItem('lcc_google_token');
  if (!token) throw new Error('No Google Drive token');

  const metadata = {
    name: 'lcc-backup.json',
    parents: ['appDataFolder'],
  };

  const formData = new FormData();
  formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  formData.append('file', blob);

  const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Upload failed');
  }
}

// Upload to OneDrive App Folder
async function uploadToOneDrive(blob: Blob): Promise<void> {
  const token = localStorage.getItem('lcc_onedrive_token');
  if (!token) throw new Error('No OneDrive token');

  const response = await fetch(
    'https://graph.microsoft.com/v1.0/me/drive/special/approot:/lcc-backup.json:/content',
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: blob,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Upload failed');
  }
}

// Declare globals for external libraries
declare const google: {
  accounts: {
    oauth2: {
      initTokenClient: (config: {
        client_id: string;
        scope: string;
        callback: (response: { access_token?: string; error?: string; error_description?: string }) => void;
      }) => { requestAccessToken: () => void };
    };
  };
};

declare const msal: {
  PublicClientApplication: new (config: {
    auth: { clientId: string; redirectUri: string };
  }) => {
    initialize: () => Promise<void>;
    loginPopup: (request: { scopes: string[] }) => Promise<{ accessToken: string }>;
  };
};

export default useCloudSync;
