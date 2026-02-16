/**
 * ConvexClientProvider - Wraps the app with ConvexProvider when configured.
 * Falls back to rendering children directly if VITE_CONVEX_URL is not set,
 * allowing the app to run in demo/offline mode without a backend.
 */
import { ReactNode, useMemo } from 'react';
import { ConvexProvider } from 'convex/react';
import { createConvexClient } from '@/lib/convexClient';

interface ConvexClientProviderProps {
  children: ReactNode;
}

export function ConvexClientProvider({ children }: ConvexClientProviderProps) {
  const client = useMemo(() => createConvexClient(), []);

  if (!client) {
    return <>{children}</>;
  }

  return (
    <ConvexProvider client={client}>
      {children}
    </ConvexProvider>
  );
}
