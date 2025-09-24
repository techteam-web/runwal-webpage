import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function TwoBHK(props) {
  const { nodes, materials } = useGLTF('models/Base_Floor_1BHK-v1.glb')
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Walls_1.geometry}
        // material={materials.Main_walls}
      >
        <meshBasicMaterial />
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Walls_2.geometry}
        material={materials.Material___2147483638}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Floor_1.geometry}
        material={materials.Material__2147482900}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Floor_2.geometry}
        material={materials.Material__2147482921}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Windows_1.geometry}
        material={materials.Glass_Clear}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Windows_2.geometry}
        material={materials.Material__2147482897}
      />
    </group>
  )
}

useGLTF.preload('models/Base_Floor_1BHK-v1.glb')