import React from 'react';
import Cell from './Cell.jsx';

export default function MazeGrid({ grid, trailSet, onCellClick }) {
  return (
    <div className="maze-wrapper">
      <div
        className="maze-grid"
        style={{ gridTemplateColumns: `repeat(${grid[0].length}, var(--cell))` }}
      >
        {grid.map((row, rIdx) =>
          row.map((cellType, cIdx) => {
            const isTrail = trailSet?.has(`${rIdx},${cIdx}`) && cellType === 0;
            return (
              <Cell
                key={`${rIdx}-${cIdx}`}
                cellType={isTrail ? 4 : cellType}
                isPath={cellType === 0}
                onClick={() => onCellClick(rIdx, cIdx)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
