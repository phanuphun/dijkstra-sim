'use client';
import Image from "next/image";
import { use, useEffect, useState } from "react";
import Button from "./components/Button";
import { DynamicIcon } from 'lucide-react/dynamic';
import Divider from "./components/Divider";

const App = () => (
  <DynamicIcon name="camera" color="red" size={48} />
);
export default function Home() {
  const [width, setWidth] = useState(19);
  const [height, setHeight] = useState(9);
  const [grid, setGrid] = useState<any[]>([]);
  const [path, setPath] = useState<any[]>([]); // เส้นทางที่คำนวณได้

  const [start, setStart] = useState<[number, number] | null>(null); // [row, col]
  const [end, setEnd] = useState<[number, number] | null>(null);
  const [mode, setMode] = useState<'start' | 'end' | 'toggle'>('toggle');

  const [algorithm, setAlgorithm] = useState<'dijkstra' | 'astar'>('dijkstra');

  const generateGrid = (width: number, height: number) => {
    const newGrid = [];
    for (let i = 0; i < height; i++) {
      const row = [];
      for (let j = 0; j < width; j++) {
        row.push({
          status: 1,
          distant: Math.floor(Math.random() * 100),
        });
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
    console.log(newGrid);
  };

  useEffect(() => {
    // Initialize grid on component mount
    generateGrid(width, height);
    setPath([]); // Reset path when grid changes
  }, [width, height]);

  useEffect(() => {
    if (start && end) {
      setPath([]); // Reset path when grid changes
      findShortestPath();
    }
  }, [grid]);

  const gridToggle = async (rowIndex: number, cellIndex: number) => {
    console.log(`Toggling cell at row ${rowIndex}, column ${cellIndex}`);
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((row, rIndex) => {
        if (rIndex === rowIndex) {
          return row.map((cell: any, cIndex: any) => {
            if (cIndex === cellIndex) {
              return {
                ...cell,
                status: cell.status === 1 ? 0 : 1,
              };
            }
            return cell;
          });
        }
        return row;
      });
      return newGrid;
    });
  };

  const clearState = () => {
    setStart(null);
    setEnd(null);
    setPath([]);
    // Regenerate grid
  }

  const findShortestPath = async () => {
    if (!start || !end) return;

    if (algorithm === 'dijkstra') {
      await dijkstraAlgorithm(start, end);
    }
    // Dijkstra's algorithm
    const rows = grid.length;
    const cols = grid[0].length;
    const distances: number[][] = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
    const visited: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));
    const prev: (any | null)[][] = Array.from({ length: rows }, () => Array(cols).fill(null));

    // Set the starting point
    distances[start[0]][start[1]] = 0;

    // Directions for up, down, left, right
    const directions: [number, number][] = [
      [-1, 0], // Up
      [1, 0],  // Down
      [0, -1], // Left
      [0, 1]   // Right
    ];

    const pq: [number, number][] = [start];

    while (pq.length > 0) {
      // Select the node with the shortest distance
      const [x, y] = pq.shift()!;
      if (visited[x][y]) continue;

      visited[x][y] = true;

      // Explore neighbors
      for (const [dx, dy] of directions) {
        const nx = x + dx;
        const ny = y + dy;

        if (nx >= 0 && nx < rows && ny >= 0 && ny < cols && !visited[nx][ny] && grid[nx][ny].status !== 0) {
          const newDist = distances[x][y] + grid[nx][ny].distant;
          if (newDist < distances[nx][ny]) {
            distances[nx][ny] = newDist;
            prev[nx][ny] = [x, y];
            pq.push([nx, ny]);
          }
        }
      }
    }

    // Reconstruct path and gather the distances (distant)
    const newPath: { node: [number, number], distant: number }[] = [];
    let current = end;
    while (current) {
      newPath.unshift({ node: current, distant: distances[current[0]][current[1]] });
      current = prev[current[0]][current[1]];
    }

    // If path starts from the start position, update the state
    if (newPath[0]?.node[0] === start[0] && newPath[0]?.node[1] === start[1]) {
      setPath(newPath);  // Store path with distances
    } else {
      alert("No path found");
    }
  };

  const dijkstraAlgorithm = async (start: any, end: any) => {
    // await 
  }

  const bfToggle = async (rowIndex: any, cellIndex: any, cell: any) => {
    if (mode === 'toggle') {
      if (
        (start && start[0] === rowIndex && start[1] === cellIndex) ||
        (end && end[0] === rowIndex && end[1] === cellIndex)
      ) {
        return alert('Cannot toggle start or end cell');
      }

      return await gridToggle(rowIndex, cellIndex);
    }

    if (cell.status === 0) {
      return alert('Cannot set start or end on a blocked cell');
    }

    if (mode === 'start' && end && end[0] === rowIndex && end[1] === cellIndex) {
      return alert('Cannot set start on end position');
    }

    if (mode === 'end' && start && start[0] === rowIndex && start[1] === cellIndex) {
      return alert('Cannot set end on start position');
    }

    if (mode === 'start') {
      setStart([rowIndex, cellIndex]);
      setPath([]); // Reset path when end is set
    } else if (mode === 'end') {
      setEnd([rowIndex, cellIndex]);
      setPath([]); // Reset path when end is set
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-200 text-black p-6 gap-4">
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="w-36 flex flex-col">
              <label className="px-1 text-sm font-medium text-gray-700">Width</label>
              <input
                value={width}
                onChange={(e) => {
                  if (e.target.value && !isNaN(Number(e.target.value))) {
                    setWidth(Number(e.target.value))
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 bg-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400 max-w-md"
              />
            </div>
            <div className="w-36 flex flex-col">
              <label className="px-1 text-sm font-medium text-gray-700">Height</label>
              <input
                value={height}
                onChange={(e) => {
                  if (e.target.value && !isNaN(Number(e.target.value))) {
                    setHeight(Number(e.target.value))
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 bg-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400 max-w-md"
              />
            </div>
            <div className="w-36 flex flex-col">
              <label className="px-1 text-sm font-medium text-gray-700">Algorithm</label>
              <select
                onChange={(e) => setAlgorithm(e.target.value as 'dijkstra' | 'astar')}
                value={algorithm}
                className="w-full px-4 py-2.5 border border-gray-300 bg-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400 max-w-md"
              >
                <option value="dijkstra">Dijkstra</option>
                <option value="astar">A*</option>
              </select>
            </div>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <Button color={mode === 'toggle' ? 'dark' : 'gray'} onClick={() => setMode('toggle')}>
              <DynamicIcon name="mouse-pointer-click" color="white" size="20" />
            </Button>
            <Button color={mode === 'start' ? 'green' : 'gray'} onClick={() => setMode('start')}>
              <DynamicIcon name="flag-triangle-left" color="white" size="20" />
            </Button>
            <Button color={mode === 'end' ? 'red' : 'gray'} onClick={() => setMode('end')}>
              <DynamicIcon name="flag-triangle-right" color="white" size="20" />
            </Button>
            <Button color="red" onClick={() => clearState()}>
              <DynamicIcon name="eraser" color="white" size="20" />
            </Button>
            <Button color="yellow" onClick={() => generateGrid(width, height)}>
              <DynamicIcon name="rotate-ccw" color="white" size="20" />
            </Button>
            <Button color="blue" onClick={() => findShortestPath()}>
              <DynamicIcon name="circle-play" color="white" size="20" />
            </Button>
          </div>
        </div>
      </div>

      <Divider className="border-gray-400" />

      {/*Grid Render */}
      <div className="w-full flex flex-row items-start justify-between gap-4">
        <div className="w-full flex flex-col gap-4 items-start justify-center ">
          <div className="w-full grid grid-cols-1 gap-4 overflow-auto min-h-[calc(100vh-150px)] max-h-[calc(100vh-150px)] rounded">
            {(grid.length > 0) && grid.map((row, rowIndex) => (

              <div key={rowIndex} className="flex flex-row gap-2 justify-start">
                {row.map((cell: any, cellIndex: any) => (
                  <div
                    onClick={async () => {
                      bfToggle(rowIndex, cellIndex, cell)
                    }}
                    key={cellIndex}
                    className={`  
                        min-w-12 min-h-12 rounded-lg flex items-center justify-center border border-gray-300
                        ${start && start[0] === rowIndex && start[1] === cellIndex
                        ? 'border-green-500 border-6 bg-green-100 text-black'
                        : end && end[0] === rowIndex && end[1] === cellIndex
                          ? 'border-red-500 border-6 bg-green-100 text-black'
                          : path.some(p => p.node[0] === rowIndex && p.node[1] === cellIndex)
                            ? 'bg-green-100 text-black'
                            : cell.status === 1
                              ? 'bg-white'
                              : 'bg-black text-white'
                      }
                      hover:bg-gray-200 transition-colors cursor-pointer
                    `}
                  >
                    {cell.distant}
                  </div>
                ))}
              </div>
            ))}
          </div>

        </div>
        <div className="w-full max-w-80 min-w-60 min-h-[calc(100vh-150px)] max-h-[calc(100vh-150px)] overflow-auto 
        bg-white flex flex-col p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800">Path list</h2>
          <Divider />
          {path.length > 0 && (
            <div className="text-md text-gray-700 py-2">
              {path.map((step, index) => (
                <div key={index}>
                  <span>
                    จุด [{step.node[0]}, {step.node[1]}] - Distants: {step.distant}{" "}
                  </span>
                  {index < path.length - 1}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div >
  );
}
