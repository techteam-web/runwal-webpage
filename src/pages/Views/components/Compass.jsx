// import { useEffect, useState } from "react";

// function Compass({ view }) {
//   const [yawDeg, setYawDeg] = useState(0);

//   useEffect(() => {
//     if (!view || typeof view.yaw !== "function") {
//     console.warn("Compass skipped: no valid view");
//     return;
//   }
//     const updateCompass = () => {
//       const yaw = view.yaw();
//       setYawDeg((-yaw * 180) / Math.PI);
//     };

//     view.addEventListener("change", updateCompass);
//     updateCompass(); // initial update

//     return () => {
//       view.removeEventListener("change", updateCompass);
//     };
//   }, [view]);

//   return (
//     <div id="compassContainer" style={{ position: "absolute", bottom: 20, left: 20 }}>
//       <img
//         src="img/compass.webp"
//         alt="Compass"
//         id="compassImg"
//         style={{
//           width: "150px",
//           height: "150px",
//           transform: `rotate(${yawDeg}deg)`,
//           transition: "transform 0.05s linear"
//         }}
//       />
//     </div>
//   );
// }

// export default Compass;
import { useEffect, useState } from "react";

function Compass({ view }) {
  const [yawDeg, setYawDeg] = useState(0);
  const [fovDeg, setFovDeg] = useState(60); // default FOV ~ 60°

  useEffect(() => {
    if (!view || typeof view.yaw !== "function") {
      console.warn("Compass skipped: no valid view");
      return;
    }

    const updateCompass = () => {
      const yaw = view.yaw();
      const fov = view.fov ? view.fov() : Math.PI / 3; // fallback 60°
      setYawDeg((-yaw * 180) / Math.PI);
      setFovDeg((fov * 180) / Math.PI);
    };

    view.addEventListener("change", updateCompass);
    updateCompass();

    return () => {
      view.removeEventListener("change", updateCompass);
    };
  }, [view]);

  return (
    <div id="compassContainer">
      <img src="img/compass.webp" alt="Compass" id="compassImg" />
      <svg
        className="compass-overlay"
        viewBox="0 0 200 200"
        style={{ transform: `rotate(${yawDeg}deg)` }}
      >
        <path
          d={describeArc(100, 100, 90, -fovDeg / 2, fovDeg / 2)}
          fill="rgba(0,0,0,0.4)"
        />
      </svg>
    </div>
  );
}

// Utility: describe an arc path in SVG
function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = (angleDeg - 90) * (Math.PI / 180.0);
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M", cx, cy,
    "L", start.x, start.y,
    "A", r, r, 0, largeArcFlag, 0, end.x, end.y,
    "Z"
  ].join(" ");
}

export default Compass;
