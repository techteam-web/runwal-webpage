import React from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { DissolveMaterial } from "./DissolveMaterial";
import * as THREE from "three";
import DissolveMaterialAO from "./DissolveMaterialAO";
import UpAnimate from "./UpAnimate";

// ✅ centralize texture paths
const texturePaths = {
  mask: "/textures/fbm_noise.png",
  plane: "textures/1BHK_2K/Plane.webp",
  gold: "textures/1BHK_2K/Gold.webp",
  livingroom: "textures/1BHK_2K/Livingroom.webp",
  bedSofa: "textures/1BHK_2K/Bed_Sofa.webp",
  bedroom: "textures/1BHK_2K/Bedroom.webp", // using ktx2 where possible
  base: "textures/1BHK_2K/Base.webp",
  floor: "textures/1BHK_2K/Floor.webp",
  glass: "textures/1BHK_2K/Glasses.webp",
};

// ✅ preload all textures
Object.values(texturePaths).forEach((path) => {
  useTexture.preload(path);
});

export function OneBHK(props) {
  const { nodes } = useGLTF("models/1BHK_Baked-v1.glb");

  // const {colorOneBHk} = useControls({
  //   colorOneBHk:{
  //     value: '#B8AFA2'
  //   }
  // })

  // load all textures at once → only one suspension
  const textures = useTexture(Object.values(texturePaths));
  textures.forEach((tex) => (tex.flipY = false));

  // map back to names
  const [
    maskTex,
    planeTexture,
    goldTexture,
    livingroomTexture,
    bedSofaTexture,
    bedroomTexture,
    baseTexture,
    floorTexture,
    glassTexture,
  ] = textures;

  // repeat wrapping for mask
  if (maskTex) {
    maskTex.wrapS = maskTex.wrapT = THREE.RepeatWrapping;
  }

  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Gold.geometry}>
        {/* <meshBasicMaterial map={goldTexture} /> */}
        <DissolveMaterial
          map={goldTexture}
          mask={maskTex}
          active={props.active}
        />
      </mesh>
      <mesh geometry={nodes.Livingroom.geometry}>
        <DissolveMaterial map={livingroomTexture} mask={maskTex} active={props.active} />
      </mesh>
      <UpAnimate active={props.active}>

      <mesh geometry={nodes.Bed_Sofa.geometry}>
        <DissolveMaterial map={bedSofaTexture} mask={maskTex} active={props.active} />
      </mesh>
      </UpAnimate>
      <mesh geometry={nodes.Bedroom.geometry}>
        <DissolveMaterial map={bedroomTexture} mask={maskTex} active={props.active} />
      </mesh>
      <mesh geometry={nodes.Base.geometry}>
        <DissolveMaterial map={baseTexture} mask={maskTex} active={props.active} />
      </mesh>
      <mesh geometry={nodes.Plane.geometry}>
        <DissolveMaterialAO active={props.active} color={"#d0c6b7"} aoMap={planeTexture} />
      </mesh>
      <mesh geometry={nodes.Floor.geometry}>
        <DissolveMaterial map={floorTexture} mask={maskTex} active={props.active} />
      </mesh>
      <mesh geometry={nodes.Glasses.geometry}>
        <DissolveMaterial map={glassTexture} mask={maskTex} active={props.active} />
      </mesh>
    </group>
  );
}

useGLTF.preload("models/1BHK_Baked-v1.glb");
