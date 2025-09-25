
import MusicBtn from '../Home/Component/MusicBtn'
import { useBackButtonOverride } from '../Views/hooks/useBackButtonOverride'
import './App.css'
import BuildingSVG from './BuildingSvg'

function Inventory() {
  useBackButtonOverride();
  

  return (
    <>
    
     <BuildingSVG/>
     <MusicBtn audioSrc="/backgroundsound.mp3"/>
    
    </>
  )
}

export default Inventory
