<script>
    export var active = false;
    export var self = null;
</script>

<div class="button" on:click tabindex="-1" bind:this={self} class:active>
    <slot />
</div>

<style>
    .button {
        max-width: 700px;
        position: relative;
        font-size: 25px;
        background: url("/sprite/button2.png");
        background-size: auto 100%;
        background-repeat: repeat-x;
        padding: 5px 70px;
        text-align: center;
        background-position-x: center;
        cursor: pointer;
        opacity: 0.8;
        margin: 15px auto;
        transition: opacity .3s, margin .3s, transform .3s;
    }
    .button:before {
        content: "";
        height: 43px;
        width: 64px;
        background: url("/sprite/button1.png");
        background-size: contain;
        left: -64px;
        top: 0;
        position: absolute;
    }
    .button:after {
        content: "";
        height: 43px;
        width: 64px;
        background: url("/sprite/button1.png");
        background-size: contain;
        right: -64px;
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