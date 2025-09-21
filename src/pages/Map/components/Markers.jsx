import { Html } from "@react-three/drei";
import React, { forwardRef } from "react";

const Markers = forwardRef(({ clickHandle, path, position, name,  index }, ref) => {
  return (
    <Html className="opacity-0" zIndexRange={[0, 0]} ref={(el) => (ref.current[index+2] = el)} position={position} distanceFactor={100}>
      <span className="marker-class cursor-pointer" onClick={() => clickHandle(path)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="-4 0 36 36"
          className="overflow-visible 

           max-sm:scale-50
           max-md:scale-50
           max-lg:scale-70
          "
        >
          {/**/}
          <defs>
      <linearGradient
        id="linear-gradient"
        x1="0"
        x2="37.97"
        y1="32.47"
        y2="32.47"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.3" stopColor="#9e7739"></stop>
        <stop offset="0.41" stopColor="#a88347"></stop>
        <stop offset="0.62" stopColor="#c3a56d"></stop>
        <stop offset="0.89" stopColor="#ecd7a6"></stop>
      </linearGradient>
    </defs>
    <path
      id="Layer_1-2"
      fill="url(#linear-gradient)"
      d="M20.21.04c-.39-.03-.79-.04-1.2-.04s-.8.01-1.2.04C4.4.81-3.79 15.25 1.76 27.48l17 37.47 17.38-37.38C41.82 15.35 33.67.82 20.21.04M19.1 31.36c-5.98 0-10.83-4.85-10.83-10.83S13.12 9.7 19.1 9.7s10.83 4.85 10.83 10.83-4.85 10.83-10.83 10.83"
      data-name="Layer 1"
    ></path>
        </svg>
      </span>
    </Html>
  );
});

export default Markers;
