/**
 * Photo management utilities for timeline integration.
 * Handles photo metadata extraction and gallery organization.
 */

export interface PhotoEntry {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  thumbnailUrl: string;
  fullUrl: string;
  dateTaken: number;
  location?: { lat: number; lon: number };
  caption?: string;
  tags: string[];
  journalEntryId?: string;
}

export interface PhotoGroup {
  date: string;
  label: string;
  photos: PhotoEntry[];
}

/**
 * Extract basic metadata from an image file using the browser.
 */
export async function extractPhotoMetadata(
  file: File
): Promise<Partial<PhotoEntry>> {
  const url = URL.createObjectURL(file);

  const dimensions = await new Promise<{ width: number; height: number }>((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: 0, height: 0 });
    img.src = url;
  });

  const dateTaken = file.lastModified || Date.now();

  return {
    filename: file.name,
    mimeType: file.type,
    size: file.size,
    width: dimensions.width || undefined,
    height: dimensions.height || undefined,
    thumbnailUrl: url,
    fullUrl: url,
    dateTaken,
  };
}

/**
 * Group photos by date (YYYY-MM-DD).
 */
export function groupPhotosByDate(photos: PhotoEntry[]): PhotoGroup[] {
  const grouped = new Map<string, PhotoEntry[]>();

  for (const photo of photos) {
    const date = new Date(photo.dateTaken).toISOString().slice(0, 10);
    const existing = grouped.get(date);
    if (existing) {
      existing.push(photo);
    } else {
      grouped.set(date, [photo]);
    }
  }

  return Array.from(grouped.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, photos]) => ({
      date,
      label: formatPhotoDate(date),
      photos: photos.sort((a, b) => b.dateTaken - a.dateTaken),
    }));
}

function formatPhotoDate(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  if (dateStr === today) return 'Today';
  if (dateStr === yesterday) return 'Yesterday';
  return date.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

/**
 * Format file size for display.
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Check if a file is a supported image type.
 */
export function isSupportedImage(file: File): boolean {
  return file.type.startsWith('image/') && !file.type.includes('svg');
}

/**
 * Get photo count by month for a timeline view.
 */
export function getMonthlyPhotoCounts(
  photos: PhotoEntry[]
): Array<{ month: string; count: number }> {
  const counts = new Map<string, number>();

  for (const photo of photos) {
    const month = new Date(photo.dateTaken).toISOString().slice(0, 7);
    counts.set(month, (counts.get(month) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([month, count]) => ({ month, count }));
}
