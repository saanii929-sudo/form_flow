'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Textbox, Rect, FabricImage } from 'fabric';
import SignaturePad from '../components/SignaturePad';
import TrialBanner from '../components/TrialBanner';
import UndoRedo from '../components/UndoRedo';
import KeyboardShortcuts from '../components/KeyboardShortcuts';
import ZoomControls from '../components/ZoomControls';
import SaveDraft from '../components/SaveDraft';
import FormTemplates from '../components/FormTemplates';
import FieldProperties from '../components/FieldProperties';
import PageThumbnails from '../components/PageThumbnails';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import React from 'react';

export const dynamicParams = false;

const PdfViewer = dynamic(() => import('../components/PdfViewer'), {
  ssr: false,
});

const FormOverlay = dynamic(() => import('../components/FormOverlay'), {
  ssr: false,
});

const PDF_URL = 'https://api.attunehearttherapy.com/media/documents/2025/12/19/Child_Biopsychosocial.pdf';

const Icons = {
  Text: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  Check: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  Signature: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  ),
  Upload: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  ),
  Link: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  ),
  Document: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  Copy: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  Trash: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
};

export default function PdfFormPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [canvas, setCanvas] = useState<any>(null);
  const [pdfUrl, setPdfUrl] = useState<string>(PDF_URL);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showPdfSelector, setShowPdfSelector] = useState(true);
  const [inputUrl, setInputUrl] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [previewPdf, setPreviewPdf] = useState<Uint8Array | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [numPages, setNumPages] = useState<number>(0);
  const [pdfWidth] = useState(595); // A4 width in points (210mm)
  const [addMode, setAddMode] = useState<'text' | 'checkmark' | 'insertSignature' | null>(null);
  const [selectedObject, setSelectedObject] = useState<any>(null);
  const [fontSize, setFontSize] = useState(14);
  const [fontColor, setFontColor] = useState('#000000');
  const [copiedObject, setCopiedObject] = useState<any>(null);
  const [signature, setSignature] = useState<string>('');
  
  // Subscription state
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  
  // Advanced features state
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [zoom, setZoom] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFieldProperties, setShowFieldProperties] = useState(false);

  const loadPdfFromUrl = useCallback(async (url: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(url);
      if (!response.ok) {
        setError('Failed to fetch PDF');
        throw new Error('Failed to fetch PDF');
      }
      const bytes = await response.arrayBuffer();
      setPdfBytes(new Uint8Array(bytes));
      setPdfUrl(url);
      setUploadedFile(null);
      setShowPdfSelector(false);
      setLoading(false);
    } catch (err) {
      console.error('Error loading PDF:', err);
      setError('Failed to load PDF from URL. Please check the URL and try again.');
      setLoading(false);
    }
  }, []);

  const handleUrlSubmit = useCallback(() => {
    if (!inputUrl.trim()) {
      toast.error('Please enter a PDF URL');
      return;
    }
    loadPdfFromUrl(inputUrl);
  }, [inputUrl, loadPdfFromUrl]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    setLoading(true);
    setError('');
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      if (arrayBuffer) {
        setPdfBytes(new Uint8Array(arrayBuffer));
        setPdfUrl(file.name);
        setUploadedFile(file); // Store the file for re-reading later
        setShowPdfSelector(false);
        setLoading(false);
      }
    };
    
    reader.onerror = () => {
      setError('Failed to read PDF file');
      setLoading(false);
    };
    
    reader.readAsArrayBuffer(file);
  }, []);

  const handleLoadDefaultPdf = useCallback(() => {
    loadPdfFromUrl(PDF_URL);
  }, [loadPdfFromUrl]);

  const handleChangePdf = useCallback(() => {
    setShowPdfSelector(true);
    setPdfBytes(null);
    setUploadedFile(null);
    setNumPages(0);
    setPreviewPdf(null);
    setShowPreview(false);
    // Clear canvas
    if (canvas) {
      canvas.clear();
    }
  }, [canvas]);

  const handleCanvasReady = useCallback((fabricCanvas: any) => {
    // Configure canvas for proper interaction
    fabricCanvas.selection = true;
    fabricCanvas.defaultCursor = 'default';
    fabricCanvas.hoverCursor = 'move';
    fabricCanvas.renderOnAddRemove = true;
    
    setCanvas(fabricCanvas);
    
    // Listen for selection changes
    fabricCanvas.on('selection:created', (e: any) => {
      setSelectedObject(e.selected[0]);
      if (e.selected[0] && e.selected[0].type === 'textbox') {
        setFontSize(e.selected[0].fontSize || 14);
        setFontColor(e.selected[0].fill || '#000000');
      }
    });
    
    fabricCanvas.on('selection:updated', (e: any) => {
      setSelectedObject(e.selected[0]);
      if (e.selected[0] && e.selected[0].type === 'textbox') {
        setFontSize(e.selected[0].fontSize || 14);
        setFontColor(e.selected[0].fill || '#000000');
      }
    });
    
    fabricCanvas.on('selection:cleared', () => {
      setSelectedObject(null);
    });
    
    // Debug: log when objects are added
    fabricCanvas.on('object:added', (e: any) => {
      console.log('Object added:', e.target.type, 'at', e.target.left, e.target.top);
    });
  }, []);

  const handleSignatureSave = useCallback((dataUrl: string) => {
    setSignature(dataUrl);
    console.log('Signature saved');
  }, []);

  const handleSignatureClear = useCallback(() => {
    setSignature('');
    console.log('Signature cleared');
  }, []);

  // Advanced features handlers
  const saveToHistory = useCallback(() => {
    if (!canvas) return;
    const json = canvas.toJSON();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(json);
    // Limit history to 50 items
    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      setHistoryIndex(historyIndex + 1);
    }
    setHistory(newHistory);
  }, [canvas, history, historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0 && canvas) {
      const newIndex = historyIndex - 1;
      canvas.loadFromJSON(history[newIndex], () => {
        canvas.renderAll();
        setHistoryIndex(newIndex);
        toast.success('Undone', { duration: 1000 });
      });
    }
  }, [canvas, history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1 && canvas) {
      const newIndex = historyIndex + 1;
      canvas.loadFromJSON(history[newIndex], () => {
        canvas.renderAll();
        setHistoryIndex(newIndex);
        toast.success('Redone', { duration: 1000 });
      });
    }
  }, [canvas, history, historyIndex]);

  const handleZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
    if (canvas) {
      canvas.setZoom(newZoom);
      canvas.renderAll();
    }
  }, [canvas]);

  const handleLoadDraft = useCallback((data: any) => {
    if (canvas) {
      canvas.loadFromJSON(data, () => {
        canvas.renderAll();
        toast.success('Draft loaded successfully!');
      });
    }
  }, [canvas]);

  const handleFieldPropertiesUpdate = useCallback((properties: any) => {
    if (!selectedObject || !canvas) return;
    
    Object.keys(properties).forEach(key => {
      if (key === 'fontColor') {
        selectedObject.set('fill', properties[key]);
      } else if (key === 'borderColor') {
        selectedObject.set('stroke', properties[key]);
      } else if (key === 'borderWidth') {
        selectedObject.set('strokeWidth', properties[key]);
      } else if (key === 'rotation') {
        selectedObject.set('angle', properties[key]);
      } else {
        selectedObject.set(key, properties[key]);
      }
    });
    
    canvas.renderAll();
    saveToHistory();
  }, [selectedObject, canvas, saveToHistory]);

  // Save to history when objects change
  useEffect(() => {
    if (!canvas) return;
    
    const handleObjectModified = () => saveToHistory();
    const handleObjectAdded = () => saveToHistory();
    const handleObjectRemoved = () => saveToHistory();
    
    canvas.on('object:modified', handleObjectModified);
    canvas.on('object:added', handleObjectAdded);
    canvas.on('object:removed', handleObjectRemoved);
    
    return () => {
      canvas.off('object:modified', handleObjectModified);
      canvas.off('object:added', handleObjectAdded);
      canvas.off('object:removed', handleObjectRemoved);
    };
  }, [canvas, saveToHistory]);

  // Check subscription status on mount
  useEffect(() => {
    const checkSubscription = async () => {
      if (status === 'loading') return;
      
      if (!session) {
        router.push('/auth/signin?redirect=/pdf-form');
        return;
      }

      try {
        const response = await fetch('/api/check-trial');
        const data = await response.json();
        
        setSubscriptionStatus(data);
        setCheckingSubscription(false);

        // Check if user needs to upgrade
        if (data.needsUpgrade && data.planStatus !== 'active') {
          // Trial expired and no active subscription
          console.log('Subscription expired, redirecting to pricing');
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
        setCheckingSubscription(false);
      }
    };

    checkSubscription();
  }, [session, status, router]);



  const enableAddTextMode = useCallback(() => {
    setAddMode('text');
  }, []);

  const enableAddCheckmarkMode = useCallback(() => {
    setAddMode('checkmark');
  }, []);

  const enableInsertSignatureMode = useCallback(() => {
    if (!signature) {
      toast.error('Please save a signature first using the signature pad below');
      return;
    }
    setAddMode('insertSignature');
  }, [signature]);

  const deleteSelected = useCallback(() => {
    if (!canvas) return;
    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length) {
      activeObjects.forEach((obj: any) => canvas.remove(obj));
      canvas.discardActiveObject();
      canvas.renderAll();
    }
  }, [canvas]);

  const copySelected = useCallback(() => {
    if (!canvas || !selectedObject) return;
    setCopiedObject(selectedObject);
  }, [canvas, selectedObject]);

  const pasteObject = useCallback(async () => {
    if (!canvas || !copiedObject) return;
    
    try {
      const cloned = await copiedObject.clone();
      cloned.set({
        left: (copiedObject.left || 0) + 20,
        top: (copiedObject.top || 0) + 20,
        selectable: true,
        evented: true,
        hasControls: true,
        hasBorders: true,
      });
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.renderAll();
    } catch (err) {
      console.error('Error pasting object:', err);
    }
  }, [canvas, copiedObject]);

  const changeFontSize = useCallback((size: number) => {
    if (!canvas || !selectedObject || selectedObject.type !== 'textbox') return;
    selectedObject.set('fontSize', size);
    setFontSize(size);
    canvas.renderAll();
  }, [canvas, selectedObject]);

  const changeFontColor = useCallback((color: string) => {
    if (!canvas || !selectedObject || selectedObject.type !== 'textbox') return;
    selectedObject.set('fill', color);
    setFontColor(color);
    canvas.renderAll();
  }, [canvas, selectedObject]);

  const increaseSize = useCallback(() => {
    if (!canvas || !selectedObject) return;
    const scaleX = selectedObject.scaleX || 1;
    const scaleY = selectedObject.scaleY || 1;
    selectedObject.set({
      scaleX: scaleX * 1.1,
      scaleY: scaleY * 1.1,
    });
    canvas.renderAll();
  }, [canvas, selectedObject]);

  const decreaseSize = useCallback(() => {
    if (!canvas || !selectedObject) return;
    const scaleX = selectedObject.scaleX || 1;
    const scaleY = selectedObject.scaleY || 1;
    selectedObject.set({
      scaleX: scaleX * 0.9,
      scaleY: scaleY * 0.9,
    });
    canvas.renderAll();
  }, [canvas, selectedObject]);

  // Keyboard shortcuts - placed after all function definitions
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in input
      if ((e.target as HTMLElement).tagName === 'INPUT' || 
          (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return;
      }

      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'z':
            e.preventDefault();
            handleUndo();
            break;
          case 'y':
            e.preventDefault();
            handleRedo();
            break;
          case 'c':
            e.preventDefault();
            copySelected();
            break;
          case 'v':
            e.preventDefault();
            pasteObject();
            break;
          case 's':
            e.preventDefault();
            toast.success('Use the Save Draft button', { duration: 2000 });
            break;
          case '=':
          case '+':
            e.preventDefault();
            if (zoom < 2) handleZoomChange(zoom + 0.25);
            break;
          case '-':
            e.preventDefault();
            if (zoom > 0.5) handleZoomChange(zoom - 0.25);
            break;
          case '0':
            e.preventDefault();
            handleZoomChange(1);
            break;
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedObject) {
          e.preventDefault();
          deleteSelected();
        }
      } else if (e.key === 'Escape') {
        setAddMode(null);
        if (canvas) {
          canvas.discardActiveObject();
          canvas.renderAll();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, copySelected, pasteObject, deleteSelected, selectedObject, canvas, zoom, handleZoomChange]);

  const handleCanvasClick = useCallback(async (e: any) => {
    if (!canvas || !addMode) return;

    const pointer = canvas.getPointer(e.e);
    
    if (addMode === 'text') {
      const textbox = new Textbox('Type here...', {
        left: pointer.x,
        top: pointer.y,
        width: 200,
        fontSize: 14,
        fill: '#000000',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: '#2563eb',
        cornerColor: '#2563eb',
        cornerSize: 8,
        transparentCorners: false,
        selectable: true,
        evented: true,
        hasControls: true,
        hasBorders: true,
        lockMovementX: false,
        lockMovementY: false,
      });
      
      canvas.add(textbox);
      canvas.setActiveObject(textbox);
      canvas.renderAll();
      
      // Exit add mode and enable interaction
      setAddMode(null);
    } else if (addMode === 'checkmark') {
      // Create just a checkmark symbol (smaller size for checkboxes)
      const checkmark = new Textbox('✓', {
        left: pointer.x,
        top: pointer.y,
        width: 20,
        fontSize: 14,
        fill: '#000000',
        backgroundColor: 'transparent',
        borderColor: '#16a34a',
        cornerColor: '#16a34a',
        cornerSize: 6,
        transparentCorners: false,
        selectable: true,
        evented: true,
        hasControls: true,
        hasBorders: true,
        lockMovementX: false,
        lockMovementY: false,
        textAlign: 'center',
      });
      
      // Mark it as a checkmark for export
      (checkmark as any).isCheckmark = true;
      
      canvas.add(checkmark);
      canvas.setActiveObject(checkmark);
      canvas.renderAll();
      
      // Exit add mode and enable interaction
      setAddMode(null);
    } else if (addMode === 'insertSignature' && signature) {
      // Insert the saved signature as an image
      try {
        const img = await FabricImage.fromURL(signature);
        img.set({
          left: pointer.x,
          top: pointer.y,
          scaleX: 0.5, // Scale down to reasonable size
          scaleY: 0.5,
          cornerColor: '#8b5cf6',
          cornerSize: 8,
          transparentCorners: false,
          selectable: true,
          evented: true,
          hasControls: true,
          hasBorders: true,
          lockMovementX: false,
          lockMovementY: false,
        });
        
        // Mark it as a signature image for export
        (img as any).isSignatureImage = true;
        
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
        
        console.log('Signature image inserted at', pointer.x, pointer.y);
      } catch (err) {
        console.error('Error inserting signature:', err);
        toast.error('Error inserting signature. Please try again.');
      }
      
      // Exit add mode and enable interaction
      setAddMode(null);
    }
  }, [canvas, addMode, signature]);

  useEffect(() => {
    if (!canvas) return;

    const handleClick = (e: any) => {
      if (!addMode) return;
      handleCanvasClick(e);
    };

    if (addMode) {
      // Change cursor for add mode
      const cursor = addMode === 'text' ? 'text' : addMode === 'insertSignature' ? 'pointer' : 'crosshair';
      canvas.defaultCursor = cursor;
      canvas.hoverCursor = cursor;
      // Temporarily disable selection while in add mode
      canvas.selection = false;
      canvas.forEachObject((obj: any) => {
        obj.selectable = false;
        obj.evented = false;
      });
      canvas.on('mouse:down', handleClick);
    } else {
      // Reset cursor and enable full interaction
      canvas.defaultCursor = 'default';
      canvas.hoverCursor = 'move';
      canvas.selection = true;
      canvas.isDrawingMode = false;
      
      // Make all objects selectable and movable
      canvas.forEachObject((obj: any) => {
        obj.selectable = true;
        obj.evented = true;
        obj.hasControls = true;
        obj.hasBorders = true;
        obj.lockMovementX = false;
        obj.lockMovementY = false;
      });
      
      canvas.off('mouse:down', handleClick);
      canvas.renderAll();
    }

    return () => {
      canvas.off('mouse:down', handleClick);
    };
  }, [canvas, addMode, handleCanvasClick]);

  const handlePreview = async () => {
    if (!canvas) {
      toast.error('Please add some fields to the form');
      return;
    }

    const loadingToast = toast.loading('Generating preview...');

    try {
      let freshPdfBytes: Uint8Array;
      
      // Fetch the PDF again to get a fresh buffer
      if (pdfUrl.startsWith('http://') || pdfUrl.startsWith('https://')) {
        const response = await fetch(pdfUrl);
        const arrayBuffer = await response.arrayBuffer();
        freshPdfBytes = new Uint8Array(arrayBuffer);
      } else if (uploadedFile) {
        // For uploaded files, re-read from the File object
        const arrayBuffer = await uploadedFile.arrayBuffer();
        freshPdfBytes = new Uint8Array(arrayBuffer);
      } else {
        // Fallback: try to use existing pdfBytes
        if (!pdfBytes) {
          toast.dismiss(loadingToast);
          toast.error('PDF data not available. Please reload the PDF.');
          return;
        }
        // Create a deep copy by converting to array and back
        freshPdfBytes = new Uint8Array(Array.from(pdfBytes));
      }
      
      console.log('=== PREVIEW GENERATION START ===');
      console.log('Fetched PDF size:', freshPdfBytes.length);
      console.log('Canvas objects:', canvas.getObjects().length);
      console.log('Canvas objects details:', canvas.getObjects().map((o: any) => ({
        type: o.type,
        text: o.text,
        left: o.left,
        top: o.top
      })));
      
      const { exportPdf } = await import('../utils/pdfExport');
      const filledPdf = await exportPdf(freshPdfBytes, canvas, signature);
      
      console.log('Filled PDF type:', typeof filledPdf);
      console.log('Filled PDF is Uint8Array:', filledPdf instanceof Uint8Array);
      console.log('Filled PDF length:', filledPdf?.length);
      console.log('Filled PDF first bytes:', filledPdf?.slice(0, 10));
      console.log('=== PREVIEW GENERATION END ===');
      
      if (!filledPdf || filledPdf.length === 0) {
        toast.dismiss(loadingToast);
        toast.error('Error: Generated PDF is empty');
        return;
      }
      
      // Convert to regular array to avoid detached buffer issues
      const pdfArray = Array.from(filledPdf);
      const newPdf = new Uint8Array(pdfArray);
      
      console.log('Created new PDF array, length:', newPdf.length);
      console.log('First 10 bytes of new PDF:', Array.from(newPdf.slice(0, 10)));
      
      setPreviewPdf(newPdf);
      setShowPreview(true);
      
      toast.dismiss(loadingToast);
      toast.success('Preview generated successfully!');
      
      console.log('Preview state updated');
    } catch (err) {
      console.error('Error generating preview:', err);
      toast.dismiss(loadingToast);
      toast.error('Error generating preview: ' + (err as Error).message);
    }
  };

  const handleDownload = () => {
    console.log('=== DOWNLOAD START ===');
    console.log('PreviewPdf exists:', !!previewPdf);
    
    if (!previewPdf) {
      toast.error('Please preview the PDF first');
      return;
    }
    
    try {
      console.log('PreviewPdf type:', typeof previewPdf);
      console.log('PreviewPdf constructor:', previewPdf.constructor.name);
      console.log('PreviewPdf length:', previewPdf.length);
      console.log('PreviewPdf is Uint8Array:', previewPdf instanceof Uint8Array);
      console.log('PreviewPdf first 10 bytes:', Array.from(previewPdf.slice(0, 10)));
      
      // Check if the buffer is detached
      try {
        const testSlice = previewPdf.slice(0, 1);
        console.log('Buffer is accessible');
      } catch (e) {
        console.error('Buffer is detached!', e);
        toast.error('Error: PDF data is no longer accessible. Please preview again.');
        return;
      }
      
      // Create blob from Uint8Array
      const blob = new Blob([previewPdf as any], { type: 'application/pdf' });
      console.log('Download blob size:', blob.size, 'bytes');
      
      if (blob.size === 0) {
        console.error('Blob is empty! PreviewPdf length was:', previewPdf.length);
        toast.error('Error: PDF is empty. Please try previewing again.');
        return;
      }
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `filled-form-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('=== DOWNLOAD SUCCESS ===');
      toast.success('PDF downloaded successfully!');
    } catch (err) {
      console.error('Error downloading PDF:', err);
      toast.error('Error downloading PDF: ' + (err as Error).message);
    }
  };

  const handleSubmit = async () => {
    if (!previewPdf) {
      toast.error('Please preview the PDF first');
      return;
    }

    setSubmitting(true);
    const loadingToast = toast.loading('Submitting PDF...');
    
    try {
      console.log('Submitting PDF, size:', previewPdf.length);
      const pdfBlob = new Blob([previewPdf as any], { type: 'application/pdf' });
      
      const submitResponse = await fetch('/api/submit', {
        method: 'POST',
        body: pdfBlob,
        headers: { 'Content-Type': 'application/pdf' },
      });

      const result = await submitResponse.json();
      
      toast.dismiss(loadingToast);
      
      if (result.success) {
        toast.success('PDF submitted successfully!');
        // Reset preview
        setShowPreview(false);
        setPreviewPdf(null);
      } else {
        toast.error('Failed to submit PDF');
      }
    } catch (err) {
      console.error('Error submitting PDF:', err);
      toast.dismiss(loadingToast);
      toast.error('Error submitting PDF');
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading while checking subscription
  if (checkingSubscription || status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-ping"></div>
            <div className="absolute inset-0 border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-lg font-medium text-gray-700">Loading...</p>
          <p className="text-sm text-gray-500 mt-2">Checking your subscription status</p>
        </div>
      </div>
    );
  }

  // Show subscription expired screen
  if (subscriptionStatus?.needsUpgrade && subscriptionStatus?.planStatus !== 'active') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 sm:p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Your Free Trial Has Ended
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Thanks for trying FormFlow! To continue using our service, please choose a subscription plan.
          </p>

          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <h3 className="text-lg font-bold text-gray-900">What You'll Get</h3>
            </div>
            <ul className="text-left space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Unlimited PDF form filling</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Digital signature support</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Priority customer support</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Advanced editing tools</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/pricing"
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-600 hover:to-red-700 font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              View Pricing Plans
            </Link>
            <Link
              href="/"
              className="px-8 py-4 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl font-semibold text-lg transition-all"
            >
              Go to Homepage
            </Link>
          </div>

          <p className="text-sm text-gray-500 mt-8">
            Questions? Contact us at support@pdfformfiller.com
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-ping"></div>
            <div className="absolute inset-0 border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-lg font-medium text-gray-700">Loading your PDF...</p>
          <p className="text-sm text-gray-500 mt-2">This won't take long</p>
        </div>
      </div>
    );
  }

  // Show PDF selector if no PDF is loaded
  if (showPdfSelector) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
              <Icons.Document />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              FormFlow
            </h1>
            <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto">
              Fill out any PDF form with ease. Add text, signatures, and checkmarks in seconds.
            </p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg animate-shake">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}
          
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-6">
            {/* Load from URL */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                  <Icons.Link />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">From URL</h2>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Paste a link to any PDF document online
              </p>
              <div className="space-y-3">
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit()}
                  placeholder="https://example.com/document.pdf"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                />
                <button
                  onClick={handleUrlSubmit}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-medium text-sm shadow-sm hover:shadow"
                >
                  Load from URL
                </button>
              </div>
            </div>

            {/* Upload from Computer */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                  <Icons.Upload />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Upload File</h2>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Choose a PDF from your device
              </p>
              <label className="block cursor-pointer">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="pdf-upload"
                />
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-indigo-400 hover:bg-indigo-50/50 transition-all group">
                  <div className="w-12 h-12 mx-auto mb-3 text-gray-400 group-hover:text-indigo-500 transition-colors">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">
                    Click to browse
                  </p>
                  <p className="text-xs text-gray-500 mt-1">or drag and drop your PDF here</p>
                </div>
              </label>
            </div>
          </div>

          {/* Sample PDF */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-semibold mb-1">Try with a Sample PDF</h3>
                <p className="text-emerald-100 text-sm">
                  Test the form filler with our demo document
                </p>
              </div>
              <button
                onClick={handleLoadDefaultPdf}
                className="px-6 py-2.5 bg-white text-emerald-600 rounded-xl hover:bg-emerald-50 transition-all font-medium text-sm shadow-sm whitespace-nowrap"
              >
                Load Sample
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Trial Banner */}
      <TrialBanner />
      
      {/* Modern Toolbar */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Bar */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Icons.Document />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gray-900">FormFlow</h1>
                {pdfUrl && (
                  <p className="text-xs text-gray-500 truncate max-w-xs">
                    {pdfUrl.length > 50 ? pdfUrl.substring(0, 50) + '...' : pdfUrl}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Advanced Features */}
              <div className="hidden md:flex items-center gap-2 mr-2">
                <FormTemplates onSelectTemplate={loadPdfFromUrl} />
                <SaveDraft 
                  canvas={canvas}
                  pdfUrl={pdfUrl}
                  onLoadDraft={handleLoadDraft}
                />
              </div>
              
              <div className="hidden lg:flex items-center gap-2 mr-2">
                <UndoRedo 
                  canUndo={historyIndex > 0}
                  canRedo={historyIndex < history.length - 1}
                  onUndo={handleUndo}
                  onRedo={handleRedo}
                />
                <ZoomControls 
                  zoom={zoom}
                  onZoomChange={handleZoomChange}
                />
              </div>
              
              <KeyboardShortcuts />
              
              {session && (
                <div className="hidden sm:flex items-center gap-3 mr-3 ml-2 pl-2 border-l border-gray-200">
                  <span className="text-sm text-gray-600">
                    {session.user.name || session.user.email}
                  </span>
                </div>
              )}
              {pdfUrl && (
                <button
                  onClick={handleChangePdf}
                  className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Change PDF
                </button>
              )}
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to sign out?')) {
                    signOut({ callbackUrl: '/' });
                  }
                }}
                className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Tools Bar */}
          {!showPreview && (
            <div className="py-3">
              <div className="flex flex-wrap items-center gap-2">
                {/* Add Tools */}
                <div className="flex items-center gap-2 pb-2 sm:pb-0 sm:pr-2 sm:border-r border-gray-200">
                  <button
                    onClick={enableAddTextMode}
                    className={`group relative px-3 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                      addMode === 'text'
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icons.Text />
                    <span className="hidden sm:inline">{addMode === 'text' ? 'Click PDF' : 'Text'}</span>
                  </button>
                  
                  <button
                    onClick={enableAddCheckmarkMode}
                    className={`group relative px-3 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                      addMode === 'checkmark'
                        ? 'bg-emerald-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icons.Check />
                    <span className="hidden sm:inline">{addMode === 'checkmark' ? 'Click PDF' : 'Check'}</span>
                  </button>

                  {signature && (
                    <button
                      onClick={enableInsertSignatureMode}
                      className={`group relative px-3 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                        addMode === 'insertSignature'
                          ? 'bg-purple-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Icons.Signature />
                      <span className="hidden sm:inline">{addMode === 'insertSignature' ? 'Click PDF' : 'Sign'}</span>
                    </button>
                  )}

                  {addMode && (
                    <button
                      onClick={() => setAddMode(null)}
                      className="px-3 py-2 bg-orange-100 text-orange-700 hover:bg-orange-200 rounded-lg font-medium text-sm transition-all"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                {/* Edit Tools */}
                {selectedObject && (
                  <div className="flex items-center gap-2 flex-wrap">
                    {selectedObject.type === 'textbox' && (
                      <>
                        <input
                          type="number"
                          value={fontSize}
                          onChange={(e) => changeFontSize(Number(e.target.value))}
                          className="w-16 px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="8"
                          max="72"
                          title="Font Size"
                        />
                        <input
                          type="color"
                          value={fontColor}
                          onChange={(e) => changeFontColor(e.target.value)}
                          className="w-10 h-9 border border-gray-200 rounded-lg cursor-pointer"
                          title="Font Color"
                        />
                      </>
                    )}
                    
                    <button
                      onClick={increaseSize}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Increase Size"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={decreaseSize}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Decrease Size"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={copySelected}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Copy"
                    >
                      <Icons.Copy />
                    </button>
                    {copiedObject && (
                      <button
                        onClick={pasteObject}
                        className="p-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors"
                        title="Paste"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={deleteSelected}
                      className="p-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Icons.Trash />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {!showPreview ? (
          <>
            {/* Instructions Banner */}
            {addMode ? (
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-r-xl">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Click anywhere on the PDF to place your {
                        addMode === 'text' ? 'text field' : 
                        addMode === 'checkmark' ? 'checkmark' :
                        addMode === 'insertSignature' ? 'signature' : 'item'
                      }
                    </p>
                    <p className="text-xs text-blue-700 mt-1">Click "Cancel" in the toolbar to exit placement mode</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Use the toolbar to add fields to your PDF
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Double-click text to edit • Draw a signature below to enable signature insertion
                      {numPages > 0 && ` • ${numPages} page${numPages > 1 ? 's' : ''} loaded`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* PDF Editor */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-8 mb-8 relative">
              <div className="flex gap-4">
                {/* Page Thumbnails Sidebar */}
                {numPages > 1 && (
                  <PageThumbnails 
                    numPages={numPages}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                  />
                )}
                
                {/* PDF Canvas */}
                <div className="flex-1 flex justify-center">
                  {pdfBytes && (
                    <div 
                      style={{ 
                        position: 'relative',
                        cursor: addMode === 'text' ? 'text' : 
                                addMode === 'checkmark' ? 'pointer' : 
                                addMode === 'insertSignature' ? 'pointer' : 
                                'default',
                        width: pdfWidth * zoom,
                        height: numPages * 842 * zoom,
                        transform: `scale(${zoom})`,
                        transformOrigin: 'top center',
                      }}
                      className="shadow-xl rounded-lg overflow-hidden"
                    >
                    {/* PDF Layer - Bottom */}
                    <div style={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      zIndex: 1,
                      pointerEvents: 'none'
                    }}>
                      <PdfViewer 
                        pdfBytes={pdfBytes} 
                        onLoadSuccess={setNumPages}
                        width={pdfWidth}
                      />
                    </div>
                    
                    {/* Canvas Overlay - Top */}
                    <div style={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      zIndex: 10,
                      width: '100%',
                      height: '100%'
                    }}>
                      <FormOverlay 
                        onReady={handleCanvasReady}
                        width={pdfWidth}
                        height={numPages * 842}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
              
              {/* Field Properties Panel */}
              {selectedObject && (
                <FieldProperties 
                  selectedObject={selectedObject}
                  onUpdate={handleFieldPropertiesUpdate}
                />
              )}
            </div>

            {/* Signature Pad Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                  <Icons.Signature />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Signature Pad</h2>
                  <p className="text-xs text-gray-600">Draw and save your signature</p>
                </div>
              </div>
              
              <SignaturePad onSave={handleSignatureSave} onClear={handleSignatureClear} />
              
              {signature && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-green-900">Signature saved!</p>
                      <p className="text-xs text-green-700 mt-0.5">Click "Sign" in the toolbar to insert it</p>
                      <img src={signature} alt="Signature" className="mt-2 border border-green-300 rounded-lg shadow-sm max-w-[200px]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handlePreview}
                disabled={!canvas}
                className="flex-1 sm:flex-initial px-8 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview & Download
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Preview Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Final Preview</h2>
                <p className="text-gray-600">
                  Review your completed form before downloading or submitting
                </p>
              </div>
              <div className="flex justify-center">
                <div className="shadow-2xl rounded-lg overflow-hidden">
                  {previewPdf && (
                    <PdfViewer 
                      pdfBytes={previewPdf.slice(0)} 
                      width={pdfWidth} 
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={async () => {
                  // Set loading state and clear preview
                  setLoading(true);
                  setShowPreview(false);
                  setPdfBytes(null);
                  
                  // Re-fetch the PDF to avoid detached buffer issues
                  try {
                    if (pdfUrl.startsWith('http://') || pdfUrl.startsWith('https://')) {
                      // Reload from URL
                      const response = await fetch(pdfUrl);
                      const bytes = await response.arrayBuffer();
                      setPdfBytes(new Uint8Array(bytes));
                    } else {
                      // If it was uploaded, we can't reload it - just go back to preview
                      setError('Cannot reload uploaded file. Please re-upload if needed.');
                    }
                  } catch (err) {
                    console.error('Error reloading PDF:', err);
                    setError('Failed to reload PDF');
                  } finally {
                    setLoading(false);
                  }
                }}
                className="px-6 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl font-medium transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Edit
              </button>
              <button
                onClick={handleDownload}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Submit PDF
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
