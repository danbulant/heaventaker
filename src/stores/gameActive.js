import { writable } from "svelte/store";

export const gameActive = writable(true);
export const page = writable(parseInt(localStorage.getItem("dialog-page")) || 0);