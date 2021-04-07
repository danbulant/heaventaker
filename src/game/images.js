class ImageHandler {
    constructor() {
        /** @type {Map<string, HTMLImageElement>} */
        this.images = new Map();

        /** @type {Function[]} */
        this.onloadHandlers = [];
        this.loaded = false;
        this.shouldFire = false;
    }

    /**
     * Runs the handler when all images are loaded
     * @param {(images: Map<string, Image>) => void} handler 
     */
    onload(handler) {
        this.onloadHandlers.push(handler);
    }
    
    areLoaded() {
        return this.loaded && this.areAllLoaded();
    }

    startLoad() {
        this.shouldFire = true;
        if(this.areAllLoaded()) {
            this.onloadHandlers.forEach(cb => cb(this.images));
            this.onloadHandlers = [];
            this.loaded = true;
            this.shouldFire = false;
        }
    }
    
    areAllLoaded() {
        return [...this.images.values()].every(a => a.complete && a.naturalHeight !== 0);
    }

    update() {
        if(!this.areAllLoaded() || !this.shouldFire) return; // not yet
        this.onloadHandlers.forEach(cb => cb(this.images));
        this.onloadHandlers = [];
        this.loaded = true;
    }

    get(image) {
        return this.images.get(image);
    }

    /**
     * Adds the image to requested load
     * @param {string} key
     * @param {string | Image} image 
     */
    load(key, image) {
        if(typeof image === "string") {
            var i = new Image();
            i.onload = () => this.update();
            i.src = image;
            image = i;
        } else {
            image.onload = () => this.update();
        }
        this.loaded = false;
        this.images.set(key, image);
    }
}

var images = new ImageHandler;
export { ImageHandler };
export default images;