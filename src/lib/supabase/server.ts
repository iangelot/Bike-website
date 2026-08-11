import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

type CookieToSet = { name: string; value: string; options: CookieOptions };

/**
 * Supabase, server side.
 *
 * The whole site is designed to run with OR without Supabase:
 *   • configured   → live data + a working admin panel
 *   • not configured → the site falls back to the built-in seed inventory
 *
 * `isSupabaseConfigured()` is the switch every data function checks, so the
 * project keeps building and rendering before the database exists.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/**
 * A request-scoped client that reads and writes the auth cookies, so a logged
 * in admin is recognised. Returns null when Supabase is not configured, which
 * is the signal to fall back to the seed data.
 *
 * cookies() is async in Next 15; touching it also marks the route dynamic,
 * which is what we want — listings must reflect the database on every request.
 */
export async function getSupabaseServer() {
  if (!isSupabaseConfigured()) return null;

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          // In a plain Server Component the cookie store is read-only and this
          // throws; the middleware is what actually refreshes the session, so
          // swallowing it here is safe.
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            /* read-only context — ignore */
          }
        },
      },
    },
  );
}
