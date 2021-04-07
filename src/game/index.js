import { fabric } from "fabric";
import images from "./images";
import { keys } from "./input";
import { maps } from "./maps";
import { Sprite } from "./sprite";


/**
 * @typedef Sprite
 * @property {"sprite"} type
 * @property {number} spriteWidth
 * @property {number} spriteHeight
 * @property {number} spriteIndex
 * @property {number} frameTime
 * 
 * @property {(element: HTMLImageElement, options: any) => Sprite} constructor
 */

/** @type {HTMLCanvasElement} */
var htmlcanvas;
/** @type {fabric.StaticCanvas} */
var canvas;
export function setCanvas(htmlCanvas) {
    htmlcanvas = htmlCanvas;
    canvas = new fabric.StaticCanvas(htmlcanvas);
    canvas.backgroundColor = "#01021B";
    load();
}

/**
 * @type {Map<string, fabric.Object>}
 */
const objects = new Map;
/**
 * @type {Map<string, { object: fabric.Object, piece: any }>}
 */
const points = new Map;

function load() {
    objects.set("loadingText", new fabric.Text("Loading", {
        left: canvas.getWidth() / 2,
        top: 0,
        fill: "white",
        textAlign: "center",
        originX: "center",
        fontFamily: "monospace"
    }))
    canvas.add(objects.get("loadingText"));
    images.load("level1", "/sprite/level1.webp");
    images.load("lyre", "/sprite/lyre.webp");
    images.load("wind", "/sprite/wind.png");
    images.load("cloud", "/sprite/clouds.webp");
    images.load("uriel", "/sprite/uriel.png");
    images.load("michael", "/sprite/michael.png");
    images.load("spawn", "/sprite/michael.png");
    images.startLoad();
    loading = true;
}

var map;
/** @type {{
            background: string,
            sprite: string,
            offset: { x: number, y: nunber },
            size: { x: number, y: number },
            px: number,
            map: string[][]
    }}
*/
var mapdata;
var mapName;
export function setMap(name) {
    if(mapName === name) return;
    mapdata = maps[name];
    mapName = name;

    map = mapdata.map.map(m => m.map(piece => typeof piece === "string" && { type: piece } || piece));

    console.table(map);
}

/**
 * @type {{
 *  object: fabric.Object,
 *  property: string,
 *  value: number,
 *  onComplete: Function,
 *  start: Date,
 *  update: Function
 * }[]}
 */
var animations = [];

/**
 * Animates given property
 * @param {fabric.Object} object
 * @param {string} property 
 * @param {number} value
 * @param {Function} onComplete
 */
function animate(object, property, value, onComplete) {
    const length = 400;
    animations.push({
        object,
        property,
        value,
        onComplete,
        start: new Date,
        initial: object[property],
        update() {
            var diff = (new Date - this.start) / length;
            var toUpdate = {
                originX: "center",
                originY: "center"
            };
            if(diff > 1) {
                onComplete();
                animations.splice(animations.indexOf(this), 1);
                toUpdate[this.property] = this.value
                this.object.set(toUpdate);
                return;
            }
            toUpdate[this.property] = (this.value - this.initial) * diff + this.initial;
            this.object.set(toUpdate);
        }
    })
}

/**
 * Moves given object with animation
 * @param {fabric.Object} source
 * @param {number} fromX 
 * @param {number} fromY 
 * @param {number} toX 
 * @param {number} toY 
 * @param {Function} done 
 */
function move(source, fromX, fromY, toX, toY, done) {
    if(fromX !== toX) animate(source, "left", toX * mapdata.px + (mapdata.px / 2) + canvas.getWidth() / 2 - mapdata.size.x * mapdata.px / 2, done);
    if(fromY !== toY) animate(source, "top", toY * mapdata.px + canvas.getHeight() / 2 - mapdata.size.y * mapdata.px / 2, done);
    // map[toY][toX] = map[fromY][fromX];
    // map[fromY][fromX] = undefined;
}

export function resize() {
    canvas.setWidth(htmlcanvas.parentElement.clientWidth);
    canvas.setHeight(htmlcanvas.parentElement.clientHeight - 7);
}

