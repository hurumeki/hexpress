import React, { useState, useEffect } from 'react';

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

const LEVEL_1 = {
    excellentMoves: 5,
    goodMoves: 10,
    layout: [
        { q: 0, r: 0, target: { color: COLORS.wood, pattern: PATTERNS.CIRCLE } },
        { q: 1, r: -1, target: { color: COLORS.stone, pattern: PATTERNS.DIAMOND } },
        { q: 1, r: 0, target: null },
        { q: 0, r: 1, target: null },
        { q: -1, r: 1, target: { color: COLORS.grass, pattern: PATTERNS.LINES } },
        { q: -1, r: 0, target: null },
        { q: 0, r: -1, target: null }
    ],
    defaultRails: [
        { from: 0, to: 3 },
        { from: 1, to: 4 },
        { from: 2, to: 5 }
    ],
    initialBoard: {
        '0,0': { id: 'p1', color: COLORS.neutral, pattern: PATTERNS.NONE },
        '1,-1': { id: 'p2', color: COLORS.wood, pattern: PATTERNS.CIRCLE },
        '0,1': { id: 'p3', color: COLORS.stone, pattern: PATTERNS.DIAMOND }
    },
    initialHand: [
        { id: 'h1', color: COLORS.grass, pattern: PATTERNS.LINES },
        { id: 'h2', color: COLORS.neutral, pattern: PATTERNS.NONE }
    ]
};

// --- ヘルパー関数 ---

const hexToPixel = (q, r, size) => {
    const x = size * Math.sqrt(3) * (q + r / 2);
    const y = size * (3 / 2) * r;
    return { x, y };
};

const getHexCorner = (centerX, centerY, size, j) => {
    const angleRad = (Math.PI / 180) * (60 * j + 30);
    return {
        x: centerX + size * Math.cos(angleRad),
        y: centerY + size * Math.sin(angleRad)
    };
};

const getEdgeInfo = (centerX, centerY, size, edgeIdx) => {
    const p1 = getHexCorner(centerX, centerY, size, edgeIdx);
    const p2 = getHexCorner(centerX, centerY, size, (edgeIdx + 1) % 6);
    return {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2,
        angle: edgeIdx * 60 + 60
    };
};

// --- サブコンポーネント ---

