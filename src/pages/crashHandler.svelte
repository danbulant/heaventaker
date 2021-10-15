<script>
    import { shared } from "../game/gameScene";
    import { gameCrashed } from "../stores/error";

    var error;
    var lastError;
    var lastUpdate;
    function handleError(e) {
        lastError = e;
        lastUpdate = shared.lastUpdate;

        setTimeout(() => {
            if(lastUpdate === shared.lastUpdate) { // if no updates in 50ms (60fps means an update each 16ms), game likely crashed from that error
                error = lastError.error;
                $gameCrashed = true;
                console.error("GAME CRASH!", error);
            }
        }, 50);
    }
</script>

<svelte:window on:error={handleError} />

{#if error}
    <div class="error">
        <h1 class="red">Game crashed {error.message === "Debug crash" ? ":>" : ":("}</h1>
        <p>Here's the error (the most important part when sharing this with devs!):</p>
        <pre class="detail"><code>{error.stack}</code></pre>
        <br>
        {#if error.message === "Debug crash"}
            <b><u>Please do NOT report this error. This error was triggered using debug key (f3) and C pressed at once.</u></b>
        {:else}
            <b><u>Please report this to the devs</u>:</b>
        {/if}
        <ul>
            <li><a href="https://discord.gg/XKPbz5xRuK">TechmandanCZ#3372</a> on Discord</li>
            <li>Mail to <a href="mailto:danbulant@danbulant.eu">danbulant@danbulant.eu</a></li>
            <li><a href="https://github.com/danbulant/heaventaker/issues/new">danbulant/heaventaker</a> on GitHub</li>
        </ul>
        <p>Please, include the error above (or the whole screen) in the report. If you're on desktop, open Dev Tools (f12), switch to Console tab in there and send a screenshot of them as well. Every report improves the game!</p>
        <p>Refresh this page (or close and reopen the application) to continue playing. Progress is auto saved (not inside levels though).</p>
    </div>
{/if}

<style>
    .red {
        color: red;
    }
    .detail {
    }
    .error {
        user-select: initial;
        pointer-events: initial;
        cursor: initial;
        background: rgb(29, 29, 29);
        color: white;
        position: fixed;
        padding: 20px;
        top: 0;
        left: 0;
        width: calc(100vw - 40px);
        height: calc(100vh - 40px);
        z-index: 999;
        overflow: auto;
    }
</style>