import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap"; // Keep this only for existing button effects
import { useNavigate, useLocation } from "react-router-dom";
import useClickSound from "./useClickSound";

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
  // React Router hooks
  const navigate = useNavigate();
  const location = useLocation();
  
  // Click sound for navbar buttons
  const { playClickSound, playClickSoundSync, ClickAudio } = useClickSound();
  
  // Animation state - simplified for CSS
  const [shouldShow, setShouldShow] = useState(false);
  const [delayedShow, setDelayedShow] = useState(false);

  const handleMarkerGroupClick = (name) => {
    setActiveMarker("");
    setActiveGroupeMarker(name);
  };

  const handleDropBox = (name) => {
    // Don't play sound here - it's already played in onClick
    if (activeGroupDropbox === name) {
      setActiveGroupDropbox("");
    } else {
      setActiveGroupDropbox(name);
      handleMarkerGroupClick(name);
    }
  };

  // Height sync (keep existing)
  useEffect(() => {
    const syncNavbarHeights = () => {
      const allNavbars = document.querySelectorAll('.drop-container');
      if (allNavbars.length > 1) {
        let maxHeight = 0;
        allNavbars.forEach(navbar => {
          const height = navbar.offsetHeight;
          if (height > maxHeight) {
            maxHeight = height;
          }
        });
        allNavbars.forEach(navbar => {
          navbar.style.minHeight = `${maxHeight}px`;
        });
      }
    };

    const timer = setTimeout(syncNavbarHeights, 100);
    window.addEventListener('resize', syncNavbarHeights);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', syncNavbarHeights);
    };
  }, []);

  const containerRef = useRef(null);
  const buttonRefs = useRef({});
  const [selectedButton, setSelectedButton] = useState(null);

  // 👈 SIMPLE: Show with delay, then add animation class
  useEffect(() => {
    if (showNav) {
      // Show the element first
      setShouldShow(true);
      
      // Then trigger the animation after a delay
      setTimeout(() => {
        setDelayedShow(true);
      }, 500); // 500ms delay
    } else {
      setDelayedShow(false);
      // Hide after animation completes
      setTimeout(() => {
        setShouldShow(false);
      }, 300); // Quick hide
    }
  }, [showNav]);

  // Keep existing functions for button effects
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

  const handleContainerMouseMove = (event) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    target.style.setProperty("--x", `${mouseX}px`);
    target.style.setProperty("--y", `${mouseY}px`);
    target.style.setProperty("--b", `1`);
  };

  // Keep existing ripple effects
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

  const handleContainerMouseLeave = (event) => {
    const target = event.currentTarget;
    target.style.setProperty("--x", `500%`);
    target.style.setProperty("--y", `500%`);
  };

  // Keep existing location effects (simplified)
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

  // Keep existing marker logic
  useEffect(() => {
    if (activeMarker === "" && activeGroupDropbox !== "") {
      setActiveGroupeMarker(activeGroupDropbox);
    } else {
      setActiveGroupeMarker("");
    }
  }, [activeGroupDropbox, activeMarker, setActiveGroupeMarker]);

  // ✅ UPDATED: Keep existing button active logic + add ISO
  const isButtonActive = (name) => {
    if (name === "Home" && location.pathname === "/") return true;
    if (name === "View" && location.pathname === "/views") return true;
    if (name === "Floor plans" && location.pathname === "/inventory") return true;
    if (name === "Map" && location.pathname === "/map") return true;
    if (name === "ISO" && location.pathname === "/iso") return true; // ✅ ADD THIS
    return activeGroupDropbox === name;
  };

  return (
    <>
      <ClickAudio />
      {/* Desktop Menu with Simple Tailwind Animation */}
      <div
        ref={containerRef}
        onMouseMove={handleContainerMouseMove}
        onMouseLeave={handleContainerMouseLeave}
        className={`drop-container overflow-hidden w-fit h-fit text-nowrap text-white bottom-2 left-1/2 transform -translate-x-1/2 p-2 z-[99999] fixed bg-clip-padding backdrop-blur-sm border-4 border-[#385270]
       rounded-4xl flex flex-1/5 justify-center items-center gap-3
       max-sm:gap-1 max-sm:bottom-5 max-sm:border-2 max-sm:p-0.5 
       max-md:gap-0 max-md:bottom-3 max-md:border-2 max-md:p-0.5 max-md:justify-between
       max-lg:gap-0 max-lg:bottom-2 max-lg:border-2 max-lg:p-0.5 max-lg:justify-between 
       max-xl:p-2 max-xl:gap-0 max-xl:justify-between
       transition-all duration-700 ease-out
       max-sm:top-auto max-md:top-auto 
       ${delayedShow 
         ? 'translate-y-0 opacity-100 scale-100' 
         : 'translate-y-24 opacity-0 scale-90'
       }`}
        style={{
          "--x": "500%",
          "--y": "500%",
          "--r": "160px",
          backgroundImage: "radial-gradient(var(--r) var(--r) at var(--x) var(--y), rgba(255, 208, 117, 0.8), rgba(255,255,255,0) 40%)",
          display: shouldShow ? 'flex' : 'none',
        }}
      >
        {Object.keys(markersGroup).map((name) => (
          <div key={name} className="flex items-center " style={{ fontFamily: 'Zap, sans-serif' }}>
            <button
              ref={(el) => {
                if (el) buttonRefs.current[name] = el;
              }}
              
              onMouseEnter={(e) => rippleMouseMove(e, e.currentTarget)}
              onMouseLeave={(e) => rippleMouseLeave(e, e.currentTarget)}
              className="dropbox-btn uppercase overflow-hidden text-shadow-lg p-1 px-3 rounded-2xl transition-all duration-300 cursor-pointer relative 
              max-sm:px-1 max-sm:p-0.5 max-sm:text-[8px] 
              max-md:px-2 max-md:p-1 max-md:text-[10px] 
              max-lg:px-2 max-lg:p-1 max-lg:text-[12px]
              max-xl:px-2 max-xl:p-1 max-xl:text-[12px]
              max-2xl:px-2 max-2xl:p-1 max-2xl:text-[14px]
              "
              onClick={(e) => {
                console.log('🖱️ Button clicked:', name); // Debug log
                
                // 👈 PLAY SOUND ONCE, FIRST
                playClickSound();
               
                // Animation
                const container = containerRef.current;
                if (container) {
                  const rect = container.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  animateGradientFromPoint(x, y, name);
                }

                // Handle routing with delayed navigation (no multiple sound calls)
                if (name === "Gallery") {
                  setTimeout(() => {
                    setShowSingleImage(true);
                    navigate("/");
                  }, 400);
                  
                } else if (name === "Home") {
                  setTimeout(() => {
                    if (typeof setShowSingleImage === 'function') setShowSingleImage(false);
                    navigate("/");
                    window.__homeButtonClicked = true;
                    
                    setTimeout(() => {
                      const targetY = window.autoScrollStopYRef && window.autoScrollStopYRef.current != null ? window.autoScrollStopYRef.current : 1000;
                      const smoother = window.ScrollSmoother ? window.ScrollSmoother.get && window.ScrollSmoother.get() : null;
                      if (smoother && typeof smoother.scrollTo === 'function') {
                        smoother.scrollTo(targetY, true);
                      }
                      const duration = 1400;
                      const startY = window.scrollY;
                      const diff = targetY - startY;
                      let start;
                      function easeInOutQuad(t) {
                        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
                      }
                      function step(timestamp) {
                        if (!start) start = timestamp;
                        const elapsed = timestamp - start;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = easeInOutQuad(progress);
                        window.scrollTo(0, startY + diff * eased);
                        if (progress < 1) {
                          window.requestAnimationFrame(step);
                        }
                      }
                      window.requestAnimationFrame(step);
                    }, 400);
                  }, 400);
                  
                } else if (name === "View") {
                  setTimeout(() => {
                    navigate("/views");
                    if (typeof setShowSingleImage === 'function') setShowSingleImage(false);
                  }, 400);
                  
                } else if (name === "Floor plans") {
                  setTimeout(() => {
                    navigate("/inventory");
                    if (typeof setShowSingleImage === 'function') setShowSingleImage(false);
                  }, 400);
                  
                } else if (name === "Map") {
                  setTimeout(() => {
                    navigate("/map");
                    if (typeof setShowSingleImage === 'function') setShowSingleImage(false);
                  }, 400);
                  
                } else if (name === "Iso") {
                  // ✅ ADD THIS: Handle ISO button click
                  setTimeout(() => {
                    navigate("/iso");
                    if (typeof setShowSingleImage === 'function') setShowSingleImage(false);
                  }, 400);
                  
                } else {
                  // For dropdown buttons - no navigation delay needed
                  handleDropBox(name);
                }
              }}
              style={
                isButtonActive(name)
                  ? {
                      backgroundColor: "#404566",
                    }
                  : {}
              }
            >
              {name}
            </button>

            {/* Dropdown locations */}
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
                  {markersGroup[name]?.locations?.map((path) => (
                    <button
                      key={path}
                      onMouseEnter={(e) => rippleMouseMove(e, e.currentTarget)}
                      onMouseLeave={(e) => rippleMouseLeave(e, e.currentTarget)}
                      onClick={() => {
                        playClickSoundSync();
                        clickHandle(path);
                      }}
                      className="overflow-hidden uppercase text-shadow-lg text-white p-1 px-3 rounded-md transition-all duration-300 cursor-pointer relative text-center 
                      max-sm:px-1 max-sm:p-0.5 max-sm:rounded-xs  
                      max-md:px-2 max-md:p-1 max-md:rounded-xs max-sm:text-[9px]   
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

export default Nav;
