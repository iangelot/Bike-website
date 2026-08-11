import type { Metadata } from "next";
import { BikeForm } from "@/components/admin/BikeForm";

export const metadata: Metadata = { title: "Add a bike" };

export default function NewBikePage() {
  return <BikeForm />;
}
