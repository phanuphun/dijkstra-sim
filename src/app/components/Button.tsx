import React from "react";

interface ButtonProps {
    children: React.ReactNode;
    color: "blue" | "red" | "green" | "yellow" | "gray" | "dark";
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export default function Button({ children, color, onClick }: ButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`w-fit text-white font-bold py-2 px-4 rounded flex flex-row items-center justify-center gap-2 cursor-pointer
            ${color === "blue" ? "bg-blue-500 hover:bg-blue-700" : ""}
            ${color === "red" ? "bg-red-700 hover:bg-red-900" : ""}
            ${color === "green" ? "bg-green-700 hover:bg-green-900" : ""}
            ${color === "yellow" ? "bg-yellow-500 hover:bg-yellow-600" : ""}
            ${color === "gray" ? "bg-gray-400 hover:bg-gray-500" : ""}
            ${color === "dark" ? "bg-gray-800 hover:bg-gray-900" : ""}
            `}>
            {children}
        </button>
    );
}
