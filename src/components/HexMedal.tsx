import React from 'react';

interface HexMedalProps {
    color: string | null;
    size: number;
}

const HexMedal: React.FC<HexMedalProps> = ({ color, size }) => {
    // デザイナー向け調整値
    const normalizedColor = color?.toLowerCase();
    const baseColor = normalizedColor === '#fbbf24' ? { main: '#FFD700', light: '#FFF4B0', dark: '#B8860B', accent: '#FFEFD5' } : // Gold
        normalizedColor === '#9ca3af' ? { main: '#C0C0C0', light: '#F5F5F5', dark: '#708090', accent: '#E6E6FA' } : // Silver
            normalizedColor === '#b45309' ? { main: '#CD7F32', light: '#FFD39B', dark: '#8B4513', accent: '#F4A460' } : // Bronze
                { main: '#444444', light: '#666666', dark: '#222222', accent: '#333333' }; // Empty

    const getHexPoints = (s: number) => Array.from({ length: 6 }).map((_, i) => {
        const angle = (Math.PI / 180) * (60 * i + 30);
        return `${s * Math.cos(angle)},${s * Math.sin(angle)}`;
    }).join(' ');

    const outerPoints = getHexPoints(size);
    const middlePoints = getHexPoints(size * 0.85);
    const innerPoints = getHexPoints(size * 0.7);

    if (!color) {
        return (
            <svg width={size * 2.4} height={size * 2.4} viewBox={`-${size * 1.2} -${size * 1.2} ${size * 2.4} ${size * 2.4}`} className="opacity-20">
                <polygon points={outerPoints} fill="none" stroke="white" strokeWidth={1} strokeDasharray="2 2" />
            </svg>
        );
    }

    const id = `medal-${(color || '').replace('#', '')}`;

    return (
        <svg width={size * 3} height={size * 3} viewBox={`-${size * 1.5} -${size * 1.5} ${size * 3} ${size * 3}`} className="overflow-visible">
            <style>
                {`
                    @keyframes medal-spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    @keyframes medal-pulse {
                        0%, 100% { opacity: 0.4; transform: scale(1); }
                        50% { opacity: 0.8; transform: scale(1.1); }
                    }
                    .medal-halo {
                        animation: medal-spin 10s linear infinite;
                    }
                    .medal-glow-effect {
                        animation: medal-pulse 3s ease-in-out infinite;
                    }
                `}
            </style>
            <defs>
                <linearGradient id={`${id}-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={baseColor.light} />
                    <stop offset="40%" stopColor={baseColor.main} />
                    <stop offset="60%" stopColor={baseColor.main} />
                    <stop offset="100%" stopColor={baseColor.dark} />
                </linearGradient>

                <radialGradient id={`${id}-shine`} cx="30%" cy="30%" r="50%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                </radialGradient>

                <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
                    <feFlood floodColor={baseColor.light} result="color" />
                    <feComposite in="color" in2="blur" operator="in" result="glow" />
                    <feComposite in="SourceGraphic" in2="glow" operator="over" />
                </filter>
            </defs>

            {/* 後光 (Halo) */}
            <g className="medal-halo">
                {Array.from({ length: 8 }).map((_, i) => (
                    <rect
                        key={i}
                        x={-size * 1.2} y={-size * 0.15}
                        width={size * 2.4} height={size * 0.3}
                        fill={baseColor.main}
                        opacity="0.15"
                        transform={`rotate(${i * 45})`}
                    />
                ))}
            </g>
            <circle r={size * 1.1} fill={baseColor.main} opacity="0.1" className="medal-glow-effect" />

            {/* メダル本体 */}
            <g filter={`url(#${id}-glow)`}>
                {/* 外枠（ベゼル） */}
                <polygon points={outerPoints} fill={baseColor.dark} />
                <polygon points={getHexPoints(size * 0.95)} fill={`url(#${id}-grad)`} />

                {/* 中層 */}
                <polygon points={middlePoints} fill="none" stroke={baseColor.light} strokeWidth={0.5} opacity="0.5" />

                {/* 内層 */}
                <polygon points={innerPoints} fill={baseColor.main} opacity="0.3" stroke={baseColor.dark} strokeWidth={0.5} />

                {/* 光沢（グロス） */}
                <polygon points={getHexPoints(size * 0.9)} fill={`url(#${id}-shine)`} />
            </g>

            {/* 装飾アクセント（小さな点） */}
            {Array.from({ length: 6 }).map((_, i) => {
                const angle = (Math.PI / 180) * (60 * i);
                const r = size * 0.82;
                return (
                    <circle
                        key={i}
                        cx={r * Math.cos(angle)}
                        cy={r * Math.sin(angle)}
                        r={size * 0.05}
                        fill={baseColor.light}
                        opacity="0.8"
                    />
                );
            })}
        </svg>
    );
};

export default HexMedal;
