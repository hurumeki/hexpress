import React from 'react';

interface HexMedalProps {
    color: string | null;
    size: number;
}

const HexMedal: React.FC<HexMedalProps> = ({ color, size }) => {
    const getHexPoints = (s: number) => Array.from({ length: 6 }).map((_, i) => {
        const angle = (Math.PI / 180) * (60 * i + 30);
        return `${s * Math.cos(angle)},${s * Math.sin(angle)}`;
    }).join(' ');

    const outerPoints = getHexPoints(size);
    const innerPoints = getHexPoints(size * 0.6);

    return (
        <svg width={size * 2.4} height={size * 2.4} viewBox={`-${size * 1.2} -${size * 1.2} ${size * 2.4} ${size * 2.4}`}>
            <defs>
                <filter id="medal-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>
            <polygon
                points={outerPoints}
                fill={color || 'transparent'}
                stroke={color ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)'}
                strokeWidth={1.5}
                filter={color ? "url(#medal-glow)" : "none"}
            />
            {color && (
                <polygon
                    points={innerPoints}
                    fill="none"
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth={1}
                />
            )}
        </svg>
    );
};

export default HexMedal;
