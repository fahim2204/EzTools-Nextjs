"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { formatFileSize, calculateReduction } from "@/lib/imageConverter";
import { ArrowRight, Download } from "lucide-react";

interface ImagePreviewProps {
  originalFile: File;
  convertedUrl?: string;
  convertedSize?: number;
  convertedFormat?: string;
  isConverting?: boolean;
  onDownload?: () => void;
  onSendToConverter?: () => void;
  fileName: string;
  onFileNameChange: (name: string) => void;
}

export default function ImagePreview({
  originalFile,
  convertedUrl,
  convertedSize,
  convertedFormat,
  isConverting = false,
  onDownload,
  onSendToConverter,
  fileName,
  onFileNameChange,
}: ImagePreviewProps) {
  const originalUrl = URL.createObjectURL(originalFile);
  const reduction = convertedSize
    ? calculateReduction(originalFile.size, convertedSize)
    : 0;

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800/50 border border-gray-700 rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-300">Original</h4>
            <span className="text-xs text-gray-400">
              {formatFileSize(originalFile.size)}
            </span>
          </div>

          <div className="relative aspect-square bg-gray-900/50 rounded-lg overflow-hidden">
            <Image
              src={originalUrl}
              alt="Original"
              fill
              className="object-contain"
              unoptimized
            />
          </div>

          <div className="mt-3 text-xs text-gray-400">
            <p>Format: {originalFile.type.split("/")[1].toUpperCase()}</p>
            <p>Name: {originalFile.name}</p>
          </div>
        </motion.div>

        {/* Arrow */}
        <div className="hidden md:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <motion.div
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="bg-blue-500 p-3 rounded-full shadow-lg"
          >
            <ArrowRight className="w-6 h-6 text-white" />
          </motion.div>
        </div>

        {/* Converted Image */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800/50 border border-gray-700 rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-300">Converted</h4>
            {convertedSize && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  {formatFileSize(convertedSize)}
                </span>
                {reduction > 0 && (
                  <span className="text-xs font-semibold text-green-400">
                    -{reduction}%
                  </span>
                )}
                {reduction < 0 && (
                  <span className="text-xs font-semibold text-yellow-400">
                    +{Math.abs(reduction)}%
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="relative aspect-square bg-gray-900/50 rounded-lg overflow-hidden">
            {isConverting ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : convertedUrl ? (
              <Image
                src={convertedUrl}
                alt="Converted"
                fill
                className="object-contain"
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                <p className="text-sm">Waiting for conversion...</p>
              </div>
            )}
          </div>

          {convertedFormat && convertedSize && (
            <div className="mt-3">
              <div className="text-xs text-gray-400 mb-3">
                <p>Format: {convertedFormat.split("/")[1].toUpperCase()}</p>
                <p>Size: {formatFileSize(convertedSize)}</p>
              </div>

              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-400 block mb-1">
                  File Name
                </label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => onFileNameChange(e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Enter file name"
                />
              </div>

              {onDownload && (
                <div className="space-y-2">
                  <button
                    onClick={onDownload}
                    disabled={isConverting}
                    className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  {onSendToConverter && (
                    <button
                      onClick={onSendToConverter}
                      disabled={isConverting}
                      className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                    >
                      <ArrowRight className="w-4 h-4" />
                      Send to Converter
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* File Size Comparison */}
      {convertedSize && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-gray-800/30 border border-gray-700 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">File Size Comparison</p>
              <p className="text-2xl font-bold text-white mt-1">
                {formatFileSize(originalFile.size)} → {formatFileSize(convertedSize)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Reduction</p>
              <p
                className={`text-2xl font-bold mt-1 ${
                  reduction > 0 ? "text-green-400" : reduction < 0 ? "text-yellow-400" : "text-gray-400"
                }`}
              >
                {reduction > 0 ? "-" : reduction < 0 ? "+" : ""}
                {Math.abs(reduction)}%
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
