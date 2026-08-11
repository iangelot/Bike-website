"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveBike } from "@/app/admin/actions";
import type { Bike } from "@/lib/bikes";

type PhotoItem = {
  id: string;
  kind: "existing" | "new";
  src?: string; // existing
  alt?: string; // existing
  file?: File; // new
  preview?: string; // new (object URL)
};

const field =
  "rounded-lg border border-line bg-white px-4 py-3 text-base text-navy outline-none focus:border-navy";
const labelCls = "flex flex-col gap-1.5 text-sm font-medium text-navy";

export function BikeForm({ bike }: { bike?: Bike }) {
  const router = useRouter();
  const isEdit = Boolean(bike);

  const [make, setMake] = useState(bike?.make ?? "");
  const [model, setModel] = useState(bike?.model ?? "");
  const [year, setYear] = useState(bike ? String(bike.year) : "");
  const [distance, setDistance] = useState(bike ? String(bike.distance) : "");
  const [distanceUnit, setDistanceUnit] = useState<"mi" | "km">(
    bike?.distanceUnit ?? "mi",
  );
  const [price, setPrice] = useState(bike ? String(bike.price) : "");
  const [colour, setColour] = useState(bike?.colour ?? "");
  const [fuelType, setFuelType] = useState(bike?.fuelType ?? "");
  const [location, setLocation] = useState(bike?.location ?? "");
  const [warranty, setWarranty] = useState(bike?.warranty ?? "");
  const [featured, setFeatured] = useState(bike?.featured ?? false);

  const [photos, setPhotos] = useState<PhotoItem[]>(
    (bike?.photos ?? []).map((p, i) => ({
      id: `e${i}`,
      kind: "existing",
      src: p.src,
      alt: p.alt,
    })),
  );

  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function addFiles(files: FileList | null) {
    if (!files) return;
    const next = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      kind: "new" as const,
      file,
      preview: URL.createObjectURL(file),
    }));
    setPhotos((prev) => [...prev, ...next]);
  }

  function remove(id: string) {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  }

  function move(id: string, dir: -1 | 1) {
    setPhotos((prev) => {
      const i = prev.findIndex((p) => p.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const copy = [...prev];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  }

  function makeCover(id: string) {
    setPhotos((prev) => {
      const i = prev.findIndex((p) => p.id === id);
      if (i <= 0) return prev;
      const copy = [...prev];
      const [item] = copy.splice(i, 1);
      copy.unshift(item);
      return copy;
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (photos.length === 0) {
      setError("Add at least one photo.");
      return;
    }

    setBusy(true);
    const fd = new FormData();
    fd.set("make", make);
    fd.set("model", model);
    fd.set("year", year);
    fd.set("distance", distance);
    fd.set("distanceUnit", distanceUnit);
    fd.set("price", price);
    fd.set("colour", colour);
    fd.set("fuelType", fuelType);
    fd.set("location", location);
    fd.set("warranty", warranty);
    fd.set("featured", featured ? "true" : "false");
    fd.set("isEdit", isEdit ? "1" : "0");
    if (bike) fd.set("slug", bike.slug);

    const plan: unknown[] = [];
    let ni = 0;
    for (const p of photos) {
      if (p.kind === "existing") {
        plan.push({ k: "e", src: p.src, alt: p.alt ?? "" });
      } else if (p.file) {
        plan.push({ k: "n", i: ni });
        fd.set(`newphoto_${ni}`, p.file);
        ni++;
      }
    }
    fd.set("photoPlan", JSON.stringify(plan));

    const res = await saveBike(fd);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError(res.error);
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-medium uppercase">
          {isEdit ? "Edit bike" : "Add a bike"}
        </h1>
        <Link href="/admin" className="text-sm text-slate underline-offset-4 hover:underline">
          Cancel
        </Link>
      </div>

      {/* Details */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <label className={labelCls}>
          Make *
          <input className={field} value={make} onChange={(e) => setMake(e.target.value)} required />
        </label>
        <label className={labelCls}>
          Model *
          <input className={field} value={model} onChange={(e) => setModel(e.target.value)} required />
        </label>
        <label className={labelCls}>
          Year *
          <input className={field} value={year} onChange={(e) => setYear(e.target.value)} inputMode="numeric" required />
        </label>
        <label className={labelCls}>
          Price (USD) *
          <input className={field} value={price} onChange={(e) => setPrice(e.target.value)} inputMode="numeric" required />
        </label>
        <label className={labelCls}>
          Mileage *
          <input className={field} value={distance} onChange={(e) => setDistance(e.target.value)} inputMode="numeric" required />
        </label>
        <label className={labelCls}>
          Mileage unit
          <select
            className={field}
            value={distanceUnit}
            onChange={(e) => setDistanceUnit(e.target.value as "mi" | "km")}
          >
            <option value="mi">Miles (MI)</option>
            <option value="km">Kilometres (KM)</option>
          </select>
        </label>
        <label className={labelCls}>
          Colour
          <input className={field} value={colour} onChange={(e) => setColour(e.target.value)} />
        </label>
        <label className={labelCls}>
          Fuel type
          <input className={field} value={fuelType} onChange={(e) => setFuelType(e.target.value)} placeholder="Gasoline" />
        </label>
        <label className={labelCls}>
          Location
          <input className={field} value={location} onChange={(e) => setLocation(e.target.value)} />
        </label>
        <label className={labelCls}>
          Warranty
          <input className={field} value={warranty} onChange={(e) => setWarranty(e.target.value)} placeholder="Sold as is" />
        </label>
      </div>

      <label className="mt-5 flex items-center gap-3 text-sm font-medium text-navy">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="h-5 w-5 rounded border-line"
        />
        Show on the home page (featured)
      </label>

      {/* Photos */}
      <div className="mt-9">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-xl font-medium uppercase">Photos</h2>
          <label className="btn btn-outline cursor-pointer rounded-lg text-sm">
            + Add photos
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
        </div>
        <p className="mt-2 text-sm text-slate">
          The first photo is the cover shown on cards. Drag isn&apos;t needed —
          use the arrows, or “Cover”.
        </p>

        {photos.length === 0 ? (
          <p className="mt-5 rounded-lg border border-dashed border-line px-4 py-8 text-center text-sm text-slate">
            No photos yet. Add at least one.
          </p>
        ) : (
          <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {photos.map((p, i) => (
              <li
                key={p.id}
                className="overflow-hidden rounded-[13px] border border-line bg-white"
              >
                <div className="relative aspect-[4/3] bg-plate">
                  <Image
                    src={p.kind === "existing" ? p.src! : p.preview!}
                    alt=""
                    fill
                    sizes="200px"
                    className="object-cover"
                    unoptimized={p.kind === "new"}
                  />
                  {i === 0 ? (
                    <span className="absolute left-2 top-2 rounded-full bg-navy px-2 py-0.5 text-[0.625rem] font-medium uppercase tracking-wide text-white">
                      Cover
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center justify-between gap-1 px-2 py-2">
                  <div className="flex gap-1">
                    <button type="button" onClick={() => move(p.id, -1)} disabled={i === 0} aria-label="Move left" className="rounded border border-line px-2 py-1 text-xs disabled:opacity-40">←</button>
                    <button type="button" onClick={() => move(p.id, 1)} disabled={i === photos.length - 1} aria-label="Move right" className="rounded border border-line px-2 py-1 text-xs disabled:opacity-40">→</button>
                  </div>
                  <div className="flex gap-1">
                    {i !== 0 ? (
                      <button type="button" onClick={() => makeCover(p.id)} className="rounded border border-line px-2 py-1 text-xs">Cover</button>
                    ) : null}
                    <button type="button" onClick={() => remove(p.id)} aria-label="Remove photo" className="rounded border border-line px-2 py-1 text-xs text-red-600">✕</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error ? <p className="mt-6 text-sm text-red-600">{error}</p> : null}

      <div className="mt-8 flex items-center gap-3">
        <button type="submit" disabled={busy} className="btn btn-primary rounded-lg disabled:opacity-60">
          {busy ? "Saving…" : isEdit ? "Save changes" : "Publish bike"}
        </button>
        <Link href="/admin" className="text-sm text-slate underline-offset-4 hover:underline">
          Cancel
        </Link>
      </div>
    </form>
  );
}
