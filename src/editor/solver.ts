import type { Level, SolutionStep } from '../types';
import { DIRS } from '../constants';

// --- Solver State ---
export interface SState {
    board: { q: number; r: number; pattern: string; id: string }[];
    hand: string[]; // patterns only
}

const stateKey = ({ board, hand }: SState): string => {
    const b = board.map(p => `${p.q},${p.r},${p.pattern}`).sort().join(';');
    const h = [...hand].sort().join(',');
    return `${b}|${h}`;
};

export type { SolutionStep };

export interface SolveResult {
    moves: number;
    sequence: SolutionStep[];
}

export const isGoal = (board: SState['board'], level: Level): boolean =>
    level.layout.every(tile => {
        if (!tile.target) return true;
        const p = board.find(p => p.q === tile.q && p.r === tile.r);
        return p?.pattern === tile.target!.pattern;
    });

const computeSlots = (level: Level) => {
    const slots: { targetTileQ: number; targetTileR: number; originalEdge: number }[] = [];
    level.layout.forEach(tile => {
        const tileRails = tile.rails ?? level.defaultRails ?? [];
        for (let i = 0; i < 6; i++) {
            if (!tileRails.some(r => r.from === i || r.to === i)) continue;
            const neighbor = level.layout.find(
                t => t.q === tile.q + DIRS[i].dq && t.r === tile.r + DIRS[i].dr
            );
            if (!neighbor && !slots.some(s => s.targetTileQ === tile.q && s.targetTileR === tile.r && s.originalEdge === i)) {
                slots.push({ targetTileQ: tile.q, targetTileR: tile.r, originalEdge: i });
            }
        }
    });
    return slots;
};

let _enteringSeq = 0;

export const applyInsert = (
    state: SState,
    level: Level,
    pattern: string,
    slot: { targetTileQ: number; targetTileR: number; originalEdge: number }
): SState => {
    const handIdx = state.hand.indexOf(pattern);
    if (handIdx === -1) return state;

    const newHand = [...state.hand];
    newHand.splice(handIdx, 1);

    const entryDir = DIRS[slot.originalEdge];
    const startQ = slot.targetTileQ + entryDir.dq;
    const startR = slot.targetTileR + entryDir.dr;
    const entering = { q: startQ, r: startR, pattern, id: `e_${++_enteringSeq}` };
    let board = [...state.board, entering];

    const movesMap: Record<string, { q: number; r: number }> = {};
    let curQ = slot.targetTileQ, curR = slot.targetTileR, curEdge = slot.originalEdge;
    let pushId = entering.id;
    let ejectedId: string | null = null;

    while (true) {
        const tile = level.layout.find(t => t.q === curQ && t.r === curR);
        if (!tile) { ejectedId = pushId; movesMap[pushId] = { q: curQ, r: curR }; break; }
        movesMap[pushId] = { q: curQ, r: curR };
        const tileRails = tile.rails ?? level.defaultRails ?? [];
        const rail = tileRails.find(r => r.from === curEdge || r.to === curEdge);
        if (!rail) break;
        const exitEdge = rail.from === curEdge ? rail.to : rail.from;
        const targetP = board.find(p => p.q === curQ && p.r === curR && p.id !== pushId && p.id !== entering.id);
        if (!targetP) break;
        pushId = targetP.id;
        const dir = DIRS[exitEdge];
        curQ += dir.dq; curR += dir.dr;
        curEdge = (exitEdge + 3) % 6;
    }

    board = board.map(p => movesMap[p.id] ? { ...p, ...movesMap[p.id] } : p);

    if (ejectedId) {
        const ejected = board.find(p => p.id === ejectedId);
        if (ejected) {
            newHand.push(ejected.pattern);
            board = board.filter(p => p.id !== ejectedId);
        }
    }

    return { board, hand: newHand };
};

class MinHeap<T> {
    private data: { priority: number; value: T }[] = [];
    push(priority: number, value: T) {
        this.data.push({ priority, value });
        let idx = this.data.length - 1;
        while (idx > 0) {
            const pIdx = Math.floor((idx - 1) / 2);
            if (this.data[pIdx].priority <= this.data[idx].priority) break;
            [this.data[pIdx], this.data[idx]] = [this.data[idx], this.data[pIdx]];
            idx = pIdx;
        }
    }
    pop(): T | undefined {
        if (this.data.length === 0) return undefined;
        if (this.data.length === 1) return this.data.pop()!.value;
        const res = this.data[0].value;
        this.data[0] = this.data.pop()!;
        let idx = 0;
        while (true) {
            const left = 2 * idx + 1;
            const right = 2 * idx + 2;
            let smallest = idx;
            if (left < this.data.length && this.data[left].priority < this.data[smallest].priority) smallest = left;
            if (right < this.data.length && this.data[right].priority < this.data[smallest].priority) smallest = right;
            if (smallest === idx) break;
            [this.data[idx], this.data[smallest]] = [this.data[smallest], this.data[idx]];
            idx = smallest;
        }
        return res;
    }
    get size() { return this.data.length; }
}

const getHeuristic = (board: SState['board'], level: Level): number => {
    let diff = 0;
    level.layout.forEach(t => {
        if (!t.target) return;
        const p = board.find(p => p.q === t.q && p.r === t.r);
        if (!p || p.pattern !== t.target.pattern) diff++;
    });
    return diff;
};

const solveWithWeight = (level: Level, weight: number, maxStates: number): SolveResult | null => {
    const MAX_MOVES = 20;

    const initialBoard = Object.entries(level.initialBoard).map(([key, p]) => {
        const [q, r] = key.split(',').map(Number);
        return { q, r, pattern: p.pattern, id: `i_${q}_${r}` };
    });
    const initialHand = level.initialHand.map(p => p.pattern);
    const initial: SState = { board: initialBoard, hand: initialHand };

    if (isGoal(initial.board, level)) return { moves: 0, sequence: [] };

    const slots = computeSlots(level);
    const visited = new Map<string, number>();
    visited.set(stateKey(initial), 0);
    
    const queue = new MinHeap<{ state: SState; moves: number; sequence: SolutionStep[] }>();
    queue.push(getHeuristic(initial.board, level) * weight, { state: initial, moves: 0, sequence: [] });

    let exploredStates = 0;

    while (queue.size > 0) {
        exploredStates++;
        if (exploredStates > maxStates) return null;

        const stateNode = queue.pop()!;
        const { state, moves, sequence } = stateNode;
        if (moves >= MAX_MOVES) continue;

        const uniquePatterns = [...new Set(state.hand)];
        for (const pattern of uniquePatterns) {
            for (const slot of slots) {
                const next = applyInsert(state, level, pattern, slot);
                if (next === state) continue;

                const step: SolutionStep = { pattern, slot };
                if (isGoal(next.board, level)) return {
                    moves: moves + 1,
                    sequence: [...sequence, step]
                };

                const key = stateKey(next);
                const nextMoves = moves + 1;
                const h = getHeuristic(next.board, level);
                const priority = nextMoves + h * weight;

                const prevMoves = visited.get(key);
                if (prevMoves === undefined || nextMoves < prevMoves) {
                    visited.set(key, nextMoves);
                    queue.push(priority, {
                        state: next,
                        moves: nextMoves,
                        sequence: [...sequence, step]
                    });
                }
            }
        }
    }

    return null;
};

/** メインソルバー。BFSで最適解を探し、無理なら重み付きA*で探す */
export const solve = (level: Level): SolveResult | null => {
    let sol = solveWithWeight(level, 0, 200000);
    if (sol) return sol;
    sol = solveWithWeight(level, 2.0, 500000);
    return sol;
};
