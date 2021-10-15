import { CANVAS, Game, Scale, WEBGL } from "phaser";
import { GameScene } from "./gameScene";
import { maps } from "./maps";

var ratio = window.devicePixelRatio || 1;
export function resize() {
    if(!game || !htmlcanvas) return;
    try {
        // game.scale.resize(htmlcanvas.parentElement.width * ratio, htmlcanvas.parentElement.height * ratio);
    } catch(e) {
        console.error(e, new ErrorEvent(e.type, {
            colno: e.colno,
            error: e,
            lineno: e.lineno,
            message: e.message,
            filename: e.filename
        }));
        window.dispatchEvent(new ErrorEvent("error", e));
    }
    console.log("size", htmlcanvas.parentElement.clientWidth * ratio, htmlcanvas.parentElement.clientHeight * ratio);
}

/** @type {HTMLCanvasElement} */
var htmlcanvas;
/** @type {Game} */
var game;
/** @type {GameScene} */
var gs;
export function setCanvas(canvas) {
    htmlcanvas = canvas;
    var ctx = canvas.getContext("webgl2") || canvas.getContext("webgl");
    gs = new GameScene(map);
    game = new Game({
        canvas: canvas,
        url: window.location.host,
        hideBanner: true,
        type: ctx ? WEBGL : CANVAS,
        context: ctx || canvas.getContext("2d"),
        customEnvironment: false,
        width: window.innerWidth * ratio,
        height: window.innerHeight * ratio,
        scale: {
            mode: Scale.RESIZE
        },
        physics: {
            default: "arcade",
        },
        title: "Heaventaker",
        version: "beta",
        scene: [gs],
        backgroundColor: "#01021B"
    });
    game.hideBanner = true;
}

export function stop() {
    game.destroy(false);
    gs = undefined;
}

var map;
/** @type {string} */
var mapname;
export function setMap(newmap) {
    mapname = newmap;
    map = maps[mapname];
    if(gs) {
        gs.unload();
        gs.map = map;
        gs.createMap();
    }
    console.log("Loaded map", mapname);
}