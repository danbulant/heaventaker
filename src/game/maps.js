function wind(direction) {
    return {
        type: "wind",
        direction
    }
}

const pillar = {
    type: "cloud",
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
        steps: 14,
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
    }
};