'use client';
import Image from "next/image";
import { use, useEffect, useState } from "react";

export default function Home() {
  const [width, setWidth] = useState(5);
  const [height, setHeight] = useState(5);
  const [grid, setGrid] = useState<any[]>([]);
  const [path, setPath] = useState<any[]>([]); // เส้นทางที่คำนวณได้

  const [start, setStart] = useState<[number, number] | null>(null); // [row, col]
  const [end, setEnd] = useState<[number, number] | null>(null);
  const [mode, setMode] = useState<'start' | 'end' | 'toggle'>('toggle');

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

  // useEffect(() => {
  //   // Reset start and end positions when grid changes
  //   if (mode === 'toggle') {
  //     setPath([]); // Reset path when grid changes
  //   }
  // }, [mode]);

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

  const findShortestPath = async () => {
    if (!start || !end) return;

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

  return (
    <div className="flex flex-col min-h-screen bg-gray-200 text-black p-6 gap-4">
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex flex-wrap items-center justify-start gap-4">
          <div className="w-36 flex flex-col">
            <label className="px-1 text-sm font-medium text-gray-700">ความกว้าง</label>
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
            <label className="px-1 text-sm font-medium text-gray-700">ความสูง</label>
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
            <label className="px-1 text-sm font-medium text-gray-700">อัลกอริธึม</label>
            <select
              className="w-full px-4 py-2.5 border border-gray-300 bg-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400 max-w-md"
            >
              <option value="dijkstra">Dijkstra</option>
              <option value="astar">A*</option>
            </select>
          </div>
          {/* <div className="w-36 flex flex-col">
            <label className="px-1 text-sm font-medium text-gray-700">ค่าเริ่มต้น</label>
            <input
              value={height}
              onChange={(e) => {
                if (e.target.value && !isNaN(Number(e.target.value))) {
                  setHeight(Number(e.target.value))
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 bg-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400 max-w-md"
            />
          </div> */}
        </div>

        <div className="w-full flex items-center justify-start gap-2">
          <button
            onClick={() => setMode('start')}
            className={`p-2 rounded cursor-pointer duration-300 hover:bg-green-500 ${mode === 'start' ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}
          >
            Set Start Position
          </button>
          <button
            onClick={() => setMode('end')}
            className={`p-2 rounded cursor-pointer duration-300 hover:bg-red-500 ${mode === 'end' ? 'bg-red-500 text-white' : 'bg-gray-400 text-white'}`}
          >
            Set End Position
          </button>
          <button
            onClick={() => setMode('toggle')}
            className={`p-2 rounded cursor-pointer duration-300 hover:bg-blue-500 ${mode === 'toggle' ? 'bg-blue-500 text-white' : 'bg-gray-400 text-white'}`}
          >
            Toggle Cell Mode
          </button>
          <button
            onClick={() => findShortestPath()}
            className="bg-green-500 hover:bg-green-600 cursor-pointer text-white p-2 rounded"
          >
            FIND SHORTEST PATH
          </button>
        </div>
      </div>

      <hr />
      {/*Grid Render */}
      <div className="w-full flex flex-row items-start justify-between gap-4">
        <div className="w-10/12 flex flex-col gap-4 items-center justify-center ">
          <div className="w-full grid grid-cols-1 gap-4 p-4 border-gray-400 border rounded-lg overflow-auto ">
            <div className="text-lg font-semibold text-gray-800 ">
              ตารางขนาด {width} x {height}
            </div>
            {(grid.length > 0) && grid.map((row, rowIndex) => (

              <div key={rowIndex} className="flex flex-row gap-2 ">
                {row.map((cell: any, cellIndex: any) => (
                  <div
                    onClick={async () => {
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
                    }}
                    key={cellIndex}
                    className={`  
                        min-w-12 min-h-12 rounded-lg flex items-center justify-center border border-gray-300
                        ${start && start[0] === rowIndex && start[1] === cellIndex
                        ? 'border-green-500 border-6 bg-yellow-200 text-black'
                        : end && end[0] === rowIndex && end[1] === cellIndex
                          ? 'border-red-500 border-6 bg-yellow-200 text-black'
                          : path.some(p => p.node[0] === rowIndex && p.node[1] === cellIndex)
                            ? 'bg-yellow-200 text-black' // สีเหลืองสำหรับเส้นทาง
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
        <div className="w-2/12 h-full bg-white flex flex-col p-4 rounded-lg shadow-md">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Path:</h2>
            {path.length > 0 && (
              <div className="text-sm text-gray-700">
                {path.map((step, index) => (
                  <div key={index} className="mb-1">
                    {/* แสดงตำแหน่งของจุดและระยะทางที่สั้นที่สุด */}
                    <span>
                      จุด [{step.node[0]}, {step.node[1]}] - ระยะทาง: {step.distant}{" "}
                    </span>
                    {/* ถ้าไม่ใช่จุดสุดท้ายให้แสดงเครื่องหมาย '→' */}
                    {index < path.length - 1 && <span>→</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div >
  );
}
