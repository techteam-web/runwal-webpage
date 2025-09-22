import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "../App.css";

export default function FloorsPanel({ current, onSelect }) {
  const floors = [
    { id: "120", label: "120th Floor" },
    { id: "105", label: "105th Floor" },
    { id: "89", label: "89th Floor" },
    { id: "73", label: "73rd Floor" },
  ];

  const containerRef = useRef(null);
  const buttonRefs = useRef({});
  const [selectedButton, setSelectedButton] = useState(null);

  // Handle Home button click
  const handleHomeClick = (e) => {
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      animateGradientFromPoint(x, y, 'Home');
    }
    
    // Navigate using window.location
    window.location.href = "/";
  };

  // Animation function
  const animateGradientFromPoint = (x, y, name) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const maxRadius = Math.hypot(rect.width, rect.height);
    const targetRadius = Math.min(220, maxRadius);

    container.style.setProperty("--x", `${x}px`);
    container.style.setProperty("--y", `${y}px`);

    gsap.killTweensOf(container);
    gsap.set(container, { "--r": 0 });
    gsap.to(container, {
      duration: 0.45,
      ease: "power3.out",
      "--r": targetRadius,
    });

    const btn = buttonRefs.current[name];
    if (btn) {
      gsap.killTweensOf(btn);
      gsap.set(btn, { "--br": 0 });
      gsap.to(btn, { duration: 0.35, ease: "power3.out", "--br": 120 });
      setSelectedButton(name);
    }
  };

  // Container mouse effects
  const handleContainerMouseMove = (event) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    target.style.setProperty("--x", `${mouseX}px`);
    target.style.setProperty("--y", `${mouseY}px`);
    target.style.setProperty("--b", `1`);
  };

  const handleContainerMouseLeave = (event) => {
    const target = event.currentTarget;
    target.style.setProperty("--x", `500%`);
    target.style.setProperty("--y", `500%`);
  };

  // Ripple effects
  const rippleMouseMove = (e, btn) => {
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement("span");
    if (btn.querySelector("span")) {
      btn.querySelector("span").remove();
    }
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.position = "absolute";
    ripple.style.borderRadius = "50%";
    ripple.style.background = "#626478";
    ripple.style.pointerEvents = "none";
    ripple.style.transform = "scale(0)";
    ripple.style.opacity = "1";
    ripple.style.zIndex = "-1";

    btn.appendChild(ripple);

    gsap.to(ripple, {
      scale: 4,
      duration: 1.5,
      ease: "power2.out",
    });
  };

  const rippleMouseLeave = (e, btn) => {
    const ripple = btn.querySelector("span");
    if (ripple) {
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      gsap.to(ripple, {
        opacity: 0,
        duration: 1,
        scale: 0,
        ease: "power1.out",
        onComplete: () => {
          ripple.remove();
        },
      });
    }
  };

  // Handle floor selection
  const handleFloorClick = (floorId, e) => {
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      animateGradientFromPoint(x, y, floorId);
    }
    onSelect(floorId);
  };

  useEffect(() => {
    const ruler = document.querySelector(".floors-ruler-main");
    const items = document.querySelectorAll(".floors-ruler-item");
    const progressBar = document.querySelector(".floors-progress");
    const hoverBar = document.querySelector(".floors-hover-bar");

    if (!ruler || !items.length || !progressBar || !hoverBar) return;

    function updateRuler(clickedItem) {
      items.forEach((item) => item.classList.remove("active"));
      clickedItem.classList.add("active");

      let progressWidth = 0;
      const rulerWidth = ruler.offsetWidth;

      for (const item of items) {
        progressWidth += item.offsetWidth;
        if (item.classList.contains("active")) {
          progressWidth -= item.offsetWidth / 2;
          break;
        }
      }

      const scaleX = progressWidth / rulerWidth;
      progressBar.style.transform = `scaleX(${scaleX})`;
    }

    items.forEach((item) => {
      item.addEventListener("mouseenter", () => {
        gsap.to(hoverBar, {
          x: item.offsetLeft,
          width: item.offsetWidth,
          duration: 0.4,
          ease: "power3.out",
          overwrite: "auto",
        });
      });

      item.addEventListener("mouseleave", () => {
        gsap.to(hoverBar, {
          width: 0,
          x: item.offsetLeft + item.offsetWidth / 2,
          duration: 0.4,
          ease: "power3.in",
          overwrite: "auto",
        });
      });
    });

    const initialActiveItem = document.querySelector(
      `.floors-ruler-item[data-id="${current}"]`
    );
    if (initialActiveItem) {
      setTimeout(() => updateRuler(initialActiveItem), 100);
    }
  }, [current, onSelect]);

  return (
    <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 z-[99999]
    max-sm:bottom-1 max-md:bottom-1 max-lg:bottom-2">
      <div
        ref={containerRef}
        onMouseMove={handleContainerMouseMove}
        onMouseLeave={handleContainerMouseLeave}
        className="drop-container overflow-hidden w-fit h-fit text-nowrap text-white p-1 bg-clip-padding backdrop-blur-sm border-4 border-[#385270] rounded-4xl flex flex-col gap-2
        max-sm:border-2 max-sm:p-0.5 max-sm:rounded-2xl max-sm:gap-1
        max-md:border-2 max-md:p-0.5 max-md:rounded-3xl max-md:gap-1
        max-lg:border-2 max-lg:p-0.5 max-lg:rounded-3xl max-lg:gap-1.5"
        style={{
          "--x": "500%",
          "--y": "500%",
          "--r": "160px",
          backgroundImage: "radial-gradient(var(--r) var(--r) at var(--x) var(--y), rgba(255, 208, 117, 0.8), rgba(255,255,255,0) 40%)",
          fontFamily: 'Zap, sans-serif'
        }}
      >
        {/* Navigation Buttons Row */}
        <div className="flex items-center gap-2 justify-center
        max-sm:gap-1 max-md:gap-1.5 max-lg:gap-2">
          
          {/* Home Button */}
          <button
            ref={(el) => {
              if (el) buttonRefs.current['Home'] = el;
            }}
            onMouseEnter={(e) => rippleMouseMove(e, e.currentTarget)}
            onMouseLeave={(e) => rippleMouseLeave(e, e.currentTarget)}
            onClick={handleHomeClick}
            className="dropbox-btn uppercase overflow-hidden text-shadow-lg p-1 px-3 rounded-2xl transition-all duration-300 cursor-pointer relative 
max-sm:px-1 max-sm:p-0.5 max-sm:text-[8px] 
max-md:px-2 max-md:p-1 max-md:text-[10px] 
max-lg:px-2 max-lg:p-1 max-lg:text-[12px]
max-xl:px-2 max-xl:p-1 max-xl:text-[12px]
max-2xl:px-2 max-2xl:p-1 max-2xl:text-[14px]"
          >
            Home
          </button>

          {/* Floor Buttons */}
          {floors.map((floor) => (
            <button
              key={floor.id}
              ref={(el) => {
                if (el) buttonRefs.current[floor.id] = el;
              }}
              onMouseEnter={(e) => rippleMouseMove(e, e.currentTarget)}
              onMouseLeave={(e) => rippleMouseLeave(e, e.currentTarget)}
              onClick={(e) => handleFloorClick(floor.id, e)}
              className="dropbox-btn font-zap uppercase overflow-hidden text-shadow-lg rounded-2xl transition-all duration-300 cursor-pointer relative 
              px-2 py-1 text-sm
              max-sm:px-1 max-sm:py-0.5 max-sm:text-[7px] max-sm:rounded-lg
              max-md:px-1.5 max-md:py-0.5 max-md:text-[8px] max-md:rounded-xl
              max-lg:px-2 max-lg:py-1 max-lg:text-[10px] max-lg:rounded-xl
              max-xl:px-2 max-xl:py-1 max-xl:text-xs
              max-2xl:px-3 max-2xl:py-1 max-2xl:text-sm"
              style={
                current === floor.id
                  ? { backgroundColor: "#404566" }
                  : {}
              }
            >
              {floor.label.replace("th Floor", "").replace("rd Floor", "")}
            </button>
          ))}
        </div>

        
      </div>
    </div>
  );
}
