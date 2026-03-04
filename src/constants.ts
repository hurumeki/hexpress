import type { Level } from './types';

// --- 定数 ---

export const COLORS = {
    wood: '#a0522d',
    stone: '#483d8b',
    grass: '#556b2f',
    gold: '#b8860b',
    ink: '#2f4f4f',
    neutral: '#d2b48c'
};

export const PATH_COLORS = [
    '#fbbf24', // ゴールド
    '#3b82f6', // ブルー
    '#a855f7', // パープル
    '#22c55e', // グリーン
    '#ef4444', // ルビーレッド
];

export const PATTERNS = {
    CIRCLE: 'circle',
    SQUARE: 'square',
    DIAMOND: 'diamond',
    LINES: 'lines',
    DOT: 'dot',
    NONE: 'none'
};

// 0: 右上, 1: 右, 2: 右下, 3: 左下, 4: 左, 5: 左上
export const DIRS = [
    { dq: 1, dr: -1 },
    { dq: 1, dr: 0 },
    { dq: 0, dr: 1 },
    { dq: -1, dr: 1 },
    { dq: -1, dr: 0 },
    { dq: 0, dr: -1 }
];

// タイルごとのレール: 各レベルで全タイルに同じレールを適用（タイル別にも設定可能）
const RAILS_3WAY = [
    { from: 0, to: 3 },
    { from: 1, to: 4 },
    { from: 2, to: 5 }
];

export const LEVELS: Level[] = [
    {
        id: 0,
        name: "Tutorial",
        isTutorial: true,
        excellentMoves: 2,
        goodMoves: 4,
        layout: [
            { q: 0, r: -1, target: { color: COLORS.wood, pattern: PATTERNS.CIRCLE }, rails: [{ from: 2, to: 5 }] },
            { q: 0, r: 0, target: null, rails: [{ from: 2, to: 5 }] },
            { q: 0, r: 1, target: null, rails: [{ from: 2, to: 5 }] }
        ],
        defaultRails: [{ from: 2, to: 5 }],
        initialBoard: {
            '0,1': { id: 't3', color: COLORS.wood, pattern: PATTERNS.CIRCLE }
        },
        initialHand: [
            { id: 'th1', color: COLORS.neutral, pattern: PATTERNS.NONE },
            { id: 'th2', color: COLORS.neutral, pattern: PATTERNS.NONE }
        ]
    },
    {
        id: 1,
        name: "Swap Triangle",
        excellentMoves: 5,
        goodMoves: 10,
        layout: [
            { q: 0, r: 0, target: { color: COLORS.stone, pattern: PATTERNS.DIAMOND }, rails: RAILS_3WAY },
            { q: 1, r: -1, target: { color: COLORS.wood, pattern: PATTERNS.CIRCLE }, rails: RAILS_3WAY },
            { q: 1, r: 0, target: { color: COLORS.grass, pattern: PATTERNS.LINES }, rails: RAILS_3WAY }
        ],
        defaultRails: RAILS_3WAY,
        initialBoard: {
            '0,0': { id: 'p1', color: COLORS.wood, pattern: PATTERNS.CIRCLE },
            '1,-1': { id: 'p2', color: COLORS.stone, pattern: PATTERNS.DIAMOND },
            '1,0': { id: 'p3', color: COLORS.grass, pattern: PATTERNS.LINES }
        },
        initialHand: [
            { id: 'h1', color: COLORS.neutral, pattern: PATTERNS.NONE }
        ]
    },
    {
        id: 2,
        name: "Square Shift",
        excellentMoves: 8,
        goodMoves: 15,
        layout: [
            { q: 0, r: 0, target: { color: COLORS.gold, pattern: PATTERNS.SQUARE }, rails: RAILS_3WAY },
            { q: 1, r: 0, target: { color: COLORS.wood, pattern: PATTERNS.CIRCLE }, rails: RAILS_3WAY },
            { q: 0, r: 1, target: { color: COLORS.stone, pattern: PATTERNS.DIAMOND }, rails: RAILS_3WAY },
            { q: 1, r: 1, target: { color: COLORS.grass, pattern: PATTERNS.LINES }, rails: RAILS_3WAY }
        ],
        defaultRails: RAILS_3WAY,
        initialBoard: {
            '0,0': { id: 'q1', color: COLORS.wood, pattern: PATTERNS.CIRCLE },
            '1,0': { id: 'q2', color: COLORS.stone, pattern: PATTERNS.DIAMOND },
            '0,1': { id: 'q3', color: COLORS.grass, pattern: PATTERNS.LINES },
            '1,1': { id: 'q4', color: COLORS.gold, pattern: PATTERNS.SQUARE }
        },
        initialHand: [
            { id: 'qh1', color: COLORS.neutral, pattern: PATTERNS.NONE }
        ]
    },
    {
        id: 3,
        name: "New Stage",
        excellentMoves: 3,
        goodMoves: 6,
        layout: [
            { q: 0, r: 0, target: { color: COLORS.stone, pattern: PATTERNS.DIAMOND }, rails: RAILS_3WAY },
            { q: 1, r: -1, target: { color: COLORS.wood, pattern: PATTERNS.CIRCLE }, rails: RAILS_3WAY },
            { q: 1, r: 0, target: { color: COLORS.grass, pattern: PATTERNS.LINES }, rails: RAILS_3WAY },
            { q: 0, r: 1, target: { color: COLORS.gold, pattern: PATTERNS.SQUARE }, rails: RAILS_3WAY }
        ],
        defaultRails: RAILS_3WAY,
        initialBoard: {
            '1,-1': { id: 'p_1_-1', color: COLORS.stone, pattern: PATTERNS.DIAMOND },
            '1,0': { id: 'p_1_0', color: COLORS.wood, pattern: PATTERNS.CIRCLE },
            '0,1': { id: 'p_0_1', color: COLORS.grass, pattern: PATTERNS.LINES },
            '0,0': { id: 'p_0_0', color: COLORS.gold, pattern: PATTERNS.SQUARE }
        },
        initialHand: [
            { id: 'h_neutral_0', color: COLORS.neutral, pattern: PATTERNS.NONE }
        ]
    }
];

export const STORAGE_KEY = 'hexa_slide_userdata';
