import webp from "webp-converter";
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { createCanvas, loadImage } from "canvas";

async function convertFolder({ folder, production, base, out, ref }) {
    const promises = [];
    for(const file of await fs.readdir(folder)) {
        const loc = path.join(folder, file);
        console.log(loc, file);
        const stat = await fs.stat(loc);
        if(stat.isDirectory()) {
            promises.push(convertFolder({ folder: loc, production, base, out }));
        } else if([".png", ".jpg", ".jpeg"].includes(path.extname(loc))) {
            var rel = loc.substr(base.length);
            rel = rel.substr(0, rel.length - path.extname(rel).length);

            const targetFile = path.join(out, rel + ".webp");
            if(fsSync.existsSync(targetFile)) continue;
            
            var target = path.join(out, rel);
            var dir = target.substr(0, target.length - path.basename(target).length);
            if(!fsSync.existsSync(dir)) await fs.mkdir(dir, { recursive: true });
            
            promises.push(webp.cwebp(loc, targetFile, "-q 80"));
        } else {
            ref.warn("Non-image file found:", loc);
        }
    }
    return await Promise.all(promises);
}

let dirname = __dirname;

export function makeImages({ folders, production }) {
	return {
        name: "image-maker",
        generateBundle: async function makeImages() {
            webp.grant_permission();
            
            const base = path.join(dirname, "images/png");
            const out = path.join(dirname, "public/images");
            await fs.mkdir(out, { recursive: true });
            const ref = this;
            folders = folders.map(folder => path.join(base, folder));
            await Promise.all(folders.map(folder => convertFolder({ folder, production, base, out, ref }).catch(e => console.warn(e))));
        }
    };
};

async function getTree({ directory }) {
    const dirs = [];
    for(const item of await fs.readdir(directory)) {
        const loc = path.join(directory, item);
        const stat = await fs.stat(loc);
        if(stat.isDirectory()) dirs.push(getTree({ directory: loc }));
    }
    return dirs.length ? (await Promise.all(dirs)).flat(10) : directory;
}

async function makeSprite({ directory, base, out }) {
    const rel = directory.substr(base.length);
    const loc = path.join(out, rel) + ".png";
    if(fsSync.existsSync(loc)) return;
    const files = (await fs.readdir(directory)).sort((a, b) => parseInt(a) - parseInt(b));
    
    const canvas = createCanvas(files.length * 100, 100);
    const ctx = canvas.getContext("2d");
    await Promise.all(
        files.map(async (t, i) => {
            const image = await loadImage(path.join(directory, t));
            ctx.drawImage(image, i * 100, 0, 100, 100);
        })
    );

    await fs.mkdir(path.join(out, rel.substr(0, rel.length - path.basename(rel).length)), { recursive: true });
    const target = fsSync.createWriteStream(loc);
    const stream = canvas.createPNGStream();
    stream.pipe(target);
    return new Promise((resolve) => {
        target.on("finish", () => {
            resolve();
        });
    });
}

export function makeSprites({ production }) {
    return {
        name: "sprite-maker",
        generateBundle: async function makeSprites() {
            const base = path.join(dirname, "images/png/sprites");
            const out = path.join(dirname, "public/images/sprites");
            await fs.mkdir(out, { recursive: true });
            const tree = await getTree({ directory: base });
            await Promise.all(tree.map(directory => makeSprite({ directory, base, out })));
        }
    }
}