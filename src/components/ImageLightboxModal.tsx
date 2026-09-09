import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Minimize2 } from 'lucide-react';

interface ImageLightboxModalProps {
  images: string[];
  initialIndex?: number;
  title?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  images,
  initialIndex = 0,
  title,
  isOpen,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  // Sync index when initialIndex changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setIsZoomed(false);
    }
  }, [initialIndex, isOpen]);

  const handlePrev = useCallback(() => {
    if (images.length <= 1) return;
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const handleNext = useCallback(() => {
    if (images.length <= 1) return;
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 backdrop-blur-md animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      {/* Top Header Bar */}
      <div
        className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-black/60 border-b border-white/10 z-20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-600 text-white shadow-xs">
            UNCROPPED VIEW
          </span>
          {title && (
            <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-[200px] sm:max-w-md">
              {title}
            </h3>
          )}
          {images.length > 1 && (
            <span className="text-xs font-semibold text-slate-400">
              {currentIndex + 1} of {images.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom In/Out Toggle */}
          <button
            type="button"
            onClick={() => setIsZoomed((prev) => !prev)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title={isZoomed ? 'Reset zoom' : 'Zoom 150%'}
            aria-label="Toggle zoom"
          >
            {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
          </button>

          {/* Close Lightbox */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-rose-600/80 text-white transition-colors cursor-pointer"
            title="Close viewer (Esc)"
            aria-label="Close image viewer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Stage (Uncropped object-contain) */}
      <div
        className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-auto min-h-0"
        onClick={onClose}
      >
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-3 sm:left-6 z-20 p-2.5 sm:p-3 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xl"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-3 sm:right-6 z-20 p-2.5 sm:p-3 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xl"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Uncropped Full Image */}
        <div
          className={`relative max-w-full max-h-full flex items-center justify-center transition-transform duration-200 ${
            isZoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setIsZoomed((prev) => !prev);
          }}
        >
          <img
            src={currentImage}
            alt={title || `Product photo ${currentIndex + 1}`}
            className="max-h-[78vh] max-w-[92vw] w-auto h-auto object-contain rounded-xl shadow-2xl transition-all"
            draggable={false}
          />
        </div>
      </div>

      {/* Bottom Thumbnail Strip & Controls */}
      <div
        className="flex items-center justify-between px-4 sm:px-6 py-3 bg-black/75 border-t border-white/10 z-20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="hidden sm:block text-xs text-slate-400 font-medium">
          Use <span className="text-white font-bold">←</span> and <span className="text-white font-bold">→</span> keys to navigate • Press <span className="text-white font-bold">Esc</span> to close
        </div>

        {/* Multi-image thumbnail bar */}
        {images.length > 1 ? (
          <div className="flex items-center gap-2 overflow-x-auto mx-auto sm:mx-0 no-scrollbar py-1">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setIsZoomed(false);
                  setCurrentIndex(idx);
                }}
                className={`relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  currentIndex === idx
                    ? 'border-emerald-500 scale-110 shadow-lg'
                    : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        ) : (
          <div className="text-xs text-slate-400 text-center w-full sm:w-auto">
            Viewing full uncropped product photograph
          </div>
        )}

        <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Full Aspect Ratio</span>
        </div>
      </div>
    </div>
  );
};
