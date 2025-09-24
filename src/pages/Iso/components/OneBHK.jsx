import React, { useRef } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'
import { useControls } from 'leva';

export function OneBHK(props) {
  const { nodes } = useGLTF('models/1BHK_Baked-v1.glb')

  const {colorOneBHk} = useControls({
    colorOneBHk:{
      value: '#B8AFA2'
    }
  })

    //Plane texture
    const planTexture = useTexture("textures/1BHK_Bakes/Plane.png");
    planTexture.flipY = false;

    //Gold Texture
    const goldTexture = useTexture('textures/1BHK_Bakes/Gold.png')
    goldTexture.flipY = false;

    //Livingroom Texture
    const livingroomTexture = useTexture('textures/1BHK_Bakes/Livingroom.png')
    livingroomTexture.flipY = false;

    //Livingroom Texture
    const bedSofaTexture = useTexture('textures/1BHK_Bakes/Bed_Sofa.png')
    bedSofaTexture.flipY = false;

    //Livingroom Texture
    const bedroomTexture = useTexture('textures/1BHK_Bakes/Bedroom.png')
    bedroomTexture.flipY = false;

    //base Texture
    const baseTexture = useTexture('textures/1BHK_Bakes/Base.png')
    baseTexture.flipY = false;

    //Floor Texture
    const floorTexture = useTexture('textures/1BHK_Bakes/Floor.png')
    floorTexture.flipY = false;

    //Glass Texture
    const glassTexture = useTexture('textures/1BHK_Bakes/Glasses.png')
    glassTexture.flipY = false;
    

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.Gold.geometry}
      >
        <meshBasicMaterial map={goldTexture}/>
      </mesh>
      <mesh
        geometry={nodes.Livingroom.geometry}
      >
        <meshBasicMaterial map={livingroomTexture}/>
      </mesh>
      <mesh
        geometry={nodes.Bed_Sofa.geometry}
      >
        <meshBasicMaterial map={bedSofaTexture}/>
      </mesh>
      <mesh
        geometry={nodes.Bedroom.geometry}
        >
          <meshBasicMaterial map={bedroomTexture}/>
        </mesh>
      <mesh
        geometry={nodes.Base.geometry}
      >
        <meshBasicMaterial map={baseTexture}/>
      </mesh>
      <mesh
        geometry={nodes.Plane.geometry}
      >
        <meshBasicMaterial color={'#d0c6b7'} aoMap={planTexture}/>
      </mesh>
      <mesh
        geometry={nodes.Floor.geometry}
      >
        <meshBasicMaterial map={floorTexture}/>
      </mesh>
      <mesh
        geometry={nodes.Glasses.geometry}
      >
        <meshBasicMaterial map={glassTexture}/>
      </mesh>
    </group>
  )
}

useGLTF.preload('models/1BHK_Baked-v1.glb')