/**
 * Convex Client Configuration for Mobile
 */
import { ConvexReactClient } from 'convex/react';

// Convex deployment URL - must be set via environment variable
const CONVEX_URL = process.env.EXPO_PUBLIC_CONVEX_URL;

if (!CONVEX_URL) {
  console.warn('EXPO_PUBLIC_CONVEX_URL not set - Convex sync disabled');
}

export const convex = CONVEX_URL ? new ConvexReactClient(CONVEX_URL) : null;

