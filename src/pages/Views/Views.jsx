import './App.css';
import { useState, useEffect, useRef } from 'react';
import APP_DATA from './data';
import TimeButtons from './components/TimeButtons';
import FloorsPanel from './components/FloorsPanel';
import Compass from './components/Compass';
import SceneList from './components/SceneList';
import TitleBar from './components/TitleBar';
import { useMarzipanoViewer } from "./hooks/useMarzipanoViewer";
import { useAutorotate } from "./hooks/useAutorotate";
import { useFullscreen } from "./hooks/useFullscreen";
import { useFloorAndTimeControls } from "./hooks/useFloorAndTimeControls";
import Navbar from './components/Navbar';
import MusicBtn from '../Home/Component/MusicBtn';
import Loader from '../Map/components/Loader';

function Views() {
  // ✅ NEW: Loader states
  const [isLoading, setIsLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const initialized = useRef(false);

  const { viewer, scenes, currentView, switchScene } = useMarzipanoViewer();
  const { currentFloor, currentTime, changeFloor, changeTime } = useFloorAndTimeControls(scenes, switchScene);
  
  useAutorotate(viewer, APP_DATA.settings);
  useFullscreen(APP_DATA.settings.fullscreenButton);

  // ✅ FIXED: Initialize after minimum delay, regardless of Marzipano status
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const initializeViews = async () => {
      console.log("🚀 Starting Views initialization");
      
      // ✅ Just wait minimum time (Marzipano will initialize when DOM is ready)
      await new Promise(resolve => setTimeout(resolve, 4800));
      
      console.log("✅ Views ready, marking as loaded");
      setIsLoading(false);
    };

    initializeViews();
  }, []);

  // ✅ Apply Marzipano styles when component mounts (before loader finishes)
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      #pano {
        width: 100vw !important;
        height: 100vh !important;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        z-index: 1 !important;
        pointer-events: auto !important;
        touch-action: none !important;
        user-select: none !important;
        -webkit-user-select: none !important;
        -webkit-touch-callout: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }
      #pano * {
        pointer-events: auto !important;
        user-select: none !important;
        -webkit-user-select: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  // ✅ Handle loader completion
  const handleLoaderFinished = () => {
    console.log("✅ Views loader fade completed");
    setShowLoader(false);
  };

  // ✅ Always render the Views UI (so Marzipano can initialize)
  return (
    <>
      {/* ✅ Show loader overlay while needed */}
      {(isLoading || showLoader) && (
        <Loader
          videoSrc="/video.mp4"
          onFinished={handleLoaderFinished}
          dataReady={!isLoading} // Pass loading state
        />
      )}

      {/* ✅ Views UI - ALWAYS rendered so Marzipano can initialize */}
      <div 
        style={{
          opacity: (!isLoading && !showLoader) ? 1 : 0,
          transition: 'opacity 0.3s ease-in',
          pointerEvents: (!isLoading && !showLoader) ? 'auto' : 'none'
        }}
      >
        <div id="pano" style={{ width: '100%', height: '100vh' }}></div>
        
        <SceneList 
          scenes={scenes} 
          currentSceneId={currentView?.scene?.data?.id} 
          onSelect={switchScene} 
        />
        
        <FloorsPanel 
          current={currentFloor} 
          onSelect={changeFloor} 
        />
        
        <TitleBar />
        
        <TimeButtons 
          current={currentTime} 
          onSelect={changeTime} 
        />

        <MusicBtn audioSrc="/backgroundsound.mp3" />
      </div>
    </>
  );
}

export default Views;
