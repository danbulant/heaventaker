<script>
	import Dialog from "./pages/dialog.svelte";
	import Overlay from "./pages/overlay.svelte";
	import { characters } from "./stores/characters.js";
	import { dialog } from "./stores/dialog.js";
	import Game from "./pages/game.svelte";
	import { gameActive, menuActive, page } from "./stores/gameActive";
	import Menu from "./pages/menu.svelte";
	import CrashHandler from "./pages/crashHandler.svelte";
	import { startPlaying, isPlaying } from "./stores/music";
	import { fade } from "svelte/transition";

	var preloads = new Map;
	function preload(url) {
		if(preloads.has(url)) return;
		preloads.set(url, new Image);
		preloads.get(url).src = url;
	}
	for(let character of characters) {
		if(character.art) {
			preload("./images/angels/" + character.art + ".webp"); // preload art
		}
	}
	for(let d of dialog) {
		if(d.background) {
			preload("./images/backgrounds/" + d.background + ".webp"); // preload art
		}
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

	function clicked() {
		startPlaying();

		if(window.innerHeight < 768) {
			document.body.requestFullscreen({ navigationUI: "hide" });
		}
	}
</script>

<svelte:window on:click={clicked} on:resize={resize} on:keydown={startPlaying} />

<svelte:head>
	<title>Heaventaker</title>
	<meta name="tags" value="heaventaker, Game, free, online, helltaker, fan">
	<meta name="description" value="Heaventaker, a free online open-source helltaker fangame. Solve puzzles and get your angle harem.">
</svelte:head>

{#if width < height / 1080 * 615 * 2}
	<div class="warning" style="height: {height}px; line-height: {height}px;">
		<span>
			Resize or rotate your device to play.
		</span>
	</div>
{/if}

{#if !$isPlaying}
	<div class="play-notif" transition:fade={{ duration: 300 }}>
		Click anywhere for sound.
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

<CrashHandler />

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
	.play-notif {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		text-align: center;
		background-image: linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.0));
		z-index: 98;
		font-size: x-large;
	}
</style>