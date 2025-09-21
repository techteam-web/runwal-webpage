// FullscreenLoader.jsx
import { Html, useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";

export default function Loader({ onFinished }) {
  const { active, loaded, total, progress, item } = useProgress();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    console.log("Loading progress:", active, loaded, total, progress, item);
    if (progress === 100) {
      const timeout = setTimeout(() => {
        setVisible(false);
        onFinished?.(); // notify parent when done
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [progress, onFinished]);

  return (
    <Html>

    <div
      style={{
          position: "fixed",
          top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "#0d0d0d",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontSize: "2rem",
        fontFamily: "sans-serif",
        zIndex: 9999,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.6s ease",
        pointerEvents: visible ? "all" : "none",
    }}
    >
      Loading {progress.toFixed(0)}%
    </div>
        </Html>
  );
}
