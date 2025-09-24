import React, { useEffect } from "react";
import { MeshReflectorMaterial, MeshRefractionMaterial, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from 'three'
import { useControls } from "leva";

export function Studio(props) {
  const { nodes, materials } = useGLTF("models/studio-baked-final-v1.glb");

  const {color} = useControls({
    color:{
      value: '#BCB4AC'
    }
  })

  //Plane texture
  const planTexture = useTexture("textures/Plane_SHADOW.png");
  planTexture.flipY = false;
  
  //Floor texture
  const floorTex = useTexture("textures/Floor.png");
  floorTex.flipY = false;


  //Base texture
  const baseTexture = useTexture("textures/Base.png");
  baseTexture.flipY = false;


  //Glass texture
  const glassTexture = useTexture("textures/Glass.png");
  glassTexture.flipY = false;



  //Gold texture
  const goldTexture = useTexture("textures/Gold.png");
  goldTexture.flipY = false;

  //Sofa texture
  const sofaTexture = useTexture("textures/Sofa.png");
  sofaTexture.flipY = false;

  //Bed texture
  const bedTexture = useTexture("textures/Bed.png")
  bedTexture.flipY = false

  
  // useEffect(() => {
  //   if (!floorTex || !materials?.floor) return;
  //   floorTex.flipY = false;
  //   materials.floor.map = floorTex;
  //   materials.floor.needsUpdate = true;
  // }, [floorTex, materials]);
  

  return (
    <group {...props} dispose={null} rotation={[0, Math.PI, 0]}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane.geometry}
      >
        <meshStandardMaterial color={'#d8cdbe'} lightMap={planTexture}/>
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Base.geometry}
      >
        <meshBasicMaterial map={baseTexture}/>
      </mesh>
      <mesh castShadow receiveShadow geometry={nodes.Bed.geometry}>
      <meshBasicMaterial map={bedTexture}/>
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Sofa.geometry}
        material={nodes.Sofa.material}
      >
        <meshBasicMaterial map={sofaTexture}/>
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Gold.geometry}
      >
        <meshBasicMaterial map={goldTexture}/>
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Glass.geometry}
        // material={materials.Glass}
      >
        <meshBasicMaterial map={glassTexture}/>
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Floor.geometry}
      >
        <meshBasicMaterial map={floorTex}/>
      </mesh>
    </group>
  );
}

useGLTF.preload("models/studio-baked-final-v1.glb");
