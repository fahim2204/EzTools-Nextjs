"use client";

import React from "react";
import { ResizeMode } from "@/lib/imageResizer";
import { Maximize2, Minimize2, Crop, Square } from "lucide-react";

interface ResizeModeSelectorProps {
  mode: ResizeMode;
  onModeChange: (mode: ResizeMode) => void;
  disabled?: boolean;
}

const RESIZE_MODES = [
  {
    value: 'stretch' as ResizeMode,
    label: 'Stretch',
    description: 'Resize to exact dimensions',
    icon: Maximize2,
    emoji: '↔️',
  },
  {
    value: 'fit' as ResizeMode,
    label: 'Fit',
    description: 'Fit within bounds',
    icon: Minimize2,
    emoji: '📦',
  },
  {
    value: 'fill' as ResizeMode,
    label: 'Fill',
    description: 'Fill with crop',
    icon: Crop,
    emoji: '✂️',
  },
  {
    value: 'pad' as ResizeMode,
    label: 'Pad',
    description: 'Add background',
    icon: Square,
    emoji: '🎨',
  },
];

export default function ResizeModeSelector({
  mode,
  onModeChange,
  disabled = false,
}: ResizeModeSelectorProps) {
  return (
    <div className="w-full">
      <label className="text-sm font-semibold text-gray-300 block mb-3">
        Resize Mode
      </label>
      
      <div className="grid grid-cols-2 gap-2">
        {RESIZE_MODES.map((resizeMode) => {
          const Icon = resizeMode.icon;
          return (
            <button
              key={resizeMode.value}
              onClick={() => !disabled && onModeChange(resizeMode.value)}
              disabled={disabled}
              className={`
                relative p-3 rounded-xl border-2 transition-all duration-200
                ${mode === resizeMode.value
                  ? 'border-blue-500 bg-blue-600/20 shadow-lg shadow-blue-500/20'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{resizeMode.emoji}</span>
                  <Icon className={`w-4 h-4 ${
                    mode === resizeMode.value ? 'text-blue-300' : 'text-gray-400'
                  }`} />
                </div>
                <div className="text-center">
                  <span className={`text-sm font-bold block ${
                    mode === resizeMode.value ? 'text-white' : 'text-gray-300'
                  }`}>
                    {resizeMode.label}
                  </span>
                  <span className={`text-xs ${
                    mode === resizeMode.value ? 'text-blue-200' : 'text-gray-500'
                  }`}>
                    {resizeMode.description}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Mode Explanation */}
      <div className="mt-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
        <p className="text-xs text-gray-400">
          {mode === 'stretch' && (
            <>
              <strong className="text-white">Stretch:</strong> Resizes to exact dimensions. May distort if aspect ratio changes.
            </>
          )}
          {mode === 'fit' && (
            <>
              <strong className="text-white">Fit:</strong> Maintains aspect ratio, fits within specified dimensions.
            </>
          )}
          {mode === 'fill' && (
            <>
              <strong className="text-white">Fill:</strong> Maintains aspect ratio, fills entire area. May crop edges.
            </>
          )}
          {mode === 'pad' && (
            <>
              <strong className="text-white">Pad:</strong> Maintains aspect ratio, adds background to fill remaining space.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
