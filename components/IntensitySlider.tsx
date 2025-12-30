"use client";

import React, { useState, useEffect } from "react";
import { Slider } from "@nextui-org/react";

interface IntensitySliderProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  icon?: string;
}

export default function IntensitySlider({
  value,
  onChange,
  label = "Intensity",
  min = 1,
  max = 10,
  step = 1,
  icon = "🎯",
}: IntensitySliderProps) {
  const [tempValue, setTempValue] = useState(value);

  // Sync internal state when external value changes
  useEffect(() => {
    setTempValue(value);
  }, [value]);

  // Debounce change
  useEffect(() => {
    if (tempValue === value) return;

    const handler = setTimeout(() => {
      onChange(tempValue);
    }, 500);

    return () => clearTimeout(handler);
  }, [tempValue, onChange, value]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
          <span>{icon}</span> {label}
        </label>
        <span className="text-sm font-bold text-blue-400">
          {tempValue}
        </span>
      </div>
      
      <Slider
        size="sm"
        step={step}
        minValue={min}
        maxValue={max}
        value={tempValue}
        onChange={(val) => setTempValue(val as number)}
        aria-label={label}
        className="w-full"
        classNames={{
          base: "max-w-full",
          track: "bg-gray-700",
          filler: "bg-gradient-to-r from-blue-500 to-cyan-500",
          thumb: "bg-white shadow-lg",
        }}
      />
      
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>Softer</span>
        <span>Sharper</span>
      </div>
    </div>
  );
}
