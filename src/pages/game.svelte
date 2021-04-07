<script>
    import GameOverlay from "./gameOverlay.svelte";
	import { dialog } from "../stores/dialog.js";
    import { characters } from "../stores/characters.js";
    import { onMount } from "svelte";
    import { setCanvas, render, setMap, resize } from "../game";

    export var current;

    var d;
    $: d = dialog[current];

    var characterIndex;
    $: characterIndex = characters.findIndex(c => c.name === d.character);
    var character;
    $: character = characters[characterIndex];

    function toRoman(num) {
    if (isNaN(num))
        return NaN;
        var digits = String(+num).split(""),
            key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
                "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
                "","I","II","III","IV","V","VI","VII","VIII","IX"],
            roman = "",
            i = 3;
        while (i--)
            roman = (key[+digits.pop() + (i * 10)] || "") + roman;
        return Array(+digits.join("") + 1).join("M") + roman;
    }

    var steps = 11;
    var canvas;

    onMount(() => {
        setMap(dialog[current].map);
        setCanvas(canvas);
        resize();
        function update(delta) {
            render(delta);
            frame = requestAnimationFrame(update);
        }
        var frame = requestAnimationFrame(update);
        return () => cancelAnimationFrame(frame);
    });

    $: setMap(dialog[current].map);
</script>

<svelte:window on:resize={resize} />

<GameOverlay {steps} chapter={toRoman(characterIndex + 1)} />

<canvas bind:this={canvas} />