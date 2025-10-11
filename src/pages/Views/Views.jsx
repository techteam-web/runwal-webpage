import './App.css';
import { useState, useEffect, useRef } from 'react';
import APP_DATA from './data';
import TimeButtons from './components/TimeButtons';
import FloorsPanel from './components/FloorsPanel';
import SceneList from './components/SceneList';
import TitleBar from './components/TitleBar';
import { useMarzipanoViewer } from "./hooks/useMarzipanoViewer";
import { useAutorotate } from "./hooks/useAutorotate";
import { useFullscreen } from "./hooks/useFullscreen";
import { useFloorAndTimeControls } from "./hooks/useFloorAndTimeControls";
import { useInteractiveCursor } from "./hooks/useInteractiveCursor"; // ✅ NEW IMPORT

import MusicBtn from '../Home/Component/MusicBtn';
import Loader from '../Map/components/Loader';
import { useBackButtonOverride } from './hooks/useBackButtonOverride';

function Views() {
  useBackButtonOverride();
  const [isLoading, setIsLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const [interactiveCursorEnabled, setInteractiveCursorEnabled] = useState(true); // ✅ NEW STATE
  const initialized = useRef(false);

  const { viewer, scenes, currentView, switchScene } = useMarzipanoViewer();
  const { currentFloor, currentTime, changeFloor, changeTime } = useFloorAndTimeControls(scenes, switchScene);
    const presetButtonStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '10px',
    flex: 1,
    transition: 'all 0.2s ease'
  };

  
  // ✅ NEW: Interactive cursor integration
// In your Views component:
 const { 
  setSensitivity, 
  setResponsiveness, 
  currentSensitivity,
  isActive,
  isAutorotateActive,
  isInteracting  // ✅ NEW: Get interaction state
} = useInteractiveCursor(viewer, currentView, interactiveCursorEnabled && !isLoading && !showLoader);

console.log("Auto-rotate should be:", APP_DATA.settings.autorotateEnabled && !isActive && !isInteracting);
console.log("isActive:", isActive, "isInteracting:", isInteracting);
  
  useAutorotate(viewer, {
  ...APP_DATA.settings,
  autorotateEnabled: APP_DATA.settings.autorotateEnabled && !isActive && !isInteracting // ✅ ENHANCED: Stop on interaction
});
console.log("Auto-rotate currently active:", isAutorotateActive);
  useFullscreen(APP_DATA.settings.fullscreenButton);

  // ✅ Initialize after minimum delay
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const initializeViews = async () => {
      console.log("🚀 Starting Views initialization");
      await new Promise(resolve => setTimeout(resolve, 4800));
      console.log("✅ Views ready, marking as loaded");
      setIsLoading(false);
    };

    initializeViews();
  }, []);

  // ✅ Apply enhanced Marzipano styles for interactive cursor
 // In your Views.jsx useEffect where you create styles:
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
      cursor: ${interactiveCursorEnabled ? 'none' : 'default'} !important;  /* ✅ CHANGED */
      transition: cursor 0.2s ease !important;
    }
    #pano * {
      pointer-events: auto !important;
      user-select: none !important;
      -webkit-user-select: none !important;
    }
    #pano:hover {
      cursor: ${interactiveCursorEnabled ? 'none' : 'default'} !important;  /* ✅ CHANGED */
    }
  `;
  document.head.appendChild(style);
  

  return () => {
    if (style.parentNode) {
      style.parentNode.removeChild(style);
    }
  };
}, [interactiveCursorEnabled]);


  const handleLoaderFinished = () => {
    console.log("✅ Views loader fade completed");
    setShowLoader(false);
  };

  // ✅ NEW: Toggle function for interactive cursor
  const toggleInteractiveCursor = () => {
    setInteractiveCursorEnabled(!interactiveCursorEnabled);
  };

  return (
    <>
      {(isLoading || showLoader) && (
        <Loader
          videoSrc="/video.mp4"
          onFinished={handleLoaderFinished}
          dataReady={!isLoading}
        />
      )}

       <div 
        style={{
          opacity: (!isLoading && !showLoader) ? 1 : 0,
          transition: 'opacity 0.3s ease-in',
          pointerEvents: (!isLoading && !showLoader) ? 'auto' : 'none'
        }}
      >
        <div id="pano" style={{ width: '100%', height: '100vh' }}></div>
        
        {/* ✅ FIXED: Real-time cursor controls */}
        
        
        {/* ... rest of your components ... */}
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
