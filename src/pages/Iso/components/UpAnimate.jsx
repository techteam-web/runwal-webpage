import { useGSAP } from '@gsap/react';
import React, { useRef } from 'react'
import gsap from 'gsap';
gsap.registerPlugin(useGSAP)

const UpAnimate = ({active, children}) => {
    const groupRef = useRef()

    useGSAP(()=>{
        if(!groupRef.current) return
    
    
        const children = groupRef.current.children;
    
      children.forEach((child, index) => {
        console.log(index)
        gsap.to(child.position, {
          y:active ? 0 : 0.1,       // animate position.y
          duration: 1,
          ease: "power2.inOut",
          delay: (index * 0.07) +(active ? 1.5 : 0) ,       // stagger manually
        });
    
        
      });
      },[active])
  return (
    <group ref={groupRef}>{children}</group>
  )
}

export default UpAnimate