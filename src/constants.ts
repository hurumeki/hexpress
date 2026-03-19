
// --- 定数 ---

export const PATH_COLORS = [
    '#fbbf24', // ゴールド
    '#3b82f6', // ブルー
    '#a855f7', // パープル
    '#22c55e', // グリーン
    '#ef4444', // ルビーレッド
];

// COLORSにCOLORS.rubyがあるか確認するため追加
export const COLORS = {
    wood: '#a0522d',
    stone: '#483d8b',
    grass: '#556b2f',
    gold: '#b8860b',
    ruby: '#ef4444',
    ink: '#2f4f4f',
    neutral: '#d2b48c'
};

export const PATTERNS = {
    CIRCLE: 'circle',
    SQUARE: 'square',
    DIAMOND: 'diamond',
    LINES: 'lines',
    DOT: 'dot',
    NONE: 'none'
} as const;

export const PATTERN_COLORS = {
    [PATTERNS.CIRCLE]: COLORS.wood,
    [PATTERNS.DIAMOND]: COLORS.stone,
    [PATTERNS.LINES]: COLORS.grass,
    [PATTERNS.SQUARE]: COLORS.gold,
    [PATTERNS.DOT]: COLORS.ink,
    [PATTERNS.NONE]: COLORS.neutral
} as const;

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
export const RAILS_3WAY = [
    { from: 0, to: 3 },
    { from: 1, to: 4 },
    { from: 2, to: 5 }
];


export const STORAGE_KEY = 'hexpress_userdata';
