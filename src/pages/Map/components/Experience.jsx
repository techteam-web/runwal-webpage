import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import Scene from "./Scene";
import React, { Suspense, useState } from "react";
import { Html, useProgress } from "@react-three/drei";
import Loader from "./Loader";


const Experience = () => {
  const [ready, setReady] = useState(false);

  return (
    <>
      <div className="fixed w-30 top-3 right-3 z-10
      sm:w-40
      lg:w-50
      ">
       <a href="/"> <img className="" src="/logo.svg" alt="" /></a>
      </div>
      <Canvas
        className="w-full h-full overflow-hidden"
        camera={{
          position: [-267.97348988286245, 281.9980465652199, 6.435369390895175], // move camera far away
          fov: 40, // field of view
          near: 1, // near clipping plane
          far: 3000, // far clipping plane (important if your scene is huge!)
        }}
        onCreated={({ scene }) => {
          scene.fog = new THREE.Fog("#89CFF1", 300, 600); // exponential fog
        }}
      >
          <Suspense fallback={<Loader/>}>
            <Scene ready={ready} />
          </Suspense>
          
          
      </Canvas>
      
    </>
  );
};

export default Experience;
