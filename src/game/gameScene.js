import Phaser, { Animations } from "phaser";
import { steps } from "../stores/step";
import { keys } from "./input";

const textureWidth = 100;

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

    preload() {
        this.load.setBaseURL();
        this.load.image("level1", "/sprite/level1.webp");
        this.load.image("lyre", "/sprite/lyre.webp");
        this.load.image("cloud", "/sprite/clouds.webp");
        this.load.spritesheet("wind", "/sprite/wind.png", { frameWidth: textureWidth });
        this.load.spritesheet("uriel", "/sprite/uriel.png", { frameWidth: textureWidth });
        this.load.spritesheet("michael", "/sprite/michael.png", { frameWidth: textureWidth });
        this.load.spritesheet("spawn", "/sprite/michael.png", { frameWidth: textureWidth });
    }

    create() {
        this.input.on("keydown", function() {		
            if (this.game.sound.context.state === 'suspended') {
                this.game.sound.context.resume();
            }
        });
        console.log(this.map);

        this.container = this.add.container();
        this.container.width = this.map.size.x * this.map.px + this.map.offset.x * 2;
        this.container.height = this.map.size.y * this.map.px + this.map.offset.y * 2;
        this.grid = this.add.container(this.map.offset.x, this.map.offset.y);
        this.container.width = this.map.size.x * this.map.px;
        this.container.height = this.map.size.y * this.map.px;

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
                    if(type === "angel") type = this.map.sprite;
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
                    sprite.setRotation(item.direction * Math.PI / 2);
                    this.grid.add(sprite);
                    item.sprite = sprite;
                    if(type !== item.type) {
                        item.texture = type;
                    }

                    if(item.type === "spawn") {
                        this.player = item;
                        this.player.x = x;
                        this.player.y = y;
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

    movePlayer(moveX, moveY, fromWind = false) {
        if(!this.canMove) return;
        var toX = this.player.x + moveX;
        var toY = this.player.y + moveY;
        if(toX > this.map.size.x - 1 || toX < 0 || toY > this.map.size.y - 1 || toY < 0) return;
        if(this.items[toX][toY]) {
                if(this.items[toX][toY].type !== "lyre") return;
                if(toX + moveX > this.map.size.x - 1|| toX + moveX < 0 || toY + moveY > this.map.size.y - 1 || toY + moveY < 0) return;
                if(this.items[toX + moveX][toY + moveY] && this.items[toX + moveX][toY + moveY].type !== "wind") return;
                this.move(toX, toY, toX + moveX, toY + moveY);
        }
        this.canMove = false;
        if(!fromWind) {
            steps.update(t => --t);
        }
        this.move(this.player.x, this.player.y, toX, toY, () => {
            this.canMove = true;
            this.player.x = toX;
            this.player.y = toY;
            if(this.winds[toX][toY]) {
                var movement = this.getMovementFromDirection(this.winds[toX][toY].direction);
                this.movePlayer(movement.x, movement.y, true);
            }
        });
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

        var movement = { x: 0, y: 0};
        if(keys.isKeyPressed("down")) movement.y++;
        if(keys.isKeyPressed("up")) movement.y--;
        if(keys.isKeyPressed("left")) movement.x--;
        if(keys.isKeyPressed("right")) movement.x++;

        if((movement.x !== 0 && movement.y === 0) || (movement.x === 0 && movement.y !== 0)) {
            this.movePlayer(movement.x, movement.y);
        }
    }
}