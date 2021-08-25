<script>
    export var steps;
    export var chapter;
</script>

<div class="overlay">
    <img src="./images/levels/overlay.webp" alt="" class="left" draggable={false}>
    <div class="left-info">{steps}</div>
    <img src="./images/levels/overlay.webp" alt="" class="right" draggable={false}>
    <div class="right-info">{chapter}</div>
</div>

<style>
    .left {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        transform: scaleX(-1);
    }
    .left-info {
        position: fixed;
        top: 72vh;
        font-size: 13vh;
        left: 16vh;
        color: white;
        width: 24vh;
        text-align: center;
    }
    .right {
        position: fixed;
        top: 0;
        right: 0;
        height: 100vh;
    }
    .right-info {
        position: fixed;
        top: 72vh;
        font-size: 13vh;
        right: 16vh;
        color: white;
        width: 24vh;
        text-align: center;
    }
</style>