import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client — SERVER ONLY.
 *
 * Bypasses row-level security, so it must never be created in code that reaches
 * the browser and must only be used behind an auth check (see requireUser).
 * Admin writes (bike rows + photo uploads) go through this after the caller is
 * confirmed logged in.
 */
export function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase service role is not configured.");
  }
  return createClient(url, key, { auth: { persistSession: false } });
}
