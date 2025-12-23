'use client';

import { useState } from 'react';

export default function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { key: 'Ctrl + Z', action: 'Undo' },
    { key: 'Ctrl + Y', action: 'Redo' },
    { key: 'Ctrl + C', action: 'Copy selected field' },
    { key: 'Ctrl + V', action: 'Paste field' },
    { key: 'Delete', action: 'Delete selected field' },
    { key: 'Ctrl + +', action: 'Zoom in' },
    { key: 'Ctrl + -', action: 'Zoom out' },
    { key: 'Ctrl + 0', action: 'Reset zoom' },
    { key: 'Ctrl + S', action: 'Save draft' },
    { key: 'Ctrl + P', action: 'Preview PDF' },
    { key: 'Esc', action: 'Cancel current action' },
    { key: 'Arrow Keys', action: 'Move selected field' },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        title="Keyboard Shortcuts"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Keyboard Shortcuts</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid gap-3">
                {shortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-gray-700">{shortcut.action}</span>
                    <kbd className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-mono shadow-sm">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
