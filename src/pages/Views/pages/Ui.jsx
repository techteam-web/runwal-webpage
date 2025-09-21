import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import "../App.css";

export default function Ui({ current, onSelect }) {
  const [unitsExpanded, setUnitsExpanded] = useState(false);
  const [collapsing, setCollapsing] = useState(false);
  const unitsBtnRef = useRef(null);
  const itemRefs = useRef([]);
  const floors = [
    { id: "1", label: "Wardrobe" },
    { id: "2", label: "Floor-Plan" },
    { id: "3", label: "Units" },
    { id: "4", label: "Terrace" },
  ];
  const unitNumbers = [1, 2, 3];

  // Ref for unit number items
  const unitRefs = useRef([]);

  useEffect(() => {
    // Animate expand/collapse for Units button and other items
    if (!unitsExpanded && !collapsing) {
      // Restore all items with fade/slide in
      itemRefs.current.forEach((ref, idx) => {
        if (ref) {
          gsap.fromTo(ref,
            { opacity: 0, x: 40 },
            {
              x: 0,
              scale: 1,
              opacity: 1,
              boxShadow: "none",
              duration: 0.5,
              pointerEvents: "auto",
              ease: "power3.in",
              delay: 0.1 + idx * 0.07,
            }
          );
        }
      });
    } else if (unitsExpanded && !collapsing) {
      // Animate Units button: slide left then right
      if (unitsBtnRef.current) {
        const tl = gsap.timeline();
        tl.to(unitsBtnRef.current, {
          x: -60,
          scale: 1.05,
          duration: 0.25,
          ease: "power3.out",
        })
        .to(unitsBtnRef.current, {
          x: 100,
          scale: 1.1,
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          duration: 0.45,
          ease: "power3.out",
        });
      }
      // Animate other items out
      itemRefs.current.forEach((ref, idx) => {
        if (ref && ref !== unitsBtnRef.current) {
          gsap.to(ref, {
            opacity: 0,
            scale: 0.95,
            x: -40,
            duration: 0.4,
            pointerEvents: "none",
            ease: "power3.inOut",
            delay: idx * 0.05,
          });
        }
      });
    } else if (collapsing) {
      // Animate Units button to the right (e.g., x: 200)
      if (unitsBtnRef.current) {
        gsap.to(unitsBtnRef.current, {
          x: 330,
          scale: 1,
          boxShadow: "none",
          duration: 0.5,
          ease: "power3.inOut",
        });
      }
      // Animate unit numbers down and fade out
      unitRefs.current.forEach((ref, idx) => {
        if (ref) {
          gsap.to(ref, {
            y: 60,
            opacity: 0,
            duration: 0.4,
            ease: "power3.inOut",
            delay: idx * 0.07,
          });
        }
      });
      // After animation, restore view
      setTimeout(() => {
        setUnitsExpanded(false);
        setCollapsing(false);
        if (unitsBtnRef.current) {
          gsap.set(unitsBtnRef.current, { x: 0 });
        }
        unitRefs.current.forEach(ref => {
          if (ref) gsap.set(ref, { y: 0, opacity: 1 });
        });
      }, 500);
      // Animate other items in
      itemRefs.current.forEach((ref, idx) => {
        if (ref && ref !== unitsBtnRef.current) {
          gsap.fromTo(ref,
            { opacity: 0, x: -40 },
            {
              x: 0,
              scale: 1,
              opacity: 1,
              boxShadow: "none",
              duration: 0.5,
              pointerEvents: "auto",
              ease: "power3.out",
              delay: 0.1 + idx * 0.07,
            }
          );
        }
      });
    }
  }, [unitsExpanded, collapsing]);

  return (
    <div className="container">
      <div className="home-ruler-inner">
        <div className="floors-progress"></div>
        <div className="floors-hover-bar"></div>
        <div className="floors-ruler-main">
          {/* --- Spacer Start --- */}
          <div className="floors-ruler-item" style={{ flexBasis: "100%" }}>
            <div className="home-ruler-main-item-line">
              <div className="home-ruler-main-item-line-body"></div>
            </div>
          </div>

          {/* --- Floor Items or Units Expanded --- */}
          {!unitsExpanded ? (
            floors.map((floor, idx) => (
              <div
                key={floor.id}
                ref={floor.id === "3" ? unitsBtnRef : el => itemRefs.current[idx] = el}
                className={`floors-ruler-item ${current === floor.id ? "active" : ""}`}
                data-id={floor.id}
                style={{ flexBasis: "150%" }}
                onClick={e => {
                  e.preventDefault();
                  if (floor.id === "3") {
                    setUnitsExpanded(true);
                  } else {
                    onSelect(floor.id);
                  }
                }}
              >
                <div className="home-ruler-main-item-line">
                  <div className="home-ruler-main-item-line-head"></div>
                  <div className="home-ruler-main-item-line-body"></div>
                </div>
                <a href="/ui" className="txt">
                  {floor.label}
                </a>
              </div>
            ))
          ) : (
            <>
              {/* Only show Units button expanded */}
              <div
                className="floors-ruler-item active"
                ref={unitsBtnRef}
                data-id="3"
                style={{ flexBasis: "150%", cursor: "pointer" }}
                onClick={() => {
                  setCollapsing(true);
                }}
              >
                
                <a
                  href="#"
                  className="txt"
                  onClick={e => e.preventDefault()}
                >
                  Units
                </a>
              </div>
              {/* Show unit numbers */}
              {unitNumbers.map((num, idx) => (
                <div
                  key={num}
                  ref={el => unitRefs.current[idx] = el}
                  className="floors-ruler-item unit-number-item"
                  style={{ flexBasis: "100%", opacity: 1, pointerEvents: "auto" }}
                >
             
                  <a
                    href="#"
                    className="txt"
                    onClick={e => e.preventDefault()}
                  >
                    {num}
                  </a>
                </div>
              ))}
            </>
          )}

          {/* --- Spacer End --- */}
          <div className="floors-ruler-item" style={{ flexBasis: "100%" }}>
            <div className="home-ruler-main-item-line">
              <div className="home-ruler-main-item-line-body"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}
