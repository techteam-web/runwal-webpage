// function FloorsPanel({ current, onSelect }) {
//   const floors = [
//     { id: "120", label: "120th Floor" },
//     { id: "105", label: "105th Floor" },
//     { id: "89", label: "89th Floor" },
//     { id: "73", label: "73rd Floor" },
//   ];

//   return (
//     <div id="floorsPanel">
//       <h2 className="floors-heading">Floors</h2>
//       <ul className="floors-list">
//         {floors.map((floor) => (
//           <li
//             key={floor.id}
//             className={`floor-item ${current === floor.id ? "selected" : ""}`}
//             onClick={() => onSelect(floor.id)}
//           >
//             {floor.label}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default FloorsPanel;
import { useEffect } from "react";
import gsap from "gsap";
import "../App.css";

export default function FloorsPanel({ current, onSelect }) {
  const floors = [
    { id: "120", label: "120th Floor" },
    { id: "105", label: "105th Floor" },
    { id: "89", label: "89th Floor" },
    { id: "73", label: "73rd Floor" },
  ];

  useEffect(() => {
    const ruler = document.querySelector(".floors-ruler-main");
    const items = document.querySelectorAll(".floors-ruler-item");
    const progressBar = document.querySelector(".floors-progress");
    const hoverBar = document.querySelector(".floors-hover-bar");

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

      item.addEventListener("click", (e) => {
        e.preventDefault();
        onSelect(item.dataset.id);
        updateRuler(item);
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
    <div className="container">
      <div className="home-ruler-inner">
        <div className="floors-progress"></div>
        <div className="floors-hover-bar"></div>
       
        <div className="floors-ruler-main">
          {/* --- Spacer Start --- */}
          <div className="floors-ruler-item" style={{ flexBasis: "100%" }}>
            <div className="home-ruler-main-item-line">
              <div className="home-ruler-main-item-line-body"></div>
            </div>
          </div>

          {/* --- Floor Items --- */}
          {floors.map((floor) => (
            <div
              key={floor.id}
              className={`floors-ruler-item ${
                current === floor.id ? "active" : ""
              }`}
              data-id={floor.id}
              style={{ flexBasis: "150%" }}
            >
              <div className="home-ruler-main-item-line">
                <div className="home-ruler-main-item-line-head"></div>
                <div className="home-ruler-main-item-line-body"></div>
              </div>
              <a href="/" className="txt">
                {floor.label}
              </a>
            </div>
          ))}

          {/* --- Spacer End --- */}
          <div className="floors-ruler-item" style={{ flexBasis: "100%" }}>
            <div className="home-ruler-main-item-line">
              <div className="home-ruler-main-item-line-body"></div>
            </div>
          </div>
        </div>
        </div>
      </div>
    
  );
}
