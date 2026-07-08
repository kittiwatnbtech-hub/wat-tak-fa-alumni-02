import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Move, Check, X, RotateCw } from 'lucide-react';

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropComplete: (croppedBase64: string) => void;
}

export default function ImageCropModal({ isOpen, onClose, imageSrc, onCropComplete }: ImageCropModalProps) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [baseSize, setBaseSize] = useState({ width: 300, height: 300 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0); // support rotation for portrait-mode camera images that load sideways

  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset parameters when imageSrc changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setOffset({ x: 0, y: 0 });
      setRotation(0);
    }
  }, [isOpen, imageSrc]);

  if (!isOpen) return null;

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;

    // We want the image to cover a 300x300 container
    const containerSize = 300;
    let initialWidth = containerSize;
    let initialHeight = containerSize;

    if (naturalWidth > naturalHeight) {
      // Landscape
      initialHeight = containerSize;
      initialWidth = (naturalWidth / naturalHeight) * containerSize;
    } else {
      // Portrait
      initialWidth = containerSize;
      initialHeight = (naturalHeight / naturalWidth) * containerSize;
    }

    setBaseSize({ width: initialWidth, height: initialHeight });
    setOffset({
      x: (containerSize - initialWidth) / 2,
      y: (containerSize - initialHeight) / 2,
    });
  };

  const clampOffset = (x: number, y: number, currentZoom: number) => {
    const containerSize = 300;
    
    // Account for width and height changes under zoom
    const currentWidth = baseSize.width * currentZoom;
    const currentHeight = baseSize.height * currentZoom;

    const minX = containerSize - currentWidth;
    const maxX = 0;
    const minY = containerSize - currentHeight;
    const maxY = 0;

    let finalX = x;
    if (currentWidth >= containerSize) {
      finalX = Math.min(maxX, Math.max(minX, x));
    } else {
      finalX = (containerSize - currentWidth) / 2;
    }

    let finalY = y;
    if (currentHeight >= containerSize) {
      finalY = Math.min(maxY, Math.max(minY, y));
    } else {
      finalY = (containerSize - currentHeight) / 2;
    }

    return { x: finalX, y: finalY };
  };

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setDragStart({
      x: clientX - offset.x,
      y: clientY - offset.y,
    });
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const newX = clientX - dragStart.x;
    const newY = clientY - dragStart.y;
    
    // Clamp offsets so the user cannot drag the image completely out of bounds
    const clamped = clampOffset(newX, newY, zoom);
    setOffset(clamped);
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  // Mouse event handlers
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    handleMove(e.clientX, e.clientY);
  };

  // Touch event handlers
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handleStart(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleZoomChange = (newZoom: number) => {
    const clampedZoom = Math.max(1, Math.min(3, newZoom));
    setZoom(clampedZoom);
    
    // Re-clamp offsets immediately based on the new zoom level
    setOffset((prev) => clampOffset(prev.x, prev.y, clampedZoom));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
    // Recenter and reset zoom
    setZoom(1);
    setOffset({
      x: (300 - baseSize.width) / 2,
      y: (300 - baseSize.height) / 2,
    });
  };

  const handleConfirm = () => {
    if (!imgRef.current) return;

    const img = imgRef.current;
    const canvas = document.createElement('canvas');
    
    // Target standard medium resolution for optimal balance of quality and small document storage sizes
    const targetSize = 600;
    canvas.width = targetSize;
    canvas.height = targetSize;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Enable high quality scaling settings
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // 1. Calculate ratios
      const currentWidth = baseSize.width * zoom;
      const currentHeight = baseSize.height * zoom;

      // Scale ratio between natural original and current zoom size
      const scaleRatio = img.naturalWidth / baseSize.width;

      // 2. Clear canvas
      ctx.clearRect(0, 0, targetSize, targetSize);

      // 3. Draw image with clipping & rotation if necessary
      ctx.save();

      if (rotation !== 0) {
        // Handle rotation on canvas
        ctx.translate(targetSize / 2, targetSize / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-targetSize / 2, -targetSize / 2);
      }

      // Calculate how the 300x300 viewport translates back to original source image
      // source top-left coordinates: sX, sY
      const sX = (-offset.x / zoom) * scaleRatio;
      const sY = (-offset.y / zoom) * scaleRatio;
      const sWidth = (300 / zoom) * scaleRatio;
      const sHeight = (300 / zoom) * scaleRatio;

      ctx.drawImage(
        img,
        sX,
        sY,
        sWidth,
        sHeight,
        0,
        0,
        targetSize,
        targetSize
      );

      ctx.restore();

      // Convert to base64 jpeg with high-quality but compact output
      const croppedBase64 = canvas.toDataURL('image/jpeg', 0.82);
      onCropComplete(croppedBase64);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" id="crop-modal-overlay">
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col items-center gap-6" id="crop-modal-card">
        {/* Header */}
        <div className="w-full flex items-center justify-between">
          <h3 className="font-display-md text-lg font-bold text-on-surface">ปรับแต่งรูปโปรไฟล์</h3>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-surface-container-high transition-standard text-outline"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mask Preview Frame */}
        <div 
          ref={containerRef}
          className="w-[300px] h-[300px] rounded-full overflow-hidden border-2 border-primary shadow-inner bg-neutral-900 relative cursor-move select-none touch-none flex items-center justify-center"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={handleEnd}
          id="crop-preview-container"
        >
          <img
            ref={imgRef}
            src={imageSrc}
            alt="To Crop"
            onLoad={handleImageLoad}
            style={{
              position: 'absolute',
              left: `${offset.x}px`,
              top: `${offset.y}px`,
              width: `${baseSize.width * zoom}px`,
              height: `${baseSize.height * zoom}px`,
              maxWidth: 'none',
              transform: `rotate(${rotation}deg)`,
              transformOrigin: 'center center',
            }}
            draggable={false}
            referrerPolicy="no-referrer"
          />
          
          {/* Overlay grid representing the crop circle */}
          <div className="absolute inset-0 pointer-events-none border border-primary/20 rounded-full" />
        </div>

        <p className="font-sans text-xs text-on-surface-variant text-center leading-relaxed">
          กดค้างแล้วลากเพื่อปรับตำแหน่งให้อยู่ตรงกลางวงกลม และใช้แถบเลื่อนเพื่อย่อ/ขยายรูป
        </p>

        {/* Controls */}
        <div className="w-full flex flex-col gap-4">
          {/* Zoom Slider */}
          <div className="flex items-center gap-3 w-full bg-surface-container-low p-2 px-3 rounded-2xl border border-outline-variant/10">
            <ZoomOut className="w-4 h-4 text-outline" />
            <input
              type="range"
              min="1"
              max="3"
              step="0.01"
              value={zoom}
              onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
              className="flex-1 accent-primary h-1 bg-outline-variant rounded-lg appearance-none cursor-pointer"
            />
            <ZoomIn className="w-4 h-4 text-outline" />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 w-full">
            <button
              type="button"
              onClick={handleRotate}
              className="flex items-center justify-center gap-2 flex-1 h-11 rounded-xl bg-surface-container-high border border-outline-variant hover:bg-surface-container-highest font-sans text-sm font-semibold text-on-surface transition-standard"
            >
              <RotateCw className="w-4 h-4" /> หมุนรูป
            </button>
            
            <button
              type="button"
              onClick={handleConfirm}
              className="flex items-center justify-center gap-2 flex-1 h-11 rounded-xl bg-primary hover:bg-primary-hover font-sans text-sm font-semibold text-on-primary shadow-md active:scale-95 transition-standard"
            >
              <Check className="w-4 h-4" /> ยืนยันรูปภาพ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
