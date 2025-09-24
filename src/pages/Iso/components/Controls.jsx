import { OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useControls } from 'leva'
import React, { useEffect, useRef } from 'react'

const Controls = ({camera}) => {
    const controls = useRef()
    const {LookX, LookY, LookZ} = useControls({
        LookX: {
          value:16.46545430938,
          max: 100,
          min: -100,
          step: 0.001
        },
        LookY: {
          value: 1.5003375613199273,
          max: 100,
          min: -100,
          step: 0.001
        },
        LookZ: {
          value:-4.7443977519556366,
          max: 100,
          min: -100,
          step: 0.001
        }
      })

    useFrame(()=>{
        // console.log(camera)
        // console.log("Camera position:", camera.position.toArray())
    //   console.log("Camera target (lookAt):", controls.current.target.toArray())
        // const targetRotation = pointerRef.current.x 
    })

    useEffect(()=>{
        // camera.position.set(2.063596461924558, 5.318838145970641, -6.648289706437937)
        // controls.current.target.set()
    }, [])


  return (
    <OrbitControls target={[LookX, LookY, LookZ]} ref={controls} />
  )
}

export default Controls