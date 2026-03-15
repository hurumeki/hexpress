/**
 * add-solutions.ts
 * 全レベルJSON（src/levels/level*.json）にソルバーを実行し、
 * solutionフィールド（最短手順配列 or null）を追記して上書き保存するスクリプト。
 *
 * 使い方: npx tsx scripts/add-solutions.ts
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

/** BFSソルバー。最短手順を返す。見つからなければ null。 */
const solve = (level: LevelJson): SolutionStep[] | null => {
    const MAX_MOVES = 25;
    const MAX_STATES = 500_000;

    const initialBoard = Object.entries(level.initialBoard).map(([key, p]) => {
        const [q, r] = key.split(',').map(Number);
        return { q, r, pattern: p.pattern, id: `i_${q}_${r}` };
    });
    const initialHand = level.initialHand.map(p => p.pattern);
    const initial: SState = { board: initialBoard, hand: initialHand };

    if (isGoal(initial.board, level)) return [];

    const slots = computeSlots(level);
    const visited = new Set<string>([stateKey(initial)]);
    const queue: { state: SState; moves: number; sequence: SolutionStep[] }[] = [
        { state: initial, moves: 0, sequence: [] }
    ];

    while (queue.length > 0) {
        if (visited.size > MAX_STATES) return null;
        const { state, moves, sequence } = queue.shift()!;
        if (moves >= MAX_MOVES) continue;

        const uniquePatterns = [...new Set(state.hand)];
        for (const pattern of uniquePatterns) {
            for (const slot of slots) {
                const next = applyInsert(state, level, pattern, slot);
                if (next === state) continue;

                const step: SolutionStep = { pattern, slot };
                if (isGoal(next.board, level)) return [...sequence, step];

                const key = stateKey(next);
                if (!visited.has(key)) {
                    visited.add(key);
                    queue.push({ state: next, moves: moves + 1, sequence: [...sequence, step] });
                }
            }
        }
    }

    return null;
};

// --- メイン処理 ---
const levelsDir = path.resolve(__dirname, '../src/levels');
const files = fs.readdirSync(levelsDir)
    .filter(f => /^level\d+\.json$/.test(f))
    .sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)![0]);
        const numB = parseInt(b.match(/\d+/)![0]);
        return numA - numB;
    });

console.log(`Found ${files.length} level files.\n`);

for (const file of files) {
    const filePath = path.join(levelsDir, file);
    const level: LevelJson = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    process.stdout.write(`[${file}] Solving... `);
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
