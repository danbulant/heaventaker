<script>
	import Dialog from "./pages/dialog.svelte";
	import { Howl } from "howler";
	import Overlay from "./pages/overlay.svelte";
	import { characters } from "./stores/characters.js";
	import { dialog } from "./stores/dialog.js";
	import Game from "./pages/game.svelte";
	import { gameActive, menuActive, page } from "./stores/gameActive";
	import Menu from "./pages/menu.svelte";

	var preloads = new Map;
	function preload(url) {
		if(preloads.has(url)) return;
		preloads.set(url, new Image);
		preloads.get(url).src = url;
	}
	for(let character of characters) {
		if(character.art) {
			preload("." + character.art); // preload art
		}
	}
	for(let d of dialog) {
		if(d.background) {
			preload("." + d.background); // preload art
		}
	}

	var music = new Howl({
		src: "./sound/mittsies-departure.mp3",
		html5: true,
		loop: true,
		autoplay: true
	});

	function startPlaying(e) {
		if(!music.playing()) music.play();
	}

	$: console.log(dialog[$page]);
	console.log("Pancake recipe at https://github.com/danbulant/heaventaker");

    var width = window.innerWidth;
    var height = window.innerHeight;
    var outerHeight = window.outerHeight;
    var outerWidth = window.outerWidth;

	/**
	 * @param {UIEvent} e
	 */
    function resize(e) {
        width = window.innerWidth;
        height = window.innerHeight;
        outerHeight = window.outerHeight;
        outerWidth = window.outerWidth;
    }
</script>

<svelte:window on:click={startPlaying} on:resize={resize} on:keydown={startPlaying} />

<svelte:head>
	<title>Heaventaker</title>
</svelte:head>

{#if width < height / 1080 * 615 * 2}
	<div class="warning" style="height: {height}px; line-height: {height}px;">
		<span>
			Resize or rotate your device to play.
		</span>
	</div>
{/if}

{#if dialog[$page].map}
	<Game bind:current={$page} />
{/if}
{#if $menuActive}
	<Menu />
{/if}

<Overlay active={!dialog[$page].map || !$gameActive}>
	<Dialog bind:current={$page} />
</Overlay>

<style>
	.warning {
		width: 100vw;
		position: fixed;
		top: 0;
		left: 0;
		background: rgba(0,0,0,0.7);
		color: white;
		text-align: center;
		z-index: 99;
		font-size: x-large;
	}
	.warning span {
		display: inline-block;
		vertical-align: middle;
		line-height: normal;
	}
</style>