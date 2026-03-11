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
    },

    {
        "id": 13,
        "name": "Rotate Triangle 2",
        "excellentMoves": 3,
        "goodMoves": 6,
        "layout": [
            {
                "q": -1,
                "r": 1,
                "target": {
                    "pattern": "circle"
                },
                "rails": [
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 0,
                        "to": 3
                    }
                ]
            },
            {
                "q": 0,
                "r": 1,
                "target": {
                    "pattern": "square"
                },
                "rails": [
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
                    "pattern": "diamond"
                },
                "rails": [
                    {
                        "from": 0,
                        "to": 3
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
                "target": null,
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    },
                    {
                        "from": 5,
                        "to": 2
                    }
                ]
            },
            {
                "q": 1,
                "r": 1,
                "target": null,
                "rails": [
                    {
                        "from": 1,
                        "to": 4
                    },
                    {
                        "from": 0,
                        "to": 3
                    }
                ]
            },
            {
                "q": 0,
                "r": -1,
                "target": null,
                "rails": [
                    {
                        "from": 2,
                        "to": 5
                    },
                    {
                        "from": 1,
                        "to": 4
                    }
                ]
            }
        ],
        "defaultRails": [],
        "initialBoard": {
            "0,0": {
                "id": "p_0_0_1773027521300",
                "pattern": "circle"
            },
            "-1,1": {
                "id": "p_-1_1_1773027523303",
                "pattern": "square"
            },
            "0,1": {
                "id": "p_0_1_1773027523969",
                "pattern": "diamond"
            },
            "-2,2": {
                "id": "p_-2_2_1773027697596",
                "pattern": "none"
            },
            "1,1": {
                "id": "p_1_1_1773027699884",
                "pattern": "none"
            },
            "0,-1": {
                "id": "p_0_-1_1773027759341",
                "pattern": "none"
            }
        },
        "initialHand": [
            {
                "id": "h_none_0_1773027528097",
                "pattern": "none"
            }
        ]
    }

    ,
    {
        "id": 14,
        "name": "passing each other",
        "excellentMoves": 6,
        "goodMoves": 11,
        "layout": [
            {
                "q": -1,
                "r": 0,
                "target": null,
                "rails": [
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
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": -1,
                "r": -1,
                "target": {
                    "pattern": "square"
                },
                "rails": [
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
                    "pattern": "circle"
                },
                "rails": [
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": 0,
                "r": 0,
                "target": null,
                "rails": [
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
                "r": 3,
                "target": null,
                "rails": [
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": 0,
                "r": 2,
                "target": null,
                "rails": [
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            }
        ],
        "defaultRails": [],
        "initialBoard": {
            "-1,0": {
                "id": "p_-1_0_1773029428058",
                "pattern": "none"
            },
            "-1,-2": {
                "id": "p_-1_-2_1773029443789",
                "pattern": "none"
            },
            "-1,-1": {
                "id": "p_-1_-1_1773029467563",
                "pattern": "circle"
            },
            "0,0": {
                "id": "p_0_0_1773029775661",
                "pattern": "none"
            },
            "0,1": {
                "id": "p_0_1_1773029779211",
                "pattern": "square"
            },
            "0,3": {
                "id": "p_0_3_1773029845372",
                "pattern": "none"
            },
            "0,2": {
                "id": "p_0_2_1773029924142",
                "pattern": "none"
            }
        },
        "initialHand": [
            {
                "id": "h_none_0_1773027528097",
                "pattern": "none"
            }
        ]
    }
    ,
    {
        "id": 15,
        "name": "Ring",
        "excellentMoves": 5,
        "goodMoves": 9,
        "layout": [
            {
                "q": 1,
                "r": -1,
                "target": {
                    "pattern": "square"
                },
                "rails": [
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
                "target": {
                    "pattern": "dot"
                },
                "rails": [
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
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": 0,
                "r": 1,
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
            },
            {
                "q": 0,
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
                    }
                ]
            }
        ],
        "defaultRails": [],
        "initialBoard": {
            "0,1": {
                "id": "p_0_1_1773032313081",
                "pattern": "circle"
            },
            "-1,1": {
                "id": "p_-1_1_1773032314149",
                "pattern": "square"
            },
            "-1,0": {
                "id": "p_-1_0_1773032315427",
                "pattern": "diamond"
            },
            "0,-1": {
                "id": "p_0_-1_1773032316888",
                "pattern": "lines"
            },
            "1,-1": {
                "id": "p_1_-1_1773032318217",
                "pattern": "dot"
            },
            "1,0": {
                "id": "p_1_0_1773032320287",
                "pattern": "none"
            }
        },
        "initialHand": [
            {
                "id": "h_none_0_1773027528097",
                "pattern": "none"
            }
        ]
    }
    ,
    {
        "id": 16,
        "name": "Windmill",
        "excellentMoves": 8,
        "goodMoves": 11,
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
                    }
                ]
            },
            {
                "q": 1,
                "r": 0,
                "target": null,
                "rails": [
                    {
                        "from": 1,
                        "to": 4
                    }
                ]
            },
            {
                "q": 2,
                "r": 0,
                "target": {
                    "pattern": "square"
                },
                "rails": [
                    {
                        "from": 1,
                        "to": 4
                    }
                ]
            }
        ],
        "defaultRails": [],
        "initialBoard": {
            "0,-2": {
                "id": "p_0_-2_1773033430293",
                "pattern": "circle"
            },
            "-2,2": {
                "id": "p_-2_2_1773033431712",
                "pattern": "square"
            },
            "2,0": {
                "id": "p_2_0_1773033432730",
                "pattern": "diamond"
            }
        },
        "initialHand": [
            {
                "id": "h_none_0_1773027528097",
                "pattern": "none"
            },
            {
                "id": "h_none_3_1773032916693",
                "pattern": "none"
            },
            {
                "id": "h_none_2_1773033496010",
                "pattern": "none"
            },
            {
                "id": "h_none_3_1773033501998",
                "pattern": "none"
            },
            {
                "id": "h_none_5_1773033505386",
                "pattern": "none"
            }
        ]
    }
    ,
    {
        "id": 17,
        "name": "Frog",
        "excellentMoves": 5,
        "goodMoves": 9,
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
                "target": null,
                "rails": [
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
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": 0,
                "r": -1,
                "target": {
                    "pattern": "circle"
                },
                "rails": [
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
                    "pattern": "square"
                },
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    }
                ]
            }
        ],
        "defaultRails": [],
        "initialBoard": {
            "0,-1": {
                "id": "p_0_-1_1773045116481",
                "pattern": "square"
            },
            "2,-1": {
                "id": "p_2_-1_1773045119345",
                "pattern": "circle"
            },
            "-1,1": {
                "id": "p_-1_1_1773045124973",
                "pattern": "none"
            },
            "1,1": {
                "id": "p_1_1_1773045128814",
                "pattern": "none"
            }
        },
        "initialHand": [
            {
                "id": "h_none_0_1773027528097",
                "pattern": "none"
            },
            {
                "id": "h_none_3_1773032916693",
                "pattern": "none"
            },
            {
                "id": "h_none_2_1773044906750",
                "pattern": "none"
            }
        ]
    }
    ,
    {
        "id": 18,
        "name": "M",
        "excellentMoves": 11,
        "goodMoves": 16,
        "layout": [
            {
                "q": -1,
                "r": 0,
                "target": null,
                "rails": [
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
                "target": null,
                "rails": [
                    {
                        "from": 1,
                        "to": 4
                    }
                ]
            },
            {
                "q": 1,
                "r": -1,
                "target": null,
                "rails": [
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
                    "pattern": "diamond"
                },
                "rails": [
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
                    "pattern": "circle"
                },
                "rails": [
                    {
                        "from": 1,
                        "to": 4
                    }
                ]
            },
            {
                "q": -1,
                "r": 1,
                "target": null,
                "rails": [
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
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": 3,
                "r": -2,
                "target": null,
                "rails": [
                    {
                        "from": 1,
                        "to": 4
                    }
                ]
            },
            {
                "q": 1,
                "r": 0,
                "target": {
                    "pattern": "square"
                },
                "rails": [
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
            "-1,1": {
                "id": "p_-1_1_1773059846856",
                "pattern": "circle"
            },
            "0,0": {
                "id": "p_0_0_1773060104052",
                "pattern": "square"
            },
            "1,-1": {
                "id": "p_1_-1_1773060105790",
                "pattern": "diamond"
            }
        },
        "initialHand": [
            {
                "id": "h_none_0_1773027528097",
                "pattern": "none"
            },
            {
                "id": "h_none_3_1773032916693",
                "pattern": "none"
            },
            {
                "id": "h_none_2_1773044906750",
                "pattern": "none"
            },
            {
                "id": "h_none_3_1773060134800",
                "pattern": "none"
            },
            {
                "id": "h_none_4_1773060142641",
                "pattern": "none"
            }
        ]
    }
    ,

    {
        "id": 19,
        "name": "Practice",
        "excellentMoves": 5,
        "goodMoves": 10,
        "layout": [
            {
                "q": 0,
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
                "q": -1,
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
                    "pattern": "square"
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
            }
        ],
        "defaultRails": [],
        "initialBoard": {
            "1,0": {
                "id": "p_1_0_1773140304562",
                "pattern": "circle"
            },
            "0,0": {
                "id": "p_0_0_1773141333456",
                "pattern": "diamond"
            },
            "-1,0": {
                "id": "p_-1_0_1773141335710",
                "pattern": "square"
            }
        },
        "initialHand": [
            {
                "id": "h_none_0_1773140314508",
                "pattern": "none"
            },
            {
                "id": "h_none_1_1773140436504",
                "pattern": "none"
            }
        ]
    }
    ,
    {
        "id": 20,
        "name": "Bone",
        "excellentMoves": 5,
        "goodMoves": 10,
        "layout": [
            {
                "q": 0,
                "r": 0,
                "target": null,
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    }
                ]
            },
            {
                "q": 0,
                "r": 1,
                "target": {
                    "pattern": "circle"
                },
                "rails": [
                    {
                        "from": 1,
                        "to": 4
                    }
                ]
            },
            {
                "q": 1,
                "r": 1,
                "target": {
                    "pattern": "square"
                },
                "rails": [
                    {
                        "from": 1,
                        "to": 4
                    }
                ]
            },
            {
                "q": 2,
                "r": 1,
                "target": {
                    "pattern": "diamond"
                },
                "rails": [
                    {
                        "from": 1,
                        "to": 4
                    }
                ]
            },
            {
                "q": -1,
                "r": 2,
                "target": null,
                "rails": [
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
                "q": 3,
                "r": 1,
                "target": {
                    "pattern": "lines"
                },
                "rails": [
                    {
                        "from": 1,
                        "to": 4
                    }
                ]
            },
            {
                "q": 3,
                "r": 2,
                "target": null,
                "rails": [
                    {
                        "from": 0,
                        "to": 3
                    }
                ]
            },
            {
                "q": 4,
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
                "q": 4,
                "r": 0,
                "target": null,
                "rails": [
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            }
        ],
        "defaultRails": [],
        "initialBoard": {
            "4,0": {
                "id": "p_4_0_1773142353375",
                "pattern": "circle"
            },
            "3,2": {
                "id": "p_3_2_1773142354644",
                "pattern": "square"
            },
            "-1,2": {
                "id": "p_-1_2_1773142356890",
                "pattern": "diamond"
            },
            "0,0": {
                "id": "p_0_0_1773142361330",
                "pattern": "lines"
            }
        },
        "initialHand": [
            {
                "id": "h_none_0_1773142367897",
                "pattern": "none"
            },
            {
                "id": "h_none_1_1773142368068",
                "pattern": "none"
            },
            {
                "id": "h_none_2_1773142368220",
                "pattern": "none"
            },
            {
                "id": "h_none_3_1773142368378",
                "pattern": "none"
            },
            {
                "id": "h_none_4_1773142391586",
                "pattern": "none"
            },
            {
                "id": "h_none_5_1773142391915",
                "pattern": "none"
            }
        ]
    }
    ,
    {
        "id": 21,
        "name": "Diamond",
        "excellentMoves": 4,
        "goodMoves": 8,
        "layout": [
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
                "q": -1,
                "r": 2,
                "target": {
                    "pattern": "square"
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
        "defaultRails": [],
        "initialBoard": {
            "0,0": {
                "id": "p_0_0_1773150795752",
                "pattern": "none"
            },
            "0,-1": {
                "id": "p_0_-1_1773151036428",
                "pattern": "circle"
            },
            "1,-1": {
                "id": "p_1_-1_1773151419519",
                "pattern": "diamond"
            },
            "-1,1": {
                "id": "p_-1_1_1773151423503",
                "pattern": "lines"
            },
            "1,-2": {
                "id": "p_1_-2_1773151425398",
                "pattern": "none"
            },
            "-1,0": {
                "id": "p_-1_0_1773151425658",
                "pattern": "none"
            },
            "1,0": {
                "id": "p_1_0_1773151425917",
                "pattern": "none"
            },
            "0,1": {
                "id": "p_0_1_1773151428638",
                "pattern": "square"
            },
            "-1,2": {
                "id": "p_-1_2_1773151429215",
                "pattern": "none"
            }
        },
        "initialHand": [
            {
                "id": "h_none_0_1773150698456",
                "pattern": "none"
            }
        ]
    }
    ,
    {
        "id": 22,
        "name": "Diamond 2",
        "excellentMoves": 4,
        "goodMoves": 8,
        "layout": [
            {
                "q": 0,
                "r": 0,
                "target": {
                    "pattern": "dot"
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
                "q": 1,
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
                "q": 0,
                "r": 1,
                "target": {
                    "pattern": "square"
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
        "defaultRails": [],
        "initialBoard": {
            "0,0": {
                "id": "p_0_0_1773151791189",
                "pattern": "dot"
            },
            "-1,0": {
                "id": "p_-1_0_1773151699333",
                "pattern": "circle"
            },
            "1,0": {
                "id": "p_1_0_1773151704692",
                "pattern": "square"
            },
            "1,-2": {
                "id": "p_1_-2_1773151703773",
                "pattern": "diamond"
            },
            "-1,2": {
                "id": "p_-1_2_1773151707058",
                "pattern": "lines"
            },
            "0,-1": {
                "id": "p_0_-1_1773151711877",
                "pattern": "none"
            },
            "1,-1": {
                "id": "p_1_-1_1773151712074",
                "pattern": "none"
            },
            "0,1": {
                "id": "p_0_1_1773151712315",
                "pattern": "none"
            },
            "-1,1": {
                "id": "p_-1_1_1773151712517",
                "pattern": "none"
            }
        },
        "initialHand": [
            {
                "id": "h_none_0_1773150698456",
                "pattern": "none"
            }
        ]
    }
    ,
    {
        "id": 23,
        "name": "Diamond 3",
        "excellentMoves": 4,
        "goodMoves": 8,
        "layout": [
            {
                "q": 0,
                "r": 0,
                "target": {
                    "pattern": "dot"
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
                "q": -1,
                "r": 0,
                "target": {
                    "pattern": "square"
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
                "q": -1,
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
        "defaultRails": [],
        "initialBoard": {
            "0,0": {
                "id": "p_0_0_1773151791189",
                "pattern": "dot"
            },
            "-1,0": {
                "id": "p_-1_0_1773151699333",
                "pattern": "circle"
            },
            "1,0": {
                "id": "p_1_0_1773151704692",
                "pattern": "square"
            },
            "1,-2": {
                "id": "p_1_-2_1773151703773",
                "pattern": "diamond"
            },
            "-1,2": {
                "id": "p_-1_2_1773151707058",
                "pattern": "lines"
            },
            "0,-1": {
                "id": "p_0_-1_1773151711877",
                "pattern": "none"
            },
            "1,-1": {
                "id": "p_1_-1_1773151712074",
                "pattern": "none"
            },
            "0,1": {
                "id": "p_0_1_1773151712315",
                "pattern": "none"
            },
            "-1,1": {
                "id": "p_-1_1_1773151712517",
                "pattern": "none"
            }
        },
        "initialHand": [
            {
                "id": "h_none_0_1773150698456",
                "pattern": "none"
            }
        ]
    }
    ,
    {
        "id": 24,
        "name": "Save a move",
        "excellentMoves": 7,
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
                "q": 2,
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
            },
            {
                "q": 1,
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
                "q": 3,
                "r": -2,
                "target": {
                    "pattern": "square"
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
                "q": 2,
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
        "defaultRails": [],
        "initialBoard": {
            "0,0": {
                "id": "p_0_0_1773152365560",
                "pattern": "circle"
            },
            "1,0": {
                "id": "p_1_0_1773152370128",
                "pattern": "diamond"
            },
            "0,1": {
                "id": "p_0_1_1773152373786",
                "pattern": "square"
            },
            "1,-1": {
                "id": "p_1_-1_1773152376065",
                "pattern": "lines"
            },
            "-1,0": {
                "id": "p_-1_0_1773152379157",
                "pattern": "none"
            },
            "0,-1": {
                "id": "p_0_-1_1773152379372",
                "pattern": "none"
            },
            "1,-2": {
                "id": "p_1_-2_1773152379590",
                "pattern": "none"
            },
            "2,-2": {
                "id": "p_2_-2_1773152379792",
                "pattern": "none"
            },
            "2,-1": {
                "id": "p_2_-1_1773152380041",
                "pattern": "none"
            },
            "2,0": {
                "id": "p_2_0_1773152380267",
                "pattern": "none"
            },
            "1,1": {
                "id": "p_1_1_1773152380668",
                "pattern": "none"
            },
            "0,2": {
                "id": "p_0_2_1773152380918",
                "pattern": "none"
            },
            "-1,2": {
                "id": "p_-1_2_1773152381144",
                "pattern": "none"
            },
            "-1,1": {
                "id": "p_-1_1_1773152381751",
                "pattern": "none"
            },
            "-2,2": {
                "id": "p_-2_2_1773152418717",
                "pattern": "none"
            },
            "1,2": {
                "id": "p_1_2_1773152419100",
                "pattern": "none"
            },
            "3,-2": {
                "id": "p_3_-2_1773152419545",
                "pattern": "none"
            },
            "0,-2": {
                "id": "p_0_-2_1773152419925",
                "pattern": "none"
            }
        },
        "initialHand": [
            {
                "id": "h_none_0_1773150698456",
                "pattern": "none"
            }
        ]
    }
    ,
    {
        "id": 25,
        "name": "mikaku",
        "excellentMoves": 11,
        "goodMoves": 12,
        "layout": [
            {
                "q": 0,
                "r": 0,
                "target": null,
                "rails": [
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
                "target": {
                    "pattern": "square"
                },
                "rails": [
                    {
                        "from": 2,
                        "to": 5
                    }
                ]
            },
            {
                "q": -2,
                "r": 0,
                "target": {
                    "pattern": "lines"
                },
                "rails": [
                    {
                        "from": 1,
                        "to": 4
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
                        "from": 1,
                        "to": 4
                    }
                ]
            },
            {
                "q": -3,
                "r": 0,
                "target": null,
                "rails": [
                    {
                        "from": 1,
                        "to": 4
                    }
                ]
            },
            {
                "q": 2,
                "r": 0,
                "target": null,
                "rails": [
                    {
                        "from": 1,
                        "to": 4
                    }
                ]
            },
            {
                "q": 0,
                "r": -1,
                "target": {
                    "pattern": "circle"
                },
                "rails": [
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
                        "from": 2,
                        "to": 5
                    }
                ]
            }
        ],
        "defaultRails": [],
        "initialBoard": {
            "0,-1": {
                "id": "p_0_-1_1773189902527",
                "pattern": "square"
            },
            "-1,1": {
                "id": "p_-1_1_1773189903679",
                "pattern": "circle"
            },
            "0,0": {
                "id": "p_0_0_1773190350107",
                "pattern": "diamond"
            },
            "-1,0": {
                "id": "p_-1_0_1773190353206",
                "pattern": "lines"
            }
        },
        "initialHand": [
            {
                "id": "h_none_0_1773189906391",
                "pattern": "none"
            },
            {
                "id": "h_none_1_1773189906559",
                "pattern": "none"
            },
            {
                "id": "h_none_2_1773189906742",
                "pattern": "none"
            },
            {
                "id": "h_none_3_1773189908763",
                "pattern": "none"
            },
            {
                "id": "h_none_5_1773189913114",
                "pattern": "none"
            }
        ]
    }
];

export const STORAGE_KEY = 'hexa_slide_userdata';
