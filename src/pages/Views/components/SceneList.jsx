import React from "react";

function SceneList({ scenes = [], currentSceneId, onSelect }) {
  return (
    <div id="sceneList">
      <ul className="scenes">
        {scenes.map((scene) => (
          <li
            key={scene.data.id}
            className={`scene ${currentSceneId === scene.data.id ? "current" : ""}`}
            onClick={() => onSelect(scene)}
            style={{ cursor: "pointer" }}
          >
            {scene.data.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SceneList;
