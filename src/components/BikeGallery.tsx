"use client";

import Image from "next/image";
import { useState } from "react";
import type { Photo } from "@/lib/bikes";

/**
 * Listing gallery: one large photo with a thumbnail strip under it.
 *
 * This is the only client component on the site. A CSS-only version is
 * possible with scroll-snap and anchor links, but anchors inside a scroller
 * also move the page, which on a listing means the viewport jumping every time
 * someone looks at another angle. A few hundred bytes of state is the better
 * trade here.
 *
 * With one photo it renders as a plain image — no strip, no controls. With
 * none — photos are optional on a listing — it holds the same frame with a
 * short note, so the page layout doesn't shift.
 */
export function BikeGallery({ photos }: { photos: Photo[] }) {
  const [active, setActive] = useState(0);
  const current = photos[active] ?? photos[0];

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-plate">
        {current ? (
          <Image
            key={current.src}
            src={current.src}
            alt={current.alt}
            fill
            priority
            sizes="(width >= 64rem) 55vw, 92vw"
            className="object-cover"
          />
        ) : (
          <p className="absolute inset-0 grid place-items-center px-6 text-center text-[0.9375rem] font-medium text-navy/50">
            Photos coming soon — message us and we&apos;ll send them over.
          </p>
        )}
      </div>

      {photos.length > 1 ? (
        <ul className="mt-3 grid grid-cols-5 gap-3">
          {photos.map((photo, i) => (
            <li key={photo.src}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show photo ${i + 1} of ${photos.length}`}
                aria-current={i === active}
                className={`relative block aspect-square w-full overflow-hidden rounded-lg bg-plate transition-opacity ${
                  i === active
                    ? "ring-2 ring-navy ring-offset-2 ring-offset-cream"
                    : "opacity-65 hover:opacity-100"
                }`}
              >
                <Image
                  src={photo.src}
                  alt=""
                  fill
                  sizes="(width >= 64rem) 11vw, 18vw"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
