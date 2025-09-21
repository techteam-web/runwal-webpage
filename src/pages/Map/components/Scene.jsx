import React, { Suspense, useEffect, useRef, useState } from "react";
import { CityMap } from "./CityMap";
import {
  Center,
  Cloud,
  Clouds,
  Detailed,
  Environment,
  Html,
  OrbitControls,
  Sky,
} from "@react-three/drei";
import { useControls } from "leva";
import * as THREE from "three";
import { createPortal } from "react-dom";
import Markers from "./Markers";
import Card from "./Card";
import Dropbox from "./Dropbox";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const markers = [
  {
    name: "Shri Walkeshware Temple",
    position: [-8.0, -2.5, 25.9],
    path: "walkeshwar",
    target: {
      x: -5.804366738238763,
      y: 0.3112511657786865,
      z: 11.814328503728905,
    },
    cameraPos: {
      x: 71.92909370767678,
      y: 28.153815548880385,
      z: 41.971827495130306,
    },
  },
  {
    name: "NCPA",
    position: [166.43, -2.5, 175.92],
    path: "NCPA",
    target: {
      x: 114.7311109367586,
      y: -8.746216647153648,
      z: 66.49601503104667,
    },
    cameraPos: {
      x: 216.25433629807765,
      y: 29.750678866663453,
      z: 268.6311814260983,
    },
  },
  {
    name: "DBS Internationl School",
    position: [90.56, -2.5, -55.38],
    path: "DBS",
    target: {
      x: 44.90946852833069,
      y: 13.982495323798647,
      z: -24.480184149395814,
    },
    cameraPos: {
      x: 127.60792036973687,
      y: 24.734151633946798,
      z: 58.700756798119514,
    },
  },
  {
    name: "Wilson College",
    position: [113.84, -2.5, -51.68],
    path: "wilson",
    target: {
      x: 53.8222084425179,
      y: 14.067092770346328,
      z: -33.35215428707034,
    },
    cameraPos: {
      x: 115.53381793499497,
      y: 51.270894937848226,
      z: 83.61356049755025,
    },
  },
  {
    name: "Malabar Hill Club",
    position: [60.37, -2.5, -38.99],
    path: "malabarClub",
    target: { x: 34.889922812691395, y: 6.456655, z: -13.27649106924921 },
    cameraPos: {
      x: 99.54527997837714,
      y: 37.46870905242987,
      z: 55.31314550044616,
    },
  },
  {
    name: "Cricket Club Of India",
    position: [203.8, -2.5, 134.94],
    path: "cricketClub",
    target: {
      x: 144.08077236417503,
      y: 22.339800104956346,
      z: 3.0292573341277897,
    },
    cameraPos: {
      x: 28.50557073857496,
      y: 82.86386598888551,
      z: 269.3191689416766,
    },
  },
  {
    name: "National Gallery of Modern Art",
    position: [257.87, -2.5, 177.32],
    path: "NationalGallery",
    target: {
      x: 97.26495084951065,
      y: 0.5684273144058747,
      z: 75.97581197106443,
    },
    cameraPos: {
      x: 373.73778624309386,
      y: 32.97414983097554,
      z: 250.52944882587627,
    },
  },
  {
    name: "Iskon Temple",
    position: [109.01, -2.5, -64.77],
    path: "iskonTemple",
    target: { x: 98.1032735247716, y: 21.19441404471601, z: 21.89760971967212 },
    cameraPos: {
      x: 134.74724363312865,
      y: 34.42245231300231,
      z: 80.68336440496992,
    },
  },
  {
    name: "InterContinental Dome",
    position: [198.4, -2.5, 116.34],
    path: "interContinental",
    target: {
      x: 140.85052551082254,
      y: 2.6276790479898042,
      z: 63.324744612080835,
    },
    cameraPos: {
      x: 298.0051281344864,
      y: 31.142613503554813,
      z: 76.14065162130015,
    },
  },
  {
    name: "Wasabi by Morimoto",
    position: [268.26, -2.5, 200.11],
    path: "wasabi",
    target: {
      x: 163.71882314621786,
      y: -18.724728248222497,
      z: 129.0739700335071,
    },
    cameraPos: {
      x: 340.950839120605,
      y: 29.391835608936518,
      z: 246.49658019921264,
    },
  },
  {
    name: "Trident",
    position: [181.21, -2.5, 158.72],
    path: "trident",
    target: {
      x: 24.39307700204652,
      y: -35.081799946166555,
      z: 10.07939428937079,
    },
    cameraPos: {
      x: 276.46891658195113,
      y: 35.14519768349439,
      z: 236.23231573885522,
    },
  },
  {
    name: "The Taj Mahal Palace",
    position: [265.67, -2.5, 204.79],
    path: "taj",
    target: {
      x: 167.13314108187885,
      y: -18.724812885347237,
      z: 125.26577133486998,
    },
    cameraPos: {
      x: 317.4985937059603,
      y: 21.351118457393557,
      z: 261.889162667852,
    },
  },
  {
    name: "Wankhede Stadium",
    position: [219.28, -2.5, 90.26],
    path: "wankhede",
    target: {
      x: 92.3586821497818,
      y: -17.332252247737383,
      z: 25.161917835594718,
    },
    cameraPos: {
      x: 314.25892012746147,
      y: 52.40638493045567,
      z: 157.51463950302855,
    },
  },
  {
    name: "Mahalaxmi Race Course",
    position: [143.73, -2.5, -258.88],
    path: "mahalaxmi",
    target: {
      x: 68.27100961399842,
      y: -43.91218920626857,
      z: -96.61971459793295,
    },
    cameraPos: {
      x: 174.88219824288018,
      y: 32.196814923408986,
      z: -329.9904711470889,
    },
  },
];

