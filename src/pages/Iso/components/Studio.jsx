import React from "react";
import { MeshReflectorMaterial, MeshRefractionMaterial, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from 'three'
import { DissolveMaterial } from "./DissolveMaterial";
import { useControls } from "leva";
import DissolveMaterialAO from "./DissolveMaterialAO";
import UpAnimate from "./UpAnimate";

// ✅ centralized texture paths
const texturePaths = {
  mask: "/textures/fbm_noise.png",
  plane: "textures/Studio_2K/Plane_SHADOW.webp",
  floor: "textures/Studio_2K/Floor.webp",
  base: "textures/Studio_2K/Base.webp",
  glass: "textures/Studio_2K/Glass.webp",
  gold: "textures/Studio_2K/Gold.webp",
  sofa: "textures/Studio_2K/Sofa.webp",
  bed: "textures/Studio_2K/Bed.webp",
}

// ✅ preload textures once
Object.values(texturePaths).forEach((path) => {
  useTexture.preload(path)
})

export function Studio(props) {
  const { nodes } = useGLTF("models/studio-baked-final-v1.glb");


 // ✅ load all textures in one go (single suspension)
 const textures = useTexture(Object.values(texturePaths))
 textures.forEach((tex) => (tex.flipY = false))

 // map back for clarity
 const [
  maskTex,
   planTexture,
   floorTex,
   baseTexture,
   glassTexture,
   goldTexture,
   sofaTexture,
   bedTexture,
 ] = textures

 // repeat wrapping for mask
 if (maskTex) {
  maskTex.wrapS = maskTex.wrapT = THREE.RepeatWrapping;
}

  return (
    <group {...props} dispose={null} rotation={[0, Math.PI, 0]}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane.geometry}
      >
        <DissolveMaterialAO color={'#d0c6b7'} aoMap={planTexture} active={props.active}  />
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Base.geometry}
      >
        <DissolveMaterial map={baseTexture} mask={maskTex} active={props.active} />
      </mesh>
      <UpAnimate active={props.active}>

      <mesh castShadow receiveShadow geometry={nodes.Bed.geometry}>
      <DissolveMaterial map={bedTexture} mask={maskTex} active={props.active} />
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Sofa.geometry}
        material={nodes.Sofa.material}
      >
        <DissolveMaterial map={sofaTexture} mask={maskTex} active={props.active} />
      </mesh>
      </UpAnimate>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Gold.geometry}
      >
        <DissolveMaterial map={goldTexture} mask={maskTex} active={props.active} />
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Glass.geometry}
        // material={materials.Glass}
      >
        <DissolveMaterial map={glassTexture} mask={maskTex} active={props.active} />
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Floor.geometry}
      >
        <DissolveMaterial map={floorTex} mask={maskTex} active={props.active} />
      </mesh>
    </group>
  );
}

useGLTF.preload("models/studio-baked-final-v1.glb");
