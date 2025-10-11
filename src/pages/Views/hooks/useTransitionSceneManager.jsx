import { useRef, useCallback } from 'react';

export function useSceneTransitionManager() {
  const transitionStateRef = useRef({
    isTransitioning: false,
    previousScene: null,
    currentScene: null,
    transitionStartTime: null,
    subscribers: []
  });

  // ✅ SUBSCRIBE TO TRANSITION EVENTS
  const subscribe = useCallback((callback) => {
    transitionStateRef.current.subscribers.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = transitionStateRef.current.subscribers.indexOf(callback);
      if (index > -1) {
        transitionStateRef.current.subscribers.splice(index, 1);
      }
    };
  }, []);

  // ✅ NOTIFY SUBSCRIBERS
  const notifySubscribers = useCallback((event, data) => {
    transitionStateRef.current.subscribers.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('Scene transition subscriber error:', error);
      }
    });
  }, []);

  // ✅ START TRANSITION
  const startTransition = useCallback((fromScene, toScene) => {
    if (transitionStateRef.current.isTransitioning) {
      console.warn('⚠️ Scene transition already in progress');
      return;
    }

    transitionStateRef.current.isTransitioning = true;
    transitionStateRef.current.previousScene = fromScene;
    transitionStateRef.current.currentScene = toScene;
    transitionStateRef.current.transitionStartTime = Date.now();

    console.log(`🎬 Scene transition started: ${fromScene?.data?.id} → ${toScene?.data?.id}`);
    
    notifySubscribers('transitionStart', {
      from: fromScene,
      to: toScene,
      timestamp: transitionStateRef.current.transitionStartTime
    });
  }, [notifySubscribers]);

  // ✅ END TRANSITION
  const endTransition = useCallback(() => {
    if (!transitionStateRef.current.isTransitioning) return;

    const duration = Date.now() - transitionStateRef.current.transitionStartTime;
    
    console.log(`✅ Scene transition completed in ${duration}ms`);
    
    notifySubscribers('transitionEnd', {
      from: transitionStateRef.current.previousScene,
      to: transitionStateRef.current.currentScene,
      duration
    });

    transitionStateRef.current.isTransitioning = false;
    transitionStateRef.current.previousScene = null;
    transitionStateRef.current.transitionStartTime = null;
  }, [notifySubscribers]);

  // ✅ ENHANCED SCENE SWITCHER WITH TRANSITION MANAGEMENT
  const createTransitionAwareSceneSwitcher = useCallback((originalSwitchScene) => {
    return (sceneObj, preserveView = false) => {
      if (!sceneObj) return;

      // Get current scene before switch
      const currentScene = transitionStateRef.current.currentScene;
      
      // Start transition tracking
      startTransition(currentScene, sceneObj);

      // Perform the actual scene switch
      const result = originalSwitchScene(sceneObj, preserveView);

      // Schedule transition end after a short delay to ensure scene is loaded
      setTimeout(() => {
        endTransition();
      }, 100);

      return result;
    };
  }, [startTransition, endTransition]);

  return {
    isTransitioning: transitionStateRef.current.isTransitioning,
    currentTransition: {
      from: transitionStateRef.current.previousScene,
      to: transitionStateRef.current.currentScene,
      startTime: transitionStateRef.current.transitionStartTime
    },
    subscribe,
    createTransitionAwareSceneSwitcher
  };
}
