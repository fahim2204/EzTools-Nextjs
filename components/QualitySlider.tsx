"use client";

import React, { useState, useEffect } from "react";
import { Slider } from "@nextui-org/react";
import { supportsQuality } from "@/lib/imageConverter";

interface QualitySliderProps {
  quality: number;
  format: string;
  onQualityChange: (quality: number) => void;
}

export default function QualitySlider({
  quality,
  format,
  onQualityChange,
}: QualitySliderProps) {
  const [tempQuality, setTempQuality] = useState(quality);
  const isQualitySupported = supportsQuality(format);

  // Sync internal state when external quality changes
  useEffect(() => {
    setTempQuality(quality);
  }, [quality]);

  // Debounce quality change
  useEffect(() => {
    if (tempQuality === quality) return;

    const handler = setTimeout(() => {
      onQualityChange(tempQuality);
    }, 500);

    return () => clearTimeout(handler);
  }, [tempQuality, onQualityChange, quality]);

  if (!isQualitySupported) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold text-gray-300">
          Quality
        </label>
        <span className="text-sm font-bold text-blue-400">
          {tempQuality}
        </span>
      </div>
      
      <Slider
        size="sm"
        step={1}
        minValue={1}
        maxValue={10}
        value={tempQuality}
        onChange={(value) => setTempQuality(value as number)}
        aria-label="Quality"
        className="w-full"
        classNames={{
          base: "max-w-full",
          track: "bg-gray-700",
          filler: "bg-gradient-to-r from-blue-500 to-cyan-500",
          thumb: "bg-white shadow-lg",
        }}
      />
      
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>Smaller size</span>
        <span>Best quality</span>
      </div>

      {tempQuality < 3 && (
        <p className="text-xs text-yellow-400 mt-2">
          ⚠️ Low quality may result in visible artifacts
        </p>
      )}
    </div>
  );
}
