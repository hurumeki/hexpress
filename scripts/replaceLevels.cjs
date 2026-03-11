
const fs = require('fs');

const filePath = 'src/constants.ts';
let content = fs.readFileSync(filePath, 'utf-8');

const marker = 'export const LEVELS: Level[] = ';
const markerPos = content.indexOf(marker);

const equalsPos = content.indexOf('=', markerPos);
const startIdx = content.indexOf('[', equalsPos);

let braceCount = 0;
let endIdx = -1;

for (let i = startIdx; i < content.length; i++) {
    if (content[i] === '[') braceCount++;
    if (content[i] === ']') braceCount--;
    if (braceCount === 0) {
        endIdx = i + 1;
        break;
    }
}

const newLevelsArray = `export const LEVELS: Level[] = [
    level0 as Level,
    level1 as Level,
    level2 as Level,
    level3 as Level,
    level4 as Level,
    level5 as Level,
    level6 as Level,
    level7 as Level,
    level8 as Level,
    level9 as Level,
    level10 as Level,
    level11 as Level,
    level12 as Level,
    level13 as Level,
    level14 as Level,
    level15 as Level,
    level16 as Level,
    level17 as Level,
    level18 as Level,
    level19 as Level,
    level20 as Level,
    level21 as Level,
    level22 as Level,
    level23 as Level,
    level24 as Level,
    level25 as Level
];`;

const newContent = content.substring(0, markerPos) + newLevelsArray + content.substring(endIdx);

fs.writeFileSync(filePath, newContent);
console.log('Successfully updated src/constants.ts');
