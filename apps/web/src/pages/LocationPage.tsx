/**
 * LocationPage - Location context with tracking and saved places.
 */
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Info } from 'lucide-react';
import { LocationTracker, PlaceManager } from '@/components/location';
import { useLocationStore } from '@/store/location-store';
import { getVisitSummary } from '@/lib/locationContext';

export default function LocationPage() {
  const { entries, places } = useLocationStore();

  const recentVisits = useMemo(
    () => getVisitSummary(entries, places, 30),
    [entries, places]
  );

  const totalEntries = entries.length;
  const uniqueDays = useMemo(() => {
    const days = new Set(entries.map(e => new Date(e.timestamp).toISOString().slice(0, 10)));
    return days.size;
  }, [entries]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto px-4 py-6 space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl">
          <MapPin className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Location Context</h1>
          <p className="text-sm text-gray-500">Track places and add location context to entries</p>
        </div>
      </div>

      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-start gap-2">
        <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-blue-700 dark:text-blue-300">
          Location data is stored locally on your device and never sent to any server.
          You can disable tracking at any time.
        </p>
      </div>

      {/* Stats bar */}
      <div className="flex gap-4">
        <div className="flex-1 p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 text-center">
          <p className="text-lg font-bold text-gray-900 dark:text-white">{totalEntries}</p>
          <p className="text-xs text-gray-500">Location points</p>
        </div>
        <div className="flex-1 p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 text-center">
          <p className="text-lg font-bold text-gray-900 dark:text-white">{uniqueDays}</p>
          <p className="text-xs text-gray-500">Days tracked</p>
        </div>
        <div className="flex-1 p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 text-center">
          <p className="text-lg font-bold text-gray-900 dark:text-white">{places.length}</p>
          <p className="text-xs text-gray-500">Saved places</p>
        </div>
      </div>

      <LocationTracker />

      {/* Recent visits */}
      {recentVisits.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-900 dark:text-white">Recent visits (30 days)</p>
          <div className="space-y-1.5">
            {recentVisits.map(({ place, visits, lastVisit }) => (
              <div key={place.id} className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{place.icon}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{place.label}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{visits} visits</p>
                  <p className="text-xs text-gray-500">
                    Last {new Date(lastVisit).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <PlaceManager />
    </motion.div>
  );
}
