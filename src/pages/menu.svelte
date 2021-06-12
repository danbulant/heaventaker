<script>
    import { dialog } from "../stores/dialog";
    import { gameActive, menuActive, page } from "../stores/gameActive";
import Keypress from "../stores/keypress.svelte";
    import Button from "./button.svelte";

    const buttons = [
        {
            text: "Resume",
            click: () => {
                $menuActive = false;
            }
        }, {
            text: "Back to main menu",
            click: () => {
                const i = dialog.findIndex(d => d.name === "menu");
                $page = i;
                $menuActive = false;
            }
        }, {
            text: "Skip puzzle",
            click: () => {
                $gameActive = false;
                $menuActive = false;
            }
        }
    ];

    function select(i) {
        buttons[i].click();
    }

    var activeButton = -1;
    function keydown(e) {
        switch(e.detail.key) {
            case "ArrowUp":
            case "ArrowLeft":
                activeButton--;
                if(activeButton < 0) activeButton = 0;
                break;
            case "ArrowRight":
            case "ArrowDown":
                activeButton++;
                if(!activeButton) activeButton = 0;
                if(buttons && activeButton > buttons.length - 1) {
                    activeButton = buttons.length - 1;
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
</script>

<Keypress on:keypress={keydown} />
<svelte:window on:mousemove={reset} />

<div class="menu">
    <div class="options">
        <h2>Paused</h2>
        <p>Angels are waiting - don't spend too much time here</p>
        {#each buttons as button, i}
            <Button active={activeButton === i} on:click={() => select(i)}>
                {button.text}
            </Button>
        {/each}
    </div>
</div>

<style>
    .menu {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0,0,0,0.8);
        color: white;
    }
    .options {
        text-align: center;
    }
</style>