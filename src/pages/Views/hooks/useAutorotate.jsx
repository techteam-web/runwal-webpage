import { useEffect, useRef, useCallback } from "react";

export function useAutorotate(viewer, settings, sceneTransitionManager = null) {
  const autorotateRef = useRef(null);
  const isActiveRef = useRef(false);
  const savedStateRef = useRef(null);
  const transitionTimeoutRef = useRef(null);
  const lastViewerRef = useRef(null);
  const isTransitioningRef = useRef(false);

  // ✅ SCENE TRANSITION DETECTION
  const sceneTransitionDetector = useRef({
    currentSceneId: null,
    isTransitioning: false,
    transitionStartTime: null,
    transitionDelay: 2000, // 2 second delay after scene change
    restoreTimeout: null
  });

  // ✅ PRESERVE AUTOROTATE STATE
  const preserveAutorotateState = useCallback(() => {
    if (isActiveRef.current && autorotateRef.current) {
      savedStateRef.current = {
        wasActive: true,
        settings: { ...settings },
        timestamp: Date.now()
      };
      console.log('💾 Autorotate state preserved for scene transition');
    }
  }, [settings]);

  // ✅ RESTORE AUTOROTATE STATE WITH DELAY
  const restoreAutorotateState = useCallback(() => {
    if (!viewer || !savedStateRef.current) return;

    console.log('🔄 Attempting to restore autorotate after scene transition...');
    
    // Clear any existing timeout
    if (sceneTransitionDetector.current.restoreTimeout) {
      clearTimeout(sceneTransitionDetector.current.restoreTimeout);
    }

    sceneTransitionDetector.current.restoreTimeout = setTimeout(() => {
      if (savedStateRef.current?.wasActive && settings.autorotateEnabled) {
        console.log('✅ Restoring autorotate after scene transition delay');
        startAutorotate();
        savedStateRef.current = null; // Clear saved state
      }
      sceneTransitionDetector.current.isTransitioning = false;
    }, sceneTransitionDetector.current.transitionDelay);

  }, [viewer, settings]);

  // ✅ START AUTOROTATE FUNCTION
  const startAutorotate = useCallback(() => {
    if (!viewer || isActiveRef.current) return;

    try {
      // Create fresh autorotate instance
      autorotateRef.current = window.Marzipano.autorotate({
        yawSpeed: 0.02, // Slower rotation
        targetPitch: 0,
        targetFov: Math.PI / 2,
      });

      console.log("🔄 Starting auto-rotate");
      viewer.startMovement(autorotateRef.current);
      viewer.setIdleMovement(1000, autorotateRef.current); // 1 second idle delay
      isActiveRef.current = true;
    } catch (error) {
      console.error("❌ Failed to start autorotate:", error);
    }
  }, [viewer]);

  // ✅ STOP AUTOROTATE FUNCTION
  const stopAutorotate = useCallback(() => {
    if (!viewer || !isActiveRef.current) return;

    try {
      console.log("⏹️ Stopping auto-rotate");
      viewer.stopMovement();
      viewer.setIdleMovement(Infinity);
      isActiveRef.current = false;
    } catch (error) {
      console.error("❌ Failed to stop autorotate:", error);
    }
  }, [viewer]);

  // ✅ SCENE CHANGE DETECTION AND HANDLING
  useEffect(() => {
    if (!viewer || !settings) return;

    // Detect scene transitions by checking current view
    const currentScene = viewer.view?.()?.scene;
    const currentSceneId = currentScene?.data?.id || viewer.scene?.()?.data?.id;
    
    if (currentSceneId && sceneTransitionDetector.current.currentSceneId !== currentSceneId) {
      const previousSceneId = sceneTransitionDetector.current.currentSceneId;
      
      if (previousSceneId !== null) {
        // Scene transition detected
        console.log(`🎬 Scene transition detected: ${previousSceneId} → ${currentSceneId}`);
        
        // Preserve current autorotate state
        preserveAutorotateState();
        
        // Mark as transitioning
        sceneTransitionDetector.current.isTransitioning = true;
        sceneTransitionDetector.current.transitionStartTime = Date.now();
        
        // Temporarily stop autorotate
        if (isActiveRef.current) {
          stopAutorotate();
        }
        
        // Schedule restore after delay
        restoreAutorotateState();
      }
      
      sceneTransitionDetector.current.currentSceneId = currentSceneId;
    }
  }, [viewer, settings, preserveAutorotateState, restoreAutorotateState, stopAutorotate]);

  // ✅ DECOUPLED AUTOROTATE MANAGEMENT - Only responds to settings changes, not viewer changes during transitions
  useEffect(() => {
    if (!viewer || !settings) return;

    // Skip autorotate changes during scene transitions
    if (sceneTransitionDetector.current.isTransitioning) {
      console.log('⏸️ Skipping autorotate update during scene transition');
      return;
    }

    // Handle autorotate enable/disable based on interaction and settings
    const shouldBeActive = settings.autorotateEnabled && 
                          !settings.isInteracting && 
                          !settings.isUserActive;

    if (shouldBeActive && !isActiveRef.current) {
      startAutorotate();
    } else if (!shouldBeActive && isActiveRef.current) {
      stopAutorotate();
    }

    // Cleanup function
    return () => {
      // Only cleanup if we're not in a transition
      if (!sceneTransitionDetector.current.isTransitioning && isActiveRef.current) {
        stopAutorotate();
      }
    };
  }, [settings.autorotateEnabled, settings.isInteracting, settings.isUserActive, startAutorotate, stopAutorotate]);

  // ✅ VIEWER CHANGE DETECTION - Separated from settings
  useEffect(() => {
    if (viewer !== lastViewerRef.current) {
      console.log('👁️ Viewer instance changed');
      
      // If we have a saved state and this isn't during a transition, restore it
      if (savedStateRef.current && !sceneTransitionDetector.current.isTransitioning) {
        restoreAutorotateState();
      }
      
      lastViewerRef.current = viewer;
    }
  }, [viewer, restoreAutorotateState]);

  // ✅ CLEANUP ON UNMOUNT
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
      if (sceneTransitionDetector.current.restoreTimeout) {
        clearTimeout(sceneTransitionDetector.current.restoreTimeout);
      }
      if (isActiveRef.current && viewer) {
        stopAutorotate();
      }
    };
  }, [viewer, stopAutorotate]);

  // ✅ PUBLIC API
  const manualStart = useCallback(() => {
    sceneTransitionDetector.current.isTransitioning = false;
    if (settings.autorotateEnabled) {
      startAutorotate();
    }
  }, [settings.autorotateEnabled, startAutorotate]);

  const manualStop = useCallback(() => {
    preserveAutorotateState();
    stopAutorotate();
  }, [preserveAutorotateState, stopAutorotate]);

  const setTransitionDelay = useCallback((delay) => {
    sceneTransitionDetector.current.transitionDelay = Math.max(500, Math.min(5000, delay));
  }, []);

  return {
    isActive: isActiveRef.current,
    isTransitioning: sceneTransitionDetector.current.isTransitioning,
    manualStart,
    manualStop,
    setTransitionDelay,
    savedState: savedStateRef.current
  };
}
