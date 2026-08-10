/**
 * Placeholder inventory.
 *
 * The Figma frame repeats one card ("HONDA / 2021 / 1300 KM / $1,200") three
 * times, so the real shape of a listing had to be decided here. Everything the
 * UI renders reads from this file, which means swapping in a CMS or Supabase
 * later is a change to `getFeaturedBikes` / `getAllBikes` and nothing else.
 *
 * `image` points at one of the three bike cut-outs exported from the Figma
 * file. Real photography drops in by changing these paths.
 */

export type Bike = {
  /** URL segment for the (not yet built) detail page. */
  slug: string;
  make: string;
  model: string;
  year: number;
  /** Odometer reading in kilometres. */
  km: number;
  /** Asking price in `site.currency`. */
  price: number;
  image: string;
  /** Written per bike — a listing photo is content, not decoration. */
  alt: string;
  /** Surfaces the three best listings on the home page. */
  featured?: boolean;
};

export const bikes: Bike[] = [
  {
    slug: "honda-vfr800-2021",
    make: "Honda",
    model: "VFR 800",
    year: 2021,
    km: 1300,
    price: 1200,
    image: "/brand/bike-red.webp",
    alt: "Red Honda VFR 800 sports tourer, side view",
    featured: true,
  },
  {
    slug: "honda-vfr800-interceptor-2019",
    make: "Honda",
    model: "VFR 800 Interceptor",
    year: 2019,
    km: 8400,
    price: 3450,
    image: "/brand/hero-bike.webp",
    alt: "Black Honda VFR 800 Interceptor, side view",
    featured: true,
  },
  {
    slug: "suzuki-gsx-r750-2020",
    make: "Suzuki",
    model: "GSX-R750",
    year: 2020,
    km: 5120,
    price: 4890,
    image: "/brand/bike-blue.webp",
    alt: "Blue Suzuki GSX-R750 sports bike, side view",
    featured: true,
  },
  {
    slug: "honda-cbr600rr-2018",
    make: "Honda",
    model: "CBR600RR",
    year: 2018,
    km: 12700,
    price: 3990,
    image: "/brand/bike-red.webp",
    alt: "Red Honda CBR600RR, side view",
  },
  {
    slug: "bmw-s1000rr-2022",
    make: "BMW",
    model: "S 1000 RR",
    year: 2022,
    km: 3200,
    price: 9750,
    image: "/brand/hero-bike.webp",
    alt: "BMW S 1000 RR superbike in black, side view",
  },
  {
    slug: "suzuki-sv650-2017",
    make: "Suzuki",
    model: "SV650",
    year: 2017,
    km: 21400,
    price: 2650,
    image: "/brand/bike-blue.webp",
    alt: "Blue Suzuki SV650 naked bike, side view",
  },
];

/** The three cards the home page shows under "Featured Listings". */
export function getFeaturedBikes(): Bike[] {
  return bikes.filter((bike) => bike.featured);
}

export function getAllBikes(): Bike[] {
  return bikes;
}

/** Populates the "All Makes" filter, so it can never drift from the stock. */
export function getMakes(): string[] {
  return [...new Set(bikes.map((bike) => bike.make))].sort();
}

/** "1300 KM" — grouped, because five-figure readings are common. */
export function formatKm(km: number): string {
  return `${km.toLocaleString("en-US")} KM`;
}
