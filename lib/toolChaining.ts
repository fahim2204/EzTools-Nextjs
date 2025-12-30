// Tool Chaining Utility
// Enables passing processed images between tools using sessionStorage

const STORAGE_KEY = 'imagepix_tool_chain';

export interface ToolChainData {
  blob: string; // base64 encoded blob
  fileName: string;
  mimeType: string;
  size: number;
  sourceTool: string;
}

/**
 * Convert blob to base64 string for storage
 */
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Convert base64 string back to blob
 */
async function base64ToBlob(base64: string, mimeType: string): Promise<Blob> {
  const response = await fetch(base64);
  return response.blob();
}

/**
 * Store processed image for tool chaining
 */
export async function storeImageForChaining(
  blob: Blob,
  fileName: string,
  sourceTool: string
): Promise<void> {
  try {
    const base64 = await blobToBase64(blob);
    const data: ToolChainData = {
      blob: base64,
      fileName,
      mimeType: blob.type,
      size: blob.size,
      sourceTool,
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to store image for chaining:', error);
    throw error;
  }
}

/**
 * Retrieve stored image and convert to File object
 */
export async function retrieveChainedImage(): Promise<File | null> {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const data: ToolChainData = JSON.parse(stored);
    const blob = await base64ToBlob(data.blob, data.mimeType);
    
    // Convert blob to File
    const file = new File([blob], data.fileName, { type: data.mimeType });
    
    // Clear storage after retrieval
    sessionStorage.removeItem(STORAGE_KEY);
    
    return file;
  } catch (error) {
    console.error('Failed to retrieve chained image:', error);
    sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

/**
 * Check if there's a chained image available
 */
export function hasChainedImage(): boolean {
  return sessionStorage.getItem(STORAGE_KEY) !== null;
}

/**
 * Clear stored chained image
 */
export function clearChainedImage(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}
