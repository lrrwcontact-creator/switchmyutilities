import { createClient } from "@supabase/supabase-js";

// Browser-safe client (uses anon key)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Server-only client (uses service role key — never expose to browser)
export const supabaseAdmin = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

/* ─── SUPABASE SCHEMA ────────────────────────────────────────────────────────
   Run this SQL once in your Supabase project:
   supabase.com → your project → SQL Editor → New Query → paste & run

CREATE TABLE submissions (
  id              TEXT PRIMARY KEY,           -- e.g. "SMU-0042"
  created_at      TIMESTAMPTZ DEFAULT now(),
  role            TEXT NOT NULL,              -- 'Seller' | 'Buyer' | 'PM Transition'
  first_name      TEXT NOT NULL,
  last_name       TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT NOT NULL,
  property_address TEXT NOT NULL,
  property_type   TEXT,
  close_date      DATE,
  forwarding_address TEXT,
  current_holder  TEXT,
  pm_direction    TEXT,
  utilities       JSONB NOT NULL,             -- array of utility objects
  fee             INTEGER NOT NULL,           -- in dollars
  status          TEXT DEFAULT 'New',         -- 'New' | 'In Progress' | 'Complete'
  notes           TEXT,
  stripe_session_id TEXT,
  paid            BOOLEAN DEFAULT false
);

-- Row Level Security: only service role can read/write (ops dashboard uses service role)
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

── ───────────────────────────────────────────────────────────────────────── */
