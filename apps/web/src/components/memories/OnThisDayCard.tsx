/**
 * OnThisDayCard - Displays a single memory from a past year.
 */
import { BookOpen, Camera, Heart } from 'lucide-react';
import type { MemoryEntry } from '@/lib/onThisDay';

interface OnThisDayCardProps {
  memory: MemoryEntry;
}

const TYPE_CONFIG = {
  journal: { icon: BookOpen, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/40' },
  photo: { icon: Camera, color: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-100 dark:bg-pink-900/40' },
  health: { icon: Heart, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/40' },
};

export function OnThisDayCard({ memory }: OnThisDayCardProps) {
  const config = TYPE_CONFIG[memory.type];
  const Icon = config.icon;

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${config.bg} flex-shrink-0`}>
          <Icon className={`w-4 h-4 ${config.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-500">
              {memory.yearsAgo} year{memory.yearsAgo !== 1 ? 's' : ''} ago
            </span>
            <span className="text-xs text-gray-400">{memory.year}</span>
          </div>

          {memory.type === 'photo' && memory.photoUrl && (
            <img
              src={memory.photoUrl}
              alt={memory.preview}
              className="w-full h-32 object-cover rounded-lg mb-2"
            />
          )}

          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
            {memory.preview}
          </p>

          {memory.mood && (
            <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
              Mood: {memory.mood}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
