'use client';

interface UndoRedoProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

export default function UndoRedo({ canUndo, canRedo, onUndo, onRedo }: UndoRedoProps) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Undo (Ctrl + Z)"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
      </button>
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Redo (Ctrl + Y)"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
        </svg>
      </button>
    </div>
  );
}
