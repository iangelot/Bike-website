import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";

/**
 * The single auth gate. Every admin page and every write action calls this
 * first; there is no way to reach admin data without passing through it, which
 * is what makes it safe for the writes themselves to use the service role.
 *
 * Uses getUser() (which verifies the token with Supabase) rather than trusting
 * a decoded session.
 */
export async function requireUser() {
  const supabase = await getSupabaseServer();
  if (!supabase) redirect("/admin/login");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");
  return user;
}
