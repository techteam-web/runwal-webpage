import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useClickSound from "../../Home/Component/useClickSound";

export default function Navbar({ onSelect, selectedUnit, showFloorPlans, selectedFloorsForCompare = [], isDuplexActive }) {
  const [selectedFloor, setSelectedFloor] = useState(null);
  const { playClickSound, ClickAudio } = useClickSound();
  const navigate = useNavigate();

  const floors = [
    { id: "1", label: "Exclusive Club" },
    { id: "duplex", label: "Duplex" },  // ✅ Replaced Mansions with Duplex
    { id: "4", label: "Parking Levels" },
    { id: "5", label: "Sky-Club" }
  ];

  const handleHomeClick = () => {
    navigate("/home");
    setSelectedFloor(null);
  };

  const handleFloorClick = (floorId) => {
    if (floorId === "home") {
      handleHomeClick();
      return;
    }

    if (floorId === "duplex") {
      onSelect("duplex");
      setSelectedFloor(selectedFloor === floorId ? null : floorId);
    } else if (floorId === "2") {
      onSelect("floorPlan", !showFloorPlans);
      setSelectedFloor(showFloorPlans ? null : floorId);
    } else {
      onSelect("floor", floorId);
      setSelectedFloor(selectedFloor === floorId ? null : floorId);
    }
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
              backgroundColor: 'transparent',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              textTransform: 'uppercase',
              fontSize: '20px',
              fontWeight: ((floor.id === "2" && showFloorPlans) || 
                           (floor.id === "duplex" && isDuplexActive) ||
                           selectedFloor === floor.id) ? 'bold' : 'normal',
            }}
          >
            {floor.label}
          </button>
        ))}
      </div>
    </div>
  );
}
