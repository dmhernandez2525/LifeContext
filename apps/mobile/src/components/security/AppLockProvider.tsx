import React, { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useSecurityStore } from '../../store/useSecurityStore';
import { LockScreen } from './LockScreen';

export function AppLockProvider({ children }: { children: React.ReactNode }) {
  const appState = useRef(AppState.currentState);
  const { isEnabled, lockTimeout, lastActive, setLastActive, setIsLocked, isLocked } = useSecurityStore();

  useEffect(() => {
    // Initial check on mount
    if (isEnabled && lastActive) {
      checkLockNecessity(Date.now());
    }
    
    // Subscribe to AppState changes
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [isEnabled, lockTimeout, lastActive]);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    const now = Date.now();

    if (appState.current.match(/active/) && nextAppState === 'background') {
      // Going to background -> Save timestamp
      setLastActive(now);
    } else if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      // Coming to foreground -> Check timeout
      if (isEnabled) {
        checkLockNecessity(now);
      }
    }

    appState.current = nextAppState;
  };

  const checkLockNecessity = (now: number) => {
    if (!lastActive) {
      // First time or lost state, lock if enabled implies we want security
      setIsLocked(true);
      return;
    }

    const elapsed = (now - lastActive) / 1000; // seconds
    if (elapsed >= lockTimeout) {
      setIsLocked(true);
    }
  };

  return (
    <>
      {children}
      {isLocked && isEnabled && <LockScreen />}
    </>
  );
}
