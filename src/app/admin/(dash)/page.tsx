import Image from "next/image";
import Link from "next/link";
import { formatDistance } from "@/lib/bikes";
import { getAllBikes } from "@/lib/bikes-data";
import { formatPrice } from "@/lib/site";
import { DeleteBikeButton } from "@/components/admin/DeleteBikeButton";

export default async function AdminDashboard() {
  const bikes = await getAllBikes();

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-medium uppercase">Listings</h1>
          <p className="mt-1 text-sm text-slate">
            {bikes.length} {bikes.length === 1 ? "bike" : "bikes"} on the site.
          </p>
        </div>
        <Link href="/admin/bikes/new" className="btn btn-primary rounded-lg">
          + Add a bike
        </Link>
      </div>

      <ul className="mt-8 flex flex-col gap-3">
        {bikes.map((bike) => (
          <li
            key={bike.slug}
            className="flex items-center gap-4 rounded-[13px] border border-line bg-white p-3"
          >
            <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-plate">
              {bike.photos[0] ? (
                <Image
                  src={bike.photos[0].src}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              ) : null}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-navy">
                {bike.year} {bike.make} {bike.model}
                {bike.featured ? (
                  <span className="ml-2 rounded-full bg-gold/20 px-2 py-0.5 text-[0.6875rem] font-medium uppercase tracking-wide text-navy">
                    Featured
                  </span>
                ) : null}
              </p>
              <p className="mt-0.5 text-sm text-slate">
                {formatPrice(bike.price)} · {formatDistance(bike)} ·{" "}
                {bike.photos.length}{" "}
                {bike.photos.length === 1 ? "photo" : "photos"}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Link
                href={`/admin/bikes/${bike.slug}/edit`}
                className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-navy hover:border-navy"
              >
                Edit
              </Link>
              <DeleteBikeButton
                slug={bike.slug}
                label={`${bike.year} ${bike.make} ${bike.model}`}
              />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
