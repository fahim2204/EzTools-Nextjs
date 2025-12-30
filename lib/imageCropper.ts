// Image Cropper Utility Functions
// Handles client-side image cropping using canvas

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CroppedImageResult {
  blob: Blob;
  url: string;
  width: number;
  height: number;
}

/**
 * Create a cropped image from the source image and crop area
 * Works with react-image-crop's pixel crop format
 * Optionally scale the output to different dimensions
 */
export async function createCroppedImage(
  image: HTMLImageElement,
  crop: CropArea,
  outputWidth?: number,
  outputHeight?: number
): Promise<CroppedImageResult> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  // Use output dimensions if provided, otherwise use crop dimensions
  const finalWidth = outputWidth || crop.width;
  const finalHeight = outputHeight || crop.height;

  // Set canvas size to the output dimensions
  canvas.width = finalWidth;
  canvas.height = finalHeight;

  // Draw the cropped portion of the image, scaled to output size
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    finalWidth,
    finalHeight
  );

  // Convert canvas to blob
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Failed to create blob from canvas'));
        return;
      }

      const url = URL.createObjectURL(blob);
      resolve({
        blob,
        url,
        width: finalWidth,
        height: finalHeight,
      });
    }, 'image/png');
  });
}

/**
 * Aspect ratio presets
 */
export const ASPECT_RATIOS = [
  { label: 'Free', value: undefined },
  { label: '1:1 (Square)', value: 1 / 1 },
  { label: '16:9 (Landscape)', value: 16 / 9 },
  { label: '9:16 (Portrait)', value: 9 / 16 },
  { label: '4:3', value: 4 / 3 },
  { label: '3:2', value: 3 / 2 },
  { label: '2:3', value: 2 / 3 },
];
