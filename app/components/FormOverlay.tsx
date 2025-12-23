'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas, Textbox, Rect, FabricImage } from 'fabric';

interface FormOverlayProps {
  onReady: (canvas: Canvas) => void;
  width: number;
  height: number;
}

export default function FormOverlay({ onReady, width, height }: FormOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new Canvas(canvasRef.current, {
      width,
      height,
      selection: true,
      backgroundColor: 'transparent',
    });
    
    setCanvas(fabricCanvas);
    onReady(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
    };
  }, [onReady, width, height]);

  const addTextField = () => {
    if (!canvas) return;
    
    const textbox = new Textbox('Type here...', {
      left: 100,
      top: 100,
      width: 200,
      fontSize: 14,
      fill: '#000000',
      backgroundColor: '#ffffff',
      borderColor: '#2563eb',
      cornerColor: '#2563eb',
      cornerSize: 8,
      transparentCorners: false,
    });
    
    canvas.add(textbox);
    canvas.setActiveObject(textbox);
    canvas.renderAll();
  };

  const addSignatureBox = () => {
    if (!canvas) return;
    
    const signatureBox = new Rect({
      left: 100,
      top: 200,
      width: 200,
      height: 80,
      fill: 'transparent',
      stroke: '#dc2626',
      strokeWidth: 2,
      strokeDashArray: [5, 5],
      cornerColor: '#dc2626',
      cornerSize: 8,
      transparentCorners: false,
    });
    
    const text = new Textbox('Signature Area', {
      left: 100,
      top: 220,
      width: 200,
      fontSize: 12,
      fill: '#dc2626',
      textAlign: 'center',
      selectable: false,
      evented: false,
    });
    
    canvas.add(signatureBox, text);
    canvas.setActiveObject(signatureBox);
    canvas.renderAll();
  };

  const deleteSelected = () => {
    if (!canvas) return;
    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length) {
      activeObjects.forEach(obj => canvas.remove(obj));
      canvas.discardActiveObject();
      canvas.renderAll();
    }
  };

  return (
    <canvas 
      ref={canvasRef}
      style={{ 
        display: 'block',
        width: '100%',
        height: '100%'
      }}
    />
  );
}
