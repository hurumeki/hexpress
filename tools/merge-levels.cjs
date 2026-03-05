const fs = require('fs');

const levelsJsonString = fs.readFileSync('new_levels.json', 'utf8');
const items = levelsJsonString.trim().substring(1, levelsJsonString.trim().length - 1);
const constants = fs.readFileSync('src/constants.ts', 'utf8');
const updated = constants.replace(/\s*\];\s*export const STORAGE_KEY/, ',\n' + items + '\n];\n\nexport const STORAGE_KEY');

// Convert string colors/patterns back to enum forms just to look nicer, though string is also fine.
// I'll skip that to be safe.

fs.writeFileSync('src/constants.ts', updated);
console.log('Merged new levels into constants.ts');
