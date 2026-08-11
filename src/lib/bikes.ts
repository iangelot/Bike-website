/**
 * Inventory types + the seed inventory.
 *
 * This module is deliberately pure — types, the `formatDistance` helper, and
 * the `seedBikes` array, and NOTHING that imports a framework. The reads that
 * the pages actually call live in `bikes-data.ts`, which fetches from Supabase
 * when it is configured and falls back to `seedBikes` when it is not. Keeping
 * this file import-free is what lets the seed script (plain Node) load the
 * data without dragging in `next/headers`.
 *
 * `seedBikes` is the 12 bikes the site launched with. Once Supabase is
 * configured and seeded it becomes a fallback only — the live data comes from
 * the database, and the admin panel edits that, not this file.
 *
 * Prices, years, models, mileages, colours, locations and warranty wording are
 * recorded exactly as supplied — no rounding, renaming or unit conversion.
 *
 * Photo order is the order the photos were sent, except that the lead photo of
 * each bike is the best full-bike shot. The lead is `photos[0]`: the card
 * image and the first frame of the gallery.
 */

export type Photo = {
  src: string;
  /** Written per photo — a listing image is content, not decoration. */
  alt: string;
  /**
   * CSS object-position for the card crop, e.g. "50% 55%".
   *
   * The card's photo half is roughly 3:2 and phone photos are portrait, so
   * only about half the frame height survives the crop — and where the bike
   * sits in that frame differs in every shot. Only the lead photo needs this;
   * the gallery crops far less. Defaults to CARD_FOCUS below.
   */
  focus?: string;
};

/**
 * See `Photo.focus`. Below centre, because a bike photographed from standing
 * height sits in the lower half of the frame.
 */
export const CARD_FOCUS = "50% 65%";

export type Bike = {
  /** URL segment for the detail page. */
  slug: string;
  make: string;
  model: string;
  year: number;
  /** Odometer reading, in `distanceUnit`. */
  distance: number;
  /**
   * Miles or kilometres. Stored per bike rather than assumed globally: this
   * stock is mixed, and several of the dashes read in km.
   */
  distanceUnit: "mi" | "km";
  /** Asking price in `site.currency`. */
  price: number;
  /** Display order. The first is the card image and the listing hero. */
  photos: Photo[];
  colour?: string;
  fuelType?: string;
  /** Where the bike physically is. */
  location?: string;
  warranty?: string;
  /** Surfaces on the home page under "Featured Listings". */
  featured?: boolean;
};

const SOLD_AS_IS = "Sold as is";
const GASOLINE = "Gasoline";
const TENNESSEE = "Tennessee";

