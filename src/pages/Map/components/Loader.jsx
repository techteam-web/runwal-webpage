// components/Loader.jsx - WHITE BACKGROUND VERSION
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
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "white", // ✅ CHANGED: White background instead of black
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        opacity: isTransitioning ? 0 : 1,
        transition: "opacity 0.8s ease-out"
      }}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        muted
        playsInline
        preload="auto"
        style={{
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
          // ✅ OPTIONAL: Add border radius or adjust video for white background
          borderRadius: "0px", // You can add border radius if needed
        }}
        onError={(e) => {
          console.error("❌ Video error:", e.target.error);
          setVideoEnded(true); // Treat error as video ended
        }}
      />
      
      {/* ✅ Loading indicator with white background styling */}
      {videoEnded && !dataReady && (
        <div style={{
          position: "absolute",
          bottom: "30px",
          left: "50%",
          transform: "translateX(-50%)",
          color: "black", // ✅ CHANGED: Black text on white background
          fontSize: "16px",
          background: "rgba(255,255,255,0.9)", // ✅ CHANGED: White background
          padding: "15px 25px",
          borderRadius: "25px",
          border: "1px solid #e0e0e0", // ✅ ADDED: Subtle border
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)", // ✅ ADDED: Subtle shadow
        }}>
          Loading ...
        </div>
      )}
    </div>
  );
}
