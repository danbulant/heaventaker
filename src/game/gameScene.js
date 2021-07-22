import Phaser, { Animations } from "phaser";
import { gameActive, menuActive, page } from "../stores/gameActive";
import { steps } from "../stores/step";
import { keys } from "./input";
import { dialog } from "../stores/dialog.js";

const textureWidth = 100;

var stepNum;
steps.subscribe(t => {
    stepNum = t;
});
var paused;
menuActive.subscribe(t => {
    paused = t;
});

var fpsBuffer = [];
export const shared = {
    lastUpdate: null
};

export class GameScene extends Phaser.Scene {
    constructor(map) {
        super({
            key: "GameScene",
            active: true,
            physics: {
                default: "arcade"
            }
        });
        /** @type {{
            background: string,
            sprite: string,
            next: string,
            offset: { x: number, y: nunber },
            size: { x: number, y: number },
            px: number,
            steps: number,
            map: (string | null | {
                type: string,
                direction?: number
            })[][],
            fieldFlags: {
                stopsClouds?: boolean
            }[][]
        }} */
        this.map = map;
        steps.set(map.steps);
    }

    unload() {
        this.container.destroy();
        delete this.items;
        delete this.winds;
    }

    preload() {
        this.load.setBaseURL();
        this.load.image("level1", "./sprite/level1.webp");
        this.load.image("level2", "./sprite/level2.webp");
        this.load.image("level3", "./sprite/level3.webp");
        this.load.image("lyre", "./sprite/lyre.webp");
        this.load.image("cloud", "./sprite/clouds.webp");
        this.load.image("pillar", "./sprite/pillar.webp");
        this.load.image("key", "./sprite/key.webp");
        this.load.image("lock", "./sprite/lock.webp");
        this.load.spritesheet("wind", "./sprite/wind.png", { frameWidth: textureWidth });
        this.load.spritesheet("uriel", "./sprite/uriel.png", { frameWidth: textureWidth });
        this.load.spritesheet("michael", "./sprite/michael.png", { frameWidth: textureWidth });
        this.load.spritesheet("spawn", "./sprite/yahweh.png", { frameWidth: textureWidth });
        this.load.spritesheet("azrael", "./sprite/azrael.png", { frameWidth: textureWidth });
        this.load.spritesheet("celestine", "./sprite/celestine.png", { frameWidth: textureWidth });
        this.load.spritesheet("gabriel", "./sprite/gabriel.png", { frameWidth: textureWidth });
        this.load.spritesheet("uziel", "./sprite/uziel.png", { frameWidth: textureWidth });
        this.load.spritesheet("yahweh", "./sprite/yahweh.png", { frameWidth: textureWidth });
        this.load.bitmapFont("gem", "fonts/gem/font.png", "fonts/gem/font.xml");
    }

    create() {
        this.input.on("keydown", function() {		
            if (this.game.sound.context.state === 'suspended') {
                this.game.sound.context.resume();
            }
        });
        this.createMap();
        window.addEventListener("resize", () => {
            this.calculateScale();
        });
    }

    calculateScale() {
        const maxWidth = innerWidth * 0.8 - (document.body.clientHeight / 1080 * 615 * 1.15);
        const maxHeight = innerHeight * 0.8;
        const targetWidth = this.originalWidth + this.map.offset.x * 2;
        const targetHeight = this.originalHeight + this.map.offset.y * 2;

        const xScale = maxWidth / targetWidth;
        const yScale = maxHeight / targetHeight;
        this.container.scale = Math.min(xScale, yScale);
    }

