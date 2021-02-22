<script>
    export var active = false;
    export var self = null;
</script>

<div class="button" on:click tabindex="-1" bind:this={self} class:active>
    <slot />
</div>

<style>
    .button {
        width: 415px;
        position: relative;
        margin: auto;
        font-size: 25px;
        background: url("/sprite/button.png");
        background-size: contain;
        background-repeat: no-repeat;
        padding: 5px 70px;
        text-align: center;
        background-position-x: center;
        cursor: pointer;
        opacity: 0.8;
        margin-top: 15px;
        margin-bottom: 15px;
        transition: opacity .3s, margin .3s, transform .3s;
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
</style>