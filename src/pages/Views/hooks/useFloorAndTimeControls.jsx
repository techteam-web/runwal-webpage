import { useEffect, useState } from "react";

export function useFloorAndTimeControls(scenes, switchScene) {
  const [currentFloor, setCurrentFloor] = useState("120");
  const [currentTime, setCurrentTime] = useState("m");

  const timeCodes = { btnDay: "m", btnNoon: "e", btnNight: "n" };

  const getSceneByFloorAndTime = (floor, timeCode) => {
    const sceneId = floor + timeCode;
    return scenes.find((s) => s.data.id.endsWith(sceneId)) || null;
  };

  useEffect(() => {
    const initialScene = getSceneByFloorAndTime(currentFloor, currentTime);
    if (initialScene) switchScene(initialScene);
  }, [scenes]); // run when scenes load

  const changeFloor = (floor) => {
    setCurrentFloor(floor);
    const scene = getSceneByFloorAndTime(floor, currentTime);
    if (scene) switchScene(scene);
  };

  const changeTime = (timeKey) => {
    const timeCode = timeCodes[timeKey];
    setCurrentTime(timeCode);
    const scene = getSceneByFloorAndTime(currentFloor, timeCode);
    if (scene) switchScene(scene);
  };

  return { currentFloor, currentTime, changeFloor, changeTime };
}
