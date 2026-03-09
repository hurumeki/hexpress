import type { Level } from './types';

// --- 定数 ---

export const PATH_COLORS = [
    '#fbbf24', // ゴールド
    '#3b82f6', // ブルー
    '#a855f7', // パープル
    '#22c55e', // グリーン
    '#ef4444', // ルビーレッド
];

// COLORSにCOLORS.rubyがあるか確認するため追加
export const COLORS = {
    wood: '#a0522d',
    stone: '#483d8b',
    grass: '#556b2f',
    gold: '#b8860b',
    ruby: '#ef4444',
    ink: '#2f4f4f',
    neutral: '#d2b48c'
};

export const PATTERNS = {
    CIRCLE: 'circle',
    SQUARE: 'square',
    DIAMOND: 'diamond',
    LINES: 'lines',
    DOT: 'dot',
    NONE: 'none'
} as const;

export const PATTERN_COLORS = {
    [PATTERNS.CIRCLE]: COLORS.wood,
    [PATTERNS.DIAMOND]: COLORS.stone,
    [PATTERNS.LINES]: COLORS.grass,
    [PATTERNS.SQUARE]: COLORS.gold,
    [PATTERNS.DOT]: COLORS.ink,
    [PATTERNS.NONE]: COLORS.neutral
} as const;

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
export const RAILS_3WAY = [
    { from: 0, to: 3 },
    { from: 1, to: 4 },
    { from: 2, to: 5 }
];

export const LEVELS: Level[] = [
    {
        id: 0,
        name: "Tutorial 1",
        isTutorial: true,
        excellentMoves: 2,
        goodMoves: 2,
        layout: [
            { q: 0, r: -1, target: { pattern: PATTERNS.CIRCLE }, rails: [{ from: 2, to: 5 }] },
            { q: 0, r: 0, target: null, rails: [{ from: 2, to: 5 }] },
            { q: 0, r: 1, target: null, rails: [{ from: 2, to: 5 }] }
        ],
        defaultRails: [{ from: 2, to: 5 }],
        initialBoard: {
            '0,1': { id: 't3', pattern: PATTERNS.CIRCLE }
        },
        initialHand: [
            { id: 'th1', pattern: PATTERNS.NONE },
            { id: 'th2', pattern: PATTERNS.NONE }
        ]
    },
    {
        id: 1,
        name: "Tutorial 2",
        isTutorial: true,
        excellentMoves: 2,
        goodMoves: 2,
        layout: [
            { q: 0, r: 0, target: null, rails: [{ from: 2, to: 5 }] },
            { q: 0, r: -1, target: null, rails: [{ from: 1, to: 4 }, { from: 2, to: 5 }] },
            { q: 1, r: -1, target: { pattern: PATTERNS.CIRCLE }, rails: [{ from: 1, to: 4 }] }
        ],
        defaultRails: RAILS_3WAY,
        initialBoard: {
            '0,0': { id: 'p1', pattern: PATTERNS.CIRCLE },
        },
        initialHand: [
            { id: 'h1', pattern: PATTERNS.NONE },
            { id: 'h2', pattern: PATTERNS.NONE }
        ]
    },
    {
        id: 2,
        name: "Tutorial 3",
        isTutorial: true,
        excellentMoves: 2,
        goodMoves: 2,
        layout: [
            { q: 0, r: 0, target: null, rails: [{ from: 1, to: 4 }] },
            { q: 1, r: 0, target: null, rails: [{ from: 1, to: 4 }, { from: 0, to: 3 }] },
            { q: 2, r: 0, target: { pattern: PATTERNS.CIRCLE }, rails: [{ from: 1, to: 4 }] },
            { q: 3, r: 0, target: null, rails: [{ from: 1, to: 4 }] },
            { q: 4, r: 0, target: null, rails: [{ from: 1, to: 4 }] },
        ],
        defaultRails: [{ from: 1, to: 4 }],
        initialBoard: {
            '0,0': { id: 'q1', pattern: PATTERNS.NONE }
        },
        initialHand: [
            { id: 'qh1', pattern: PATTERNS.NONE },
            { id: 'qh2', pattern: PATTERNS.CIRCLE }
        ]
    },
    {
        "id": 3,
        "name": "Rotate Triangle",
        "excellentMoves": 2,
        "goodMoves": 5,
        "layout": [
            {
                "q": 1,
                "r": -1,
                "target": {
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
                "r": 0,
                "target": {
                    "pattern": "square"
                },
                "rails": [
                    {
                        "from": 4,
                        "to": 1
                    },
                    {
                        "from": 0,
                        "to": 3
                    }
                ]
            },
            {
                "q": 1,
                "r": 0,
                "target": {
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
            }
        ],
        "defaultRails": [],
        "initialBoard": {
            "0,0": {
                "id": "p_0_0_1772707228151",
                "pattern": "diamond"
            },
            "1,-1": {
                "id": "p_1_-1_1772707523296",
                "pattern": "square"
            },
            "1,0": {
                "id": "p_1_0_1772707555346",
                "pattern": "circle"
            }
        },
        "initialHand": [
            {
                "id": "h_none_0_1772706969075",
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

                "pattern": "circle"
            },
            "0,0": {
                "id": "p1",

                "pattern": "diamond"
            }
        },
        "initialHand": [
            {
                "id": "h2",

                "pattern": "lines"
            },
            {
                "id": "hn",

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

                "pattern": "circle"
            },
            "0,-1": {
                "id": "p1",

                "pattern": "diamond"
            }
        },
        "initialHand": [
            {
                "id": "h2",

                "pattern": "lines"
            },
            {
                "id": "hn",

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

                "pattern": "circle"
            },
            "-1,1": {
                "id": "p1",

                "pattern": "diamond"
            }
        },
        "initialHand": [
            {
                "id": "h2",

                "pattern": "lines"
            },
            {
                "id": "hn",

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

                "pattern": "circle"
            },
            "-1,3": {
                "id": "p1",

                "pattern": "diamond"
            }
        },
        "initialHand": [
            {
                "id": "h2",

                "pattern": "lines"
            },
            {
                "id": "hn",

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

                "pattern": "circle"
            },
            "1,-1": {
                "id": "p1",

                "pattern": "diamond"
            }
        },
        "initialHand": [
            {
                "id": "h2",

                "pattern": "lines"
            },
            {
                "id": "hn",

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

                "pattern": "circle"
            },
            "1,-1": {
                "id": "p1",

                "pattern": "diamond"
            }
        },
        "initialHand": [
            {
                "id": "h2",

                "pattern": "lines"
            },
            {
                "id": "hn",

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

                "pattern": "circle"
            },
            "1,0": {
                "id": "p1",

                "pattern": "diamond"
            }
        },
        "initialHand": [
            {
                "id": "h2",

                "pattern": "lines"
            },
            {
                "id": "hn",

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

                "pattern": "circle"
            },
            "-2,2": {
                "id": "p1",

                "pattern": "diamond"
            }
        },
        "initialHand": [
            {
                "id": "h2",

                "pattern": "lines"
            },
            {
                "id": "hn",

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

                "pattern": "circle"
            },
            "1,1": {
                "id": "p1",

                "pattern": "diamond"
            }
        },
        "initialHand": [
            {
                "id": "h2",

                "pattern": "lines"
            },
            {
                "id": "hn",

                "pattern": "none"
            }
        ]
    }

];

export const STORAGE_KEY = 'hexa_slide_userdata';
