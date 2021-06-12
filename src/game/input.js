import Hammer from "hammerjs";

const keybinds = {
    "right": "ArrowRight",
    "left": "ArrowLeft",
    "up": "ArrowUp",
    "down": "ArrowDown",
    "debug": "f3",
    "pause": "Escape"
};

class KeyHandler {
    constructor() {
        this.keys = new Map();
        this.treshold = 0.3;

        this.hammertime = new Hammer(document);

        this.axis = new Map([
            ["x", ["moveRight", "moveLeft"]],
            ["y", ["moveUp", "moveDown"]],
            ["rotation", 0]
        ]);

        /** @type {{ type: keyof DocumentEventMap, listener: (this: Document, ev: Event) => any, options?: boolean | EventListenerOptions}} */
        this.handlers = [];
        this.addHandlers();
        this.mounted = false;
        this.mountHandlers();
        this.keysWasPressed = new Map();
        /** @type {Map<string, Function[]>} */
        this.listeners = new Map();
    }

    /**
     * @param {K} type
     * @param {(this: Document, ev: DocumentEventMap[K]) => any} listener
     * @param {boolean | EventListenerOptions} [options]
     * @template {keyof DocumentEventMap} K
     */
    addDocumentEventListener(type, listener, options) {
        this.handlers.push({
            type,
            listener,
            options
        });
        if(this.mounted) document.addEventListener(type, listener, options);
    }

    /**
     * Adds an event listener
     * @param {string} type
     * @param {(ev: keyof keybinds) => any} listener
     */
    addEventListener(type, listener) {
        if(!this.listeners.has(type)) this.listeners.set(type, []);
        this.listeners.get(type).push(listener);
    }

    /**
     * Emits an event
     * @param {string} type 
     * @param {keyof keybinds} data 
     */
    emit(type, data) {
        if(!this.listeners.has(type)) return;
        this.listeners.get(type).forEach(listener => listener(data));
    }

    /**
     * @param {K} type
     * @param {(this: Document, ev: DocumentEventMap[K]) => any} listener
     * @param {boolean | EventListenerOptions} [options]
     * @template {keyof DocumentEventMap} K
     */
    removeEventListener(type, listener, options) {
        var handler = this.handlers.findIndex(e => e.type === type && e.listener === listener && e.options === options);
        if(handler !== -1) this.handlers.splice(handler, 1);
        document.removeEventListener(type, listener, options);
    }
    addHandlers() {
        this.addDocumentEventListener("keydown", (ev) => {
            if(this.pressKeyBind(ev.key)) {
                ev.preventDefault();
                return false;
            };
        });
        this.addDocumentEventListener("keyup", (ev) => {
            if(this.unpressKeyBind(ev.key)) {
                ev.preventDefault();
                return false;
            };
        });

        this.hammertime.on("tap", (ev) => {
            var { x, y } = ev.center;
            x -= innerWidth / 2;
            y -= innerHeight / 2;
            var multiplier = 1 / (Math.abs(x) + Math.abs(y));
            x *= multiplier;
            y *= multiplier;
            var direction;
            if(x >= 0.5) {
                direction = "right";
            } else if(x <= -0.5) {
                direction = "left";
            } else if(y >= 0.5) {
                direction = "down";
            } else if(y <= -0.5) {
                direction = "up";
            }
            this.keysWasPressed.set(direction, true);
        });
        this.hammertime.on('swipeleft', (ev) => {
            this.keysWasPressed.set("left", true);
        });
        this.hammertime.on('swiperight', (ev) => {
            this.keysWasPressed.set("right", true);
        });
        this.hammertime.on('swipeup', (ev) => {
            this.keysWasPressed.set("up", true);
        });
        this.hammertime.on('swipedown', (ev) => {
            this.keysWasPressed.set("down", true);
        });
        this.hammertime.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
    }
    mountHandlers() {
        for(var { type, listener, options } of this.handlers) {
            document.addEventListener(type, listener, options);
        }
        this.mounted = true;
    }
    unmountHandlers() {
        for(var { type, listener, options } of this.handlers) {
            document.removeEventListener(type, listener, options);
        }
        this.mounted = false;
    }
    pressKeyBind(key) {
        var kb = this.getKeyBind(key);
        if(!kb) return null;
        this.keysWasPressed.set(kb, true);
        this.emit("keyDown", kb);
        return this.pressKey(kb);
    }
    unpressKeyBind(key) {
        var kb = this.getKeyBind(key);
        if(!kb) return null;
        this.keysWasPressed.delete(kb);
        this.emit("keyUp", kb);
        return this.unpressKey(kb);
    }
    setKeyBindAxis(key, value) {
        var kb = this.getKeyBind(key);
        if(!kb) return null;
        return this.setAxis(kb, value);
    }
    getKeyBind(key) {
        var index = Object.values(keybinds).map(t => t.toLowerCase()).indexOf(key.toLowerCase());
        if(index === -1) return null;
        return Object.keys(keybinds)[index];
    }

    isKeyPressed(key) {
        return this.keys.has(key) && this.keys.get(key) > this.treshold;
    }
    
    wasKeyPressed(key) {
        var was = this.keysWasPressed.has(key);
        this.keysWasPressed.delete(key);
        return was;
    }
    
    getAxis(key) {
        if(!this.axis.has(key)) return;
        var val = this.axis.get(key);
        if(typeof val === "number") return val;
        if(typeof val === "string") return this.keys.get(val);
        var res = 0;
        res += this.isKeyPressed(val[0]) ? 1 : 0;
        res -= this.isKeyPressed(val[1]) ? 1 : 0;
        return res;
    }

    pressKey(key) {
        return this.keys.set(key, 1);
    }

    unpressKey(key) {
        return this.keys.set(key, 0);
    }

    setAxis(key, val) {
        return this.axis.set(key, val);
    }
}

var keys = new KeyHandler;

export { keys };
