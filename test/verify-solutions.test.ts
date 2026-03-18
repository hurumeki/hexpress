import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import assert from 'assert';
import { applyInsert, isGoal, type SState } from '../src/editor/solver';
import type { Level } from '../src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const levelsDir = path.resolve(__dirname, '../src/levels');

const files = fs.readdirSync(levelsDir)
    .filter(f => /^level\d+\.json$/.test(f))
    .sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)![0]);
        const numB = parseInt(b.match(/\d+/)![0]);
        return numA - numB;
    });

let passed = 0;
let failed = 0;

for (const file of files) {
    const filePath = path.join(levelsDir, file);
    const level: Level = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (!level.solution) {
        console.log(`[SKIP] ${file}: No solution recorded.`);
        continue;
    }

    try {
        // Build initial state
        const initialBoard = Object.entries(level.initialBoard).map(([key, p]) => {
            const [q, r] = key.split(',').map(Number);
            return { q, r, pattern: p.pattern, id: `i_${q}_${r}` };
        });
        const initialHand = level.initialHand.map(p => p.pattern);
        let state: SState = { board: initialBoard, hand: initialHand };

        // Apply each step
        for (let i = 0; i < level.solution.length; i++) {
            const step = level.solution[i];
            
            // Validate step pattern is in hand before applying
            if (!state.hand.includes(step.pattern)) {
                throw new Error(`Step ${i+1}: Cannot insert pattern '${step.pattern}', not found in hand. Current hand: [${state.hand.join(', ')}]`);
            }
            
            const nextState = applyInsert(state, level, step.pattern, step.slot);
            if (nextState === state) {
                throw new Error(`Step ${i+1}: Invalid insertion slot or blocked rail at Q:${step.slot.targetTileQ}, R:${step.slot.targetTileR}, Edge:${step.slot.originalEdge}`);
            }
            state = nextState;
        }

        // Verify goal state
        assert.ok(isGoal(state.board, level), `State did not reach goal after ${level.solution.length} moves.`);

        // Verify excellentMoves matches solution length
        assert.strictEqual(level.solution.length, level.excellentMoves, `Solution length (${level.solution.length}) does not match excellentMoves (${level.excellentMoves}).`);

        console.log(`[PASS] ${file}`);
        passed++;
    } catch (e: any) {
        console.error(`[FAIL] ${file}: ${e.message}`);
        failed++;
    }
}

console.log(`\nVerification complete: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
    process.exit(1);
}
