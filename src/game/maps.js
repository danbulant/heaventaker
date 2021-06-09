function wind(direction) {
    return {
        type: "wind",
        direction
    }
}

const pillar = {
    type: "pillar",
    destroyable: false
}

const cloud = {
    type: "cloud",
    destroyable: true
}

/**
 * @type {
        [key: string]: {
            background: string,
            sprite: string,
            offset: { x: number, y: nunber },
            size: { x: number, y: number },
            px: number,
            steps: number,
            map: {
                x: number,
                y: number,
                type: string
            }[]
        }
    }
 */
export const maps = {
    uriel: {
        background: "level1",
        sprite: "uriel",
        next: "uriel_entrance",
        offset: { // map offset for alignment
            x: 60,
            y: 100
        },
        size: { // map size (per block)
            x: 5,
            y: 7
        },
        steps: 13,
        px: 100, // block size
        map: [
            ["barrier", "barrier", "angel"  , "barrier", "barrier"],
            ["barrier", "barrier", null     , "barrier", "barrier"],
            [pillar   , null     , null     , null     , pillar   ],
            [null     , wind(4)  , wind(4)  , wind(4)  , wind(4)  ],
            [null     , cloud    , wind(2)  , wind(2)  , pillar   ],
            [null     , "lyre"   , null     , null     , pillar   ],
            [null     , "lyre"   , "spawn"  , null     , pillar   ]
        ]
    },
    michael: {
        background: "level2",
        sprite: "uriel",
        next: "michael_heretic",
        size: {
            x: 11,
            y: 8
        },
        offset: {
            x: 40,
            y: 90
        },
        px: 100,
        steps: 23,
        map: [
            ["barrier"  , "barrier" , "barrier" , cloud     , cloud     , cloud     , cloud     , cloud     , cloud     , cloud     , cloud     ],
            ["barrier"  , "barrier" , "barrier" , cloud     , "barrier" , "barrier" , "barrier" , "barrier" , "barrier" , "pillar"  , cloud     ],
            [cloud      , cloud     , cloud     , cloud     , "barrier" , "barrier" , "barrier" , "barrier" , "barrier" , "pillar"  , cloud     ],
            [cloud      , "barrier" , "barrier" , "barrier" , "barrier" , "barrier" , "barrier" , "barrier" , null      , "angel"   , cloud     ],
            [cloud      , null      , "lyre"    , null      , null      , null      , null      , "lyre"    , null      , null      , "barrier" ],
            [null       , null      , null      , "lyre"    , "lyre"    , null      , "lyre"    , null      , "lyre"    , "lyre"    , null      ],
            ["spawn"    , null      , "lyre"    , null      , null      , "lyre"    , null      , "lyre"    , null      , null      , "barrier" ],
            ["barrier"  , "barrier" , null      , "lyre"    , null      , null      , "lyre"    , "barrier" , "barrier" , "barrier" , "barrier" ]
        ]
    }
};