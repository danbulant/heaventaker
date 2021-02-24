<script>
    import Button from "./button.svelte";
    import { Howl } from "howler";
	import { dialog } from "../stores/dialog.js";

    export var current;
    /** @type {any[]} */
    export var characters;
    export var page;

    /** @type {typeof dialog[number]}*/
    var d;
    $: d = dialog[current];

    var character;
    $: character = characters.find(c => c.name === d.character);

    var art;
    var background;

    function asleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    var activeButton = -1;
    function select(i) {
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
                    await asleep(200);
                    art = "/sprite/death2.webp";
                    await asleep(200);
                    art = "/sprite/death3.webp";
                    await asleep(200);
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
        art = d.character_art || d.pose ? character.poses[d.pose] : character.art;
        background = d.background;
        localStorage.setItem("dialog-page", next);
    }

    function keydown(e) {
        switch(e.key) {
            case "ArrowUp":
                activeButton--;
                if(activeButton < 0) activeButton = 0;
                break;
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
    function next(e) {
        if(e.path.includes(buttons)) return;
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
                <h1>{character.name}, {character.title}</h1>
                <p class="animate" bind:this={textElement}>{d.text}</p>
            </div>
            <div class="buttons" bind:this={buttons}>
                {#if d.buttons}
                    {#each d.buttons as button, i}
                        <Button active={i === activeButton} on:click={() => select(i)}>{button.text}</Button>
                    {/each}
                {/if}
            </div>
            {#if success}
                <h2>SUCCESS</h2>
            {/if}
        </div>
    {/if}
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
        max-width: 900px;
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
        bottom: 0px;
    }
</style>