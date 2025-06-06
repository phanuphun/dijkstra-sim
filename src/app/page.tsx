'use client';
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [grid, setGrid] = useState<any[]>([]);

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
    <div className="flex flex-col min-h-screen bg-gray-100 text-black p-6 gap-4">
      <div className="w-5/12 flex flex-row gap-4">
        <div className="flex flex-row items-center justify-start gap-4">
          <input
            value={width}
            onChange={(e) => {
              if (e.target.value && !isNaN(Number(e.target.value))) {
                setWidth(Number(e.target.value))
              }
            }}
            className="px-4 py-2 border border-gray-300 bg-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full max-w-md"
          />
          <input
            value={height}
            onChange={(e) => {
              if (e.target.value && !isNaN(Number(e.target.value))) {
                setHeight(Number(e.target.value))
              }
            }}
            className="px-4 py-2 border border-gray-300 bg-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full max-w-md"
          />
          <button
            onClick={() => generateGrid(width, height)}
            className="w-24 p-2 bg-blue-500 text-white rounded"
          >
            Gen
          </button>
        </div>
      </div>
      <div>
        <div className="grid grid-cols-1 gap-4">
          {(grid.length > 0) && grid.map((row, rowIndex) => (
            <div key={rowIndex} className="flex flex-row gap-2">
              {row.map((cell: any, cellIndex: any) => (
                <div
                  onClick={() => {
                    gridToggle(rowIndex, cellIndex);
                  }}
                  key={cellIndex}
                  className={`w-12 h-12 rounded-lg flex items-center justify-center border ${cell.status === 1 ? 'bg-white' : 'bg-black text-white'}
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
    </div>
  );
}
