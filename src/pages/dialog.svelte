<script>
import Button from "./button.svelte";

    export var dialog;
    export var current;
    /** @type {any[]} */
    export var characters;
    export var page;

    var d;
    $: d = dialog[current];

    var character;
    $: character = characters.find(c => c.name === d.character);

    var art;
    $: art = d.character_art || d.pose ? character.poses[d.pose] : character.art;
</script>

<div class="dialog">
    <div class="background">
        <img src={d.background} alt="" class="full" draggable={false}>
        <img src={art} alt="" class="character" draggable={false}>
    </div>
    <div class="text">
        <h1>{character.name}, {character.title}</h1>
        <p>{d.text}</p>
        <div class="buttons">
            {#each d.buttons as button}
                <Button>{button.text}</Button>
            {/each}
        </div>
    </div>
</div>

<style>
    .dialog {
        background: #02021A;
        color: white;
        font-family: 'Times New Roman W', 'Times New Roman', Times, serif;
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
        user-select: none;
    }
    h1 {
        color: #FFFCBE;
        margin: 10px 0;
        text-align: center;
        letter-spacing: 2px;
    }
    p {
        margin: 0;
        text-align: center;
        font-size: 25px;
        font-weight: 600;
    }
    .text {
        max-width: 700px;
        margin: 0 auto;
    }
    .background {
        position: relative;
        height: 70%;
        width: 100%;
        overflow: hidden;
    }
    .background img {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
    }
    .background .full {
        height: 80%;
    }
    .background .character {
        height: 100%;
        bottom: -30px;
    }
</style>