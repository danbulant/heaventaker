<script>
	import Dialog from "./pages/dialog.svelte";
	import { Howl } from "howler";
	import Overlay from "./pages/overlay.svelte";
	import { characters } from "./stores/characters.js";
	import { dialog } from "./stores/dialog.js";
	import Game from "./pages/game.svelte";
	import { gameActive } from "./stores/gameActive";

	var current = localStorage.getItem("dialog-page") || 0;

	var preloads = new Map;
	function preload(url) {
		if(preloads.has(url)) return;
		preloads.set(url, new Image);
		preloads.get(url).src = url;
	}
	for(let character of characters) {
		preload(character.art); // preload art
	}
	for(let d of dialog) {
		preload(d.background); // preload art
	}

	var music = new Howl({
		src: "/sound/mittsies-departure.mp3",
		html5: true,
		loop: true,
		autoplay: true
	});

	function startPlaying(e) {
		if(!music.playing()) music.play();
	}

	console.log(dialog[current]);
	console.log("Pancake recipe at https://github.com/danbulant/heaventaker");
</script>

<svelte:window on:click={startPlaying} on:keydown={startPlaying} />

<svelte:head>
	<title>Heaventaker</title>
</svelte:head>

{#if dialog[current].map}
	<Game bind:current />
{/if}

<Overlay active={$gameActive}>
	<Dialog bind:current />
</Overlay>
