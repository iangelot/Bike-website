/**
 * Optimiser for listing photography.
 *
 * Reads design/source/bikes/<slug>/*.{jpg,jpeg,png} and writes web-ready WebP
 * to public/bikes/<slug>/. Originals are never touched, so this is safe to
 * re-run and safe to re-run against better scans later.
 *
 * Unlike the brand artwork, these are photographs with real backgrounds: no
 * alpha, no trimming, and quality matters more than the last few kB. They are
 * capped at 1600px on the long edge, which covers the largest place any of
 * them renders (a listing page hero at 2x) without shipping phone-camera
 * originals to a visitor on mobile data.
 *
 * File order is the display order — name them 01-…, 02-… and the first is the
 * card and hero photo.
 *
 *   node scripts/optimise-listing-photos.mjs
 */
import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = path.join(process.cwd(), "design", "source", "bikes");
const OUT = path.join(process.cwd(), "public", "bikes");

const MAX_EDGE = 1600;
const SOURCE = /\.(jpe?g|png)$/i;

const kb = (b) => `${(b / 1024).toFixed(0)}kB`;

let slugs;
try {
  slugs = (await readdir(SRC, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
} catch {
  console.log("No design/source/bikes directory yet — nothing to do.");
  process.exit(0);
}

let total = 0;

for (const slug of slugs) {
  const from = path.join(SRC, slug);
  const to = path.join(OUT, slug);
  await mkdir(to, { recursive: true });

  const photos = (await readdir(from)).filter((name) => SOURCE.test(name)).sort();

  for (const photo of photos) {
    const dest = path.join(to, photo.replace(SOURCE, ".webp"));
    const meta = await sharp(path.join(from, photo)).metadata();
    const before = (await stat(path.join(from, photo))).size;

    await sharp(path.join(from, photo))
      // fit: "inside" caps the long edge whichever way round the photo is, so
      // portrait phone shots and landscape ones both land at 1600.
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
      .rotate() // honours the EXIF orientation flag before it is stripped
      .webp({ quality: 82, effort: 5 })
      .toFile(dest);

    const after = (await stat(dest)).size;
    total += after;

    const outMeta = await sharp(dest).metadata();
    console.log(
      `${slug}/${photo} (${meta.width}x${meta.height}) → ` +
        `${outMeta.width}x${outMeta.height}  ${kb(before)} → ${kb(after)}`,
    );
  }
}

console.log(`\ntotal public/bikes: ${kb(total)}`);
