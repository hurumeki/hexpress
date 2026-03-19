import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { Level, Tile, Rail } from '../types';
import { DIRS, PATTERNS, RAILS_3WAY } from '../constants';
import { LEVELS } from '../levels/levels';
import { hexToPixel, getHexCorner, getEdgeInfo, getBoardBoundingBox } from '../utils';
import PieceSvg from '../components/PieceSvg';
import GameScreen from '../screens/GameScreen';
import { solve, type SolveResult } from './solver';

// --- 型・定数 ---
type EditMode = 'BOARD' | 'GOAL' | 'PIECES' | 'RAILS' | 'HAND' | 'PLAY';

const PATTERN_OPTIONS = [
    { pattern: PATTERNS.CIRCLE, name: 'Circle' },
    { pattern: PATTERNS.SQUARE, name: 'Square' },
    { pattern: PATTERNS.DIAMOND, name: 'Diamond' },
    { pattern: PATTERNS.LINES, name: 'Lines' },
    { pattern: PATTERNS.DOT, name: 'Dot' },
];
const GOAL_CYCLE = [null, ...PATTERN_OPTIONS.map(p => p.pattern)];
const PIECE_CYCLE = [null, PATTERNS.NONE, ...PATTERN_OPTIONS.map(p => p.pattern)];
const EDGE_NAMES = ['右上(0)', '右(1)', '右下(2)', '左下(3)', '左(4)', '左上(5)'];

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

const makePieceId = (q: number, r: number) => `p_${q}_${r}_${Date.now()}`;
const makeHandId = (pattern: string, idx: number) => `h_${pattern}_${idx}_${Date.now()}`;

const getSvgCoords = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const m = svg.getScreenCTM();
    if (!m) return null;
    return pt.matrixTransform(m.inverse());
};

function computeGhostHexes(layout: Tile[]): { q: number; r: number }[] {
    if (layout.length === 0) return [{ q: 0, r: 0 }];
    const tileSet = new Set(layout.map(t => `${t.q},${t.r}`));
    const ghosts: { q: number; r: number }[] = [];
    layout.forEach(tile => {
        DIRS.forEach(dir => {
            const nq = tile.q + dir.dq, nr = tile.r + dir.dr;
            if (!tileSet.has(`${nq},${nr}`) && !ghosts.find(g => g.q === nq && g.r === nr))
                ghosts.push({ q: nq, r: nr });
        });
    });
    return ghosts;
}

