'use client';

import SignatureCanvas from 'react-signature-canvas';
import { useRef } from 'react';

interface SignaturePadProps {
  onSave: (dataUrl: string) => void;
  onClear?: () => void;
}

export default function SignaturePad({ onSave, onClear }: SignaturePadProps) {
  const ref = useRef<SignatureCanvas>(null);

  const handleClear = () => {
    if (ref.current) {
      ref.current.clear();
    }
    // Call the onClear callback to clear the stored signature
    if (onClear) {
      onClear();
    }
  };

  const handleSave = () => {
    if (ref.current && !ref.current.isEmpty()) {
      onSave(ref.current.toDataURL());
    } else {
      alert('Please sign before saving');
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="border-2 border-gray-400 rounded bg-white">
        <SignatureCanvas
          ref={ref}
          canvasProps={{ 
            width: 500, 
            height: 200,
            className: 'cursor-crosshair'
          }}
          backgroundColor="white"
        />
      </div>
      <div className="flex gap-2">
        <button 
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save Signature
        </button>
        <button 
          onClick={handleClear}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
