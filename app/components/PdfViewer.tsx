'use client';

import { useMemo, useState } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  pdfBytes: ArrayBuffer | Uint8Array;
  onLoadSuccess?: (numPages: number) => void;
  width?: number;
}

export default function PdfViewer({ pdfBytes, onLoadSuccess, width = 600 }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const file = useMemo(() => {
    // Handle both ArrayBuffer and Uint8Array
    if (pdfBytes instanceof Uint8Array) {
      return { data: pdfBytes };
    }
    return { data: pdfBytes };
  }, [pdfBytes]);
  
  const handleLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    if (onLoadSuccess) {
      onLoadSuccess(numPages);
    }
  };
  
  return (
    <Document file={file} onLoadSuccess={handleLoadSuccess}>
      {Array.from(new Array(numPages), (el, index) => (
        <Page 
          key={`page_${index + 1}`} 
          pageNumber={index + 1}
          width={width}
          className="mb-4"
        />
      ))}
    </Document>
  );
}
