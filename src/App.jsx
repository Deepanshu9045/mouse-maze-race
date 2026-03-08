import React, { useState, useEffect, useRef, useCallback } from 'react';
import MazeGrid from './components/MazeGrid.jsx';
import { astar } from './utils/astar.js';

// ── 16×16 maze (0=path, 1=wall) ─────────────────────────────────────────────
// Matches the image layout: row 0 = top, row 15 = bottom
// Entrance: [14, 0]  |  Default cheese: [1, 14]
const INITIAL_MAZE = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,1],
  [1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,1],
  [1,0,1,0,0,0,0,0,1,0,0,0,0,0,1,1],
  [1,0,1,0,1,1,1,1,1,0,1,1,1,0,1,1],
  [1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],
  [1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1],
  [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,1],
  [1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1],
  [1,0,1,0,0,0,0,0,0,0,0,0,0,0,1,1],
  [1,0,1,0,1,1,1,1,1,1,1,1,1,0,1,1],
  [1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1],
  [1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1],
  [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,1],
  [0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

const START_POS  = [14, 0];
const CHEESE_POS = [1, 14];
const STEP_MS    = 120;

export default function App() {
  const [mousePos,  setMousePos]  = useState(START_POS);
  const [cheesePos, setCheesePos] = useState(CHEESE_POS);
  const [trail,     setTrail]     = useState(new Set());
  const [steps,     setSteps]     = useState(0);
  const [elapsed,   setElapsed]   = useState(0);
  const [running,   setRunning]   = useState(false);
  const [won,       setWon]       = useState(false);
  const [noPath,    setNoPath]    = useState(false);

  const timersRef  = useRef([]);
  const tickRef    = useRef(null);
  const startTime  = useRef(null);

  // ── clock ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (running) {
      if (!startTime.current) startTime.current = Date.now() - elapsed * 100;
      tickRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime.current) / 100));
      }, 100);
    } else {
      clearInterval(tickRef.current);
    }
    return () => clearInterval(tickRef.current);
  }, [running]);

  // ── pathfind & animate mouse ───────────────────────────────────────────────
  const runPath = useCallback((from, to) => {
    // Clear previous animation
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setNoPath(false);
    setWon(false);

    const path = astar(INITIAL_MAZE, from, to);
    if (path.length === 0) {
      setNoPath(true);
      setRunning(false);
      return;
    }

    setRunning(true);
    setTrail(new Set());

    path.forEach(([r, c], idx) => {
      const t = setTimeout(() => {
        setMousePos([r, c]);
        setTrail(prev => {
          const next = new Set(prev);
          next.add(`${r},${c}`);
          return next;
        });
        setSteps(idx);

        if (idx === path.length - 1) {
          setRunning(false);
          if (r === to[0] && c === to[1]) setWon(true);
        }
      }, idx * STEP_MS);
      timersRef.current.push(t);
    });
  }, []);

  const handleCellClick = (r, c) => {
    if (INITIAL_MAZE[r][c] === 1) return;
    if (running) return;
    setCheesePos([r, c]);
  };

  // Trigger A* whenever cheese moves
  useEffect(() => {
    runPath(mousePos, cheesePos);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cheesePos]);

  const handleReset = () => {
    timersRef.current.forEach(clearTimeout);
    setMousePos(START_POS);
    setCheesePos(CHEESE_POS);
    setTrail(new Set());
    setSteps(0);
    setElapsed(0);
    setWon(false);
    setNoPath(false);
    setRunning(false);
    startTime.current = null;
    setTimeout(() => runPath(START_POS, CHEESE_POS), 50);
  };

  // Build display grid: 0=path 1=wall 2=cheese 3=mouse
  const displayGrid = INITIAL_MAZE.map((row, rIdx) =>
    row.map((cell, cIdx) => {
      if (mousePos[0]  === rIdx && mousePos[1]  === cIdx) return 3;
      if (cheesePos[0] === rIdx && cheesePos[1] === cIdx) return 2;
      return cell;
    })
  );

  const secs   = (elapsed / 10).toFixed(1);
  const cols   = INITIAL_MAZE[0].length;
  const gridPx = cols * 34;    // --cell = 34px

  return (
    <div className="app">
      {/* ── title ── */}
      <div className="title-block">
        <div className="title-pixel">MOUSE</div>
        <div className="title-pixel title-pixel--accent">MAZE</div>
        <div className="title-pixel">RACE</div>
      </div>

      {/* ── instructions ── */}
      <p className="instructions">
        CLICK ANY EMPTY CELL TO PLACE THE CHEESE 🧀
      </p>

      {/* ── stats bar ── */}
      <div className="stats-bar" style={{ width: gridPx }}>
        <span className="stat">
          <span className="stat__label">STEPS</span>
          <span className="stat__val">{steps}</span>
        </span>
        <span className="stat">
          <span className="stat__label">TIME</span>
          <span className="stat__val">{secs}s</span>
        </span>
        <button className="btn-reset" onClick={handleReset}>↺ RESET</button>
      </div>

      {/* ── maze ── */}
      <MazeGrid
        grid={displayGrid}
        trailSet={trail}
        onCellClick={handleCellClick}
      />

      {/* ── status message ── */}
      <div className="status-bar" style={{ width: gridPx }}>
        {won    && <span className="status status--win">🎉 CHEESE FOUND! IN {steps} STEPS</span>}
        {noPath && <span className="status status--err">⚠ NO PATH EXISTS!</span>}
        {running && <span className="status status--run">🐭 RUNNING…</span>}
        {!won && !noPath && !running && (
          <span className="status status--idle">PLACE CHEESE TO START</span>
        )}
      </div>
    </div>
  );
}
