"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Eraser } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";
import IntensitySlider from "@/components/IntensitySlider";
import ImagePreview from "@/components/ImagePreview";
import { removeBackground } from "@/lib/backgroundRemover";
import { downloadImage } from "@/lib/imageConverter";

export default function RemoveBackgroundPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [intensity, setIntensity] = useState(5); // 1-10 scale
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [processedSize, setProcessedSize] = useState<number | undefined>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState<string>("");
  const [customFileName, setCustomFileName] = useState<string>("");

  const currentFile = selectedFiles[currentFileIndex];

  // Map intensity from 1-10 scale to internal 0-100 threshold
  // 1 = very soft (low threshold ~10)
  // 5 = neutral (threshold ~50)
  // 10 = very sharp (high threshold ~90)
  const mapIntensityToThreshold = (intensity: number): number => {
    // Clamp intensity to 1-10 range for safety
    const clampedIntensity = Math.max(1, Math.min(10, intensity));
    // Map 1-10 to 10-90 range (avoiding extremes)
    return Math.round(((clampedIntensity - 1) / 9) * 80 + 10);
  };

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
    setCurrentFileIndex(0);
    setProcessedUrl(null);
    setProcessedBlob(null);
    setError("");
    if (files.length > 0) {
      setCustomFileName(files[0].name.replace(/\.[^/.]+$/, '') + "-no-bg");
    }
  };

  const handleProcess = async () => {
    if (!currentFile) return;

    setIsProcessing(true);
    setError("");
    setProgress("Initializing...");

    try {
      const threshold = mapIntensityToThreshold(intensity);
      const resultBlob = await removeBackground(currentFile, {
        intensity: threshold,
        onProgress: (step) => setProgress(step)
      });
      
      if (processedUrl) URL.revokeObjectURL(processedUrl);
      
      const url = URL.createObjectURL(resultBlob);
      setProcessedUrl(url);
      setProcessedBlob(resultBlob);
      setProcessedSize(resultBlob.size);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Background removal failed");
      setProcessedUrl(null);
      setProcessedBlob(null);
    } finally {
      setIsProcessing(false);
      setProgress("");
    }
  };

  const handleDownload = () => {
    if (processedBlob && currentFile) {
      downloadImage(processedBlob, customFileName || currentFile.name, "image/png");
    }
  };

  const handleReset = () => {
    setSelectedFiles([]);
    setCurrentFileIndex(0);
    setProcessedUrl(null);
    setProcessedBlob(null);
    setError("");
    setIntensity(5);
    setCustomFileName("");
  };

  const handleNextFile = () => {
    if (currentFileIndex < selectedFiles.length - 1) {
      const nextIndex = currentFileIndex + 1;
      setCurrentFileIndex(nextIndex);
      setProcessedUrl(null);
      setCustomFileName(selectedFiles[nextIndex].name.replace(/\.[^/.]+$/, '') + "-no-bg");
    }
  };

  const handlePreviousFile = () => {
    if (currentFileIndex > 0) {
      const prevIndex = currentFileIndex - 1;
      setCurrentFileIndex(prevIndex);
      setProcessedUrl(null);
      setCustomFileName(selectedFiles[prevIndex].name.replace(/\.[^/.]+$/, '') + "-no-bg");
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
            ✨ Background Remover
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Remove image backgrounds automatically in seconds using browser-based AI. 
            All processing happens locally for maximum privacy.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {!currentFile ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-strong rounded-2xl p-8 border border-blue-500/20"
            >
              <ImageUploader
                onFilesSelected={handleFilesSelected}
                multiple={true}
                maxFiles={5}
              />
            </motion.div>
          ) : (
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-strong rounded-2xl p-6 border border-blue-500/20"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    Processing Settings
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
                  <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                    <p className="text-sm text-blue-300 mb-2 font-medium">✨ AI Background Removal</p>
                    <p className="text-xs text-gray-400">
                      We're using a high-quality neural network directly in your browser. 
                      The first time you use this tool, it may take a moment to load the AI model.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    <IntensitySlider
                      value={intensity}
                      onChange={setIntensity}
                      label="Cutout Intensity"
                      icon="✂️"
                    />
                    <button
                      onClick={handleProcess}
                      disabled={isProcessing}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                    >
                      <Eraser className="w-5 h-5" />
                      {isProcessing ? "Processing..." : "Remove Background"}
                    </button>
                  </div>
                </div>

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

              {progress && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-300 text-center animate-pulse"
                >
                  <p className="text-sm font-medium">Processing: {progress}</p>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400"
                >
                  {error}
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-strong rounded-2xl p-6 border border-blue-500/20"
              >
                <ImagePreview
                  originalFile={currentFile}
                  convertedUrl={processedUrl || undefined}
                  convertedSize={processedSize}
                  convertedFormat="image/png"
                  isConverting={isProcessing}
                  onDownload={handleDownload}
                  fileName={customFileName}
                  onFileNameChange={setCustomFileName}
                />
              </motion.div>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12 glass-strong rounded-2xl p-8 border border-blue-500/20"
          >
            <h2 className="text-2xl font-bold text-white mb-4">
              How it works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-300">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400">
                    <Eraser className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Advanced AI</h3>
                    <p className="text-sm">We use a state-of-the-art neural network to identify the foreground and remove the background with high precision.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-500/20 p-2 rounded-lg text-green-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 21.48V12.06" /></svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Private & Secure</h3>
                    <p className="text-sm">Your image never leaves your computer. The AI model runs entirely in your browser using WebAssembly.</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h3 className="font-semibold text-white mb-3">Pro Tips</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Use images with a clear subject for best results.</li>
                  <li>• Adjust <b>Intensity</b> to fine-tune the edges of the cutout.</li>
                  <li>• High resolution images may take longer to process.</li>
                  <li>• After removal, you can download as a transparent PNG.</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
