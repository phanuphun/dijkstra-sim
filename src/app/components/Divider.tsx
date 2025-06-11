import React from 'react';

interface DividerProps {
    className?: string;
    style?: React.CSSProperties;
}

export default function Divider({ className, style }: DividerProps) {
    return (
        <hr className={`border-gray-300 ${className || ''}`} style={style} />
    )
}