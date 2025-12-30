"use client";

import React, { useState, useEffect } from "react";
import { Slider } from "@nextui-org/react";
import { supportsQuality } from "@/lib/imageConverter";

interface QualitySliderProps {
  quality: number;
  format: string;
  onQualityChange: (quality: number) => void;
  disabled?: boolean;
}

// Quality level descriptions for better UX
const getQualityLabel = (value: number): { label: string; emoji: string; color: string } => {
  if (value <= 3) return { label: "Low Quality", emoji: "🗜️", color: "text-red-400" };
  if (value <= 5) return { label: "Medium Quality", emoji: "⚖️", color: "text-yellow-400" };
  if (value <= 8) return { label: "High Quality", emoji: "✨", color: "text-blue-400" };
  return { label: "Maximum Quality", emoji: "💎", color: "text-purple-400" };
};

export default function QualitySlider({
  quality,
  format,
  onQualityChange,
  disabled = false,
}: QualitySliderProps) {
  const [tempQuality, setTempQuality] = useState(quality);
  const isQualitySupported = supportsQuality(format);

  // Sync internal state when external quality changes
  useEffect(() => {
    setTempQuality(quality);
  }, [quality]);

  if (!isQualitySupported) {
    return null;
  }

  const qualityInfo = getQualityLabel(tempQuality);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-semibold text-gray-300">
          Compression Level
        </label>
        <div className="flex items-center gap-2">
          <span className="text-lg">{qualityInfo.emoji}</span>
          <span className={`text-sm font-bold ${qualityInfo.color}`}>
            {qualityInfo.label}
          </span>
        </div>
      </div>
      
      <Slider
        isDisabled={disabled}
        size="md"
        step={1}
        minValue={1}
        maxValue={10}
        value={tempQuality}
        onChange={(value) => setTempQuality(value as number)}
        onChangeEnd={(value) => onQualityChange(value as number)}
        aria-label="Compression Quality"
        className="w-full"
        classNames={{
          base: "max-w-full",
          track: "bg-gray-700 h-2",
          filler: "bg-gradient-to-r from-red-500 via-yellow-500 via-blue-500 to-purple-500",
          thumb: "bg-white shadow-lg w-5 h-5",
        }}
      />
      
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>🗜️ Smaller file</span>
        <span>💎 Best quality</span>
      </div>

      {tempQuality <= 3 && (
        <p className="text-xs text-yellow-400 mt-3 flex items-center gap-1">
          <span>⚠️</span>
          <span>Low quality may show visible compression artifacts</span>
        </p>
      )}
      
      <div className="mt-3 p-2 bg-gray-800/50 rounded-lg">
        <p className="text-xs text-gray-400">
          💡 <strong>Tip:</strong> Lower values = smaller files. Try different levels to find your balance!
        </p>
      </div>
    </div>
  );
}
