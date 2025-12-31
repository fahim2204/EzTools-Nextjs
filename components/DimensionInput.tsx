"use client";

import React from "react";
import { Lock, Unlock } from "lucide-react";

interface DimensionInputProps {
  width: number;
  height: number;
  onWidthChange: (width: number) => void;
  onHeightChange: (height: number) => void;
  aspectRatioLocked: boolean;
  onToggleAspectRatio: () => void;
  originalWidth?: number;
  originalHeight?: number;
  disabled?: boolean;
}

export default function DimensionInput({
  width,
  height,
  onWidthChange,
  onHeightChange,
  aspectRatioLocked,
  onToggleAspectRatio,
  originalWidth,
  originalHeight,
  disabled = false,
}: DimensionInputProps) {
  return (
    <div className="w-full space-y-4">
      {/* Original Dimensions Display */}
      {originalWidth && originalHeight && (
        <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
          <p className="text-xs text-gray-400 mb-1">Original Size</p>
          <p className="text-sm font-semibold text-white">
            {originalWidth} × {originalHeight} px
          </p>
        </div>
      )}

      {/* Dimension Inputs */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-gray-300 block">
          Target Dimensions
        </label>
        
        <div className="flex items-center gap-3">
          {/* Width Input */}
          <div className="flex-1">
            <label className="text-xs text-gray-400 block mb-1">Width (px)</label>
            <input
              type="number"
              value={width}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1;
                onWidthChange(Math.max(1, Math.min(10000, val)));
              }}
              disabled={disabled}
              min={1}
              max={10000}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Aspect Ratio Lock Button */}
          <button
            onClick={onToggleAspectRatio}
            disabled={disabled}
            className={`mt-5 p-2 rounded-lg border-2 transition-all ${
              aspectRatioLocked
                ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                : 'bg-gray-800 border-gray-600 text-gray-400 hover:border-gray-500'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={aspectRatioLocked ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
          >
            {aspectRatioLocked ? (
              <Lock className="w-4 h-4" />
            ) : (
              <Unlock className="w-4 h-4" />
            )}
          </button>

          {/* Height Input */}
          <div className="flex-1">
            <label className="text-xs text-gray-400 block mb-1">Height (px)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1;
                onHeightChange(Math.max(1, Math.min(10000, val)));
              }}
              disabled={disabled}
              min={1}
              max={10000}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Aspect Ratio Info */}
        {aspectRatioLocked && (
          <p className="text-xs text-blue-400 flex items-center gap-1">
            <Lock className="w-3 h-3" />
            <span>Aspect ratio locked</span>
          </p>
        )}
      </div>
    </div>
  );
}