var canMove = true;
function tryMove(toX, toY) {
    const player = objects.get("player");
    // if(toX > mapdata.size.x - 1 || toY > mapdata.size.y - 1 || toX < 0 || toY < 0) return;
    if(!canMove) return;

    canMove = false;
    move(player, position.x, position.y, toX, toY, () => canMove = true);
    position.x = toX;
    position.y = toY;
    console.log(position, player.left / mapdata.px, player.top / mapdata.px);
}

keys.addEventListener("keyDown", key => {
    console.log(key);
    const { x, y } = position;
    switch(key) {
        case "right":
            tryMove(x + 1, y);
            break;
        case "left":
            tryMove(x - 1, y);
            break;
        case "up":
            tryMove(x, y - 1);
            break;
        case "down":
            tryMove(x, y + 1);
            break;
        default:
            console.error("Unrecognized key", key);
    }
});

function offsetRotation(rotation) {
    switch(rotation) {
        case 1:
            return { x: 1, y: 0 };
        case 2:
            return { x: 1, y: 1 };
        case 3:
            return { x: 0, y: 1 };
        case 4:
        default:
            return { x: 0, y: 0 };
    }
}

var position = {
    x: 0,
    y: 0
}

var resizeDirty = true;
window.onresize = () => {
    resizeDirty = true;
}

var loading = true;
export function render(delta) {
    if(images.areAllLoaded() && loading) {
        loading = false;

        objects.set("background", new fabric.Image(images.get(mapdata.background), {
            left: canvas.getWidth() / 2,
            top: canvas.getHeight() / 2,
            originX: "center",
            originY: "center",
        }));

        canvas.add(objects.get("background"));

        for(const y in map) {
            const pieces = map[y];
            for(const x in pieces) {
                const piece = pieces[x];
                if(!piece || piece.type === "barrier") {
                    objects.set("object-" + x + "-" + y, null);
                    continue;
                }
                let type = piece.type;
                if(type === "angel") type = mapName;
                /** @type {fabric.Image || Sprite} */
                let object;
                if(piece.type === "angel" || piece.type === "spawn" || piece.type === "wind") {
                    object = new Sprite(images.get(type), {
                        spriteWidth: 100,
                        spriteHeight: 100
                    });
                    object.play();
                    if(piece.type === "spawn") {
                        objects.set("player", object);
                        position = { x: parseInt(x), y: parseInt(y) };
                        console.log(position);
                    }
                } else {
                    object = new fabric.Image(images.get(type));
                }
                object.set({
                    originX: "left",
                    originY: "top",
                    left: parseInt(x) * mapdata.px + (mapdata.px / 2) + canvas.getWidth() / 2 - (mapdata.offset.x / 2),
                    top: parseInt(y) * mapdata.px + canvas.getHeight() / 2 - (mapdata.offset.y / 2) - 200,
                    angle: 90 * (piece.direction || 0)
                });
                if(piece.type !== "spawn") {
                    points.set(x + "-" + y, { object, piece });
                }
                canvas.add(object);
            }
        }

        canvas.remove(objects.get("loadingText"));
    } else if(loading) return canvas.renderAll();

    var background = objects.get("background");
    background.set({
        left: canvas.getWidth() / 2,
        top: canvas.getHeight() / 2
    });
    if(resizeDirty) {
        for(var [name, point] of points) {
            if(!point) {
                console.log(name, points);
                continue;
            }
            var [x, y] = name.split("-");
            var offset = offsetRotation(point.piece.direction);
            x = parseInt(x) + offset.x;
            y = parseInt(y) + offset.y;
            point.object.set({
                left: parseInt(x) * mapdata.px + canvas.getWidth() / 2 - mapdata.size.x * mapdata.px / 2,
                top: parseInt(y) * mapdata.px + (mapdata.px / 2) + canvas.getHeight() / 2 - mapdata.size.y * mapdata.px / 2,
            });
        }
        resizeDirty = false;
    }
    var player = objects.get("player");
    player.set({
        left: position.x * mapdata.px + (mapdata.px / 2) + canvas.getWidth() / 2 - mapdata.size.x * mapdata.px / 2,
        top: position.y * mapdata.px + canvas.getHeight() / 2 - mapdata.size.y * mapdata.px / 2
    });
    for(var animation of animations) {
        animation.update();
    }
    canvas.renderAll();
}