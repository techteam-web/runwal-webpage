// contexts/AudioContext.jsx
import { createContext, useContext, useState, useRef, useEffect } from 'react';

const AudioContext = createContext();

export const useGlobalAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useGlobalAudio must be used within AudioProvider');
  }
  return context;
};

export const AudioProvider = ({ children }) => {
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [audioPausing, setAudioPausing] = useState(false);
  const [currentTrack] = useState('/backgroundsound.mp3'); // 👈 Your audio file
  const bgMusicRef = useRef(null);

  // Initialize audio on mount
  useEffect(() => {
    if (!bgMusicRef.current && currentTrack) {
      bgMusicRef.current = new Audio(currentTrack);
      bgMusicRef.current.loop = true;
      bgMusicRef.current.volume = 0.5;
    }

    return () => {
      // Cleanup on unmount
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current = null;
      }
    };
  }, [currentTrack]);

  const playMusic = () => {
    if (bgMusicRef.current && !musicPlaying) {
      setMusicPlaying(true);
      setAudioPausing(false);
      bgMusicRef.current.play().catch(e => console.warn("Audio play failed:", e));
    }
  };

  const pauseMusic = () => {
    if (bgMusicRef.current && musicPlaying && !audioPausing) {
      setAudioPausing(true);
      setTimeout(() => {
        setMusicPlaying(false);
        setAudioPausing(false);
        if (bgMusicRef.current) {
          bgMusicRef.current.pause();
        }
      }, 1000); // Match your winddown duration
    }
  };

  const toggleMusic = () => {
    if (musicPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  };

  return (
    <AudioContext.Provider value={{
      musicPlaying,
      audioPausing,
      currentTrack,
      playMusic,
      pauseMusic,
      toggleMusic,
      bgMusicRef
    }}>
      {children}
    </AudioContext.Provider>
  );
};
