import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser client, used by the login form. `createBrowserClient` reads and
 * writes the auth cookies so a sign-in here is visible to the server on the
 * next request (the middleware refreshes it).
 */
export function getSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
