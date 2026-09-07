// Downscales images under public/images so the repo stays small and Open Graph
// previews load quickly. next/image handles per-device resizing at runtime, so
// originals only need to cover 2x retina at the ~680px article width.
//
// Usage: pnpm images
import { readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.join(process.cwd(), "public/images");
const MAX_EDGE = 1600; // px, long edge
const MAX_BYTES = 500 * 1024; // re-encode anything larger, even if already small enough in pixels
const JPEG_QUALITY = 80;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (/\.(jpe?g|png)$/i.test(entry.name)) yield full;
  }
}

const kb = (n) => `${Math.round(n / 1024)} KB`;
let touched = 0;

for await (const file of walk(ROOT)) {
  const { size } = await stat(file);
  const meta = await sharp(file).metadata();
  const rotated = (meta.orientation ?? 1) >= 5;
  const longEdge = Math.max(meta.width, meta.height);

  if (longEdge <= MAX_EDGE && size <= MAX_BYTES && !rotated) continue;

  let pipeline = sharp(file)
    .rotate() // bake in EXIF orientation
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true });
  pipeline =
    meta.format === "png"
      ? pipeline.png({ compressionLevel: 9 })
      : pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });

  const out = await pipeline.toBuffer();
  await writeFile(file, out);
  touched++;
  console.log(`${path.relative(process.cwd(), file)}  ${kb(size)} -> ${kb(out.length)}`);
}

console.log(touched ? `Optimized ${touched} image(s).` : "All images already within limits.");
