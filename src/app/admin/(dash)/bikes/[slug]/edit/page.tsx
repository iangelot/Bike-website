import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BikeForm } from "@/components/admin/BikeForm";
import { getBikeBySlug } from "@/lib/bikes-data";

export const metadata: Metadata = { title: "Edit bike" };

export default async function EditBikePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const bike = await getBikeBySlug(slug);
  if (!bike) notFound();

  return <BikeForm bike={bike} />;
}
