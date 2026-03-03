import React, { useState, useEffect, useMemo } from 'react';

// --- 型定義 ---

type ScreenMode = 'TITLE' | 'SETTINGS' | 'STAGE_SELECT' | 'GAME';

interface PieceTemplate {
    id: string;
    color: string;
    pattern: string;
}

interface Piece extends PieceTemplate {
    q: number;
    r: number;
}

interface Target {
    color: string;
    pattern: string;
}

interface Tile {
    q: number;
    r: number;
    target: Target | null;
}

interface Rail {
    from: number;
    to: number;
}

interface Level {
    id: number;
    name: string;
    excellentMoves: number;
    goodMoves: number;
    layout: Tile[];
    defaultRails: Rail[];
    initialBoard: Record<string, PieceTemplate>;
    initialHand: PieceTemplate[];
    isTutorial?: boolean;
}

interface StageStatus {
    cleared: boolean;
    bestMoves: number | null;
}

interface UserData {
    soundEnabled: boolean;
    adsEnabled: boolean;
    stageProgress: Record<number, StageStatus>;
    lastActiveLevelId: number | null;
}

interface Point {
    x: number;
    y: number;
}

interface EdgeInfo extends Point {
    angle: number;
}

interface PathStep {
    q: number;
    r: number;
    exit?: boolean;
}

interface HighlightedPath {
    color: string;
    path: PathStep[];
    originalEdge: number;
    slotEdge: number;
    targetTileQ: number;
    targetTileR: number;
}

interface DragState {
    active: boolean;
    currentHex: (Tile & { type: 'board' }) | (OuterSlot & { type: 'slot' }) | null;
}

interface OuterSlot {
    q: number;
    r: number;
    targetTileQ: number;
    targetTileR: number;
    originalEdge: number;
}

interface HistoryState {
    board: Piece[];
    hand: PieceTemplate[];
    moves: number;
}

// --- 定数・定義 ---

const COLORS = {
    wood: '#a0522d',
    stone: '#483d8b',
    grass: '#556b2f',
    gold: '#b8860b',
    ink: '#2f4f4f',
    neutral: '#d2b48c'
};

const PATH_COLORS = [
    '#fbbf24', // ゴールド
    '#3b82f6', // ブルー
    '#a855f7', // パープル
    '#22c55e', // グリーン
    '#ef4444', // ルビーレッド
];

const PATTERNS = {
    CIRCLE: 'circle',
    SQUARE: 'square',
    DIAMOND: 'diamond',
    LINES: 'lines',
    DOT: 'dot',
    NONE: 'none'
};

// 0: 右上, 1: 右, 2: 右下, 3: 左下, 4: 左, 5: 左上
const DIRS = [
    { dq: 1, dr: -1 },
    { dq: 1, dr: 0 },
    { dq: 0, dr: 1 },
    { dq: -1, dr: 1 },
    { dq: -1, dr: 0 },
    { dq: 0, dr: -1 }
];

const LEVELS: Level[] = [
    {
        id: 0,
        name: "Tutorial",
        isTutorial: true,
        excellentMoves: 2,
        goodMoves: 4,
        layout: [
            { q: 0, r: -1, target: { color: COLORS.wood, pattern: PATTERNS.NONE } },
            { q: 0, r: 0, target: null },
            { q: 0, r: 1, target: null }
        ],
        defaultRails: [
            { from: 2, to: 5 }
        ],
        initialBoard: {
            // '0,-1': { id: 't1', color: COLORS.neutral, pattern: PATTERNS.NONE },
            // '0,0': { id: 't2', color: COLORS.neutral, pattern: PATTERNS.NONE },
            '0,1': { id: 't3', color: COLORS.wood, pattern: PATTERNS.NONE }
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
            { q: 0, r: 0, target: { color: COLORS.stone, pattern: PATTERNS.DIAMOND } },
            { q: 1, r: -1, target: { color: COLORS.wood, pattern: PATTERNS.CIRCLE } },
            { q: 1, r: 0, target: { color: COLORS.grass, pattern: PATTERNS.LINES } }
        ],
        defaultRails: [
            { from: 0, to: 3 },
            { from: 1, to: 4 },
            { from: 2, to: 5 }
        ],
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
            { q: 0, r: 0, target: { color: COLORS.gold, pattern: PATTERNS.SQUARE } },
            { q: 1, r: 0, target: { color: COLORS.wood, pattern: PATTERNS.CIRCLE } },
            { q: 0, r: 1, target: { color: COLORS.stone, pattern: PATTERNS.DIAMOND } },
            { q: 1, r: 1, target: { color: COLORS.grass, pattern: PATTERNS.LINES } }
        ],
        defaultRails: [
            { from: 0, to: 3 },
            { from: 1, to: 4 },
            { from: 2, to: 5 }
        ],
        initialBoard: {
            '0,0': { id: 'q1', color: COLORS.wood, pattern: PATTERNS.CIRCLE },
            '1,0': { id: 'q2', color: COLORS.stone, pattern: PATTERNS.DIAMOND },
            '0,1': { id: 'q3', color: COLORS.grass, pattern: PATTERNS.LINES },
            '1,1': { id: 'q4', color: COLORS.gold, pattern: PATTERNS.SQUARE }
        },
        initialHand: [
            { id: 'qh1', color: COLORS.neutral, pattern: PATTERNS.NONE }
        ]
    }
];

