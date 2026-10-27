import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";


/**
 * Updated FloorPlanModal with zoom functionality
 * Props:
 * - floor: { id, plans: [] }
 * - highlight: { id, name, planImages: [] }
 * - onClose: () => void
 * - onOpenComparison: (floor) => void
 */
export default function FloorPlanModal({ floor, highlight, onClose, onOpenComparison }) {
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false); // Track zoom state


  // ✅ UPDATED: Use plans array from floor or planImages from highlight
  const isHighlight = !!highlight && !floor;
  const images = isHighlight
    ? (highlight?.planImages || [])
    : (floor?.plans || []);
  const labels = (isHighlight ? highlight?.labels : floor?.labels) || [];


  const titlePrefix = isHighlight
    ? (highlight?.name || "Plans")
    : (floor?.id ? `Floor Plan` : "Plans");


  useEffect(() => {
    if (modalRef.current && overlayRef.current) {
      gsap.set(overlayRef.current, { opacity: 0 });
      gsap.set(modalRef.current, { scale: 0.95, opacity: 0 });
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.3 });
      gsap.to(modalRef.current, { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" });
    }
  }, []);


  const handleClose = () => {
    gsap.to(modalRef.current, {
      scale: 0.95,
      opacity: 0,
      duration: 0.2,
      onComplete: () => onClose?.()
    });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 });
  };


  // ✅ Handle opening comparison modal
  const handleOpenComparison = () => {
    gsap.to(modalRef.current, {
      scale: 0.95,
      opacity: 0,
      duration: 0.2,
      onComplete: () => onOpenComparison?.(floor)
    });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 });
  };

  // ✅ Track zoom state changes
  const handleTransform = (ref) => {
    const scale = ref.instance.transformState.scale;
    setIsZoomed(scale > 1);
  };


  if (!images || images.length === 0) {
    return (
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/20 backdrop-blur-lg z-50 flex items-center justify-center p-4"
        onClick={(e) => { if (e.target === overlayRef.current) handleClose(); }}
      >
        <div
          ref={modalRef}
          className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{titlePrefix}</h3>
          <p className="text-gray-600 mb-6">No images available.</p>
          <button
            onClick={handleClose}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }


  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/20 backdrop-blur-lg z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === overlayRef.current) handleClose(); }}
    >
      <div
        ref={modalRef}
        className="relative bg-[#FFF7EA] rounded-2xl shadow-2xl max-w-6xl max-h-[100vh] w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 z-50 w-12 h-12 bg-black/10 hover:bg-black/20 rounded-full flex items-center justify-center transition-all"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>


        {/* Main Image area with Zoom */}
        <div className="relative h-[70vh] flex items-center justify-center bg-[#FFF7EA]">
          <TransformWrapper
            initialScale={1}
            minScale={1}
            maxScale={4}
            centerOnInit={true}
            wheel={{ step: 0.1 }}
            doubleClick={{ mode: "reset" }}
            panning={{ velocityDisabled: true }}
            onTransformed={handleTransform}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                {/* Zoom Controls */}
                <div className="absolute top-4 left-4 z-40 flex flex-col gap-2">
                  <button
                    onClick={() => zoomIn()}
                    className="w-10 h-10 bg-white/90 hover:bg-white text-gray-800 rounded-lg shadow-lg flex items-center justify-center transition-all hover:scale-105"
                    aria-label="Zoom in"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  <button
                    onClick={() => zoomOut()}
                    className="w-10 h-10 bg-white/90 hover:bg-white text-gray-800 rounded-lg shadow-lg flex items-center justify-center transition-all hover:scale-105"
                    aria-label="Zoom out"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <button
                    onClick={() => resetTransform()}
                    className="w-10 h-10 bg-white/90 hover:bg-white text-gray-800 rounded-lg shadow-lg flex items-center justify-center transition-all hover:scale-105"
                    aria-label="Reset zoom"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>


                <TransformComponent
                  wrapperStyle={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  contentStyle={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={images[currentImageIndex]}
                    alt={`${titlePrefix} ${currentImageIndex + 1}`}
                    className="max-w-[calc(100%-10rem)] max-h-[calc(100%-6rem)] mt-10 object-contain select-none"
                    loading="lazy"
                    draggable={false}
                  />
                </TransformComponent>
              </>
            )}
          </TransformWrapper>


          {/* Golden Level Label - Only show when not zoomed in */}
          {!isZoomed && (
            <div
              className="
                absolute top-4 md:top-6 left-1/2 -translate-x-1/2 z-20 select-none pointer-events-none
                text-transparent bg-clip-text
                font-extrabold leading-tight
                px-2 md:px-3
              "
              style={{
                fontSize: 'clamp(1.125rem, 2.5vw, 2.125rem)',
                letterSpacing: '0.06em',
                backgroundImage: 'linear-gradient(90deg, #D4AF37 0%, #EBD58A 50%, #D4AF37 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                fontFamily:"Zap"
              }}
            >
              {labels[currentImageIndex] || `Level ${currentImageIndex + 1}`}
            </div>
          )}


          {/* Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => setCurrentImageIndex((i) => (i - 1 + images.length) % images.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 hover:bg-white text-gray-800 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 z-30"
                aria-label="Previous image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentImageIndex((i) => (i + 1) % images.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 hover:bg-white text-gray-800 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 z-30"
                aria-label="Next image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>


        {/* Dots */}
        {images.length > 1 && (
          <div className="py-4 bg-[#FFF7EA] border-t border-gray-100">
            {/* Centered Dots */}
            <div className="flex items-center justify-center space-x-3 flex-shrink-0">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`transition-all duration-200 ${
                    index === currentImageIndex 
                      ? 'w-8 h-2 bg-yellow-500 rounded-full' 
                      : 'w-2 h-2 bg-gray-300 hover:bg-gray-400 rounded-full'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
