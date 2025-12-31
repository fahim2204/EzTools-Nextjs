// Image Resizer Utility Functions
// Handles client-side image resizing with multiple modes

export type ResizeMode = 'stretch' | 'fit' | 'fill' | 'pad';

export interface ResizeOptions {
  width: number;
  height: number;
  mode: ResizeMode;
  backgroundColor?: string;
  format: string;
  quality: number;
}

export interface ResizeResult {
  blob: Blob;
  url: string;
  size: number;
  format: string;
  width: number;
  height: number;
}

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
 * Calculate dimensions based on resize mode and aspect ratio
 */
export function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  targetWidth: number,
  targetHeight: number,
  mode: ResizeMode
): { width: number; height: number; offsetX: number; offsetY: number; scale: number } {
  const aspectRatio = originalWidth / originalHeight;

  switch (mode) {
    case 'stretch':
      // Stretch to exact dimensions (may distort)
      return {
        width: targetWidth,
        height: targetHeight,
        offsetX: 0,
        offsetY: 0,
        scale: 1,
      };

    case 'fit':
      // Fit within bounds (maintain aspect ratio, may be smaller)
      const fitScale = Math.min(targetWidth / originalWidth, targetHeight / originalHeight);
      return {
        width: Math.round(originalWidth * fitScale),
        height: Math.round(originalHeight * fitScale),
        offsetX: 0,
        offsetY: 0,
        scale: fitScale,
      };

    case 'fill':
      // Fill entire area (maintain aspect ratio, may crop)
      const fillScale = Math.max(targetWidth / originalWidth, targetHeight / originalHeight);
      const scaledWidth = originalWidth * fillScale;
      const scaledHeight = originalHeight * fillScale;
      return {
        width: targetWidth,
        height: targetHeight,
        offsetX: Math.round((targetWidth - scaledWidth) / 2),
        offsetY: Math.round((targetHeight - scaledHeight) / 2),
        scale: fillScale,
      };

    case 'pad':
      // Fit within bounds and pad with background
      const padScale = Math.min(targetWidth / originalWidth, targetHeight / originalHeight);
      const paddedWidth = Math.round(originalWidth * padScale);
      const paddedHeight = Math.round(originalHeight * padScale);
      return {
        width: paddedWidth,
        height: paddedHeight,
        offsetX: Math.round((targetWidth - paddedWidth) / 2),
        offsetY: Math.round((targetHeight - paddedHeight) / 2),
        scale: padScale,
      };

    default:
      return {
        width: targetWidth,
        height: targetHeight,
        offsetX: 0,
        offsetY: 0,
        scale: 1,
      };
  }
}

/**
 * Apply resize mode to canvas
 */
export function applyResizeMode(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  targetWidth: number,
  targetHeight: number,
  mode: ResizeMode,
  backgroundColor: string = '#FFFFFF'
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  const dims = calculateDimensions(
    image.width,
    image.height,
    targetWidth,
    targetHeight,
    mode
  );

  // Set canvas size based on mode
  if (mode === 'pad') {
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    
    // Fill background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, targetWidth, targetHeight);
    
    // Draw image centered
    ctx.drawImage(image, dims.offsetX, dims.offsetY, dims.width, dims.height);
  } else if (mode === 'fill') {
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    
    // Draw scaled image (will be cropped by canvas bounds)
    const scaledWidth = image.width * dims.scale;
    const scaledHeight = image.height * dims.scale;
    ctx.drawImage(image, dims.offsetX, dims.offsetY, scaledWidth, scaledHeight);
  } else {
    // stretch or fit
    canvas.width = dims.width;
    canvas.height = dims.height;
    ctx.drawImage(image, 0, 0, dims.width, dims.height);
  }
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
 * Main resize function
 */
export async function resizeImage(
  file: File,
  options: ResizeOptions
): Promise<ResizeResult> {
  try {
    // Load image
    const image = await loadImage(file);

    // Create canvas
    const canvas = document.createElement('canvas');

    // Apply resize mode
    applyResizeMode(
      canvas,
      image,
      options.width,
      options.height,
      options.mode,
      options.backgroundColor
    );

    // Convert to blob
    const blob = await canvasToBlob(canvas, options.format, options.quality);

    // Create object URL
    const url = URL.createObjectURL(blob);

    return {
      blob,
      url,
      size: blob.size,
      format: options.format,
      width: canvas.width,
      height: canvas.height,
    };
  } catch (error) {
    throw new Error(`Resize failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Calculate new dimensions maintaining aspect ratio
 */
export function maintainAspectRatio(
  originalWidth: number,
  originalHeight: number,
  newWidth?: number,
  newHeight?: number
): { width: number; height: number } {
  const aspectRatio = originalWidth / originalHeight;

  if (newWidth && !newHeight) {
    return {
      width: newWidth,
      height: Math.round(newWidth / aspectRatio),
    };
  } else if (newHeight && !newWidth) {
    return {
      width: Math.round(newHeight * aspectRatio),
      height: newHeight,
    };
  } else if (newWidth && newHeight) {
    return { width: newWidth, height: newHeight };
  }

  return { width: originalWidth, height: originalHeight };
}

/**
 * Validate dimensions
 */
export function validateDimensions(width: number, height: number): {
  valid: boolean;
  error?: string;
} {
  const MIN_DIMENSION = 1;
  const MAX_DIMENSION = 10000;

  if (width < MIN_DIMENSION || height < MIN_DIMENSION) {
    return {
      valid: false,
      error: `Dimensions must be at least ${MIN_DIMENSION}x${MIN_DIMENSION}px`,
    };
  }

  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    return {
      valid: false,
      error: `Dimensions must not exceed ${MAX_DIMENSION}x${MAX_DIMENSION}px`,
    };
  }

  return { valid: true };
}
