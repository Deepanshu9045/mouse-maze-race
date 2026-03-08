/**
 * A* pathfinding on a 2D grid.
 * grid: 2D array where 1 = wall, 0 = open
 * start / end: [row, col]
 * Returns ordered array of [row,col] positions from start→end (inclusive),
 * or [] if no path exists.
 */
export function astar(grid, start, end) {
  const rows = grid.length;
  const cols = grid[0].length;

  const key   = (r, c) => `${r},${c}`;
  const h     = (r, c) => Math.abs(r - end[0]) + Math.abs(c - end[1]);

  const openSet  = new Map();          // key → node
  const cameFrom = {};
  const gScore   = {};
  const fScore   = {};

  const startKey = key(start[0], start[1]);
  gScore[startKey] = 0;
  fScore[startKey] = h(start[0], start[1]);
  openSet.set(startKey, start);

  while (openSet.size > 0) {
    // Pick lowest fScore
    let currentKey = null;
    let currentF   = Infinity;
    for (const [k] of openSet) {
      const f = fScore[k] ?? Infinity;
      if (f < currentF) { currentF = f; currentKey = k; }
    }

    const current = openSet.get(currentKey);
    openSet.delete(currentKey);

    const [cr, cc] = current;

    if (cr === end[0] && cc === end[1]) {
      // Reconstruct
      const path = [];
      let k = currentKey;
      while (k) {
        const [r, c] = k.split(',').map(Number);
        path.unshift([r, c]);
        k = cameFrom[k];
      }
      return path;
    }

    for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
      const nr = cr + dr;
      const nc = cc + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      if (grid[nr][nc] === 1) continue;

      const nk = key(nr, nc);
      const tentG = (gScore[currentKey] ?? Infinity) + 1;

      if (tentG < (gScore[nk] ?? Infinity)) {
        cameFrom[nk]  = currentKey;
        gScore[nk]    = tentG;
        fScore[nk]    = tentG + h(nr, nc);
        openSet.set(nk, [nr, nc]);
      }
    }
  }

  return []; // no path
}
