"use client";

import React, { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { isValidImageFile } from "@/lib/imageConverter";

interface ImageUploaderProps {
  onFilesSelected: (files: File[]) => void;
  multiple?: boolean;
  maxFiles?: number;
}

export default function ImageUploader({
  onFilesSelected,
  multiple = false,
  maxFiles = 10,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>("");

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateAndAddFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const fileArray = Array.from(files);
      const validFiles: File[] = [];
      const invalidFiles: string[] = [];

      // Validate each file
      fileArray.forEach((file) => {
        if (!isValidImageFile(file)) {
          invalidFiles.push(file.name);
        } else if (multiple && selectedFiles.length + validFiles.length >= maxFiles) {
          setError(`Maximum ${maxFiles} files allowed`);
        } else {
          validFiles.push(file);
        }
      });

      if (invalidFiles.length > 0) {
        setError(`Invalid file type: ${invalidFiles.join(", ")}`);
        setTimeout(() => setError(""), 5000);
      }

      if (validFiles.length > 0) {
        const newFiles = multiple
          ? [...selectedFiles, ...validFiles].slice(0, maxFiles)
          : [validFiles[0]];
        
        setSelectedFiles(newFiles);
        onFilesSelected(newFiles);
        setError("");
      }
    },
    [multiple, maxFiles, selectedFiles, onFilesSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      validateAndAddFiles(e.dataTransfer.files);
    },
    [validateAndAddFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      validateAndAddFiles(e.target.files);
    },
    [validateAndAddFiles]
  );

  const removeFile = useCallback(
    (index: number) => {
      const newFiles = selectedFiles.filter((_, i) => i !== index);
      setSelectedFiles(newFiles);
      onFilesSelected(newFiles);
    },
    [selectedFiles, onFilesSelected]
  );

  const clearAll = useCallback(() => {
    setSelectedFiles([]);
    onFilesSelected([]);
    setError("");
  }, [onFilesSelected]);

  return (
    <div className="w-full">
      {/* Upload Area */}
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center
          transition-all duration-300 cursor-pointer
          ${
            isDragging
              ? "border-blue-500 bg-blue-500/10 scale-105"
              : "border-gray-600 bg-gray-800/30 hover:border-blue-500/50 hover:bg-gray-800/50"
          }
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={isDragging ? { scale: 1.2, rotate: 5 } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Upload className="w-16 h-16 text-blue-400" />
          </motion.div>

          <div>
            <h3 className="text-xl font-bold text-white mb-2">
              {isDragging ? "Drop your images here" : "Drag & Drop Images"}
            </h3>
            <p className="text-gray-400">
              or <span className="text-blue-400 font-semibold">click to browse</span>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Supports: PNG, JPG, WebP, GIF, BMP, TIFF, ICO, SVG
            </p>
            {multiple && (
              <p className="text-sm text-gray-500">
                Maximum {maxFiles} files
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
        >
          {error}
        </motion.div>
      )}

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white">
              Selected Files ({selectedFiles.length})
            </h4>
            {selectedFiles.length > 1 && (
              <button
                onClick={clearAll}
                className="text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedFiles.map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative group bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-blue-500/50 transition-all"
              >
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500/20 hover:bg-red-500/40 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="w-4 h-4 text-red-400" />
                </button>

                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <ImageIcon className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