// --- ヘルパー関数 ---

const hexToPixel = (q: number, r: number, size: number): Point => {
    const x = size * Math.sqrt(3) * (q + r / 2);
    const y = size * (3 / 2) * r;
    return { x, y };
};

const getHexCorner = (centerX: number, centerY: number, size: number, j: number): Point => {
    const angleRad = (Math.PI / 180) * (60 * j + 30);
    return {
        x: centerX + size * Math.cos(angleRad),
        y: centerY + size * Math.sin(angleRad)
    };
};

const getEdgeInfo = (centerX: number, centerY: number, size: number, edgeIdx: number): EdgeInfo => {
    const p1 = getHexCorner(centerX, centerY, size, edgeIdx);
    const p2 = getHexCorner(centerX, centerY, size, (edgeIdx + 1) % 6);
    return {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2,
        angle: edgeIdx * 60 + 60
    };
};

const getMedalColor = (bestMoves: number | null, excellent: number, good: number) => {
    if (bestMoves === null) return null;
    if (bestMoves <= excellent) return '#fbbf24'; // Gold
    if (bestMoves <= good) return '#9ca3af';      // Silver
    return '#b45309';                             // Bronze
};

// --- サブコンポーネント ---

interface PieceProps {
    piece: PieceTemplate | null;
    x: number;
    y: number;
    size: number;
    isTarget?: boolean;
    isPeek?: boolean;
    ghost?: boolean;
}

const Piece: React.FC<PieceProps> = ({ piece, x, y, size, isTarget = false, isPeek = false, ghost = false }) => {
    if (!piece) return null;
    let opacity = isTarget ? 0.3 : (isPeek ? 0.05 : 1);
    if (ghost) opacity = 0.5;
    const scale = isTarget ? 0.75 : 1;

    return (
        <g
            style={{
                transform: `translate(${x}px, ${y}px) scale(${scale})`,
                transition: isTarget ? 'none' : 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.2s'
            }}
            opacity={opacity}
        >
            <circle r={size * 0.7} fill={piece.color} stroke="#000" strokeWidth={1} />
            {piece.pattern === PATTERNS.CIRCLE && <circle r={size * 0.35} fill="none" stroke="#fff" strokeWidth="2" />}
            {piece.pattern === PATTERNS.SQUARE && <rect x={-size * 0.3} y={-size * 0.3} width={size * 0.6} height={size * 0.6} fill="none" stroke="#fff" strokeWidth="2" />}
            {piece.pattern === PATTERNS.DIAMOND && <path d={`M0,-${size * 0.4} L${size * 0.4},0 L0,${size * 0.4} L-${size * 0.4},0 Z`} fill="none" stroke="#fff" strokeWidth="2" />}
            {piece.pattern === PATTERNS.LINES && (
                <g stroke="#fff" strokeWidth="2">
                    <line x1={-size * 0.4} y1={-size * 0.15} x2={size * 0.4} y2={-size * 0.15} />
                    <line x1={-size * 0.4} y1={size * 0.15} x2={size * 0.4} y2={size * 0.15} />
                </g>
            )}
            {piece.pattern === PATTERNS.DOT && <circle r={size * 0.2} fill="#fff" />}
            {!isTarget && !ghost && <circle r={size * 0.7} fill="url(#gloss)" opacity="0.3" />}
        </g>
    );
};

