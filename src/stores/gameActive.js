import { writable } from "svelte/store";
import { dialog } from "./dialog";

export const gameActive = writable(!!parseInt(localStorage.getItem("game-active")));
gameActive.subscribe(t => {
    localStorage.setItem("game-active", t ? 1 : 0);
});
const startPage = localStorage.getItem("dialog-page");
const startPageIndex = Number(startPage) !== NaN ? Number(startPage) : dialog.findIndex(t => t.name === startPage);
export const page = writable(startPageIndex !== -1 ? startPageIndex : 0);
export const menuActive = writable(false);