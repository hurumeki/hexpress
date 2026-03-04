import type { Point, EdgeInfo } from './types';

// --- ヘルパー関数 ---

export const hexToPixel = (q: number, r: number, size: number): Point => {
    const x = size * Math.sqrt(3) * (q + r / 2);
    const y = size * (3 / 2) * r;
    return { x, y };
};

export const getHexCorner = (centerX: number, centerY: number, size: number, j: number): Point => {
    const angleRad = (Math.PI / 180) * (60 * j + 30);
    return {
        x: centerX + size * Math.cos(angleRad),
        y: centerY + size * Math.sin(angleRad)
    };
};

export const getEdgeInfo = (centerX: number, centerY: number, size: number, edgeIdx: number): EdgeInfo => {
    const p1 = getHexCorner(centerX, centerY, size, edgeIdx);
    const p2 = getHexCorner(centerX, centerY, size, (edgeIdx + 1) % 6);
    return {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2,
        angle: edgeIdx * 60 + 60
    };
};

export const getMedalColor = (bestMoves: number | null, excellent: number, good: number): string | null => {
    if (bestMoves === null) return null;
    if (bestMoves <= excellent) return '#fbbf24'; // Gold
    if (bestMoves <= good) return '#9ca3af';      // Silver
    return '#b45309';                             // Bronze
};
