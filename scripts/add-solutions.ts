/**
 * add-solutions.ts
 * 全レベルJSON（src/levels/level*.json）にソルバーを実行し、
 * solutionフィールド（最短手順配列 or null）を追記して上書き保存するスクリプト。
 *
 * 使い方: npx tsx scripts/add-solutions.ts [filePath...]
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- 型定義（solver.tsと同等） ---
interface Rail { from: number; to: number; }
interface Tile { q: number; r: number; target: { pattern: string } | null; rails?: Rail[]; }
interface PieceTemplate { id: string; pattern: string; }
interface SolutionStep {
    pattern: string;
    slot: { targetTileQ: number; targetTileR: number; originalEdge: number };
}
interface LevelJson {
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

// --- ソルバー内部型 ---
interface SState {
    board: { q: number; r: number; pattern: string; id: string }[];
    hand: string[];
}

const DIRS = [
    { dq: 1, dr: -1 },
    { dq: 1, dr: 0 },
    { dq: 0, dr: 1 },
    { dq: -1, dr: 1 },
    { dq: -1, dr: 0 },
    { dq: 0, dr: -1 },
];

const stateKey = ({ board, hand }: SState): string => {
    const b = board.map(p => `${p.q},${p.r},${p.pattern}`).sort().join(';');
    const h = [...hand].sort().join(',');
    return `${b}|${h}`;
};

const isGoal = (board: SState['board'], level: LevelJson): boolean =>
    level.layout.every(tile => {
        if (!tile.target) return true;
        const p = board.find(p => p.q === tile.q && p.r === tile.r);
        return p?.pattern === tile.target!.pattern;
    });

const computeSlots = (level: LevelJson) => {
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

let _seq = 0;

const applyInsert = (
    state: SState,
    level: LevelJson,
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
    const entering = { q: startQ, r: startR, pattern, id: `e_${++_seq}` };
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

const getHeuristic = (board: SState['board'], level: LevelJson): number => {
    let diff = 0;
    level.layout.forEach(t => {
        if (!t.target) return;
        const p = board.find(p => p.q === t.q && p.r === t.r);
        if (!p || p.pattern !== t.target.pattern) diff++;
    });
    return diff;
};

const solveWithWeight = (level: LevelJson, weight: number, maxStates: number): SolutionStep[] | null => {
    const MAX_MOVES = 25;

    const initialBoard = Object.entries(level.initialBoard).map(([key, p]) => {
        const [q, r] = key.split(',').map(Number);
        return { q, r, pattern: p.pattern, id: `i_${q}_${r}` };
    });
    const initialHand = level.initialHand.map(p => p.pattern);
    const initial: SState = { board: initialBoard, hand: initialHand };

    if (isGoal(initial.board, level)) return [];

    const slots = computeSlots(level);
    const visited = new Map<string, number>();
    visited.set(stateKey(initial), 0);
    
    const queue = new MinHeap<{ state: SState; moves: number; sequence: SolutionStep[] }>();
    queue.push(getHeuristic(initial.board, level) * weight, { state: initial, moves: 0, sequence: [] });

    let exploredStates = 0;

    while (queue.size > 0) {
        exploredStates++;
        if (exploredStates > maxStates) {
            return null;
        }
        const stateNode = queue.pop()!;
        const { state, moves, sequence } = stateNode;

        if (moves >= MAX_MOVES) continue;

        const uniquePatterns = [...new Set(state.hand)];
        for (const pattern of uniquePatterns) {
            for (const slot of slots) {
                const next = applyInsert(state, level, pattern, slot);
                if (next === state) continue;

                const step: SolutionStep = { pattern, slot };
                
                // Early goal detection saves expanding the last depth layer. 
                // Since edge cost is 1, this is optimal for BFS (weight=0).
                if (isGoal(next.board, level)) {
                    return [...sequence, step];
                }
                const key = stateKey(next);
                const nextMoves = moves + 1;
                
                const h = getHeuristic(next.board, level);
                const priority = nextMoves + h * weight;

                const prevMoves = visited.get(key);
                if (prevMoves === undefined || nextMoves < prevMoves) {
                    visited.set(key, nextMoves);
                    queue.push(priority, { state: next, moves: nextMoves, sequence: [...sequence, step] });
                }
            }
        }
    }

    return null;
};

/** BFSソルバー。最短手順を返す。状態爆発時は重み付きA*で準最適解を返す。 */
const solve = (level: LevelJson): SolutionStep[] | null => {
    // 1. 完全なBFSで最適解を目指す (MAX 200,000 states)
    let sol = solveWithWeight(level, 0, 200000);
    if (sol) return sol;

    // 2. 状態爆発した場合は、強い重み付きA*で準最適解を高速に探す (MAX 500,000 states)
    process.stdout.write('(fallback to A*) ');
    sol = solveWithWeight(level, 2.0, 500000);
    return sol;
};

// --- メイン処理 ---
const levelsDir = path.resolve(__dirname, '../src/levels');
let filePaths: string[] = [];

const args = process.argv.slice(2);
if (args.length > 0) {
    filePaths = args.map(arg => path.resolve(process.cwd(), arg));
} else {
    filePaths = fs.readdirSync(levelsDir)
        .filter(f => /^level\d+\.json$/.test(f))
        .sort((a, b) => {
            const numA = parseInt(a.match(/\d+/)![0]);
            const numB = parseInt(b.match(/\d+/)![0]);
            return numA - numB;
        })
        .map(f => path.join(levelsDir, f));
}

console.log(`Found ${filePaths.length} level files.\n`);

for (const filePath of filePaths) {
    const fileName = path.basename(filePath);
    const level: LevelJson = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    process.stdout.write(`[${fileName}] Solving... `);
    _seq = 0; // シーケンス番号リセット
    const start = Date.now();
    const solution = solve(level);
    const elapsed = Date.now() - start;

    level.solution = solution;

    fs.writeFileSync(filePath, JSON.stringify(level, null, 4));

    if (solution === null) {
        console.log(`No solution found (${elapsed}ms)`);
    } else {
        console.log(`${solution.length} moves (${elapsed}ms)`);
    }
}

console.log('\nDone.');
