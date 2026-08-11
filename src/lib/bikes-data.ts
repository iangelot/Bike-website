import { getSupabaseServer } from "@/lib/supabase/server";
import { seedBikes, type Bike, type Photo } from "@/lib/bikes";

/**
 * The reads every page calls.
 *
 * When Supabase is configured these hit the database; otherwise they return
 * the built-in seed so the site works before the backend exists. Once the
 * database is live the seed is never shown — an error returns an empty list
 * rather than resurrecting old or deleted stock, which would mislead a buyer.
 *
 * The functions are async now (they were synchronous when the data lived in a
 * file). Every caller is a Server Component, so awaiting them is free.
 */

/** A row of the `bikes` table — snake_case, as Postgres returns it. */
type BikeRow = {
  slug: string;
  make: string;
  model: string;
  year: number;
  distance: number;
  distance_unit: "mi" | "km";
  price: number;
  colour: string | null;
  fuel_type: string | null;
  location: string | null;
  warranty: string | null;
  featured: boolean;
  photos: Photo[] | null;
};

function rowToBike(row: BikeRow): Bike {
  return {
    slug: row.slug,
    make: row.make,
    model: row.model,
    year: row.year,
    distance: row.distance,
    distanceUnit: row.distance_unit,
    price: row.price,
    colour: row.colour ?? undefined,
    fuelType: row.fuel_type ?? undefined,
    location: row.location ?? undefined,
    warranty: row.warranty ?? undefined,
    featured: row.featured ?? false,
    photos: Array.isArray(row.photos) ? row.photos : [],
  };
}

export async function getAllBikes(): Promise<Bike[]> {
  const supabase = await getSupabaseServer();
  if (!supabase) return seedBikes;

  const { data, error } = await supabase
    .from("bikes")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAllBikes:", error.message);
    return [];
  }
  return (data as BikeRow[]).map(rowToBike);
}

/**
 * The home page's "Featured Listings". Featured bikes if any are flagged;
 * otherwise the first four, so the section is never empty.
 */
export async function getFeaturedBikes(limit = 4): Promise<Bike[]> {
  const all = await getAllBikes();
  const featured = all.filter((bike) => bike.featured);
  return (featured.length > 0 ? featured : all).slice(0, limit);
}

export async function getBikeBySlug(slug: string): Promise<Bike | undefined> {
  const supabase = await getSupabaseServer();
  if (!supabase) return seedBikes.find((bike) => bike.slug === slug);

  const { data, error } = await supabase
    .from("bikes")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("getBikeBySlug:", error.message);
    return undefined;
  }
  return data ? rowToBike(data as BikeRow) : undefined;
}

/**
 * Bikes to show under a listing. Same make first, because someone looking at a
 * Honda is more likely to want another Honda; anything else fills the rest.
 */
export async function getRelatedBikes(bike: Bike, limit = 4): Promise<Bike[]> {
  const all = await getAllBikes();
  const others = all.filter((candidate) => candidate.slug !== bike.slug);
  const sameMake = others.filter((candidate) => candidate.make === bike.make);
  const rest = others.filter((candidate) => candidate.make !== bike.make);
  return [...sameMake, ...rest].slice(0, limit);
}

/** Populates the "All Makes" filter, derived so it can never drift from stock. */
export async function getMakes(): Promise<string[]> {
  const all = await getAllBikes();
  return [...new Set(all.map((bike) => bike.make))].sort();
}