    createMap() {
        console.log(this.map);

        steps.set(this.map.steps);
        this.container = this.add.container();
        this.originalWidth = this.map.size.x * this.map.px;
        this.originalHeight = this.map.size.y * this.map.px;
        this.grid = this.add.container(this.map.offset.x - this.originalWidth / 2, this.map.offset.y - this.originalHeight / 2);
        this.calculateScale();

        this.background = this.add.image(this.container.width / 2, this.container.height / 2, this.map.background);
        this.container.add(this.background);
        this.container.add(this.grid);

        /**
         * @type {{ type: string, direction?: number, sprite: Phaser.GameObjects.Sprite, animated: boolean }[][]}
         */
        this.items = new Array(this.map.map.length);
        /**
         * @type {{ type: string, direction?: number, sprite: Phaser.GameObjects.Sprite, animated: boolean, shouldPropagate?: boolean }[][]}
         */
        this.winds = new Array(this.map.map.length);
        /**
         * @type {{ type: string, direction?: number, sprite: Phaser.GameObjects.Sprite, animated: boolean, shouldPropagate?: boolean }[][]}
         */
        this.sourceWinds = new Array(this.map.map.length);
        /**
         * @type {{ stopsClouds?: boolean }[][]}
         */
        this.flags = new Array(this.map.map.length);
        for(var y in this.map.map) {
            var row = this.map.map[y];
            
            for(var x in row) {
                if(!this.items[x]) {
                    this.items[x] = new Array(row.length);
                    this.winds[x] = new Array(row.length);
                    this.sourceWinds[x] = new Array(row.length);
                    this.flags[x] = new Array(this.map.fieldFlags && this.map.fieldFlags[y] && this.map.fieldFlags[y].length || 0);
                }
                if(this.map.fieldFlags && this.map.fieldFlags[y] && this.map.fieldFlags[y][x]) {
                    this.flags[x][y] = this.map.fieldFlags[y][x];
                } else {
                    this.flags[x][y] = null;
                }
                var item = row[x];
                if(!item) {
                    this.items[x][y] = null;
                    this.winds[x][y] = null;
                    this.sourceWinds[x][y] = null;
                    continue;
                }
                if(item.type === null) {
                    this.items[x][y] = item;
                    this.winds[x][y] = null;
                    this.sourceWinds[x][y] = null;
                    continue;
                }
                if(typeof item === "string") {
                    item = {
                        type: item
                    }
                }
                item.direction = item.direction ?? 0;
                y = parseInt(y);
                x = parseInt(x);
                if(item.type !== "barrier") {
                    var type = item.type;
                    if(type === "angel") {
                        type = this.map.sprite;
                        item.texture = type;
                    }
                    if(this.textures.get(type).frameTotal > 1) {
                        var sprite = this.add.sprite(x * this.map.px, y * this.map.px);
                        item.animated = true;
                        if(!this.anims.exists(type)) {
                            this.anims.create({
                                key: type,
                                frames: this.anims.generateFrameNumbers(type, {
                                    start: 0
                                }),
                                frameRate: 10,
                                repeat: -1
                            });
                        }
                        sprite.play(type);
                    } else {
                        var sprite = this.add.sprite(x * this.map.px, y * this.map.px, type);
                        item.animated = false;
                    }
                    sprite.scale = this.map.px / 100;
                    sprite.setRotation(item.direction * Math.PI / 2);
                    this.grid.add(sprite);
                    item.sprite = sprite;

                    if(item.type === "spawn") {
                        /** @type {{ x: number, y: number, hasKey: boolean }} */
                        this.player = item;
                        this.player.x = x;
                        this.player.y = y;
                        this.player.hasKey = false;
                    }
                    if(item.type === "angel") {
                        this.angel = item;
                        this.angel.x = x;
                        this.angel.y = y;
                    }
                    if(item.type !== "wind") {
                        item.sprite.setDepth(1);
                    } else {
                        item.sprite.setDepth(0);
                    }
                    this.children.queueDepthSort();
                } else {
                    item.sprite = null;
                }
                if(item.type !== "wind") {
                    this.items[x][y] = item;
                    this.winds[x][y] = null;
                } else {
                    this.items[x][y] = null;
                    this.winds[x][y] = item;
                    this.sourceWinds[x][y] = item;
                }
            }
        }
        this.fpsText = this.add.bitmapText(0, this.container.height / 2, "gem", "");
        this.container.add(this.fpsText);
        this.propagateWinds(true);
        this.propagateWinds();
        if(window.location.hostname === "localhost") {
            this.physics.config.debug = true;
            this.physics.world.createDebugGraphic();
        }
    }

    move(fromX, fromY, toX, toY, onComplete = () => {}) {
        var item = this.items[fromX][fromY];
        this.tweens.add({
            targets: item.sprite,
            onComplete,
            x: toX * this.map.px,
            y: toY * this.map.px,
            duration: 400
        });
        this.items[fromX][fromY] = null;
        this.items[toX][toY] = item;
    }

    getMovementFromDirection(direction) {
        switch(direction) {
            case 1:
                return { x: 0, y: -1 };
            case 2:
                return { x: 1, y: 0 };
            case 3:
                return { x: 0, y: 1 };
            case 4:
                return { x: -1, y: 0 };
            default:
                return { x: 0, y: 0 };
        }
    }

