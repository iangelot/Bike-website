/**
 * Inventory.
 *
 * Everything the UI renders reads from this file, so moving to a CMS or
 * Supabase later is a change to the getters at the bottom and nothing else.
 *
 * Two kinds of entry live here during the changeover:
 *
 *   • Real listings — photographed bikes with a `photos` gallery. These are
 *     the ones that matter.
 *   • `placeholder: true` entries, built from the cut-out artwork in the Figma
 *     file. They exist only so the grids have something to lay out while the
 *     real stock is still being photographed. DELETE THEM BEFORE LAUNCH —
 *     `getAllBikes` is where to add the filter if you want them gone from the
 *     site but kept here for reference.
 */

export type Photo = {
  src: string;
  /** Written per photo — a listing image is content, not decoration. */
  alt: string;
  /**
   * CSS object-position for the card crop, e.g. "50% 88%".
   *
   * Cards are 3:2 and phone photos are portrait, so only about half the frame
   * height survives the crop — and where the bike sits in that frame is
   * different in every shot. Centring it clips the wheels on most of them.
   * Only the lead photo needs this; the gallery crops far less.
   *
   * Defaults to CARD_FOCUS below, which suits a bike shot side-on from
   * standing height.
   */
  focus?: string;
};

/** See `Photo.focus`. Lower in the frame than centre, deliberately. */
export const CARD_FOCUS = "50% 75%";

export type Bike = {
  /** URL segment for the detail page. */
  slug: string;
  make: string;
  model: string;
  year: number;
  /** Odometer reading, in `distanceUnit`. */
  distance: number;
  /**
   * Miles or kilometres. Stored per bike rather than assumed globally,
   * because a US-sourced bike and an imported one do not agree.
   */
  distanceUnit: "mi" | "km";
  /** Asking price in `site.currency`. */
  price: number;
  /** Display order. The first is the card image and the listing hero. */
  photos: Photo[];
  fuelType?: string;
  /** Where the bike physically is, when that is not the shop's address. */
  location?: string;
  warranty?: string;
  /**
   * True when `photos[0]` is a background-free cut-out rather than a
   * photograph. Cut-outs get the Figma card treatment — floated over the road
   * plate, breaking the top edge — and photographs fill the card instead.
   */
  cutout?: boolean;
  /** Surfaces on the home page under "Featured Listings". */
  featured?: boolean;
  /** Sample data, not real stock. See the note at the top of this file. */
  placeholder?: boolean;
};

export const bikes: Bike[] = [
  {
    slug: "honda-cbr-2014",
    make: "Honda",
    model: "CBR",
    year: 2014,
    distance: 36000,
    distanceUnit: "mi",
    price: 2500,
    fuelType: "Gasoline",
    location: "Tennessee",
    warranty: "Sold as is",
    featured: true,
    photos: [
      {
        src: "/bikes/honda-cbr-2014/01-side-left.webp",
        alt: "2014 Honda CBR in gunmetal grey, left-hand side profile, on paddock stands",
        focus: "50% 88%",
      },
      {
        src: "/bikes/honda-cbr-2014/02-front-left.webp",
        alt: "Front three-quarter view of the Honda CBR from the left, showing the headlight and front brakes",
      },
      {
        src: "/bikes/honda-cbr-2014/03-side-right.webp",
        alt: "Right-hand side of the Honda CBR at sunset",
      },
      {
        src: "/bikes/honda-cbr-2014/04-front-right.webp",
        alt: "Front three-quarter view of the Honda CBR from the right",
      },
      {
        src: "/bikes/honda-cbr-2014/05-rear-left.webp",
        alt: "Rear three-quarter view of the Honda CBR, showing the seat, chain and rear tyre",
      },
    ],
  },

  /* ---------------------------------------------------------------- sample */

  {
    slug: "honda-vfr800-2021",
    make: "Honda",
    model: "VFR 800",
    year: 2021,
    distance: 1300,
    distanceUnit: "km",
    price: 1200,
    cutout: true,
    placeholder: true,
    featured: true,
    photos: [
      {
        src: "/brand/bike-red.webp",
        alt: "Red Honda VFR 800 sports tourer, side view",
      },
    ],
  },
  {
    slug: "honda-vfr800-interceptor-2019",
    make: "Honda",
    model: "VFR 800 Interceptor",
    year: 2019,
    distance: 8400,
    distanceUnit: "km",
    price: 3450,
    cutout: true,
    placeholder: true,
    featured: true,
    photos: [
      {
        src: "/brand/hero-bike.webp",
        alt: "Black Honda VFR 800 Interceptor, side view",
      },
    ],
  },
  {
    slug: "suzuki-gsx-r750-2020",
    make: "Suzuki",
    model: "GSX-R750",
    year: 2020,
    distance: 5120,
    distanceUnit: "km",
    price: 4890,
    cutout: true,
    placeholder: true,
    photos: [
      {
        src: "/brand/bike-blue.webp",
        alt: "Blue Suzuki GSX-R750 sports bike, side view",
      },
    ],
  },
  {
    slug: "bmw-s1000rr-2022",
    make: "BMW",
    model: "S 1000 RR",
    year: 2022,
    distance: 3200,
    distanceUnit: "km",
    price: 9750,
    cutout: true,
    placeholder: true,
    photos: [
      {
        src: "/brand/hero-bike.webp",
        alt: "BMW S 1000 RR superbike in black, side view",
      },
    ],
  },
  {
    slug: "suzuki-sv650-2017",
    make: "Suzuki",
    model: "SV650",
    year: 2017,
    distance: 21400,
    distanceUnit: "km",
    price: 2650,
    cutout: true,
    placeholder: true,
    photos: [
      {
        src: "/brand/bike-blue.webp",
        alt: "Blue Suzuki SV650 naked bike, side view",
      },
    ],
  },
];

/** The three cards the home page shows under "Featured Listings". */
export function getFeaturedBikes(): Bike[] {
  return bikes.filter((bike) => bike.featured);
}

export function getAllBikes(): Bike[] {
  return bikes;
}

export function getBikeBySlug(slug: string): Bike | undefined {
  return bikes.find((bike) => bike.slug === slug);
}

/**
 * Bikes to show under a listing. Same make first, because someone looking at a
 * Honda is more likely to want another Honda than whatever happens to be next
 * in the array; anything else fills the remaining slots.
 */
export function getRelatedBikes(bike: Bike, limit = 3): Bike[] {
  const others = bikes.filter((candidate) => candidate.slug !== bike.slug);
  const sameMake = others.filter((candidate) => candidate.make === bike.make);
  const rest = others.filter((candidate) => candidate.make !== bike.make);
  return [...sameMake, ...rest].slice(0, limit);
}

/** Populates the "All Makes" filter, so it can never drift from the stock. */
export function getMakes(): string[] {
  return [...new Set(bikes.map((bike) => bike.make))].sort();
}

/** "36,000 MI" — grouped, because five-figure readings are the norm. */
export function formatDistance(bike: Bike): string {
  return `${bike.distance.toLocaleString("en-US")} ${bike.distanceUnit.toUpperCase()}`;
}
