import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { signOutAction } from "@/app/admin/actions";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s — Admin" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * The protected shell. Everything in the (dash) group is wrapped by this, and
 * requireUser() runs before any of it renders — the second lock after the
 * middleware. The login page lives outside this group, so it is never gated.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <div className="min-h-dvh bg-cream">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3">
          <Link href="/admin" className="flex items-center gap-3">
            <Image
              src="/brand/logo-dark.webp"
              alt="RAGERIDE"
              width={600}
              height={171}
              className="h-7 w-auto"
            />
            <span className="font-display text-sm font-medium uppercase tracking-wide text-slate">
              Admin
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="hidden text-sm text-slate underline-offset-4 hover:text-navy hover:underline sm:inline"
            >
              View site ↗
            </Link>
            <span className="hidden text-sm text-slate md:inline">{user.email}</span>
            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-navy hover:border-navy"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-8">{children}</div>
    </div>
  );
}
