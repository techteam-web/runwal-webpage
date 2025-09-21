import { useGSAP } from '@gsap/react'
import { useGLTF, useTexture } from '@react-three/drei'
import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { Trees } from './Trees'

gsap.registerPlugin(useGSAP)

const path = '/model/CityMapScaledDown-v2.glb'

export function CityMap({ meshBasicMaterial, activeMarker, activeGroupeMarker, markersGroup }) {
  const { nodes, materials } = useGLTF('/model/CityMapScaledDown-v2.glb')
  const buildingTexture = useTexture('/textures/Buildings.webp')
  buildingTexture.flipY = false
  const grassTexture = useTexture('/textures/Grass.webp')
  grassTexture.flipY = false
  const seaTexture = useTexture('/textures/Sea.webp')
  seaTexture.flipY = false
  const landTexture = useTexture('/textures/Land.webp')
  landTexture.flipY = false

  const matRefs = useRef({})
  // Create a shaderMaterial per path
  const PathMaterial = ({ path }) => {
    if (!matRefs.current[path]) {
      matRefs.current[path] = useRef()
    }

    const isActive =
      activeMarker === path ||
      markersGroup[activeGroupeMarker]?.locations.includes(path)

    return (
      <shaderMaterial
        ref={matRefs.current[path]}
        key={path}
        side={THREE.DoubleSide}
        transparent
        depthWrite={false}
        visible={isActive}
        uniforms={{
          uProgress: { value: 0.0 },
          uTime: { value: 0.0 },
          uTipWidth: { value: 0.06 },
          uBaseColor: { value: new THREE.Color("#E8C844") },
          uGlowColor: { value: new THREE.Color("#ffffff") },
          uGlowStrength: { value: 1.0 },
        }}
        vertexShader={/* glsl */`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={/* glsl */`
          uniform float uProgress;
          uniform float uTipWidth;
          uniform vec3 uBaseColor;
          uniform vec3 uGlowColor;
          uniform float uGlowStrength;
          uniform float uTime;
          varying vec2 vUv;

          void main() {
            if (vUv.x > uProgress) discard;
            float tip = smoothstep(uProgress - uTipWidth, uProgress, vUv.x);
            vec3 color = mix(uBaseColor, uGlowColor, tip * uGlowStrength);

            // Once filled, add a traveling pulse band
            if (uProgress >= 1.0) {
            float speed = 0.5; // lower = slower
            float bandWidth = 0.1; // width of the glow band

            // Move band from 0 → 1 repeatedly
            float bandPos = mod(uTime * speed, 1.0);

            // Create soft band based on distance from bandPos
            float band = smoothstep(bandPos - bandWidth, bandPos, vUv.x) *
                        (1.0 - smoothstep(bandPos, bandPos + bandWidth, vUv.x));

            // Add glow on top of base color
            color = mix(color, uGlowColor, band * uGlowStrength);
            }

            gl_FragColor = vec4(color, 1.0);
          }
        `}
      />
    )
  }

  // Animate active paths when marker/group changes
  useGSAP(() => {
    const activePaths = [
      activeMarker,
      ...(markersGroup[activeGroupeMarker]?.locations || []),
    ]

    activePaths.forEach((path) => {
      const ref = matRefs.current[path]
      if (!ref?.current) return

      ref.current.uniforms.uProgress.value = 0
      gsap.killTweensOf(ref.current.uniforms.uProgress)

      gsap.fromTo(
        ref.current.uniforms.uProgress,
        { value: 0 },
        { value: 1, duration: 4, ease: "power2.inOut" }
      )
    })
  }, [activeMarker, activeGroupeMarker])

  // Update uTime for glow effect
  useFrame((state) => {
    Object.values(matRefs.current).forEach((ref) => {
      if (ref.current) {
        ref.current.uniforms.uTime.value = state.clock.elapsedTime
      }
    })
  })

  return (
    <group dispose={null}>
      <group position={[811.668, -6.552, 198.22]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh
          geometry={nodes.Roads.geometry}
          position={[0, 0, -1.337]}
        >
          <meshBasicMaterial color={'#737272'}/>
        </mesh>
      </group>
      <Trees />
      <group position={[605.925, -7.895, 337.68]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh
          geometry={nodes.Line001.geometry}
          position={[0, 0, 0.007]}
       >
        <meshBasicMaterial map={grassTexture} />
       </mesh>
      </group>
      <mesh geometry={nodes.DBS_Internationl_School.geometry} position={[615.014, -7.611, 280.175]}>
        {/* {isActivePathMesh('DBS')} */}
        <PathMaterial path="DBS" />
      </mesh>
      <mesh
        geometry={nodes.Wilson_College.geometry}
        position={[615.014, -7.611, 280.175]}
        >
          {/* {isActivePathMesh('wilson')} */}
          <PathMaterial path="wilson" />
      </mesh>
      <mesh
        geometry={nodes.Malabar_Hill_Club.geometry}
        // material={isActivePathMesh('malabarClub')}
        position={[615.014, -7.611, 280.175]}
        >
        {/* {isActivePathMesh('malabarClub')} */}
        <PathMaterial path="malabarClub" />
      </mesh>
      <mesh
        geometry={nodes.Cricket_Club_Of_India.geometry}
        // material={isActivePathMesh('cricketClub')}
        position={[615.014, -7.611, 280.175]}
        >
        {/* {isActivePathMesh('cricketClub')} */}
        <PathMaterial path="cricketClub" />
      </mesh>
      <mesh
        geometry={nodes.NCPA.geometry}
        // material={isActivePathMesh('NCPA')}
        position={[615.014, -7.611, 280.175]}
        >
        {/* {isActivePathMesh('NCPA')} */}
        <PathMaterial path="NCPA" />
      </mesh>
      <mesh
        geometry={nodes.National_Gallery_of_Modern_Art.geometry}
        // material={isActivePathMesh('NationalGallery')}
        position={[615.014, -7.611, 280.175]}
        >
        {/* {isActivePathMesh('NationalGallery')} */}
        <PathMaterial path="NationalGallery" />
      </mesh>
      <mesh
        geometry={nodes.Shri_Walkeshware_Temple.geometry}
        // material={isActivePathMesh('walkeshwar')}
        position={[615.014, -7.611, 280.175]}
        >
        {/* {isActivePathMesh('walkeshwar')} */}
        <PathMaterial path="walkeshwar" />
      </mesh>
      <mesh
        geometry={nodes.Iskon_Temple.geometry}
        // material={isActivePathMesh('iskonTemple')}
        position={[615.014, -7.611, 280.175]}
        >
        {/* {isActivePathMesh('iskonTemple')} */}
        <PathMaterial path="iskonTemple" />
      </mesh>
      <mesh
        geometry={nodes.InterContinental_Dome.geometry}
        // material={isActivePathMesh('interContinental')}
        position={[615.014, -7.611, 280.175]}
        >
        {/* {isActivePathMesh('interContinental')} */}
        <PathMaterial path="interContinental" />
      </mesh>
      <mesh
        geometry={nodes.Wasabi_by_Morimoto.geometry}
        // material={isActivePathMesh('wasabi')}
        position={[615.014, -7.611, 280.175]}
        >
        {/* {isActivePathMesh('wasabi')} */}
        <PathMaterial path="wasabi" />
      </mesh>
      <mesh
        geometry={nodes.Trident.geometry}
        // material={isActivePathMesh('trident')}
        position={[615.014, -7.611, 280.175]}
        >
        {/* {isActivePathMesh('trident')} */}
        <PathMaterial path="trident" />
      </mesh>
      <mesh
        geometry={nodes.The_Taj_Mahal_Palace.geometry}
        // material={isActivePathMesh('taj')}
        position={[615.014, -7.611, 280.175]}
        >
        {/* {isActivePathMesh('taj')} */}
        <PathMaterial path="taj" />
      </mesh>
      <mesh
        geometry={nodes.Wankhede_Stadium.geometry}
        // material={isActivePathMesh('wankhede')}
        position={[615.014, -7.611, 280.175]}
        >
        {/* {isActivePathMesh('wankhede')} */}
        <PathMaterial path="wankhede" />
      </mesh>
      <mesh
        geometry={nodes.Mahalaxmi_Race_Course.geometry}
        // material={isActivePathMesh('mahalaxmi')}
        position={[615.014, -7.611, 280.175]}
        >
        {/* {isActivePathMesh('mahalaxmi')} */}
        <PathMaterial path="mahalaxmi" />
      </mesh>
      <mesh
        geometry={nodes.Sea.geometry}
        position={[642.96, -17.12, 336.495]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial metalness={0} roughness={0.4} color={'#90D5FF'} aoMap={seaTexture} />
      </mesh>
      <mesh
        geometry={nodes.Base.geometry}
        position={[642.96, -17.12, 336.495]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <meshBasicMaterial map={landTexture} />

      </mesh>
      <mesh
        geometry={nodes.Runwal_Malabar.geometry}
        position={[614.445, -7.895, 282.232]}
        rotation={[-Math.PI / 2, 0, -0.42]}
      >
        <meshStandardMaterial metalness={0.7} roughness={0.3} color={'#bd980d'}/>
      </mesh>
      <mesh
        geometry={nodes.Buildings.geometry}
        position={[811.668, -7.895, 198.22]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <meshBasicMaterial map={buildingTexture} />

      </mesh>
    </group>
  )
}

useGLTF.preload('/model/CityMapScaledDown-v2.glb')