<script>
    import Button from "./button.svelte";
    import { Howl } from "howler";
	import { chapters, dialog } from "../stores/dialog.js";
    import { characters } from "../stores/characters.js";
    import { gameActive, menuActive } from "../stores/gameActive";
    import { toRoman } from "../utils";
    import Keypress from "../stores/keypress.svelte";
    import Success from "./dialog/success.svelte";

    export var current;
    // export var page;

    /** @type {typeof dialog[number]}*/
    var d;
    $: d = dialog[current];

    var character;
    $: character = characters.find(c => c.name === d.character);

    var art;
    $: art = !character ? null : "/images/angels/" + (d.character_art || d.pose ? character.poses[d.pose] : character.art) + ".webp";
    var background;
    $: background = d.background;

    function asleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    var activeButton = -1;
    async function select(i) {
        if(!allowSwitch) return;
        var next;
        if(d.flags && d.flags.includes("chapters") && chaptersDone.length) {
            const keys = Object.keys(chapters);
            console.log(keys);
            if(!keys[i]) return;
            const key = keys[i];
            if(!chaptersDone.includes(key)) return;
            next = dialog.findIndex(t => t.chapterStart === key);
        } else if(d.buttons) {
            if(!d.buttons[i]) return;
            next = dialog.findIndex(t => t.name === d.buttons[i].next);
        } else {
            next = dialog.findIndex(t => t.name === d.next);
            if(d.flags && d.flags.includes("failure") && !failureShown) {
                allowSwitch = false;
                art = null;
                background = null;
                showText = false;
                art = "/images/death/1.webp";
                failure = true;
                await asleep(150);
                art = "/images/death/2.webp";
                await asleep(150);
                art = "/images/death/3.webp";
                await asleep(150);
                art = "/images/death/4.webp";
                allowSwitch = true;
                failureShown = true;
                return;
            }
        }
        if(next === -1) return;
        showText = true;
        failureShown = false;
        failure = false;
        current = next;
        if(dialog[next].map) {
            await asleep(500);
        }
        d = dialog[current];
        art = !character ? null : "/images/angels/" + (d.character_art || d.pose && character.poses ? character.poses[d.pose] : character.art) + ".webp";
        background = d.background;
        if(d.map) {
            setTimeout(() => {
                $gameActive = true;
            }, 300);
        }
        console.log("selected", d);
        if(!d.flags || !d.flags.includes("nosave")) localStorage.setItem("dialog-page", dialog[next].name);
        if(d.chapter) {
            if(!chaptersDone.includes(d.chapter)) {
                chaptersDone.push(d.chapter);
                localStorage.setItem("chapters", JSON.stringify(chaptersDone));
            }
        }
    }

    /** @type {string[]}*/
    var chaptersDone = JSON.parse(localStorage.getItem("chapters") || "[]");

    function keydown(e) {
        if($menuActive || $gameActive) return;
        switch(e.detail.key) {
            case "ArrowUp":
            case "ArrowLeft":
                activeButton--;
                if(activeButton < 0) activeButton = 0;
                break;
            case "ArrowRight":
            case "ArrowDown":
                activeButton++;
                if(d.flags && d.flags.includes("chapters")) {
                    if(activeButton > Object.keys(chapters).length - 1) activeButton = Object.keys(chapters).length - 1;
                } else if(d.buttons && activeButton > d.buttons.length - 1) {
                    activeButton = d.buttons.length - 1;
                }
                break;
            case "Enter":
            case " ":
                select(activeButton);
                reset();
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
        src: "./sound/success.wav"
    });
    var textElement;
    $: {
        if(textElement) {
            // don't try to fix this animation, svelte transitions won't help.
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

<Keypress on:keypress={keydown} />
<svelte:window on:mousemove={reset} on:click={next} />

<div class="dialog" class:failure>
    <div class="background">
        {#if background}
            {#if d.flags && d.flags.includes("prologue")}
                <img src="./images/backgrounds/{background}.webp" alt="" class="prologue-bg" draggable={false}>
            {:else}
                <img src="./images/backgrounds/{background}.webp" alt="" class="full" draggable={false}>
            {/if}
        {/if}
        {#if art}
            <img src=".{art}" alt="" class="character" draggable={false}>
        {/if}
    </div>
    {#if showText}
        <div class="text">
            <div class="data">
                {#if character}
                    <h1>{character.name}, {character.title}</h1>
                {:else if !d.flags || !d.flags.includes("prologue")}
                    <h1>???</h1>
                {/if}
                {#if d.text}
                    <!-- Don't try to fix this animation. I tried. Multiple times. Using svelte transitions won't help. -->
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
                {:else if d && d.flags && d.flags.includes("chapters") && chaptersDone.length}
                    <div class="chapters">
                        {#each Object.keys(chapters) as chapter, i}
                            <div class="chapter" class:selected={i === activeButton} on:click={() => select(i)} class:active={chaptersDone && chaptersDone.includes(chapter)}>
                                {toRoman(chapters[chapter])}
                            </div>
                        {/each}
                    </div>
                {:else if !success}
                    <div class="next-center">
                        <img src="/images/button/next.webp" alt="">
                    </div>
                {/if}
            </div>
            {#if success}
                <Success />
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
    .chapter.selected, .chapter:hover {
        box-shadow: 0 0 2px 1px rgba(255, 255, 255, 0.705);
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
        max-height: 100vh;
        width: 100vw;
        user-select: none;
    }
    .text {
        font-size: clamp(1rem, 4vh - 0.2rem, 1.5rem);
        max-height: 50vh;
    }
    .text p {
        margin-top: 10px;
        font-size: inherit;
    }
    h1 {
        color: #FFFCBE;
        margin: 10px 0 0 0;
        text-align: center;
        letter-spacing: 2px;
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
    .background .prologue-bg {
        height: 90%;
        box-shadow: -5px -5px 0 0 #DFCA96;
    }
    .background .character {
        height: 100%;
        bottom: 0px;
    }
    .next-center {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .next-center img {
        width: 60px;
        height: 60px;
    }
</style>