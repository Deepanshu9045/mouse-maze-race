// src/components/MazeGrid.jsx
import React from "react";
import Cell from "./Cell.jsx";

export default function MazeGrid({ grid, onCellClick }) {
  return (
    <div
      className="maze-container"
      style={{
        display: "grid",
        gridTemplateRows: `repeat(${grid.length}, 50px)`,
        gridTemplateColumns: `repeat(${grid[0].length}, 50px)`
      }}
    >
      {grid.map((row,rIdx) =>
        row.map((cell,cIdx) => (
          <Cell key={`${rIdx}-${cIdx}`} row={rIdx} col={cIdx} type={cell} onClick={onCellClick}/>
        ))
      )}
    </div>
  );
}   