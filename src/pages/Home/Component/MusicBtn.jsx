// MusicBtn.jsx - Updated to use global context

import { useGlobalAudio } from "./AudioContext";


const MusicBtn = () => {
  // 👈 USE GLOBAL CONTEXT INSTEAD OF LOCAL STATE
  const { musicPlaying, audioPausing, toggleMusic } = useGlobalAudio();

  return (
    <button
      className="audio-btn"
      aria-label="Toggle audio"
      data-state={musicPlaying ? (audioPausing ? "pausing" : "play") : "pause"}
      onClick={toggleMusic} // 👈 USE GLOBAL TOGGLE FUNCTION
      style={{ position: "fixed", bottom: 30, left: 30, zIndex: 1000 }}
    >
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          ref={el => {
            if (el && musicPlaying && !audioPausing) {
              el.style.setProperty('--current-scale', (0.3 + Math.random() * 0.7).toFixed(2));
              el.style.animationDelay = '';
            }
            if (el && audioPausing) {
              el.style.animationDelay = `${i * 0.12}s`;
            }
          }}
        ></span>
      ))}
    </button>
  );
};

export default MusicBtn;
