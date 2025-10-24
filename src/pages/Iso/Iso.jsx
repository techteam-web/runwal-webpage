import React, { useEffect, useState } from "react";
import Experience from "./components/Experience";

const App = () => {
  const [isLandscape, setIsLandscape] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

    updateStatus(); // run once

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
      el.webkitRequestFullscreen(); // Safari
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen(); // IE/Edge
    }
  };

  // 🚀 Rendering logic
  const shouldShowExperience = () => {
    if (!isLandscape) return false; // must be landscape
    if (isMobile && !isFullscreen) return false; // mobile requires fullscreen
    return true; // desktop or mobile in fullscreen
  };
  return (
    <>
      {!shouldShowExperience() ? (
        <div className="w-full h-full fixed inset-0 flex flex-col gap-3 items-center justify-center bg-black text-white text-xl z-50 p-4 text-center">
          {!isLandscape && (
            <p>Please rotate your device to landscape mode 📱↔️</p>
          )}

          {isMobile && !isFullscreen && (
            <button
              onClick={goFullscreen}
              className="mt-4 bg-white text-black px-6 py-3 rounded-lg shadow-md hover:bg-gray-200"
            >
              Enter Fullscreen mode
            </button>
          )}
        </div>
      ) : (
        <div className="w-screen h-screen">
          <Experience />
        </div>
      )}
      {/* <div className="w-screen h-screen">
          <Experience />
        </div> */}
    </>
  );
};

export default App;