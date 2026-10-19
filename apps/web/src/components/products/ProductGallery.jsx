import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, RotateCw, Image as ImageIcon } from 'lucide-react';
import Modal from '../common/Modal.jsx';
import Product360Viewer from './Product360Viewer.jsx';

export default function ProductGallery({
  images = [],
  threeSixty = null,
  productName = 'Water Purifier',
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [viewMode, setViewMode] = useState('gallery'); // 'gallery' | '360'
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Normalize image list
  const safeImages = images.length > 0
    ? [...images].sort((a, b) => (a.order || 0) - (b.order || 0))
    : [
        {
          url: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=1000&q=80',
          alt: `${productName} view`,
          isPrimary: true,
        },
      ];

  const currentImage = safeImages[selectedIndex] || safeImages[0];
  const has360 = Boolean(threeSixty?.isEnabled && threeSixty?.frames?.length > 1);

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % safeImages.length);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Mode Switcher: Gallery vs 360 View */}
      {has360 && (
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit self-center sm:self-start">
          <button
            type="button"
            onClick={() => setViewMode('gallery')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              viewMode === 'gallery'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-brand-600" />
            <span>Photo Gallery ({safeImages.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('360')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              viewMode === '360'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <RotateCw className="w-4 h-4" />
            <span>Interactive 360° View</span>
          </button>
        </div>
      )}

      {/* Render 360 Mode */}
      {viewMode === '360' && has360 ? (
        <Product360Viewer
          frames={threeSixty.frames}
          sensitivity={threeSixty.sensitivity || 1}
          productName={productName}
        />
      ) : (
        /* Render Standard Gallery Mode */
        <div className="flex flex-col gap-4">
          {/* Main Large Image Container */}
          <div className="relative group w-full aspect-square max-h-[480px] bg-white rounded-3xl border border-slate-200/80 p-6 flex items-center justify-center overflow-hidden shadow-sm hover:shadow-md transition">
            <img
              src={currentImage.url}
              alt={currentImage.alt || `${productName} photo ${selectedIndex + 1}`}
              className="max-h-full max-w-full object-contain drop-shadow transition-transform duration-300 group-hover:scale-105"
            />

            {/* Next / Previous controls (if > 1 image) */}
            {safeImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md border border-slate-200 text-slate-700 flex items-center justify-center opacity-90 sm:opacity-0 group-hover:opacity-100 hover:bg-white hover:text-brand-600 transition"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md border border-slate-200 text-slate-700 flex items-center justify-center opacity-90 sm:opacity-0 group-hover:opacity-100 hover:bg-white hover:text-brand-600 transition"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Zoom / Lightbox button */}
            <button
              type="button"
              onClick={() => setIsZoomOpen(true)}
              className="absolute top-4 right-4 p-2.5 rounded-xl bg-white/90 backdrop-blur-sm shadow-sm border border-slate-200 text-slate-600 hover:text-brand-600 hover:bg-white transition"
              aria-label="Zoom image"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Thumbnails Row */}
          {safeImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {safeImages.map((img, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedIndex(idx)}
                    className={`relative w-20 h-20 rounded-2xl p-2 bg-white border shrink-0 transition-all overflow-hidden ${
                      isSelected
                        ? 'border-brand-600 ring-2 ring-brand-500/30 scale-105'
                        : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                    }`}
                    aria-label={`Select photo ${idx + 1}`}
                  >
                    <img
                      src={img.url}
                      alt={img.alt || `Thumbnail ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Lightbox Zoom Modal */}
      <Modal
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        title={`${productName} - Preview`}
        size="lg"
      >
        <div className="flex flex-col items-center">
          <div className="relative w-full aspect-square max-h-[600px] flex items-center justify-center bg-slate-50 rounded-2xl overflow-hidden p-4">
            <img
              src={currentImage.url}
              alt={currentImage.alt || productName}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          {currentImage.alt && (
            <p className="mt-4 text-sm text-slate-600 text-center font-medium">
              {currentImage.alt}
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
}
