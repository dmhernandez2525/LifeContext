import React, { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { useSecurityStore } from '../../store/useSecurityStore';
import { LockScreen } from './LockScreen';

export function AppLockProvider({ children }: { children: React.ReactNode }) {
  const appState = useRef(AppState.currentState);
  const {
    isEnabled,
    lockTimeout,
    lastActive,
    failedLockUntil,
    isLocked,
    setLastActive,
    setIsLocked,
  } = useSecurityStore();

  const checkLockNecessity = (now: number): void => {
    if (!isEnabled) {
      return;
    }

    if (failedLockUntil && now < failedLockUntil) {
      setIsLocked(true);
      return;
    }

    if (!lastActive) {
      setIsLocked(true);
      return;
    }

    const elapsedSeconds = (now - lastActive) / 1000;
    if (elapsedSeconds >= lockTimeout) {
      setIsLocked(true);
    }
  };

  useEffect(() => {
    if (isEnabled) {
      checkLockNecessity(Date.now());
    }

    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      const now = Date.now();

      if (appState.current.match(/active/) && nextAppState === 'background') {
        setLastActive(now);
      }

      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        checkLockNecessity(now);
      }

      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, [isEnabled, lockTimeout, lastActive, failedLockUntil]);

  return (
    <>
      {children}
      {isLocked && isEnabled && <LockScreen />}
    </>
  );
}
