import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";

const Nav = ({
  setActiveGroupeMarker,
  setActiveGroupDropbox,
  setActiveMarker,
  activeGroupDropbox,
  activeMarker,
  markersGroup,
  markers,
  clickHandle,
  showNav,
  setShowSingleImage,
}) => {
  // Click sound for navbar buttons
  const clickSoundRef = useRef(null);

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
      // opacity: 0,
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

  // linear-gradient(135deg, rgba(192,160,98,0.7), rgba(168,136,76,0.7))

  return (
    <>
      <audio ref={clickSoundRef} src="/click.mp3" preload="auto" />
      {/* Desktop Menu */}
      <div
        ref={containerRef}
        onMouseMove={handleContainerMouseMove}
        onMouseLeave={handleContainerMouseLeave}
        className={`drop-container overflow-hidden w-fit h-fit text-nowrap text-white bottom-2 left-1/2 transform -translate-x-1/2 p-2 z-[99999] fixed bg-clip-padding backdrop-blur-sm border-4 border-[#385270]
       rounded-4xl flex justify-center items-center gap-16 
       max-sm:gap-1 max-sm:bottom-1 max-sm:border-2 max-sm:p-0.5 
       max-md:gap-0 max-md:bottom-1 max-md:border-2 max-md:p-0.5 max-md:justify-between
       max-lg:gap-0 max-lg:bottom-2 max-lg:border-2 max-lg:p-1 max-lg:justify-between 
       max-xl:p-2 max-xl:gap-0 max-xl:justify-between${showNav ? ' show' : ''}`}
        style={{
          "--x": "500%",
          "--y": "500%",
          "--r": "160px",
          backgroundImage:
            "radial-gradient(var(--r) var(--r) at var(--x) var(--y), rgba(255, 208, 117, 0.8), rgba(255,255,255,0) 40%)",
        }}
      >
        {Object.keys(markersGroup).map((name) => (
          <div key={name} className="flex items-center">
            <button
              ref={(el) => {
                if (el) buttonRefs.current[name] = el;
              }}
              onMouseEnter={(e) => rippleMouseMove(e, e.currentTarget)}
              onMouseLeave={(e) => rippleMouseLeave(e, e.currentTarget)}
              className="dropbox-btn font-zap uppercase overflow-hidden text-shadow-lg p-1 px-3 rounded-2xl transition-all duration-300 cursor-pointer relative 
              max-sm:px-1 max-sm:p-0.5 max-sm:text-[8px] 
              max-md:px-2 max-md:p-1 max-md:text-[10px] 
              max-lg:px-2 max-lg:p-1 max-lg:text-[12px]
              max-xl:px-2 max-xl:p-1 max-xl:text-[12px]
              max-2xl:px-2 max-2xl:p-1 max-2xl:text-[14px]
              "
              onClick={(e) => {
                // Play click sound
                if (clickSoundRef.current) {
                  clickSoundRef.current.currentTime = 0;
                  clickSoundRef.current.play();
                }
                const container = containerRef.current;
                if (container) {
                  const rect = container.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  animateGradientFromPoint(x, y, name);
                }
                if (name === "Gallery") {
                  setShowSingleImage(true);
                } else if (name === "Home") {
                    if (typeof setShowSingleImage === 'function') setShowSingleImage(false);
                    window.__skipCard5Anim = true;
                    setTimeout(() => {
                      // Use the autoScrollStopYRef value from BuildingScroll.jsx
                      const targetY = window.autoScrollStopYRef && window.autoScrollStopYRef.current != null ? window.autoScrollStopYRef.current : 1000;
                      const smoother = window.ScrollSmoother ? window.ScrollSmoother.get && window.ScrollSmoother.get() : null;
                      if (smoother && smoother.scrollTo) {
                        smoother.scrollTo(targetY, true);
                      } else if (smoother && smoother.scrollTop) {
                        smoother.scrollTop(targetY, true);
                      } else {
                        // fallback to window.scrollTo
                        const duration = 500;
                        const startY = window.scrollY;
                        const diff = targetY - startY;
                        let start;
                        function step(timestamp) {
                          if (!start) start = timestamp;
                          const elapsed = timestamp - start;
                          const progress = Math.min(elapsed / duration, 1);
                          window.scrollTo(0, startY + diff * progress);
                          if (progress < 1) {
                            window.requestAnimationFrame(step);
                          }
                        }
                        window.requestAnimationFrame(step);
                      }
                    }, 200);
                } else {
                  handleDropBox(name);
                }
              }}
              style={
                activeGroupDropbox === name
                  ? {
                      backgroundColor: "#404566", ///////
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
                  className="w-auto bottom-19 left-1/2 transform -translate-x-1/2 p-2 fixed z-[100000] flex gap-2 border-2 rounded-xl justify-evenly items-center bg-clip-padding backdrop-blur-3xl border-solid border-[rgb(187,174,99)] 
                  max-sm:bottom-7 max-sm:border-1 max-sm:rounded-md max-sm:gap-1 max-sm:p-1 
                  max-md:bottom-9 max-md:border-1 max-md:rounded-lg max-md:gap-0 max-md:justify-between max-md:p-1 
                  max-lg:bottom-13 max-lg:rounded-lg max-lg:gap-0 max-lg:justify-between max-lg:p-1
                  max-xl:bottom-18 max-xl:p-2 max-xl:gap-0 max-xl:justify-between
                  max-2xl:bottom-17 max-2xl:p-2 max-2xl:gap-0 max-2xl:justify-between
                  "
                  style={{
                    "--lx": "50%",
                    "--ly": "50%",
                    "--lr": "120px",
                    backgroundImage:
                      "radial-gradient(var(--lr) var(--lr) at var(--lx) var(--ly), rgba(255,255,255,0.2), rgba(255,255,255,0) 55%)",
                    backgroundColor: "rgba(24,26,61,0.67)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                  }}
                >
                  {markersGroup[name]?.locations.map((path) => (
                    <button
                      onMouseEnter={(e) => rippleMouseMove(e, e.currentTarget)}
                      onMouseLeave={(e) => rippleMouseLeave(e, e.currentTarget)}
                      onClick={() => clickHandle(path)}
                      className="overflow-hidden uppercase text-shadow-lg text-white p-1 px-3 rounded-md transition-all duration-300 cursor-pointer relative text-center 
                      max-sm:px-1 max-sm:p-0.5 max-sm:rounded-xs max-sm:text-[6px]  
                      max-md:px-2 max-md:p-1 max-md:rounded-xs max-md:text-[9px]   
                      max-lg:px-2 max-lg:p-1 max-lg:rounded-sm max-lg:text-[12px]
                      max-2xl:px-2 max-2xl:p-1 max-2xl:rounded-sm max-2xl:text-[13px]
                      "
                      style={
                        activeMarker === path
                          ? {
                              backgroundColor: "rgba(255,208,117,0.4)",
                            }
                          : {}
                      }
                    >
                      {markers.find((marker) => marker.path === path)?.name}
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

export default Nav;
