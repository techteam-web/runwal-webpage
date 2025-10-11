import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useClickSound from "../../Home/Component/useClickSound";


export default function Navbar({ onSelect, selectedUnit, showFloorPlans, selectedFloorsForCompare = [] }) {
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [showUnits, setShowUnits] = useState(false);
  const { playClickSound, ClickAudio } = useClickSound();
  const navigate = useNavigate();


  const floors = [
    // { id: "home", label: "Home", isHome: true },
    { id: "1", label: "Exclusive Club" },
    { id: "3", label: "Mansions" },
    { id: "4", label: "Parking Levels" },
    { id: "5", label: "Sky-Club" }
  ];


  const unitNumbers = ["Duplex", "Duplex-R"];


  const handleHomeClick = () => {
    navigate("/home");
    setShowUnits(false);
    setSelectedFloor(null);
  };


  const handleFloorClick = (floorId) => {
    if (floorId === "home") {
      handleHomeClick();
      return;
    }


    if (floorId === "3") {
      setShowUnits(!showUnits);
      setSelectedFloor(showUnits ? null : floorId);
    } else if (floorId === "2") {
      onSelect("floorPlan", !showFloorPlans);
      setShowUnits(false);
      setSelectedFloor(showFloorPlans ? null : floorId);
    } else {
      onSelect("floor", floorId);
      setShowUnits(false);
      setSelectedFloor(selectedFloor === floorId ? null : floorId);
    }
  };


  const handleUnitClick = (unit) => {
    onSelect("unit", unit.toString());
  };


  return (
   <div style={{ fontFamily: 'Zap, sans-serif' }}>
  <ClickAudio />
  
  {/* Main Navbar */}
  <div style={{
    position: 'fixed',
    bottom: '0px',
    left: '0',
    padding: '10px 0px',
    borderRadius: '0px',
    display: 'flex',
    gap: '0px',
    zIndex: 99999,
    background: 'linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent)',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    {floors.map((floor) => (
      <button
        key={floor.id}
        onClick={() => { playClickSound(); handleFloorClick(floor.id); }}
        style={{
          padding: '8px 16px',
          backgroundColor: ((floor.id === "2" && showFloorPlans) || 
                           (floor.id === "3" && showUnits) || 
                           selectedFloor === floor.id) ? 'transparent' : 'transparent',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          textTransform: 'uppercase',
          fontSize: '20px',
          fontWeight:((floor.id === "2" && showFloorPlans) || 
                           (floor.id === "3" && showUnits) || 
                           selectedFloor === floor.id) ? 'bold' : '',
        }}
      >
        {floor.label}
      </button>
    ))}
  </div>

  {/* Units Panel */}
  {showUnits && (
    <div style={{
      position: 'fixed',
      bottom: '35px',
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '10px 20px',
      borderRadius: '0px',
      display: 'flex',
      gap: '30px',
      zIndex:99998 ,
      background: 'linear-gradient(to top, rgba(0, 0, 0, 0.3), transparent)'
    }}>
      {unitNumbers.map((unit) => (
        <button
          key={unit}
          onClick={() => { playClickSound(); handleUnitClick(unit); }}
          style={{
            padding: '6px 10px',
            backgroundColor: selectedUnit === unit.toString() ? 'transparent' : 'transparent',
            color: 'white',
            border: 'none',
            borderRadius: '0px',
            cursor: 'pointer',
            textTransform: 'uppercase',
            fontSize: '20px',
            fontWeight:selectedUnit === unit.toString() ? 'bold' : '',
          }}
        >
          {unit}
        </button>
      ))}
    </div>
  )}
</div>

  );
}
