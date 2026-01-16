import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useAppStore } from '@lcc/core';
import '../global.css';

import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { SpaceMono_400Regular } from '@expo-google-fonts/space-mono';

import { TabBarProvider } from '../src/context/TabBarContext';
import { AppLockProvider } from '../src/components/security/AppLockProvider';
import { configureQuickActions, useQuickActionRouting } from '../src/lib/quickActions';

// Keep the splash screen visible while we initialize
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    SpaceMono_400Regular,
  });

  const router = useRouter(); // Must import useRouter
  const { isInitialized } = useAppStore();
  useQuickActionRouting(router);

  useEffect(() => {
    configureQuickActions();
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useEffect(() => {
    if (loaded && !isInitialized) {
      // Small timeout to ensure navigation is ready
      const timer = setTimeout(() => {
        router.replace('/onboarding');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loaded, isInitialized]);

  if (!loaded && !error) {
    return null;
  }


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <BottomSheetModalProvider>
          <AppLockProvider>
            <TabBarProvider>
              <StatusBar style="light" />
              <Stack
                screenOptions={{
                  headerStyle: {
                    backgroundColor: '#0f172a',
                  },
                  headerTintColor: '#f8fafc',
                  headerTitleStyle: {
                    fontWeight: '600',
                  },
                  contentStyle: {
                    backgroundColor: '#0f172a',
                  },
                }}
              >
                <Stack.Screen
                  name="(tabs)"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="onboarding"
                  options={{ headerShown: false, presentation: 'modal' }}
                />
                <Stack.Screen
                  name="brain-dump"
                  options={{
                    title: 'Brain Dump',
                    presentation: 'modal',
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="recording"
                  options={{
                    title: 'Recording',
                    presentation: 'fullScreenModal',
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="family"
                  options={{
                    title: 'Family Circle',
                    presentation: 'card',
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="settings"
                  options={{
                    headerShown: false,
                  }}
                />
              </Stack>
            </TabBarProvider>
          </AppLockProvider>
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
