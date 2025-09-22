import './App.css';
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
import { useEffect } from 'react';


function Views() {
   const { viewer, scenes, currentView, switchScene } = useMarzipanoViewer();
   const { currentFloor, currentTime, changeFloor, changeTime } =
    useFloorAndTimeControls(scenes, switchScene);
  useAutorotate(viewer, APP_DATA.settings);
  useFullscreen(APP_DATA.settings.fullscreenButton);

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
  return (
    <>
      <div id="pano" style={{ width: "100%", height: "100vh" }}></div>
      <SceneList 
      scenes={scenes} 
      currentSceneId={currentView?.scene?.data?.id} 
      onSelect={switchScene}/>
      <FloorsPanel current={currentFloor} onSelect={changeFloor} />
      
      
   
      <TitleBar/>
      <TimeButtons current={currentTime} onSelect={changeTime} />
     
 </>
  );
}

export default Views;
