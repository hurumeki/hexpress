// --- 型定義 ---

export type ScreenMode = 'TITLE' | 'SETTINGS' | 'STAGE_SELECT' | 'GAME';

export type GlobalAchievement = 'gold' | 'silver' | 'bronze' | null;

export interface PieceTemplate {
    id: string;
    color?: string;
    pattern: string;
}

export interface Piece extends PieceTemplate {
    q: number;
    r: number;
}

export interface Target {
    color?: string;
    pattern: string;
}

export interface Tile {
    q: number;
    r: number;
    target: Target | null;
    rails?: Rail[]; // タイルごとのレール（省略時は Level.defaultRails を使用）
}

export interface Rail {
    from: number;
    to: number;
}

export interface SolutionStep {
    pattern: string;
    slot: { targetTileQ: number; targetTileR: number; originalEdge: number };
}

export interface Level {
    id: number;
    name: string;
    excellentMoves: number;
    goodMoves: number;
    layout: Tile[];
    defaultRails: Rail[];
    initialBoard: Record<string, PieceTemplate>;
    initialHand: PieceTemplate[];
    isTutorial?: boolean;
    solution?: SolutionStep[] | null;
}

export interface StageStatus {
    cleared: boolean;
    bestMoves: number | null;
}

export interface UserData {
    soundEnabled: boolean;
    stageProgress: Record<number, StageStatus>;
    lastActiveLevelId: number | null;
    language: 'ja' | 'en';
}

export interface Point {
    x: number;
    y: number;
}

export interface EdgeInfo extends Point {
    angle: number;
}

export interface PathStep {
    q: number;
    r: number;
    exit?: boolean;
}

export interface HighlightedPath {
    color: string;
    path: PathStep[];
    originalEdge: number;
    slotEdge: number;
    targetTileQ: number;
    targetTileR: number;
}

export interface OuterSlot {
    q: number;
    r: number;
    targetTileQ: number;
    targetTileR: number;
    originalEdge: number;
}

export interface DragState {
    active: boolean;
    currentHex: (Tile & { type: 'board' }) | (OuterSlot & { type: 'slot' }) | null;
}

export interface HistoryState {
    board: Piece[];
    hand: PieceTemplate[];
    moves: number;
}
