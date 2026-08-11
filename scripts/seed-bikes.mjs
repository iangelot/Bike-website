/**
 * One-off: load the 12 launch bikes into Supabase.
 *
 * Uploads each optimised photo from public/bikes/<slug>/ into the bike-photos
 * storage bucket, then inserts (or updates) a row per bike with the public
 * photo URLs. Safe to re-run — it upserts on slug and overwrites photos.
 *
 * Reads the seed data straight from the pure data module. That module has no
 * framework imports, so plain Node can load it via type-stripping:
 *
 *   node --experimental-strip-types scripts/seed-bikes.mjs
 *
 * Requires in the environment (or .env.local):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY   (Settings → API → service_role)
 */
import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { seedBikes } from "../src/lib/bikes.ts";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Set them (or put them in .env.local and load it) and re-run.",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false },
});

const BUCKET = "bike-photos";
const PUBLIC = path.join(process.cwd(), "public");

for (const [index, bike] of seedBikes.entries()) {
  const photos = [];

  for (const photo of bike.photos) {
    // photo.src is "/bikes/<slug>/<file>.webp"; the file is under public/.
    const storagePath = photo.src.replace(/^\/bikes\//, "");
    const bytes = await readFile(path.join(PUBLIC, photo.src));

    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, bytes, {
        contentType: "image/webp",
        upsert: true,
      });
    if (upErr) throw new Error(`upload ${storagePath}: ${upErr.message}`);

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);

    photos.push({
      src: publicUrl,
      alt: photo.alt,
      ...(photo.focus ? { focus: photo.focus } : {}),
    });
  }

  const { error: rowErr } = await supabase.from("bikes").upsert(
    {
      slug: bike.slug,
      make: bike.make,
      model: bike.model,
      year: bike.year,
      distance: bike.distance,
      distance_unit: bike.distanceUnit,
      price: bike.price,
      colour: bike.colour ?? null,
      fuel_type: bike.fuelType ?? null,
      location: bike.location ?? null,
      warranty: bike.warranty ?? null,
      featured: bike.featured ?? false,
      photos,
      sort_order: index,
    },
    { onConflict: "slug" },
  );
  if (rowErr) throw new Error(`upsert ${bike.slug}: ${rowErr.message}`);

  console.log(`✓ ${bike.slug} (${bike.photos.length} photos)`);
}

console.log(`\nSeeded ${seedBikes.length} bikes.`);
