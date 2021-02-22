<script>
	import Dialog from "./pages/dialog.svelte";

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
		pose: null,
		text: "How did you... You know I don't even care. Heretic like you needs to be punished.",
		buttons: [{
			text: "Jokes on you I'm into that shit."
		}, {
			text: "I have something to offer."
		}]
	}];
	var current = 0;
</script>

<svelte:head>
	<title>Heaventaker</title>
</svelte:head>

{#if page === "game"}
	<Dialog {dialog} bind:current {characters} bind:page />
{/if}