function wind(direction) {
    return {
        type: "wind",
        direction
    }
}

/**
 * @type {
        [key: string]: {
            background: string,
            sprite: string,
            offset: { x: number, y: nunber },
            size: { x: number, y: number },
            px: number,
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
        sprite: "/sprite/uriel.gif",
        offset: { // map offset for alignment
            x: 90,
            y: 0
        },
        size: { // map size (per block)
            x: 5,
            y: 7
        },
        px: 100, // block size
        map: [
            ["barrier", "barrier", "angel"  , "barrier", "barrier"],
            ["barrier", "barrier", null     , null     , "barrier"],
            [null     , null     , wind(1)  , null     , null     ],
            [null     , "lyre"   , wind(1)  , null     , null     ],
            ["lyre"   , null     , "cloud"  , null     , null     ],
            [null     , null     , null     , "lyre"   , null     ],
            ["spawn"  , null     , null     , null     , null     ]
        ]
    }
};