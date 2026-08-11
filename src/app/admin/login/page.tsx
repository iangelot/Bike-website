import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-dvh place-items-center bg-cream px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Image
            src="/brand/logo-dark.webp"
            alt="RAGERIDE Motorcycles"
            width={600}
            height={171}
            className="h-auto w-40"
            priority
          />
        </div>
        <div className="rounded-[15px] border border-line bg-white p-7 shadow-[0_18px_40px_rgba(0,26,52,0.10)]">
          <h1 className="font-display text-2xl font-medium uppercase">Admin sign in</h1>
          <p className="mt-1 text-sm text-slate">
            Manage the motorcycle listings.
          </p>
          <div className="mt-6">
            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  );
}