const markersGroup = {
  "Educational Institutes": {
    locations: ["DBS", "wilson"],
    view: {
      target: {
        x: -0.771410966631206,
        y: -0.697870744623131,
        z: -0.8321879516325202,
      },
      cameraPos: {
        x: -48.820866338871696,
        y: 19.15823914370656,
        z: 25.585989235394926,
      },
    },
  },
  Clubs: {
    locations: ["malabarClub", "cricketClub"],
    view: {
      target: {
        x: 2.4565490499659672,
        y: 0.7038892845105722,
        z: -0.04638015247482202,
      },
      cameraPos: {
        x: -53.93739239954934,
        y: 21.79160561359628,
        z: -12.020560840963512,
      },
    },
  },
  "Art & Culture": {
    locations: ["NationalGallery", "NCPA"],
    view: {
      target: {
        x: 31.766633135874176,
        y: 2.374965595764277,
        z: 14.126863380792805,
      },
      cameraPos: {
        x: -52.50968332040655,
        y: 23.08737194954687,
        z: -30.0935080307175,
      },
    },
  },
  Temple: {
    locations: ["iskonTemple", "walkeshwar"],
    view: {
      target: {
        x: -2.8575167175381745e-20,
        y: -5.8475144331123895e-21,
        z: 6.61994411689674e-20,
      },
      cameraPos: {
        x: -54.61835815207522,
        y: 39.66683599563231,
        z: 41.679834290515224,
      },
    },
  },
  Restaurants: {
    locations: ["wasabi", "interContinental"],
    view: {
      target: {
        x: 11.99031704565556,
        y: 7.186868147229018,
        z: 6.683047560025147,
      },
      cameraPos: {
        x: -50.563980968530245,
        y: 25.417890931957928,
        z: -12.839608850548029,
      },
    },
  },
  "Luxury Hotels": {
    locations: ["taj", "trident"],
    view: {
      target: {
        x: 5.734879406876533,
        y: 7.711481645500406,
        z: -7.222289789503007,
      },
      cameraPos: {
        x: -47.365264907823764,
        y: 18.28455417398065,
        z: -28.890703631245913,
      },
    },
  },
  Entertainment: {
    locations: ["wankhede", "mahalaxmi"],
    view: {
      target: {
        x: 17.35008423403045,
        y: 20.21946794650026,
        z: 2.9093503056511008,
      },
      cameraPos: {
        x: -105.51699348334215,
        y: 57.54299623666773,
        z: 57.35242112709487,
      },
    },
  },
};

