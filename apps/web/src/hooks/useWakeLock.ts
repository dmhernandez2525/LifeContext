/**
 * useWakeLock - Prevent screen from turning off during recording sessions
 * Uses the Screen Wake Lock API (supported in modern browsers)
 */
import { useState, useCallback, useRef, useEffect } from 'react';

export interface UseWakeLockReturn {
  isLocked: boolean;
  isSupported: boolean;
  request: () => Promise<void>;
  release: () => Promise<void>;
  error: string | null;
}

export function useWakeLock(): UseWakeLockReturn {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if Screen Wake Lock API is supported
  const isSupported = typeof navigator !== 'undefined' && 'wakeLock' in navigator;

  // Handle visibility change (re-acquire wake lock when page becomes visible)
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && wakeLockRef.current === null && isLocked) {
        // Re-acquire wake lock if we had one and page became visible again
        try {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
          wakeLockRef.current.addEventListener('release', () => {
            setIsLocked(false);
            wakeLockRef.current = null;
          });
        } catch (err) {
          // Silent fail on re-acquisition
          console.warn('Wake lock re-acquisition failed:', err);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isLocked]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    };
  }, []);

  // Request wake lock
  const request = useCallback(async () => {
    if (!isSupported) {
      setError('Screen Wake Lock not supported');
      return;
    }

    try {
      wakeLockRef.current = await navigator.wakeLock.request('screen');
      setIsLocked(true);
      setError(null);

      // Listen for release events (e.g., when tab becomes hidden)
      wakeLockRef.current.addEventListener('release', () => {
        setIsLocked(false);
        wakeLockRef.current = null;
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to request wake lock';
      setError(message);
      setIsLocked(false);
    }
  }, [isSupported]);

  // Release wake lock
  const release = useCallback(async () => {
    if (wakeLockRef.current) {
      await wakeLockRef.current.release();
      wakeLockRef.current = null;
      setIsLocked(false);
      setError(null);
    }
  }, []);

  return {
    isLocked,
    isSupported,
    request,
    release,
    error,
  };
}

export default useWakeLock;
