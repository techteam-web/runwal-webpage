// components/Loader.jsx - RESPONSIVE TAILWIND VERSION
import { useRef, useState, useEffect } from "react";

export default function Loader({ onFinished, videoSrc = "/video.mp4", dataReady = false }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoLoaded = () => {
      const desiredDuration = 4;
      const actualDuration = video.duration;
      const playbackRate = Math.max(actualDuration / desiredDuration, 1.2);
      
      video.playbackRate = playbackRate;
      console.log(`✅ Video: ${actualDuration}s at ${playbackRate}x speed`);
      video.play().catch(e => console.warn("Video play failed:", e));
    };

    const handleVideoEnded = () => {
      console.log("✅ Video playback completed");
      setVideoEnded(true);
    };

    video.addEventListener('loadedmetadata', handleVideoLoaded);
    video.addEventListener('ended', handleVideoEnded);

    return () => {
      video.removeEventListener('loadedmetadata', handleVideoLoaded);
      video.removeEventListener('ended', handleVideoEnded);
    };
  }, []);

  // ✅ FIXED: Only start fade when BOTH video ended AND data is ready
  useEffect(() => {
    if (videoEnded && dataReady && !isTransitioning) {
      console.log("✅ Both video ended and data ready - starting fade transition");
      setIsTransitioning(true);
      
      // ✅ Call onFinished AFTER fade completes
      setTimeout(() => {
        console.log("✅ Fade transition completed - calling onFinished");
        onFinished?.();
      }, 300); // Match the CSS transition duration exactly
    }
  }, [videoEnded, dataReady, isTransitioning, onFinished]);

  return (
    <div 
      className={`
        fixed  inset-0 w-full h-full bg-white 
        flex items-center justify-center 
        z-[9999] transition-opacity duration-700 ease-out
        ${isTransitioning ? 'opacity-0' : 'opacity-100' }
      `}
    >
      {/* ✅ RESPONSIVE VIDEO - Fits all screen sizes properly */}
      <video
        ref={videoRef}
        src={videoSrc}
        muted
        playsInline
        preload="auto"
        className={`
          w-screen h-screen object-cover
          max-sm:hidden max-sm:h-full max-sm:object-cover
          max-md:w-full max-md:h-full max-md:object-cover
          max-lg:w-full max-lg:h-full max-lg:object-cover
        `}
        onError={(e) => {
          console.error("❌ Video error:", e.target.error);
          setVideoEnded(true); // Treat error as video ended
        }}
      />
      <div className="absolute inset-0 max-lg:hidden max-md:hidden max-sm:flex w-full h-full bg-[#f6f6f6] flex items-center justify-center">
        <video
        ref={videoRef}
        src={videoSrc}
        muted
        playsInline
        preload="auto"
        className={`
          w-fit h-fit object-cover
       
        `}
        onError={(e) => {
          console.error("❌ Video error:", e.target.error);
          setVideoEnded(true); // Treat error as video ended
        }}
      />

      </div>
      
      {/* ✅ RESPONSIVE LOADING INDICATOR */}
      {videoEnded && !dataReady && (
        <div 
          className={`
            absolute 
            bottom-4 left-1/2 transform -translate-x-1/2
            max-sm:bottom-3 max-sm:px-4 max-sm:py-2 max-sm:text-sm
            max-md:bottom-4 max-md:px-5 max-md:py-3 max-md:text-base
            max-lg:bottom-5 max-lg:px-6 max-lg:py-3 max-lg:text-base
            xl:bottom-6 xl:px-7 xl:py-4 xl:text-lg
            text-black bg-white/90 
            px-6 py-4 rounded-full 
            border border-gray-200 
            shadow-lg backdrop-blur-sm
            text-base font-medium
            transition-all duration-300
            max-w-[90vw] text-center
          `}
        >
          Loading...
        </div>
      )}
    </div>
  );
}
