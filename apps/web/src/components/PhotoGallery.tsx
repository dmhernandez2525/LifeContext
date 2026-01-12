/**
 * PhotoGallery - Grid display of photos with add/remove functionality
 */
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Image as ImageIcon, 
  X, 
  Loader2,
  Maximize2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CapturedPhoto } from '@/hooks/usePhotoCapture';
import { useState } from 'react';

interface PhotoGalleryProps {
  photos: CapturedPhoto[];
  onRemove: (id: string) => void;
  onAddFromCamera: () => void;
  onAddFromGallery: () => void;
  isCapturing?: boolean;
  maxPhotos?: number;
  className?: string;
  compact?: boolean;
}

export default function PhotoGallery({
  photos,
  onRemove,
  onAddFromCamera,
  onAddFromGallery,
  isCapturing = false,
  maxPhotos = 10,
  className,
  compact = false,
}: PhotoGalleryProps) {
  const [lightboxPhoto, setLightboxPhoto] = useState<CapturedPhoto | null>(null);
  const canAddMore = photos.length < maxPhotos;

  return (
    <>
      <div className={cn("space-y-2", className)}>
        {/* Photo grid */}
        <div className={cn(
          "grid gap-2",
          compact ? "grid-cols-4" : "grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        )}>
          {/* Existing photos */}
          <AnimatePresence mode="popLayout">
            {photos.map((photo) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                layout
                className="relative aspect-square group"
              >
                <img
                  src={photo.url}
                  alt={photo.filename || 'Photo'}
                  className="w-full h-full object-cover rounded-lg"
                />
                
                {/* Overlay controls */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                  <button
                    onClick={() => setLightboxPhoto(photo)}
                    className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                    title="View full size"
                  >
                    <Maximize2 className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={() => onRemove(photo.id)}
                    className="p-1.5 bg-red-500/80 hover:bg-red-500 rounded-lg transition-colors"
                    title="Remove photo"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add photo buttons */}
          {canAddMore && (
            <motion.div
              layout
              className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
            >
              {isCapturing ? (
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              ) : (
                <div className="flex flex-col items-center space-y-1">
                  <div className="flex space-x-1">
                    <button
                      onClick={onAddFromCamera}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="Take photo"
                    >
                      <Camera className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                    <button
                      onClick={onAddFromGallery}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="Choose from gallery"
                    >
                      <ImageIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                  <span className="text-xs text-gray-400">
                    {photos.length}/{maxPhotos}
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Empty state */}
        {photos.length === 0 && !canAddMore && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            No photos added
          </p>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightboxPhoto(null)}
          >
            <button
              onClick={() => setLightboxPhoto(null)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={lightboxPhoto.url}
              alt={lightboxPhoto.filename || 'Photo'}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
