/**
 * PlaceManager - Add, edit, and view saved places.
 */
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useLocationStore } from '@/store/location-store';
import { DEFAULT_PLACE_ICONS, formatCoords } from '@/lib/locationContext';
import { cn } from '@/lib/utils';

export function PlaceManager() {
  const { places, lastLocation, addPlace, removePlace } = useLocationStore();
  const [adding, setAdding] = useState(false);
  const [label, setLabel] = useState('');
  const [icon, setIcon] = useState('🏠');
  const [radius, setRadius] = useState(200);

  const handleAdd = () => {
    if (!label.trim() || !lastLocation) return;
    addPlace({
      label: label.trim(),
      latitude: lastLocation.lat,
      longitude: lastLocation.lon,
      radius,
      icon,
    });
    setLabel('');
    setIcon('🏠');
    setRadius(200);
    setAdding(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-900 dark:text-white">Saved Places</p>
        <button
          onClick={() => setAdding(!adding)}
          className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          <Plus className="w-3 h-3" /> Add place
        </button>
      </div>

      {adding && (
        <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-2">
          {!lastLocation && (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              Enable location tracking first to save your current position as a place.
            </p>
          )}
          {lastLocation && (
            <>
              <p className="text-xs text-gray-500">
                Using current location: {formatCoords(lastLocation.lat, lastLocation.lon)}
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="Place name"
                  className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                />
                <select
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs"
                >
                  <option value={100}>100m</option>
                  <option value={200}>200m</option>
                  <option value={500}>500m</option>
                  <option value={1000}>1km</option>
                </select>
              </div>
              <div className="flex items-center gap-1">
                {DEFAULT_PLACE_ICONS.map(i => (
                  <button
                    key={i}
                    onClick={() => setIcon(i)}
                    className={cn(
                      "w-8 h-8 rounded text-lg flex items-center justify-center",
                      icon === i ? "bg-indigo-100 dark:bg-indigo-900/40 ring-2 ring-indigo-500" : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    )}
                  >
                    {i}
                  </button>
                ))}
              </div>
              <button
                onClick={handleAdd}
                disabled={!label.trim()}
                className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Save Place
              </button>
            </>
          )}
        </div>
      )}

      {places.length === 0 && !adding && (
        <p className="text-xs text-gray-400 py-4 text-center">No saved places yet</p>
      )}

      <div className="space-y-1.5">
        {places.map(place => (
          <div key={place.id} className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <span className="text-lg">{place.icon}</span>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{place.label}</p>
                <p className="text-xs text-gray-500">
                  {place.visitCount} visits
                  {place.lastVisit && ` · Last ${new Date(place.lastVisit).toLocaleDateString()}`}
                </p>
              </div>
            </div>
            <button onClick={() => removePlace(place.id)} className="text-gray-400 hover:text-red-500">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
