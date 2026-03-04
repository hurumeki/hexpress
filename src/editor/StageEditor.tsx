import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { Level, Tile } from '../types';
import { COLORS, DIRS } from '../constants';
import { hexToPixel, getHexCorner, getEdgeInfo, getPatternFromColor } from '../utils';
import PieceSvg from '../components/PieceSvg';
import GameScreen from '../screens/GameScreen';
import { solve } from './solver';

// --- 型・定数 ---
type EditMode = 'BOARD' | 'GOAL' | 'PIECES' | 'RAILS' | 'HAND' | 'PLAY';

const COLOR_OPTIONS = [
    { color: COLORS.wood, name: 'Wood' },
    { color: COLORS.stone, name: 'Stone' },
    { color: COLORS.grass, name: 'Grass' },
    { color: COLORS.gold, name: 'Gold' },
    { color: COLORS.ink, name: 'Ink' },
];
const GOAL_CYCLE = [null, ...COLOR_OPTIONS.map(c => c.color)];
const PIECE_CYCLE = [null, ...COLOR_OPTIONS.map(c => c.color), COLORS.neutral];

const DEFAULT_LEVEL: Level = {
    id: -1,
    name: 'New Stage',
    excellentMoves: 5,
    goodMoves: 10,
    layout: [],
    defaultRails: [],
    initialBoard: {},
    initialHand: [],
};

const EDGE_NAMES = ['右上', '右', '右下', '左下', '左', '左上'];

// --- ヘルパー ---
const makePieceId = (q: number, r: number) => `p_${q}_${r}_${Date.now()}`;
const makeHandId = (color: string, idx: number) => `h_${color}_${idx}_${Date.now()}`;

// SVGクリック座標変換
const getSvgCoords = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const m = svg.getScreenCTM();
    if (!m) return null;
    return pt.matrixTransform(m.inverse());
};

// ghost hexes: 既存タイルの隣で、まだタイルがない座標
function computeGhostHexes(layout: Tile[]): { q: number; r: number }[] {
    if (layout.length === 0) return [{ q: 0, r: 0 }];
    const tileSet = new Set(layout.map(t => `${t.q},${t.r}`));
    const ghosts: { q: number; r: number }[] = [];
    layout.forEach(tile => {
        DIRS.forEach(dir => {
            const nq = tile.q + dir.dq, nr = tile.r + dir.dr;
            const key = `${nq},${nr}`;
            if (!tileSet.has(key) && !ghosts.find(g => g.q === nq && g.r === nr)) {
                ghosts.push({ q: nq, r: nr });
            }
        });
    });
    return ghosts;
}

