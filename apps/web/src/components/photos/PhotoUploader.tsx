/**
 * PhotoUploader - Drag-and-drop photo upload with metadata extraction.
 */
import { useState, useCallback, useRef } from 'react';
import { Upload, ImagePlus, Loader2 } from 'lucide-react';
import { usePhotoStore } from '@/store/photo-store';
import { extractPhotoMetadata, isSupportedImage } from '@/lib/photoManager';
import { cn } from '@/lib/utils';

export function PhotoUploader() {
  const { addPhotos } = usePhotoStore();
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [lastCount, setLastCount] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(async (files: File[]) => {
    const imageFiles = files.filter(isSupportedImage);
    if (imageFiles.length === 0) return;

    setUploading(true);
    try {
      const entries = await Promise.all(
        imageFiles.map(async (file) => {
          const meta = await extractPhotoMetadata(file);
          return {
            filename: meta.filename ?? file.name,
            mimeType: meta.mimeType ?? file.type,
            size: meta.size ?? file.size,
            width: meta.width,
            height: meta.height,
            thumbnailUrl: meta.thumbnailUrl ?? '',
            fullUrl: meta.fullUrl ?? '',
            dateTaken: meta.dateTaken ?? Date.now(),
            tags: [] as string[],
          };
        })
      );
      const count = addPhotos(entries);
      setLastCount(count);
    } finally {
      setUploading(false);
    }
  }, [addPhotos]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) processFiles(files);
  }, [processFiles]);

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-xl p-6 text-center transition-colors",
          dragOver
            ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
            : "border-gray-300 dark:border-gray-600 hover:border-indigo-400"
        )}
      >
        {uploading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Processing photos...</span>
          </div>
        ) : (
          <>
            <ImagePlus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Drop photos here or click to browse
            </p>
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 cursor-pointer">
              <Upload className="w-4 h-4" />
              Choose Photos
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  if (files.length > 0) processFiles(files);
                  if (fileRef.current) fileRef.current.value = '';
                }}
              />
            </label>
          </>
        )}
      </div>
      {lastCount > 0 && !uploading && (
        <p className="text-xs text-green-600 dark:text-green-400 text-center">
          {lastCount} photo{lastCount !== 1 ? 's' : ''} added
        </p>
      )}
    </div>
  );
}
