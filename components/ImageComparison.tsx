"use client";

import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';

interface ImageComparisonProps {
  originalUrl: string;
  processedUrl: string;
  originalSize: number;
  processedSize: number;
  originalLabel?: string;
  processedLabel?: string;
}

export default function ImageComparison({
  originalUrl,
  processedUrl,
  originalSize,
  processedSize,
  originalLabel = "Original",
  processedLabel = "Compressed",
}: ImageComparisonProps) {
  const reduction = Math.round(((originalSize - processedSize) / originalSize) * 100);
  const isReduction = reduction > 0;

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      {/* Stats Bar */}
      <div className="flex justify-between items-center mb-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">{originalLabel}</p>
          <p className="font-mono text-sm font-bold text-white">{formatSize(originalSize)}</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-xs font-bold text-emerald-400 mb-1">
            {isReduction ? `SAVED ${reduction}%` : 'NO SAVINGS'}
          </div>
          <div className="h-1 w-24 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${Math.max(0, 100 - reduction)}%` }} // Width represents the remaining size percentage
            />
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">{processedLabel}</p>
          <p className={`font-mono text-sm font-bold ${isReduction ? 'text-emerald-400' : 'text-white'}`}>
            {formatSize(processedSize)}
          </p>
        </div>
      </div>

      {/* Comparison Slider */}
      <div className="relative rounded-xl overflow-hidden shadow-2xl border-4 border-gray-800">
        <ReactCompareSlider
          itemOne={<ReactCompareSliderImage src={originalUrl} alt="Original Image" />}
          itemTwo={<ReactCompareSliderImage src={processedUrl} alt="Compressed Image" />}
          style={{ width: '100%', height: 'auto', backgroundColor: '#111827' }} 
        />
        
        {/* Floating Labels */}
        <div className="absolute top-4 left-4 pointer-events-none">
          <span className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-lg text-xs font-bold text-white border border-white/10">
            {originalLabel}
          </span>
        </div>
        <div className="absolute top-4 right-4 pointer-events-none">
          <span className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-lg text-xs font-bold text-emerald-400 border border-emerald-500/20">
            {processedLabel}
          </span>
        </div>
      </div>
      
      <p className="text-center text-xs text-gray-500 mt-3">
        Drag the slider to compare details
      </p>
    </div>
  );
}
