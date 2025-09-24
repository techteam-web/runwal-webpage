// hooks/useClickSound.jsx
import { useRef, useCallback } from 'react';

export const useClickSound = (soundFile = '/click.mp3', volume = 1) => {
  const clickSoundRef = useRef(null);

  /**
   * Play click sound and return a promise that resolves when playback starts
   */
  const playClickSound = useCallback((onComplete) => {
    return new Promise((resolve) => {
      if (!clickSoundRef.current) {
        resolve();
        return;
      }

      try {
        // Reset audio
        clickSoundRef.current.currentTime = 0;
        clickSoundRef.current.volume = Math.max(0, Math.min(1, volume));

        // Play the audio
        const playPromise = clickSoundRef.current.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Audio started successfully, wait a bit for it to be audible
              setTimeout(() => {
                resolve();
                if (onComplete) onComplete();
              }, 100); // 100ms delay to ensure sound is heard
            })
            .catch(() => {
              // Audio failed, don't block navigation
              resolve();
              if (onComplete) onComplete();
            });
        } else {
          // Older browser, add small delay
          setTimeout(() => {
            resolve();
            if (onComplete) onComplete();
          }, 100);
        }
      } catch (error) {
        resolve();
        if (onComplete) onComplete();
      }
    });
  }, [volume]);

  /**
   * Synchronous version for non-navigation buttons
   */
  const playClickSoundSync = useCallback(() => {
    if (!clickSoundRef.current) return;

    try {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.volume = Math.max(0, Math.min(1, volume));
      
      const playPromise = clickSoundRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {}); // Ignore errors for sync version
      }
    } catch (error) {
      // Silent fail
    }
  }, [volume]);

  const ClickAudio = useCallback(() => (
    <audio 
      ref={clickSoundRef} 
      src={soundFile} 
      preload="auto"
      style={{ display: 'none' }}
    />
  ), [soundFile]);

  return { 
    playClickSound,      // Async version for navigation
    playClickSoundSync,  // Sync version for dropdowns
    ClickAudio 
  };
};

export default useClickSound;
