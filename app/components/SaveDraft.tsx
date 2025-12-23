'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface SaveDraftProps {
  canvas: any;
  pdfUrl: string;
  onLoadDraft: (data: any) => void;
}

export default function SaveDraft({ canvas, pdfUrl, onLoadDraft }: SaveDraftProps) {
  const [hasDraft, setHasDraft] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  useEffect(() => {
    // Check if there's a saved draft
    const draftKey = `pdf-draft-${pdfUrl}`;
    const savedDraft = localStorage.getItem(draftKey);
    setHasDraft(!!savedDraft);
  }, [pdfUrl]);

  useEffect(() => {
    if (!autoSaveEnabled || !canvas) return;

    // Auto-save every 30 seconds
    const interval = setInterval(() => {
      saveDraft();
    }, 30000);

    return () => clearInterval(interval);
  }, [canvas, autoSaveEnabled, pdfUrl]);

  const saveDraft = () => {
    if (!canvas) return;

    try {
      const draftKey = `pdf-draft-${pdfUrl}`;
      const canvasData = canvas.toJSON();
      
      const draft = {
        canvasData,
        pdfUrl,
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem(draftKey, JSON.stringify(draft));
      setHasDraft(true);
      
      if (autoSaveEnabled) {
        toast.success('Draft saved automatically', { duration: 2000 });
      } else {
        toast.success('Draft saved successfully');
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft');
    }
  };

  const loadDraft = () => {
    try {
      const draftKey = `pdf-draft-${pdfUrl}`;
      const savedDraft = localStorage.getItem(draftKey);
      
      if (savedDraft) {
        const draft = JSON.parse(savedDraft);
        onLoadDraft(draft.canvasData);
        toast.success('Draft loaded successfully');
      }
    } catch (error) {
      console.error('Error loading draft:', error);
      toast.error('Failed to load draft');
    }
  };

  const deleteDraft = () => {
    if (confirm('Are you sure you want to delete the saved draft?')) {
      const draftKey = `pdf-draft-${pdfUrl}`;
      localStorage.removeItem(draftKey);
      setHasDraft(false);
      toast.success('Draft deleted');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={saveDraft}
        disabled={!canvas}
        className="px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        title="Save Draft (Ctrl + S)"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
        Save Draft
      </button>

      {hasDraft && (
        <>
          <button
            onClick={loadDraft}
            className="px-3 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Load Draft
          </button>

          <button
            onClick={deleteDraft}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Draft"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </>
      )}

      <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
        <input
          type="checkbox"
          checked={autoSaveEnabled}
          onChange={(e) => setAutoSaveEnabled(e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        Auto-save
      </label>
    </div>
  );
}
