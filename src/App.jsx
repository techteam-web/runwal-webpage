

import React, { useState } from "react";
import BuildingScroll from "./Component/BuildingScroll";
import "./App.css";
import Nav from "./Component/Nav";

function App() {
  // State for navigation
  const [activeGroupeMarker, setActiveGroupeMarker] = useState("");
  const [activeGroupDropbox, setActiveGroupDropbox] = useState("");
  const [activeMarker, setActiveMarker] = useState("");

  // Only top-level items, no sub-options
  const markersGroup = {
    Home: null,
    Features: null,
    "Floor plans": null,
    View: null,
    Gallery: null
  };

  const clickHandle = (path) => {
    setActiveMarker(path);
    console.log("Clicked on:", path);
    // Add your logic here
  };

  return (
    <div className="App">
      <BuildingScroll />
      <Nav
        setActiveGroupeMarker={setActiveGroupeMarker}
        setActiveGroupDropbox={setActiveGroupDropbox}
        setActiveMarker={setActiveMarker}
        activeGroupDropbox={activeGroupDropbox}
        activeMarker={activeMarker}
        markersGroup={markersGroup}
        clickHandle={clickHandle}
      />
    </div>
  );
}

export default App;
