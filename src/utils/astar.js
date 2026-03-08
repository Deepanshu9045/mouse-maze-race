// src/utils/astar.js
export function astar(grid, start, end) {
  const rows = grid.length;
  const cols = grid[0].length;

  const openSet = [];
  const closedSet = new Set();
  const cameFrom = {};

  const hash = (pos) => `${pos[0]}-${pos[1]}`;
  const heuristic = (a, b) => Math.abs(a[0]-b[0]) + Math.abs(a[1]-b[1]);

  const gScore = Array(rows).fill(0).map(() => Array(cols).fill(Infinity));
  const fScore = Array(rows).fill(0).map(() => Array(cols).fill(Infinity));

  gScore[start[0]][start[1]] = 0;
  fScore[start[0]][start[1]] = heuristic(start, end);

  openSet.push({ pos: start, f: fScore[start[0]][start[1]] });

  const directions = [[1,0], [-1,0], [0,1], [0,-1]];

  while(openSet.length) {
    openSet.sort((a,b) => a.f - b.f);
    const current = openSet.shift().pos;

    if(current[0] === end[0] && current[1] === end[1]) {
      const path = [];
      let temp = hash(current);
      while(cameFrom[temp]) {
        const [r,c] = temp.split('-').map(Number);
        path.push([r,c]);
        temp = cameFrom[temp];
      }
      path.push(start);
      return path.reverse();
    }

    closedSet.add(hash(current));

    for(const [dr,dc] of directions){
      const nr = current[0]+dr;
      const nc = current[1]+dc;
      if(nr<0||nr>=rows||nc<0||nc>=cols) continue;
      if(grid[nr][nc]===1) continue;
      const neighborHash = hash([nr,nc]);
      if(closedSet.has(neighborHash)) continue;
      const tentativeG = gScore[current[0]][current[1]] + 1;
      if(tentativeG < gScore[nr][nc]){
        cameFrom[neighborHash] = hash(current);
        gScore[nr][nc] = tentativeG;
        fScore[nr][nc] = tentativeG + heuristic([nr,nc],end);
        if(!openSet.find(n=>n.pos[0]===nr && n.pos[1]===nc)){
          openSet.push({pos:[nr,nc], f:fScore[nr][nc]});
        }
      }
    }
  }
  return [];
}