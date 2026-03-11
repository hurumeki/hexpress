import React from 'react';
import type { GlobalAchievement } from '../types';

interface CrownSvgProps {
    status: GlobalAchievement;
    size?: number;
    className?: string;
}

const CrownSvg: React.FC<CrownSvgProps> = ({ status, size = 24, className = '' }) => {
    if (!status) return null;
    
    const colors = {
        gold: { fill: '#fbbf24', stroke: '#b45309', glow: 'rgba(251,191,36,0.6)' },
        silver: { fill: '#f3f4f6', stroke: '#9ca3af', glow: 'rgba(209,213,219,0.5)' },
        bronze: { fill: '#f59e0b', stroke: '#92400e', glow: 'rgba(217,119,6,0.5)' },
    };
    const color = colors[status];

    return (
        <svg 
            width={size} 
            height={size} 
            viewBox="0 0 24 24" 
            fill={color.fill} 
            stroke={color.stroke} 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
            style={{ filter: `drop-shadow(0 0 8px ${color.glow})` }}
        >
            <path d="M2 19L4.5 9l5 4 2.5-10 2.5 10 5-4L22 19z" />
            <path d="M2 22h20" strokeWidth="2" />
            <circle cx="4.5" cy="9" r="1.5" fill="white" stroke="none" />
            <circle cx="12" cy="3" r="1.5" fill="white" stroke="none" />
            <circle cx="19.5" cy="9" r="1.5" fill="white" stroke="none" />
        </svg>
    );
};
export default CrownSvg;
