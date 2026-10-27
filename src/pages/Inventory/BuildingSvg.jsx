import { useState, useRef, useEffect } from "react";
// ✅ Remove socket.io import
// import io from 'socket.io-client';

// ✅ Import local data

import FloorPlanModal from "./components/FloorPlanModal";
import Navbar from "./components/Navbar";
import FloorSelectionModal from "./components/FloorSelectionModal";
import { DEFAULT_PLAN_IMAGES, floorsData } from "./data";

export default function BuildingOverlay() {
  const [floors, setFloors] = useState([]);
  const [error, setError] = useState(null);
  const [isDuplexActive, setIsDuplexActive] = useState(false);

  // Floor states
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [showFloorPlans, setShowFloorPlans] = useState(false);
  const [floorPlanModal, setFloorPlanModal] = useState(null);

  // Individual floor to comparison flow states
  const [showFloorSelectionModal, setShowFloorSelectionModal] = useState(false);
  const [preSelectedFloor, setPreSelectedFloor] = useState(null);

  // Compare functionality states
  const [compareMode, setCompareMode] = useState(false);
  const [selectedFloorsForCompare, setSelectedFloorsForCompare] = useState([]);

  // Highlight modal
  const [highlightPlanModal, setHighlightPlanModal] = useState(null);

  // Filter/active state
  const [activeHighlight, setActiveHighlight] = useState(null);

  // Hover state for category overlays
  const [hoverHighlight, setHoverHighlight] = useState(null);
  const [lockedFloor, setLockedFloor] = useState(null);

  const svgRef = useRef(null);

  // Category overlays with their plan images
  const HIGHLIGHT_AREAS = {
    wardrobe: {
      name: "Wardrobe Areas",
      activeFill: "rgba(139, 92, 246, 0.60)",
      hoverFill: "rgba(139, 92, 246, 0.50)",
      d: "m 90.723317,145.66639 12.821743,-1.69155 c 0,0 -1.715,0.13584 0.017,0 1.73197,-0.13584 4.87331,0.0509 4.87331,0.0509 l 1.73197,0.20376 0.71317,0.0849 0.62827,0.1698 0.62826,0.22075 0.44149,0.18678 0.32262,0.1698 0.39054,0.28866 0.22074,0.23773 0.0679,0.1698 0.0679,0.27168 0.017,0.37357 0.017,6.77508 c 0,0 0.47544,-0.0849 -0.66223,-0.40752 -1.13767,-0.32263 -3.15831,-0.57733 -3.15831,-0.57733 l -1.17163,-0.11886 -0.96787,-0.034 -5.04311,0.017 -1.25653,0.0509 -0.98485,0.0679 -11.138989,1.20559 0.0849,-7.02979 z",
      planImages: ["/floor-plans/C1.webp", "/floor-plans/C2.webp"],
      planLabels: ["Club Level 1", "Club Level 2"]
    },
    terrace: {
      name: "Parking / Terrace",
      activeFill: "rgba(16, 185, 129, 0.60)",
      hoverFill: "rgba(16, 185, 129, 0.50)",
      d: "m 89.378556,154.11918 -0.240136,32.22622 24.78202,0.19211 0.048,-32.99466 c 0,0 1.36877,0.69639 -0.1681,-0.048 -1.53687,-0.74442 -3.45796,-1.10462 -3.45796,-1.10462 l -3.26584,-0.21612 -4.03429,0.12006 -13.807805,1.29674 z",
      planImages: ["/floor-plans/parking-podium-1.webp", "/floor-plans/parking-podium-2.webp"],
      planLabels: ["Podium 1", "Podium 2 - 9"]
    },
    skyclub: {
      name: "Sky Club",
      activeFill: "rgba(135, 206, 235, 0.60)",
      hoverFill: "rgba(135, 206, 235, 0.50)",
      d: "m 89.426583,37.749353 13.159447,-5.859315 c 0,0 -2.20925,0.480272 0,0 2.20925,-0.480271 3.74612,-0.288163 3.74612,-0.288163 0,0 -1.87306,-0.288163 0.14408,0.09605 2.01714,0.384217 3.07374,1.00857 3.07374,1.00857 0,0 -1.34476,-0.864489 0.14408,0.04803 1.48884,0.912516 3.65006,3.794146 3.65006,3.794146 L 113.152,36.020375 c 0,0 -0.76843,1.440815 0,0 0.76844,-1.440815 0.81647,-5.379043 0.81647,-5.379043 0,0 0.33619,1.200679 0,0 -0.3362,-1.200679 -0.96055,-2.737549 -0.96055,-2.737549 0,0 0.38422,-0.144081 -0.91251,-1.68095 -1.29674,-1.536869 -3.1698,-2.641494 -3.1698,-2.641494 l -1.777,-0.768435 -1.44082,-0.144081 -1.15265,0.09605 -0.91252,-0.04803 -0.48027,0.09605 -1.20068,0.528299 -11.862706,5.523124 c 0,0 0.240135,-0.624353 -0.720408,1.056598 -0.960543,1.680951 -0.09605,1.921086 -0.09605,1.921086 0,0 -1.056598,-0.576326 -0.192113,0.33619 0.864489,0.912516 1.536869,0.576326 1.440815,0.912516 -0.09605,0.336191 -0.720407,0.336191 -0.144077,1.440816 0.576326,1.104625 -0.816463,1.728978 -0.816463,1.728978",
    }
  };

  // ✅ Load data from local file
  useEffect(() => {
    try {
      setFloors(floorsData);
      console.log("✅ Local floor data loaded");
    } catch (err) {
      console.error("Error loading floor data:", err);
      setError("Failed to load floor data");
    }
  }, []);

  const handleFloorMouseEnter = (floor, event) => {
    const isMobile = window.matchMedia('(hover: none)').matches;
    if (!isMobile && !compareMode) {
      setSelectedFloor(floor);
      setCardPosition({ x: event.clientX + 10, y: event.clientY + 10 });
      
      if (svgRef.current) {
        const allFloorPaths = svgRef.current.querySelectorAll('path[id^="floor"]');
        allFloorPaths.forEach(path => {
          path.style.fill = "rgba(208, 170, 45, 0.28)";
        });
      }
    }
  };

  const handleFloorMouseLeave = (floor, event) => {
    const isMobile = window.matchMedia('(hover: none)').matches;
    if (!isMobile && !compareMode) {
      setSelectedFloor(null);
      
      if (svgRef.current) {
        const allFloorPaths = svgRef.current.querySelectorAll('path[id^="floor"]');
        allFloorPaths.forEach(path => {
          const floorId = path.id;
          const floorData = floors.find(f => f.id === floorId);
          if (floorData) {
            path.style.fill = getFloorFillColor(floorData);
          }
        });
      }
    }
  };

  // ✅ Updated to use floor.plans instead of floor.info
  const handleFloorClick = (floor, event) => {
    const isMobile = window.matchMedia('(hover: none)').matches;
    const { plans, labels } = floor;
    
    if (isMobile) {
      if (selectedFloor?.id === floor.id) {
        // ✅ Check if floor has plans
        if (plans && plans.length > 0) {
          setFloorPlanModal({ id: floor.id, plans, labels });
          setSelectedFloor(null);
        }
      } else {
        setSelectedFloor(floor);
        
        setCardPosition({ 
          x: 0,
          y: 0
        });
        
        const activeFill = "rgba(208, 170, 45, 0.28)";
        event.target.style.fill = activeFill;
        
        setTimeout(() => {
          if (selectedFloor?.id === floor.id) {
            setSelectedFloor(null);
            event.target.style.fill = getFloorFillColor(floor);
          }
        }, 3000);
        
        if ('vibrate' in navigator) navigator.vibrate(50);
      }
    } else {
      // ✅ Desktop click - open modal with plans
      if (plans && plans.length > 0) {
        setFloorPlanModal({ id: floor.id, plans, labels });
      }
    }
  };

  const handleOpenComparison = (floor) => {
    setPreSelectedFloor(floor);
    setLockedFloor(floor);
    setShowFloorSelectionModal(true);
    setTimeout(() => {
      setFloorPlanModal(null);
    }, 200);
  };

  const handleNavbarSelect = (type, value) => {
  if (type === "duplex") {
    const newDuplexActive = !isDuplexActive;
    setIsDuplexActive(newDuplexActive);
    
    // ✅ Open floor plan modal when duplex is activated
    if (newDuplexActive) {
      const plans = DEFAULT_PLAN_IMAGES;
      if (plans && plans.length > 0) {
        setFloorPlanModal({ id: 'duplex', plans, labels: ["Lower Level", "Upper Level"] });
      }
    }
    
    if (svgRef.current) {
      const allFloorPaths = svgRef.current.querySelectorAll('path[id^="floor"]');
      if (newDuplexActive) {
        allFloorPaths.forEach(path => {
          path.style.fill = "rgba(208, 170, 45, 0.28)";
        });
      } else {
        allFloorPaths.forEach(path => {
          const floorId = path.id;
          const floorData = floors.find(f => f.id === floorId);
          if (floorData) {
            path.style.fill = getFloorFillColor(floorData);
          }
        });
      }
    }
    
    setActiveHighlight(null);
    setShowFloorPlans(false);
    setSelectedUnit(null);
  } else if (type === "floorPlan") {
    const newShowFloorPlans = !showFloorPlans;
    setShowFloorPlans(newShowFloorPlans);
    setActiveHighlight(newShowFloorPlans ? 'floorPlan' : null);
    setSelectedUnit(null);
    setIsDuplexActive(false);
  } else if (type === "floor") {
    if (value === "1") {
      // ✅ Exclusive Club (Wardrobe)
      const isCurrentlyActive = activeHighlight === 'wardrobe';
      setActiveHighlight(isCurrentlyActive ? null : 'wardrobe');
      
      // ✅ Open modal when activating
      if (!isCurrentlyActive) {
        const area = HIGHLIGHT_AREAS['wardrobe'];
        if (area?.planImages && area.planImages.length > 0) {
          setHighlightPlanModal({
            id: 'wardrobe',
            name: area.name,
            planImages: area.planImages,
            labels: area.planLabels
          });
        }
      }
      
      setShowFloorPlans(false);
      setSelectedUnit(null);
      setIsDuplexActive(false);
    } else if (value === "4") {
      // ✅ Parking Levels (Terrace)
      const isCurrentlyActive = activeHighlight === 'terrace';
      setActiveHighlight(isCurrentlyActive ? null : 'terrace');
      
      // ✅ Open modal when activating
      if (!isCurrentlyActive) {
        const area = HIGHLIGHT_AREAS['terrace'];
        if (area?.planImages && area.planImages.length > 0) {
          setHighlightPlanModal({
            id: 'terrace',
            name: area.name,
            planImages: area.planImages,
            labels: area.planLabels
          });
        }
      }
      
      setShowFloorPlans(false);
      setSelectedUnit(null);
      setIsDuplexActive(false);
    } else if (value === "5") {
      // ✅ Sky Club
      const isCurrentlyActive = activeHighlight === 'skyclub';
      setActiveHighlight(isCurrentlyActive ? null : 'skyclub');
      
      // ✅ Open modal when activating
      if (!isCurrentlyActive) {
        const area = HIGHLIGHT_AREAS['skyclub'];
        if (area?.planImages && area.planImages.length > 0) {
          setHighlightPlanModal({
            id: 'skyclub',
            name: area.name,
            planImages: area.planImages,
            labels: area.planLabels
          });
        }
      }
      
      setShowFloorPlans(false);
      setSelectedUnit(null);
      setIsDuplexActive(false);
    } else {
      setActiveHighlight(null);
      setShowFloorPlans(false);
      setSelectedUnit(null);
      setIsDuplexActive(false);
    }
  }

  if (svgRef.current && type !== "duplex") {
    const pathElements = svgRef.current.querySelectorAll('path[id^="floor"]');
    pathElements.forEach(path => { path.style.fill = ''; });
  }
};


  // ✅ Updated to use floor.plans instead of floor.info
  const getFloorFillColor = (floor) => {
    if (activeHighlight === 'wardrobe' || activeHighlight === 'terrace' || activeHighlight === 'skyclub') {
      return "rgba(0, 0, 0, 0.22)";
    }

    if (activeHighlight === 'floorPlan') {
      const hasFloorPlan = Array.isArray(floor.plans) && floor.plans.length > 0;
      return hasFloorPlan ? "#d0aa2d92" : "rgba(0, 0, 0, 0.10)";
    }

    if (activeHighlight === 'unit' && selectedUnit) {
      const matchesUnit = floor.bhk === selectedUnit;
      if (matchesUnit) return "rgba(208, 170, 45, 0.28)";
      return "rgba(0, 0, 0, 0.10)";
    }

    return "rgba(0, 0, 0, 0.22)";
  };

  const renderCategoryOverlays = () => {
    const keys = ['wardrobe', 'terrace', 'skyclub'];
    return keys.map(key => {
      const area = HIGHLIGHT_AREAS[key];
      if (!area) return null;

      // Determine fill based on state priority: active > hover > default
      let fill = "rgba(0,0,0,0.10)"; // default transparent
      if (activeHighlight === key) {
        fill = area.activeFill; // when clicked/active
      } else if (hoverHighlight === key) {
        fill = area.hoverFill; // when hovered
      }

      const hasFloorPlan = area.planImages && Array.isArray(area.planImages) && area.planImages.length > 0;

      return (
        <path
          key={`cat-${key}`}
          d={area.d}
          fill={fill}
          className={hasFloorPlan ? "cursor-pointer transition-all duration-200" : "transition-all duration-200"}
          style={{
            filter:
              activeHighlight === key
                ? "drop-shadow(0 0 6px rgba(0,0,0,0.15))"
                : hoverHighlight === key
                ? "drop-shadow(0 0 4px rgba(0,0,0,0.12))"
                : "none",
            pointerEvents: hasFloorPlan ? "auto" : "none"
          }}
          onMouseEnter={() => setHoverHighlight(key)}
          onMouseLeave={() => setHoverHighlight(null)}
          onClick={hasFloorPlan ? (e) => {
            e.stopPropagation();
            const isMobile = window.matchMedia('(hover: none)').matches;
            if (isMobile && 'vibrate' in navigator) navigator.vibrate(50);
            
            setActiveHighlight(key);
            setHighlightPlanModal({
              id: key,
              name: area.name,
              planImages: Array.isArray(area.planImages) ? area.planImages : [],
              labels: area.planLabels
            });
          } : undefined}
        />
      );
    });
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-[#dedbd4]">
      {error ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center max-w-md">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Unable to Load Floor Data</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-[#CFB284] text-white rounded-lg hover:bg-[#b8a073] transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="fixed top-4 right-10 z-40">
            <img 
              src="/logo.svg" 
              alt="Logo" 
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-30 md:h-30 object-contain"
            />
          </div>

          <div className="relative w-full h-full flex items-center justify-center">
            <svg
              ref={svgRef}
              viewBox="0 0 377 210.92149"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
              preserveAspectRatio="xMidYMid slice"
              style={{
                minWidth:'100%',
                minHeight:'100%',
              }}
            >
              <image
                href="/building.svg"
                x="0"
                y="0"
                width="381.7"
                height="210.92149"
                preserveAspectRatio="xMidYMid meet"
              />

              <g transform="translate(86,0)">
                {renderCategoryOverlays()}
              </g>

              <g transform="translate(85,0)">
                {floors.map((floor) => (
                  <path
                    key={floor.id}
                    id={floor.id}
                    d={floor.d}
                    fill={getFloorFillColor(floor)}
                    className="cursor-pointer transition-colors duration-200"
                    onMouseEnter={(event) => handleFloorMouseEnter(floor, event)}
                    onMouseLeave={(event) => handleFloorMouseLeave(floor, event)}
                    onClick={(event) => handleFloorClick(floor, event)}
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              </g>
            </svg>
          </div>

          <div className="fixed bottom-0 left-0 right-0 z-30">
            <Navbar 
              onSelect={handleNavbarSelect} 
              selectedUnit={selectedUnit}
              showFloorPlans={showFloorPlans}
              activeHighlight={activeHighlight}
              compareMode={false}
              isDuplexActive={isDuplexActive}
            />
          </div>

          {floorPlanModal && (
            <FloorPlanModal
              floor={floorPlanModal}
              onClose={() => {
                // ✅ Reset duplex state if closing duplex modal
                if (floorPlanModal.id === 'duplex') {
                  // ✅ Reset floor fill colors to default
                  if (svgRef.current) {
                    const allFloorPaths = svgRef.current.querySelectorAll('path[id^="floor"]');
                    allFloorPaths.forEach(path => {
                      path.style.fill = "rgba(0, 0, 0, 0.22)";
                    });
                  }
                  
                  // ✅ Reset duplex state
                  setIsDuplexActive(false);
                }
                
                // ✅ Close modal
                setFloorPlanModal(null);
              }}
              onOpenComparison={handleOpenComparison}
            />
          )}

          {highlightPlanModal && (
            <FloorPlanModal
              highlight={highlightPlanModal}
              onClose={() => {
                setHighlightPlanModal(null);
                setActiveHighlight(null);
              }}
            />
          )}

          <FloorSelectionModal
            show={showFloorSelectionModal}
            onClose={() => {
              setShowFloorSelectionModal(false);
              setPreSelectedFloor(null);
              setLockedFloor(null);
            }}
            floors={floors}
            selectedFloorsForCompare={selectedFloorsForCompare}
            preSelectedFloor={preSelectedFloor}
            lockedFloor={lockedFloor}
            onFloorSelect={(floor) => {
              const isSelected = selectedFloorsForCompare.some(f => f.id === floor.id);
              if (isSelected) {
                setSelectedFloorsForCompare(prev => prev.filter(f => f.id !== floor.id));
              } else {
                if (selectedFloorsForCompare.length < 4) {
                  setSelectedFloorsForCompare(prev => [...prev, floor]);
                }
              }
            }}
          />
        </>
      )}
    </div>
  );
}
