import type { Point, EdgeInfo } from './types';
import { COLORS, PATTERNS, PATTERN_COLORS } from './constants';

// 模様から色を取得
export const getColorFromPattern = (pattern: string, color?: string): string => {
    if (color) return color; // 明示的に色が指定されている場合はそれを使用（主にニュートラル用）
    return (PATTERN_COLORS as any)[pattern] || COLORS.neutral;
};

// 色から模様を取得（後方互換性のため残すが、基本的には使わない）
export const getPatternFromColor = (color: string): string => {
    if (color === COLORS.wood) return PATTERNS.CIRCLE;
    if (color === COLORS.stone) return PATTERNS.DIAMOND;
    if (color === COLORS.grass) return PATTERNS.LINES;
    if (color === COLORS.gold) return PATTERNS.SQUARE;
    if (color === COLORS.ink) return PATTERNS.DOT;
    return PATTERNS.NONE;
};

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

import type { UserData, Level, GlobalAchievement } from './types';

export const getGlobalAchievementStatus = (
    progress: UserData['stageProgress'],
    levels: Level[]
): GlobalAchievement => {
    if (levels.length === 0) return null;

    let allCleared = true;
    let allSilver = true;
    let allGold = true;

    for (const level of levels) {
        const p = progress[level.id];
        if (!p || !p.cleared || p.bestMoves === null) {
            allCleared = false;
            allSilver = false;
            allGold = false;
            break;
        }
        if (p.bestMoves > level.goodMoves) {
            allSilver = false;
            allGold = false;
        }
        if (p.bestMoves > level.excellentMoves) {
            allGold = false;
        }
    }

    if (allGold) return 'gold';
    if (allSilver) return 'silver';
    if (allCleared) return 'bronze';
    return null;
};

export const getBoardBoundingBox = (hexes: { q: number; r: number }[], size: number, padding: number = 0) => {
    if (hexes.length === 0) return { x: -size, y: -size, width: size * 2, height: size * 2, viewBox: `-${size} -${size} ${size * 2} ${size * 2}` };

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

    hexes.forEach(h => {
        const { x, y } = hexToPixel(h.q, h.r, size);
        minX = Math.min(minX, x - size);
        maxX = Math.max(maxX, x + size);
        minY = Math.min(minY, y - size);
        maxY = Math.max(maxY, y + size);
    });

    minX -= padding;
    maxX += padding;
    minY -= padding;
    maxY += padding;

    const width = maxX - minX;
    const height = maxY - minY;

    return {
        x: minX, y: minY, width, height,
        viewBox: `${minX} ${minY} ${width} ${height}`
    };
};
