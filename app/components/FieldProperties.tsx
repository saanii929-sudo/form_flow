'use client';

import { useState } from 'react';

interface FieldPropertiesProps {
  selectedObject: any;
  onUpdate: (properties: any) => void;
}

export default function FieldProperties({ selectedObject, onUpdate }: FieldPropertiesProps) {
  if (!selectedObject) return null;

  const [properties, setProperties] = useState({
    fontSize: selectedObject.fontSize || 14,
    fontFamily: selectedObject.fontFamily || 'Arial',
    fontColor: selectedObject.fill || '#000000',
    backgroundColor: selectedObject.backgroundColor || 'transparent',
    borderColor: selectedObject.stroke || '#000000',
    borderWidth: selectedObject.strokeWidth || 0,
    opacity: selectedObject.opacity || 1,
    rotation: selectedObject.angle || 0,
    required: (selectedObject as any).required || false,
    readonly: (selectedObject as any).readonly || false,
  });

  const handleChange = (key: string, value: any) => {
    const newProperties = { ...properties, [key]: value };
    setProperties(newProperties);
    onUpdate(newProperties);
  };

  return (
    <div className="absolute right-4 top-20 w-72 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-40">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Field Properties</h3>
        <span className="text-xs text-gray-500 capitalize">{selectedObject.type}</span>
      </div>

      <div className="space-y-4 max-h-[60vh] overflow-y-auto">
        {selectedObject.type === 'textbox' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Font Size
              </label>
              <input
                type="number"
                value={properties.fontSize}
                onChange={(e) => handleChange('fontSize', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="8"
                max="72"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Font Family
              </label>
              <select
                value={properties.fontFamily}
                onChange={(e) => handleChange('fontFamily', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Text Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={properties.fontColor}
                  onChange={(e) => handleChange('fontColor', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={properties.fontColor}
                  onChange={(e) => handleChange('fontColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                />
              </div>
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Background Color
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={properties.backgroundColor === 'transparent' ? '#ffffff' : properties.backgroundColor}
              onChange={(e) => handleChange('backgroundColor', e.target.value)}
              className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
            />
            <button
              onClick={() => handleChange('backgroundColor', 'transparent')}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
            >
              Transparent
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Border
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={properties.borderColor}
              onChange={(e) => handleChange('borderColor', e.target.value)}
              className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
            />
            <input
              type="number"
              value={properties.borderWidth}
              onChange={(e) => handleChange('borderWidth', Number(e.target.value))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              max="10"
              placeholder="Width"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Opacity: {Math.round(properties.opacity * 100)}%
          </label>
          <input
            type="range"
            value={properties.opacity}
            onChange={(e) => handleChange('opacity', Number(e.target.value))}
            className="w-full"
            min="0"
            max="1"
            step="0.1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rotation: {properties.rotation}°
          </label>
          <input
            type="range"
            value={properties.rotation}
            onChange={(e) => handleChange('rotation', Number(e.target.value))}
            className="w-full"
            min="0"
            max="360"
            step="15"
          />
        </div>

        {selectedObject.type === 'textbox' && (
          <>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="required"
                checked={properties.required}
                onChange={(e) => handleChange('required', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="required" className="text-sm text-gray-700 cursor-pointer">
                Required field
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="readonly"
                checked={properties.readonly}
                onChange={(e) => handleChange('readonly', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="readonly" className="text-sm text-gray-700 cursor-pointer">
                Read-only
              </label>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
