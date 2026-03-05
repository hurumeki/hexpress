import fs from 'fs';
import { solve } from './src/editor/solver';
import type { Level, Tile } from './src/types';
import { COLORS, PATTERNS, DIRS } from './src/constants';

const r3 = [{ from: 0, to: 3 }, { from: 1, to: 4 }, { from: 2, to: 5 }];
const colorList = [COLORS.wood, COLORS.stone, COLORS.grass, COLORS.gold, COLORS.ink];
const patternList = [PATTERNS.CIRCLE, PATTERNS.DIAMOND, PATTERNS.LINES, PATTERNS.SQUARE, PATTERNS.DOT];

function randomChoice<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function generateRandomLayout(size: number): { q: number, r: number }[] {
    const layout = [{ q: 0, r: 0 }];
    for (let i = 1; i < size; i++) {
        const candidates: { q: number, r: number }[] = [];
        layout.forEach(t => {
            DIRS.forEach(d => {
                const nq = t.q + d.dq, nr = t.r + d.dr;
                if (!layout.find(l => l.q === nq && l.r === nr)) candidates.push({ q: nq, r: nr });
            });
        });
        const chosen = randomChoice(candidates);
        layout.push(chosen);
    }
    return layout;
}

function generateRandomLevel(id: number): Level | null {
    const size = Math.floor(Math.random() * 4) + 4; // 4 to 7 tiles
    const layoutCoords = generateRandomLayout(size);
    const numPieces = Math.floor(Math.random() * 2) + 2; // 2 to 3 pieces

    const chosenColors = Array.from({ length: numPieces }, (_, i) => ({
        color: colorList[i % colorList.length],
        pattern: patternList[i % patternList.length]
    }));

    // Assign targets to random tiles
    const layout: Tile[] = layoutCoords.map(c => ({ ...c, target: null, rails: r3 }));
    const targetIndices: number[] = [];
    while (targetIndices.length < numPieces) {
        const idx = Math.floor(Math.random() * layout.length);
        if (!targetIndices.includes(idx)) targetIndices.push(idx);
    }
    targetIndices.forEach((idx, i) => {
        layout[idx].target = chosenColors[i];
    });

    // Assign pieces to board or hand
    const initialBoard: any = {};
    const initialHand: any[] = [];
    const boardIndices: number[] = [];

    // Pick 1-2 pieces for the board
    const numOnBoard = Math.max(1, numPieces - 1);
    while (boardIndices.length < numOnBoard) {
        const idx = Math.floor(Math.random() * layout.length);
        if (!boardIndices.includes(idx)) boardIndices.push(idx);
    }

    chosenColors.forEach((c, i) => {
        if (i < numOnBoard) {
            const coord = layout[boardIndices[i]];
            initialBoard[`${coord.q},${coord.r}`] = { id: `p${i}`, color: c.color, pattern: c.pattern };
        } else {
            initialHand.push({ id: `h${i}`, color: c.color, pattern: c.pattern });
        }
    });

    // Add up to 1 neutral piece to hand
    if (Math.random() > 0.5) {
        initialHand.push({ id: `hn`, color: COLORS.neutral, pattern: PATTERNS.NONE });
    }

    const level: Level = {
        id,
        name: `Stage ${id + 1}`,
        excellentMoves: 99,
        goodMoves: 99,
        layout,
        defaultRails: r3,
        initialBoard,
        initialHand
    };

    const moves = solve(level);
    if (moves !== null) {
        level.excellentMoves = moves;
        level.goodMoves = Math.ceil(moves * 1.5);
        return level;
    }
    return null;
}

function run() {
    let finalLevels: Level[] = [];
    const targets = [3, 4, 4, 5, 5, 6, 6, 7, 8, 9];
    let id = 3;

    console.log('Generating levels...');
    for (const target of targets) {
        let attempts = 0;
        let bestSubLevel: Level | null = null;
        let highestSubMoves = 0;

        while (attempts < 2500) {
            attempts++;
            const candidate = generateRandomLevel(id);
            if (candidate && candidate.excellentMoves === target) {
                bestSubLevel = candidate;
                break;
            }
            if (candidate && candidate.excellentMoves > highestSubMoves && candidate.excellentMoves < target) {
                highestSubMoves = candidate.excellentMoves;
                bestSubLevel = candidate;
            }
        }

        if (bestSubLevel) {
            bestSubLevel.id = id;
            bestSubLevel.name = `Stage ${id + 1}`;
            finalLevels.push(bestSubLevel);
            console.log(`Generated level (target: ${target}, actual: ${bestSubLevel.excellentMoves}) in ${attempts} attempts.`);
            id++;
        }
    }

    fs.writeFileSync('new_levels.json', JSON.stringify(finalLevels, null, 4));
    console.log(`Saved ${finalLevels.length} levels to new_levels.json`);
}

run();
