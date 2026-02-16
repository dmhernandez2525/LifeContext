/**
 * Location context engine for place detection and location history.
 * Uses browser Geolocation API with privacy-first approach.
 */

export interface LocationEntry {
  id: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  label?: string;
  address?: string;
  timestamp: number;
  source: 'auto' | 'manual';
}

export interface SavedPlace {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
  radius: number;
  icon: string;
  visitCount: number;
  lastVisit: number | null;
}

const EARTH_RADIUS_KM = 6371;

/**
 * Calculate distance between two points using the Haversine formula.
 * Returns distance in kilometers.
 */
export function haversineDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const toRad = (deg: number) => deg * (Math.PI / 180);
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Check if a location is within a saved place's radius.
 */
export function isNearPlace(
  lat: number, lon: number,
  place: SavedPlace
): boolean {
  const distKm = haversineDistance(lat, lon, place.latitude, place.longitude);
  return distKm <= place.radius / 1000;
}

/**
 * Find which saved place a location is nearest to (within radius).
 */
export function detectPlace(
  lat: number, lon: number,
  places: SavedPlace[]
): SavedPlace | null {
  let nearest: SavedPlace | null = null;
  let minDist = Infinity;

  for (const place of places) {
    const dist = haversineDistance(lat, lon, place.latitude, place.longitude);
    if (dist <= place.radius / 1000 && dist < minDist) {
      nearest = place;
      minDist = dist;
    }
  }

  return nearest;
}

/**
 * Format coordinates for display.
 */
export function formatCoords(lat: number, lon: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lon).toFixed(4)}°${lonDir}`;
}

/**
 * Format a distance value.
 */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

/**
 * Group location entries by date.
 */
export function groupByDate(entries: LocationEntry[]): Record<string, LocationEntry[]> {
  const groups: Record<string, LocationEntry[]> = {};
  for (const entry of entries) {
    const date = new Date(entry.timestamp).toISOString().slice(0, 10);
    if (!groups[date]) groups[date] = [];
    groups[date].push(entry);
  }
  return groups;
}

/**
 * Get location visit summary for the last N days.
 */
export function getVisitSummary(
  entries: LocationEntry[],
  places: SavedPlace[],
  days: number
): Array<{ place: SavedPlace; visits: number; lastVisit: number }> {
  const cutoff = Date.now() - days * 86_400_000;
  const recent = entries.filter(e => e.timestamp >= cutoff);
  const visitMap = new Map<string, { count: number; last: number }>();

  for (const entry of recent) {
    const place = detectPlace(entry.latitude, entry.longitude, places);
    if (!place) continue;
    const existing = visitMap.get(place.id);
    if (existing) {
      existing.count++;
      if (entry.timestamp > existing.last) existing.last = entry.timestamp;
    } else {
      visitMap.set(place.id, { count: 1, last: entry.timestamp });
    }
  }

  return places
    .filter(p => visitMap.has(p.id))
    .map(p => {
      const data = visitMap.get(p.id)!;
      return { place: p, visits: data.count, lastVisit: data.last };
    })
    .sort((a, b) => b.visits - a.visits);
}

export const DEFAULT_PLACE_ICONS = ['🏠', '🏢', '☕', '🏋️', '🏫', '🛒', '🏥', '⛪', '🌳', '🍕'];
