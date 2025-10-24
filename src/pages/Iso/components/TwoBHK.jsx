import React from "react";
import * as THREE from "three";
import { useGLTF, useTexture } from "@react-three/drei";
import { DissolveMaterial } from "./DissolveMaterial";
import DissolveMaterialAO from "./DissolveMaterialAO";
import UpAnimate from "./UpAnimate";

// ✅ Centralized texture paths
const texturePaths = {
  mask: "/textures/fbm_noise.png",
  bedLamp: "textures/2BHK_2K/Texture_Set_1.webp",
  bedroom2: "textures/2BHK_2K/Texture_Set_2.webp",
  bedroom: "textures/2BHK_2K/Texture_Set_3.webp",
  setFour: "textures/2BHK_2K/Texture_Set_4.webp",
  setFive: "textures/2BHK_2K/Texture_Set_5.webp",
  setSix: "textures/2BHK_2K/Texture_Set_6_2.webp",
  glass: "textures/2BHK_2K/Texture_Set_Glass.webp",
  plane: "textures/2BHK_2K/Texture_Set_Plane.webp",
}

// ✅ Preload all textures
Object.values(texturePaths).forEach((path) => {
  useTexture.preload(path)
})

export function TwoBHK(props) {
  const { nodes } = useGLTF("models/2BHK_Final-v1.glb");

  // ✅ Load all textures in one go (single suspension)
  const textures = useTexture(Object.values(texturePaths))
  textures.forEach((tex) => (tex.flipY = false))

  const [
    maskTex,
    bedLampTexture,
    bedroom2Texture,
    bedroomTexture,
    setFourthTexture,
    setFifthTexture,
    setSixthTexture,
    setGlassTexture,
    setPlaneTexture,
  ] = textures

  // repeat wrapping for mask
  if (maskTex) {
    maskTex.wrapS = maskTex.wrapT = THREE.RepeatWrapping;
  }

  return (
    <group {...props} dispose={null} position={[1, 0, -1]} rotation={[0,Math.PI,0]}>
      <UpAnimate active={props.active} >

      <mesh castShadow receiveShadow geometry={nodes.Bed_Lamp_Cabin.geometry}>
        <DissolveMaterial map={bedLampTexture} mask={maskTex} active={props.active} />
      </mesh>
      <mesh castShadow receiveShadow geometry={nodes.Study_Desk.geometry}>
        <DissolveMaterial map={bedroom2Texture} mask={maskTex} active={props.active} />
      </mesh>
      <mesh castShadow receiveShadow geometry={nodes.Sofa_DiningTable.geometry}>
        <DissolveMaterial map={bedroomTexture} mask={maskTex} active={props.active} />
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Retopo_Plant_Balcony.geometry}
      >
        <DissolveMaterial map={setFourthTexture} mask={maskTex} active={props.active} />
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.fridge_Washing_Machine.geometry}
      >
        <DissolveMaterial map={setFourthTexture} mask={maskTex} active={props.active} />
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Table_Chair_Balcony.geometry}
      >
        <DissolveMaterial map={setFifthTexture} mask={maskTex} active={props.active} />
      </mesh>
      </UpAnimate>
      <mesh castShadow receiveShadow geometry={nodes.Bedroom2.geometry}>
        <DissolveMaterial map={bedroom2Texture} mask={maskTex} active={props.active} />
      </mesh>
      <mesh castShadow receiveShadow geometry={nodes.bedroom.geometry}>
        <DissolveMaterial map={bedroomTexture} mask={maskTex} active={props.active} />
      </mesh>
      
      <mesh castShadow receiveShadow geometry={nodes.Dishe_Stove.geometry}>
        <DissolveMaterial map={setFourthTexture} mask={maskTex} active={props.active} />
      </mesh>
      
      <mesh castShadow receiveShadow geometry={nodes.Sink.geometry}>
        <DissolveMaterial map={setFourthTexture} mask={maskTex} active={props.active} />
      </mesh>
      
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Floor.geometry}
        >
        <DissolveMaterial map={setFifthTexture} mask={maskTex} active={props.active} />
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Golden.geometry}
        >
        <DissolveMaterial map={setFifthTexture} mask={maskTex} active={props.active} />
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Base.geometry}
      >
        <DissolveMaterial map={setSixthTexture} mask={maskTex} active={props.active} />
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Glass.geometry}
        >
        <DissolveMaterial map={setGlassTexture} mask={maskTex} active={props.active} />
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane.geometry}
        >
        <DissolveMaterialAO active={props.active} color={'#d0c6b7'} aoMap={setPlaneTexture} />
      </mesh>
    </group>
  );
}

useGLTF.preload("models/2BHK_Final-v1.glb");
