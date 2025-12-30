import { removeBackground as imglyRemoveBackground, Config } from "@imgly/background-removal";

export interface RemoveBackgroundOptions {
  intensity?: number; // 0-100, maps to alpha threshold
  onProgress?: (step: string) => void;
}

/**
 * Removes the background from an image file using @imgly/background-removal
 */
export async function removeBackground(
  file: File | string,
  options: RemoveBackgroundOptions = {}
): Promise<Blob> {
  const { intensity = 50, onProgress } = options;

  const config: Config = {
    progress: (key, current, total) => {
      if (onProgress) {
        const percentage = Math.round((current / total) * 100);
        onProgress(`${key}: ${percentage}%`);
      }
    },
    output: {
      format: "image/png",
      quality: 0.8,
    }
  };

  try {
    const resultBlob = await imglyRemoveBackground(file, config);
    
    // If intensity is 50 (default), return as is.
    // Otherwise, apply thresholding to the alpha channel.
    if (intensity === 50) {
      return resultBlob;
    }

    return await applyAlphaThreshold(resultBlob, intensity);
  } catch (error) {
    console.error("Background removal failed:", error);
    throw error;
  }
}

/**
 * Applies a threshold to the alpha channel of an image blob
 * intensity 0-100 (50 is neutral, >50 makes cutout tighter, <50 makes it looser)
 */
async function applyAlphaThreshold(blob: Blob, intensity: number): Promise<Blob> {
  const img = new Image();
  const url = URL.createObjectURL(blob);
  
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = url;
  });

  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  
  if (!ctx) throw new Error("Could not get canvas context");
  
  ctx.drawImage(img, 0, 0);
  URL.revokeObjectURL(url);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // threshold from 0 to 255
  // intensity 50 -> threshold ~128
  // intensity 100 -> threshold 255 (nothing is transparent unless fully transparent?) 
  // Wait, if threshold is higher, we kill more pixels.
  // Let's say threshold = (intensity / 100) * 255
  const threshold = (intensity / 100) * 255;

  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];
    if (alpha < threshold) {
      data[i + 3] = 0;
    } else {
      // Optional: make it fully opaque if it's above threshold? 
      // Probably better to keep some softness but sharpen it.
      // For simplicity, let's just threshold.
      data[i + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  
  return new Promise((resolve) => {
    canvas.toBlob((result) => resolve(result!), "image/png");
  });
}
