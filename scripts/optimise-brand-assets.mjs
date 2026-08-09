/**
 * Optimiser for the brand artwork exported from Figma.
 *
 * Reads originals from design/source/ and writes web-ready files to
 * public/brand/. Originals are never modified, so this can be re-run safely
 * and re-run after better-quality source files arrive.
 *
 * Cut-outs need an alpha channel, so they become WebP with alpha rather than
 * palette PNG — an earlier version used palette PNG, which quantises a
 * photograph to 256 colours and is what made the bikes look blurry.
 *
 *   node scripts/optimise-brand-assets.mjs
 */
import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = path.join(process.cwd(), "design", "source");
const OUT = path.join(process.cwd(), "public", "brand");

/**
 * maxWidth = widest CSS size the asset is displayed at, doubled for retina.
 * `trim` removes transparent padding first — the logo exports carry a large
 * empty margin, which otherwise makes them impossible to size predictably.
 */
const TARGETS = [
  { from: "road-band.png", to: "road-band.webp", maxWidth: 1400 },
  { from: "bike-black.png", to: "hero-bike.webp", maxWidth: 2400 },
  { from: "bike-red.png", to: "bike-red.webp", maxWidth: 480 },
  { from: "bike-blue.png", to: "bike-blue.webp", maxWidth: 480 },
  { from: "logo-dark.png", to: "logo-dark.webp", maxWidth: 600, trim: true },
  { from: "rageride-logo.png", to: "logo-light.webp", maxWidth: 600, trim: true },
];

const kb = (b) => `${(b / 1024).toFixed(0)}kB`;

await mkdir(OUT, { recursive: true });

for (const { from, to, maxWidth, trim } of TARGETS) {
  const src = path.join(SRC, from);
  const dest = path.join(OUT, to);

  const meta = await sharp(src).metadata();
  const before = (await stat(src)).size;

  let pipeline = sharp(src);
  if (trim) pipeline = pipeline.trim({ threshold: 10 });

  // withoutEnlargement means a small original stays small rather than being
  // upscaled into softness — the file simply reports as under-resolution.
  await pipeline
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: 90, alphaQuality: 100, effort: 5 })
    .toFile(dest);

  const after = (await stat(dest)).size;
  const outMeta = await sharp(dest).metadata();
  const short = outMeta.width < maxWidth ? `  ⚠ source only ${meta.width}px wide` : "";

  console.log(
    `${from} (${meta.width}x${meta.height}) → ${to} (${outMeta.width}x${outMeta.height})  ` +
      `${kb(before)} → ${kb(after)}${short}`,
  );
}

let total = 0;
for (const f of await readdir(OUT)) total += (await stat(path.join(OUT, f))).size;
console.log(`\ntotal public/brand: ${kb(total)}`);
