// FloorPlane.jsx
import React, { useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

/**
 * Props:
 * - width, height: size of the plane in world units
 * - segments: geometry subdivisions (for displacement/lighting). Keep small for perf.
 * - textureUrl: optional tile texture (URL or import)
 * - repeat: how many times to tile the texture across width/height [xRepeat, yRepeat]
 * - rotation: default rotates plane to horizontal
 */
export default function FloorPlane({
  width = 200,
  height = 200,
  segments = 1,
  textureUrl = null,
  repeat = [10, 10],
  position = [0, 0, 0],
  rotation = [-Math.PI / 2, 0, 0], // horizontal
  receiveShadow = true,
}) {
  // If you want a simple colored floor without texture, pass textureUrl = null
//   const texture = useTexture(textureUrl || null);

//   // Configure texture tiling and wrapping (only if a texture was provided)
//   if (texture) {
//     texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
//     texture.repeat.set(repeat[0], repeat[1]);
//     // optional: improve sharpness on tiled textures
//     texture.anisotropy = 16;
//     texture.encoding = THREE.sRGBEncoding;
//   }

  // Create a large plane geometry optionally with segments for displacement
  const geomArgs = useMemo(() => [width, height, segments, segments], [width, height, segments]);

  return (
    <mesh
      position={position}
      rotation={rotation}
      receiveShadow={receiveShadow}
      castShadow={false}
    >
      <planeGeometry args={geomArgs} />
      {/* {texture ? (
        <meshStandardMaterial
        //   map={texture}
          metalness={0}
          roughness={1}
          side={THREE.DoubleSide}
        />
      ) : ( */}
        // fallback simple material
      {/* )} */}
        <meshBasicMaterial color={"#B8AFA2"} metalness={0} roughness={1} />
    </mesh>
  );
}
