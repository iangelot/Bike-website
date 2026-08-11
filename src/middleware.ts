import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/** Only the admin section needs the session refresh + gate. */
export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
