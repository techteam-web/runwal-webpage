import { useEffect, useRef, useState } from "react";
import Experience from "./components/Experience";
import MusicBtn from "../Home/Component/MusicBtn";
import { useBackButtonOverride } from "../Views/hooks/useBackButtonOverride";

const Map = () => {
  useBackButtonOverride();
  const [isLandscape, setIsLandscape] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);

  // Detect mobile once on mount
  useEffect(() => {
    const mobileCheck = /Mobi|Android|iPhone|iPod/i.test(navigator.userAgent);
    setIsMobile(mobileCheck);
  }, []);

  // Track fullscreen state
  useEffect(() => {
    const updateStatus = () => {
      const fsElement =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement;
      setIsFullscreen(!!fsElement);
    };

    document.addEventListener("fullscreenchange", updateStatus);
    document.addEventListener("webkitfullscreenchange", updateStatus);
    document.addEventListener("msfullscreenchange", updateStatus);

    updateStatus();

    return () => {
      document.removeEventListener("fullscreenchange", updateStatus);
      document.removeEventListener("webkitfullscreenchange", updateStatus);
      document.removeEventListener("msfullscreenchange", updateStatus);
    };
  }, []);

  // Track orientation
  const checkOrientation = () => {
    const landscape =
      window.matchMedia("(orientation: landscape)").matches ||
      window.innerWidth > window.innerHeight;
    setIsLandscape(landscape);
  };

  useEffect(() => {
    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  // Fullscreen handler
  const goFullscreen = () => {
    const el = document.body;
    if (!el) return;

    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen();
    }
  };

  // 🚀 Rendering logic
  const shouldShowExperience = () => {
    if (!isLandscape) return false;
    if (isMobile && !isFullscreen) return false;
    return true;
  };

  return (
    <>
      {!shouldShowExperience() ? (
        <div className="w-full h-full fixed inset-0 flex flex-col gap-3 items-center justify-center bg-white text-black text-xl z-50 p-4 text-center">
          {!isLandscape && <p>Please rotate your device to landscape mode 📱↔️</p>}

          {isMobile && !isFullscreen && (
            <button
              onClick={goFullscreen}
              className="mt-4 bg-black text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-800"
            >
              Enter Fullscreen mode
            </button>
          )}
        </div>
      ) : (
        <div ref={containerRef} className="w-screen h-[100svh] overflow-hidden">
          <Experience />
        </div>
      )}
      
      <MusicBtn audioSrc="/backgroundsound.mp3" />
    </>
  );
};

export default Map;