const HexMedal: React.FC<{ color: string | null; size: number }> = ({ color, size }) => {
    const points = Array.from({ length: 6 }).map((_, i) => {
        const angle = (Math.PI / 180) * (60 * i + 30);
        return `${size * Math.cos(angle)},${size * Math.sin(angle)}`;
    }).join(' ');

    return (
        <svg width={size * 2.2} height={size * 2.2} viewBox={`-${size * 1.1} -${size * 1.1} ${size * 2.2} ${size * 2.2}`}>
            <polygon
                points={points}
                fill={color || 'transparent'}
                stroke={color ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)'}
                strokeWidth={2}
            />
        </svg>
    );
};

// --- メインアプリ ---

const STORAGE_KEY = 'hexa_slide_userdata';

export default function App() {
    const [screen, setScreen] = useState<ScreenMode>('TITLE');
    const [userData, setUserData] = useState<UserData>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : {
            soundEnabled: true,
            adsEnabled: true,
            stageProgress: {},
            lastActiveLevelId: null
        };
    });

    const [currentLevelId, setCurrentLevelId] = useState<number | null>(null);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    }, [userData]);

    const activeLevel = useMemo(() => LEVELS.find(l => l.id === currentLevelId), [currentLevelId]);

    const updateStageProgress = (levelId: number, moves: number) => {
        setUserData(prev => {
            const current = prev.stageProgress[levelId];
            const best = (current && current.bestMoves !== null) ? Math.min(current.bestMoves, moves) : moves;
            return {
                ...prev,
                stageProgress: {
                    ...prev.stageProgress,
                    [levelId]: { cleared: true, bestMoves: best }
                },
                lastActiveLevelId: levelId
            };
        });
    };

    const clearAllData = () => {
        const fresh: UserData = {
            soundEnabled: true,
            adsEnabled: true,
            stageProgress: {},
            lastActiveLevelId: null
        };
        setUserData(fresh);
    };

    const handleContinue = () => {
        const last = userData.lastActiveLevelId;
        if (last === null) {
            setCurrentLevelId(0);
        } else {
            // Find next level if last was cleared
            const lastStatus = userData.stageProgress[last];
            if (lastStatus && lastStatus.cleared && last < LEVELS.length - 1) {
                setCurrentLevelId(last + 1);
            } else {
                setCurrentLevelId(last);
            }
        }
        setScreen('GAME');
    };

    const selectLevel = (id: number) => {
        setCurrentLevelId(id);
        setScreen('GAME');
    };

    // --- 各画面のレンダリング ---

    if (screen === 'TITLE') {
        const hasData = Object.keys(userData.stageProgress).length > 0;
        return (
            <div className="min-h-screen bg-stone-700 flex flex-col items-center justify-center p-4 select-none touch-none text-white">
                <div className="w-full max-w-md bg-stone-800 rounded-3xl shadow-2xl border border-stone-600 overflow-hidden p-8 flex flex-col items-center">
                    <h1 className="text-5xl font-black italic tracking-tighter uppercase mb-2">HEXA SLIDE</h1>
                    <p className="text-amber-500 font-bold uppercase tracking-widest text-sm mb-12">Puzzle Odyssey</p>

                    <div className="flex flex-col gap-4 w-full">
                        <button
                            onClick={() => hasData ? handleContinue() : selectLevel(0)}
                            className="w-full py-5 bg-amber-500 text-black font-black text-xl rounded-2xl active:scale-95 transition-transform uppercase italic"
                        >
                            {hasData ? 'Continue' : 'Start'}
                        </button>
                        <button
                            onClick={() => setScreen('STAGE_SELECT')}
                            className="w-full py-5 bg-stone-700 text-white font-black text-xl rounded-2xl active:scale-95 transition-transform uppercase italic border border-stone-600"
                        >
                            Stage Select
                        </button>
                        <button
                            onClick={() => setScreen('SETTINGS')}
                            className="w-full py-5 bg-stone-700 text-white font-black text-xl rounded-2xl active:scale-95 transition-transform uppercase italic border border-stone-600"
                        >
                            Settings
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (screen === 'SETTINGS') {
        return (
            <div className="min-h-screen bg-stone-700 flex flex-col items-center justify-center p-4 select-none touch-none text-white">
                <div className="w-full max-w-md bg-stone-800 rounded-3xl shadow-2xl border border-stone-600 overflow-hidden flex flex-col">
                    <div className="p-6 bg-stone-900 border-b border-stone-700 flex justify-between items-center">
                        <h2 className="text-2xl font-black italic uppercase">Settings</h2>
                        <button onClick={() => setScreen('TITLE')} className="w-10 h-10 flex items-center justify-center bg-stone-800 rounded-xl border border-stone-600 text-xl font-bold">×</button>
                    </div>
                    <div className="p-8 flex flex-col gap-8">
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-bold uppercase italic tracking-tight">Sound Effects</span>
                            <button
                                onClick={() => setUserData(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
                                className={`w-16 h-8 rounded-full relative transition-colors ${userData.soundEnabled ? 'bg-amber-500' : 'bg-stone-600'}`}
                            >
                                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${userData.soundEnabled ? 'right-1' : 'left-1'}`} />
                            </button>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-bold uppercase italic tracking-tight">Show Ads</span>
                            <button
                                onClick={() => setUserData(prev => ({ ...prev, adsEnabled: !prev.adsEnabled }))}
                                className={`w-16 h-8 rounded-full relative transition-colors ${userData.adsEnabled ? 'bg-amber-500' : 'bg-stone-600'}`}
                            >
                                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${userData.adsEnabled ? 'right-1' : 'left-1'}`} />
                            </button>
                        </div>
                        <div className="pt-8 border-t border-stone-700">
                            <button
                                onClick={() => { if (confirm('Clear all progress?')) clearAllData(); }}
                                className="w-full py-4 bg-red-900/50 text-red-200 font-bold rounded-xl border border-red-800 hover:bg-red-900 active:scale-95 transition-all uppercase tracking-tighter"
                            >
                                Erase Play Data
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (screen === 'STAGE_SELECT') {
        return <StageSelectScreen userData={userData} onSelect={selectLevel} onBack={() => setScreen('TITLE')} />;
    }

    if (screen === 'GAME' && activeLevel) {
        return (
            <GameScreen
                level={activeLevel}
                bestMoves={userData.stageProgress[activeLevel.id]?.bestMoves || null}
                onClear={(moves) => updateStageProgress(activeLevel.id, moves)}
                onExit={() => setScreen('STAGE_SELECT')}
            />
        );
    }

    return null;
}

// --- 画面パーツ ---

const StageSelectScreen: React.FC<{ userData: UserData; onSelect: (id: number) => void; onBack: () => void }> = ({ userData, onSelect, onBack }) => {
    const [page, setPage] = useState(0);
    const stagesPerPage = 10;
    const totalPages = Math.ceil(LEVELS.length / stagesPerPage);

    const stages = LEVELS.slice(page * stagesPerPage, (page + 1) * stagesPerPage);

    return (
        <div className="min-h-screen bg-stone-700 flex flex-col items-center justify-center p-4 select-none touch-none text-white">
            <div className="w-full max-w-md bg-stone-800 rounded-3xl shadow-2xl border border-stone-600 overflow-hidden flex flex-col h-[650px]">
                <div className="p-6 bg-stone-900 border-b border-stone-700 flex justify-between items-center">
                    <h2 className="text-2xl font-black italic uppercase">Stages</h2>
                    <button onClick={onBack} className="w-10 h-10 flex items-center justify-center bg-stone-800 rounded-xl border border-stone-600 text-xl font-bold">×</button>
                </div>

                <div className="flex-1 p-6 relative flex flex-col overflow-hidden">
                    <div className="grid grid-cols-2 grid-rows-5 gap-4 flex-1">
                        {stages.map((level) => {
                            const status = userData.stageProgress[level.id];
                            const medalColor = getMedalColor(status?.bestMoves || null, level.excellentMoves, level.goodMoves);

                            return (
                                <button
                                    key={level.id}
                                    onClick={() => onSelect(level.id)}
                                    className="bg-stone-900 rounded-2xl p-4 border border-stone-700 flex flex-col items-center justify-between hover:border-amber-500 transition-all active:scale-95"
                                >
                                    <div className="flex justify-between w-full items-start">
                                        <span className="text-xl font-black italic text-stone-500">#{level.id + 1}</span>
                                        <HexMedal color={medalColor} size={10} />
                                    </div>

                                    {/* Thumbnail Preview Area */}
                                    <div className="w-full h-16 flex items-center justify-center opacity-40">
                                        <svg viewBox="-40 -40 80 80" className="w-full h-full">
                                            {level.layout.map((p, j) => {
                                                const { x, y } = hexToPixel(p.q, p.r, 12);
                                                const pts = Array.from({ length: 6 }).map((_, k) => {
                                                    const a = (Math.PI / 180) * (60 * k + 30);
                                                    return `${x + 12 * Math.cos(a)},${y + 12 * Math.sin(a)}`;
                                                }).join(' ');
                                                return <polygon key={j} points={pts} fill="#333" stroke="#555" strokeWidth={1} />;
                                            })}
                                        </svg>
                                    </div>

                                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mt-2 truncate w-full text-center">
                                        {level.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {totalPages > 1 && (
                    <div className="p-4 bg-stone-900 flex justify-center gap-4">
                        <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="px-4 py-2 bg-stone-800 rounded-lg disabled:opacity-30">←</button>
                        <span className="flex items-center font-bold text-stone-500 tracking-widest">{page + 1} / {totalPages}</span>
                        <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} className="px-4 py-2 bg-stone-800 rounded-lg disabled:opacity-30">→</button>
                    </div>
                )}
            </div>
        </div>
    );
};

const GameScreen: React.FC<{ level: Level; bestMoves: number | null; onClear: (m: number) => void; onExit: () => void }> = ({ level, bestMoves, onClear, onExit }) => {
    const [board, setBoard] = useState<Piece[]>(() =>
        Object.entries(level.initialBoard).map(([key, p]) => {
            const [q, r] = key.split(',').map(Number);
            return { ...p, q, r };
        })
    );
    const [hand, setHand] = useState<PieceTemplate[]>(level.initialHand);
    const [selectedIdx, setSelectedIdx] = useState<number | null>(hand.length > 0 ? 0 : null);
    const [moves, setMoves] = useState<number>(0);
    const [history, setHistory] = useState<HistoryState[]>([]);
    const [isClear, setIsClear] = useState<boolean>(false);
    const [isPeek, setIsPeek] = useState<boolean>(false);
    const [animating, setAnimating] = useState<boolean>(false);

    const [readySlot, setReadySlot] = useState<OuterSlot | null>(null);
    const [highlightedPaths, setHighlightedPaths] = useState<HighlightedPath[]>([]);
    const [dragState, setDragState] = useState<DragState>({ active: false, currentHex: null });

    const hexSize = 44;

    useEffect(() => {
        if (animating) return;
        const allMatch = level.layout.every(tile => {
            if (!tile.target) return true;
            const p = board.find(p => p.q === tile.q && p.r === tile.r);
            return p && p.color === tile.target.color && p.pattern === tile.target.pattern;
        });
        if (allMatch && moves > 0 && !isClear) {
            setIsClear(true);
            onClear(moves);
        }
    }, [board, animating, moves, level, isClear, onClear]);

    const calculatePath = (startTileQ: number, startTileR: number, edgeIndex: number): PathStep[] => {
        const path: PathStep[] = [];
        let curQ = startTileQ, curR = startTileR, curEdge = edgeIndex;

        while (true) {
            const tile = level.layout.find(t => t.q === curQ && t.r === curR);
            if (!tile) {
                path.push({ q: curQ, r: curR, exit: true });
                break;
            }
            path.push({ q: curQ, r: curR });

            const rail = level.defaultRails.find(r => r.from === curEdge || r.to === curEdge);
            if (!rail) break;

            const exitEdge = rail.from === curEdge ? rail.to : rail.from;
            const pieceOnTile = board.find(p => p.q === curQ && p.r === curR);
            if (!pieceOnTile) break;

            const dir = DIRS[exitEdge];
            curQ += dir.dq;
            curR += dir.dr;
            curEdge = (exitEdge + 3) % 6;
        }
        return path;
    };

    const outerSlots: OuterSlot[] = useMemo(() => {
        const slots: OuterSlot[] = [];
        level.layout.forEach(tile => {
            for (let i = 0; i < 6; i++) {
                const hasRail = level.defaultRails.some(r => r.from === i || r.to === i);
                const neighbor = level.layout.find(t => t.q === tile.q + DIRS[i].dq && t.r === tile.r + DIRS[i].dr);
                if (hasRail && !neighbor) {
                    slots.push({
                        q: tile.q + DIRS[i].dq,
                        r: tile.r + DIRS[i].dr,
                        targetTileQ: tile.q,
                        targetTileR: tile.r,
                        originalEdge: i
                    });
                }
            }
        });
        return slots;
    }, [level]);

    const getPathsForSlot = (slot: OuterSlot): HighlightedPath[] => {
        const relevantEntries = outerSlots.filter(s => s.q === slot.q && s.r === slot.r);
        return relevantEntries.map((s, idx) => ({
            color: PATH_COLORS[idx % PATH_COLORS.length],
            path: calculatePath(s.targetTileQ, s.targetTileR, s.originalEdge),
            originalEdge: s.originalEdge,
            slotEdge: (s.originalEdge + 3) % 6,
            targetTileQ: s.targetTileQ,
            targetTileR: s.targetTileR
        }));
    };

    const findHexAt = (svgX: number, svgY: number): DragState['currentHex'] => {
        let minTarget: DragState['currentHex'] = null;
        let minDist = hexSize;
        level.layout.forEach(tile => {
            const { x, y } = hexToPixel(tile.q, tile.r, hexSize);
            const d = Math.sqrt((x - svgX) ** 2 + (y - svgY) ** 2);
            if (d < minDist) { minDist = d; minTarget = { ...tile, type: 'board' }; }
        });
        outerSlots.forEach(slot => {
            const { x, y } = hexToPixel(slot.q, slot.r, hexSize);
            const d = Math.sqrt((x - svgX) ** 2 + (y - svgY) ** 2);
            if (d < minDist) { minDist = d; minTarget = { ...slot, type: 'slot' }; }
        });
        return minTarget;
    };

    const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
        if (animating || isClear) return;
        const svg = e.currentTarget;
        const pt = svg.createSVGPoint();
        pt.x = e.clientX; pt.y = e.clientY;
        const matrix = svg.getScreenCTM();
        if (!matrix) return;
        const { x: sx, y: sy } = pt.matrixTransform(matrix.inverse());

        const hit = findHexAt(sx, sy);

        if (hit && hit.type === 'slot' && selectedIdx !== null) {
            setReadySlot(hit);
            setHighlightedPaths(getPathsForSlot(hit));
            setDragState({ active: true, currentHex: hit });
        } else if (readySlot && hit && hit.type === 'board') {
            const matchingPath = highlightedPaths.find(hp => hp.targetTileQ === hit.q && hp.targetTileR === hit.r);
            if (matchingPath) {
                handleInsert(matchingPath.targetTileQ, matchingPath.targetTileR, matchingPath.originalEdge);
            }
            setDragState({ active: false, currentHex: null });
        } else {
            setIsPeek(true);
            setDragState({ active: true, currentHex: hit });
        }
    };

    const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
        if (!dragState.active || animating) return;
        const svg = e.currentTarget;
        const pt = svg.createSVGPoint();
        pt.x = e.clientX; pt.y = e.clientY;
        const matrix = svg.getScreenCTM();
        if (!matrix) return;
        const { x: sx, y: sy } = pt.matrixTransform(matrix.inverse());
        const hit = findHexAt(sx, sy);
        if (!hit) return;

        if (readySlot && hit.type === 'board') {
            const matchingPath = highlightedPaths.find(hp => hp.targetTileQ === hit.q && hp.targetTileR === hit.r);
            if (matchingPath) {
                handleInsert(matchingPath.targetTileQ, matchingPath.targetTileR, matchingPath.originalEdge);
                setDragState({ active: false, currentHex: null });
                return;
            }
        }
        setDragState(prev => ({ ...prev, currentHex: hit }));
    };

    const handleInsert = (tileQ: number, tileR: number, edgeIndex: number) => {
        if (selectedIdx === null) return;
        const pieceTemplate = hand[selectedIdx];
        setAnimating(true);
        setReadySlot(null);
        setHighlightedPaths([]);
        setHistory([...history, { board: [...board], hand: [...hand], moves }]);

        const newHand = [...hand];
        newHand.splice(selectedIdx, 1);
        setHand(newHand);
        setSelectedIdx(null);

        const entryDir = DIRS[edgeIndex];
        const startQ = tileQ + entryDir.dq;
        const startR = tileR + entryDir.dr;
        const enteringPiece: Piece = { ...pieceTemplate, q: startQ, r: startR };
        let currentBoard = [...board, enteringPiece];
        setBoard(currentBoard);

        const movesMap: Record<string, { q: number; r: number }> = {};
        let curQ = tileQ, curR = tileR, curEdge = edgeIndex;
        let pushId = enteringPiece.id;
        let ejectedPieceId: string | null = null;

        while (true) {
            const tile = level.layout.find(t => t.q === curQ && t.r === curR);
            if (!tile) { ejectedPieceId = pushId; movesMap[pushId] = { q: curQ, r: curR }; break; }
            movesMap[pushId] = { q: curQ, r: curR };
            const rail = level.defaultRails.find(r => r.from === curEdge || r.to === curEdge);
            if (!rail) break;
            const exitEdge = rail.from === curEdge ? rail.to : rail.from;
            const targetP = currentBoard.find(p => p.q === curQ && p.r === curR && p.id !== pushId);
            if (!targetP) break;
            pushId = targetP.id;
            const dir = DIRS[exitEdge];
            curQ += dir.dq; curR += dir.dr;
            curEdge = (exitEdge + 3) % 6;
        }

        setTimeout(() => {
            setBoard(prev => prev.map(p => movesMap[p.id] ? { ...p, ...movesMap[p.id] } : p));
            setTimeout(() => {
                if (ejectedPieceId) {
                    const id = ejectedPieceId;
                    const p = currentBoard.find(x => x.id === id);
                    if (p) {
                        setHand(prev => [...prev, { id: p.id, color: p.color, pattern: p.pattern }]);
                        setBoard(prev => prev.filter(x => x.id !== id));
                    }
                }
                setMoves(m => m + 1);
                setAnimating(false);
                setHand(currentHand => {
                    if (currentHand.length > 0) setSelectedIdx(0);
                    return currentHand;
                });
            }, 400);
        }, 50);
    };

    const handlePointerUp = () => {
        setIsPeek(false);
        setDragState({ active: false, currentHex: null });
    };

    const undo = () => {
        if (history.length === 0 || animating) return;
        const last = history[history.length - 1];
        setBoard(last.board); setHand(last.hand); setMoves(last.moves);
        setHistory(history.slice(0, -1));
        setIsClear(false); setReadySlot(null); setHighlightedPaths([]);
    };

    const currentMedalColor = getMedalColor(bestMoves, level.excellentMoves, level.goodMoves);

    return (
        <div className="min-h-screen bg-stone-700 flex flex-col items-center justify-center p-4 select-none touch-none">
            <div className="w-full max-w-md bg-stone-800 rounded-3xl shadow-2xl border border-stone-600 overflow-hidden flex flex-col">
                <div className="p-5 bg-stone-900 flex justify-between items-center border-b border-stone-700 text-white">
                    <div className="flex items-center gap-3">
                        <button onClick={onExit} className="w-10 h-10 flex items-center justify-center bg-stone-800 rounded-xl border border-stone-600 hover:border-amber-500 transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M15 18l-6-6 6-6" /></svg>
                        </button>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-black italic tracking-tighter uppercase leading-none">#{level.id + 1}</h1>
                            <span className="text-[10px] text-stone-500 font-bold uppercase tracking-widest">{level.name}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <HexMedal color={currentMedalColor} size={12} />
                        <div className="text-right">
                            <p className="text-[9px] text-stone-500 font-bold uppercase">Moves</p>
                            <p className="text-2xl font-mono font-black">{moves}</p>
                        </div>
                        <button onClick={undo} disabled={history.length === 0 || animating} className="w-10 h-10 flex items-center justify-center bg-stone-800 hover:bg-stone-700 rounded-xl border border-stone-600 active:scale-90 transition-all disabled:opacity-30">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 10h10a8 8 0 0 1 8 8v2M3 10l6-6m-6 6l6 6" /></svg>
                        </button>
                    </div>
                </div>

                <div className="relative h-[380px] bg-stone-800 flex items-center justify-center overflow-visible">
                    <svg viewBox="-165 -180 330 360" className="w-full h-full" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
                        <defs>
                            <radialGradient id="gloss" cx="30%" cy="30%" r="50%">
                                <stop offset="0%" stopColor="white" />
                                <stop offset="100%" stopColor="transparent" />
                            </radialGradient>
                        </defs>

                        {level.layout.map((tile, i) => {
                            const { x, y } = hexToPixel(tile.q, tile.r, hexSize);
                            const points = Array.from({ length: 6 }).map((_, j) => {
                                const corner = getHexCorner(x, y, hexSize, j);
                                return `${corner.x},${corner.y}`;
                            }).join(' ');
                            const activePath = highlightedPaths.find(hp => hp.path.some(p => p.q === tile.q && p.r === tile.r));
                            return (
                                <g key={`tile-${i}`}>
                                    <polygon points={points} fill="#382c22" stroke={activePath ? activePath.color : "#282018"} strokeWidth={activePath ? 3 : 1} />
                                    {level.defaultRails.map((r, j) => {
                                        const m1 = getEdgeInfo(x, y, hexSize, r.from);
                                        const m2 = getEdgeInfo(x, y, hexSize, r.to);
                                        return (
                                            <g key={`rail-${j}`} stroke="#1a120b" strokeWidth="1" opacity={isPeek ? 0.3 : 1}>
                                                <line x1={m1.x} y1={m1.y} x2={x} y2={y} />
                                                <line x1={x} y1={y} x2={m2.x} y2={m2.y} />
                                            </g>
                                        );
                                    })}
                                    {tile.target && <Piece piece={{ id: `target-${i}`, color: tile.target.color, pattern: tile.target.pattern }} x={x} y={y} size={hexSize} isTarget={true} />}
                                </g>
                            );
                        })}

                        {outerSlots.map((slot, i) => {
                            const { x, y } = hexToPixel(slot.q, slot.r, hexSize);
                            const isReady = readySlot && readySlot.q === slot.q && readySlot.r === slot.r;
                            return (
                                <g key={`slot-${i}`}>
                                    <polygon
                                        points={Array.from({ length: 6 }).map((_, j) => {
                                            const c = getHexCorner(x, y, hexSize, j);
                                            return `${c.x},${c.y}`;
                                        }).join(' ')}
                                        fill="transparent"
                                        stroke={isReady ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)"}
                                        strokeWidth={1}
                                        strokeDasharray={isReady ? "none" : "3 3"}
                                    />
                                    {Array.from({ length: 6 }).map((_, edgeIdx) => {
                                        const hp = highlightedPaths.find(p => p.targetTileQ === slot.targetTileQ && p.targetTileR === slot.targetTileR && p.originalEdge === slot.originalEdge && p.slotEdge === (edgeIdx + 2) % 6);
                                        const p1 = getHexCorner(x, y, hexSize, edgeIdx);
                                        const p2 = getHexCorner(x, y, hexSize, (edgeIdx + 1) % 6);
                                        const info = getEdgeInfo(x, y, hexSize, edgeIdx);
                                        return (
                                            <g key={`edge-${edgeIdx}`}>
                                                <line
                                                    x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                                                    stroke={hp ? hp.color : (isReady ? "rgba(255,255,255,0.4)" : "transparent")}
                                                    strokeWidth={hp ? 4 : 1}
                                                />
                                                {hp && (
                                                    <path
                                                        d="M-5,4 L5,4 L0,-6 Z"
                                                        fill={hp.color}
                                                        stroke="white"
                                                        strokeWidth="1"
                                                        className=""
                                                        transform={`translate(${info.x}, ${info.y}) rotate(${info.angle + 90})`}
                                                    />
                                                )}
                                            </g>
                                        );
                                    })}
                                    {isReady && selectedIdx !== null && (
                                        <Piece piece={hand[selectedIdx]} x={x} y={y} size={hexSize} />
                                    )}
                                </g>
                            );
                        })}

                        {board.map(p => {
                            const { x, y } = hexToPixel(p.q, p.r, hexSize);
                            return <Piece key={p.id} piece={p} x={x} y={y} size={hexSize} isPeek={isPeek} />;
                        })}
                    </svg>
                    {isClear && (
                        <div className="absolute inset-0 bg-stone-900/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500 z-50">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-4">MISSION CLEAR</h2>
                            <div className="flex flex-col items-center gap-2 mb-8">
                                <HexMedal color={getMedalColor(moves, level.excellentMoves, level.goodMoves)} size={30} />
                                <span className="text-amber-500 font-black text-xl italic uppercase tracking-widest">
                                    {moves <= level.excellentMoves ? 'EXCELLENT!' : moves <= level.goodMoves ? 'GOOD!' : 'CLEARED'}
                                </span>
                            </div>
                            <button onClick={onExit} className="px-12 py-4 bg-amber-500 text-black font-black rounded-2xl active:scale-95 transition-transform uppercase italic">NEXT LEVEL</button>
                        </div>
                    )}
                </div>

                <div
                    className="p-6 bg-stone-900 border-t border-stone-800 flex justify-center gap-5 cursor-pointer h-28"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setReadySlot(null);
                            setHighlightedPaths([]);
                            setSelectedIdx(null);
                        }
                    }}
                >
                    {hand.map((p, i) => (
                        <button
                            key={p.id}
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedIdx(selectedIdx === i ? null : i);
                            }}
                            className={`w-16 h-16 rounded-2xl border-2 transition-all flex items-center justify-center ${selectedIdx === i ? 'bg-stone-800 border-amber-500 ring-4 ring-amber-500/20' : 'bg-stone-800 border-stone-700'}`}
                        >
                            <svg viewBox="-25 -25 50 50" className="w-12 h-12 pointer-events-none">
                                <Piece piece={p} x={0} y={0} size={25} />
                            </svg>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
