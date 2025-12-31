"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, RefreshCw, Download } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";
import ImageComparison from "@/components/ImageComparison";
import DimensionInput from "@/components/DimensionInput";
import ResizeModeSelector from "@/components/ResizeModeSelector";
import QualitySlider from "@/components/QualitySlider";
import { 
  resizeImage, 
  ResizeMode, 
  ResizeResult, 
  maintainAspectRatio,
  validateDimensions 
} from "@/lib/imageResizer";
import { downloadImage, getExtensionFromFormat, supportsQuality } from "@/lib/imageConverter";
import { retrieveChainedImage, hasChainedImage } from "@/lib/toolChaining";

export default function ResizeImagePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // File State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  
  // Resize State
  const [resizedResult, setResizedResult] = useState<ResizeResult | null>(null);
  const [targetWidth, setTargetWidth] = useState(800);
  const [targetHeight, setTargetHeight] = useState(600);
  const [aspectRatioLocked, setAspectRatioLocked] = useState(true);
  const [resizeMode, setResizeMode] = useState<ResizeMode>('fit');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [format, setFormat] = useState("image/png");
  const [quality, setQuality] = useState(9);
  const [isResizing, setIsResizing] = useState(false);
  const [error, setError] = useState<string>("");
  const [customFileName, setCustomFileName] = useState<string>("");

  // Check for chained image on mount
  useEffect(() => {
    const loadChainedImage = async () => {
      const from = searchParams.get('from');
      if (from && hasChainedImage()) {
        try {
          const chainedFile = await retrieveChainedImage();
          if (chainedFile) {
            handleFileSelected(chainedFile);
          }
        } catch (error) {
          console.error('Failed to load chained image:', error);
          setError('Failed to load image from previous tool');
        }
      }
    };
    loadChainedImage();
  }, [searchParams]);

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      handleFileSelected(files[0]);
    }
  };

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    setOriginalSize(file.size);
    setCustomFileName(file.name.replace(/\.[^/.]+$/, '') + '-resized');
    
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        setOriginalUrl(reader.result as string);
        setOriginalWidth(img.width);
        setOriginalHeight(img.height);
        
        // Set initial target dimensions to original
        setTargetWidth(img.width);
        setTargetHeight(img.height);
        
        // Auto-resize on load
        performResize(file, img.width, img.height, resizeMode, backgroundColor, format, quality);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const performResize = async (
    file: File,
    width: number,
    height: number,
    mode: ResizeMode,
    bgColor: string,
    fmt: string,
    q: number
  ) => {
    setIsResizing(true);
    setError("");
    
    try {
      // Validate dimensions
      const validation = validateDimensions(width, height);
      if (!validation.valid) {
        setError(validation.error || "Invalid dimensions");
        setIsResizing(false);
        return;
      }

      // Map quality slider to actual quality value
      const internalQuality = q / 10;
      
      const result = await resizeImage(file, {
        width,
        height,
        mode,
        backgroundColor: bgColor,
        format: fmt,
        quality: internalQuality,
      });
      
      setResizedResult(result);
    } catch (err) {
      setError("Resize failed. Please try a different image or settings.");
      console.error(err);
    } finally {
      setIsResizing(false);
    }
  };

  // Resize when settings change
  useEffect(() => {
    if (selectedFile) {
      performResize(
        selectedFile,
        targetWidth,
        targetHeight,
        resizeMode,
        backgroundColor,
        format,
        quality
      );
    }
  }, [targetWidth, targetHeight, resizeMode, backgroundColor, format, quality]);

  const handleWidthChange = (newWidth: number) => {
    setTargetWidth(newWidth);
    if (aspectRatioLocked && originalWidth && originalHeight) {
      const dims = maintainAspectRatio(originalWidth, originalHeight, newWidth, undefined);
      setTargetHeight(dims.height);
    }
  };

  const handleHeightChange = (newHeight: number) => {
    setTargetHeight(newHeight);
    if (aspectRatioLocked && originalWidth && originalHeight) {
      const dims = maintainAspectRatio(originalWidth, originalHeight, undefined, newHeight);
      setTargetWidth(dims.width);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setOriginalUrl(null);
    setResizedResult(null);
    setTargetWidth(800);
    setTargetHeight(600);
    setAspectRatioLocked(true);
    setResizeMode('fit');
    setBackgroundColor('#FFFFFF');
    setFormat("image/png");
    setQuality(9);
    setCustomFileName("");
    setError("");
  };

  const handleDownload = () => {
    if (resizedResult && customFileName) {
      downloadImage(resizedResult.blob, customFileName, resizedResult.format);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            📐 Resize Image
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Resize images with multiple modes: stretch, fit, fill, or add padding.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {!originalUrl ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-strong rounded-2xl p-8 border border-blue-500/20"
            >
              <ImageUploader
                onFilesSelected={handleFilesSelected}
                multiple={false}
                maxFiles={1}
              />
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Controls Column */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-1 space-y-6"
              >
                <div className="glass-strong rounded-2xl p-6 border border-blue-500/20">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Settings</h2>
                    <button
                      onClick={handleReset}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-xs transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Reset
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Dimension Inputs */}
                    <DimensionInput
                      width={targetWidth}
                      height={targetHeight}
                      onWidthChange={handleWidthChange}
                      onHeightChange={handleHeightChange}
                      aspectRatioLocked={aspectRatioLocked}
                      onToggleAspectRatio={() => setAspectRatioLocked(!aspectRatioLocked)}
                      originalWidth={originalWidth}
                      originalHeight={originalHeight}
                      disabled={isResizing}
                    />

                    {/* Resize Mode Selector */}
                    <ResizeModeSelector
                      mode={resizeMode}
                      onModeChange={setResizeMode}
                      disabled={isResizing}
                    />

                    {/* Background Color Picker (only for pad mode) */}
                    {resizeMode === 'pad' && (
                      <div>
                        <label className="text-sm font-semibold text-gray-300 block mb-3">
                          Background Color
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="w-16 h-10 rounded-lg cursor-pointer bg-gray-800 border border-gray-600"
                          />
                          <input
                            type="text"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors"
                            placeholder="#FFFFFF"
                          />
                        </div>
                        {/* Preset Colors */}
                        <div className="flex gap-2 mt-2">
                          {['#FFFFFF', '#000000', '#F3F4F6', '#1F2937'].map((color) => (
                            <button
                              key={color}
                              onClick={() => setBackgroundColor(color)}
                              className="w-8 h-8 rounded-lg border-2 border-gray-600 hover:border-blue-500 transition-colors"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Format Selector */}
                    <div>
                      <label className="text-sm font-semibold text-gray-300 block mb-3">
                        Output Format
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {['image/png', 'image/jpeg', 'image/webp', 'image/bmp'].map((fmt) => (
                          <button
                            key={fmt}
                            onClick={() => setFormat(fmt)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                              format === fmt
                                ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                                : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:bg-gray-800'
                            }`}
                          >
                            {fmt.split('/')[1].toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quality Slider (for JPG/WebP) */}
                    {supportsQuality(format) && (
                      <QualitySlider
                        quality={quality}
                        onQualityChange={setQuality}
                        disabled={isResizing}
                        format={format}
                      />
                    )}

                    {/* Filename Input */}
                    <div>
                      <label className="text-xs font-semibold text-gray-400 block mb-2">
                        File Name
                      </label>
                      <input
                        type="text"
                        value={customFileName}
                        onChange={(e) => setCustomFileName(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Download Button */}
                <div className="glass-strong rounded-2xl p-6 border border-blue-500/20">
                  <button
                    onClick={handleDownload}
                    disabled={!resizedResult || isResizing}
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                  >
                    {isResizing ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Resizing...
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        Download Image
                      </>
                    )}
                  </button>
                  {resizedResult && (
                    <div className="mt-3 text-center text-xs text-gray-400">
                      <p>New size: {resizedResult.width} × {resizedResult.height} px</p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Preview Column */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-2"
              >
                {originalUrl && resizedResult ? (
                  <ImageComparison
                    originalUrl={originalUrl}
                    processedUrl={resizedResult.url}
                    originalSize={originalSize}
                    processedSize={resizedResult.size}
                    originalLabel={`Original (${originalWidth}×${originalHeight})`}
                    processedLabel={`Resized (${resizedResult.width}×${resizedResult.height})`}
                  />
                ) : (
                  <div className="h-96 flex items-center justify-center bg-gray-800/30 rounded-2xl border-2 border-dashed border-gray-700">
                    <p className="text-gray-500">Loading preview...</p>
                  </div>
                )}
                
                {error && (
                  <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-red-200 text-sm">
                    {error}
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
