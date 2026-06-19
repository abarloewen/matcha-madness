#!/usr/bin/env node
/* Download all hotlinked Squarespace images into assets/img/ and rewrite the
   HTML to use local paths — for a fully self-contained deployment.
   Run on your own machine:  node localize-images.js                          */
const fs = require("fs");
const path = require("path");
const https = require("https");

const IMG_DIR = path.join(__dirname, "assets", "img");
fs.mkdirSync(IMG_DIR, { recursive: true });

const htmlFiles = fs.readdirSync(__dirname).filter(f => f.endsWith(".html"));
const urlRe = /https:\/\/images\.squarespace-cdn\.com\/[^\s"')]+/g;

// collect unique URLs
const urls = new Set();
const fileText = {};
for (const f of htmlFiles) {
  const t = fs.readFileSync(path.join(__dirname, f), "utf8");
  fileText[f] = t;
  (t.match(urlRe) || []).forEach(u => urls.add(u));
}

// map url -> local filename (based on last path segment, deduped)
const map = {};
const used = new Set();
for (const u of urls) {
  const base = decodeURIComponent(u.split("?")[0].split("/").pop()).replace(/[^a-zA-Z0-9.\-_]/g, "_");
  let name = base, i = 1;
  while (used.has(name)) { const dot = base.lastIndexOf("."); name = base.slice(0, dot) + "-" + (i++) + base.slice(dot); }
  used.add(name);
  map[u] = name;
}

function download(u, dest) {
  return new Promise((res, rej) => {
    https.get(u, r => {
      if (r.statusCode !== 200) return rej(new Error("HTTP " + r.statusCode + " for " + u));
      const ws = fs.createWriteStream(dest);
      r.pipe(ws);
      ws.on("finish", () => ws.close(res));
    }).on("error", rej);
  });
}

(async () => {
  console.log("Downloading " + Object.keys(map).length + " images …");
  for (const [u, name] of Object.entries(map)) {
    try { await download(u, path.join(IMG_DIR, name)); process.stdout.write("."); }
    catch (e) { console.log("\n  ! " + e.message); }
  }
  console.log("\nRewriting HTML …");
  for (const f of htmlFiles) {
    let t = fileText[f];
    for (const [u, name] of Object.entries(map)) {
      t = t.split(u).join("assets/img/" + name);
    }
    fs.writeFileSync(path.join(__dirname, f), t);
  }
  console.log("Done. Images are in assets/img/ and HTML now uses local paths.");
})();
