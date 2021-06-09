<script>
    import Button from "./button.svelte";
    import { Howl } from "howler";
	import { chapters, dialog } from "../stores/dialog.js";
    import { characters } from "../stores/characters.js";
    import { gameActive } from "../stores/gameActive";
    import { toRoman } from "../utils";

    export var current;
    export var page;

    /** @type {typeof dialog[number]}*/
    var d;
    $: d = dialog[current];

    var character;
    $: character = characters.find(c => c.name === d.character);

    var art;
    $: art = !character ? null : d.character_art || d.pose ? character.poses[d.pose] : character.art;
    var background;
    $: background = d.background;

    function asleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    var activeButton = -1;
    function select(i) {
        console.log("Switching", i);
        if(!allowSwitch) return;
        var next;
        if(d.buttons) {
            if(!d.buttons[i]) return;
            next = dialog.findIndex(t => t.name === d.buttons[i].next);
        } else {
            next = dialog.findIndex(t => t.name === d.next);
            if(d.flags && d.flags.includes("failure") && !failureShown) {
                allowSwitch = false;
                art = null;
                background = null;
                showText = false;
                art = "/sprite/death1.webp";
                failure = true;
                (async() => {
                    await asleep(150);
                    art = "/sprite/death2.webp";
                    await asleep(150);
                    art = "/sprite/death3.webp";
                    await asleep(150);
                    art = "/sprite/death4.webp";
                    allowSwitch = true;
                    failureShown = true;
                })();
                return;
            }
        }
        if(next === -1) return;
        showText = true;
        failureShown = false;
        failure = false;
        current = next;
        d = dialog[current];
        art = !character ? null : (d.character_art || d.pose && character.poses ? character.poses[d.pose] : character.art);
        background = d.background;
        if(d.map) {
            setTimeout(() => {
                $gameActive = true;
            }, 300);
        }
        console.log("selected", d);
        if(!d.flags || !d.flags.includes("nosave")) localStorage.setItem("dialog-page", next);
        if(d.chapter) {
            if(!chaptersDone.includes(d.chapter)) {
                chaptersDone.push(d.chapter);
                localStorage.setItem("chapters", JSON.stringify(chaptersDone));
            }
        }
    }

    var chaptersDone = JSON.parse(localStorage.getItem("chapters") || "[]");

    function keydown(e) {
        switch(e.key) {
            case "ArrowUp":
            case "ArrowLeft":
                activeButton--;
                if(activeButton < 0) activeButton = 0;
                break;
            case "ArrowRight":
            case "ArrowDown":
                activeButton++;
                if(d.buttons && activeButton > d.buttons.length - 1) activeButton = d.buttons.length - 1;
                break;
            case "Enter":
            case " ":
                select(activeButton);
                break;
        }
    }
    function reset() {
        activeButton = -1;
    }
    var buttons;
    /**
     * @argument {MouseEvent} e
    */
    function next(e) {
        var path = e.composedPath();
        if(buttons && path.includes(buttons)) return;
        reset();
        select();
    }

    var success = false;
    $: success = d.flags && d.flags.includes("success");
    var allowSwitch = true;
    var showText = true;
    var failureShown = true;
    var failure = false;

    var successSound = new Howl({
        src: "/sound/success.wav"
    });
    var textElement;
    $: {
        if(textElement) {
            d; // everytime d is changed
            textElement.classList.remove("animate");
            void textElement.offsetWidth;
            textElement.classList.add("animate");
        }
        if(success) {
            successSound.play();
        }
    }
</script>

<svelte:window on:keydown={keydown} on:mousemove={reset} on:click={next} />

<div class="dialog" class:failure>
    <div class="background">
        {#if background}
            <img src={background} alt="" class="full" draggable={false}>
        {/if}
        {#if art}
            <img src={art} alt="" class="character" draggable={false}>
        {/if}
    </div>
    {#if showText}
        <div class="text">
            <div class="data">
                {#if character}
                    <h1>{character.name}, {character.title}</h1>
                {:else}
                    <h1>???</h1>
                {/if}
                {#if d.text}
                    <p class="animate" bind:this={textElement}>
                        {#if d.flags && d.flags.includes("chapters") && chaptersDone.length === 0}
                            {d.alt}
                        {:else}
                           {d.text}
                        {/if}
                    </p>
                {/if}
            </div>
            <div class="buttons" bind:this={buttons}>
                {#if d.buttons}
                    {#each d.buttons as button, i}
                        <Button active={i === activeButton} on:click={() => select(i)}>{button.text}</Button>
                    {/each}
                {/if}
                {#if d && d.flags && d.flags.includes("chapters") && chaptersDone.length}
                    <div class="chapters">
                        {#each Object.keys(chapters) as chapter}
                            <div class="chapter" class:active={chaptersDone && chaptersDone.includes(chapter)}>
                                {toRoman(chapters[chapter])}
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>
            {#if success}
                <h2>SUCCESS</h2>
            {/if}
        </div>
    {/if}
</div>

<style>
    .chapters {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .chapter {
        border: 2px solid rgb(155, 0, 0);
        padding: 4px;
        margin: 3px;
        cursor: not-allowed;
    }
    .chapter.active {
        cursor: pointer;
        border-color: red;
    }
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
    h2 {
        position: relative;
        width: 400px;
        color: white;
        font-size: 70px;
        letter-spacing: 12px;
        text-align: center;
        margin: 15px auto;
        text-shadow: 0 0 6px white;
        animation: shadowAppear .4s ease-out;
    }
    h2::before, h2::after {
        position: absolute;
        content: "";
        background: white;
        box-shadow: 0 0 15px white;
        border-radius: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
    h2::before {
        animation: successLeft .4s, appear .2s;
        animation-timing-function: ease-out;
        animation-delay: .2s, 0;
    }
    h2::after {
        animation: successRight .4s, appear .2s;
        animation-timing-function: ease-out;
        animation-delay: .2s, 0;
    }
    @keyframes shadowAppear {
        0% {
            text-shadow: 0 0 20px white;
        }
        100% {
            text-shadow: 0 0 6px white;
        }
    }
    @keyframes successLeft {
        0% {
            left: 40%;
            width: 100px;
            height: 15px;
        }
        100% {
            left: -60px;
            width: 100px;
            height: 2px;
        }
    }
    @keyframes successRight {
        0% {
            right: 40%;
            width: 100px;
            height: 15px;
        }
        100% {
            right: -60px;
            width: 100px;
            height: 2px;
        }
    }
    p {
        margin: 0;
        text-align: center;
        font-size: 25px;
        font-weight: 600;
    }
    .animate {
        animation: appear .3s;
    }
    @keyframes appear {
        from {
            transform: scale(0.7);
        }
        to {
            transform: scale(1);
        }
    }
    .text {
        max-width: 1100px;
        margin: 0 auto;
    }
    .data {
        margin: 0 auto;
        max-width: 700px;
    }
    .background {
        position: relative;
        height: 70vh;
        width: 100vw;
        overflow: hidden;
    }
    .failure .background {
        height: 100vh;
    }
    .failure .background .character {
        object-fit: scale-down;
        max-width: 100%;
    }
    .background img {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
    }
    .background .full {
        height: 80%;
        width: 100%;
        object-fit: none;
    }
    .background .character {
        height: 100%;
        bottom: 0px;
    }
</style>