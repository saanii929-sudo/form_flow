'use client';

import { useState } from 'react';

interface ZoomControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

export default function ZoomControls({ zoom, onZoomChange }: ZoomControlsProps) {
  const zoomLevels = [0.5, 0.75, 1, 1.25, 1.5, 2];

  const handleZoomIn = () => {
    const currentIndex = zoomLevels.indexOf(zoom);
    if (currentIndex < zoomLevels.length - 1) {
      onZoomChange(zoomLevels[currentIndex + 1]);
    }
  };

  const handleZoomOut = () => {
    const currentIndex = zoomLevels.indexOf(zoom);
    if (currentIndex > 0) {
      onZoomChange(zoomLevels[currentIndex - 1]);
    }
  };

  const handleFitWidth = () => {
    onZoomChange(1);
  };

  return (
    <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm border border-gray-200 p-1">
      <button
        onClick={handleZoomOut}
        disabled={zoom <= zoomLevels[0]}
        className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Zoom Out (Ctrl + -)"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
        </svg>
      </button>

      <select
        value={zoom}
        onChange={(e) => onZoomChange(Number(e.target.value))}
        className="px-2 py-1 text-sm border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
      >
        {zoomLevels.map((level) => (
          <option key={level} value={level}>
            {Math.round(level * 100)}%
          </option>
        ))}
      </select>

      <button
        onClick={handleZoomIn}
        disabled={zoom >= zoomLevels[zoomLevels.length - 1]}
        className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Zoom In (Ctrl + +)"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
        </svg>
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      <button
        onClick={handleFitWidth}
        className="px-3 py-1 text-xs font-medium hover:bg-gray-100 rounded transition-colors"
        title="Fit to Width"
      >
        Fit Width
      </button>
    </div>
  );
}
