/**
 * usePhotoCapture - Hook for capturing and managing photos
 */
import { useState, useCallback, useRef } from 'react';

// ============================================================
// TYPES
// ============================================================

export interface CapturedPhoto {
  id: string;
  blob: Blob;
  url: string;
  width: number;
  height: number;
  timestamp: Date;
  filename?: string;
}

export interface PhotoCaptureOptions {
  maxPhotos?: number;
  maxSizeMB?: number;
  quality?: number; // 0-1 for compression
}

export interface UsePhotoCaptureReturn {
  photos: CapturedPhoto[];
  isCapturing: boolean;
  error: Error | null;
  
  // Actions
  captureFromCamera: () => Promise<CapturedPhoto | null>;
  selectFromGallery: () => Promise<CapturedPhoto[]>;
  removePhoto: (id: string) => void;
  clearPhotos: () => void;
  
  // Refs
  inputRef: React.RefObject<HTMLInputElement>;
}

// ============================================================
// UTILITIES
// ============================================================

async function compressImage(
  blob: Blob, 
  quality: number, 
  maxWidth: number = 1920
): Promise<{ blob: Blob; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      
      let { width, height } = img;
      
      // Scale down if too large
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (compressedBlob) => {
          if (compressedBlob) {
            resolve({ blob: compressedBlob, width, height });
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        'image/jpeg',
        quality
      );
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
}

// ============================================================
// HOOK IMPLEMENTATION
// ============================================================

export function usePhotoCapture(options: PhotoCaptureOptions = {}): UsePhotoCaptureReturn {
  const { maxPhotos = 10, maxSizeMB = 5, quality = 0.8 } = options;
  
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Process a file into a CapturedPhoto
  const processFile = useCallback(async (file: File): Promise<CapturedPhoto | null> => {
    try {
      // Check file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        // Compress if too large
        const compressed = await compressImage(file, quality);
        
        return {
          id: crypto.randomUUID(),
          blob: compressed.blob,
          url: URL.createObjectURL(compressed.blob),
          width: compressed.width,
          height: compressed.height,
          timestamp: new Date(),
          filename: file.name,
        };
      }
      
      // Get dimensions
      const { width, height } = await new Promise<{ width: number; height: number }>(
        (resolve, reject) => {
          const img = new Image();
          const url = URL.createObjectURL(file);
          
          img.onload = () => {
            URL.revokeObjectURL(url);
            resolve({ width: img.width, height: img.height });
          };
          img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image'));
          };
          img.src = url;
        }
      );
      
      return {
        id: crypto.randomUUID(),
        blob: file,
        url: URL.createObjectURL(file),
        width,
        height,
        timestamp: new Date(),
        filename: file.name,
      };
    } catch (err) {
      console.error('Error processing photo:', err);
      setError(err instanceof Error ? err : new Error('Failed to process photo'));
      return null;
    }
  }, [maxSizeMB, quality]);

  // Capture from camera
  const captureFromCamera = useCallback(async (): Promise<CapturedPhoto | null> => {
    if (photos.length >= maxPhotos) {
      setError(new Error(`Maximum ${maxPhotos} photos allowed`));
      return null;
    }
    
    setIsCapturing(true);
    setError(null);
    
    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      // Create video element to capture frame
      const video = document.createElement('video');
      video.srcObject = stream;
      video.autoplay = true;
      
      await new Promise((resolve) => {
        video.onloadedmetadata = resolve;
      });
      
      await video.play();
      
      // Capture frame to canvas
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      
      ctx.drawImage(video, 0, 0);
      
      // Stop camera
      stream.getTracks().forEach(track => track.stop());
      
      // Convert to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => b ? resolve(b) : reject(new Error('Failed to capture')),
          'image/jpeg',
          quality
        );
      });
      
      const photo: CapturedPhoto = {
        id: crypto.randomUUID(),
        blob,
        url: URL.createObjectURL(blob),
        width: canvas.width,
        height: canvas.height,
        timestamp: new Date(),
      };
      
      setPhotos(prev => [...prev, photo]);
      return photo;
    } catch (err) {
      console.error('Camera capture error:', err);
      setError(err instanceof Error ? err : new Error('Camera access denied'));
      return null;
    } finally {
      setIsCapturing(false);
    }
  }, [photos.length, maxPhotos, quality]);

  // Select from gallery
  const selectFromGallery = useCallback(async (): Promise<CapturedPhoto[]> => {
    return new Promise((resolve) => {
      if (!inputRef.current) {
        resolve([]);
        return;
      }
      
      const input = inputRef.current;
      
      const handleChange = async () => {
        const files = Array.from(input.files || []);
        const available = maxPhotos - photos.length;
        const toProcess = files.slice(0, available);
        
        setIsCapturing(true);
        setError(null);
        
        try {
          const processed = await Promise.all(
            toProcess.map(file => processFile(file))
          );
          
          const valid = processed.filter((p): p is CapturedPhoto => p !== null);
          setPhotos(prev => [...prev, ...valid]);
          resolve(valid);
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Failed to process photos'));
          resolve([]);
        } finally {
          setIsCapturing(false);
          input.value = '';
        }
        
        input.removeEventListener('change', handleChange);
      };
      
      input.addEventListener('change', handleChange);
      input.click();
    });
  }, [photos.length, maxPhotos, processFile]);

  // Remove a photo
  const removePhoto = useCallback((id: string) => {
    setPhotos(prev => {
      const photo = prev.find(p => p.id === id);
      if (photo) {
        URL.revokeObjectURL(photo.url);
      }
      return prev.filter(p => p.id !== id);
    });
  }, []);

  // Clear all photos
  const clearPhotos = useCallback(() => {
    photos.forEach(photo => URL.revokeObjectURL(photo.url));
    setPhotos([]);
  }, [photos]);

  return {
    photos,
    isCapturing,
    error,
    captureFromCamera,
    selectFromGallery,
    removePhoto,
    clearPhotos,
    inputRef,
  };
}

export default usePhotoCapture;
