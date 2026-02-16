/**
 * PhotosPage - Photo gallery with timeline view and upload.
 */
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import { PhotoGrid, PhotoUploader } from '@/components/photos';
import { usePhotoStore } from '@/store/photo-store';
import { getMonthlyPhotoCounts, formatFileSize } from '@/lib/photoManager';

export default function PhotosPage() {
  const { photos } = usePhotoStore();

  const totalSize = useMemo(
    () => photos.reduce((sum, p) => sum + p.size, 0),
    [photos]
  );

  const monthlyCounts = useMemo(
    () => getMonthlyPhotoCounts(photos),
    [photos]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 py-6 space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-pink-100 dark:bg-pink-900/40 rounded-xl">
          <Camera className="w-6 h-6 text-pink-600 dark:text-pink-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Photos</h1>
          <p className="text-sm text-gray-500">Your photo timeline and gallery</p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4">
        <div className="flex-1 p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 text-center">
          <p className="text-lg font-bold text-gray-900 dark:text-white">{photos.length}</p>
          <p className="text-xs text-gray-500">Photos</p>
        </div>
        <div className="flex-1 p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 text-center">
          <p className="text-lg font-bold text-gray-900 dark:text-white">{formatFileSize(totalSize)}</p>
          <p className="text-xs text-gray-500">Total size</p>
        </div>
        <div className="flex-1 p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 text-center">
          <p className="text-lg font-bold text-gray-900 dark:text-white">{monthlyCounts.length}</p>
          <p className="text-xs text-gray-500">Months</p>
        </div>
      </div>

      {/* Upload */}
      <PhotoUploader />

      {/* Monthly timeline sidebar hint */}
      {monthlyCounts.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {monthlyCounts.slice(0, 12).map(({ month, count }) => (
            <div
              key={month}
              className="flex-shrink-0 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs text-gray-600 dark:text-gray-400"
            >
              {new Date(month + '-01T12:00:00').toLocaleDateString('en', { month: 'short', year: 'numeric' })}
              <span className="ml-1 font-medium text-gray-900 dark:text-white">{count}</span>
            </div>
          ))}
        </div>
      )}

      {/* Gallery */}
      <PhotoGrid />
    </motion.div>
  );
}