const Scene = ({ ready }) => {
  const [activeMarker, setActiveMarker] = useState("");
  const [activeGroupeMarker, setActiveGroupeMarker] = useState("");
  const [activeGroupDropbox, setActiveGroupDropbox] = useState("");
  const [cameraReady, setCameraReady] = useState(false);
  const componentUiRef = useRef([]);
  const cardRef = useRef();
  const controlsRef = useRef();
  const mouse = useRef({ x: 0, y: 0 });

  const { camera } = useThree();
  gsap.registerPlugin(useGSAP);

  const clickHandle = (key) => {
    if (activeMarker === key) {
      setActiveMarker("");
    } else {
      setActiveMarker(key);
    }
    setActiveGroupeMarker("");
  };

  useEffect(() => {
    let isDragging = false;

    const handleMouseDown = () => {
      isDragging = false;
    };

    const handleMouseMove = () => {
      isDragging = true;
    };

    const handleMouseUp = (e) => {
      if (!isDragging) {
        if (
          cardRef.current?.contains(e.target) ||
          e.target.closest(".marker-class")
        )
          return;
        setActiveMarker("");
      }
    };

    document.body.addEventListener("mousedown", handleMouseDown);
    document.body.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.body.removeEventListener("mousedown", handleMouseDown);
      document.body.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Track mouse move
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1; // -1 to 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    // if (controlsRef.current) {
    //    const {x, y, z} = lookAtTarget
    //    // Set orbit center to [5, 0, 0]
    //    controlsRef.current.target.set(x, y, z);
    //    // Must call update() after changing target
    //    controlsRef.current.update();
    // console.log(controlsRef.current.target, camera.position);
    // }
  });

  const moveTo = ({ target, cameraPos }) => {
    gsap.to(controlsRef.current.target, {
      x: target.x,
      y: target.y,
      z: target.z,
      duration: 3,
      ease: "power1.inOut",
    });
    gsap.to(camera.position, {
      x: cameraPos.x,
      y: cameraPos.y,
      z: cameraPos.z,
      duration: 3,
      ease: "power1.inOut",
      onComplete: () => {
        controlsRef.current.minPolarAngle = Math.PI / 2.5; // ~72°
        controlsRef.current.maxPolarAngle = Math.PI / 2.1;
        controlsRef.current.minDistance = 150;
        controlsRef.current.maxDistance = 300;
        controlsRef.current.autoRotate = true;
        // controlsRef.current.enableRotate   = false
        controlsRef.current.enablePan = false;
        setCameraReady(true);
        // componentUiRef.current.forEach((ref) => {
        //   console.log(ref)
        //   gsap.to(ref, {
        //     opacity: 1,
        //     duration: 1
        //   });
        // });
        gsap.to(componentUiRef.current, {
          opacity: 1,
          duration: 1,
          stagger: 0.2, // staggered animation
        ease: "back.out(1.7)",
        })
      },
    });
  };

  const resetCamera = () => {
    moveTo({
      target: { x: 0, y: 0, z: 0 },
      cameraPos: {
        x: -91.44960291271023,
        y: 12.23486634998749,
        z: 133.9820791245469,
      },
    });
  };

  useGSAP(() => {
    if (activeMarker === "") {
      if (activeGroupeMarker !== "") {
        moveTo(markersGroup[activeGroupeMarker].view);
        return;
      }
      resetCamera();
      return;
    }
    const currentMarker = markers.find(
      (marker) => marker.path === activeMarker
    );
    // setLookAtTarget({x: position[0], y: position[1], z: position[2]})
    moveTo(currentMarker);
  }, [activeMarker, activeGroupeMarker]);

  useGSAP(() => {
    // componentUiRef.current.forEach(ref => {
    //   gsap.set(ref, {
    //     opacity: 0
    //   })
    // })
  });

  return (
    <>
      <color args={["#89CFF1"]} attach="background" />
      {/* clouds logic */}
      {!cameraReady && (
        <Clouds
          material={THREE.MeshBasicMaterial}
          limit={400} // max number of cloud billboards
          range={600} // how far clouds can be seen
          position={[-56.08, 84.11, 252.34]} // lift the whole cloud layer high above city
        >
          <Cloud
            seed={42}
            opacity={0.7} // quite solid
            width={300} // very wide
            depth={80} // very thick
            segments={46} // smoother edges for a massive cloud
            volume={80}
            color="white"
            concentration={0.95} // dense in center
            growth={20} // very fluffy, towering look
            bounds={[70, 0, 70]} // keeps it centralized
            position={[-95.86, 112.6, -293.25]}
            rotation={[0.25, 2.09, 0.0]}
          />
          <Cloud
            seed={99}
            opacity={0.7} // quite solid
            width={300} // very wide
            depth={80} // very thick
            segments={46} // smoother edges for a massive cloud
            volume={80}
            color="white"
            concentration={0.95} // dense in center
            growth={20} // very fluffy, towering look
            bounds={[70, 0, 70]} // keeps it centralized
            position={[-38.48, 67.82, -167.37]}
            rotation={[0, 0, 0]}
          />
          <Cloud
            seed={99}
            opacity={0.7} // quite solid
            width={300} // very wide
            depth={80} // very thick
            segments={46} // smoother edges for a massive cloud
            volume={80}
            color="white"
            concentration={0.95} // dense in center
            growth={20} // very fluffy, towering look
            bounds={[70, 0, 70]} // keeps it centralized
            position={[-174.77, 146.73, -176.07]}
            rotation={[0, 5.37, 0]}
          />
        </Clouds>
      )}

      <directionalLight
        intensity={1}
        position={[200, 500, 200]}
      />

      <OrbitControls
        // autoRotate
        // autoRotateSpeed={0}
        autoRotateSpeed={activeMarker !== "" ? 0 : 0.5}
        makeDefault
        ref={controlsRef}
        enableDamping={true}
        dampingFactor={0.01}
        // minPolarAngle={Math.PI / 2.5} // ~72°
        // maxPolarAngle={Math.PI / 2.1}
        // minDistance={150} // how close you can zoom in
        // maxDistance={230} // how far you can zoom out (set to city scale)
        rotateSpeed={0.5} // slower rotation feels smoother
        zoomSpeed={1}
        panSpeed={0.8}
      />

      {/* ui logic */}
      {
        <>
          <Center>
            <Html
              ref={(el)=> componentUiRef.current[0] = el}
              className="pointer-events-none opacity-0"
              center
              position={[0, 7.48, 0]}
              distanceFactor={50}
            >
              <svg
                id="Layer_2"
                data-name="Layer 2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 187.23 85.37"
                width={300}
                height={300}
                className="overflow-visible max-sm:scale-60
           max-md:scale-70
           max-lg:scale-80"
              >
                <defs>
                  <style>
                    {".cls-1{fill:#aa894b}.cls-4{letter-spacing:.07em}"}
                  </style>
                </defs>
                <g id="Layer_1-2" data-name="Layer 1">
                  <text className="font-sign"
                    transform="translate(.55 60.1)"
                    style={{
                      fill: "#414042",
                      // fontFamily:
                      //   "BrittanySignatureRegular,'Brittany Signature'",
                      fontSize: "27.68px",
                      stroke: "#414042",
                      strokeMiterlimit: 10,
                      strokeWidth: "1.09px",
                    }}
                  >
                    <tspan className="cls-4" x={0} y={0}>
                      {"Mal"}
                    </tspan>
                    <tspan
                      x={55.81}
                      y={0}
                      style={{
                        letterSpacing: ".08em",
                      }}
                    >
                      {"ab"}
                    </tspan>
                    <tspan className="cls-4" x={81} y={0}>
                      {"ar"}
                    </tspan>
                  </text>
                  <path
                    className="cls-1"
                    d="M3.31 24.28V3.37q0-.98-1.23-3.25h12.37c6.74 0 10.47 3.33 10.47 7.56 0 3.49-2.42 6.11-6.74 7.05l7.29 8.85q1.82 2.23 3.64 3.96h-7.88l-9.75-12.41H9.49v9.01q0 1.02 1.7 3.41H2.08q1.23-2.31 1.23-3.25Zm9.62-11.91c3.81 0 5.59-1.84 5.59-4.58s-1.78-4.58-5.59-4.58H9.5v9.16h3.43ZM31.62 17.07V3.37q0-.98-1.23-3.25h8.86q-1.44 2.31-1.44 3.29v14.02c0 4.15 2.71 6.85 7.2 6.85s6.91-2.74 6.91-6.85V3.41q0-.98-1.53-3.29h6.95q-1.19 2.31-1.19 3.29v13.55c0 7.21-4.45 11.16-12.16 11.16s-12.37-3.8-12.37-11.04ZM63.44 24.28V1.33L62.25.12h7.33l15.04 17.5V3.41q0-.98-1.57-3.29h6.86q-1.19 2.31-1.19 3.25v24.44h-2.97L67.53 7.21v17.03q0 .98 1.7 3.29H62.2q1.23-2.31 1.23-3.25ZM93.15.12h9.41q-1.57 2.35-1.02 3.99l5.13 15.16L114.21.04h3.52l7.5 19.19 5.13-15.12q.59-1.68-.89-3.99h7.12q-1.31 2.27-2.2 4.66l-8.56 23.03h-3.01l-7.93-19.58-8.05 19.54-3.05.04-8.69-23.5Q94.34 2.2 93.15.12ZM136.97 22.95 147.31 0h4.2l10.43 23.18q1.02 2.23 2.25 4.35h-9.54q1.36-2.43.72-3.99l-1.36-3.25h-11.57L141 23.7q-.64 1.57.76 3.84h-7.16q1.31-2.31 2.37-4.58ZM152.7 17l-4.41-10.69L143.8 17h8.9ZM167.27 27.53q1.23-2.31 1.23-3.25V3.37q0-.98-1.23-3.25h8.65q-1.23 2.31-1.23 3.25v20.68h5.47c1.86 0 3.01 0 7.08-3.02l-.68 6.5h-19.28Z"
                  />
                </g>
              </svg>
            </Html>
          </Center>
          {markers.map(({ position, path, name }, index) => (
            <Markers
              key={index}
              index = {index}
              position={position}
              path={path}
              clickHandle={clickHandle}
              name={name}
              ref = {componentUiRef}
            />
          ))}
          {/* {ready && ( */}
          <Html>
            {createPortal(
              <>
                <div
                  ref={(el) => (componentUiRef.current[1] = el)}
                  className="relative opacity-0"
                >
                  <Dropbox
                    setActiveGroupeMarker={setActiveGroupeMarker}
                    setActiveGroupDropbox={setActiveGroupDropbox}
                    setActiveMarker={setActiveMarker}
                    activeGroupDropbox={activeGroupDropbox}
                    activeMarker={activeMarker}
                    markersGroup={markersGroup}
                    markers={markers}
                    clickHandle={clickHandle}
                  />
                </div>
                <Card ref={cardRef} activeMarker={activeMarker} />
              </>,
              document.body
            )}
          </Html>
        </>
      }

      <Center>
        <Detailed distances={[50, 150, 500]}>
          <CityMap
            markersGroup={markersGroup}
            activeGroupeMarker={activeGroupeMarker}
            activeMarker={activeMarker}
            meshBasicMaterial={THREE.MeshBasicMaterial}
            position={[0, 0, 0]}
          />
        </Detailed>
      </Center>
      <Environment files="/sunrise.exr" environmentIntensity={0.5} />
    </>
  );
};

export default Scene;
