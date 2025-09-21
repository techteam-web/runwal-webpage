import { useEffect } from "react";

export function useFullscreen(enabled) {
  useEffect(() => {
    if (!enabled) return;
    const screenfull = window.screenfull;

    if (screenfull && screenfull.enabled) {
      document.body.classList.add("fullscreen-enabled");
    } else {
      document.body.classList.add("fullscreen-disabled");
    }
  }, [enabled]);
}
