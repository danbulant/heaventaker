import { Howl } from "howler";
import { writable } from "svelte/store";

export const musicStore = {
    departure: {
        src: "mittsies-departure.mp3",
        bpm: 128,
        scale: 1/2,
        /** @type {Howl} */
        howl: null
    }
}

export class Music {
    static current = musicStore.departure;

    static isPlaying = writable(false);

    /**
     * @param {keyof musicStore} key 
     */
    static play(key) {
        this.current.howl.pause();
        this.current = musicStore[key];
        if(!this.current.howl) this.prepare();
        this.current.howl.play();
        if(this.current.howl.playing()) {
            this.isPlaying.set(true);
        }
        this.current.howl.on("play", () => this.isPlaying.set(true));
        this.current.howl.on("pause", () => this.isPlaying.set(false));
    }

    static prepare() {
        this.current.howl = new Howl({
            src: "./sound/" + this.current.src,
            html5: true,
            loop: true
        });
    }

    static startPlaying() {
        if(!this.current.howl.playing()) {
            this.current.howl.play();
            this.isPlaying.set(true);
        }
    }
}
Music.prepare();
Music.startPlaying();

export const isPlaying = Music.isPlaying;

export function startPlaying(e) {
    Music.startPlaying();
}