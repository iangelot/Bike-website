"use client";

import Image from "next/image";
import { useState } from "react";
import type { Photo } from "@/lib/bikes";

const IMAGE_FALLBACK = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1200" viewBox="0 0 1600 1200">
  <rect width="1600" height="1200" fill="#e7e2d8"/>
  <rect x="80" y="80" width="1440" height="1040" rx="30" fill="#f8f5ef" stroke="#1d2a36" stroke-width="5"/>
  <path d="M470 730L760 390L900 530L1120 390L1320 730H470Z" fill="#c8d1d8"/>
  <circle cx="760" cy="515" r="82" fill="#8a939b"/>
  <circle cx="1090" cy="515" r="82" fill="#8a939b"/>
  <path d="M560 770H1230" stroke="#1d2a36" stroke-width="22" stroke-linecap="round"/>
  <text x="800" y="920" text-anchor="middle" fill="#1d2a36" font-family="Arial, sans-serif" font-size="56" font-weight="700">IMAGE UNAVAILABLE</text>
</svg>
`)}`;

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
  const [imageFailed, setImageFailed] = useState(false);
  const current = photos[active] ?? photos[0];

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-plate">
        {current ? (
          <Image
            key={current.src}
            src={imageFailed ? IMAGE_FALLBACK : current.src}
            alt={current.alt}
            fill
            priority
            onError={() => setImageFailed(true)}
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
                  src={imageFailed ? IMAGE_FALLBACK : photo.src}
                  alt=""
                  fill
                  onError={() => setImageFailed(true)}
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
