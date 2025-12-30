"use client";

import React from "react";
import { Select, SelectItem } from "@nextui-org/react";
import { OUTPUT_FORMATS } from "@/lib/imageConverter";

interface FormatSelectorProps {
  selectedFormat: string;
  onFormatChange: (format: string) => void;
}

export default function FormatSelector({
  selectedFormat,
  onFormatChange,
}: FormatSelectorProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-300 mb-2">
        Output Format
      </label>
      <Select
        items={OUTPUT_FORMATS}
        selectedKeys={[selectedFormat]}
        onChange={(e) => onFormatChange(e.target.value)}
        placeholder="Select format"
        className="w-full"
        classNames={{
          trigger: "bg-gray-800/50 border-gray-700 hover:border-blue-500/50 data-[hover=true]:bg-gray-800/70",
          value: "text-white",
          popoverContent: "bg-gray-800 border-gray-700",
        }}
        renderValue={(items) => {
          return items.map((item) => (
            <div key={item.key} className="flex items-center gap-2">
              <span className="font-semibold text-white">{item.data?.label}</span>
              <span className="text-xs text-gray-400">({item.data?.extension})</span>
            </div>
          ));
        }}
      >
        {(format) => (
          <SelectItem
            key={format.value}
            textValue={format.label}
            className="text-white"
            classNames={{
              base: "data-[hover=true]:bg-gray-700 data-[selectable=true]:focus:bg-gray-700",
            }}
          >
            <div className="flex flex-col">
              <span className="font-semibold">{format.label}</span>
              <span className="text-xs text-gray-400">{format.description}</span>
            </div>
          </SelectItem>
        )}
      </Select>
    </div>
  );
}
