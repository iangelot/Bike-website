# Setting up the database + admin panel

The site runs today on a built-in list of 12 bikes. These steps connect it to a
Supabase database so bikes can be added, edited and deleted from a private admin
page — no code, no rebuild.

You only do **steps 1–3**. Everything after that is wiring I handle.

---

## 1. Create the Supabase project (~3 min)

1. Go to **https://supabase.com** and sign up (free — GitHub or email).
2. Click **New project**.
   - **Name:** `rageride` (anything).
   - **Database password:** pick one and save it somewhere. You won't need it day to day.
   - **Region:** choose the one closest to your buyers (e.g. East US).
3. Wait ~2 minutes for it to finish setting up.

## 2. Create the tables

1. In the project, open the **SQL Editor** (left sidebar).
2. Open the file `supabase/schema.sql` from this repo, copy **all** of it.
3. Paste it into the SQL editor and press **Run**. You should see "Success".

That creates the `bikes` table, the security rules, and the photo storage
bucket.

## 3. Create the admin login

1. Left sidebar → **Authentication** → **Users** → **Add user** → **Create new user**.
2. Enter the email + password your client will log in with. Tick
   **Auto-confirm user** so no confirmation email is needed.
3. That is the only account that can reach the admin panel.

## 4. Send me three values

Left sidebar → **Settings** → **API**. Copy and send:

- **Project URL** (e.g. `https://abcdefgh.supabase.co`)
- **anon / public** key
- **service_role** key — treat this one like a password; it's used once to load
  your existing bikes, then not needed again.

That's your part done. From those I'll:

- load the 12 current bikes (with all their photos) into your database,
- build and test the login + add/edit/delete admin screen,
- point the live site at the database.

---

## How it stays secure

- The admin lives at a private URL with **no link anywhere on the public site**,
  and search engines are told to skip it.
- It sits behind the login from step 3 — anyone else who finds the URL just hits
  a password screen.
- The database itself only lets the **public read**; adding, editing or deleting
  requires being logged in. So even a direct hit on the database changes nothing.

## Cost

Supabase's free tier covers a site this size comfortably (500 MB database, 1 GB
of photos, plenty of traffic). No card required to start.
