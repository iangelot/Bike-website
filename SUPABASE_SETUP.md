# Database + admin panel

The site's listings live in a Supabase database. Bikes are added, edited and
deleted from a private admin page — no code, no rebuild — and the public site
and its search filter update themselves.

## What's already set up

- The `bikes` table and its security rules (`supabase/schema.sql`).
- A public `bike-photos` storage bucket (created via the API).
- The 12 launch bikes and their photos, loaded in.
- The admin panel at **`/admin`**.

## Environment variables

The app reads three values. Locally they live in `.env.local` (git-ignored);
on the host (e.g. Vercel) they're set as project env vars. See `.env.example`.

| Variable | Where |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Settings → API → publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | Settings → API → secret key (server only) |

With none set, the site falls back to the built-in seed inventory and the admin
is disabled — so it never breaks.

## One-off: make the listing details optional

The `bikes` table was first created with `make`, `model`, `year`, `distance`
and `price` marked **NOT NULL**. The admin form no longer requires them, so an
existing database has to have those constraints dropped or saving a listing
with a blank year will fail with a database error.

Open Supabase → **SQL Editor**, paste `supabase/schema.sql` again and press
**Run**. It is safe to re-run: the table is left alone and only the six
`alter table … drop not null` lines take effect. New projects get the right
shape from the start.

## The admin login

Only people with a Supabase user account can sign in. To create one:
Authentication → Users → **Add user**, set an email + password, tick
**Auto-confirm**. There is no public sign-up.

## For the client — using the admin

1. Go to **yoursite.com/admin** and sign in.
2. **Listings** shows every bike. Each has **Edit** and **Delete** (delete asks
   to confirm).
3. **+ Add a bike** — fill in the details, tap **Add photos** to upload from the
   phone, arrange them (the first is the cover shown on cards), then **Publish**.
   Nothing on that form is required: leave out the year, the mileage, the price
   or even the photos and the listing simply doesn't show those lines (a bike
   with no price reads **"Price on request"**). Come back and **Edit** it once
   you know the rest.
4. Changes are live immediately — the collection, the home page and the search
   filter all update on their own.

Photos are automatically resized on upload, so a big phone photo won't slow the
site down.

## Security

- The admin URL is linked nowhere public and is hidden from search engines.
- Every admin page sits behind the login (checked twice — in the middleware and
  again in the page).
- The database only lets the public **read**; all writes require a logged-in
  admin.