    isWindActive(x, y) {
        if(!this.winds[x] || !this.winds[x][y]) return false;
        if(x < 0 || y < 0 || x > this.map.size.x || y > this.map.size.y) throw new Error(`Wind out of bounds at ${x} ${y} in map ${this.map.background}`);
        var mov = this.getMovementFromDirection(this.winds[x][y].direction);
        if(mov.x === 0 && mov.y === 0) throw new Error(`Wind without direction at ${x} ${y} in map ${this.map.background}`);
        if(this.items[x][y] && this.items[x][y].type !== "wind" && this.items[x][y].type !== "spawn") {
            return false;
        }
        if(!this.winds[x-mov.x] || !this.winds[x-mov.x][y-mov.y]) {
            return true;
        }
        return this.isWindActive(x-mov.x, y-mov.y);
    }

    /**
     * Checks if the sprite at X Y can be destroyed, and if yes, destroys it.
     */
    tryDestroy(toX, toY) {
        if(this.items[toX][toY].destroyable) {
            this.items[toX][toY].sprite.alpha = 0;
            this.items[toX][toY].sprite.destroy();
            this.items[toX][toY] = null;
            this.canMove = false;
            setTimeout(() => {
                this.canMove = true;
            }, 400);
            return true;
        }
    }

    /**
     * Propagates winds as needed.
     */
    propagateWinds(force) {
        const buf = [];
        for(let x in this.winds) {
            if(!this.sourceWinds[x]) continue;
            for(let y in this.winds[x]) {
                if(this.winds[x][y] && !this.sourceWinds[x][y]) {
                    buf.push(this.winds[x][y].sprite);
                }
            }
        }
        this.winds = new Array(this.items.length);
        for(let x in this.items) {
            this.winds[x] = new Array(this.map.size.x);
        }
        for(let x in this.items) {
            x = parseInt(x);
            for(let y in this.items[x]) {
                y = parseInt(y);
                if(!this.sourceWinds[x] || !this.sourceWinds[x][y]) continue;
                const item = this.sourceWinds[x][y];
                if(item.type !== "wind") continue;
                this.winds[x][y] = item;
                if(!item.shouldPropagate) continue;
                const move = this.getMovementFromDirection(item.direction);
                if(!move.x && !move.y) throw new Error(`Wind must have a valid direction (at ${x} ${y} of map ${this.map.background}`);

                if(this.items[x] && this.items[x][y] && this.items[x][y].type) {
                    // hide the wind
                    this.sourceWinds[x][y].sprite.setAlpha(0);
                    // don't propagate if source hidden under wind.
                    continue;
                } else {
                    if(this.sourceWinds[x][y].sprite.alpha !== 1)
                        this.sourceWinds[x][y].sprite.setAlpha(1);
                }
                var type = item.type;
                var direction = item.direction;

                while(x < this.map.size.x && y < this.map.size.y && x > 0 && y > 0) {
                    x += move.x;
                    y += move.y;

                    if(!force && this.items[x] && this.items[x][y] && this.items[x][y].type) break;
                    if((this.winds[x] && this.winds[x][y]) || (this.sourceWinds[x] && this.sourceWinds[x][y])) continue;

                    if(!this.items[x] || !this.items[x][y] || !this.items[x][y].type) {                        
                        let item = { type: "wind", direction: direction };
                        var sprite = buf.pop();
                        if(!sprite) {
                            var sprite = this.add.sprite(x * this.map.px, y * this.map.px);
                            item.animated = true;
                            if(!this.anims.exists(type)) {
                                this.anims.create({
                                    key: type,
                                    frames: this.anims.generateFrameNumbers(type, {
                                        start: 0
                                    }),
                                    frameRate: 10,
                                    repeat: -1
                                });
                            }
                            sprite.play(type);
                            sprite.scale = this.map.px / 100;
                            sprite.setRotation(item.direction * Math.PI / 2);
                            this.grid.add(sprite);
                        } else {
                            sprite.x = x * this.map.px;
                            sprite.y = y * this.map.px;
                            sprite.setRotation(item.direction * Math.PI / 2);
                            sprite.setAlpha(1);
                        }
                        item.sprite = sprite;
                        item.sprite.setDepth(0);
                        this.children.queueDepthSort();
                        if(!this.winds[x]) this.winds[x] = [];
                        this.winds[x][y] = item;
                    }

                    if(this.flags[x] && this.flags[x][y] && this.flags[x][y].stopsClouds) break;
                }
            }
        }
        for(const unused of buf) {
            unused.setAlpha(0);
        }
    }

