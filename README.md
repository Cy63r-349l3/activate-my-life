# ACTIVATE MY LIFE — 30-Day Personal Activation Challenge
## Phase 1 Technical Foundation

Production-ready Next.js application based on the 30-Day Personal Activation Workbook, converting workbook principles into an interactive digital system.

---

## 🚀 Phase 1 Architecture Overview

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (Custom Dark Activation Theme)
- **Authentication & Backend**: Supabase Auth & PostgreSQL Database with Row Level Security (RLS)
- **Icons**: Lucide React
- **SSR Client Architecture**: `@supabase/ssr` (`client.ts`, `server.ts`, `middleware.ts`)

---

## 🛠️ Environment Setup

1. Copy `.env.example` to create your local environment variables file:

```bash
cp .env.example .env.local
```

2. Populate `.env.local` with your Supabase project credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

*Note: Never commit `.env.local` or expose service-role keys to the browser.*

---

## 🗄️ Supabase Database Configuration

1. Open your **Supabase Dashboard** -> **SQL Editor**.
2. Run the SQL script provided in [`supabase/schema.sql`](./supabase/schema.sql).
3. The script configures:
   - `profiles` table with automatic profile creation trigger on signup (`handle_new_user()`)
   - `user_stats` table for tracking streak and points
   - `challenges`, `challenge_days`, `daily_submissions`
   - `points_transactions`, `badges`, `user_badges`, `community_posts`, `post_reactions`
   - Row Level Security (RLS) policies for user data isolation

---

## 💻 Running the Application Locally

```bash
# Install dependencies (if not already installed)
npm install

# Start Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Route Authorization Structure

- `/` — Polished Public Landing Page
- `/login` — User Authentication
- `/signup` — Registration (Creates Supabase auth user & profile trigger)
- `/forgot-password` — Password Recovery
- `/reset-password` — Password Update Session
- `/dashboard` — Authenticated User Dashboard
- `/profile` — Authenticated User Profile View & Editable Info
- `/challenge` — Challenge Engine (Phase 1 Placeholder)
- `/leaderboard` — Leaderboard (Phase 1 Placeholder)
- `/badges` — Achievements (Phase 1 Placeholder)
- `/community` — Social Feed (Phase 1 Placeholder)
- `/final-review` — Day 30 Review (Phase 1 Placeholder)
- `/admin` — Protected Admin Console (Enforces `role = admin` server-side)

---

## ☁️ Vercel Deployment

The application is structured to deploy directly to Vercel:

1. Push your repository to GitHub / Git provider.
2. Import project into Vercel.
3. Configure Environment Variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy.

---

## 📜 Principles & Motto

> **ACTION OVER INTENTION**  
> **DISCIPLINE OVER MOOD**  
> **MOVEMENT OVER PROCRASTINATION**
