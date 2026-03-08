// src/App.jsx
import React, { useState, useEffect } from "react";
import MazeGrid from "./components/MazeGrid.jsx";
import { astar } from "./utils/astar.js";

export default function App() {
  const rows = 10;
  const cols = 15;

  // Maze: 0=path, 1=wall
  const initialMaze = [
    [0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],
    [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
    [0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
    [1,1,0,1,1,1,0,1,1,1,0,1,1,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,1,1,0,1,1,0,1,1,0,1,1,0,1,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  ];

  const [grid,setGrid] = useState(initialMaze);
  const [mousePos,setMousePos] = useState([0,0]);
  const [starPos,setStarPos] = useState([9,14]); // bottom-right default

  const handleCellClick = (r,c) => {
    if(grid[r][c]===1) return; // can't place star on wall
    setStarPos([r,c]);
  };

  useEffect(() => {
    if(!starPos) return;
    const path = astar(grid, mousePos, starPos);
    if(path.length===0) return;
    path.forEach((pos,idx) => {
      setTimeout(()=>setMousePos(pos), idx*300);
    });
  }, [starPos]);

  const displayGrid = grid.map((row,rIdx) =>
    row.map((cell,cIdx) => {
      if(mousePos[0]===rIdx && mousePos[1]===cIdx) return 3;
      if(starPos && starPos[0]===rIdx && starPos[1]===cIdx) return 2;
      return cell;
    })
  );

  return (
    <div>
      <h2>Mouse Maze Race</h2>
      <p>Click on any empty cell to place the cheese!</p>
      <MazeGrid grid={displayGrid} onCellClick={handleCellClick}/>
    </div>
  );
}