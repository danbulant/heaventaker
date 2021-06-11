import Phaser, { Animations } from "phaser";
import { gameActive, page } from "../stores/gameActive";
import { steps } from "../stores/step";
import { keys } from "./input";
import { dialog } from "../stores/dialog.js";

const textureWidth = 100;

var stepNum;
steps.subscribe(t => {
    stepNum = t;
});

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
            })[][]
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
        this.load.image("level1", "/sprite/level1.webp");
        this.load.image("level2", "/sprite/level2.webp");
        this.load.image("level3", "/sprite/level3.webp");
        this.load.image("lyre", "/sprite/lyre.webp");
        this.load.image("cloud", "/sprite/clouds.webp");
        this.load.image("pillar", "/sprite/pillar.webp");
        this.load.image("key", "/sprite/key.webp");
        this.load.image("lock", "/sprite/lock.webp");
        this.load.spritesheet("wind", "/sprite/wind.png", { frameWidth: textureWidth });
        this.load.spritesheet("uriel", "/sprite/uriel.png", { frameWidth: textureWidth });
        this.load.spritesheet("michael", "/sprite/michael.png", { frameWidth: textureWidth });
        this.load.spritesheet("spawn", "/sprite/yahweh.png", { frameWidth: textureWidth });
        this.load.spritesheet("azrael", "/sprite/azrael.png", { frameWidth: textureWidth });
        this.load.spritesheet("celestine", "/sprite/celestine.png", { frameWidth: textureWidth });
        this.load.spritesheet("gabriel", "/sprite/gabriel.png", { frameWidth: textureWidth });
        this.load.spritesheet("uziel", "/sprite/uziel.png", { frameWidth: textureWidth });
        this.load.spritesheet("yahweh", "/sprite/yahweh.png", { frameWidth: textureWidth });
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
        this.winds = new Array(this.map.map.length);
        for(var y in this.map.map) {
            var row = this.map.map[y];
            
            for(var x in row) {
                if(!this.items[x]) {
                    this.items[x] = new Array(row.length);
                    this.winds[x] = new Array(row.length);
                }
                var item = row[x];
                if(!item) {
                    this.items[x][y] = null;
                    this.winds[x][y] = null;
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
                }
            }
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
        var mov = this.getMovementFromDirection(this.winds[x][y].direction);
        if(this.items[x][y] && this.items[x][y].type !== "wind" && this.items[x][y].type !== "spawn") {
            return false;
        }
        if(!this.winds[x-mov.x] || !this.winds[x-mov.x][y-mov.y]) {
            return true;
        }
        return this.isWindActive(x-mov.x, y-mov.y);
    }

    tryDestroy(toX, toY) {
        if(this.items[toX][toY].destroyable) {
            this.items[toX][toY].sprite.alpha = 0;
            this.items[toX][toY].sprite.destroy();
            console.log("Destroyed", this.items[toX][toY].sprite);
            this.items[toX][toY] = null;
            this.canMove = false;
            setTimeout(() => {
                this.canMove = true;
            }, 400);
            return true;
        }
    }

    movePlayer(moveX, moveY, fromWind = false) {
        if(!this.canMove) return;
        var toX = this.player.x + moveX;
        var toY = this.player.y + moveY;
        if(toX > this.map.size.x - 1 || toX < 0 || toY > this.map.size.y - 1 || toY < 0) return;
        if(this.items[toX][toY]) {
            if(this.items[toX][toY].type === "key") {
                this.items[toX][toY].sprite.destroy();
                this.items[toX][toY] = null;
                this.player.hasKey = true;
            } else if(fromWind) return;
            else if(this.items[toX][toY].type === "lock") {
                if(!this.player.hasKey) return;
                this.items[toX][toY].sprite.destroy();
                this.items[toX][toY] = null;
            } else if(this.items[toX][toY].type !== "lyre" && this.tryDestroy(toX, toY)) {
                steps.update(t => --t);
                if(stepNum <= 0) {
                    this.unload();
                    this.createMap();
                    return;
                }
                return;
            } else if(this.items[toX][toY].type === "lyre" && !this.items[toX + moveX][toY + moveY]) {
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
            if(!fromWind) this.checkAngel();
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

    update() {
        // debug mode
        if(keys.wasKeyPressed("debug")) {
            console.log("Toggled debug mode");
            this.physics.config.debug = !this.physics.config.debug;
            if(this.physics.config.debug) this.physics.world.createDebugGraphic();
            this.physics.world.drawDebug = this.physics.config.debug;
            if(!this.physics.config.debug) this.physics.world.debugGraphic.destroy();
        }

        this.container.x = this.cameras.main.width / 2 - this.container.width / 2;
        this.container.y = this.cameras.main.height / 2 - this.container.height / 2;


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