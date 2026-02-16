import * as QuickActions from 'expo-quick-actions';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Router } from 'expo-router';
import { useSecurityStore } from '../store/useSecurityStore';

/**
 * Configure dynamic quick actions for the home screen
 */
export function configureQuickActions() {
  if (Platform.OS === 'web') return;

  QuickActions.setItems([
    {
      title: 'New Recording',
      subtitle: 'Capture audio context',
      icon: 'compose', // systematic icon
      id: 'record',
      params: { href: '/recording' },
    },
    {
      title: 'Brain Dump',
      subtitle: 'Freeform thoughts',
      icon: 'task',
      id: 'braindump',
      params: { href: '/brain-dump' },
    },
    {
      title: 'Daily Journal',
      subtitle: 'Log your day',
      icon: 'date',
      id: 'journal',
      params: { href: '/(tabs)/journal' },
    },
    {
      title: 'Lock Now',
      subtitle: 'Secure the app immediately',
      icon: 'lock',
      id: 'lock_now',
    },
  ]);
}

/**
 * Handle quick action selection
 */
export function useQuickActionRouting(router: Router) {
  const lockNow = useSecurityStore((state) => state.lockNow);

  useEffect(() => {
    let isMounted = true;

    const handleAction = (action: QuickActions.Action) => {
      if (action?.id === 'lock_now') {
        lockNow();
        return;
      }

      if (action?.params?.href) {
        // Small delay to ensure navigation is ready
        setTimeout(() => {
          if (isMounted) {
            const href = action.params?.href;
            if (href) {
                // Expo Router href can be string or object, using never to bypass strict typing for dynamic routes
                router.push(href as never);
            }
          }
        }, 500);
      }
    };

    // Check initial action
    const initialAction = QuickActions.initial;
    if (initialAction) {
      handleAction(initialAction);
    }

    // Listen for subsequent actions
    const subscription = QuickActions.addListener((action) => {
      handleAction(action);
    });

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, [lockNow, router]);
}
