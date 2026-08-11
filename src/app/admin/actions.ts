"use server";

import crypto from "node:crypto";
import { redirect } from "next/navigation";
import sharp from "sharp";
import { requireUser } from "@/lib/auth";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getServiceClient } from "@/lib/supabase/service";
import type { Photo } from "@/lib/bikes";

const BUCKET = "bike-photos";

export type SaveResult = { ok: true; slug: string } | { ok: false; error: string };

/** "Yamaha", "R1", 2020 → "yamaha-r1-2020". */
function slugify(make: string, model: string, year: number): string {
  return `${make} ${model} ${year}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** One item of the ordered photo plan the form submits. */
type PlanItem = { k: "e"; src: string; alt: string } | { k: "n"; i: number };

function str(form: FormData, key: string): string {
  return String(form.get(key) ?? "").trim();
}

/** Create or update a listing. Called from the client form. */
export async function saveBike(form: FormData): Promise<SaveResult> {
  await requireUser();
  const supabase = getServiceClient();

  const make = str(form, "make");
  const model = str(form, "model");
  const year = Number(str(form, "year"));
  const distance = Number(str(form, "distance"));
  const price = Number(str(form, "price"));

  if (!make || !model) return { ok: false, error: "Make and model are required." };
  if (!Number.isFinite(year) || year < 1900 || year > 2100)
    return { ok: false, error: "Enter a valid year." };
  if (!Number.isFinite(distance) || distance < 0)
    return { ok: false, error: "Enter a valid mileage." };
  if (!Number.isFinite(price) || price < 0)
    return { ok: false, error: "Enter a valid price." };

  const isEdit = str(form, "isEdit") === "1";
  const existingSlug = str(form, "slug");

  // Slug is stable once created, so a listing's URL and photo folder don't move
  // when its details are edited.
  let slug = existingSlug;
  if (!isEdit || !slug) {
    slug = slugify(make, model, year);
    for (let n = 2; ; n++) {
      const { data } = await supabase
        .from("bikes")
        .select("slug")
        .eq("slug", slug)
        .maybeSingle();
      if (!data) break;
      slug = `${slugify(make, model, year)}-${n}`;
    }
  }

  const alt = `${year} ${make} ${model}`;

  let plan: PlanItem[];
  try {
    plan = JSON.parse(str(form, "photoPlan") || "[]");
  } catch {
    return { ok: false, error: "Could not read the photo list." };
  }

  const photos: Photo[] = [];
  for (const item of plan) {
    if (item.k === "e") {
      photos.push({ src: item.src, alt: item.alt || alt });
      continue;
    }
    const file = form.get(`newphoto_${item.i}`);
    if (!(file instanceof File) || file.size === 0) continue;

    // Re-encode to a sensible web size, same as the launch photos, so a phone
    // upload doesn't ship a 6 MB original to every visitor.
    const input = Buffer.from(await file.arrayBuffer());
    let webp: Buffer;
    try {
      webp = await sharp(input)
        .rotate()
        .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();
    } catch {
      return { ok: false, error: "One of the images could not be read. Use JPG, PNG or WebP." };
    }

    const path = `${slug}/${crypto.randomUUID()}.webp`;
    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, webp, { contentType: "image/webp", upsert: false });
    if (upErr) return { ok: false, error: `Photo upload failed: ${upErr.message}` };

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET).getPublicUrl(path);
    photos.push({ src: publicUrl, alt });
  }

  if (photos.length === 0)
    return { ok: false, error: "Add at least one photo." };

  const row = {
    slug,
    make,
    model,
    year,
    distance,
    distance_unit: str(form, "distanceUnit") === "km" ? "km" : "mi",
    price,
    colour: str(form, "colour") || null,
    fuel_type: str(form, "fuelType") || null,
    location: str(form, "location") || null,
    warranty: str(form, "warranty") || null,
    featured: form.get("featured") === "on" || form.get("featured") === "true",
    photos,
  };

  if (isEdit && existingSlug) {
    const { error } = await supabase.from("bikes").update(row).eq("slug", existingSlug);
    if (error) return { ok: false, error: error.message };
  } else {
    const { error } = await supabase.from("bikes").insert(row);
    if (error) return { ok: false, error: error.message };
  }

  return { ok: true, slug };
}

/** Delete a listing and its photos. */
export async function deleteBike(slug: string): Promise<{ ok: boolean; error?: string }> {
  await requireUser();
  const supabase = getServiceClient();

  // Best effort — a leftover image is harmless, a failed delete is not.
  const { data: files } = await supabase.storage.from(BUCKET).list(slug);
  if (files && files.length > 0) {
    await supabase.storage
      .from(BUCKET)
      .remove(files.map((f) => `${slug}/${f.name}`));
  }

  const { error } = await supabase.from("bikes").delete().eq("slug", slug);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/** Sign the admin out. Runs in an action context, so it can clear cookies. */
export async function signOutAction() {
  const supabase = await getSupabaseServer();
  if (supabase) await supabase.auth.signOut();
  redirect("/admin/login");
}
