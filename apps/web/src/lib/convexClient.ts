/**
 * Convex client configuration and session management.
 * Provides ConvexReactClient instance and anonymous session ID.
 */
import { ConvexReactClient } from 'convex/react';

const CONVEX_URL = import.meta.env.VITE_CONVEX_URL as string | undefined;

/**
 * Create a ConvexReactClient if the URL is configured.
 * Returns null when running without a Convex backend (local dev, demo mode).
 */
export function createConvexClient(): ConvexReactClient | null {
  if (!CONVEX_URL) return null;
  return new ConvexReactClient(CONVEX_URL);
}

const SESSION_KEY = 'lcc-session-id';

/**
 * Get or create a persistent anonymous session ID.
 * Used for vote tracking without requiring authentication.
 */
export function getSessionId(): string {
  const existing = localStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  const id = crypto.randomUUID();
  localStorage.setItem(SESSION_KEY, id);
  return id;
}
