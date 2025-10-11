import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';

export function useInteractiveCursor(viewer, currentView, isEnabled = true) {
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const lastMouseRef = useRef({ x: 0.5, y: 0.5 });
  const isActiveRef = useRef(false);
  const tickerRef = useRef(null);
  const smoothMouseRef = useRef({ x: 0.5, y: 0.5 });
  
  // ✅ CURSOR ELEMENTS
  const cursorRef = useRef(null);
  const trailRef = useRef([]);
  const styleRef = useRef(null);
  
  // ✅ SCENE TRACKING - NEW
  const currentSceneId = useRef(null);
  
  // ✅ INTERACTION TRACKING
  const interactionRef = useRef({
    isInteracting: false,
    lastInteractionTime: 0,
    idleTimeout: null
  });
  
  // ✅ MOVEMENT TRACKING
  const velocityRef = useRef({ x: 0, y: 0, angle: 0, speed: 0 });
  
  // ✅ SETTINGS
  const sensitivityRef = useRef({
    horizontal: 0.08,
    vertical: 0.05,
  });

  const responsiveRef = useRef({
    threshold: 0.0003,
    maxSpeed: 0.025,
    smoothing: 0.12,
    idleDelay: 1500
  });

  // ✅ PERSISTENT CURSOR: Never gets removed during scene changes
  const createPersistentCursor = useCallback(() => {
    // ✅ PREVENT: Multiple cursor creation
    if (cursorRef.current && document.body.contains(cursorRef.current)) return;

    // ✅ CLEANUP: Remove any existing styles/cursors first
    const existingStyle = document.getElementById('panorama-cursor-styles');
    if (existingStyle) existingStyle.remove();
    
    const existingCursor = document.querySelector('.panorama-cursor-container');
    if (existingCursor) existingCursor.remove();

    document.body.style.cursor = 'none';

    // ✅ CREATE: New cursor
    cursorRef.current = document.createElement('div');
    cursorRef.current.className = 'panorama-cursor-container';
    cursorRef.current.innerHTML = `
      <div class="cursor-main-circle"></div>
      <div class="cursor-center-dot"></div>
    `;

    document.body.appendChild(cursorRef.current);

    // ✅ INITIALIZE: Cursor properties
    gsap.set(cursorRef.current, {
      position: 'fixed',
      top: 0,
      left: 0,
      pointerEvents: 'none',
      zIndex: 9999,
      mixBlendMode: 'difference',
      force3D: true,
      visibility: 'hidden'
    });

    gsap.set('.cursor-main-circle', {
      scale: 0,
      rotation: 0,
      transformOrigin: 'center center',
      force3D: true
    });

    // ✅ PERSISTENT STYLES
    styleRef.current = document.createElement('style');
    styleRef.current.id = 'panorama-cursor-styles';
    styleRef.current.textContent = `
      .panorama-cursor-container {
        position: fixed !important;
        width: 60px !important;
        height: 60px !important;
        pointer-events: none !important;
        z-index: 9999 !important;
        mix-blend-mode: difference !important;
        will-change: transform !important;
      }
      
      .cursor-main-circle {
        position: absolute !important;
        width: 100% !important;
        height: 100% !important;
        border: 2px solid rgba(255, 255, 255, 0.9) !important;
        border-radius: 50% !important;
        border-top: 4px solid rgba(255, 255, 255, 1) !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
        will-change: transform !important;
      }
      
      .cursor-center-dot {
        position: absolute !important;
        width: 4px !important;
        height: 4px !important;
        background: rgba(255, 255, 255, 0.9) !important;
        border-radius: 50% !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
        z-index: 1 !important;
      }
      
      body, html, #pano, #pano * {
        cursor: none !important;
      }
    `;
    
    document.head.appendChild(styleRef.current);
    console.log('✅ Persistent cursor created');
  }, []);

  // ✅ INTERACTION CONTROL
  const handleInteractionStart = useCallback(() => {
    interactionRef.current.isInteracting = true;
    interactionRef.current.lastInteractionTime = Date.now();
    
    if (interactionRef.current.idleTimeout) {
      clearTimeout(interactionRef.current.idleTimeout);
      interactionRef.current.idleTimeout = null;
    }
  }, []);

  const handleInteractionEnd = useCallback(() => {
    interactionRef.current.lastInteractionTime = Date.now();
    
    interactionRef.current.idleTimeout = setTimeout(() => {
      interactionRef.current.isInteracting = false;
    }, responsiveRef.current.idleDelay);
  }, []);

  // ✅ PANORAMA UPDATE: Works across all scenes
  const updatePanoramaSmooth = useCallback((mouseX, mouseY) => {
    if (!currentView) return;

    try {
      smoothMouseRef.current.x += (mouseX - smoothMouseRef.current.x) * responsiveRef.current.smoothing;
      smoothMouseRef.current.y += (mouseY - smoothMouseRef.current.y) * responsiveRef.current.smoothing;

      const deltaX = smoothMouseRef.current.x - lastMouseRef.current.x;
      const deltaY = smoothMouseRef.current.y - lastMouseRef.current.y;
      
      if (Math.abs(deltaX) < responsiveRef.current.threshold && 
          Math.abs(deltaY) < responsiveRef.current.threshold) {
        return;
      }

      // ✅ INTERACTION TRACKING
      if (Math.abs(deltaX) > 0.003 || Math.abs(deltaY) > 0.003) {
        handleInteractionStart();
      }

      // ✅ VELOCITY CALCULATION
      velocityRef.current.x = deltaX;
      velocityRef.current.y = deltaY;
      velocityRef.current.speed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      velocityRef.current.angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

      // ✅ PANORAMA UPDATE: Enhanced boundary handling
      const currentYaw = currentView.yaw();
      const currentPitch = currentView.pitch();
      
      const yawDelta = deltaX * sensitivityRef.current.horizontal;
      const pitchDelta = -deltaY * sensitivityRef.current.vertical;
      
      // ✅ SMOOTH LIMITS: Gradual slowdown at boundaries
      const clampedYawDelta = Math.max(-responsiveRef.current.maxSpeed, 
                                      Math.min(responsiveRef.current.maxSpeed, yawDelta));
      const clampedPitchDelta = Math.max(-responsiveRef.current.maxSpeed, 
                                        Math.min(responsiveRef.current.maxSpeed, pitchDelta));
      
      // ✅ ENHANCED PITCH LIMITS: Wider range with smooth boundaries
      const newPitch = currentPitch + clampedPitchDelta;
      const pitchMin = -Math.PI/2.5;  // ✅ WIDER: More up movement
      const pitchMax = Math.PI/2.5;   // ✅ WIDER: More down movement
      
      const finalPitch = Math.max(pitchMin, Math.min(pitchMax, newPitch));
      const finalYaw = currentYaw + clampedYawDelta;
      
      currentView.setYaw(finalYaw);
      currentView.setPitch(finalPitch);
      
      lastMouseRef.current = { x: smoothMouseRef.current.x, y: smoothMouseRef.current.y };
      
    } catch (error) {
      console.warn('Panorama update error:', error);
    }
  }, [currentView, handleInteractionStart]);

  // ✅ CURSOR POSITIONING: Always works
  const updateCursorPosition = useCallback((clientX, clientY) => {
    if (!cursorRef.current) return;

    const speed = velocityRef.current.speed;
    const angle = velocityRef.current.angle;
    const containerSize = 60;
    const halfSize = containerSize / 2;

    // ✅ IMMEDIATE UPDATE
    gsap.set(cursorRef.current, {
      x: clientX - halfSize,
      y: clientY - halfSize,
      visibility: 'visible'
    });

    // ✅ SMOOTH ROTATION/SCALING
    gsap.to('.cursor-main-circle', {
      rotation: angle,
      scale: Math.min(1 + speed * 4, 1.2),
      duration: 0.2,
      ease: "power1.out",
      force3D: true
    });

    // ✅ LIGHT TRAIL
    if (speed > 0.015) {
      createTrailDot(clientX, clientY, speed);
    }
  }, []);

  // ✅ TRAIL SYSTEM
  const createTrailDot = useCallback((x, y, speed) => {
    if (trailRef.current.length > 3) return;

    const dot = document.createElement('div');
    dot.style.cssText = `
      position: absolute;
      width: 2px;
      height: 2px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      pointer-events: none;
      will-change: transform;
    `;
    
    gsap.set(dot, {
      x: x - 1,
      y: y - 1,
      scale: Math.min(speed * 2, 0.6),
      opacity: Math.min(speed * 1.2, 0.3),
      force3D: true
    });

    document.body.appendChild(dot);

    gsap.to(dot, {
      scale: 0,
      opacity: 0,
      duration: 0.4,
      ease: "power1.out",
      force3D: true,
      onComplete: () => {
        dot.remove();
        const index = trailRef.current.indexOf(dot);
        if (index > -1) trailRef.current.splice(index, 1);
      }
    });

    trailRef.current.push(dot);
  }, []);

  // ✅ TICKER: Persistent across scenes
  const startSmoothTicker = useCallback(() => {
    if (tickerRef.current) return;

    tickerRef.current = gsap.ticker.add(() => {
      if (!isActiveRef.current) return;
      updatePanoramaSmooth(mouseRef.current.x, mouseRef.current.y);
    });
  }, [updatePanoramaSmooth]);

  // ✅ GLOBAL MOUSE HANDLERS: Work across all scenes
  const handleMouseMove = useCallback((event) => {
    if (!isEnabled || !currentView) return;

    const container = document.querySelector('#pano');
    if (!container) return;

    // ✅ ALWAYS UPDATE CURSOR
    updateCursorPosition(event.clientX, event.clientY);

    const rect = container.getBoundingClientRect();
    let mouseX = (event.clientX - rect.left) / rect.width;
    let mouseY = (event.clientY - rect.top) / rect.height;

    mouseX = Math.max(0, Math.min(1, mouseX));
    mouseY = Math.max(0, Math.min(1, mouseY));

    // ✅ DEAD ZONE
    const verticalCenter = 0.5;
    const deadZone = 0.14;
    
    if (Math.abs(mouseY - verticalCenter) < deadZone / 2) {
      mouseY = verticalCenter + (mouseY - verticalCenter) * 0.75;
    }

    mouseRef.current = { x: mouseX, y: mouseY };

    if (!isActiveRef.current) {
      isActiveRef.current = true;
      lastMouseRef.current = { x: mouseX, y: mouseY };
      smoothMouseRef.current = { x: mouseX, y: mouseY };
      startSmoothTicker();
    }
  }, [isEnabled, currentView, startSmoothTicker, updateCursorPosition]);

  const handleMouseEnter = useCallback(() => {
    if (!isEnabled) return;
    
    handleInteractionStart();
    
    // ✅ SHOW CURSOR
    if (cursorRef.current) {
      gsap.set(cursorRef.current, { visibility: 'visible' });
      gsap.to('.cursor-main-circle', {
        scale: 1,
        duration: 0.4,
        ease: "back.out(1.2)",
        force3D: true
      });
    }
  }, [isEnabled, handleInteractionStart]);

  const handleMouseLeave = useCallback(() => {
    if (!isEnabled) return;

    isActiveRef.current = false;
    handleInteractionEnd();
    
    if (tickerRef.current) {
      gsap.ticker.remove(tickerRef.current);
      tickerRef.current = null;
    }

    // ✅ HIDE CURSOR (but don't remove)
    if (cursorRef.current) {
      gsap.to('.cursor-main-circle', {
        scale: 0,
        duration: 0.25,
        ease: "power1.out",
        force3D: true
      });
    }
  }, [isEnabled, handleInteractionEnd]);

  // ✅ CONTROLS
  const setSensitivity = useCallback((horizontal, vertical) => {
    sensitivityRef.current.horizontal = Math.max(0.02, Math.min(0.15, horizontal));
    sensitivityRef.current.vertical = Math.max(0.01, Math.min(0.1, vertical));
  }, []);

  const setResponsiveness = useCallback((smoothing, maxSpeed) => {
    responsiveRef.current.smoothing = Math.max(0.08, Math.min(0.2, smoothing));
    responsiveRef.current.maxSpeed = Math.max(0.01, Math.min(0.05, maxSpeed));
  }, []);

  // ✅ SCENE CHANGE DETECTION: Reinitialize cursor on scene changes
  useEffect(() => {
    if (currentView?.scene?.data?.id) {
      const newSceneId = currentView.scene.data.id;
      if (currentSceneId.current !== newSceneId) {
        console.log(`🔄 Scene changed: ${currentSceneId.current} → ${newSceneId}`);
        currentSceneId.current = newSceneId;
        
        // ✅ REINITIALIZE: Reset states for new scene
        mouseRef.current = { x: 0.5, y: 0.5 };
        lastMouseRef.current = { x: 0.5, y: 0.5 };
        smoothMouseRef.current = { x: 0.5, y: 0.5 };
        
        // ✅ ENSURE CURSOR EXISTS
        if (isEnabled) {
          createPersistentCursor();
        }
      }
    }
  }, [currentView, isEnabled, createPersistentCursor]);

  // ✅ INITIAL SETUP: Create cursor when enabled
  useEffect(() => {
    if (isEnabled) {
      const timer = setTimeout(() => {
        createPersistentCursor();
      }, 100); // ✅ DELAY: Wait for DOM to be ready
      return () => clearTimeout(timer);
    }
  }, [isEnabled, createPersistentCursor]);

  // ✅ EVENT LISTENERS: Global scope to work across all scenes
  useEffect(() => {
    if (!isEnabled) return;

    // ✅ GLOBAL: Attach to document instead of container
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    // ✅ CONTAINER: Re-attach on every render to catch new scenes
    const attachContainerEvents = () => {
      const container = document.querySelector('#pano');
      if (container) {
        container.addEventListener('mouseenter', handleMouseEnter, { passive: true });
        container.addEventListener('mouseleave', handleMouseLeave, { passive: true });
        return () => {
          container.removeEventListener('mouseenter', handleMouseEnter);
          container.removeEventListener('mouseleave', handleMouseLeave);
        };
      }
    };

    const cleanupContainer = attachContainerEvents();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (cleanupContainer) cleanupContainer();
      
      if (tickerRef.current) {
        gsap.ticker.remove(tickerRef.current);
      }

      if (interactionRef.current.idleTimeout) {
        clearTimeout(interactionRef.current.idleTimeout);
      }
    };
  }, [isEnabled, handleMouseMove, handleMouseEnter, handleMouseLeave]);

  // ✅ FINAL CLEANUP: Only on component unmount
  useEffect(() => {
    return () => {
      if (tickerRef.current) gsap.ticker.remove(tickerRef.current);
      if (cursorRef.current) {
        cursorRef.current.remove();
        document.body.style.cursor = 'auto';
      }
      if (styleRef.current) styleRef.current.remove();
      if (interactionRef.current.idleTimeout) clearTimeout(interactionRef.current.idleTimeout);
      trailRef.current.forEach(dot => dot.remove());
    };
  }, []);

  return {
    setSensitivity,
    setResponsiveness,
    isActive: isActiveRef.current,
    isInteracting: interactionRef.current.isInteracting,
    currentSensitivity: sensitivityRef.current,
    currentResponsiveness: responsiveRef.current
  };
}
