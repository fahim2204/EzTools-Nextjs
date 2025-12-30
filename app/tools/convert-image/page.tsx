"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, RefreshCw } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";
import FormatSelector from "@/components/FormatSelector";
import QualitySlider from "@/components/QualitySlider";
import ImagePreview from "@/components/ImagePreview";
import {
  convertImage,
  downloadImage,
  getRecommendedQuality,
  ConversionResult,
} from "@/lib/imageConverter";
import { retrieveChainedImage, hasChainedImage } from "@/lib/toolChaining";

export default function ConvertImagePage() {
  const searchParams = useSearchParams();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [outputFormat, setOutputFormat] = useState("image/png");
  const [quality, setQuality] = useState(9); // 1-10 scale
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string>("");
  const [customFileName, setCustomFileName] = useState<string>("");

  const currentFile = selectedFiles[currentFileIndex];

  // Check for chained image on mount
  useEffect(() => {
    const loadChainedImage = async () => {
      const from = searchParams.get('from');
      if (from && hasChainedImage()) {
        try {
          const chainedFile = await retrieveChainedImage();
          if (chainedFile) {
            setSelectedFiles([chainedFile]);
            setCurrentFileIndex(0);
            setCustomFileName(chainedFile.name.replace(/\.[^/.]+$/, ''));
          }
        } catch (error) {
          console.error('Failed to load chained image:', error);
          setError('Failed to load image from previous tool');
        }
      }
    };
    loadChainedImage();
  }, [searchParams]);

  // Map quality from 1-10 scale to internal 1-100 range
  // 1 = lowest quality (10%)
  // 5 = medium quality (50%)
  // 9 = high quality (90%)
  // 10 = maximum quality (100%)
  const mapQualityToInternal = (quality: number): number => {
    // Clamp quality to 1-10 range for safety
    const clampedQuality = Math.max(1, Math.min(10, quality));
    // Map 1-10 to 10-100 range
    return Math.round(((clampedQuality - 1) / 9) * 90 + 10);
  };

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
    setCurrentFileIndex(0);
    setConversionResult(null);
    setError("");
    if (files.length > 0) {
      setCustomFileName(files[0].name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleConvert = async () => {
    if (!currentFile) return;

    setIsConverting(true);
    setError("");

    try {
      const internalQuality = mapQualityToInternal(quality);
      const result = await convertImage(currentFile, {
        format: outputFormat,
        quality: internalQuality,
      });
      setConversionResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed");
      setConversionResult(null);
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (conversionResult && currentFile) {
      downloadImage(conversionResult.blob, customFileName || currentFile.name, outputFormat);
    }
  };

  const handleReset = () => {
    setSelectedFiles([]);
    setCurrentFileIndex(0);
    setConversionResult(null);
    setError("");
    setOutputFormat("image/png");
    setQuality(9);
    setCustomFileName("");
  };

  const handleNextFile = () => {
    if (currentFileIndex < selectedFiles.length - 1) {
      const nextIndex = currentFileIndex + 1;
      setCurrentFileIndex(nextIndex);
      setConversionResult(null);
      setCustomFileName(selectedFiles[nextIndex].name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handlePreviousFile = () => {
    if (currentFileIndex > 0) {
      const prevIndex = currentFileIndex - 1;
      setCurrentFileIndex(prevIndex);
      setConversionResult(null);
      setCustomFileName(selectedFiles[prevIndex].name.replace(/\.[^/.]+$/, ''));
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
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
            🔄 Image Converter
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Convert images between all major formats with adjustable quality settings.
            All processing happens in your browser for privacy and speed.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {!currentFile ? (
            /* Upload Section */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-strong rounded-2xl p-8 border border-blue-500/20"
            >
              <ImageUploader
                onFilesSelected={handleFilesSelected}
                multiple={true}
                maxFiles={10}
              />
            </motion.div>
          ) : (
            /* Conversion Section */
            <div className="space-y-6">
              {/* Controls */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-strong rounded-2xl p-6 border border-blue-500/20"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    Conversion Settings
                  </h2>
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Start Over
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormatSelector
                      selectedFormat={outputFormat}
                      onFormatChange={setOutputFormat}
                    />
                    <QualitySlider
                      quality={quality}
                      format={outputFormat}
                      onQualityChange={setQuality}
                    />
                  </div>

                  <button
                    onClick={handleConvert}
                    disabled={isConverting}
                    className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                  >
                    <RefreshCw className={`w-5 h-5 ${isConverting ? 'animate-spin' : ''}`} />
                    {isConverting ? "Converting..." : "Convert Image"}
                  </button>
                </div>

                {/* Multiple Files Navigation */}
                {selectedFiles.length > 1 && (
                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-400">
                        File {currentFileIndex + 1} of {selectedFiles.length}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={handlePreviousFile}
                          disabled={currentFileIndex === 0}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <button
                          onClick={handleNextFile}
                          disabled={currentFileIndex === selectedFiles.length - 1}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400"
                >
                  {error}
                </motion.div>
              )}

              {/* Preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-strong rounded-2xl p-6 border border-blue-500/20"
              >
                <ImagePreview
                  originalFile={currentFile}
                  convertedUrl={conversionResult?.url}
                  convertedSize={conversionResult?.size}
                  convertedFormat={conversionResult?.format}
                  isConverting={isConverting}
                  onDownload={handleDownload}
                  fileName={customFileName}
                  onFileNameChange={setCustomFileName}
                />
              </motion.div>
            </div>
          )}

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12 glass-strong rounded-2xl p-8 border border-blue-500/20"
          >
            <h2 className="text-2xl font-bold text-white mb-4">
              About Image Converter
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
              <div>
                <h3 className="font-semibold text-white mb-2">Supported Formats</h3>
                <ul className="space-y-1 text-sm">
                  <li>• PNG - Lossless, best for graphics</li>
                  <li>• JPG - Lossy, best for photos</li>
                  <li>• WebP - Modern, smaller files</li>
                  <li>• GIF - Limited colors, animations</li>
                  <li>• BMP - Uncompressed bitmap</li>
                  <li>• ICO - Favicon format</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Features</h3>
                <ul className="space-y-1 text-sm">
                  <li>✅ Client-side processing (privacy)</li>
                  <li>✅ Adjustable quality settings</li>
                  <li>✅ Batch conversion support</li>
                  <li>✅ Real-time preview</li>
                  <li>✅ File size comparison</li>
                  <li>✅ No file size limits</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
