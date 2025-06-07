'use client';
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [width, setWidth] = useState(5);
  const [height, setHeight] = useState(5);
  const [grid, setGrid] = useState<any[]>([]);

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
  }, [width, height]);

  const gridToggle = (rowIndex: number, cellIndex: number) => {
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
          {/* <button
            onClick={() => generateGrid(width, height)}
            className="w-fit p-2 bg-blue-500 text-white rounded"
          >
            สร้างตาราง
          </button> */}
        </div>
      </div>

      <hr />
      {/*Grid Render */}
      <div className="w-full flex flex-row items-center justify-between gap-4">
        <div className="w-10/12 flex flex-col gap-4 items-center justify-center ">
          <div className="w-full grid grid-cols-1 gap-4 p-4 border-gray-400 border rounded-lg overflow-auto ">
            <div className="text-lg font-semibold text-gray-800 ">
              ตารางขนาด {width} x {height}
            </div>
            {(grid.length > 0) && grid.map((row, rowIndex) => (
              <div key={rowIndex} className="flex flex-row gap-2 ">
                {row.map((cell: any, cellIndex: any) => (
                  <div
                    onClick={() => {
                      // toggle mode → toggle ได้เสมอ (แม้ cell.status === 0)
                      if (mode === 'toggle') {
                        // แต่ห้าม toggle ถ้า cell เป็น start หรือ end
                        if (
                          (start && start[0] === rowIndex && start[1] === cellIndex) ||
                          (end && end[0] === rowIndex && end[1] === cellIndex)
                        ) {
                          return alert('Cannot toggle start or end cell');
                        }

                        // toggle ปกติ
                        return gridToggle(rowIndex, cellIndex);
                      }

                      // ส่วนของ mode start/end → ต้องห้าม cell ปิด (status 0)
                      if (cell.status === 0) {
                        return alert('Cannot set start or end on a blocked cell');
                      }

                      // ห้าม set start บน end
                      if (mode === 'start' && end && end[0] === rowIndex && end[1] === cellIndex) {
                        return alert('Cannot set start on end position');
                      }

                      // ห้าม set end บน start
                      if (mode === 'end' && start && start[0] === rowIndex && start[1] === cellIndex) {
                        return alert('Cannot set end on start position');
                      }

                      // set start หรือ end
                      if (mode === 'start') {
                        setStart([rowIndex, cellIndex]);
                      } else if (mode === 'end') {
                        setEnd([rowIndex, cellIndex]);
                      }
                    }}

                    key={cellIndex}
                    className={`
                        min-w-12 min-h-12 rounded-lg flex items-center justify-center border border-gray-300
                        ${start && start[0] === rowIndex && start[1] === cellIndex
                        ? 'bg-green-500 text-white'
                        : end && end[0] === rowIndex && end[1] === cellIndex
                          ? 'bg-red-500 text-white'
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
        <div className="w-2/12 h-auto bg-white  flex flex-col">

        </div>
      </div>
    </div>
  );
}
