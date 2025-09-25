import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const Navbar = ({ currentIndex, setCurrentIndex, navList }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hoverIndex, setHoverIndex] = useState(0);
  const lineRef = useRef();
  const navItemHolder = useRef();
  const containerRef = useRef(null);
  const buttonRefs = useRef({});

  // Calculate button width based on screen size
  const getButtonWidth = () => {
    if (window.innerWidth < 640) return 80; // sm
    if (window.innerWidth < 768) return 100; // md
    if (window.innerWidth < 1024) return 120; // lg
    return 140; // xl and above
  };

  const [buttonWidth, setButtonWidth] = useState(getButtonWidth());

  useEffect(() => {
    const handleResize = () => {
      setButtonWidth(getButtonWidth());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    window.location.href = "/home";
  };

  // Animation function from Dropbox component
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

  const handleMouseover = (e, ind) => {
    const x = (ind + 1) * buttonWidth; // +1 because Home is first
    lineRef.current.style.transform = `translate(${x}px, 0)`;
    lineRef.current.style.background = '#99a1af';
  };

  const handleMouseLeave = () => {
    const x = (currentIndex + 1) * buttonWidth; // +1 because Home is first
    lineRef.current.style.transform = `translate(${x}px, 0)`;
    lineRef.current.style.background = 'rgba(255, 208, 117, 0.8)';
  };

  const handleNavClick = (ind, e) => {
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      animateGradientFromPoint(x, y, `nav-${ind}`);
    }
    setCurrentIndex(ind);
  };

  useEffect(() => {
    const x = (currentIndex + 1) * buttonWidth; // +1 because Home is first
    if (lineRef.current) {
      lineRef.current.style.transform = `translate(${x}px, 0)`;
      lineRef.current.style.background = 'rgba(255, 208, 117, 0.8)';
    }
  }, [currentIndex, buttonWidth]);

  return (
    <>
      <div 
        ref={containerRef}
        onMouseMove={handleContainerMouseMove}
        onMouseLeave={handleContainerMouseLeave}
        className="fixed w-fit z-[1000] bottom-2 left-1/2 transform -translate-x-1/2 p-1 bg-clip-padding backdrop-blur-sm border-4 border-[#385270] rounded-4xl overflow-hidden
        max-sm:bottom-1 max-sm:border-2 max-sm:p-0.5 max-sm:rounded-2xl
        max-md:bottom-1 max-md:border-2 max-md:p-0.5 max-md:rounded-3xl
        max-lg:bottom-2 max-lg:border-2 max-lg:p-0.5 max-lg:rounded-3xl"
        style={{
          "--x": "500%",
          "--y": "500%",
          "--r": "160px",
          backgroundImage: "radial-gradient(var(--r) var(--r) at var(--x) var(--y), rgba(255, 208, 117, 0.8), rgba(255,255,255,0) 40%)",
          fontFamily: 'Gotham-Office, sans-serif'
        }}
      >
        {/* Indicator Line */}
        <div className="w-full flex items-center h-0.5 bg-white/20 mb-1">
          <div 
            className="h-1 transition-all duration-300 rounded-full" 
            ref={lineRef}
            style={{ width: `${buttonWidth}px` }}
          ></div>
        </div>

        {/* Navigation Buttons */}
        <div 
          ref={navItemHolder} 
          onMouseLeave={handleMouseLeave} 
          className="flex gap-2 text-white
          max-sm:gap-1
          max-md:gap-1.5
          max-lg:gap-2"
          style={{ fontFamily: 'Gotham-Office, sans-serif' }}
        >
          {/* Home Button */}
          <button
            ref={(el) => {
              if (el) buttonRefs.current['Home'] = el;
            }}
            onMouseEnter={(e) => {
              rippleMouseMove(e, e.currentTarget);
              // Handle home button hover for line
              lineRef.current.style.transform = `translate(0px, 0)`;
              lineRef.current.style.background = '#99a1af';
            }}
            onMouseLeave={(e) => rippleMouseLeave(e, e.currentTarget)}
            onClick={handleHomeClick}
            className="cursor-pointer overflow-hidden  uppercase text-shadow-lg rounded-2xl transition-all duration-300 relative flex items-center justify-center
            max-sm:rounded-lg max-sm:text-[7px]
            max-md:rounded-xl max-md:text-[8px]
            max-lg:rounded-xl max-lg:text-[10px]
            max-xl:text-xs
            max-2xl:text-sm"
            style={{ 
              width: `${buttonWidth}px`,
              padding: '8px 4px'
            }}
          >
            Home
          </button>

          {/* Navigation Items */}
          {Array.isArray(navList) && navList.length > 0 ? (
            navList.map((item, ind) => (
              <button
                key={ind}
                ref={(el) => {
                  if (el) buttonRefs.current[`nav-${ind}`] = el;
                }}
                onClick={(e) => handleNavClick(ind, e)}
                onMouseEnter={(e) => {
                  rippleMouseMove(e, e.currentTarget);
                  handleMouseover(e, ind);
                }}
                onMouseLeave={(e) => rippleMouseLeave(e, e.currentTarget)}
                className="cursor-pointer overflow-hidden font-zap uppercase text-shadow-lg rounded-2xl transition-all duration-300 relative flex items-center justify-center
                max-sm:rounded-lg max-sm:text-[7px]
                max-md:rounded-xl max-md:text-[8px]
                max-lg:rounded-xl max-lg:text-[10px]
                max-xl:text-xs
                max-2xl:text-sm"
                style={{ 
                  width: `${buttonWidth}px`,
                  padding: '8px 4px',
                  backgroundColor: currentIndex === ind ? '#404566' : 'transparent'
                }}
              >
                {item}
              </button>
            ))
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Navbar;
