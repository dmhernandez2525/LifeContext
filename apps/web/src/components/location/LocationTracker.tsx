/**
 * LocationTracker - Current location display with tracking toggle.
 */
import { useCallback, useEffect, useState } from 'react';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { useLocationStore } from '@/store/location-store';
import { detectPlace, formatCoords } from '@/lib/locationContext';
import { cn } from '@/lib/utils';

export function LocationTracker() {
  const {
    trackingEnabled, lastLocation, places,
    setTracking, setLastLocation, addEntry, incrementVisit,
  } = useLocationStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [detectedPlace, setDetectedPlace] = useState<string | null>(null);

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setLastLocation(latitude, longitude);

        addEntry({
          latitude,
          longitude,
          accuracy,
          timestamp: Date.now(),
          source: 'auto',
        });

        const place = detectPlace(latitude, longitude, places);
        if (place) {
          setDetectedPlace(place.label);
          incrementVisit(place.id);
        } else {
          setDetectedPlace(null);
        }

        setLoading(false);
      },
      (err) => {
        const messages: Record<number, string> = {
          1: 'Location permission denied. Please enable in browser settings.',
          2: 'Location unavailable. Check your device settings.',
          3: 'Location request timed out. Please try again.',
        };
        setError(messages[err.code] ?? 'Failed to get location');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [places, setLastLocation, addEntry, incrementVisit]);

  useEffect(() => {
    if (trackingEnabled && !lastLocation) {
      getLocation();
    }
  }, [trackingEnabled, lastLocation, getLocation]);

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">Location Tracking</span>
        </div>
        <button
          onClick={() => {
            const next = !trackingEnabled;
            setTracking(next);
            if (next) getLocation();
          }}
          className={cn(
            "relative w-10 h-5 rounded-full transition-colors",
            trackingEnabled ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-600"
          )}
        >
          <span className={cn(
            "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform",
            trackingEnabled && "translate-x-5"
          )} />
        </button>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {loading && (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Loader2 className="w-3 h-3 animate-spin" /> Getting location...
        </div>
      )}

      {lastLocation && !loading && (
        <div className="space-y-1">
          <p className="text-xs text-gray-500">
            {formatCoords(lastLocation.lat, lastLocation.lon)}
          </p>
          {detectedPlace && (
            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
              {detectedPlace}
            </p>
          )}
          <button
            onClick={getLocation}
            className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline mt-1"
          >
            <Navigation className="w-3 h-3" /> Update location
          </button>
        </div>
      )}

      {!lastLocation && !loading && trackingEnabled && (
        <button
          onClick={getLocation}
          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Get current location
        </button>
      )}
    </div>
  );
}
