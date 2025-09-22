// FullscreenLoader.jsx
import { Html, useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";

export default function Loader({ onFinished }) {
  const { active, loaded, total, progress, item } = useProgress();
  const [visible, setVisible] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState("Initializing...");

  useEffect(() => {
    console.log("Loading progress:", active, loaded, total, progress, item);
    
    // Update connection status based on progress
    if (progress < 25) {
      setConnectionStatus("Loading assets...");
    } else if (progress < 50) {
      setConnectionStatus("Establishing connection...");
    } else if (progress < 75) {
      setConnectionStatus("Syncing data...");
    } else if (progress < 100) {
      setConnectionStatus("Finalizing...");
    } else {
      setConnectionStatus("Ready!");
    }

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
          background: "linear-gradient(to bottom, #0f172a, #1e293b)", // slate gradient
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.6s ease",
          pointerEvents: visible ? "all" : "none",
        }}
      >
        <div style={{ textAlign: "center" }}>
          {/* Spinning loader */}
          <div
            style={{
              width: "48px",
              height: "48px",
              border: "2px solid transparent",
              borderBottom: "2px solid #CFB284",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px auto",
            }}
          ></div>
          
          {/* Main loading text */}
          <p
            style={{
              color: "#CFB284",
              fontSize: "18px",
              margin: "0 0 8px 0",
              fontFamily: "sans-serif",
            }}
          >
            Loading floor data... {progress.toFixed(0)}%
          </p>
          
          {/* Sub message */}
          <p
            style={{
              color: "#6b7280",
              fontSize: "14px",
              margin: "0 0 4px 0",
              fontFamily: "sans-serif",
            }}
          >
            Establishing real-time connection...
          </p>
          
          {/* Status */}
          <p
            style={{
              color: "#9ca3af",
              fontSize: "12px",
              margin: "0",
              fontFamily: "sans-serif",
            }}
          >
            Status: {connectionStatus}
          </p>
        </div>

        {/* CSS Animation */}
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </Html>
  );
}
