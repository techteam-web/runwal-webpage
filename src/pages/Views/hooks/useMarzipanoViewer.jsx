import { useEffect, useState } from "react";
import APP_DATA from "../data";

export function useMarzipanoViewer() {
  const [viewer, setViewer] = useState(null);
  const [scenes, setScenes] = useState([]);
  const [currentView, setCurrentView] = useState(null);

  useEffect(() => {
    const Marzipano = window.Marzipano;
    const data = APP_DATA;
    const panoElement = document.querySelector("#pano");

    if (!Marzipano || !panoElement) return;

    const viewerOpts = { controls: { mouseViewMode: data.settings.mouseViewMode } };
    const viewerInstance = new Marzipano.Viewer(panoElement, viewerOpts);

    const scenesList = data.scenes.map((sceneData) => {
      const source = Marzipano.ImageUrlSource.fromString(
        `/tiles/${sceneData.id}/{z}/{f}/{y}/{x}.jpg`,
        { cubeMapPreviewUrl: `/tiles/${sceneData.id}/preview.jpg`,
          allbackUrl: (tile) => {
      console.error('Failed to load tile:', tile);
      return null;}
      }
      );
      console.log('Scene ID:', sceneData.id);
console.log('Attempting to load tiles from:', `/tiles/${sceneData.id}/`);
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('Fetching:', args[0]);
  return originalFetch.apply(this, args)
    .then(response => {
      if (!response.ok) {
        console.error('Failed to fetch:', args[0], response.status);
      }
      return response;
    })
    .catch(error => {
      console.error('Network error:', args[0], error);
      throw error;
    });
  }
      const geometry = new Marzipano.CubeGeometry(sceneData.levels);
      const view = new Marzipano.RectilinearView(sceneData.initialViewParameters);
      const scene = viewerInstance.createScene({ source, geometry, view, pinFirstLevel: true });

      return { data: sceneData, scene, view };
    });

    setViewer(viewerInstance);
    setScenes(scenesList);

    return () => viewerInstance.destroy?.();
  }, []);

  const switchScene = (sceneObj,preserveView = false) => {
    if (!sceneObj) return;
     // Store current camera position before switching
  let currentViewParams = null;
  if (preserveView && currentView) {
    currentViewParams = {
      yaw: currentView.yaw(),
      pitch: currentView.pitch(),
      fov: currentView.fov()
    };
    console.log("🎥 Preserving camera position:", currentViewParams);
  }
  
  // Switch to new scene
  sceneObj.scene.switchTo();
  
  // Apply preserved view or reset to initial
  if (currentViewParams) {
    sceneObj.view.setParameters(currentViewParams);
  } else {
    sceneObj.view.setParameters(sceneObj.data.initialViewParameters);
  }
  
  setCurrentView(sceneObj.view);
  };

  return { viewer, scenes, currentView, switchScene };
}

