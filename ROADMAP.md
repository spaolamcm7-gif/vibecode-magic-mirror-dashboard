# Magic Mirror Dashboard — Roadmap

## Vision

Single-page productivity hub with a **magic mirror** aesthetic (deep black, high-contrast type, subtle glass panels): **Tacna, Peru** weather, rotating quotes, and **sectioned tasks** (Today / Later) backed by **Supabase**. **Invite-only access** — disable public signups in Supabase; users sign in after an admin invites them.

## Stack

| Layer        | Choice                                      |
| ------------ | ------------------------------------------- |
| UI           | Next.js App Router, Tailwind CSS v4         |
| Auth + DB    | Supabase (Auth + Postgres + RLS)            |
| Weather      | Open-Meteo (no API key)                     |
| Quotes       | Quotable (`api.quotable.io`, no key)        |
| Deployment   | **Vercel** (preferred)                      |

## Milestones

1. **Project setup** — Next.js, TypeScript, Tailwind, `src/` layout, env template.
2. **Supabase** — Run [`supabase/migrations/001_tasks.sql`](supabase/migrations/001_tasks.sql) in the SQL Editor. Enable Email auth; **turn off** “Allow new users to sign up”. Invite users from **Authentication → Users → Invite**. Set **Site URL** and **Redirect URLs** to `http://localhost:3000` and your **Vercel** URL; add `/auth/callback`.
3. **Auth UX** — Sign-in only at `/login`; `/dashboard` protected by middleware.
4. **Widgets** — Bento grid: Weather, Quote (timer + manual refresh), Tasks (CRUD + sections).
5. **Polish** — Responsive desktop/tablet; touch-friendly controls.
6. **Deploy** — Connect repo to Vercel; set `NEXT_PUBLIC_SUPABASE_*`; redeploy.

## Database schema (summary)

- Table `public.tasks`: `id`, `user_id` → `auth.users`, `title`, `completed`, `section` (`today` | `later`), `sort_order`, timestamps.
- **RLS**: users can only read/write their own rows.

## Component map

- `MirrorCard` — shared panel chrome.
- `WeatherWidget`, `QuoteWidget`, `TaskPanel` — dashboard tiles.
- `DashboardHeader` — title + sign out.

## Risks / notes

- **Quotable** availability: UI shows an error if the API is down.
- **Open-Meteo** is anonymous; respect fair use.
- **Invite-only**: no signup UI; first-time invitees complete password via Supabase email (not public registration).

## Local development

```bash
cp .env.example .env.local
# Edit .env.local with Supabase URL + anon key

npm install
npm run dev
```

## Vercel

1. Import the Git repository.
2. Add environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Deploy; add the production URL to Supabase **Redirect URLs** and **Site URL** as needed.
