<script>
    import { createEventDispatcher } from "svelte";

    const keys = new Set();
    const dispatch = createEventDispatcher();
    function keydown(e) {
        if(!keys.has(e.key)) {
            dispatch("keypress", e);
            console.log("keypress");
            keys.add(e.key);
        }
    }
    function keyup(e) {
        keys.delete(e.key);
    }
</script>

<svelte:window on:keydown={keydown} on:keyup={keyup} />