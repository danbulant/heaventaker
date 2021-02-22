<script>
	import Dialog from "./pages/dialog.svelte";
	import { Howl } from "howler";

	var page = "game";
	const characters = [{
		name: "Michael",
		art: "/sprite/fin_22.png",
		title: "the high marshal"
	}]
	var dialog = [{
		name: "michael_heretic",
		background: "/sprite/fin_backg.png",
		character: "Michael",
		text: "How did you... You know I don't even care. Heretic like you needs to be punished.",
		buttons: [{
			text: "Jokes on you I'm into that shit.",
			next: "michael_success"
		}, {
			text: "I have something to offer."
		}]
	}, {
		name: "michael_success",
		background: "/sprite/fin_backg.png",
		character: "Michael",
		text: "Really then? If you survive this whole ordeal, prepare a room and we'll see how into this shit you really are.",
		flags: ["success"],
		next: "michael_heretic"
	}];
	var current = localStorage.getItem("dialog-page") || 0;

	for(let character of characters) {
		(new Image).src = character.art; // preload art
	}
	for(let d of dialog) {
		(new Image).src = d.background; // preload art
	}

	var music = new Howl({
		src: "/sound/thought_patterns.m4a",
		html5: true,
		loop: true,
		autoplay: true
	});
</script>

<svelte:head>
	<title>Heaventaker</title>
</svelte:head>

{#if page === "game"}
	<Dialog {dialog} bind:current {characters} bind:page />
{/if}