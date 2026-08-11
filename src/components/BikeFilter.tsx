import { getMakes } from "@/lib/bikes-data";

/**
 * The collection page's filter row.
 *
 * Same control the home page's "Find Your Perfect Bike" card uses, so a search
 * started on the home page lands here with its make already selected — both
 * are plain GET forms writing ?make= to this page, and both work with
 * JavaScript off.
 *
 * Styled against the cream page rather than the navy band, so the white plate
 * and drop shadow of the home version are dropped; the control itself keeps
 * the frame's 17px radius and hairline navy border.
 */
export async function BikeFilter({
  make,
  makes: providedMakes,
}: {
  make?: string;
  /** Passed by /bikes, which already fetched the makes — avoids a second query. */
  makes?: string[];
}) {
  const makes = providedMakes ?? (await getMakes());

  return (
    <form
      action="/bikes"
      method="get"
      className="flex flex-col gap-3 sm:flex-row sm:items-center"
    >
      <div className="relative sm:w-64">
        <label htmlFor="make" className="sr-only">
          Filter by make
        </label>
        <select
          id="make"
          name="make"
          defaultValue={make ?? ""}
          className="w-full appearance-none rounded-[17px] border-[0.5px] border-navy bg-white px-5 py-3.5 text-base font-medium text-[#484848]"
        >
          <option value="">All Makes</option>
          {makes.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <svg
          viewBox="0 0 22 12"
          aria-hidden
          className="pointer-events-none absolute right-5 top-1/2 h-3 w-5 -translate-y-1/2 fill-navy"
        >
          <path d="M0 0h22L11 12z" />
        </svg>
      </div>

      <button type="submit" className="btn btn-primary rounded-2xl sm:px-10">
        Search
      </button>

      {/* Only offered once a filter is actually on, so it is never a dead
          control sitting next to a full list. */}
      {make ? (
        <a
          href="/bikes"
          className="self-start text-[0.9375rem] text-slate underline underline-offset-4 hover:text-navy sm:self-center"
        >
          Clear filter
        </a>
      ) : null}
    </form>
  );
}
