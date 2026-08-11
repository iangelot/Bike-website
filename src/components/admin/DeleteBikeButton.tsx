"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteBike } from "@/app/admin/actions";

export function DeleteBikeButton({ slug, label }: { slug: string; label: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  function onDelete() {
    startTransition(async () => {
      const res = await deleteBike(slug);
      if (res.ok) {
        router.refresh();
      } else {
        alert(`Could not delete: ${res.error}`);
        setConfirming(false);
      }
    });
  }

  if (confirming) {
    return (
      <span className="flex items-center gap-2">
        <button
          type="button"
          onClick={onDelete}
          disabled={pending}
          className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
        >
          {pending ? "Deleting…" : "Delete"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={pending}
          className="rounded-lg border border-line px-3 py-1.5 text-sm text-slate hover:border-navy"
        >
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      aria-label={`Delete ${label}`}
      className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-red-600 hover:border-red-600"
    >
      Delete
    </button>
  );
}
