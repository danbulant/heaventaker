<script>
    export var active = true;
</script>

<div class:active class="main">
    <div class="positioner">
        <slot />
    </div>
</div>

<style>
    .main {
        width: 100vw;
        height: 0;
        position: absolute;
        overflow: hidden;
        top: 50vh;
        transition: top .2s, height .2s;
    }
    .positioner {
        position: absolute;
        top: -50vh;
        left: 0;
        width: 100vw;
        height: 100vh;
        transition: top .2s;
    }
    .main.active {
        height: 100%;
        top: 0;
    }
    .active .positioner {
        top: 0;
    }
</style>