/**
 * Privacy scoring algorithms for browser data analysis.
 * Categorizes cookies, computes privacy risk, and generates insights.
 */

export type CookieCategory = 'tracking' | 'analytics' | 'functional' | 'advertising' | 'unknown';

const TRACKER_DOMAINS = new Set([
  'doubleclick.net', 'googlesyndication.com', 'facebook.net',
  'fbcdn.net', 'googleadservices.com', 'adsrvr.org',
  'criteo.com', 'outbrain.com', 'taboola.com', 'amazon-adsystem.com',
]);

const ANALYTICS_DOMAINS = new Set([
  'google-analytics.com', 'hotjar.com', 'mixpanel.com',
  'segment.com', 'amplitude.com', 'fullstory.com',
  'heap.io', 'mouseflow.com', 'clarity.ms',
]);

const FUNCTIONAL_DOMAINS = new Set([
  'cloudflare.com', 'jsdelivr.net', 'googleapis.com',
  'gstatic.com', 'unpkg.com', 'cdnjs.cloudflare.com',
]);

/**
 * Categorize a cookie domain.
 */
export function categorizeCookie(domain: string): CookieCategory {
  const lower = domain.toLowerCase().replace(/^\./, '');
  if (TRACKER_DOMAINS.has(lower)) return 'tracking';
  if (ANALYTICS_DOMAINS.has(lower)) return 'analytics';
  if (FUNCTIONAL_DOMAINS.has(lower)) return 'functional';
  if (lower.includes('ads') || lower.includes('track') || lower.includes('pixel')) return 'advertising';
  return 'unknown';
}

/**
 * Calculate a 0-100 privacy risk score from cookie domains.
 * Higher = more risk (more trackers).
 */
export function calculatePrivacyScore(cookieDomains: string[]): number {
  if (cookieDomains.length === 0) return 100; // No cookies = max privacy

  const categories = cookieDomains.map(categorizeCookie);
  const trackingCount = categories.filter(c => c === 'tracking' || c === 'advertising').length;
  const analyticsCount = categories.filter(c => c === 'analytics').length;

  // Base score starts at 100, deducted by trackers and analytics
  const trackingPenalty = Math.min(trackingCount * 5, 50);
  const analyticsPenalty = Math.min(analyticsCount * 2, 20);
  const volumePenalty = Math.min(cookieDomains.length * 0.5, 30);

  return Math.max(0, Math.round(100 - trackingPenalty - analyticsPenalty - volumePenalty));
}

/**
 * Generate domain statistics from browser history.
 */
export function analyzeDomains(historyItems: Array<{ url: string; visitCount: number }>) {
  const domainMap = new Map<string, number>();

  for (const item of historyItems) {
    try {
      const domain = new URL(item.url).hostname;
      domainMap.set(domain, (domainMap.get(domain) ?? 0) + item.visitCount);
    } catch {
      // Skip malformed URLs
    }
  }

  return Array.from(domainMap.entries())
    .map(([domain, visits]) => ({ domain, visits }))
    .sort((a, b) => b.visits - a.visits);
}

export interface PrivacyAnalysis {
  score: number;
  label: string;
  color: string;
  trackingCookies: number;
  analyticsCookies: number;
  functionalCookies: number;
  advertisingCookies: number;
  unknownCookies: number;
}

/**
 * Full privacy analysis from cookie domains.
 */
export function analyzePrivacy(cookieDomains: string[]): PrivacyAnalysis {
  const categories = cookieDomains.map(categorizeCookie);
  const score = calculatePrivacyScore(cookieDomains);

  const labelMap: Record<string, { label: string; color: string }> = {
    high: { label: 'Excellent', color: 'text-green-600' },
    medium: { label: 'Moderate', color: 'text-yellow-600' },
    low: { label: 'Poor', color: 'text-red-600' },
  };

  const tier = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';

  return {
    score,
    ...labelMap[tier],
    trackingCookies: categories.filter(c => c === 'tracking').length,
    analyticsCookies: categories.filter(c => c === 'analytics').length,
    functionalCookies: categories.filter(c => c === 'functional').length,
    advertisingCookies: categories.filter(c => c === 'advertising').length,
    unknownCookies: categories.filter(c => c === 'unknown').length,
  };
}
