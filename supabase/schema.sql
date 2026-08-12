-- RAGERIDE — database schema.
--
-- Run this ONCE in your Supabase project: open the project, go to the SQL
-- Editor, paste this whole file, and press Run. Safe to run again.
--
-- Note: this intentionally does NOT create the storage bucket or its policies.
-- Those "create policy ... on storage.objects" statements require table-owner
-- rights the SQL editor doesn't have, and because the editor runs the script in
-- one transaction, that error rolls the whole thing back. The photo bucket is
-- created through the API instead (see scripts/create-bucket + the seed), and
-- photo writes go through server actions, so no storage policies are needed.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- bikes table
-- Only the slug is required. Every detail is optional: the admin form lets a
-- listing be saved with whatever is actually known (no year, no price, no
-- photos yet), and the site omits what is missing rather than showing a blank
-- or a zero. A guessed year on a listing is a false claim to a buyer, so the
-- database is the wrong place to force one.
create table if not exists public.bikes (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  make          text,
  model         text,
  year          integer,
  distance      integer,
  distance_unit text default 'mi' check (distance_unit in ('mi', 'km')),
  price         integer,
  colour        text,
  fuel_type     text,
  location      text,
  warranty      text,
  featured      boolean not null default false,
  -- [{ "src": "...", "alt": "...", "focus": "50% 65%" }, ...] — first is the card.
  photos        jsonb not null default '[]'::jsonb,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Tables created before the details became optional still carry NOT NULL on
-- these columns, and `create table if not exists` above leaves an existing
-- table alone — so drop them explicitly. Both new and existing databases end
-- up in the same shape, and re-running this is a no-op.
alter table public.bikes alter column make          drop not null;
alter table public.bikes alter column model         drop not null;
alter table public.bikes alter column year          drop not null;
alter table public.bikes alter column distance      drop not null;
alter table public.bikes alter column distance_unit drop not null;
alter table public.bikes alter column price         drop not null;

-- Keep updated_at honest.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists bikes_touch_updated_at on public.bikes;
create trigger bikes_touch_updated_at
  before update on public.bikes
  for each row execute function public.touch_updated_at();

-- ----------------------------------------------------- row level security
-- Anyone may READ the listings; only a signed-in user may write. (Admin writes
-- go through the service role server-side, which bypasses this, but the public
-- read policy is what lets the site load listings with the publishable key.)
alter table public.bikes enable row level security;

drop policy if exists "bikes public read" on public.bikes;
drop policy if exists "bikes auth insert" on public.bikes;
drop policy if exists "bikes auth update" on public.bikes;
drop policy if exists "bikes auth delete" on public.bikes;

create policy "bikes public read" on public.bikes
  for select using (true);

create policy "bikes auth insert" on public.bikes
  for insert to authenticated with check (true);

create policy "bikes auth update" on public.bikes
  for update to authenticated using (true) with check (true);

create policy "bikes auth delete" on public.bikes
  for delete to authenticated using (true);
