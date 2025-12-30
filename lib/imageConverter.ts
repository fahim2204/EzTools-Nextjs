// Image Converter Utility Functions
// Handles client-side image format conversion with quality control
import UPNG from 'upng-js';

export interface ConversionOptions {
  format: string;
  quality: number; // 0-100
  maxWidth?: number;
  maxHeight?: number;
}

export interface ConversionResult {
  blob: Blob;
  url: string;
  size: number;
  format: string;
}

// Supported image formats
export const SUPPORTED_INPUT_FORMATS = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
  'image/bmp',
  'image/tiff',
  'image/x-icon',
  'image/svg+xml'
];

export const OUTPUT_FORMATS = [
  { value: 'image/png', label: 'PNG', extension: 'png', description: 'Lossless, best for graphics' },
  { value: 'image/jpeg', label: 'JPG', extension: 'jpg', description: 'Lossy, best for photos' },
  { value: 'image/webp', label: 'WebP', extension: 'webp', description: 'Modern, smaller files' },
  { value: 'image/gif', label: 'GIF', extension: 'gif', description: 'Limited colors, animations' },
  { value: 'image/bmp', label: 'BMP', extension: 'bmp', description: 'Uncompressed bitmap' },
  { value: 'image/x-icon', label: 'ICO', extension: 'ico', description: 'Favicon format' },
];

// Formats that support quality adjustment
export const QUALITY_SUPPORTED_FORMATS = ['image/jpeg', 'image/webp', 'image/png'];

/**
 * Load an image file into an HTMLImageElement
 */
export function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
}

/**
 * Draw image on canvas with optional resizing
 */
export function imageToCanvas(
  image: HTMLImageElement,
  maxWidth?: number,
  maxHeight?: number
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  let width = image.width;
  let height = image.height;

  // Calculate new dimensions if max constraints are provided
  if (maxWidth && width > maxWidth) {
    height = (height * maxWidth) / width;
    width = maxWidth;
  }
  if (maxHeight && height > maxHeight) {
    width = (width * maxHeight) / height;
    height = maxHeight;
  }

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  ctx.drawImage(image, 0, 0, width, height);
  return canvas;
}

/**
 * Convert canvas to blob with specified format and quality
 */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // Check if we need to use UPNG for PNG compression
    if (format === 'image/png' && quality < 1.0) {
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const buffer = imageData.data.buffer;

      // Map quality (0-1) to colors (2-256)
      // Quality 1.0 = lossless (handled by default toBlob)
      // Quality 0.9 = 256 colors
      // Quality 0.1 = 16 colors
      // Formula: 256 * quality, clamped between 2 and 256
      const colors = Math.max(2, Math.min(256, Math.floor(256 * quality)));

      try {
        // Encode using UPNG with quantization
        const pngBuffer = UPNG.encode([buffer], canvas.width, canvas.height, colors);
        const blob = new Blob([pngBuffer], { type: 'image/png' });
        resolve(blob);
        return;
      } catch (e) {
        console.error('UPNG compression failed, falling back to default', e);
        // Fallthrough to default canvas.toBlob
      }
    }

    // Normalize quality to 0-1 range
    // Ensure we don't pass quality for PNG to standard toBlob as it ignores it
    const imageQuality = format === 'image/png' ? undefined : quality;

    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert canvas to blob'));
        }
      },
      format,
      imageQuality
    );
  });
}

/**
 * Main conversion function
 */
export async function convertImage(
  file: File,
  options: ConversionOptions
): Promise<ConversionResult> {
  try {
    // Load image
    const image = await loadImage(file);

    // Draw on canvas
    const canvas = imageToCanvas(image, options.maxWidth, options.maxHeight);

    // Convert to blob (quality is passed as 0-1 range here from options.quality)
    const blob = await canvasToBlob(canvas, options.format, options.quality);

    // Create object URL
    const url = URL.createObjectURL(blob);

    return {
      blob,
      url,
      size: blob.size,
      format: options.format,
    };
  } catch (error) {
    throw new Error(`Conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Calculate file size reduction percentage
 */
export function calculateReduction(originalSize: number, newSize: number): number {
  if (originalSize === 0) return 0;
  return Math.round(((originalSize - newSize) / originalSize) * 100);
}

/**
 * Validate if file is a supported image format
 */
export function isValidImageFile(file: File): boolean {
  return SUPPORTED_INPUT_FORMATS.includes(file.type);
}

/**
 * Get file extension from format MIME type
 */
export function getExtensionFromFormat(format: string): string {
  const formatObj = OUTPUT_FORMATS.find(f => f.value === format);
  return formatObj?.extension || 'png';
}

/**
 * Check if format supports quality adjustment
 */
export function supportsQuality(format: string): boolean {
  return QUALITY_SUPPORTED_FORMATS.includes(format);
}

/**
 * Get recommended quality for format
 */
export function getRecommendedQuality(format: string): number {
  if (format === 'image/jpeg') return 90;
  if (format === 'image/webp') return 90;
  if (format === 'image/png') return 90; // Default to 230 colors approx
  return 100;
}

/**
 * Batch convert multiple images
 */
export async function batchConvertImages(
  files: File[],
  options: ConversionOptions,
  onProgress?: (current: number, total: number) => void
): Promise<ConversionResult[]> {
  const results: ConversionResult[] = [];

  for (let i = 0; i < files.length; i++) {
    try {
      const result = await convertImage(files[i], options);
      results.push(result);
      onProgress?.(i + 1, files.length);
    } catch (error) {
      console.error(`Failed to convert ${files[i].name}:`, error);
      // Continue with other files even if one fails
    }
  }

  return results;
}

/**
 * Download converted image
 */
export function downloadImage(blob: Blob, filename: string, format: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  
  // Get extension from format
  const extension = getExtensionFromFormat(format);
  
  // Use the provided filename (it might already not have an extension if passed from the UI)
  // But to be safe and consistent with the requirement of "same name+ext", 
  // we'll ensure it doesn't have a double extension if they typed one.
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
  a.download = `${nameWithoutExt}.${extension}`;
  
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
