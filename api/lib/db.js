// Shared database helper for the booking system.
// Uses Neon's serverless Postgres driver — works great in Vercel's
// serverless functions since it talks to the database over HTTP instead
// of keeping a long-lived connection open.

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

// Ensures the bookings table exists. Safe to call on every request —
// CREATE TABLE IF NOT EXISTS is a no-op once the table is there. This
// means there is no manual "run a setup script" step; the table creates
// itself the first time a booking comes in.
export async function ensureBookingsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      ticket_id TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT,
      pass_name TEXT NOT NULL,
      pass_type TEXT,
      amount_cents INTEGER NOT NULL,
      classes_included TEXT,
      stripe_payment_intent_id TEXT UNIQUE,
      checked_in BOOLEAN NOT NULL DEFAULT FALSE,
      checked_in_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings (created_at DESC);
  `;
}

export { sql };
