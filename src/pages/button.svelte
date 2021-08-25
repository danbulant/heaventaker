<script>
    export var active = false;
    export var self = null;
</script>

<div class="button" on:click tabindex="-1" bind:this={self} class:active>
    <slot />
</div>

<style>
    .button {
        max-width: 800px;
        position: relative;
        font-size: clamp(1rem, 4vh - 0.2rem, 1.5rem);
        background: url("../images/button/middle.webp");
        background-size: auto 100%;
        background-repeat: repeat-x;
        padding: 5px 5px;
        text-align: center;
        background-position-x: center;
        cursor: pointer;
        opacity: 0.8;
        margin: 15px auto;
        transition: opacity .3s, margin .3s, transform .3s;
    }
    .button:before {
        content: "";
        height: 1.72em;
        width: 2.56em;
        background: url("../images/button/start.webp");
        background-size: contain;
        left: -2.56em;
        top: 0;
        position: absolute;
    }
    .button:after {
        content: "";
        height: 1.72em;
        width: 2.56em;
        background: url("../images/button/start.webp");
        background-size: contain;
        right: -2.56em;
        top: 0;
        position: absolute;
        transform: scaleX(-1);
    }
    .button:first-child:hover, .button:first-child:focus, .button:first-child.active {
        margin-top: 15px;
    }
    .button:hover, .button:focus, .button.active {
        outline: none;
        opacity: 1;
        margin-top: 5px;
        margin-bottom: 5px;
        transform: scale(1.2);
    }
    .button.button:last-child {
        margin-bottom: 0;
    }
</style>