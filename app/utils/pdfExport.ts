import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Canvas } from 'fabric';

export async function exportPdf(
  pdfBytes: ArrayBuffer | Uint8Array,
  overlayCanvas: Canvas,
  signatureBase64: string
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();
  
  // Embed a font that supports more characters
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  if (!overlayCanvas) {
    console.error('No canvas provided');
    return await pdfDoc.save();
  }

  // Get canvas dimensions
  const canvasWidth = overlayCanvas.getWidth() || 595;
  const canvasHeight = overlayCanvas.getHeight() || 842;
  
  // Get actual PDF page dimensions
  const firstPage = pages[0];
  const pdfPageWidth = firstPage.getWidth();
  const pdfPageHeight = firstPage.getHeight();
  const pageHeight = pdfPageHeight; // Use actual PDF page height
  
  console.log('Canvas dimensions:', canvasWidth, 'x', canvasHeight);
  console.log('PDF page dimensions:', pdfPageWidth, 'x', pdfPageHeight);
  console.log('Number of pages:', pages.length);
  console.log('Number of objects on canvas:', overlayCanvas.getObjects().length);
  console.log('Scale factors: X =', pdfPageWidth / canvasWidth, 'Y =', pdfPageHeight / pageHeight);

  // Get all objects from the canvas
  const objects = overlayCanvas.getObjects();
  
  // Process each object and add it to the appropriate PDF page
  for (const obj of objects) {
    const objTop = obj.top || 0;
    const objLeft = obj.left || 0;
    
    // Determine which page this object belongs to
    const pageIndex = Math.floor(objTop / pageHeight);
    if (pageIndex >= pages.length) continue;
    
    const page = pages[pageIndex];
    const pdfPageHeight = page.getHeight();
    const pdfPageWidth = page.getWidth();
    
    // Calculate position on the specific page (relative to page top)
    const yOnPage = objTop % pageHeight;
    const scaleX = pdfPageWidth / canvasWidth;
    const scaleY = pdfPageHeight / pageHeight;
    
    // Convert to PDF coordinates (origin at bottom-left)
    // Canvas Y goes down, PDF Y goes up, so we need to flip it
    const pdfX = objLeft * scaleX;
    const pdfY = pdfPageHeight - (yOnPage * scaleY);

    if (obj.type === 'textbox') {
      // Handle text objects
      const textObj = obj as any;
      let text = textObj.text || '';
      const fontSize = (textObj.fontSize || 14) * scaleY; // Use scaleY for font size
      const color = textObj.fill || '#000000';
      const isCheckmark = (textObj as any).isCheckmark;
      
      // Parse color
      let r = 0, g = 0, b = 0;
      if (color.startsWith('#')) {
        r = parseInt(color.substr(1, 2), 16) / 255;
        g = parseInt(color.substr(3, 2), 16) / 255;
        b = parseInt(color.substr(5, 2), 16) / 255;
      }
      
      // Fabric.js textbox has padding and the text baseline is not at the top
      const fabricPadding = (textObj.fontSize || 14) * 0.2 * scaleY;
      const textBaseline = pdfY - fontSize - fabricPadding;
      
      // If it's a checkmark, draw it as a shape instead of text
      if (isCheckmark && (text === '✓' || text === '✔')) {
        // Draw checkmark as lines - adjusted for better positioning
        const size = fontSize;
        
        // Adjust Y position to account for textbox padding (same as regular text)
        const checkY = textBaseline;
        
        // Checkmark coordinates (smaller and better proportioned)
        const x1 = pdfX + size * 0.1;
        const y1 = checkY + size * 0.4;
        const x2 = pdfX + size * 0.35;
        const y2 = checkY + size * 0.15;
        const x3 = pdfX + size * 0.75;
        const y3 = checkY + size * 0.75;
        
        // Draw the checkmark using two lines
        page.drawLine({
          start: { x: x1, y: y1 },
          end: { x: x2, y: y2 },
          thickness: size * 0.12,
          color: rgb(r, g, b),
        });
        
        page.drawLine({
          start: { x: x2, y: y2 },
          end: { x: x3, y: y3 },
          thickness: size * 0.12,
          color: rgb(r, g, b),
        });
        
        console.log(`Added checkmark at page ${pageIndex + 1}, canvas pos (${objLeft}, ${objTop}), PDF pos (${pdfX.toFixed(2)}, ${checkY.toFixed(2)}), size: ${size.toFixed(2)}`);
      } else {
        // Regular text - replace unsupported characters
        text = text.replace(/[✓✔]/g, 'X'); // Replace checkmarks with X if they appear in regular text
        
        page.drawText(text, {
          x: pdfX,
          y: textBaseline,
          size: fontSize,
          color: rgb(r, g, b),
          font: font,
        });
        
        console.log(`Added text "${text}" at page ${pageIndex + 1}, canvas pos (${objLeft}, ${objTop}), PDF baseline (${pdfX.toFixed(2)}, ${textBaseline.toFixed(2)}), fontSize: ${fontSize.toFixed(2)}, padding: ${fabricPadding.toFixed(2)}`);
      }
    } else if (obj.type === 'rect' && (obj as any).stroke === '#dc2626') {
      // This is a signature box - place signature here if available
      if (signatureBase64 && signatureBase64.length > 100) {
        try {
          const sigImage = await pdfDoc.embedPng(signatureBase64);
          const width = ((obj.width || 200) * (obj.scaleX || 1)) * scaleX;
          const height = ((obj.height || 80) * (obj.scaleY || 1)) * scaleY;
          
          // For images, Y is at the bottom of the image
          page.drawImage(sigImage, {
            x: pdfX,
            y: pdfY - height,
            width: width,
            height: height,
          });
          
          console.log(`Added signature at page ${pageIndex + 1}, canvas pos (${objLeft}, ${objTop}), PDF pos (${pdfX.toFixed(2)}, ${(pdfY - height).toFixed(2)})`);
        } catch (err) {
          console.error('Error embedding signature:', err);
        }
      }
    } else if (obj.type === 'image' && (obj as any).isSignatureImage) {
      // This is an inserted signature image
      try {
        const imgObj = obj as any;
        const imgSrc = imgObj.getSrc();
        
        // Embed the signature image
        const sigImage = await pdfDoc.embedPng(imgSrc);
        const width = ((imgObj.width || 200) * (imgObj.scaleX || 1)) * scaleX;
        const height = ((imgObj.height || 80) * (imgObj.scaleY || 1)) * scaleY;
        
        // For images, Y is at the bottom of the image
        page.drawImage(sigImage, {
          x: pdfX,
          y: pdfY - height,
          width: width,
          height: height,
        });
        
        console.log(`Added signature image at page ${pageIndex + 1}, canvas pos (${objLeft}, ${objTop}), PDF pos (${pdfX.toFixed(2)}, ${(pdfY - height).toFixed(2)})`);
      } catch (err) {
        console.error('Error embedding signature image:', err);
      }
    }
  }

  const savedPdf = await pdfDoc.save();
  console.log('PDF saved, size:', savedPdf.length, 'bytes');
  return savedPdf;
}
