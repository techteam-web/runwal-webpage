import React, { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { Html, useProgress } from "@react-three/drei"

export default function Loader() {
  const { progress } = useProgress()
  const proRef = useRef(progress)

  useEffect(()=>{
    if(proRef.current<90){
        proRef.current = progress
    }
    else{
        proRef.current = 90
    }
  }, [progress])
    
  return  <Html>
      {createPortal(
         <div className="w-screen h-screen bg-black fixed top-1/2 left-1/2">
             <span className="text-white">{Math.round( proRef.current)}%</span>
         </div>,
        document.body
      )}
  </Html> 
}
