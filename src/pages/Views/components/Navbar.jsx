import React, { useEffect, useRef, useState } from "react";



const Navbar = ({currentIndex, setCurrentIndex, navList}) => {
  const [position, setPosition] = useState({x:0, y: 0})
  const [hoverIndex, setHoverIndex] = useState(0)
  const lineRef = useRef();
  const navItemHolder = useRef()

  const handleMouseover = (e, ind) => {
    const x = ind * 175;
    lineRef.current.style.transform = `translate(${x}px, 0)`;
    lineRef.current.style.background = '#99a1af';
  };
  console.log(position)
  const handleMouseLeave = () => {
    const x = currentIndex * 175;
    lineRef.current.style.transform = `translate(${x}px, 0)`;
    lineRef.current.style.background = 'blue';
  };

  useEffect(() => {
    const x = currentIndex * 175;
    if (lineRef.current) {
      lineRef.current.style.transform = `translate(${x}px, 0)`;
      lineRef.current.style.background = 'blue';
    }
  }, [currentIndex]);

  return (
    <>
    <div className="fixed w-fit z-[1000] bottom-5 flex flex-col left-1/2 translate-x-[-50%] bg-white navbar important">
      <div className="w-full flex items-center h-0.5 bg-gray-300">
        <div className="w-[120px] h-1 transition-all bg-gray-400" ref={lineRef}></div>
      </div>
      <div ref={navItemHolder} onMouseLeave={handleMouseLeave} className="flex gap-5">
        {Array.isArray(navList) && navList.length > 0 ? (
          navList.map((item, ind) => (
            <button
              key={ind}
              onClick={() => setCurrentIndex(ind)}
              className="w-[120px] cursor-pointer"
              onMouseOver={(e) => handleMouseover(e, ind)}
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