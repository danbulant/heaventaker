<script>
    import Button from "./button.svelte";
    import { Howl } from "howler";

    /** @type {any[]} */
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

    var activeButton = -1;
    function select(i) {
        var next;
        if(d.buttons) {
            if(!d.buttons[i]) return;
            next = dialog.findIndex(t => t.name === d.buttons[i].next);
        } else {
            next = dialog.findIndex(t => t.name === d.next);
        }
        if(next === -1) return;
        current = next;
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
            case "Space":
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

<div class="dialog">
    <div class="background">
        <img src={d.background} alt="" class="full" draggable={false}>
        <img src={art} alt="" class="character" draggable={false}>
    </div>
    <div class="text">
        <h1>{character.name}, {character.title}</h1>
        <p class="animate" bind:this={textElement}>{d.text}</p>
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
        transform: translateY(-50%);
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
        bottom: 0px;
    }
</style>