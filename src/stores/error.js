import { writable } from "svelte/store";

export const gameCrashed = writable(false);
export const sharedErrorData = { gameCrashed: false };

gameCrashed.subscribe(t => {
    sharedErrorData.gameCrashed = t;
});