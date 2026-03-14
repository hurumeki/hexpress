import React, { useState, useEffect, useMemo } from 'react';
import type {
    Piece,
    PieceTemplate,
    Level,
    OuterSlot,
    HighlightedPath,
    DragState,
    HistoryState,
    PathStep,
} from '../types';
import { DIRS, PATH_COLORS } from '../constants';
import { hexToPixel, getHexCorner, getEdgeInfo, getMedalColor, getBoardBoundingBox } from '../utils';
import PieceSvg from '../components/PieceSvg';
import HexMedal from '../components/HexMedal';
import BackButton from '../components/BackButton';
import TutorialOverlay from '../components/TutorialOverlay';
import { useLang } from '../i18n';
import { playClickSound, playMoveSound, playClearSound, playInvalidSound } from '../audio';

interface GameScreenProps {
    level: Level;
    bestMoves: number | null;
    onClear: (m: number) => void;
    onExit: () => void;
    onNext?: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ level, bestMoves, onClear, onExit, onNext }) => {
    const { t } = useLang();
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
    const [tutorialStep, setTutorialStep] = useState<number>(0);

    const hexSize = 44;

    useEffect(() => {
        if (animating) return;
        const allMatch = level.layout.every(tile => {
            if (!tile.target) return true;
            const p = board.find(p => p.q === tile.q && p.r === tile.r);
            return p && p.color === tile.target.color && p.pattern === tile.target.pattern;
        });
        if (allMatch && moves > 0 && !isClear) {
            playClearSound();
            setIsClear(true);
            onClear(moves);
        }
    }, [board, animating, moves, level, isClear, onClear]);

    // チュートリアルの進行管理
    useEffect(() => {
        if (!level.isTutorial) return;
        if (level.id === 1) { // チュートリアル2
            if (tutorialStep === 0 && isPeek) {
                setTutorialStep(1);
            } else if (tutorialStep === 1 && moves === 1) {
                setTutorialStep(2);
            }
        } else if (level.id === 2) { // チュートリアル3
            if (tutorialStep === 0 && selectedIdx === 1) {
                setTutorialStep(1);
            } else if (tutorialStep === 1 && moves === 1) {
                setTutorialStep(2);
                // チュートリアル3で手がリセットされた時、白コマ(インデックス0)を選択させる
                if (hand.length > 0) setSelectedIdx(0);
            }
        }
    }, [level.id, level.isTutorial, tutorialStep, isPeek, moves, selectedIdx, hand.length]);

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

            const tileRails = tile.rails ?? level.defaultRails ?? [];
            const rail = tileRails.find(r => r.from === curEdge || r.to === curEdge);
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
            const tileRails = tile.rails ?? level.defaultRails ?? [];
            for (let i = 0; i < 6; i++) {
                const hasRail = tileRails.some(r => r.from === i || r.to === i);
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

    const boardBox = useMemo(() => {
        const allHexes = [
            ...level.layout.map(t => ({ q: t.q, r: t.r })),
            ...outerSlots.map(s => ({ q: s.q, r: s.r }))
        ];
        return getBoardBoundingBox(allHexes, hexSize, 30);
    }, [level.layout, outerSlots, hexSize]);

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
            const tileRails = tile.rails ?? level.defaultRails ?? [];
            const rail = tileRails.find(r => r.from === curEdge || r.to === curEdge);
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
                playMoveSound();
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
        if (history.length === 0 || animating) {
            if (!animating) playInvalidSound();
            return;
        }
        playClickSound();
        const last = history[history.length - 1];
        setBoard(last.board); setHand(last.hand); setMoves(last.moves);
        setHistory(history.slice(0, -1));
        setIsClear(false); setReadySlot(null); setHighlightedPaths([]);
    };

    const currentMedalColor = getMedalColor(bestMoves, level.excellentMoves, level.goodMoves);

    return (
        <div className="fixed inset-0 bg-stone-800 flex flex-col select-none touch-none overflow-hidden">
            <div className="w-full flex flex-col h-full">
                <div className="p-4 md:p-5 bg-stone-900 flex justify-between items-center border-b border-stone-700 text-white shadow-md shrink-0 z-10">
                    <div className="flex items-center gap-2 md:gap-3">
                        <BackButton onClick={() => { playClickSound(); onExit(); }} />
                        <div className="flex flex-col mt-0.5">
                            <h1 className="text-lg md:text-xl font-black italic tracking-tighter uppercase leading-none">#{level.id + 1}</h1>
                            <span className="text-[10px] text-stone-500 font-bold uppercase tracking-widest">{level.name}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 md:gap-4">
                        <HexMedal color={currentMedalColor} size={12} />
                        <div className="text-right flex flex-col items-end justify-center">
                            <p className="text-[9px] md:text-[10px] text-stone-500 font-bold uppercase leading-tight">{t('moves')}</p>
                            <p className="text-xl md:text-2xl font-mono font-black leading-none">{moves}<span className="text-[10px] md:text-xs text-stone-500 font-bold ml-1">/ {level.goodMoves}</span></p>
                        </div>
                        <button onClick={undo} disabled={history.length === 0 || animating} className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-stone-800 hover:bg-stone-700 rounded-xl border border-stone-600 active:scale-95 transition-all text-white disabled:opacity-30">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 10h10a8 8 0 0 1 8 8v2M3 10l6-6m-6 6l6 6" /></svg>
                        </button>
                    </div>
                </div>

                <div className="relative flex-1 bg-stone-800 flex items-center justify-center overflow-hidden min-h-[300px]">
                    <svg viewBox={boardBox.viewBox} className="w-full h-full max-w-full max-h-full" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
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
                                    {(tile.rails ?? level.defaultRails ?? []).map((r, j) => {
                                        const m1 = getEdgeInfo(x, y, hexSize, (r.from + 4) % 6);
                                        const m2 = getEdgeInfo(x, y, hexSize, (r.to + 4) % 6);
                                        return (
                                            <g key={`rail-${j}`} stroke="#1a120b" strokeWidth="1">
                                                <line x1={m1.x} y1={m1.y} x2={x} y2={y} />
                                                <line x1={x} y1={y} x2={m2.x} y2={m2.y} />
                                            </g>
                                        );
                                    })}
                                    {tile.target && <PieceSvg piece={{ id: `target-${i}`, color: tile.target.color, pattern: tile.target.pattern }} x={x} y={y} size={hexSize} isTarget={true} />}
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
                                        <PieceSvg piece={hand[selectedIdx]} x={x} y={y} size={hexSize} />
                                    )}


                                </g>
                            );
                        })}

                        {board.map(p => {
                            const { x, y } = hexToPixel(p.q, p.r, hexSize);
                            return <PieceSvg key={p.id} piece={p} x={x} y={y} size={hexSize} isPeek={isPeek} />;
                        })}
                    </svg>
                    {isClear && (
                        <div className="absolute inset-0 bg-stone-900/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500 z-50">
                            <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter mb-4">{t('stageClear')}</h2>
                            <div className="flex flex-col items-center gap-2 mb-10 animate-pop-in animation-delay-300 opacity-0">
                                <HexMedal color={getMedalColor(moves, level.excellentMoves, level.goodMoves)} size={30} />
                                <span className="text-amber-500 font-black text-xl italic uppercase tracking-widest">
                                    {moves <= level.excellentMoves ? 'EXCELLENT!' : moves <= level.goodMoves ? 'GOOD!' : 'CLEARED'}
                                </span>
                            </div>
                            <div className="flex flex-col md:flex-row gap-4 w-full max-w-md px-4">
                                <button onClick={() => { playClickSound(); onExit(); }} className="flex-1 py-4 bg-stone-800 text-stone-300 font-bold text-lg rounded-2xl active:scale-95 transition-all uppercase italic border border-stone-700 hover:bg-stone-700">{t('backToSelect')}</button>
                                {onNext && (
                                    <button onClick={() => { playClickSound(); onNext(); }} className="flex-[1.5] py-4 bg-amber-500 text-black font-black text-xl rounded-2xl active:scale-95 transition-transform uppercase italic shadow-lg shadow-amber-500/40 hover:brightness-110">{t('nextStage')}</button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="relative w-full shrink-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                    {/* Hand Scroller with Fade Hints */}
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-stone-900 to-transparent z-20 pointer-events-none opacity-60"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-stone-900 to-transparent z-20 pointer-events-none opacity-60"></div>

                    <div
                        className="p-4 md:p-6 bg-stone-900 border-t border-stone-800 flex justify-center gap-3 md:gap-5 cursor-pointer h-28 md:h-32 w-full overflow-x-auto no-scrollbar scroll-smooth"
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
                                    playClickSound();
                                    setSelectedIdx(i);
                                }}
                                className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl border-2 transition-all flex items-center justify-center shrink-0 ${selectedIdx === i ? 'bg-stone-800 border-amber-500 ring-4 ring-amber-500/20 scale-110 z-10 animate-pulse-ring' : 'bg-stone-800 border-stone-700'} relative`}
                            >
                                <svg viewBox="-25 -25 50 50" className="w-[85%] h-[85%] pointer-events-none">
                                    <PieceSvg piece={p} x={0} y={0} size={25} />
                                </svg>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tutorial Element */}
            <TutorialOverlay isVisible={level.isTutorial ?? false} step={tutorialStep} levelId={level.id} />
        </div>
    );
};

export default GameScreen;
