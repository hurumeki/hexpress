import type { Level } from '../types';
import { DIRS } from '../constants';

// --- Solver State ---
interface SState {
    board: { q: number; r: number; color: string; id: string }[];
    hand: string[]; // colors only
}

const stateKey = ({ board, hand }: SState): string => {
    const b = board.map(p => `${p.q},${p.r},${p.color}`).sort().join(';');
    const h = [...hand].sort().join(',');
    return `${b}|${h}`;
};

const isGoal = (board: SState['board'], level: Level): boolean =>
    level.layout.every(tile => {
        if (!tile.target) return true;
        const p = board.find(p => p.q === tile.q && p.r === tile.r);
        return p?.color === tile.target!.color;
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

const applyInsert = (
    state: SState,
    level: Level,
    color: string,
    slot: { targetTileQ: number; targetTileR: number; originalEdge: number }
): SState => {
    const handIdx = state.hand.indexOf(color);
    if (handIdx === -1) return state;

    const newHand = [...state.hand];
    newHand.splice(handIdx, 1);

    const entryDir = DIRS[slot.originalEdge];
    const startQ = slot.targetTileQ + entryDir.dq;
    const startR = slot.targetTileR + entryDir.dr;
    const entering = { q: startQ, r: startR, color, id: `s_${startQ}_${startR}_${color}` };
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
        const targetP = board.find(p => p.q === curQ && p.r === curR && p.id !== pushId);
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
            newHand.push(ejected.color);
            board = board.filter(p => p.id !== ejectedId);
        }
    }

    return { board, hand: newHand };
};

/** BFS ソルバー。最小手数を返す。21手を超える場合、または探索状態が多すぎる場合は null。 */
export const solve = (level: Level): number | null => {
    const MAX_MOVES = 20;
    const MAX_STATES = 200_000;

    const initialBoard = Object.entries(level.initialBoard).map(([key, p]) => {
        const [q, r] = key.split(',').map(Number);
        return { q, r, color: p.color, id: `i_${q}_${r}` };
    });
    const initialHand = level.initialHand.map(p => p.color);
    const initial: SState = { board: initialBoard, hand: initialHand };

    if (isGoal(initial.board, level)) return 0;

    const slots = computeSlots(level);
    const visited = new Set<string>([stateKey(initial)]);
    const queue: { state: SState; moves: number }[] = [{ state: initial, moves: 0 }];

    while (queue.length > 0) {
        if (visited.size > MAX_STATES) return null;
        const { state, moves } = queue.shift()!;
        if (moves >= MAX_MOVES) continue;

        const uniqueColors = [...new Set(state.hand)];
        for (const color of uniqueColors) {
            for (const slot of slots) {
                const next = applyInsert(state, level, color, slot);
                if (isGoal(next.board, level)) return moves + 1;
                const key = stateKey(next);
                if (!visited.has(key)) {
                    visited.add(key);
                    queue.push({ state: next, moves: moves + 1 });
                }
            }
        }
    }

    return null;
};
