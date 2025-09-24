import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import useClickSound from "../../Home/Component/useClickSound";

const Dropbox = ({
  setActiveGroupeMarker,
  setActiveGroupDropbox,
  setActiveMarker,
  activeGroupDropbox,
  activeMarker,
  markersGroup,
  markers,
  clickHandle,
}) => {
  const handleMarkerGroupClick = (name) => {
    setActiveMarker("");
    setActiveGroupeMarker(name);
  };

  const handleDropBox = (name) => {
    if (activeGroupDropbox === name) {
      setActiveGroupDropbox("");
    } else {
      setActiveGroupDropbox(name);
      handleMarkerGroupClick(name);
    }
  };

  const containerRef = useRef(null);
  const buttonRefs = useRef({});
  const [selectedButton, setSelectedButton] = useState(null);
  const {playClickSound, ClickAudio} = useClickSound();

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

    // Animate clicked button to "capture" the glow
    const btn = buttonRefs.current[name];
    if (btn) {
      gsap.killTweensOf(btn);
      gsap.set(btn, { "--br": 0 });
      gsap.to(btn, { duration: 0.35, ease: "power3.out", "--br": 120 });
      setSelectedButton(name);
    }
  };

  const handleContainerMouseMove = (event) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    target.style.setProperty("--x", `${mouseX}px`);
    target.style.setProperty("--y", `${mouseY}px`);
    target.style.setProperty("--b", `1`);
  };

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

    // GSAP animation
    gsap.to(ripple, {
      scale: 4,
      duration: 1.5,
      ease: "power2.out",
    });
  };

  const rippleMouseLeave = (e, btn) => {
    const ripple = btn.querySelector("span");
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    if (ripple) {
      gsap.to(ripple, {
        opacity: 0,
        duration: 1,
        scale: 0,
        ease: "power1.out",
        onComplete: () => {
          ripple.remove();
          console.log("hogya");
        },
      });
    }
  };

  const handleContainerMouseLeave = (event) => {
    const target = event.currentTarget;
    target.style.setProperty("--x", `500%`);
    target.style.setProperty("--y", `500%`);
  };

  // Handle Home button click
  const handleHomeClick = (e) => {
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      animateGradientFromPoint(x, y, 'Home');
    }
    
    // Close any active dropdowns
    setActiveGroupDropbox("");
    setActiveMarker("");
    setActiveGroupeMarker("");
    
    // Navigate using window.location
    window.location.href = "/";
  };

  // Hover effect for the dropdown panel (locations list)
  const locationsRef = useRef(null);
  const handleLocationsMouseMove = (event) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    target.style.setProperty("--lx", `${mouseX}px`);
    target.style.setProperty("--ly", `${mouseY}px`);
  };
  const handleLocationsMouseLeave = (event) => {
    const target = event.currentTarget;
    target.style.setProperty("--lx", `50%`);
    target.style.setProperty("--ly", `50%`);
  };

  // GSAP animation for the locations card
  useEffect(() => {
    if (locationsRef.current) {
      if (activeGroupDropbox) {
        // Animate in
        gsap.fromTo(
          locationsRef.current,
          {
            opacity: 0,
            scale: 0.8,
            y: 20,
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1,
            ease: "power3.inOut",
          }
        );
      } else {
        // Animate out
        gsap.to(locationsRef.current, {
          opacity: 0,
          scale: 0.8,
          y: 20,
          duration: 1,
          ease: "power2.in",
        });
      }
    }
  }, [activeGroupDropbox]);

  useEffect(() => {
    if (activeMarker === "" && activeGroupDropbox !== "") {
      setActiveGroupeMarker(activeGroupDropbox);
    } else {
      setActiveGroupeMarker("");
    }
  }, [activeGroupDropbox, activeMarker, setActiveGroupeMarker]);

  return (
    <>
      {/* Desktop Menu */}
      <ClickAudio/>
      <div
        ref={containerRef}
        onMouseMove={handleContainerMouseMove}
        onMouseLeave={handleContainerMouseLeave}
        className="drop-container overflow-hidden w-fit h-fit text-nowrap text-white bottom-2 left-1/2 transform -translate-x-1/2 p-1 z-[99999] absolute bg-clip-padding backdrop-blur-sm border-4 border-[#385270]
       rounded-4xl flex justify-center items-center gap-3
       max-sm:gap-0.5 max-sm:bottom-1 max-sm:border-1 max-sm:p-0.5 max-sm:rounded-2xl
       max-md:gap-1 max-md:bottom-1 max-md:border-2 max-md:p-0.5 max-md:justify-between max-md:rounded-3xl
       max-lg:gap-2 max-lg:bottom-2 max-lg:border-2 max-lg:p-0.5 max-lg:justify-between max-lg:rounded-3xl
       max-xl:p-1 max-xl:gap-3 max-xl:justify-between
       max-2xl:p-2 max-2xl:gap-3"
        style={{
          "--x": "500%",
          "--y": "500%",
          "--r": "160px",
          backgroundImage:
            "radial-gradient(var(--r) var(--r) at var(--x) var(--y), rgba(255, 208, 117, 0.8), rgba(255,255,255,0) 40%)",
        }}
      >
        {/* Home Button */}
        <div className="flex items-center" style={{ fontFamily: 'Zap, sans-serif' }}>
          <button
            ref={(el) => {
              if (el) buttonRefs.current['Home'] = el;
            }}
            onMouseEnter={(e) => rippleMouseMove(e, e.currentTarget)}
            onMouseLeave={(e) => rippleMouseLeave(e, e.currentTarget)}
            className="dropbox-btn uppercase overflow-hidden text-shadow-lg p-1 px-3 rounded-2xl transition-all duration-300 cursor-pointer relative 
max-sm:px-1 max-sm:p-0.5 max-sm:text-[8px] 
max-md:px-2 max-md:p-1 max-md:text-[10px] 
max-lg:px-2 max-lg:p-1 max-lg:text-[12px]
max-xl:px-2 max-xl:p-1 max-xl:text-[12px]
max-2xl:px-2 max-2xl:p-1 max-2xl:text-[14px]"
            onClick={(e) => {handleHomeClick(e); playClickSound();}}
          >
            Home
          </button>
        </div>

        {/* Existing marker group buttons */}
        {Object.keys(markersGroup).map((name) => (
          <div className="flex items-center" key={name} style={{ fontFamily: 'Zap, sans-serif' }}>
            <button
              ref={(el) => {
                if (el) buttonRefs.current[name] = el;
              }}
              onMouseEnter={(e) => rippleMouseMove(e, e.currentTarget)}
              onMouseLeave={(e) => rippleMouseLeave(e, e.currentTarget)}
              className="dropbox-btn uppercase overflow-hidden text-shadow-lg rounded-2xl transition-all duration-300 cursor-pointer relative 
              px-2 py-1 text-sm
              max-sm:px-1 max-sm:py-0.5 max-sm:text-[7px] max-sm:rounded-lg
              max-md:px-1.5 max-md:py-0.5 max-md:text-[8px] max-md:rounded-xl
              max-lg:px-2 max-lg:py-1 max-lg:text-[10px] max-lg:rounded-xl
              max-xl:px-2 max-xl:py-1 max-xl:text-xs
              max-2xl:px-3 max-2xl:py-1 max-2xl:text-sm"
              onClick={(e) => {
                playClickSound();
                const container = containerRef.current;
                if (container) {
                  const rect = container.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  animateGradientFromPoint(x, y, name);
                }
                handleDropBox(name);
              }}
              style={
                activeGroupDropbox === name
                  ? {
                      backgroundColor: "#404566",
                    }
                  : {}
              }
            >
              {name}
            </button>
            {activeGroupDropbox === name &&
              createPortal(
                <div
                  ref={locationsRef}
                  onMouseMove={handleLocationsMouseMove}
                  onMouseLeave={handleLocationsMouseLeave}
                  className="w-auto bottom-16 left-1/2 transform -translate-x-1/2 p-2 fixed z-[100000] flex gap-2 border-2 rounded-xl justify-evenly items-center bg-clip-padding backdrop-blur-3xl border-solid border-[rgb(187,174,99)] 
                  max-sm:bottom-6 max-sm:border-1 max-sm:rounded-md max-sm:gap-1 max-sm:p-1 
                  max-md:bottom-7 max-md:border-1 max-md:rounded-lg max-md:gap-1 max-md:p-1 
                  max-lg:bottom-9 max-lg:rounded-lg max-lg:gap-1.5 max-lg:p-1.5
                  max-xl:bottom-12 max-xl:p-2 max-xl:gap-2
                  max-2xl:bottom-14 max-2xl:p-2 max-2xl:gap-2"
                  style={{
                    "--lx": "50%",
                    "--ly": "50%",
                    "--lr": "120px",
                    backgroundImage:
                      "radial-gradient(var(--lr) var(--lr) at var(--lx) var(--ly), rgba(255,255,255,0.2), rgba(255,255,255,0) 55%)",
                    backgroundColor: "rgba(24,26,61,0.67)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    fontFamily: 'Zap, sans-serif'
                  }}
                >
                  {markersGroup[name]?.locations?.map((path) => (
                    <button
                      key={path}
                      onMouseEnter={(e) => rippleMouseMove(e, e.currentTarget)}
                      onMouseLeave={(e) => rippleMouseLeave(e, e.currentTarget)}
                      onClick={() => {playClickSound(); clickHandle(path)}}
                      className="overflow-hidden uppercase text-shadow-lg text-white rounded-md transition-all duration-300 cursor-pointer relative text-center 
                      px-2 py-1 text-xs
                      max-sm:px-1 max-sm:py-0.5 max-sm:rounded-sm max-sm:text-[6px]  
                      max-md:px-1.5 max-md:py-0.5 max-md:rounded-sm max-md:text-[7px]   
                      max-lg:px-2 max-lg:py-1 max-lg:rounded-sm max-lg:text-[9px]
                      max-xl:px-2 max-xl:py-1 max-xl:text-[10px]
                      max-2xl:px-3 max-2xl:py-1 max-2xl:text-xs"
                      style={
                        activeMarker === path
                          ? {
                              backgroundColor: "rgba(255,208,117,0.4)",
                            }
                          : {}
                      }
                    >
                      {markers?.find((marker) => marker.path === path)?.name}
                    </button>
                  ))}
                </div>,
                document.body
              )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Dropbox;
