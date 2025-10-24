import { useGSAP } from '@gsap/react'
import React, { useRef } from 'react'
import gsap from 'gsap'

gsap.registerPlugin(useGSAP)

const DissolveMaterialAO = ({aoMap, active , color}) => {
  const matRef = useRef()

  useGSAP(()=>{
    // console.log(aoMap)
    if(!matRef.current) return

    gsap.to(matRef.current, 
    {
      opacity: active? 1 : 0,
      duration: 1,
      delay: active? 2: 0,
      ease: 'power1.inOut'
    }
    )
  }, [active])

  return (
    <meshBasicMaterial opacity={1} ref={matRef} color={color} aoMap={aoMap} transparent/>
  )
}

export default DissolveMaterialAO