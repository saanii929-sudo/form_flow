'use client';

import SignatureCanvas from 'react-signature-canvas';
import { useRef } from 'react';
import toast from 'react-hot-toast';

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
      toast.success('Signature saved successfully!');
    } else {
      toast.error('Please sign before saving');
    }
  };

  return (
    <div className="space-y-3">
      <div className="border-2 border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm">
        <SignatureCanvas
          ref={ref}
          canvasProps={{ 
            width: 400, 
            height: 120,
            className: 'cursor-crosshair w-full'
          }}
          backgroundColor="white"
        />
      </div>
      <div className="flex gap-2">
        <button 
          onClick={handleSave}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 font-medium transition-all shadow-sm hover:shadow text-sm flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Save Signature
        </button>
        <button 
          onClick={handleClear}
          className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-all text-sm flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Clear
        </button>
      </div>
    </div>
  );
}
