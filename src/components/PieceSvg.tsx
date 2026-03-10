import React from 'react';
import type { PieceTemplate } from '../types';
import { PATTERNS } from '../constants';
import { getColorFromPattern } from '../utils';

interface PieceSvgProps {
    piece: PieceTemplate;
    x: number;
    y: number;
    size: number;
    isTarget?: boolean;
    ghost?: boolean;
    isPeek?: boolean;
}

const PieceSvg: React.FC<PieceSvgProps> = ({ piece, x, y, size, isTarget, ghost, isPeek }) => {
    const color = getColorFromPattern(piece.pattern, piece.color);
    const pattern = piece.pattern;
    // isPeek の時は全体を完全に透過させる（駒を隠す）
    const baseOpacity = isTarget ? 0.4 : (isPeek ? 0 : 1);
    // 模様も連動して隠す
    const patternOpacity = isPeek ? 0 : 1;

    return (
        <g transform={`translate(${x}, ${y})`} className="transition-transform duration-300 ease-out" opacity={baseOpacity}>
            {!isTarget && !ghost && (
                <circle
                    r={size * 0.7}
                    fill={color}
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth={2}
                />
            )}
            {isTarget && (
                <circle
                    r={size * 0.6}
                    fill="none"
                    stroke={color}
                    strokeWidth={2}
                    strokeDasharray="4 2"
                />
            )}
            <g opacity={patternOpacity}>
                {pattern === PATTERNS.CIRCLE && <circle r={size * 0.4} fill="none" stroke="#fff" strokeWidth="2" />}
                {pattern === PATTERNS.SQUARE && <rect x={-size * 0.3} y={-size * 0.3} width={size * 0.6} height={size * 0.6} fill="none" stroke="#fff" strokeWidth="2" />}
                {pattern === PATTERNS.DIAMOND && (
                    <polygon points={`0,${-size * 0.5} ${size * 0.4},0 0,${size * 0.5} ${-size * 0.4},0`} fill="none" stroke="#fff" strokeWidth="2" />
                )}
                {pattern === PATTERNS.LINES && (
                    <g stroke="#fff" strokeWidth="2">
                        <line x1={-size * 0.4} y1={-size * 0.15} x2={size * 0.4} y2={-size * 0.15} />
                        <line x1={-size * 0.4} y1={size * 0.15} x2={size * 0.4} y2={size * 0.15} />
                    </g>
                )}
                {pattern === PATTERNS.DOT && <circle r={size * 0.2} fill="#fff" />}
            </g>
            {!isTarget && !ghost && <circle r={size * 0.7} fill="url(#gloss)" opacity="0.3" />}
        </g>
    );
};

export default PieceSvg;
