"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, RefreshCw, Crop, Lock, Unlock } from "lucide-react";
import ReactCrop, { Crop as CropType, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import ImageUploader from "@/components/ImageUploader";
import ImagePreview from "@/components/ImagePreview";
import { createCroppedImage, ASPECT_RATIOS } from "@/lib/imageCropper";
import { downloadImage } from "@/lib/imageConverter";
import { storeImageForChaining, retrieveChainedImage, hasChainedImage } from "@/lib/toolChaining";

export default function CropImagePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const imgRef = useRef<HTMLImageElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<CropType>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [croppedUrl, setCroppedUrl] = useState<string | null>(null);
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  const [croppedSize, setCroppedSize] = useState<number | undefined>();
  const [isCropping, setIsCropping] = useState(false);
  const [error, setError] = useState<string>("");
  const [customFileName, setCustomFileName] = useState<string>("");
  const [manualWidth, setManualWidth] = useState<number>(0);
  const [manualHeight, setManualHeight] = useState<number>(0);
  const [isLocked, setIsLocked] = useState(false);
  const [outputWidth, setOutputWidth] = useState<number>(0);
  const [outputHeight, setOutputHeight] = useState<number>(0);
  const [useOutputScale, setUseOutputScale] = useState(false);

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
    setCustomFileName(file.name.replace(/\.[^/.]+$/, '') + '-cropped');
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setCroppedUrl(null);
      setCroppedBlob(null);
      setCrop(undefined);
    };
    reader.readAsDataURL(file);
  };

  const handleCrop = async () => {
    if (!imgRef.current || !completedCrop || !completedCrop.width || !completedCrop.height) {
      setError("Please select a crop area first");
      return;
    }

    setIsCropping(true);
    setError("");

    try {
      // Use output dimensions if scaling is enabled, otherwise use crop dimensions
      const finalWidth = useOutputScale && outputWidth > 0 ? outputWidth : completedCrop.width;
      const finalHeight = useOutputScale && outputHeight > 0 ? outputHeight : completedCrop.height;
      
      const result = await createCroppedImage(imgRef.current, completedCrop, finalWidth, finalHeight);
      
      if (croppedUrl) URL.revokeObjectURL(croppedUrl);
      
      setCroppedUrl(result.url);
      setCroppedBlob(result.blob);
      setCroppedSize(result.blob.size);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cropping failed");
      setCroppedUrl(null);
      setCroppedBlob(null);
    } finally {
      setIsCropping(false);
    }
  };

  const handleDownload = () => {
    if (croppedBlob && selectedFile) {
      downloadImage(croppedBlob, customFileName || selectedFile.name, "image/png");
    }
  };

  const handleSendToConverter = async () => {
    if (croppedBlob && customFileName) {
      try {
        await storeImageForChaining(croppedBlob, `${customFileName}.png`, "crop-image");
        router.push("/tools/convert-image?from=crop-image");
      } catch (error) {
        console.error("Failed to send to converter:", error);
        setError("Failed to send image to converter");
      }
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setImageSrc(null);
    setCroppedUrl(null);
    setCroppedBlob(null);
    setError("");
    setCrop(undefined);
    setCompletedCrop(undefined);
    setAspect(undefined);
    setCustomFileName("");
    setOutputWidth(0);
    setOutputHeight(0);
    setUseOutputScale(false);
  };;

  const handleAspectChange = (newAspect: number | undefined) => {
    setAspect(newAspect);
    setIsLocked(newAspect !== undefined);
    // Reset crop when aspect changes
    setCrop(undefined);
  };

  const handleWidthChange = (value: number) => {
    setManualWidth(value);
    if (isLocked && completedCrop) {
      const ratio = completedCrop.height / completedCrop.width;
      setManualHeight(Math.round(value * ratio));
    }
    if (completedCrop) {
      const newCrop = { ...completedCrop, width: value };
      if (isLocked) {
        const ratio = completedCrop.height / completedCrop.width;
        newCrop.height = Math.round(value * ratio);
      }
      setCrop(newCrop);
      setCompletedCrop(newCrop);
    }
  };

  const handleHeightChange = (value: number) => {
    setManualHeight(value);
    if (isLocked && completedCrop) {
      const ratio = completedCrop.width / completedCrop.height;
      setManualWidth(Math.round(value * ratio));
    }
    if (completedCrop) {
      const newCrop = { ...completedCrop, height: value };
      if (isLocked) {
        const ratio = completedCrop.width / completedCrop.height;
        newCrop.width = Math.round(value * ratio);
      }
      setCrop(newCrop);
      setCompletedCrop(newCrop);
    }
  };

  // Update manual inputs when crop changes
  useEffect(() => {
    if (completedCrop) {
      setManualWidth(Math.round(completedCrop.width));
      setManualHeight(Math.round(completedCrop.height));
    }
  }, [completedCrop]);

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
            ✂️ Crop Image
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Draw, move, and resize a crop box to select the area you want to keep.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {!imageSrc ? (
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
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-strong rounded-2xl p-6 border border-blue-500/20"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    Crop Settings
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
                  {/* Aspect Ratio Selector */}
                  <div>
                    <label className="text-sm font-semibold text-gray-300 block mb-2">
                      Aspect Ratio
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {ASPECT_RATIOS.map((ratio) => (
                        <button
                          key={ratio.label}
                          onClick={() => handleAspectChange(ratio.value)}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            aspect === ratio.value
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {ratio.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Manual Dimensions */}
                  {completedCrop && (
                    <div>
                      <label className="text-sm font-semibold text-gray-300 block mb-2">
                        Crop Dimensions (pixels)
                      </label>
                      <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Width</label>
                          <input
                            type="number"
                            value={manualWidth}
                            onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                            className="w-full bg-gray-800 border-2 border-gray-600 hover:border-gray-500 focus:border-blue-500 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none transition-colors"
                            min="1"
                          />
                        </div>
                        <button
                          onClick={() => setIsLocked(!isLocked)}
                          className={`mt-5 p-2 rounded-lg transition-colors ${
                            isLocked
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                          title={isLocked ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
                        >
                          {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                        </button>
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Height</label>
                          <input
                            type="number"
                            value={manualHeight}
                            onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                            className="w-full bg-gray-800 border-2 border-gray-600 hover:border-gray-500 focus:border-blue-500 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none transition-colors"
                            min="1"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Output Scaling */}
                  {completedCrop && (
                    <div className="border-t border-gray-700 pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-semibold text-gray-300">
                          Output Size (Scale Result)
                        </label>
                        <button
                          onClick={() => setUseOutputScale(!useOutputScale)}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                            useOutputScale
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {useOutputScale ? 'Enabled' : 'Disabled'}
                        </button>
                      </div>
                      {useOutputScale && (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-gray-400 block mb-1">Output Width</label>
                            <input
                              type="number"
                              value={outputWidth}
                              onChange={(e) => setOutputWidth(parseInt(e.target.value) || 0)}
                              className="w-full bg-gray-800 border-2 border-gray-600 hover:border-gray-500 focus:border-blue-500 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none transition-colors"
                              min="1"
                              placeholder="e.g., 300"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-400 block mb-1">Output Height</label>
                            <input
                              type="number"
                              value={outputHeight}
                              onChange={(e) => setOutputHeight(parseInt(e.target.value) || 0)}
                              className="w-full bg-gray-800 border-2 border-gray-600 hover:border-gray-500 focus:border-blue-500 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none transition-colors"
                              min="1"
                              placeholder="e.g., 300"
                            />
                          </div>
                        </div>
                      )}
                      {useOutputScale && (
                        <p className="text-xs text-gray-400 mt-2">
                          💡 Crop {manualWidth}x{manualHeight}px → Output {outputWidth}x{outputHeight}px
                        </p>
                      )}
                    </div>
                  )}

                  {/* Crop Button */}
                  <button
                    onClick={handleCrop}
                    disabled={isCropping || !completedCrop}
                    className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                  >
                    <Crop className="w-5 h-5" />
                    {isCropping ? "Cropping..." : "Crop Image"}
                  </button>
                </div>
              </motion.div>

              {/* Cropper Area */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-strong rounded-2xl p-6 border border-blue-500/20"
              >
                <h3 className="text-lg font-semibold text-white mb-4">
                  Draw or resize the crop box on the image
                </h3>
                <div className="flex justify-center bg-gray-900 rounded-lg p-4">
                  <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={aspect}
                  >
                    <img
                      ref={imgRef}
                      src={imageSrc}
                      alt="Crop preview"
                      style={{ maxWidth: '100%', maxHeight: '600px' }}
                    />
                  </ReactCrop>
                </div>
              </motion.div>

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
              {croppedUrl && selectedFile && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-strong rounded-2xl p-6 border border-blue-500/20"
                >
                  <ImagePreview
                    originalFile={selectedFile}
                    convertedUrl={croppedUrl}
                    convertedSize={croppedSize}
                    convertedFormat="image/png"
                    isConverting={isCropping}
                    onDownload={handleDownload}
                    onSendToConverter={handleSendToConverter}
                    fileName={customFileName}
                    onFileNameChange={setCustomFileName}
                  />
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
