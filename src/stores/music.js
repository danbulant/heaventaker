import { Howl } from "howler";

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

    /**
     * @param {keyof musicStore} key 
     */
    static play(key) {
        this.current.howl.pause();
        this.current = musicStore[key];
        if(!this.current.howl) this.prepare();
        this.current.howl.play();
    }

    static prepare() {
        this.current.howl = new Howl({
            src: "./sound/" + this.current.src,
            html5: true,
            loop: true
        });
    }

    static startPlaying() {
        if(!this.current.howl.playing())
            this.current.howl.play();
    }
}
Music.prepare();
Music.startPlaying();

export function startPlaying(e) {
    Music.startPlaying();
}