    movePlayer(moveX, moveY, fromWind = false) {
        if(!this.canMove) return;
        var toX = this.player.x + moveX;
        var toY = this.player.y + moveY;
        if(toX > this.map.size.x - 1 || toX < 0 || toY > this.map.size.y - 1 || toY < 0) return;
        if(this.items[toX][toY] && this.items[toX][toY].type) {
            if(this.items[toX][toY].type === "key") {
                this.items[toX][toY].sprite.destroy();
                this.items[toX][toY] = null;
                this.player.hasKey = true;
            } else if(fromWind) return;
            else if(this.items[toX][toY].type === "lock") {
                if(!this.player.hasKey) return;
                this.items[toX][toY].sprite.destroy();
                this.items[toX][toY] = null;
                this.propagateWinds();
            } else if(this.items[toX][toY].type !== "lyre" && this.tryDestroy(toX, toY)) {
                steps.update(t => --t);
                if(stepNum <= 0) {
                    this.unload();
                    this.createMap();
                    return;
                }
                this.propagateWinds();
                return;
            } else if(this.items[toX] && this.items[toX][toY].type === "lyre" && this.items[toX + moveX] && (!this.items[toX + moveX][toY + moveY] || !this.items[toX + moveX][toY + moveY].type)) {
                if(toX + moveX > this.map.size.x - 1|| toX + moveX < 0 || toY + moveY > this.map.size.y - 1 || toY + moveY < 0) return;
                if(this.items[toX + moveX][toY + moveY] && this.items[toX + moveX][toY + moveY].type !== "wind") return;
                if(stepNum <= 0) {
                    this.unload();
                    this.createMap();
                    return;
                }
                this.canMove = false;
                this.move(toX, toY, toX + moveX, toY + moveY, () => {
                    this.canMove = true;
                    this.propagateWinds();
                });
                return;
            } else return;
        }
        if(stepNum <= 0) {
            this.unload();
            this.createMap();
            return;
        }
        this.canMove = false;
        if(!fromWind) {
            steps.update(t => --t);
        }
        this.move(this.player.x, this.player.y, toX, toY, () => {
            this.canMove = true;
            this.player.x = toX;
            this.player.y = toY;
            if(!fromWind && (!this.winds[toX] || !this.winds[toX][toY])) this.checkAngel();
        });
    }

    checkAngel() {
        var xdiff = Math.abs(this.player.x - this.angel.x);
        var ydiff = Math.abs(this.player.y - this.angel.y);
        if((xdiff === 0 && ydiff === 1) || (xdiff === 1 && ydiff === 0)) {
            var next = dialog.findIndex(t => t.name === this.map.next);
            page.set(next);
            gameActive.set(false);
        }
    }

    canMove = true;

    update(time, delta) {
        shared.lastUpdate = time;
        fpsBuffer.push(delta);
        if(fpsBuffer.length > 200) fpsBuffer.shift();

        this.container.x = this.cameras.main.width / 2 - this.container.width / 2;
        this.container.y = this.cameras.main.height / 2 - this.container.height / 2;
        if(keys.wasKeyPressed("pause")) {
            menuActive.set(!paused);
        }

        if(paused) return;

        // debug mode
        if(keys.wasKeyPressed("debug")) {
            this.physics.config.debug = !this.physics.config.debug;
            console.log("Toggled debug mode", this.physics.config.debug ? "on" : "off");
            if(this.physics.config.debug) this.physics.world.createDebugGraphic();
            this.physics.world.drawDebug = this.physics.config.debug;
            if(!this.physics.config.debug) {
                this.physics.world.debugGraphic.destroy();
                this.fpsText.setText("");
            }
        }
        if(keys.isKeyPressed("debug") && keys.isKeyPressed("debugCrash")) throw new Error("Debug crash");

        if(this.physics.config.debug) {
            const fps = 1 / (fpsBuffer.reduce((a, b) => a + b, 0) / fpsBuffer.length) * 1000;
            this.fpsText.setText(`${fps.toFixed(2)} FPS`);
        }

        if(this.isWindActive(this.player.x, this.player.y)) {
            var movement = this.getMovementFromDirection(this.winds[this.player.x][this.player.y].direction);
            this.movePlayer(movement.x, movement.y, true);
        }

        var movement = { x: 0, y: 0};
        if(keys.isKeyPressed("down") || keys.wasKeyPressed("down")) movement.y++;
        if(keys.isKeyPressed("up") || keys.wasKeyPressed("up")) movement.y--;
        if(keys.isKeyPressed("left") || keys.wasKeyPressed("left")) movement.x--;
        if(keys.isKeyPressed("right") || keys.wasKeyPressed("right")) movement.x++;

        if((movement.x !== 0 && movement.y === 0) || (movement.x === 0 && movement.y !== 0)) {
            this.movePlayer(movement.x, movement.y, false);
        }
    }
}