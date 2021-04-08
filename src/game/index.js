import { CANVAS, Game, Scale, WEBGL } from "phaser";
import { GameScene } from "./gameScene";
import { maps } from "./maps";

export function resize() {

}

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
        width: canvas.parentElement.clientWidth,
        height: canvas.parentElement.clientHeight,
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