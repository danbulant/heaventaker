import webp from "webp-converter";
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";

async function convertFolder({ folder, production, base, out, ref }) {
    const promises = [];
    for(const file of await fs.readdir(folder)) {
        const loc = path.join(folder, file);
        const stat = await fs.stat(loc);
        if(stat.isDirectory()) {
            promises.push(convertFolder({ folder: loc, production, base, out }));
        } else if([".png", ".jpg", ".jpeg"].includes(path.extname(loc))) {
            var rel = loc.substr(base.length);
            rel = rel.substr(0, rel.length - path.extname(rel).length);

            const targetFile = path.join(out, rel + ".webp");
            if(fsSync.existsSync(targetFile)) continue;
            
            var target = path.join(out, rel);
            console.log("target", target, path.basename(target));
            var dir = target.substr(0, target.length - path.basename(target).length);
            console.log("dir", dir);
            if(!fsSync.existsSync(dir)) await fs.mkdir(dir, { recursive: true });
            
            promises.push(webp.cwebp(loc, targetFile, "-q 80"));
        } else {
            ref.warn("Non-image file found:", loc);
        }
    }
    return await Promise.all(promises);
}

export function makeImages({ folders, production }) {
	return {
        name: "image-maker",
        generateBundle: async function makeImages() {
            webp.grant_permission();
            
            const base = path.join(__dirname, "images/png");
            const out = path.join(__dirname, "public/images");
            await fs.mkdir(out, { recursive: true });
            const ref = this;
            folders = folders.map(folder => path.join(base, folder));
            await Promise.all(folders.map(folder => convertFolder({ folder, production, base, out, ref })));
        }
};
};