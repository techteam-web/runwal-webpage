import { useEffect } from "react";

export function useAutorotate(viewer, settings) {
  useEffect(() => {
    if (!viewer || !settings) return;
    const autorotate = window.Marzipano.autorotate({
      yawSpeed: 0.03,
      targetPitch: 0,
      targetFov: Math.PI / 2,
    });

    if (settings.autorotateEnabled) {
      viewer.startMovement(autorotate);
      viewer.setIdleMovement(3000, autorotate);
    }

    return () => {
      viewer.stopMovement();
      viewer.setIdleMovement(Infinity);
    };
  }, [viewer, settings]);
}
