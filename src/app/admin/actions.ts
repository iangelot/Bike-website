"use server";

import crypto from "node:crypto";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getServiceClient } from "@/lib/supabase/service";
import type { Photo } from "@/lib/bikes";

const BUCKET = "bike-photos";

export type SaveResult = { ok: true; slug: string } | { ok: false; error: string };

/**
 * "Yamaha", "R1", 2020 → "yamaha-r1-2020".
 *
 * Every part is optional, so this takes whatever was filled in. With none of
 * them it returns "" and the caller falls back to a generated id — a listing
 * still needs a URL even if it is, so far, just a photo and a price.
 */
function slugify(parts: Array<string | number | undefined>): string {
  return parts
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function str(form: FormData, key: string): string {
  return String(form.get(key) ?? "").trim();
}

/**
 * A number field, or undefined when left blank.
 *
 * Blank is a legitimate answer everywhere in this form — see the note on
 * `Bike` — so only a value that is present and unreadable is an error, which
 * is what the `invalid` flag distinguishes.
 */
function num(
  form: FormData,
  key: string,
): { value?: number; invalid: boolean } {
  const raw = str(form, key).replace(/[,\s]/g, "");
  if (!raw) return { invalid: false };
  const value = Number(raw);
  if (!Number.isFinite(value)) return { invalid: true };
  return { value, invalid: false };
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
 * Nothing on the form is required. A seller who does not know the year, has
 * not settled on a price, or is publishing before the photos are taken can
 * save what they have and fill the rest in later — the public pages omit what
 * is missing rather than showing blanks or zeroes. The only checks left are on
 * values that WERE supplied and cannot be true (a year of 3050, a negative
 * price), because those are typos, not omissions.
 *
 * Photos arrive already uploaded (see createUploadTarget) as a list of URLs, so
 * this call carries only text and stays tiny.
 */
export async function saveBike(form: FormData): Promise<SaveResult> {
  await requireUser();
  const supabase = getServiceClient();

  const make = str(form, "make");
  const model = str(form, "model");

  const year = num(form, "year");
  const distance = num(form, "distance");
  const price = num(form, "price");

  if (year.invalid || (year.value !== undefined && (year.value < 1900 || year.value > 2100)))
    return { ok: false, error: "Enter a valid year, or leave it blank." };
  if (distance.invalid || (distance.value !== undefined && distance.value < 0))
    return { ok: false, error: "Enter a valid mileage, or leave it blank." };
  if (price.invalid || (price.value !== undefined && price.value < 0))
    return { ok: false, error: "Enter a valid price, or leave it blank." };

  const isEdit = str(form, "isEdit") === "1";
  const existingSlug = str(form, "slug");

  // Slug is stable once created, so a listing's URL doesn't move when edited.
  let slug = existingSlug;
  if (!isEdit || !slug) {
    // With no make, model or year to name it after, the listing still needs a
    // URL — "listing-8f2c1a" is ugly but reachable, and the admin can give the
    // bike a name later without the URL changing under existing links.
    const base = slugify([make, model, year.value]) || `listing-${crypto.randomUUID().slice(0, 6)}`;
    slug = base;
    for (let n = 2; ; n++) {
      const { data } = await supabase
        .from("bikes")
        .select("slug")
        .eq("slug", slug)
        .maybeSingle();
      if (!data) break;
      slug = `${base}-${n}`;
    }
  }

  // Fallback alt text for photos the admin didn't caption.
  const alt = [year.value, make, model].filter(Boolean).join(" ") || "Motorcycle for sale";

  let incoming: Array<{ src?: string; alt?: string }>;
  try {
    incoming = JSON.parse(str(form, "photos") || "[]");
  } catch {
    return { ok: false, error: "Could not read the photo list." };
  }

  const photos: Photo[] = incoming
    .filter((p) => typeof p.src === "string" && p.src)
    .map((p) => ({ src: p.src as string, alt: p.alt || alt }));

  const row = {
    slug,
    make: make || null,
    model: model || null,
    year: year.value ?? null,
    distance: distance.value ?? null,
    distance_unit: str(form, "distanceUnit") === "km" ? "km" : "mi",
    price: price.value ?? null,
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
