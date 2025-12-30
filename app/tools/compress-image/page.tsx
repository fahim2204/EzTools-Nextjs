"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, RefreshCw, Download, FileDown, ArrowRight } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";
import ImageComparison from "@/components/ImageComparison";
import QualitySlider from "@/components/QualitySlider";
import FormatSelector from "@/components/FormatSelector";
import { convertImage, downloadImage, ConversionResult } from "@/lib/imageConverter";
import { retrieveChainedImage, hasChainedImage } from "@/lib/toolChaining";

export default function CompressImagePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // File State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  
  // Compression State
  const [compressedResult, setCompressedResult] = useState<ConversionResult | null>(null);
  const [quality, setQuality] = useState(7); // Default to High quality (85%)
  const [format, setFormat] = useState("image/webp"); // Default to WebP for best compression
  const [isCompressing, setIsCompressing] = useState(false);
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
    setCustomFileName(file.name.replace(/\.[^/.]+$/, '') + '-compressed');
    
    const reader = new FileReader();
    reader.onload = () => {
      setOriginalUrl(reader.result as string);
      // Auto-compress on load
      compressImage(file, quality, format);
    };
    reader.readAsDataURL(file);
  };

  const compressImage = async (file: File, q: number, fmt: string) => {
    setIsCompressing(true);
    setError("");
    
    try {
      // Non-linear quality mapping for better compression control
      // Lower values = more aggressive compression
      // Higher values = better quality
      let internalQuality: number;
      
      // Use exponential mapping: quality = (value/10)^2
      // This gives: 1->0.01, 3->0.09, 5->0.25, 7->0.49, 9->0.81, 10->1.0
      // But we want more practical ranges, so let's use a custom curve
      
      if (q <= 3) {
        // Low quality: 1->0.3, 2->0.45, 3->0.55
        internalQuality = 0.3 + (q - 1) * 0.125;
      } else if (q <= 6) {
        // Medium quality: 4->0.65, 5->0.73, 6->0.80
        internalQuality = 0.55 + (q - 3) * 0.083;
      } else {
        // High quality: 7->0.85, 8->0.90, 9->0.95, 10->0.98
        internalQuality = 0.80 + (q - 6) * 0.045;
      }
      
      // Format-specific adjustments
      if (fmt === 'image/webp') {
        // WebP is more efficient, can use slightly lower quality
        internalQuality = Math.max(0.3, internalQuality - 0.05);
      } else if (fmt === 'image/png') {
        // PNG compression is different, adjust the range
        internalQuality = Math.max(0.3, internalQuality - 0.1);
      }
      
      const result = await convertImage(file, {
        format: fmt,
        quality: internalQuality,
      });
      
      setCompressedResult(result);
    } catch (err) {
      setError("Compression failed. Please try a different image.");
    } finally {
      setIsCompressing(false);
    }
  };

  // Compress when quality/format changes
  useEffect(() => {
    if (selectedFile) {
      compressImage(selectedFile, quality, format);
    }
  }, [quality, format]);

  const handleReset = () => {
    setSelectedFile(null);
    setOriginalUrl(null);
    setCompressedResult(null);
    setQuality(7);
    setFormat("image/webp");
    setCustomFileName("");
    setError("");
  };

  const handleDownload = () => {
    if (compressedResult && customFileName) {
      downloadImage(compressedResult.blob, customFileName, compressedResult.format);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
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
            📉 Compress Image
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Reduce file size while maintaining visual quality. Compare results side-by-side.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {!originalUrl ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-strong rounded-2xl p-8 border border-purple-500/20"
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
                <div className="glass-strong rounded-2xl p-6 border border-purple-500/20">
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
                    {/* Format Selector */}
                    <div>
                      <label className="text-sm font-semibold text-gray-300 block mb-3">
                        Target Format
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {['image/webp', 'image/jpeg', 'image/png'].map((fmt) => (
                          <button
                            key={fmt}
                            onClick={() => setFormat(fmt)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                              format === fmt
                                ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                                : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:bg-gray-800'
                            }`}
                          >
                            {fmt.split('/')[1].toUpperCase()}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        💡 <strong>WebP</strong> offers best compression. 
                        <strong> JPG</strong> is best for photos.
                      </p>
                    </div>

                    {/* Quality Slider */}
                    <div>
                      <QualitySlider
                        quality={quality}
                        onQualityChange={(q) => setQuality(q)}
                        disabled={isCompressing}
                        format={format}
                      />
                    </div>

                    {/* Filename Input */}
                    <div>
                      <label className="text-xs font-semibold text-gray-400 block mb-2">
                        File Name
                      </label>
                      <input
                        type="text"
                        value={customFileName}
                        onChange={(e) => setCustomFileName(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Download Button */}
                <div className="glass-strong rounded-2xl p-6 border border-purple-500/20">
                  <button
                    onClick={handleDownload}
                    disabled={!compressedResult || isCompressing}
                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                  >
                    {isCompressing ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Compressing...
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        Download Image
                      </>
                    )}
                  </button>
                  {compressedResult && (
                    <p className="text-center text-xs text-gray-400 mt-3">
                      {compressedResult.size < originalSize 
                        ? "🎉 Nice! File size reduced."
                        : "⚠️ New format/quality is larger than original."}
                    </p>
                  )}
                </div>
              </motion.div>

              {/* Preview Column */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-2"
              >
                {originalUrl && compressedResult ? (
                  <ImageComparison
                    originalUrl={originalUrl}
                    processedUrl={compressedResult.url}
                    originalSize={originalSize}
                    processedSize={compressedResult.size}
                    originalLabel="Original"
                    processedLabel={`Compressed (Q${quality}/10)`}
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
