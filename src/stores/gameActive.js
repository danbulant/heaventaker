import { writable } from "svelte/store";

export const gameActive = writable(!!parseInt(localStorage.getItem("game-active")));
gameActive.subscribe(t => {
    localStorage.setItem("game-active", t ? 1 : 0);
});
export const page = writable(parseInt(localStorage.getItem("dialog-page")) || 0);