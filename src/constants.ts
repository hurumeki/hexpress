import type { Level } from './types';

// --- 定数 ---

export const COLORS = {
    wood: '#a0522d',
    stone: '#483d8b',
    grass: '#556b2f',
    gold: '#b8860b',
    ink: '#2f4f4f',
    neutral: '#d2b48c'
};

export const PATH_COLORS = [
    '#fbbf24', // ゴールド
    '#3b82f6', // ブルー
    '#a855f7', // パープル
    '#22c55e', // グリーン
    '#ef4444', // ルビーレッド
];

export const PATTERNS = {
    CIRCLE: 'circle',
    SQUARE: 'square',
    DIAMOND: 'diamond',
    LINES: 'lines',
    DOT: 'dot',
    NONE: 'none'
};

// 0: 右上, 1: 右, 2: 右下, 3: 左下, 4: 左, 5: 左上
export const DIRS = [
    { dq: 1, dr: -1 },
    { dq: 1, dr: 0 },
    { dq: 0, dr: 1 },
    { dq: -1, dr: 1 },
    { dq: -1, dr: 0 },
    { dq: 0, dr: -1 }
];

// タイルごとのレール: 各レベルで全タイルに同じレールを適用（タイル別にも設定可能）
const RAILS_3WAY = [
    { from: 0, to: 3 },
    { from: 1, to: 4 },
    { from: 2, to: 5 }
];