// --- メインコンポーネント ---
function StageEditor() {
    const [levelData, setLevelData] = useState<Level>(DEFAULT_LEVEL);
    const [editMode, setEditMode] = useState<EditMode>('BOARD');
    const [jsonText, setJsonText] = useState(() => JSON.stringify(DEFAULT_LEVEL, null, 2));
    const [jsonError, setJsonError] = useState<string | null>(null);
    const [solving, setSolving] = useState(false);
    const [solverResult, setSolverResult] = useState<SolveResult | null | 'none'>(null);
    const [highlightedSlot, setHighlightedSlot] = useState<{ q: number; r: number; edge: number } | null>(null);
    const [selectedTile, setSelectedTile] = useState<{ q: number; r: number } | null>(null);
    const [firstEdge, setFirstEdge] = useState<number | null>(null);
    const [newRailFrom, setNewRailFrom] = useState(0);
    const [newRailTo, setNewRailTo] = useState(3);
    const [playKey, setPlayKey] = useState(0);
    const [zoom, setZoom] = useState(1.0);
    const jsonSourceRef = useRef<'ui' | 'json'>('ui');

    const hexSize = 44;
    const { layout } = levelData;
    const ghostHexes = useMemo(() => editMode === 'BOARD' ? computeGhostHexes(layout) : [], [layout, editMode]);

    const boardBox = useMemo(() => {
        const allHexes = [...layout, ...ghostHexes];
        const base = getBoardBoundingBox(allHexes, hexSize, 40);
        const centerX = base.x + base.width / 2;
        const centerY = base.y + base.height / 2;
        const w = base.width / zoom;
        const h = base.height / zoom;
        return {
            viewBox: `${centerX - w / 2} ${centerY - h / 2} ${w} ${h}`
        };
    }, [layout, ghostHexes, zoom]);

    // selectedTile の rails
    const selectedTileData = selectedTile
        ? layout.find(t => t.q === selectedTile.q && t.r === selectedTile.r)
        : null;
    const selectedRails: Rail[] = selectedTileData?.rails ?? levelData.defaultRails ?? [];

    // Level → JSON 同期
    useEffect(() => {
        if (jsonSourceRef.current === 'ui') setJsonText(JSON.stringify(levelData, null, 2));
        jsonSourceRef.current = 'ui';
    }, [levelData]);

    const handleLoadLevel = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = Number(e.target.value);
        const selected = LEVELS.find(l => l.id === id);
        if (selected) {
            jsonSourceRef.current = 'json'; // JSONとして扱うことで useEffect による JSON 同期を誘発
            setLevelData(selected);
            if (selected.solution) {
                setSolverResult({ moves: selected.solution.length, sequence: selected.solution });
            } else if (selected.solution === null) {
                setSolverResult('none');
            } else {
                setSolverResult(null);
            }
            setSelectedTile(null);
            setHighlightedSlot(null);
        }
    };

    const handleJsonChange = (text: string) => {
        setJsonText(text);
        try {
            const parsed = JSON.parse(text) as Level;
            jsonSourceRef.current = 'json';
            setLevelData(parsed);
            
            // JSON読み込み時にsolutionがあればUIに反映
            if (parsed.solution) {
                setSolverResult({ moves: parsed.solution.length, sequence: parsed.solution });
            } else if (parsed.solution === null) {
                setSolverResult('none');
            } else {
                setSolverResult(null);
            }
            setJsonError(null);
        } catch { setJsonError('JSON が不正です'); }
    };

    const handleSolve = () => {
        setSolving(true); setSolverResult(null);
        setTimeout(() => {
            const result = solve(levelData);
            setSolverResult(result || 'none');
            setSolving(false);
        }, 0);
    };

    // SVG ヒットテスト
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

        if (!hit) {
            if (editMode === 'RAILS') {
                setSelectedTile(null);
                setFirstEdge(null);
            }
            return;
        }
        const { q: hq, r: hr, isGhost } = hit;

        if (editMode === 'BOARD') {
            if (isGhost) {
                setLevelData(prev => ({ ...prev, layout: [...prev.layout, { q: hq, r: hr, target: null, rails: RAILS_3WAY }] }));
            } else {
                setLevelData(prev => {
                    const key = `${hq},${hr}`;
                    const nb = { ...prev.initialBoard }; delete nb[key];
                    return { ...prev, layout: prev.layout.filter(t => t.q !== hq || t.r !== hr), initialBoard: nb };
                });
                if (selectedTile?.q === hq && selectedTile?.r === hr) setSelectedTile(null);
            }
        } else if (editMode === 'GOAL' && !isGhost) {
            setLevelData(prev => {
                const current = prev.layout.find(t => t.q === hq && t.r === hr)?.target?.pattern ?? null;
                const idx = GOAL_CYCLE.indexOf(current as any);
                const next = GOAL_CYCLE[(idx + 1) % GOAL_CYCLE.length];
                return {
                    ...prev,
                    layout: prev.layout.map(t =>
                        t.q === hq && t.r === hr
                            ? { ...t, target: next ? { pattern: next } : null }
                            : t
                    ),
                };
            });
        } else if (editMode === 'PIECES' && !isGhost) {
            setLevelData(prev => {
                const key = `${hq},${hr}`;
                const current = prev.initialBoard[key]?.pattern ?? null;
                const idx = PIECE_CYCLE.indexOf(current as any);
                const next = PIECE_CYCLE[(idx + 1) % PIECE_CYCLE.length];
                const nb = { ...prev.initialBoard };
                if (next === null) { delete nb[key]; }
                else { nb[key] = { id: makePieceId(hq, hr), pattern: next }; }
                return { ...prev, initialBoard: nb };
            });
        } else if (editMode === 'RAILS' && !isGhost) {
            setSelectedTile({ q: hq, r: hr });
            setFirstEdge(null); // タイル選択時は辺選択をリセット
        }
    };

    // タイル別レール操作
    const toggleRail = (q: number, r: number, from: number, to: number) => {
        setLevelData(prev => ({
            ...prev,
            layout: prev.layout.map(t => {
                if (t.q !== q || t.r !== r) return t;
                const rails = t.rails ?? prev.defaultRails ?? [];
                // 既存のレールがあるかチェック(双方向)
                const existingIdx = rails.findIndex(rail =>
                    (rail.from === from && rail.to === to) || (rail.from === to && rail.to === from)
                );

                if (existingIdx !== -1) {
                    // 削除
                    const nextRails = [...rails];
                    nextRails.splice(existingIdx, 1);
                    return { ...t, rails: nextRails };
                } else {
                    // 追加
                    return { ...t, rails: [...rails, { from, to }] };
                }
            }),
        }));
    };

    const addRailToSelected = () => {
        if (!selectedTile || newRailFrom === newRailTo) return;
        toggleRail(selectedTile.q, selectedTile.r, newRailFrom, newRailTo);
    };

    const removeRailFromSelected = (idx: number) => {
        if (!selectedTile) return;
        setLevelData(prev => ({
            ...prev,
            layout: prev.layout.map(t => {
                if (t.q !== selectedTile.q || t.r !== selectedTile.r) return t;
                const rails = [...(t.rails ?? prev.defaultRails ?? [])];
                rails.splice(idx, 1);
                return { ...t, rails };
            }),
        }));
    };

    const hexPoints = (x: number, y: number) =>
        Array.from({ length: 6 }).map((_, j) => { const c = getHexCorner(x, y, hexSize, j); return `${c.x},${c.y}`; }).join(' ');

    // PLAY モード
    if (editMode === 'PLAY') {
        return <GameScreen key={playKey} level={{ ...levelData, id: 0 }} bestMoves={null} onClear={() => { }} onExit={() => setEditMode('BOARD')} />;
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
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-black italic uppercase tracking-tighter text-amber-400">Stage Editor</h1>
                    <select
                        onChange={handleLoadLevel}
                        value={levelData.id}
                        className="bg-stone-800 border border-stone-600 rounded-lg px-3 py-1.5 text-xs font-bold text-stone-300 focus:outline-none focus:border-amber-500"
                    >
                        <option value="-1">-- ステージ読み込み --</option>
                        {LEVELS.map(l => (
                            <option key={l.id} value={l.id}>Stage {l.id}: {l.name}</option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={() => { setPlayKey(k => k + 1); setEditMode('PLAY'); }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-black font-black rounded-xl active:scale-95 transition-transform uppercase italic"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>Play
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 items-start">
                {/* === 左カラム: 盤面 === */}
                <div className="flex flex-col gap-3 w-full max-w-md">
                    {/* モードタブ */}
                    <div className="flex gap-1 bg-stone-800 rounded-xl p-1">
                        {modeTabs.map(({ mode, label }) => (
                            <button key={mode} onClick={() => setEditMode(mode)}
                                className={`flex-1 py-2 text-xs font-black rounded-lg uppercase transition-all ${editMode === mode ? 'bg-amber-500 text-black' : 'text-stone-400 hover:text-white'}`}>
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* SVGキャンバス (ゲーム画面と同じ 380px 高さ) */}
                    <div className="bg-stone-800 rounded-2xl overflow-hidden border border-stone-700 relative h-[380px]">
                        <svg viewBox={boardBox.viewBox} className="w-full h-full" onClick={handleSvgClick}>
                            <defs>
                                <radialGradient id="gloss" cx="30%" cy="30%" r="50%">
                                    <stop offset="0%" stopColor="white" />
                                    <stop offset="100%" stopColor="transparent" />
                                </radialGradient>
                            </defs>

                            {/* Ghost hexes */}
                            {editMode === 'BOARD' && ghostHexes.map((g: { q: number; r: number }, i: number) => {
                                const { x, y } = hexToPixel(g.q, g.r, hexSize);
                                return <polygon key={`g-${i}`} points={hexPoints(x, y)} fill="transparent" stroke="rgba(255,255,255,0.15)" strokeWidth={1.5} strokeDasharray="4 3" />;
                            })}

                            {/* ハイライトされたスロット */}
                            {highlightedSlot && (
                                (() => {
                                    const { x, y } = hexToPixel(highlightedSlot.q, highlightedSlot.r, hexSize);
                                    const edge = getEdgeInfo(x, y, hexSize, (highlightedSlot.edge + 4) % 6);
                                    return (
                                        <g opacity="0.8">
                                            <circle cx={edge.x} cy={edge.y} r="12" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="2 2" />
                                            <circle cx={edge.x} cy={edge.y} r="4" fill="#f59e0b" />
                                        </g>
                                    );
                                })()
                            )}

                            {/* タイル */}
                            {layout.map((tile: Tile, i: number) => {
                                const { x, y } = hexToPixel(tile.q, tile.r, hexSize);
                                const piece = levelData.initialBoard[`${tile.q},${tile.r}`];
                                const tileRails = tile.rails ?? levelData.defaultRails ?? [];
                                const isSelected = editMode === 'RAILS' && selectedTile?.q === tile.q && selectedTile?.r === tile.r;

                                return (
                                    <g key={`tile-${i}`}>
                                        <polygon points={hexPoints(x, y)} fill="#4a3a2e"
                                            stroke={isSelected ? '#f59e0b' : '#5c4d3f'}
                                            strokeWidth={isSelected ? 2.5 : 1} />

                                        {/* レール (修正済み: +4)%6 で正しい辺に描画) */}
                                        {tileRails.map((r: Rail, j: number) => {
                                            const m1 = getEdgeInfo(x, y, hexSize, (r.from + 4) % 6);
                                            const m2 = getEdgeInfo(x, y, hexSize, (r.to + 4) % 6);
                                            return (
                                                <g key={`rail-${j}`} stroke="#241b12" strokeWidth="2">
                                                    <line x1={m1.x} y1={m1.y} x2={x} y2={y} />
                                                    <line x1={x} y1={y} x2={m2.x} y2={m2.y} />
                                                </g>
                                            );
                                        })}

                                        {/* 座標ラベル */}
                                        {editMode === 'BOARD' && (
                                            <text x={x} y={y + 5} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize={9} fontFamily="monospace">{tile.q},{tile.r}</text>
                                        )}

                                        {tile.target && <PieceSvg piece={{ id: `tgt-${i}`, ...tile.target }} x={x} y={y} size={hexSize} isTarget />}
                                        {piece && (
                                            <g opacity={editMode === 'GOAL' ? 0 : (['BOARD', 'RAILS'].includes(editMode) ? 0.3 : 1)}>
                                                <PieceSvg piece={piece} x={x} y={y} size={hexSize} />
                                            </g>
                                        )}

                                        {isSelected && [0, 1, 2, 3, 4, 5].map(edgeIdx => {
                                            const edge = getEdgeInfo(x, y, hexSize, (edgeIdx + 4) % 6);
                                            const isMatched = firstEdge === edgeIdx;
                                            return (
                                                <g key={`edge-btn-${edgeIdx}`} cursor="pointer"
                                                    onClick={(e: React.MouseEvent) => {
                                                        e.stopPropagation();
                                                        if (firstEdge === null) {
                                                            setFirstEdge(edgeIdx);
                                                        } else if (firstEdge === edgeIdx) {
                                                            setFirstEdge(null);
                                                        } else {
                                                            toggleRail(tile.q, tile.r, firstEdge, edgeIdx);
                                                            setFirstEdge(null);
                                                        }
                                                    }}>
                                                    <circle cx={edge.x} cy={edge.y} r="8"
                                                        fill={isMatched ? '#f59e0b' : '#282018'}
                                                        stroke="#f59e0b" strokeWidth="1" />
                                                    <text x={edge.x} y={edge.y} dy="3" textAnchor="middle"
                                                        fill={isMatched ? 'black' : 'white'}
                                                        fontSize="10" fontWeight="bold" pointerEvents="none">
                                                        {edgeIdx}
                                                    </text>
                                                </g>
                                            );
                                        })}
                                    </g>
                                );
                            })}
                        </svg>

                        {/* ズームコントロール */}
                        <div className="absolute top-2 right-2 flex flex-col gap-1">
                            <button onClick={() => setZoom(z => Math.min(z * 1.2, 5))} className="w-8 h-8 bg-stone-900/80 border border-stone-600 rounded-lg flex items-center justify-center hover:bg-stone-700 transition-colors">＋</button>
                            <button onClick={() => setZoom(z => Math.max(z / 1.2, 0.2))} className="w-8 h-8 bg-stone-900/80 border border-stone-600 rounded-lg flex items-center justify-center hover:bg-stone-700 transition-colors">－</button>
                            <button onClick={() => setZoom(1.0)} className="w-8 h-8 bg-stone-900/80 border border-stone-600 rounded-lg flex items-center justify-center hover:bg-stone-700 transition-colors text-[10px] font-bold">1:1</button>
                        </div>

                        {/* モードのヒント */}
                        <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-stone-500 font-bold pointer-events-none">
                            {editMode === 'BOARD' && '▲クリック: タイル追加 ／ 既存タイルクリック: 削除'}
                            {editMode === 'GOAL' && '▲クリック: ゴール駒をサイクル変更'}
                            {editMode === 'PIECES' && '▲クリック: 初期駒をサイクル変更'}
                            {editMode === 'RAILS' && '▲タイルを選択 → 辺の数字(0-5)を2箇所クリックしてレール設定'}
                            {editMode === 'HAND' && '▼下の手持ちエリアで駒を管理'}
                        </div>
                    </div>

                    {/* 手持ちエリア */}
                    <div className="bg-stone-800 rounded-2xl border border-stone-700 p-4">
                        <div className="text-xs font-black uppercase text-stone-400 mb-3">手持ち駒</div>
                        <div className="flex flex-wrap gap-2 mb-3 min-h-[3rem]">
                            {levelData.initialHand.map((p, i) => (
                                <div key={p.id} className="flex flex-col items-center gap-1">
                                    <div className="relative w-12 h-12 bg-stone-900 rounded-xl border border-stone-700 flex items-center justify-center">
                                        <svg viewBox="-22 -22 44 44" className="w-10 h-10 pointer-events-none">
                                            <PieceSvg piece={p} x={0} y={0} size={22} />
                                        </svg>
                                        <button onClick={() => setLevelData(prev => ({ ...prev, initialHand: prev.initialHand.filter((_, idx) => idx !== i) }))}
                                            className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-600 rounded-full text-[9px] font-black flex items-center justify-center">×</button>
                                    </div>
                                </div>
                            ))}
                            {levelData.initialHand.length === 0 && <span className="text-xs text-stone-600 italic self-center">なし</span>}
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {[...PATTERN_OPTIONS, { pattern: PATTERNS.NONE, name: 'Neutral' }].map(({ pattern, name }) => (
                                <button key={pattern} onClick={() => setLevelData(prev => ({
                                    ...prev,
                                    initialHand: [...prev.initialHand, { id: makeHandId(pattern, prev.initialHand.length), pattern }]
                                }))}
                                    className="px-2 py-1 text-xs font-bold rounded-lg bg-stone-700 hover:bg-stone-600 border border-stone-600 transition-colors">
                                    +{name}
                                </button>
                            ))}
                        </div>
                    </div>

                </div>

                {/* === 右カラム: 設定パネル === */}
                <div className="flex-1 flex flex-col gap-4 min-w-0">
                    {/* ステージ設定 */}
                    <div className="bg-stone-800 rounded-2xl border border-stone-700 p-4 flex flex-col gap-4">
                        <div className="text-xs font-black uppercase text-stone-400">ステージ設定</div>
                        <div>
                            <label className="text-xs text-stone-400 font-bold block mb-1">ステージ名</label>
                            <input type="text" value={levelData.name}
                                onChange={e => setLevelData(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full bg-stone-900 border border-stone-600 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:border-amber-500" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {(['excellentMoves', 'goodMoves'] as const).map(key => (
                                <div key={key}>
                                    <label className="text-xs text-stone-400 font-bold block mb-1">{key === 'excellentMoves' ? 'Excellent 手数' : 'Good 手数'}</label>
                                    <input type="number" min={1} value={levelData[key]}
                                        onChange={e => setLevelData(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                                        className="w-full bg-stone-900 border border-stone-600 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:border-amber-500" />
                                </div>
                            ))}
                        </div>
                        <div className="pt-2 border-t border-stone-700">
                            <button onClick={handleSolve} disabled={solving}
                                className="w-full py-2.5 bg-stone-700 border border-stone-600 rounded-xl text-sm font-black uppercase hover:border-amber-500 transition-colors disabled:opacity-50">
                                {solving ? '解析中…' : '自動ソルバー'}
                            </button>
                            {solverResult !== null && (
                                <div className={`mt-2 text-center text-sm font-bold rounded-lg py-2 ${solverResult === 'none' ? 'bg-red-900/30 text-red-300 border border-red-800' : 'bg-emerald-900/30 text-emerald-300 border border-emerald-800'}`}>
                                    {solverResult === 'none' ? '解なし（21手以上 or 探索限界）' : `最小手数: ${solverResult.moves} 手`}
                                </div>
                            )}
                            {solverResult && typeof solverResult !== 'string' && (
                                <>
                                    <div className="mt-3 flex flex-col gap-1 max-h-48 overflow-y-auto pr-1">
                                        {solverResult.sequence.map((step, idx) => (
                                            <div key={idx}
                                                onMouseEnter={() => setHighlightedSlot({ q: step.slot.targetTileQ, r: step.slot.targetTileR, edge: step.slot.originalEdge })}
                                                onMouseLeave={() => setHighlightedSlot(null)}
                                                className="flex items-center gap-3 bg-stone-900/50 border border-stone-700/50 rounded-lg p-2 hover:border-amber-500/50 transition-colors group">
                                                <span className="w-5 h-5 flex items-center justify-center bg-stone-800 rounded-full text-[10px] text-stone-500 font-bold">{idx + 1}</span>
                                                <div className="flex-1 flex items-center justify-between">
                                                    <span className="text-xs font-black uppercase text-amber-500/80">{step.pattern}</span>
                                                    <span className="text-[10px] text-stone-500 font-bold">@ ({step.slot.targetTileQ}, {step.slot.targetTileR}) [辺 {step.slot.originalEdge}]</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={() => setLevelData(prev => ({ ...prev, excellentMoves: solverResult.moves, goodMoves: Math.ceil(solverResult.moves * 1.8), solution: solverResult.sequence }))}
                                        className="mt-3 w-full py-2 text-xs font-black uppercase bg-emerald-700/30 border border-emerald-700 rounded-xl hover:bg-emerald-700/50 transition-colors">
                                        手数設定に反映
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* タイル別レール設定 */}
                    <div className="bg-stone-800 rounded-2xl border border-stone-700 p-4 flex flex-col gap-3">
                        <div className="text-xs font-black uppercase text-stone-400">レール設定（タイル別）</div>
                        <div className="text-xs text-stone-500">0:右上 1:右 2:右下 3:左下 4:左 5:左上</div>

                        {editMode !== 'RAILS' && (
                            <div className="text-xs text-amber-600 font-bold">上の「レール」タブに切替えてタイルを選択</div>
                        )}

                        {selectedTile ? (
                            <>
                                <div className="text-xs font-bold text-amber-400">選択中: ({selectedTile.q}, {selectedTile.r})</div>
                                {selectedRails.length === 0 && <div className="text-xs text-stone-600 italic">レールなし</div>}
                                {selectedRails.map((rail, i) => (
                                    <div key={i} className="flex items-center justify-between bg-stone-900 rounded-xl px-3 py-2">
                                        <span className="text-sm font-bold">{EDGE_NAMES[rail.from]} ↔ {EDGE_NAMES[rail.to]}</span>
                                        <button onClick={() => removeRailFromSelected(i)}
                                            className="text-red-400 font-bold text-sm w-6 h-6 flex items-center justify-center hover:bg-red-900/30 rounded-lg">×</button>
                                    </div>
                                ))}
                                <div className="flex gap-2 items-end">
                                    <div className="flex-1">
                                        <label className="text-xs text-stone-400 block mb-1">From</label>
                                        <select value={newRailFrom} onChange={e => setNewRailFrom(Number(e.target.value))}
                                            className="w-full bg-stone-900 border border-stone-600 rounded-lg px-2 py-1.5 text-xs font-bold focus:outline-none">
                                            {[0, 1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{EDGE_NAMES[n]}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-xs text-stone-400 block mb-1">To</label>
                                        <select value={newRailTo} onChange={e => setNewRailTo(Number(e.target.value))}
                                            className="w-full bg-stone-900 border border-stone-600 rounded-lg px-2 py-1.5 text-xs font-bold focus:outline-none">
                                            {[0, 1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{EDGE_NAMES[n]}</option>)}
                                        </select>
                                    </div>
                                    <button onClick={addRailToSelected}
                                        className="px-3 py-1.5 bg-amber-500 text-black font-black rounded-lg text-sm hover:bg-amber-400 transition-colors">追加</button>
                                </div>
                            </>
                        ) : (
                            <div className="text-xs text-stone-600 italic">レールタブでタイルを選択してください</div>
                        )}
                    </div>


                    {/* Level JSON */}
                    <div className="bg-stone-800 rounded-2xl border border-stone-700 p-4 mt-4 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <div className="text-xs font-black uppercase text-stone-400">Level JSON</div>
                            <div className="flex items-center gap-2">
                                {jsonError && <span className="text-xs text-red-400 font-bold">{jsonError}</span>}
                                <button onClick={() => {
                                    navigator.clipboard.writeText(jsonText);
                                    const btn = document.getElementById('copy-json-btn');
                                    if (btn) {
                                        const original = btn.innerText;
                                        btn.innerText = 'Copied!';
                                        btn.classList.add('bg-emerald-600');
                                        setTimeout(() => {
                                            btn.innerText = original;
                                            btn.classList.remove('bg-emerald-600');
                                        }, 2000);
                                    }
                                }} id="copy-json-btn"
                                    className="px-2 py-1 bg-stone-700 text-[10px] font-black uppercase rounded border border-stone-600 hover:bg-stone-600 transition-colors">
                                    Copy JSON
                                </button>
                            </div>
                        </div>
                        <textarea value={jsonText} onChange={e => handleJsonChange(e.target.value)} spellCheck={false}
                            className={`w-full h-64 bg-stone-900 rounded-xl p-3 text-xs font-mono resize-y focus:outline-none border transition-colors ${jsonError ? 'border-red-600' : 'border-stone-600 focus:border-amber-500'}`} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StageEditor;
