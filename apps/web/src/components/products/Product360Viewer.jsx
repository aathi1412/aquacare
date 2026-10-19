import React, { useState, useRef, useEffect, useCallback } from 'react';
import { RotateCw, Play, Pause, ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';

export default function Product360Viewer({
  frames = [],
  sensitivity = 1,
  productName = 'Water Purifier',
  className = '',
}) {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [loadedFrames, setLoadedFrames] = useState({});
  const [hasError, setHasError] = useState(false);

  const startXRef = useRef(0);
  const startIndexRef = useRef(0);
  const containerRef = useRef(null);
  const autoRotateIntervalRef = useRef(null);

  // Sort frames by order
  const sortedFrames = React.useMemo(() => {
    return [...frames].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [frames]);

  const totalFrames = sortedFrames.length;

  // Preload nearby images
  useEffect(() => {
    if (totalFrames === 0) return;

    // Load initial 3 frames immediately, then lazy load the rest
    const framesToPreload = [
      currentFrameIndex,
      (currentFrameIndex + 1) % totalFrames,
      (currentFrameIndex - 1 + totalFrames) % totalFrames,
    ];

    framesToPreload.forEach((idx) => {
      const frameUrl = sortedFrames[idx]?.url;
      if (frameUrl && !loadedFrames[idx]) {
        const img = new Image();
        img.src = frameUrl;
        img.onload = () => setLoadedFrames((prev) => ({ ...prev, [idx]: true }));
        img.onerror = () => setHasError(true);
      }
    });
  }, [currentFrameIndex, sortedFrames, totalFrames, loadedFrames]);

  // Handle Drag Start (Mouse & Touch)
  const handleStart = (clientX) => {
    setIsDragging(true);
    setIsAutoRotating(false);
    startXRef.current = clientX;
    startIndexRef.current = currentFrameIndex;
  };

  // Handle Drag Move
  const handleMove = useCallback(
    (clientX) => {
      if (!isDragging || totalFrames <= 1) return;
      const deltaX = clientX - startXRef.current;
      // Adjust step by container width and sensitivity
      const stepWidth = 15 / (sensitivity || 1);
      const frameOffset = Math.round(deltaX / stepWidth);

      let newIndex = (startIndexRef.current - frameOffset) % totalFrames;
      if (newIndex < 0) newIndex += totalFrames;

      setCurrentFrameIndex(newIndex);
    },
    [isDragging, totalFrames, sensitivity]
  );

  // Handle Drag End
  const handleEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Mouse Listeners
  const onMouseDown = (e) => {
    e.preventDefault();
    handleStart(e.clientX);
  };

  useEffect(() => {
    const onMouseMove = (e) => handleMove(e.clientX);
    const onMouseUp = () => handleEnd();

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, handleMove, handleEnd]);

  // Touch Listeners
  const onTouchStart = (e) => {
    if (e.touches.length === 1) {
      handleStart(e.touches[0].clientX);
    }
  };

  const onTouchMove = (e) => {
    if (isDragging && e.touches.length === 1) {
      handleMove(e.touches[0].clientX);
    }
  };

  const onTouchEnd = () => handleEnd();

  // Auto-rotation toggle
  useEffect(() => {
    if (isAutoRotating && totalFrames > 1) {
      autoRotateIntervalRef.current = setInterval(() => {
        setCurrentFrameIndex((prev) => (prev + 1) % totalFrames);
      }, 120);
    } else {
      if (autoRotateIntervalRef.current) {
        clearInterval(autoRotateIntervalRef.current);
      }
    }
    return () => {
      if (autoRotateIntervalRef.current) clearInterval(autoRotateIntervalRef.current);
    };
  }, [isAutoRotating, totalFrames]);

  const stepFrame = (direction) => {
    setIsAutoRotating(false);
    setCurrentFrameIndex((prev) => {
      let next = (prev + direction) % totalFrames;
      if (next < 0) next += totalFrames;
      return next;
    });
  };

  if (totalFrames === 0) {
    return (
      <div className="flex items-center justify-center h-80 bg-slate-100 rounded-2xl text-slate-400">
        No 360-degree frames available.
      </div>
    );
  }

  const currentFrame = sortedFrames[currentFrameIndex] || sortedFrames[0];

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* 360 Badge & Interactive hint */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-md">
        <RotateCw className="w-3.5 h-3.5 text-brand-400 animate-spin-slow" />
        <span>360° Interactive View</span>
      </div>

      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold text-slate-700 shadow-sm border border-slate-200">
        <span>Frame {currentFrameIndex + 1}/{totalFrames}</span>
      </div>

      {/* Main Frame Viewer Area */}
      <div
        ref={containerRef}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className={`relative w-full aspect-square max-h-[480px] flex items-center justify-center bg-gradient-to-b from-white via-slate-50 to-slate-100 rounded-3xl border border-slate-200/80 overflow-hidden shadow-inner cursor-grab-active transition-all ${
          isDragging ? 'cursor-grabbing scale-[0.995]' : ''
        }`}
        role="region"
        aria-label={`360 degree view of ${productName}. Frame ${currentFrameIndex + 1} of ${totalFrames}`}
      >
        <img
          src={currentFrame?.url}
          alt={`${productName} 360 frame ${currentFrameIndex + 1}`}
          className="max-h-full max-w-full object-contain pointer-events-none drop-shadow-md transition-opacity duration-75"
          draggable="false"
        />

        {/* Subtle drag cue indicator on center */}
        {!isDragging && !isAutoRotating && (
          <div className="absolute bottom-6 bg-slate-900/60 backdrop-blur-sm text-white px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 pointer-events-none shadow-lg animate-pulse">
            <RotateCw className="w-3.5 h-3.5 text-aqua-400" />
            <span>Drag horizontally to rotate</span>
          </div>
        )}
      </div>

      {/* Control bar */}
      <div className="flex items-center justify-between w-full mt-4 px-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => stepFrame(-1)}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition shadow-sm"
            aria-label="Previous rotation frame"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => stepFrame(1)}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition shadow-sm"
            aria-label="Next rotation frame"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition shadow-sm ${
              isAutoRotating
                ? 'bg-brand-50 border-brand-300 text-brand-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {isAutoRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAutoRotating ? 'Pause' : 'Auto-Spin'}</span>
          </button>
        </div>

        {/* Progress Dots / Slider */}
        <div className="flex items-center gap-1">
          <input
            type="range"
            min="0"
            max={totalFrames - 1}
            value={currentFrameIndex}
            onChange={(e) => {
              setIsAutoRotating(false);
              setCurrentFrameIndex(Number(e.target.value));
            }}
            className="w-24 sm:w-32 accent-brand-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            aria-label="Rotation angle slider"
          />
        </div>
      </div>
    </div>
  );
}