export const LEVELS: Level[] = [
    {
        id: 0,
        name: "Tutorial",
        isTutorial: true,
        excellentMoves: 2,
        goodMoves: 4,
        layout: [
            { q: 0, r: -1, target: { color: COLORS.wood, pattern: PATTERNS.CIRCLE }, rails: [{ from: 2, to: 5 }] },
            { q: 0, r: 0, target: null, rails: [{ from: 2, to: 5 }] },
            { q: 0, r: 1, target: null, rails: [{ from: 2, to: 5 }] }
        ],
        defaultRails: [{ from: 2, to: 5 }],
        initialBoard: {
            '0,1': { id: 't3', color: COLORS.wood, pattern: PATTERNS.CIRCLE }
        },
        initialHand: [
            { id: 'th1', color: COLORS.neutral, pattern: PATTERNS.NONE },
            { id: 'th2', color: COLORS.neutral, pattern: PATTERNS.NONE }
        ]
    },
    {
        id: 1,
        name: "Swap Triangle",
        excellentMoves: 5,
        goodMoves: 10,
        layout: [
            { q: 0, r: 0, target: { color: COLORS.stone, pattern: PATTERNS.DIAMOND }, rails: RAILS_3WAY },
            { q: 1, r: -1, target: { color: COLORS.wood, pattern: PATTERNS.CIRCLE }, rails: RAILS_3WAY },
            { q: 1, r: 0, target: { color: COLORS.grass, pattern: PATTERNS.LINES }, rails: RAILS_3WAY }
        ],
        defaultRails: RAILS_3WAY,
        initialBoard: {
            '0,0': { id: 'p1', color: COLORS.wood, pattern: PATTERNS.CIRCLE },
            '1,-1': { id: 'p2', color: COLORS.stone, pattern: PATTERNS.DIAMOND },
            '1,0': { id: 'p3', color: COLORS.grass, pattern: PATTERNS.LINES }
        },
        initialHand: [
            { id: 'h1', color: COLORS.neutral, pattern: PATTERNS.NONE }
        ]
    },
    {
        id: 2,
        name: "Square Shift",
        excellentMoves: 8,
        goodMoves: 15,
        layout: [
            { q: 0, r: 0, target: { color: COLORS.gold, pattern: PATTERNS.SQUARE }, rails: RAILS_3WAY },
            { q: 1, r: 0, target: { color: COLORS.wood, pattern: PATTERNS.CIRCLE }, rails: RAILS_3WAY },
            { q: 0, r: 1, target: { color: COLORS.stone, pattern: PATTERNS.DIAMOND }, rails: RAILS_3WAY },
            { q: 1, r: 1, target: { color: COLORS.grass, pattern: PATTERNS.LINES }, rails: RAILS_3WAY }
        ],
        defaultRails: RAILS_3WAY,
        initialBoard: {
            '0,0': { id: 'q1', color: COLORS.wood, pattern: PATTERNS.CIRCLE },
            '1,0': { id: 'q2', color: COLORS.stone, pattern: PATTERNS.DIAMOND },
            '0,1': { id: 'q3', color: COLORS.grass, pattern: PATTERNS.LINES },
            '1,1': { id: 'q4', color: COLORS.gold, pattern: PATTERNS.SQUARE }
        },
        initialHand: [
            { id: 'qh1', color: COLORS.neutral, pattern: PATTERNS.NONE }
        ]
    },
    {
        "id": 3,
        "name": "Stage 4",
        "excellentMoves": 3,
        "goodMoves": 5,
        "layout": [
            {
                "q": 0,
                "r": 0,
                "target": null,
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": 1,
                "r": -1,
                "target": {
                    "color": "#483d8b",
                    "pattern": "diamond"
                },
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": 0,
                "r": -1,
                "target": null,
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": 0,
                "r": 1,
                "target": null,
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": 0,
                "r": 2,
                "target": {
                    "color": "#556b2f",
                    "pattern": "lines"
                },
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": 1,
                "r": 2,
                "target": {
                    "color": "#a0522d",
                    "pattern": "circle"
                },
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            }
        ],
        "defaultRails": [
            {
                "from": 0,
                "to": 3
            },
            {
                "from": 1,
                "to": 4
            },
            {
                "from": 2,
                "to": 5
            }
        ],
        "initialBoard": {
            "0,-1": {
                "id": "p0",
                "color": "#a0522d",
                "pattern": "circle"
            },
            "1,-1": {
                "id": "p1",
                "color": "#483d8b",
                "pattern": "diamond"
            }
        },
        "initialHand": [
            {
                "id": "h2",
                "color": "#556b2f",
                "pattern": "lines"
            },
            {
                "id": "hn",
                "color": "#d2b48c",
                "pattern": "none"
            }
        ]
    },
    {
        "id": 4,
        "name": "Stage 5",
        "excellentMoves": 4,
        "goodMoves": 6,
        "layout": [
            {
                "q": 0,
                "r": 0,
                "target": null,
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": 1,
                "r": 0,
                "target": null,
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": 2,
                "r": -1,
                "target": {
                    "color": "#a0522d",
                    "pattern": "circle"
                },
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": -1,
                "r": 0,
                "target": {
                    "color": "#483d8b",
                    "pattern": "diamond"
                },
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": 2,
                "r": 0,
                "target": {
                    "color": "#556b2f",
                    "pattern": "lines"
                },
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": 0,
                "r": 1,
                "target": null,
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            }
        ],
        "defaultRails": [
            {
                "from": 0,
                "to": 3
            },
            {
                "from": 1,
                "to": 4
            },
            {
                "from": 2,
                "to": 5
            }
        ],
        "initialBoard": {
            "-1,0": {
                "id": "p0",
                "color": "#a0522d",
                "pattern": "circle"
            },
            "0,0": {
                "id": "p1",
                "color": "#483d8b",
                "pattern": "diamond"
            }
        },
        "initialHand": [
            {
                "id": "h2",
                "color": "#556b2f",
                "pattern": "lines"
            },
            {
                "id": "hn",
                "color": "#d2b48c",
                "pattern": "none"
            }
        ]
    },
    {
        "id": 5,
        "name": "Stage 6",
        "excellentMoves": 4,
        "goodMoves": 6,
        "layout": [
            {
                "q": 0,
                "r": 0,
                "target": null,
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": 0,
                "r": -1,
                "target": null,
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": -1,
                "r": -1,
                "target": {
                    "color": "#a0522d",
                    "pattern": "circle"
                },
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": -1,
                "r": -2,
                "target": null,
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": -1,
                "r": 0,
                "target": null,
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": 0,
                "r": -2,
                "target": {
                    "color": "#483d8b",
                    "pattern": "diamond"
                },
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": 1,
                "r": -2,
                "target": {
                    "color": "#556b2f",
                    "pattern": "lines"
                },
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            }
        ],
        "defaultRails": [
            {
                "from": 0,
                "to": 3
            },
            {
                "from": 1,
                "to": 4
            },
            {
                "from": 2,
                "to": 5
            }
        ],
        "initialBoard": {
            "0,-2": {
                "id": "p0",
                "color": "#a0522d",
                "pattern": "circle"
            },
            "0,-1": {
                "id": "p1",
                "color": "#483d8b",
                "pattern": "diamond"
            }
        },
        "initialHand": [
            {
                "id": "h2",
                "color": "#556b2f",
                "pattern": "lines"
            },
            {
                "id": "hn",
                "color": "#d2b48c",
                "pattern": "none"
            }
        ]
    },
    {
        "id": 6,
        "name": "Stage 7",
        "excellentMoves": 5,
        "goodMoves": 8,
        "layout": [
            {
                "q": 0,
                "r": 0,
                "target": null,
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": 0,
                "r": 1,
                "target": {
                    "color": "#483d8b",
                    "pattern": "diamond"
                },
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": -1,
                "r": 0,
                "target": {
                    "color": "#a0522d",
                    "pattern": "circle"
                },
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": 0,
                "r": -1,
                "target": {
                    "color": "#556b2f",
                    "pattern": "lines"
                },
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": -1,
                "r": 1,
                "target": null,
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": -2,
                "r": 1,
                "target": null,
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            }
        ],
        "defaultRails": [
            {
                "from": 0,
                "to": 3
            },
            {
                "from": 1,
                "to": 4
            },
            {
                "from": 2,
                "to": 5
            }
        ],
        "initialBoard": {
            "0,1": {
                "id": "p0",
                "color": "#a0522d",
                "pattern": "circle"
            },
            "-1,1": {
                "id": "p1",
                "color": "#483d8b",
                "pattern": "diamond"
            }
        },
        "initialHand": [
            {
                "id": "h2",
                "color": "#556b2f",
                "pattern": "lines"
            },
            {
                "id": "hn",
                "color": "#d2b48c",
                "pattern": "none"
            }
        ]
    },
    {
        "id": 7,
        "name": "Stage 8",
        "excellentMoves": 4,
        "goodMoves": 6,
        "layout": [
            {
                "q": 0,
                "r": 0,
                "target": {
                    "color": "#483d8b",
                    "pattern": "diamond"
                },
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": -1,
                "r": 1,
                "target": null,
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": -1,
                "r": 2,
                "target": {
                    "color": "#a0522d",
                    "pattern": "circle"
                },
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": -1,
                "r": 3,
                "target": null,
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": -2,
                "r": 2,
                "target": {
                    "color": "#556b2f",
                    "pattern": "lines"
                },
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            }
        ],
        "defaultRails": [
            {
                "from": 0,
                "to": 3
            },
            {
                "from": 1,
                "to": 4
            },
            {
                "from": 2,
                "to": 5
            }
        ],
        "initialBoard": {
            "0,0": {
                "id": "p0",
                "color": "#a0522d",
                "pattern": "circle"
            },
            "-1,3": {
                "id": "p1",
                "color": "#483d8b",
                "pattern": "diamond"
            }
        },
        "initialHand": [
            {
                "id": "h2",
                "color": "#556b2f",
                "pattern": "lines"
            },
            {
                "id": "hn",
                "color": "#d2b48c",
                "pattern": "none"
            }
        ]
    },
    {
        "id": 8,
        "name": "Stage 9",
        "excellentMoves": 5,
        "goodMoves": 8,
        "layout": [
            {
                "q": 0,
                "r": 0,
                "target": null,
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": 0,
                "r": 1,
                "target": {
                    "color": "#483d8b",
                    "pattern": "diamond"
                },
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": 1,
                "r": -1,
                "target": null,
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": 1,
                "r": 0,
                "target": null,
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": 2,
                "r": -1,
                "target": {
                    "color": "#a0522d",
                    "pattern": "circle"
                },
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": 0,
                "r": 2,
                "target": {
                    "color": "#556b2f",
                    "pattern": "lines"
                },
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            }
        ],
        "defaultRails": [
            {
                "from": 0,
                "to": 3
            },
            {
                "from": 1,
                "to": 4
            },
            {
                "from": 2,
                "to": 5
            }
        ],
        "initialBoard": {
            "0,1": {
                "id": "p0",
                "color": "#a0522d",
                "pattern": "circle"
            },
            "1,-1": {
                "id": "p1",
                "color": "#483d8b",
                "pattern": "diamond"
            }
        },
        "initialHand": [
            {
                "id": "h2",
                "color": "#556b2f",
                "pattern": "lines"
            },
            {
                "id": "hn",
                "color": "#d2b48c",
                "pattern": "none"
            }
        ]
    },
    {
        "id": 9,
        "name": "Stage 10",
        "excellentMoves": 5,
        "goodMoves": 8,
        "layout": [
            {
                "q": 0,
                "r": 0,
                "target": null,
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": -1,
                "r": 0,
                "target": {
                    "color": "#483d8b",
                    "pattern": "diamond"
                },
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": 0,
                "r": -1,
                "target": null,
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": 0,
                "r": -2,
                "target": null,
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": 1,
                "r": -1,
                "target": null,
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": 1,
                "r": -2,
                "target": {
                    "color": "#a0522d",
                    "pattern": "circle"
                },
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": 2,
                "r": -2,
                "target": {
                    "color": "#556b2f",
                    "pattern": "lines"
                },
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            }
        ],
        "defaultRails": [
            {
                "from": 0,
                "to": 3
            },
            {
                "from": 1,
                "to": 4
            },
            {
                "from": 2,
                "to": 5
            }
        ],
        "initialBoard": {
            "-1,0": {
                "id": "p0",
                "color": "#a0522d",
                "pattern": "circle"
            },
            "1,-1": {
                "id": "p1",
                "color": "#483d8b",
                "pattern": "diamond"
            }
        },
        "initialHand": [
            {
                "id": "h2",
                "color": "#556b2f",
                "pattern": "lines"
            },
            {
                "id": "hn",
                "color": "#d2b48c",
                "pattern": "none"
            }
        ]
    },
    {
        "id": 10,
        "name": "Stage 11",
        "excellentMoves": 5,
        "goodMoves": 8,
        "layout": [
            {
                "q": 0,
                "r": 0,
                "target": null,
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": 0,
                "r": -1,
                "target": {
                    "color": "#483d8b",
                    "pattern": "diamond"
                },
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": 1,
                "r": -2,
                "target": null,
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": 1,
                "r": -1,
                "target": null,
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": 1,
                "r": 0,
                "target": {
                    "color": "#a0522d",
                    "pattern": "circle"
                },
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": 2,
                "r": 0,
                "target": {
                    "color": "#556b2f",
                    "pattern": "lines"
                },
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            }
        ],
        "defaultRails": [
            {
                "from": 0,
                "to": 3
            },
            {
                "from": 1,
                "to": 4
            },
            {
                "from": 2,
                "to": 5
            }
        ],
        "initialBoard": {
            "1,-1": {
                "id": "p0",
                "color": "#a0522d",
                "pattern": "circle"
            },
            "1,0": {
                "id": "p1",
                "color": "#483d8b",
                "pattern": "diamond"
            }
        },
        "initialHand": [
            {
                "id": "h2",
                "color": "#556b2f",
                "pattern": "lines"
            },
            {
                "id": "hn",
                "color": "#d2b48c",
                "pattern": "none"
            }
        ]
    },
    {
        "id": 11,
        "name": "Stage 12",
        "excellentMoves": 5,
        "goodMoves": 8,
        "layout": [
            {
                "q": 0,
                "r": 0,
                "target": null,
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": 0,
                "r": 1,
                "target": {
                    "color": "#483d8b",
                    "pattern": "diamond"
                },
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": -1,
                "r": 1,
                "target": null,
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": 1,
                "r": 0,
                "target": {
                    "color": "#556b2f",
                    "pattern": "lines"
                },
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": 1,
                "r": 1,
                "target": null,
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": -2,
                "r": 2,
                "target": {
                    "color": "#a0522d",
                    "pattern": "circle"
                },
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": -1,
                "r": 2,
                "target": null,
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            }
        ],
        "defaultRails": [
            {
                "from": 0,
                "to": 3
            },
            {
                "from": 1,
                "to": 4
            },
            {
                "from": 2,
                "to": 5
            }
        ],
        "initialBoard": {
            "0,1": {
                "id": "p0",
                "color": "#a0522d",
                "pattern": "circle"
            },
            "-2,2": {
                "id": "p1",
                "color": "#483d8b",
                "pattern": "diamond"
            }
        },
        "initialHand": [
            {
                "id": "h2",
                "color": "#556b2f",
                "pattern": "lines"
            },
            {
                "id": "hn",
                "color": "#d2b48c",
                "pattern": "none"
            }
        ]
    },
    {
        "id": 12,
        "name": "Stage 13",
        "excellentMoves": 4,
        "goodMoves": 6,
        "layout": [
            {
                "q": 0,
                "r": 0,
                "target": null,
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": -1,
                "r": 1,
                "target": null,
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": -2,
                "r": 2,
                "target": {
                    "color": "#483d8b",
                    "pattern": "diamond"
                },
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": -3,
                "r": 2,
                "target": {
                    "color": "#556b2f",
                    "pattern": "lines"
                },
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": 0,
                "r": 1,
                "target": null,
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": 1,
                "r": 1,
                "target": {
                    "color": "#a0522d",
                    "pattern": "circle"
                },
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            }
        ],
        "defaultRails": [
            {
                "from": 0,
                "to": 3
            },
            {
                "from": 1,
                "to": 4
            },
            {
                "from": 2,
                "to": 5
            }
        ],
        "initialBoard": {
            "0,0": {
                "id": "p0",
                "color": "#a0522d",
                "pattern": "circle"
            },
            "1,1": {
                "id": "p1",
                "color": "#483d8b",
                "pattern": "diamond"
            }
        },
        "initialHand": [
            {
                "id": "h2",
                "color": "#556b2f",
                "pattern": "lines"
            },
            {
                "id": "hn",
                "color": "#d2b48c",
                "pattern": "none"
            }
        ]
    }

];

export const STORAGE_KEY = 'hexa_slide_userdata';
