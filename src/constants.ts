import type { Level } from './types';
import level0 from './levels/level0.json';
import level1 from './levels/level1.json';
import level2 from './levels/level2.json';
import level3 from './levels/level3.json';
import level4 from './levels/level4.json';
import level5 from './levels/level5.json';
import level6 from './levels/level6.json';
import level7 from './levels/level7.json';
import level8 from './levels/level8.json';
import level9 from './levels/level9.json';
import level10 from './levels/level10.json';
import level11 from './levels/level11.json';
import level12 from './levels/level12.json';
import level13 from './levels/level13.json';
import level14 from './levels/level14.json';
import level15 from './levels/level15.json';
import level16 from './levels/level16.json';
import level17 from './levels/level17.json';
import level18 from './levels/level18.json';
import level19 from './levels/level19.json';
import level20 from './levels/level20.json';
import level21 from './levels/level21.json';
import level22 from './levels/level22.json';
import level23 from './levels/level23.json';
import level24 from './levels/level24.json';
import level25 from './levels/level25.json';
import level26 from './levels/level26.json';
import level27 from './levels/level27.json';
import level28 from './levels/level28.json';
import level29 from './levels/level29.json';
import level30 from './levels/level30.json';
import level31 from './levels/level31.json';
import level32 from './levels/level32.json';
import level33 from './levels/level33.json';
import level34 from './levels/level34.json';
import level35 from './levels/level35.json';
import level36 from './levels/level36.json';

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

export const LEVELS: Level[] = [
    level0 as Level,
    level1 as Level,
    level2 as Level,
    level3 as Level,
    level4 as Level,
    level5 as Level,
    level6 as Level,
    level7 as Level,
    level8 as Level,
    level9 as Level,
    level10 as Level,
    level11 as Level,
    level12 as Level,
    level13 as Level,
    level14 as Level,
    level15 as Level,
    level16 as Level,
    level17 as Level,
    level18 as Level,
    level19 as Level,
    level20 as Level,
    level21 as Level,
    level22 as Level,
    level23 as Level,
    level24 as Level,
    level25 as Level,
    level26 as Level,
    level27 as Level,
    level28 as Level,
    level29 as Level,
    level30 as Level,
    level31 as Level,
    level32 as Level,
    level33 as Level,
    level34 as Level,
    level35 as Level,
    level36 as Level,
];

export const STORAGE_KEY = 'hexpress_userdata';
