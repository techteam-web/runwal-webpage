function TimeButtons({ current, onSelect }) {
  const times = [
    { id: "btnDay", key: "btnDay", label: "Day", icon: "img/day.png" },
    { id: "btnNoon", key: "btnNoon", label: "Noon", icon: "img/noon.png" },
    { id: "btnNight", key: "btnNight", label: "Night", icon: "img/night.png" },
  ];

 // In TimeButtons.jsx, wrap the return with positioning:
return (
  <div className="fixed bottom-2 left-[5%] z-[99998] " style={{ transform: 'translateY(-50vh)' }}>
    <div className="time-buttons flex flex-col">
      {times.map(time => (
        <button 
          key={time.id}
          className={`time-button ${current === time.key ? 'selected' : ''}`}
          aria-label={time.label}
          onClick={() => onSelect(time.key)}
        >
          <img className="icon" src={time.icon} alt={time.label} />
        </button>
      ))}
    </div>
  </div>
);

}

export default TimeButtons;
