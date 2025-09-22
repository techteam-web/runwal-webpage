

import React, { useState, useEffect } from "react";
import BuildingScroll from "./Component/BuildingScroll";

import Nav from "./Component/Nav";


function Home() {
  // State for navigation
  const [activeGroupeMarker, setActiveGroupeMarker] = useState("");
  const [activeGroupDropbox, setActiveGroupDropbox] = useState("");
  const [activeMarker, setActiveMarker] = useState("");
  const [showNav, setShowNav] = useState(false);
  const [showSingleImage, setShowSingleImage] = useState(false);

  // showNav will be set by BuildingScroll after autoscroll
   useEffect(() => {
    console.log("🏠 Home.jsx - showNav changed to:", showNav);
  }, [showNav]);

  // Debug the setShowNav function
  const debugSetShowNav = (value) => {
    console.log("🏠 Home.jsx - setShowNav called with:", value);
    setShowNav(value);
  };


  // Only top-level items, no sub-options
  const markersGroup = {
    Home: null,
   
    "Floor plans": null,
    View: null,
    Gallery: null,
    Map: null
  };

  const clickHandle = (path) => {
    setActiveMarker(path);
    console.log("Clicked on:", path);
    // Add your logic here
  };

  return (
    <div className="App">
      <BuildingScroll setShowNav={debugSetShowNav} showSingleImage={showSingleImage} setShowSingleImage={setShowSingleImage} />
      <Nav
        showNav={showNav}
        setActiveGroupeMarker={setActiveGroupeMarker}
        setActiveGroupDropbox={setActiveGroupDropbox}
        setActiveMarker={setActiveMarker}
        activeGroupDropbox={activeGroupDropbox}
        activeMarker={activeMarker}
        markersGroup={markersGroup}
        clickHandle={clickHandle}
        setShowSingleImage={setShowSingleImage}
      />
      
    </div>
  );
}

export default Home;
