/**
 * Convex Client Configuration for Mobile
 */
import { ConvexReactClient } from 'convex/react';

// Convex deployment URL - must be set via environment variable
// If not set, Convex sync features will be disabled (local-only mode)
const CONVEX_URL = process.env.EXPO_PUBLIC_CONVEX_URL;

export const convex = CONVEX_URL ? new ConvexReactClient(CONVEX_URL) : null;

