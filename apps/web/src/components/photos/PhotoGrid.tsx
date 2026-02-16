/**
 * PhotoGrid - Displays photos in a responsive grid grouped by date.
 */
import { useMemo, useState } from 'react';
import { X, Tag, Calendar } from 'lucide-react';
import { usePhotoStore } from '@/store/photo-store';
import { groupPhotosByDate, formatFileSize, type PhotoEntry } from '@/lib/photoManager';

export function PhotoGrid() {
  const { photos, removePhoto, setCaption } = usePhotoStore();
  const [selected, setSelected] = useState<PhotoEntry | null>(null);
  const [editCaption, setEditCaption] = useState('');

  const groups = useMemo(() => groupPhotosByDate(photos), [photos]);

  const openDetail = (photo: PhotoEntry) => {
    setSelected(photo);
    setEditCaption(photo.caption ?? '');
  };

  const saveCaption = () => {
    if (selected) {
      setCaption(selected.id, editCaption);
      setSelected({ ...selected, caption: editCaption });
    }
  };

  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-gray-400">No photos yet. Upload some to get started.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {groups.map(group => (
          <div key={group.date}>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{group.label}</h3>
              <span className="text-xs text-gray-400">{group.photos.length} photos</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1.5">
              {group.photos.map(photo => (
                <button
                  key={photo.id}
                  onClick={() => openDetail(photo)}
                  className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 hover:opacity-80 transition-opacity"
                >
                  <img
                    src={photo.thumbnailUrl}
                    alt={photo.caption ?? photo.filename}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selected.fullUrl}
                alt={selected.caption ?? selected.filename}
                className="w-full rounded-t-xl"
              />
              <button
                onClick={() => setSelected(null)}
                className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{selected.filename}</p>
                <button
                  onClick={() => { removePhoto(selected.id); setSelected(null); }}
                  className="text-xs text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
              <div className="flex gap-4 text-xs text-gray-500">
                {selected.width && selected.height && (
                  <span>{selected.width} x {selected.height}</span>
                )}
                <span>{formatFileSize(selected.size)}</span>
                <span>{new Date(selected.dateTaken).toLocaleString()}</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                  placeholder="Add a caption..."
                  className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                />
                <button
                  onClick={saveCaption}
                  className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Save
                </button>
              </div>
              {selected.tags.length > 0 && (
                <div className="flex items-center gap-1">
                  <Tag className="w-3 h-3 text-gray-400" />
                  {selected.tags.map(tag => (
                    <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
