import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const Scene = ({
  floors,
  circleGroupRef,
  RADIUS,
  modelsRef,
  FLOOR_LENGHT,
  camera,
  current,
}) => {
  const anglesRef = useRef([]);
  const { LookX, LookY, LookZ, } =
    useControls({
      LookX: {
        value: 45.00,
        max: 100,
        min: -100,
        step: 0.001,
      },
      LookY: {
        value: -3.52,
        max: 100,
        min: -100,
        step: 0.001,
      },
      LookZ: {
        value: 0.61,
        max: 100,
        min: -100,
        step: 0.001,
      },
      
      
    });

  useEffect(() => {
    if (!camera.current) return;
    // Make the orthographic camera look at the origin (0,0,0)
    camera.current.lookAt(LookX, LookY, LookZ);

    // If using OrbitControls, also update its target
  }, [camera.current, LookX, LookY, LookZ]);

  useFrame(()=>{
    // console.log(camera.current)
  })

  const pointerRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    const onPointerMove = (e) => {
      pointerRef.current.x = -(e.clientX / window.innerWidth) * 2 + 1;
      pointerRef.current.y = (e.clientY / window.innerHeight) * 2 + 1;

      // yaw (left-right), based on base angle
      targetRotationRef.current.y =
        pointerRef.current.x * Math.PI * 0.02 + anglesRef.current[current];

      // pitch (up-down)
      targetRotationRef.current.x = pointerRef.current.y * Math.PI * 0.002;

      // optional roll
      targetRotationRef.current.z = 0;
    };

    window.addEventListener("pointermove", onPointerMove);

    // reset on model switch
    targetRotationRef.current.y =
      pointerRef.current.x * Math.PI * 0.002 + anglesRef.current[current];

    // pitch (up-down)
    targetRotationRef.current.x = pointerRef.current.y * Math.PI * 0.002;

    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [current, modelsRef]);

  // Apply quaternion slerp each frame
  useFrame(() => {
    if (!modelsRef.current?.[current]) return;
    const model = modelsRef.current[current];

    // build target quaternion from Euler
    const euler = new THREE.Euler(
      targetRotationRef.current.x,
      targetRotationRef.current.y,
      targetRotationRef.current.z,
      "YXZ" // rotation order: yaw → pitch → roll
    );
    const targetQuat = new THREE.Quaternion().setFromEuler(euler);

    // smooth slerp from current orientation to target
    model.quaternion.slerp(targetQuat, 0.1);
  });

  return (
    <group ref={circleGroupRef}>
      {floors.map(({ name, Model }, ind) => {
        const angle = (ind / FLOOR_LENGHT) * Math.PI * 2; // distribute evenly around circle

        const x = Math.cos(angle) * RADIUS;
        const z = Math.sin(angle) * RADIUS;
        const y = 0; // keep flat, or change if you want height differences

        anglesRef.current[ind] = -angle - Math.PI / 2;

       

        return (
          
          <group
            key={ind}
            position={[x, y, z]} // now arranged around circle in XZ plane
            ref={(el) => (modelsRef.current[ind] = el)}
            rotation={[0, anglesRef.current[ind], 0]} // makes each face the circle center
          >
            <group rotation={[0, Math.PI/5, 0]}> 
              <Model />
            </group>
          </group>
        );
      })}
    </group>
  );
};

export default Scene;
