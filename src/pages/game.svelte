<script>
    import GameOverlay from "./gameOverlay.svelte";
	import { dialog } from "../stores/dialog.js";
    import { characters } from "../stores/characters.js";
    import { onMount } from "svelte";
    import { setCanvas, setMap, resize, stop } from "../game";
    import { steps } from "../stores/step";
    import { toRoman } from "../utils";

    export var current;

    var d;
    $: d = dialog[current];

    var characterIndex;
    $: characterIndex = characters.findIndex(c => c.name === d.character);
    var character;
    $: character = characters[characterIndex];

    var canvas;

    onMount(() => {
        console.log("Started");
        setMap(dialog[current].map);
        setCanvas(canvas);
        resize();
        return () => {
            console.log("Stopped");
            stop();
        }
    });

    $: setMap(dialog[current].map);
</script>

<svelte:window on:resize={resize} />

<GameOverlay steps={$steps} chapter={toRoman(characterIndex + 1)} />

<canvas bind:this={canvas} />