// Experience.jsx
import { Canvas } from "@react-three/fiber";
import { Center, Loader, OrbitControls, OrthographicCamera } from "@react-three/drei";
import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { OneBHK } from "./OneBHK";
import { TwoBHK } from "./TwoBHK";
import { ThreeBHK } from "./ThreeBHK";
import { Studio } from "./Studio";
import { useGSAP } from "@gsap/react";
import Controls from "./Controls";
import { useControls } from "leva";
import FloorPlane from "./FloorPlane";
import ScreenEffect from "./ScreenEffect";
import Scene from "./Scene";
import * as THREE from "three";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";

gsap.registerPlugin(useGSAP);

const floors = [
  { name: "1bhk", Model: OneBHK },
  { name: "2bhk", Model: TwoBHK },
  { name: "3bhk", Model: ThreeBHK },
  { name: "Studio apartment", Model: Studio },
];

const FLOOR_LENGHT = floors.length;

const SEPERATION_DISTANCE = (2 * Math.PI) / FLOOR_LENGHT;

const RADIUS = 40; // circle radius

const Experience = () => {
  const modelsRef = useRef([]);
  const circleGroupRef = useRef();
  const containerRef = useRef(null);
  const buttonRefs = useRef({});
  const [selectedButton, setSelectedButton] = useState(null);
  const cameraRef = useRef();
  const pointerRef = useRef({ x: 0, y: 0 });
  const [current, setCurrent] = useState(0);
  const screenEffectRef = useRef();
  const [disableBtn, setDisableBtn] = useState(false);

  const { posX, posY, posZ } = useControls({
    posX: {
      value: -0.6,
      max: 50,
      min: -50,
      step: 0.1,
    },
    posY: {
      value: 31,
      max: 50,
      min: -50,
      step: 0.1,
    },
    posZ: {
      value:  -6.2,
      max: 50,
      min: -50,
      step: 0.1,
    },
  });

  // console.log(cameraRef?.current);

  const switchTo = (floor) => {
    if (floor === current) return;
    // console.log(screenEffectRef.current.uniforms.get("progress"));
    const totalFloors = FLOOR_LENGHT;
    const diff = (floor - current + totalFloors) % totalFloors;
    // shortest signed rotation (-half..+half)
    const shortest = diff > totalFloors / 2 ? diff - totalFloors : diff;

    const offset = shortest * SEPERATION_DISTANCE;

    if (!circleGroupRef.current || !screenEffectRef.current) return;

    setDisableBtn(true);

    screenEffectRef.current.playTransition({
      fadeInDur: 1,
      holdDur: 1,
      fadeOutDur: 1,
      onMidway: () => {
        // rotate circular group at peak dissolve
        gsap.to(circleGroupRef.current.rotation, {
          y: circleGroupRef.current.rotation.y + offset,
          duration: 2,
          ease: "power1.inOut",
          onComplete: () => setDisableBtn(false),
        });
        setCurrent(floor);
      },
    });
  };

  //ripple animation

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
  const handleContainerMouseMove = (event) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    target.style.setProperty("--x", `${mouseX}px`);
    target.style.setProperty("--y", `${mouseY}px`);
    target.style.setProperty("--b", `1`);
  };

  //side Nav animations
  const FLOOR_LENGTH = floors.length;
  const [targetIndex, setTargetIndex] = useState(null);
  const [direction, setDirection] = useState(null); // "next" | "prev"

  // refs for prev button
  const prevCurrentRef = useRef(null);
  const prevNextRef = useRef(null);

  // refs for next button
  const nextCurrentRef = useRef(null);
  const nextNextRef = useRef(null);

  const getNext = (i) => (i + 1) % FLOOR_LENGTH;
  const getPrev = (i) => (i - 1 + FLOOR_LENGTH) % FLOOR_LENGTH;

  // Run animation when targetIndex changes
  useGSAP(
    () => {
      if (targetIndex === null || !direction) return;

      const prevIncoming = floors[getPrev(targetIndex)].name;
      const nextIncoming = floors[getNext(targetIndex)].name;

      // --- Animate LEFT (Prev) ---
      if (prevCurrentRef.current && prevNextRef.current) {
        const currentEl = prevCurrentRef.current;
        const nextEl = prevNextRef.current;

        // set incoming text
        nextEl.textContent = prevIncoming;
        gsap.set(nextEl, { y: -40, opacity: 1, zIndex: 2 });

        gsap
          .timeline()
          .to(currentEl, { y: 40, duration: 0.4, ease: "power2.inOut" }, 0)
          .to(nextEl, { y: 0, duration: 0.4, ease: "power2.inOut" }, 0)
          .eventCallback("onComplete", () => {
            currentEl.textContent = prevIncoming;
            gsap.set(currentEl, { y: 0, opacity: 1, zIndex: 1 });
            gsap.set(nextEl, { opacity: 0 });

            // 🔄 sync right button text
            if (nextCurrentRef.current) {
              nextCurrentRef.current.textContent =
                floors[getNext(targetIndex)].name;
            }
          });
      }

      // --- Animate RIGHT (Next) ---
      if (nextCurrentRef.current && nextNextRef.current) {
        const currentEl = nextCurrentRef.current;
        const nextEl = nextNextRef.current;

        // set incoming text
        nextEl.textContent = nextIncoming;
        gsap.set(nextEl, { y: 40, opacity: 1, zIndex: 2 });

        gsap
          .timeline()
          .to(currentEl, { y: -40, duration: 0.4, ease: "power2.inOut" }, 0)
          .to(nextEl, { y: 0, duration: 0.4, ease: "power2.inOut" }, 0)
          .eventCallback("onComplete", () => {
            currentEl.textContent = nextIncoming;
            gsap.set(currentEl, { y: 0, opacity: 1, zIndex: 1 });
            gsap.set(nextEl, { opacity: 0 });

            // 🔄 sync left button text
            if (prevCurrentRef.current) {
              prevCurrentRef.current.textContent =
                floors[getPrev(targetIndex)].name;
            }
          });
      }
      // ✅ finally switch floor AFTER animation
      switchTo(targetIndex);
      setTargetIndex(null);
      setDirection(null);
    },
    { dependencies: [targetIndex, direction] }
  );

  const handleNext = () => {
    setDirection("next");
    setTargetIndex(getNext(current));
  };

  const handlePrev = () => {
    setDirection("prev");
    setTargetIndex(getPrev(current));
  };


  useEffect(() => {
    if (prevCurrentRef.current) {
      prevCurrentRef.current.textContent = floors[getPrev(current)].name;
    }
    if (nextCurrentRef.current) {
      nextCurrentRef.current.textContent = floors[getNext(current)].name;
    }
  }, []);

  return (
    <>
      <Canvas>
        <OrthographicCamera
          ref={cameraRef}
          makeDefault
          position={[posX, posY, posZ]}
          zoom={80}
          manual
        />
        <ScreenEffect ref={screenEffectRef} />
        {/* <Controls camera={cameraRef} pointerRef={pointerRef} /> */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1} />
        <FloorPlane
          width={400}
          height={400}
          segments={10}
          repeat={[40, 40]}
          position={[0, -2, 0]}
        />
        <Scene
          camera={cameraRef}
          pointerRef={pointerRef}
          circleGroupRef={circleGroupRef}
          floors={floors}
          RADIUS={RADIUS}
          modelsRef={modelsRef}
          FLOOR_LENGHT={FLOOR_LENGHT}
          current={current}
        />
      </Canvas>
      <Loader/>

      {/* Prev Button */}

      <button
        disabled={disableBtn}
        onClick={handlePrev}
        className=" cursor-pointer fixed left-8 top-1/2 -translate-y-1/2 text-xl h-14 min-w-50 w-fit overflow-hidden flex flex-col text-black"
        style={{
          fontFamily:"Zap"
        }}
      >
        <div className="relative h-full w-full overflow-hidden flex flex-col ">
          <span
            ref={prevCurrentRef}
            className="absolute uppercase w-full text-start text-nowrap"
          ></span>
          <span
            ref={prevNextRef}
            className="absolute uppercase w-full text-start text-nowrap"
          ></span>
        </div>
        <SlArrowLeft className="text-2xl" />
      </button>

      {/* Next Button */}

      <button
        disabled={disableBtn}
        onClick={handleNext}
        className=" cursor-pointer fixed right-8 top-1/2 -translate-y-1/2 text-xl h-14 min-w-50 w-fit overflow-hidden flex flex-col text-black"
        style={{
          fontFamily:"Zap"
        }}
      >
        <div className="relative h-full  w-full overflow-hidden flex flex-col">
          <span
            ref={nextCurrentRef}
            className="absolute uppercase w-full text-end text-nowrap"
          ></span>
          <span
            ref={nextNextRef}
            className="absolute uppercase w-full text-end text-nowrap"
          ></span>
        </div>
        <SlArrowRight className="text-2xl self-end"/>
      </button>

      

      {/* Main Navigation  */}
      <div
        ref={containerRef}
        onMouseMove={handleContainerMouseMove}
        onMouseLeave={handleContainerMouseLeave}
        className="drop-container overflow-hidden w-fit h-fit text-nowrap text-white bottom-2 left-1/2 transform -translate-x-1/2 p-1 absolute bg-clip-padding backdrop-blur-sm border-3 border-[#385270]
              rounded-4xl flex justify-center items-center gap-8 
              max-sm:gap-1 max-sm:bottom-1 max-sm:border-2 max-sm:p-0.5 
              max-md:gap-0 max-md:bottom-1 max-md:border-2 max-md:p-0.5 max-md:justify-between
              max-lg:gap-0 max-lg:bottom-2 max-lg:border-2 max-lg:p-1 max-lg:justify-between 
              max-xl:p-2 max-xl:gap-0 max-xl:justify-between"
        style={{
          "--x": "500%",
          "--y": "500%",
          "--r": "160px",
          backgroundImage:
            "radial-gradient(var(--r) var(--r) at var(--x) var(--y), rgba(255, 208, 117, 0.8), rgba(255,255,255,0) 40%)",

          // backgroundColor: "rgba(103,84,48,0.3)",
        }}
      >
        <a href="/">
        <button
        
          onMouseEnter={(e) => rippleMouseMove(e, e.currentTarget)}
          onMouseLeave={(e) => rippleMouseLeave(e, e.currentTarget)}
          onClick={(e) => {
            if (disableBtn) return;
            const container = containerRef.current;
            if (container) {
              const rect = container.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              // animateGradientFromPoint(x, y, btn.name);
            }
            // handleDirect(ind); // 🔑 instead of switchTo(ind)
          }}
          className={`dropbox-btn font-zap uppercase overflow-hidden text-shadow-lg p-1 px-3 rounded-2xl transition-all duration-300 cursor-pointer relative 
                  max-sm:px-1 max-sm:p-0.5 max-sm:text-[8px] 
                  max-md:px-2 max-md:p-1 max-md:text-[10px] 
                  max-lg:px-2 max-lg:p-1 max-lg:text-[12px]
                  max-xl:px-2 max-xl:p-1 max-xl:text-[12px]
                  max-2xl:px-2 max-2xl:p-1 max-2xl:text-[14px]  text-white`}
                  
                  style={{
          fontFamily:"Zap"
        }}
          // style={
          //   current === ind
          //     ? {
          //         backgroundColor: "#404566", ///////
          //       }
          //     : {}
          // }
        >
          Go Back
        </button>
        </a>
        {/* {floors.map((btn, ind) => {
          return (
            <div className="flex items-center">
              <button
                ref={(el) => {
                  if (el) buttonRefs.current[btn.name] = el;
                }}
                onMouseEnter={(e) => rippleMouseMove(e, e.currentTarget)}
                onMouseLeave={(e) => rippleMouseLeave(e, e.currentTarget)}
                onClick={(e) => {
                  if (disableBtn) return;
                  const container = containerRef.current;
                  if (container) {
                    const rect = container.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    animateGradientFromPoint(x, y, btn.name);
                  }
                  handleDirect(ind); // 🔑 instead of switchTo(ind)
                }}
                className={`dropbox-btn font-zap uppercase overflow-hidden text-shadow-lg p-1 px-3 rounded-2xl transition-all duration-300 cursor-pointer relative 
                  max-sm:px-1 max-sm:p-0.5 max-sm:text-[8px] 
                  max-md:px-2 max-md:p-1 max-md:text-[10px] 
                  max-lg:px-2 max-lg:p-1 max-lg:text-[12px]
                  max-xl:px-2 max-xl:p-1 max-xl:text-[12px]
                  max-2xl:px-2 max-2xl:p-1 max-2xl:text-[14px]  text-white`}
                style={
                  current === ind
                    ? {
                        backgroundColor: "#404566", ///////
                      }
                    : {}
                }
              >
                {btn.name.toUpperCase()}
              </button>
            </div>
          );
        })} */}
      </div>
    </>
  );
};

export default Experience;