export const seedBikes: Bike[] = [
  {
    slug: "yamaha-mt09-2021",
    make: "Yamaha",
    model: "MT09",
    year: 2021,
    distance: 2100,
    distanceUnit: "km",
    price: 7000,
    fuelType: GASOLINE,
    location: TENNESSEE,
    warranty: "As is",
    featured: true,
    photos: [
      { src: "/bikes/yamaha-mt09-2021/01-side-left.webp", alt: "2021 Yamaha MT09 in blue and silver, left-hand side, in a parking garage" },
      { src: "/bikes/yamaha-mt09-2021/02-side-right.webp", alt: "Yamaha MT09 from the right, showing the tank graphics and inverted forks" },
      { src: "/bikes/yamaha-mt09-2021/03-front-quarter.webp", alt: "Front three-quarter view of the MT09, headlight and radiator" },
      { src: "/bikes/yamaha-mt09-2021/04-front.webp", alt: "Head-on view of the MT09 showing the blue wheels and front brakes" },
      { src: "/bikes/yamaha-mt09-2021/05-exhaust.webp", alt: "Rear wheel and Akrapovic exhaust on the MT09" },
    ],
  },
  {
    slug: "yamaha-yzf-r-2016",
    make: "Yamaha",
    model: "YZF-R",
    year: 2016,
    distance: 36057,
    distanceUnit: "km",
    price: 6000,
    fuelType: GASOLINE,
    location: TENNESSEE,
    warranty: SOLD_AS_IS,
    featured: true,
    photos: [
      { src: "/bikes/yamaha-yzf-r-2016/01-side-right.webp", alt: "2016 Yamaha YZF-R in blue and silver, right-hand side, on paddock stands" },
      { src: "/bikes/yamaha-yzf-r-2016/02-side-left.webp", alt: "Left-hand side of the blue YZF-R on stands in a driveway" },
      { src: "/bikes/yamaha-yzf-r-2016/03-front.webp", alt: "Head-on view of the YZF-R showing the twin headlights and gold forks" },
      { src: "/bikes/yamaha-yzf-r-2016/04-rear.webp", alt: "Rear view of the YZF-R showing the tail unit and rear tyre" },
      { src: "/bikes/yamaha-yzf-r-2016/05-odometer.webp", alt: "YZF-R instrument cluster showing the odometer reading" },
    ],
  },
  {
    slug: "yamaha-yzf-r6-2009",
    make: "Yamaha",
    model: "YZF-R6",
    year: 2009,
    distance: 6500,
    distanceUnit: "mi",
    price: 5000,
    fuelType: GASOLINE,
    location: TENNESSEE,
    warranty: SOLD_AS_IS,
    featured: true,
    photos: [
      { src: "/bikes/yamaha-yzf-r6-2009/01-side-left.webp", alt: "2009 Yamaha YZF-R6 in matte black, left-hand side profile" },
      { src: "/bikes/yamaha-yzf-r6-2009/02-side-right.webp", alt: "Matte black YZF-R6 from the right, showing the race tail unit" },
      { src: "/bikes/yamaha-yzf-r6-2009/03-front-left.webp", alt: "Front three-quarter view of the matte black R6 with gold forks" },
      { src: "/bikes/yamaha-yzf-r6-2009/04-rear-quarter.webp", alt: "Rear three-quarter view of the R6 showing the seat unit and swingarm" },
      { src: "/bikes/yamaha-yzf-r6-2009/05-front-cowl.webp", alt: "Close-up of the R6's matte black front cowl and screen" },
      { src: "/bikes/yamaha-yzf-r6-2009/06-cockpit.webp", alt: "R6 cockpit showing the clocks, yokes and clip-ons" },
      { src: "/bikes/yamaha-yzf-r6-2009/07-rearsets.webp", alt: "Adjustable rearsets and gold chain on the R6" },
      { src: "/bikes/yamaha-yzf-r6-2009/08-controls.webp", alt: "Right-hand switchgear and grip on the R6" },
      { src: "/bikes/yamaha-yzf-r6-2009/09-exhaust.webp", alt: "Aftermarket exhaust can on the R6" },
      { src: "/bikes/yamaha-yzf-r6-2009/10-sprocket.webp", alt: "Rear sprocket, chain and adjuster on the R6" },
    ],
  },
  {
    slug: "yamaha-fz07-mt07-2015",
    make: "Yamaha",
    model: "FZ07/MT07",
    year: 2015,
    distance: 32000,
    distanceUnit: "mi",
    price: 4500,
    fuelType: GASOLINE,
    location: TENNESSEE,
    warranty: SOLD_AS_IS,
    featured: true,
    photos: [
      { src: "/bikes/yamaha-fz07-mt07-2015/01-side-outdoor.webp", alt: "2015 Yamaha FZ07/MT07 in grey, side view outdoors" },
      { src: "/bikes/yamaha-fz07-mt07-2015/02-side-garage.webp", alt: "Grey FZ07/MT07 side-on in a parking garage" },
      { src: "/bikes/yamaha-fz07-mt07-2015/03-side-outdoor-2.webp", alt: "FZ07/MT07 from the side showing the tank and seat" },
      { src: "/bikes/yamaha-fz07-mt07-2015/04-front-left.webp", alt: "Front three-quarter view of the FZ07/MT07" },
      { src: "/bikes/yamaha-fz07-mt07-2015/05-front.webp", alt: "Head-on view of the FZ07/MT07 headlight and forks" },
      { src: "/bikes/yamaha-fz07-mt07-2015/06-rear-garage.webp", alt: "Rear view of the FZ07/MT07 in a parking garage" },
      { src: "/bikes/yamaha-fz07-mt07-2015/07-rear.webp", alt: "Rear of the FZ07/MT07 showing the tail light and exhaust" },
      { src: "/bikes/yamaha-fz07-mt07-2015/08-rear-plate.webp", alt: "Rear of the FZ07/MT07 from behind" },
      { src: "/bikes/yamaha-fz07-mt07-2015/09-engine.webp", alt: "Engine and exhaust header detail on the FZ07/MT07" },
      { src: "/bikes/yamaha-fz07-mt07-2015/10-tank.webp", alt: "Tank and handlebar detail on the FZ07/MT07" },
    ],
  },
  {
    slug: "yamaha-yzf-r-2005",
    make: "Yamaha",
    model: "YZF-R",
    year: 2005,
    distance: 5000,
    distanceUnit: "mi",
    price: 4500,
    fuelType: GASOLINE,
    location: TENNESSEE,
    warranty: SOLD_AS_IS,
    photos: [
      { src: "/bikes/yamaha-yzf-r-2005/01-front-left.webp", alt: "2005 Yamaha YZF-R in red and white, front three-quarter view" },
      { src: "/bikes/yamaha-yzf-r-2005/02-front-right.webp", alt: "Red YZF-R from the front right, showing the fairing and forks" },
      { src: "/bikes/yamaha-yzf-r-2005/03-rear-left.webp", alt: "Rear three-quarter view of the red YZF-R showing the exhaust" },
      { src: "/bikes/yamaha-yzf-r-2005/04-rear.webp", alt: "Rear of the red YZF-R showing the tail light and rear tyre" },
      { src: "/bikes/yamaha-yzf-r-2005/05-odometer.webp", alt: "YZF-R instrument cluster and tachometer" },
    ],
  },
  {
    slug: "yamaha-r3-2020-black",
    make: "Yamaha",
    model: "R3",
    year: 2020,
    distance: 748,
    distanceUnit: "km",
    price: 4500,
    colour: "Black",
    location: TENNESSEE,
    warranty: SOLD_AS_IS,
    photos: [
      { src: "/bikes/yamaha-r3-2020-black/01-side-left.webp", alt: "2020 Yamaha R3 in black with pink wheel trim, left-hand side" },
      { src: "/bikes/yamaha-r3-2020-black/02-side-right.webp", alt: "Black Yamaha R3 from the right on a driveway" },
      { src: "/bikes/yamaha-r3-2020-black/03-front.webp", alt: "Head-on view of the black R3 showing the twin headlights" },
      { src: "/bikes/yamaha-r3-2020-black/04-rear.webp", alt: "Rear of the black R3 with the tail light lit" },
      { src: "/bikes/yamaha-r3-2020-black/05-odometer.webp", alt: "R3 dash showing 748 km on the odometer" },
    ],
  },
  {
    slug: "yamaha-wr-2017",
    make: "Yamaha",
    model: "WR",
    year: 2017,
    distance: 2888,
    distanceUnit: "mi",
    price: 4000,
    colour: "Blue",
    location: TENNESSEE,
    warranty: SOLD_AS_IS,
    photos: [
      { src: "/bikes/yamaha-wr-2017/01-waterfront.webp", alt: "2017 Yamaha WR in blue and white parked at the waterfront" },
      { src: "/bikes/yamaha-wr-2017/02-waterfront-sunset.webp", alt: "Blue Yamaha WR at the waterfront at sunset" },
      { src: "/bikes/yamaha-wr-2017/03-side-garage.webp", alt: "Side view of the Yamaha WR in a garage" },
      { src: "/bikes/yamaha-wr-2017/04-side-garage-2.webp", alt: "Yamaha WR side-on showing the knobbly tyres and high exhaust" },
      { src: "/bikes/yamaha-wr-2017/05-front-left.webp", alt: "Front three-quarter view of the Yamaha WR" },
      { src: "/bikes/yamaha-wr-2017/06-front-garage.webp", alt: "Head-on view of the Yamaha WR showing the headlight cowl" },
      { src: "/bikes/yamaha-wr-2017/07-front-close.webp", alt: "Close-up of the Yamaha WR's front mudguard and gold forks" },
      { src: "/bikes/yamaha-wr-2017/08-odometer.webp", alt: "Yamaha WR instrument display showing the odometer" },
    ],
  },
  {
    slug: "yamaha-r3-2020-monster",
    make: "Yamaha",
    model: "R3",
    year: 2020,
    distance: 34000,
    distanceUnit: "km",
    price: 4000,
    fuelType: GASOLINE,
    location: TENNESSEE,
    warranty: SOLD_AS_IS,
    photos: [
      { src: "/bikes/yamaha-r3-2020-monster/01-side-left.webp", alt: "2020 Yamaha R3 in Monster Energy livery, left-hand side profile" },
      { src: "/bikes/yamaha-r3-2020-monster/02-side-left-2.webp", alt: "Monster Energy R3 showing the fairing graphics and gold forks" },
      { src: "/bikes/yamaha-r3-2020-monster/03-side-detail.webp", alt: "Detail of the R3's tail unit and rear suspension" },
      { src: "/bikes/yamaha-r3-2020-monster/04-front-close.webp", alt: "Close-up of the R3's screen, bars and blue tank" },
      { src: "/bikes/yamaha-r3-2020-monster/05-rear-quarter.webp", alt: "Rear three-quarter view of the Monster Energy R3" },
      { src: "/bikes/yamaha-r3-2020-monster/06-rear.webp", alt: "Rear of the R3 showing the exhaust and chain" },
      { src: "/bikes/yamaha-r3-2020-monster/07-odometer.webp", alt: "R3 dash showing 34,337 km on the odometer" },
    ],
  },
  {
    slug: "honda-nc750x-2014",
    make: "Honda",
    model: "NC750X",
    year: 2014,
    distance: 11150,
    distanceUnit: "km",
    price: 3000,
    colour: "Black",
    location: TENNESSEE,
    warranty: SOLD_AS_IS,
    photos: [
      { src: "/bikes/honda-nc750x-2014/01-side-right.webp", alt: "2014 Honda NC750X, right-hand side, parked on a driveway" },
      { src: "/bikes/honda-nc750x-2014/02-side-left.webp", alt: "Honda NC750X from the left with a helmet on the seat" },
      { src: "/bikes/honda-nc750x-2014/03-side-left-stands.webp", alt: "Honda NC750X on paddock stands at night" },
      { src: "/bikes/honda-nc750x-2014/04-rear.webp", alt: "Rear view over the seat of the Honda NC750X" },
      { src: "/bikes/honda-nc750x-2014/05-odometer.webp", alt: "NC750X dash showing 11,142 km on the odometer" },
      { src: "/bikes/honda-nc750x-2014/06-stands-garage.webp", alt: "Honda NC750X on stands in a parking garage" },
      { src: "/bikes/honda-nc750x-2014/07-stands-garage-2.webp", alt: "Side view of the NC750X on stands under garage lighting" },
    ],
  },
  {
    slug: "honda-cbr-2014",
    make: "Honda",
    model: "CBR",
    year: 2014,
    distance: 36000,
    distanceUnit: "mi",
    price: 2500,
    fuelType: GASOLINE,
    location: TENNESSEE,
    warranty: SOLD_AS_IS,
    photos: [
      { src: "/bikes/honda-cbr-2014/01-side-left.webp", alt: "2014 Honda CBR in gunmetal grey, left-hand side profile, on paddock stands" },
      { src: "/bikes/honda-cbr-2014/02-front-left.webp", alt: "Front three-quarter view of the Honda CBR from the left" },
      { src: "/bikes/honda-cbr-2014/03-side-right.webp", alt: "Right-hand side of the Honda CBR at sunset" },
      { src: "/bikes/honda-cbr-2014/04-front-right.webp", alt: "Front three-quarter view of the Honda CBR from the right" },
      { src: "/bikes/honda-cbr-2014/05-rear-left.webp", alt: "Rear three-quarter view of the Honda CBR showing the seat and chain" },
    ],
  },
  {
    slug: "yamaha-fz6-2007",
    make: "Yamaha",
    model: "FZ6",
    year: 2007,
    distance: 28994,
    distanceUnit: "mi",
    price: 2500,
    fuelType: GASOLINE,
    location: TENNESSEE,
    warranty: SOLD_AS_IS,
    photos: [
      { src: "/bikes/yamaha-fz6-2007/01-side-left.webp", alt: "2007 Yamaha FZ6 in red, left-hand side profile" },
      { src: "/bikes/yamaha-fz6-2007/02-side-right.webp", alt: "Red Yamaha FZ6 from the right, showing the half fairing" },
      { src: "/bikes/yamaha-fz6-2007/03-rear-quarter.webp", alt: "Rear three-quarter view of the red FZ6" },
      { src: "/bikes/yamaha-fz6-2007/04-front.webp", alt: "Head-on view of the red FZ6" },
      { src: "/bikes/yamaha-fz6-2007/05-tail.webp", alt: "Tail unit and rear light of the red FZ6" },
    ],
  },
  {
    slug: "honda-vf1000-1985",
    make: "Honda",
    model: "VF1000",
    year: 1985,
    distance: 26500,
    distanceUnit: "mi",
    price: 2000,
    colour: "White",
    location: TENNESSEE,
    warranty: SOLD_AS_IS,
    photos: [
      { src: "/bikes/honda-vf1000-1985/01-side-right.webp", alt: "1985 Honda VF1000 in white, red and blue, side view" },
      { src: "/bikes/honda-vf1000-1985/02-cockpit.webp", alt: "Cockpit and instruments of the Honda VF1000" },
      { src: "/bikes/honda-vf1000-1985/03-side-left.webp", alt: "Left-hand side of the Honda VF1000 showing the fairing graphics" },
      { src: "/bikes/honda-vf1000-1985/04-rear.webp", alt: "Rear of the Honda VF1000 showing the twin exhausts" },
    ],
  },
];

/** "36,000 MI" — grouped, because five-figure readings are the norm here. */
export function formatDistance(bike: Bike): string {
  return `${bike.distance.toLocaleString("en-US")} ${bike.distanceUnit.toUpperCase()}`;
}
