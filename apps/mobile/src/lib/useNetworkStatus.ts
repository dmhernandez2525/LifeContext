/**
 * Network status hook for offline mode detection.
 * Uses @react-native-community/netinfo when available,
 * falls back to navigator.onLine on web.
 */
import { useState, useEffect, useCallback } from 'react';
import { Platform, AppState } from 'react-native';

interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string;
}

const defaultStatus: NetworkStatus = {
  isConnected: true,
  isInternetReachable: true,
  type: 'unknown',
};

export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>(defaultStatus);

  const checkWeb = useCallback(() => {
    if (Platform.OS !== 'web') return;
    const online = typeof navigator !== 'undefined' ? navigator.onLine : true;
    setStatus({
      isConnected: online,
      isInternetReachable: online,
      type: online ? 'wifi' : 'none',
    });
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') {
      checkWeb();
      window.addEventListener('online', checkWeb);
      window.addEventListener('offline', checkWeb);
      return () => {
        window.removeEventListener('online', checkWeb);
        window.removeEventListener('offline', checkWeb);
      };
    }

    // On native, try to use NetInfo if available
    let unsubscribe: (() => void) | null = null;

    try {
      // Dynamic import to avoid crash if not installed
      const NetInfo = require('@react-native-community/netinfo');
      unsubscribe = NetInfo.addEventListener(
        (state: { isConnected: boolean | null; isInternetReachable: boolean | null; type: string }) => {
          setStatus({
            isConnected: state.isConnected ?? true,
            isInternetReachable: state.isInternetReachable,
            type: state.type,
          });
        },
      );
    } catch {
      // NetInfo not installed; fallback to AppState-based check
      const handleAppState = () => {
        setStatus((prev) => ({ ...prev, isConnected: true }));
      };
      const sub = AppState.addEventListener('change', handleAppState);
      unsubscribe = () => sub.remove();
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [checkWeb]);

  return status;
}
