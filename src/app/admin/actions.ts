"use server";

import crypto from "node:crypto";
import { redirect } from "next/navigation";
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

function str(form: FormData, key: string): string {
  return String(form.get(key) ?? "").trim();
}

/**
 * Hand the browser a one-time signed URL to upload a photo straight to storage.
 *
 * This is the key to reliable multi-photo uploads: the image bytes go directly
 * from the phone to Supabase, never through the save action, so a bike with ten
 * big photos can't blow the request-size limit. Gated by requireUser, and the
 * signed token authorises just this one upload.
 */
export async function createUploadTarget(): Promise<
  { ok: true; path: string; token: string } | { ok: false; error: string }
> {
  await requireUser();
  const supabase = getServiceClient();
  const path = `uploads/${crypto.randomUUID()}.jpg`;
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUploadUrl(path);
  if (error || !data) {
    return { ok: false, error: error?.message ?? "Could not start the upload." };
  }
  return { ok: true, path, token: data.token };
}

/**
 * Create or update a listing.
 *
 * Photos arrive already uploaded (see createUploadTarget) as a list of URLs, so
 * this call carries only text and stays tiny.
 */
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

  // Slug is stable once created, so a listing's URL doesn't move when edited.
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

  let incoming: Array<{ src?: string; alt?: string }>;
  try {
    incoming = JSON.parse(str(form, "photos") || "[]");
  } catch {
    return { ok: false, error: "Could not read the photo list." };
  }

  const photos: Photo[] = incoming
    .filter((p) => typeof p.src === "string" && p.src)
    .map((p) => ({ src: p.src as string, alt: p.alt || alt }));

  if (photos.length === 0) return { ok: false, error: "Add at least one photo." };

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
export async function deleteBike(
  slug: string,
): Promise<{ ok: boolean; error?: string }> {
  await requireUser();
  const supabase = getServiceClient();

  // Work out each photo's storage path from its public URL and remove them.
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const { data: row } = await supabase
    .from("bikes")
    .select("photos")
    .eq("slug", slug)
    .maybeSingle();

  const paths: string[] = [];
  const photos = (row?.photos ?? []) as Photo[];
  for (const p of photos) {
    const after = String(p.src).split(marker)[1];
    if (after) paths.push(decodeURIComponent(after));
  }
  // Older seed photos also live under a folder named after the slug.
  const { data: legacy } = await supabase.storage.from(BUCKET).list(slug);
  if (legacy) paths.push(...legacy.map((f) => `${slug}/${f.name}`));

  if (paths.length > 0) await supabase.storage.from(BUCKET).remove(paths);

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