const Piece = ({ piece, x, y, size, isTarget = false, isPeek = false, ghost = false }) => {
    if (!piece) return null;
    let opacity = isTarget ? 0.3 : (isPeek ? 0.2 : 1);
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

// --- メインアプリ ---

export default function App() {
    const [board, setBoard] = useState(() =>
        Object.entries(LEVEL_1.initialBoard).map(([key, p]) => {
            const [q, r] = key.split(',').map(Number);
            return { ...p, q, r };
        })
    );
    const [hand, setHand] = useState(LEVEL_1.initialHand);
    const [selectedIdx, setSelectedIdx] = useState(0);
    const [moves, setMoves] = useState(0);
    const [history, setHistory] = useState([]);
    const [isClear, setIsClear] = useState(false);
    const [isPeek, setIsPeek] = useState(false);
    const [animating, setAnimating] = useState(false);

    const [readySlot, setReadySlot] = useState(null);
    const [highlightedPaths, setHighlightedPaths] = useState([]);
    const [dragState, setDragState] = useState({ active: false, currentHex: null });

    const hexSize = 44;

    useEffect(() => {
        if (animating) return;
        const allMatch = LEVEL_1.layout.every(tile => {
            if (!tile.target) return true;
            const p = board.find(p => p.q === tile.q && p.r === tile.r);
            return p && p.color === tile.target.color && p.pattern === tile.target.pattern;
        });
        if (allMatch && moves > 0) setIsClear(true);
    }, [board, animating, moves]);

    const calculatePath = (startTileQ, startTileR, edgeIndex) => {
        const path = [];
        let curQ = startTileQ, curR = startTileR, curEdge = edgeIndex;

        while (true) {
            const tile = LEVEL_1.layout.find(t => t.q === curQ && t.r === curR);
            if (!tile) {
                path.push({ q: curQ, r: curR, exit: true });
                break;
            }
            path.push({ q: curQ, r: curR });

            const rail = LEVEL_1.defaultRails.find(r => r.from === curEdge || r.to === curEdge);
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

    const outerSlots = [];
    LEVEL_1.layout.forEach(tile => {
        for (let i = 0; i < 6; i++) {
            const hasRail = LEVEL_1.defaultRails.some(r => r.from === i || r.to === i);
            const neighbor = LEVEL_1.layout.find(t => t.q === tile.q + DIRS[i].dq && t.r === tile.r + DIRS[i].dr);
            if (hasRail && !neighbor) {
                outerSlots.push({
                    q: tile.q + DIRS[i].dq,
                    r: tile.r + DIRS[i].dr,
                    targetTileQ: tile.q,
                    targetTileR: tile.r,
                    originalEdge: i
                });
            }
        }
    });

    const getPathsForSlot = (slot) => {
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

    const findHexAt = (svgX, svgY) => {
        let minTarget = null;
        let minDist = hexSize;
        LEVEL_1.layout.forEach(tile => {
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

    const handlePointerDown = (e) => {
        if (animating || isClear) return;
        const svg = e.currentTarget;
        const pt = svg.createSVGPoint();
        pt.x = e.clientX; pt.y = e.clientY;
        const { x: sx, y: sy } = pt.matrixTransform(svg.getScreenCTM().inverse());

        const hit = findHexAt(sx, sy);
        if (hit && hit.type === 'slot' && selectedIdx !== null) {
            setReadySlot(hit);
            setHighlightedPaths(getPathsForSlot(hit));
            setDragState({ active: true, currentHex: hit });
        } else {
            setIsPeek(true);
            setDragState({ active: true, currentHex: hit });
        }
    };

    const handlePointerMove = (e) => {
        if (!dragState.active || animating) return;
        const svg = e.currentTarget;
        const pt = svg.createSVGPoint();
        pt.x = e.clientX; pt.y = e.clientY;
        const { x: sx, y: sy } = pt.matrixTransform(svg.getScreenCTM().inverse());
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

    const handleInsert = (tileQ, tileR, edgeIndex) => {
        const piece = hand[selectedIdx];
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
        const enteringPiece = { ...piece, q: startQ, r: startR };
        let currentBoard = [...board, enteringPiece];
        setBoard(currentBoard);

        const movesMap = {};
        let curQ = tileQ, curR = tileR, curEdge = edgeIndex;
        let pushId = enteringPiece.id;
        let ejectedPiece = null;

        while (true) {
            const tile = LEVEL_1.layout.find(t => t.q === curQ && t.r === curR);
            if (!tile) { ejectedPiece = pushId; movesMap[pushId] = { q: curQ, r: curR }; break; }
            movesMap[pushId] = { q: curQ, r: curR };
            const rail = LEVEL_1.defaultRails.find(r => r.from === curEdge || r.to === curEdge);
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
                if (ejectedPiece) {
                    const p = currentBoard.find(x => x.id === ejectedPiece);
                    setHand(prev => [...prev, { ...p, q: 0, r: 0 }]);
                    setBoard(prev => prev.filter(x => x.id !== ejectedPiece));
                }
                setMoves(m => m + 1);
                setAnimating(false);
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

    return (
        <div className="min-h-screen bg-stone-700 flex flex-col items-center justify-center p-4 select-none touch-none">
            <div className="w-full max-w-md bg-stone-800 rounded-3xl shadow-2xl border border-stone-600 overflow-hidden">

                {/* Header */}
                <div className="p-5 bg-stone-900 flex justify-between items-center border-b border-stone-700">
                    <div className="flex flex-col">
                        <h1 className="text-white text-xl font-black italic tracking-tighter uppercase">Hexa Slide</h1>
                        <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest mt-0.5">Navigation System</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right mr-2">
                            <p className="text-[9px] text-stone-500 font-bold uppercase">Moves</p>
                            <p className="text-2xl font-mono font-black text-white">{moves}</p>
                        </div>
                        <button onClick={undo} disabled={history.length === 0 || animating} className="w-10 h-10 flex items-center justify-center bg-stone-800 hover:bg-stone-700 rounded-xl border border-stone-600 active:scale-90 transition-all">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M3 10h10a8 8 0 0 1 8 8v2M3 10l6-6m-6 6l6 6" /></svg>
                        </button>
                    </div>
                </div>

                {/* Play Area */}
                <div className="relative h-[380px] bg-stone-800 flex items-center justify-center overflow-visible">
                    <svg viewBox="-165 -180 330 360" className="w-full h-full" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
                        <defs>
                            <radialGradient id="gloss" cx="30%" cy="30%" r="50%">
                                <stop offset="0%" stopColor="white" />
                                <stop offset="100%" stopColor="transparent" />
                            </radialGradient>
                        </defs>

                        {/* Board Tiles */}
                        {LEVEL_1.layout.map((tile, i) => {
                            const { x, y } = hexToPixel(tile.q, tile.r, hexSize);
                            const points = Array.from({ length: 6 }).map((_, j) => {
                                const corner = getHexCorner(x, y, hexSize, j);
                                return `${corner.x},${corner.y}`;
                            }).join(' ');

                            const activePath = highlightedPaths.find(hp => hp.path.some(p => p.q === tile.q && p.r === tile.r));

                            return (
                                <g key={`tile-${i}`}>
                                    <polygon points={points} fill="#382c22" stroke={activePath ? activePath.color : "#282018"} strokeWidth={activePath ? 3 : 1} />
                                    {/* Static Rails (No highlight) */}
                                    {LEVEL_1.defaultRails.map((r, j) => {
                                        const m1 = getEdgeInfo(x, y, hexSize, r.from);
                                        const m2 = getEdgeInfo(x, y, hexSize, r.to);
                                        return (
                                            <g key={`rail-${j}`} stroke="#1a120b" strokeWidth="2" opacity={isPeek ? 0.3 : 1}>
                                                <line x1={m1.x} y1={m1.y} x2={x} y2={y} />
                                                <line x1={x} y1={y} x2={m2.x} y2={m2.y} />
                                            </g>
                                        );
                                    })}
                                    {tile.target && <Piece piece={tile.target} x={x} y={y} size={hexSize} isTarget={true} />}
                                </g>
                            );
                        })}

                        {/* Virtual Slots & Guides */}
                        {outerSlots.map((slot, i) => {
                            const { x, y } = hexToPixel(slot.q, slot.r, hexSize);
                            const isReady = readySlot && readySlot.q === slot.q && readySlot.r === slot.r;

                            return (
                                <g key={`slot-${i}`}>
                                    {/* Base Slot Shape */}
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

                                    {/* Edges and Triangle Guides */}
                                    {Array.from({ length: 6 }).map((_, edgeIdx) => {
                                        const hp = highlightedPaths.find(p => p.q === slot.q && p.r === slot.r && p.slotEdge === edgeIdx);
                                        const p1 = getHexCorner(x, y, hexSize, edgeIdx);
                                        const p2 = getHexCorner(x, y, hexSize, (edgeIdx + 1) % 6);
                                        const info = getEdgeInfo(x, y, hexSize, edgeIdx);

                                        return (
                                            <g key={`edge-${edgeIdx}`}>
                                                {/* Edge line: Show color if active, otherwise faint white if slot is active */}
                                                <line
                                                    x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                                                    stroke={hp ? hp.color : (isReady ? "rgba(255,255,255,0.4)" : "transparent")}
                                                    strokeWidth={hp ? 4 : 1}
                                                />
                                                {/* Navigation Triangle */}
                                                {hp && (
                                                    <path
                                                        d="M-8,6 L8,6 L0,-8 Z"
                                                        fill={hp.color}
                                                        transform={`translate(${info.x}, ${info.y}) rotate(${info.angle + 180})`}
                                                    />
                                                )}
                                            </g>
                                        );
                                    })}
                                    {isReady && selectedIdx !== null && (
                                        <Piece piece={hand[selectedIdx]} x={x} y={y} size={hexSize} ghost={true} />
                                    )}
                                </g>
                            );
                        })}

                        {/* Game Pieces (No Highlights on Piece Body) */}
                        {board.map(p => {
                            const { x, y } = hexToPixel(p.q, p.r, hexSize);
                            return <Piece key={p.id} piece={p} x={x} y={y} size={hexSize} isPeek={isPeek} />;
                        })}
                    </svg>

                    {/* Victory View */}
                    {isClear && (
                        <div className="absolute inset-0 bg-stone-900/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500 z-50">
                            <h2 className="text-3xl font-black text-white italic tracking-tighter mb-8">MISSION CLEAR</h2>
                            <button onClick={() => window.location.reload()} className="px-12 py-4 bg-amber-500 text-black font-black rounded-2xl active:scale-95 transition-transform">NEXT LEVEL</button>
                        </div>
                    )}
                </div>

                {/* Inventory */}
                <div className="p-6 bg-stone-900 border-t border-stone-800 flex justify-center gap-5">
                    {hand.map((p, i) => (
                        <button
                            key={p.id}
                            onClick={() => setSelectedIdx(selectedIdx === i ? null : i)}
                            className={`w-16 h-16 rounded-2xl border-2 transition-all flex items-center justify-center ${selectedIdx === i ? 'bg-stone-800 border-amber-500 ring-4 ring-amber-500/20' : 'bg-stone-800 border-stone-700'}`}
                        >
                            <svg viewBox="-25 -25 50 50" className="w-12 h-12">
                                <Piece piece={p} x={0} y={0} size={25} />
                            </svg>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}