// viewBox計算
function computeViewBox(layout: Tile[], ghosts: { q: number; r: number }[], hexSize: number): string {
    const all = [...layout, ...ghosts];
    if (all.length === 0) return `-150 -150 300 300`;
    const pixels = all.map(t => hexToPixel(t.q, t.r, hexSize));
    const pad = hexSize * 2;
    const minX = Math.min(...pixels.map(p => p.x)) - pad;
    const maxX = Math.max(...pixels.map(p => p.x)) + pad;
    const minY = Math.min(...pixels.map(p => p.y)) - pad;
    const maxY = Math.max(...pixels.map(p => p.y)) + pad;
    return `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;
}

// --- メインコンポーネント ---
function StageEditor() {
    const [levelData, setLevelData] = useState<Level>(DEFAULT_LEVEL);
    const [editMode, setEditMode] = useState<EditMode>('BOARD');
    const [jsonText, setJsonText] = useState(() => JSON.stringify(DEFAULT_LEVEL, null, 2));
    const [jsonError, setJsonError] = useState<string | null>(null);
    const [solving, setSolving] = useState(false);
    const [solverResult, setSolverResult] = useState<number | null | 'none'>(null);
    const [newRailFrom, setNewRailFrom] = useState(0);
    const [newRailTo, setNewRailTo] = useState(3);
    const [playKey, setPlayKey] = useState(0);
    const jsonSourceRef = useRef<'ui' | 'json'>('ui');

    const hexSize = 44;
    const { layout } = levelData;
    const ghostHexes = useMemo(() => editMode === 'BOARD' ? computeGhostHexes(layout) : [], [layout, editMode]);
    const viewBox = useMemo(() => computeViewBox(layout, ghostHexes, hexSize), [layout, ghostHexes]);

    // Level → JSON 同期
    useEffect(() => {
        if (jsonSourceRef.current === 'ui') {
            setJsonText(JSON.stringify(levelData, null, 2));
        }
        jsonSourceRef.current = 'ui';
    }, [levelData]);

    const handleJsonChange = (text: string) => {
        setJsonText(text);
        try {
            const parsed = JSON.parse(text) as Level;
            jsonSourceRef.current = 'json';
            setLevelData(parsed);
            setJsonError(null);
        } catch {
            setJsonError('JSON が不正です');
        }
    };

    const handleSolve = () => {
        setSolving(true);
        setSolverResult(null);
        setTimeout(() => {
            const result = solve(levelData);
            setSolverResult(result === null ? 'none' : result);
            setSolving(false);
        }, 0);
    };

    // --- SVGクリックハンドラ ---
    const findNearestHex = (sx: number, sy: number, includeGhosts: boolean) => {
        let nearest: { q: number; r: number; isGhost: boolean } | null = null;
        let minDist = hexSize * 0.9;
        const check = (q: number, r: number, isGhost: boolean) => {
            const { x, y } = hexToPixel(q, r, hexSize);
            const d = Math.sqrt((x - sx) ** 2 + (y - sy) ** 2);
            if (d < minDist) { minDist = d; nearest = { q, r, isGhost }; }
        };
        layout.forEach(t => check(t.q, t.r, false));
        if (includeGhosts) ghostHexes.forEach(g => check(g.q, g.r, true));
        return nearest;
    };

    const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
        const coords = getSvgCoords(e);
        if (!coords) return;
        const hit = findNearestHex(coords.x, coords.y, editMode === 'BOARD');
        if (!hit) return;
        const { q: hq, r: hr, isGhost } = hit;

        if (editMode === 'BOARD') {
            if (isGhost) {
                setLevelData(prev => ({ ...prev, layout: [...prev.layout, { q: hq, r: hr, target: null }] }));
            } else {
                setLevelData(prev => {
                    const key = `${hq},${hr}`;
                    const nb = { ...prev.initialBoard };
                    delete nb[key];
                    return {
                        ...prev,
                        layout: prev.layout.filter(t => t.q !== hq || t.r !== hr),
                        initialBoard: nb,
                    };
                });
            }
        } else if (editMode === 'GOAL' && !isGhost) {
            setLevelData(prev => {
                const current = prev.layout.find(t => t.q === hq && t.r === hr)?.target?.color ?? null;
                const idx = GOAL_CYCLE.indexOf(current);
                const next = GOAL_CYCLE[(idx + 1) % GOAL_CYCLE.length];
                return {
                    ...prev,
                    layout: prev.layout.map(t =>
                        t.q === hq && t.r === hr
                            ? { ...t, target: next ? { color: next, pattern: getPatternFromColor(next) } : null }
                            : t
                    ),
                };
            });
        } else if (editMode === 'PIECES' && !isGhost) {
            setLevelData(prev => {
                const key = `${hq},${hr}`;
                const current = prev.initialBoard[key]?.color ?? null;
                const idx = PIECE_CYCLE.indexOf(current);
                const next = PIECE_CYCLE[(idx + 1) % PIECE_CYCLE.length];
                const nb = { ...prev.initialBoard };
                if (next === null) {
                    delete nb[key];
                } else {
                    nb[key] = { id: makePieceId(hq, hr), color: next, pattern: getPatternFromColor(next) };
                }
                return { ...prev, initialBoard: nb };
            });
        }
    };

    // コーナーポイント
    const hexPoints = (x: number, y: number) =>
        Array.from({ length: 6 }).map((_, j) => {
            const c = getHexCorner(x, y, hexSize, j);
            return `${c.x},${c.y}`;
        }).join(' ');

    // --- PLAY モード ---
    if (editMode === 'PLAY') {
        return (
            <GameScreen
                key={playKey}
                level={{ ...levelData, id: 0 }}
                bestMoves={null}
                onClear={() => { }}
                onExit={() => setEditMode('BOARD')}
            />
        );
    }

    const modeTabs: { mode: EditMode; label: string }[] = [
        { mode: 'BOARD', label: '盤面' },
        { mode: 'GOAL', label: 'ゴール' },
        { mode: 'PIECES', label: '初期駒' },
        { mode: 'RAILS', label: 'レール' },
        { mode: 'HAND', label: '手持ち' },
    ];

    return (
        <div className="min-h-screen bg-stone-900 text-white p-4 select-none">
            {/* ヘッダー */}
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-black italic uppercase tracking-tighter">Stage Editor</h1>
                <button
                    onClick={() => { setPlayKey(k => k + 1); setEditMode('PLAY'); }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-black font-black rounded-xl active:scale-95 transition-transform uppercase italic"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                    Play
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
                {/* === 左カラム: 盤面 === */}
                <div className="flex-1 flex flex-col gap-3">
                    {/* モードタブ */}
                    <div className="flex gap-1 bg-stone-800 rounded-xl p-1">
                        {modeTabs.map(({ mode, label }) => (
                            <button
                                key={mode}
                                onClick={() => setEditMode(mode)}
                                className={`flex-1 py-2 text-xs font-black rounded-lg uppercase transition-all ${editMode === mode ? 'bg-amber-500 text-black' : 'text-stone-400 hover:text-white'}`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* モードの説明 */}
                    <div className="text-xs text-stone-500 font-bold">
                        {editMode === 'BOARD' && '● クリックでタイル追加、既存タイルクリックで削除'}
                        {editMode === 'GOAL' && '● タイルクリックでゴール駒をサイクル変更（なし→Wood→Stone→…）'}
                        {editMode === 'PIECES' && '● タイルクリックで初期配置駒をサイクル変更（なし→Wood→…）'}
                        {editMode === 'RAILS' && '● 右パネルでレールを追加・削除'}
                        {editMode === 'HAND' && '● 下パネルで手持ち駒を管理'}
                    </div>

                    {/* SVGキャンバス */}
                    <div className="bg-stone-800 rounded-2xl overflow-hidden border border-stone-700" style={{ minHeight: 360 }}>
                        <svg
                            viewBox={viewBox}
                            className="w-full"
                            style={{ minHeight: 360 }}
                            onClick={handleSvgClick}
                        >
                            <defs>
                                <radialGradient id="gloss" cx="30%" cy="30%" r="50%">
                                    <stop offset="0%" stopColor="white" />
                                    <stop offset="100%" stopColor="transparent" />
                                </radialGradient>
                            </defs>

                            {/* Ghost hexes (BOARD mode) */}
                            {editMode === 'BOARD' && ghostHexes.map((g, i) => {
                                const { x, y } = hexToPixel(g.q, g.r, hexSize);
                                return (
                                    <polygon key={`ghost-${i}`} points={hexPoints(x, y)}
                                        fill="transparent" stroke="rgba(255,255,255,0.12)"
                                        strokeWidth={1.5} strokeDasharray="4 3" />
                                );
                            })}

                            {/* タイル */}
                            {layout.map((tile, i) => {
                                const { x, y } = hexToPixel(tile.q, tile.r, hexSize);
                                const pts = hexPoints(x, y);
                                const piece = levelData.initialBoard[`${tile.q},${tile.r}`];

                                return (
                                    <g key={`tile-${i}`}>
                                        <polygon points={pts} fill="#382c22" stroke="#282018" strokeWidth={1} />

                                        {/* レール */}
                                        {levelData.defaultRails.map((r, j) => {
                                            const m1 = getEdgeInfo(x, y, hexSize, r.from);
                                            const m2 = getEdgeInfo(x, y, hexSize, r.to);
                                            return (
                                                <g key={`rail-${j}`} stroke="#6b4c2a" strokeWidth="2">
                                                    <line x1={m1.x} y1={m1.y} x2={x} y2={y} />
                                                    <line x1={x} y1={y} x2={m2.x} y2={m2.y} />
                                                </g>
                                            );
                                        })}

                                        {/* 座標ラベル (BOARD mode) */}
                                        {editMode === 'BOARD' && (
                                            <text x={x} y={y + 4} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize={hexSize * 0.22} fontFamily="monospace">
                                                {tile.q},{tile.r}
                                            </text>
                                        )}

                                        {/* ゴール */}
                                        {tile.target && (
                                            <PieceSvg piece={{ id: `tgt-${i}`, ...tile.target }} x={x} y={y} size={hexSize} isTarget />
                                        )}

                                        {/* 初期配置駒 */}
                                        {piece && (
                                            <PieceSvg piece={piece} x={x} y={y} size={hexSize} />
                                        )}
                                    </g>
                                );
                            })}
                        </svg>
                    </div>

                    {/* 手持ちエリア */}
                    <div className="bg-stone-800 rounded-2xl border border-stone-700 p-4">
                        <div className="text-xs font-black uppercase text-stone-400 mb-3">手持ち駒</div>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {levelData.initialHand.map((p, i) => (
                                <div key={p.id} className="flex flex-col items-center gap-1">
                                    <div className="relative w-12 h-12 bg-stone-900 rounded-xl border border-stone-700 flex items-center justify-center">
                                        <svg viewBox="-22 -22 44 44" className="w-10 h-10 pointer-events-none">
                                            <PieceSvg piece={p} x={0} y={0} size={22} />
                                        </svg>
                                        <button
                                            onClick={() => setLevelData(prev => ({
                                                ...prev,
                                                initialHand: prev.initialHand.filter((_, idx) => idx !== i)
                                            }))}
                                            className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-600 rounded-full text-[9px] font-black flex items-center justify-center leading-none"
                                        >×</button>
                                    </div>
                                    <span className="text-[9px] text-stone-500">{p.color === COLORS.neutral ? 'Neutral' : COLOR_OPTIONS.find(c => c.color === p.color)?.name ?? '?'}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {[...COLOR_OPTIONS, { color: COLORS.neutral, name: 'Neutral' }].map(({ color, name }) => (
                                <button
                                    key={color}
                                    onClick={() => setLevelData(prev => ({
                                        ...prev,
                                        initialHand: [...prev.initialHand, {
                                            id: makeHandId(color, prev.initialHand.length),
                                            color,
                                            pattern: getPatternFromColor(color)
                                        }]
                                    }))}
                                    className="px-2 py-1 text-xs font-bold rounded-lg border border-stone-600 bg-stone-700 hover:border-amber-500 transition-colors"
                                    style={{ borderColor: color }}
                                >
                                    +{name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* === 右カラム: 設定パネル === */}
                <div className="w-full lg:w-80 flex flex-col gap-4">
                    {/* ステージ設定 */}
                    <div className="bg-stone-800 rounded-2xl border border-stone-700 p-4 flex flex-col gap-4">
                        <div className="text-xs font-black uppercase text-stone-400">ステージ設定</div>

                        <div>
                            <label className="text-xs text-stone-400 font-bold block mb-1">ステージ名</label>
                            <input
                                type="text"
                                value={levelData.name}
                                onChange={e => setLevelData(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full bg-stone-900 border border-stone-600 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:border-amber-500 transition-colors"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs text-stone-400 font-bold block mb-1">Excellent 手数</label>
                                <input
                                    type="number" min={1}
                                    value={levelData.excellentMoves}
                                    onChange={e => setLevelData(prev => ({ ...prev, excellentMoves: Number(e.target.value) }))}
                                    className="w-full bg-stone-900 border border-stone-600 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:border-amber-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-stone-400 font-bold block mb-1">Good 手数</label>
                                <input
                                    type="number" min={1}
                                    value={levelData.goodMoves}
                                    onChange={e => setLevelData(prev => ({ ...prev, goodMoves: Number(e.target.value) }))}
                                    className="w-full bg-stone-900 border border-stone-600 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:border-amber-500 transition-colors"
                                />
                            </div>
                        </div>

                        {/* ソルバー */}
                        <div className="pt-2 border-t border-stone-700">
                            <button
                                onClick={handleSolve}
                                disabled={solving}
                                className="w-full py-2.5 bg-stone-700 border border-stone-600 rounded-xl text-sm font-black uppercase hover:border-amber-500 transition-colors disabled:opacity-50"
                            >
                                {solving ? '解析中…' : '自動ソルバー'}
                            </button>
                            {solverResult !== null && (
                                <div className={`mt-2 text-center text-sm font-bold rounded-lg py-2 ${solverResult === 'none' ? 'bg-red-900/30 text-red-300 border border-red-800'
                                    : 'bg-emerald-900/30 text-emerald-300 border border-emerald-800'
                                    }`}>
                                    {solverResult === 'none' ? '解なし（21手以上または探索限界）'
                                        : `最小手数: ${solverResult} 手`}
                                </div>
                            )}
                            {solverResult !== null && solverResult !== 'none' && (
                                <button
                                    onClick={() => setLevelData(prev => ({
                                        ...prev,
                                        excellentMoves: solverResult as number,
                                        goodMoves: Math.ceil((solverResult as number) * 1.8)
                                    }))}
                                    className="mt-2 w-full py-2 text-xs font-black uppercase bg-emerald-700/30 border border-emerald-700 rounded-xl hover:bg-emerald-700/50 transition-colors"
                                >
                                    手数設定に反映
                                </button>
                            )}
                        </div>
                    </div>

                    {/* レール設定 */}
                    <div className="bg-stone-800 rounded-2xl border border-stone-700 p-4 flex flex-col gap-3">
                        <div className="text-xs font-black uppercase text-stone-400">レール設定</div>
                        <div className="text-xs text-stone-500 leading-relaxed">0:右上 1:右 2:右下 3:左下 4:左 5:左上</div>

                        {/* 現在のレール一覧 */}
                        {levelData.defaultRails.length === 0 && (
                            <div className="text-xs text-stone-600 italic">レールなし</div>
                        )}
                        {levelData.defaultRails.map((rail, i) => (
                            <div key={i} className="flex items-center justify-between bg-stone-900 rounded-xl px-3 py-2">
                                <span className="text-sm font-bold">
                                    {EDGE_NAMES[rail.from]} ({rail.from}) ↔ {EDGE_NAMES[rail.to]} ({rail.to})
                                </span>
                                <button
                                    onClick={() => setLevelData(prev => ({
                                        ...prev,
                                        defaultRails: prev.defaultRails.filter((_, idx) => idx !== i)
                                    }))}
                                    className="text-red-400 font-bold text-sm w-6 h-6 flex items-center justify-center hover:bg-red-900/30 rounded-lg transition-colors"
                                >×</button>
                            </div>
                        ))}

                        {/* レール追加 */}
                        <div className="flex gap-2 items-end">
                            <div className="flex-1">
                                <label className="text-xs text-stone-400 block mb-1">From</label>
                                <select value={newRailFrom} onChange={e => setNewRailFrom(Number(e.target.value))}
                                    className="w-full bg-stone-900 border border-stone-600 rounded-lg px-2 py-1.5 text-sm font-bold focus:outline-none">
                                    {[0, 1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}: {EDGE_NAMES[n]}</option>)}
                                </select>
                            </div>
                            <div className="flex-1">
                                <label className="text-xs text-stone-400 block mb-1">To</label>
                                <select value={newRailTo} onChange={e => setNewRailTo(Number(e.target.value))}
                                    className="w-full bg-stone-900 border border-stone-600 rounded-lg px-2 py-1.5 text-sm font-bold focus:outline-none">
                                    {[0, 1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}: {EDGE_NAMES[n]}</option>)}
                                </select>
                            </div>
                            <button
                                onClick={() => {
                                    if (newRailFrom === newRailTo) return;
                                    if (levelData.defaultRails.some(r => (r.from === newRailFrom && r.to === newRailTo) || (r.from === newRailTo && r.to === newRailFrom))) return;
                                    setLevelData(prev => ({ ...prev, defaultRails: [...prev.defaultRails, { from: newRailFrom, to: newRailTo }] }));
                                }}
                                className="px-3 py-1.5 bg-amber-500 text-black font-black rounded-lg text-sm hover:bg-amber-400 transition-colors"
                            >追加</button>
                        </div>
                    </div>

                    {/* Level JSON */}
                    <div className="bg-stone-800 rounded-2xl border border-stone-700 p-4 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <div className="text-xs font-black uppercase text-stone-400">Level JSON</div>
                            {jsonError && <span className="text-xs text-red-400 font-bold">{jsonError}</span>}
                        </div>
                        <textarea
                            value={jsonText}
                            onChange={e => handleJsonChange(e.target.value)}
                            spellCheck={false}
                            className={`w-full h-64 bg-stone-900 rounded-xl p-3 text-xs font-mono resize-y focus:outline-none border transition-colors ${jsonError ? 'border-red-600' : 'border-stone-600 focus:border-amber-500'}`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StageEditor;
