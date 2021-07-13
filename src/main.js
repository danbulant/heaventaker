import App from './App.svelte';
import { shared } from './game/gameScene';
import { sharedErrorData } from './stores/error';

const app = new App({
	target: document.body
});

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('./service-worker.js');
}

var lastUpdate;
var lastError;
window.addEventListener("error", (error) => {
	lastError = error;
	lastUpdate = shared.lastUpdate;

	setTimeout(() => {
		if(lastUpdate === shared.lastUpdate) { // if no updates in 50ms (60fps means an update each 16ms), game likely crashed from that error
			if(!sharedErrorData.gameCrashed) { // svelte crashed, or something similarly horrible happened. Bare minimum error will now show
				error = lastError.error;
				console.error("GAME CRASH!", error);
				console.error("Normal crash handler couldn't handle it, using the backup non-svelte one.");
				console.warn("Screenshot the above messages, and report them to the devs. If you can, open the first error (red box) you see (simply clicking should do the job), and send it's contents as well.");
				console.warn("This site does not track it's users, nor does it send any data about them - the dev won't know about this error until you report it. So please do it.");

				document.body.innerHTML = `
<div class="error">
	<h1>Heaventaker horribly crashed.</h1>
	<p>Here's the error (the most important part when sharing this with devs!):</p>
	<pre><code>${error.stack}</code></pre>
	<br>
	<b><u>Please report this to the devs</u>:</b>
	<ul>
		<li><a href="https://discord.gg/XKPbz5xRuK">TechmandanCZ#3372</a> on Discord</li>
		<li>Mail to <a href="mailto:danbulant@danbulant.eu">danbulant@danbulant.eu</a></li>
		<li><a href="https://github.com/danbulant/heaventaker/issues/new">danbulant/heaventaker</a> on GitHub</li>
	</ul>
	<p>Please, include the error above (or the whole screen) in the report. If you're on desktop, open Dev Tools (f12), switch to Console tab in there and send a screenshot of them as well. Every report improves the game!</p>
	<p>You should never see this page, as there's another page for normal errors. If you see this page, it means something went horribly to the point not even the normal error page can handle it.</p>
	<!-- If you can't see this page, then you should be fine. Or something went even more horribly, but in that case I have no idea how to prevent it without knowing it happened. -->
</div>
<style>
    .error {
        user-select: initial;
        pointer-events: initial;
        cursor: initial;
        background: red;
        color: white;
        position: fixed;
        padding: 20px;
        top: 0;
        left: 0;
        width: calc(100vw - 40px);
        height: calc(100vh - 40px);
        z-index: 999;
    }
</style>
`;
			}
		}
	}, 100);
});

export default app;