import React, { Children, useRef } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import CustomShaderMaterial from "three-custom-shader-material";
import gsap from "gsap";
import { DissolveMaterial } from "./DissolveMaterial";
import DissolveMaterialAO from "./DissolveMaterialAO";
import { useGSAP } from "@gsap/react";
import UpAnimate from "./UpAnimate";

gsap.registerPlugin(useGSAP)

// ✅ centralized texture paths
const texturePaths = {
  mask: "/textures/fbm_noise.png",
  set1: "textures/3BHK_2K/Texture_Set_1.webp",
  set2: "textures/3BHK_2K/Texture_Set_2.webp",
  set3: "textures/3BHK_2K/Texture_Set_3.webp",
  set4: "textures/3BHK_2K/Texture_Set_4.webp",
  set5: "textures/3BHK_2K/Texture_Set_5.webp",
  set6: "textures/3BHK_2K/Texture_Set_6.webp",
  set7: "textures/3BHK_2K/Texture_Set_7.webp",
  glass: "textures/3BHK_2K/Texture_Set_Glass.webp",
  plane: "textures/3BHK_2K/Texture_Set_Plane.webp",
};

// ✅ preload textures once
Object.values(texturePaths).forEach((path) => {
  useTexture.preload(path);
});

export function ThreeBHK(props) {
  const { nodes } = useGLTF("models/3BHK-v1.glb");
  const groupRef = useRef()

  // ✅ load all textures in one suspension
  const textures = useTexture(Object.values(texturePaths));
  textures.forEach((tex) => {
    if (tex) {
      tex.flipY = false;
    }
  });

  // map back for clarity
  const [
    maskTex,
    texture_Set_1,
    texture_Set_2,
    texture_Set_3,
    texture_Set_4,
    texture_Set_5,
    texture_Set_6,
    texture_Set_7,
    texture_Set_Glass,
    texture_Set_Plane,
  ] = textures;

  // repeat wrapping for mask
  if (maskTex) {
    maskTex.wrapS = maskTex.wrapT = THREE.RepeatWrapping;
  }

  

  return (
    <group {...props} dispose={null} scale={0.83} position={[-0.6, 0, -0.8]}>
      <mesh geometry={nodes.Base1.geometry}>
        <DissolveMaterial
          map={texture_Set_1}
          mask={maskTex}
          active={props.active}
        />
      </mesh>
      <mesh geometry={nodes.Base2.geometry}>
        <DissolveMaterial
          map={texture_Set_2}
          mask={maskTex}
          active={props.active}
        />
      </mesh>
      <UpAnimate active={props.active}>
        <mesh geometry={nodes.Bed.geometry}>
          <DissolveMaterial
            map={texture_Set_3}
            mask={maskTex}
            active={props.active}
          />
        </mesh>
        <mesh geometry={nodes.Bed001.geometry}>
          <DissolveMaterial
            map={texture_Set_3}
            mask={maskTex}
            active={props.active}
          />
        </mesh>
        <mesh geometry={nodes.Bed002.geometry}>
          <DissolveMaterial
            map={texture_Set_3}
            mask={maskTex}
            active={props.active}
          />
        </mesh>
        <mesh geometry={nodes.Plants.geometry}>
          <DissolveMaterial
            map={texture_Set_4}
            mask={maskTex}
            active={props.active}
          />
        </mesh>
        <mesh geometry={nodes.Table_Chair_Balcony.geometry}>
          <DissolveMaterial
            map={texture_Set_4}
            mask={maskTex}
            active={props.active}
          />
        </mesh>
        <mesh geometry={nodes.Livingroom_Objects.geometry}>
          <DissolveMaterial
            map={texture_Set_4}
            mask={maskTex}
            active={props.active}
          />
        </mesh>
        <mesh geometry={nodes.Rug_Livingroom.geometry}>
          <DissolveMaterial
            map={texture_Set_4}
            mask={maskTex}
            active={props.active}
          />
        </mesh>
        <mesh geometry={nodes.Dining_Table.geometry}>
          <DissolveMaterial
            map={texture_Set_5}
            mask={maskTex}
            active={props.active}
          />
        </mesh>
       
        <mesh geometry={nodes.Wardrob1_Cloths.geometry}>
          <DissolveMaterial
            map={texture_Set_6}
            mask={maskTex}
            active={props.active}
          />
        </mesh>
        <mesh geometry={nodes.Wardrobe2_Cloths.geometry}>
          <DissolveMaterial
            map={texture_Set_6}
            mask={maskTex}
            active={props.active}
          />
        </mesh>
        <mesh geometry={nodes.Wardrob3_Cloths.geometry}>
          <DissolveMaterial
            map={texture_Set_6}
            mask={maskTex}
            active={props.active}
          />
        </mesh>
       
       
        <mesh geometry={nodes.Lamp_Cabin.geometry}>
          <DissolveMaterial
            map={texture_Set_7}
            mask={maskTex}
            active={props.active}
          />
        </mesh>
      </UpAnimate>


      <mesh geometry={nodes.fridge_Washing_Machine.geometry}>
          <DissolveMaterial
            map={texture_Set_5}
            mask={maskTex}
            active={props.active}
          />
        </mesh>
      <mesh geometry={nodes.Sink2.geometry}>
          <DissolveMaterial
            map={texture_Set_7}
            mask={maskTex}
            active={props.active}
          />
        </mesh>
        <mesh geometry={nodes.Sink.geometry}>
          <DissolveMaterial
            map={texture_Set_7}
            mask={maskTex}
            active={props.active}
          />
        </mesh>
      <mesh geometry={nodes.Floor.geometry}>
          <DissolveMaterial
            map={texture_Set_7}
            mask={maskTex}
            active={props.active}
          />
        </mesh>
        <mesh geometry={nodes.Gold.geometry}>
          <DissolveMaterial
            map={texture_Set_7}
            mask={maskTex}
            active={props.active}
          />
        </mesh>
      <mesh geometry={nodes.Glass.geometry}>
        <DissolveMaterial
          map={texture_Set_Glass}
          mask={maskTex}
          active={props.active}
        />
      </mesh>
      <mesh geometry={nodes.Plane.geometry}>
        <DissolveMaterialAO
          color={"#d0c6b7"}
          aoMap={texture_Set_Plane}
          active={props.active}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload("models/3BHK-v1.glb");
