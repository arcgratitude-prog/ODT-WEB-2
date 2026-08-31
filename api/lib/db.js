// Shared database helper for the booking system.
// Uses Neon's serverless Postgres driver — works great in Vercel's
// serverless functions since it talks to the database over HTTP instead
// of keeping a long-lived connection open.

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

// Ensures the bookings table exists and is up to date. Safe to call on
// every request — CREATE TABLE IF NOT EXISTS and the ALTER statements
// below are all no-ops once applied. This means there is no manual
// "run a migration" step; the schema updates itself automatically.
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
      stripe_payment_intent_id TEXT,
      ticket_number INTEGER NOT NULL DEFAULT 1,
      ticket_count INTEGER NOT NULL DEFAULT 1,
      checked_in BOOLEAN NOT NULL DEFAULT FALSE,
      checked_in_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
  // Migration for tables created before multi-ticket orders existed:
  // stripe_payment_intent_id used to be UNIQUE (one row per purchase).
  // Buying more than 1 ticket in a single checkout now creates multiple
  // rows that legitimately share the same payment intent, so that
  // constraint has to go — otherwise the 2nd+ ticket in every multi-
  // ticket order would fail to save. Postgres's default name for an
  // unnamed column-level UNIQUE constraint is "<table>_<column>_key".
  await sql`ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_stripe_payment_intent_id_key;`;
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS ticket_number INTEGER NOT NULL DEFAULT 1;`;
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS ticket_count INTEGER NOT NULL DEFAULT 1;`;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings (created_at DESC);
  `;
  // Speeds up the "has this payment intent already been processed?"
  // idempotency check used for multi-ticket orders (see stripe-webhook.js).
  await sql`
    CREATE INDEX IF NOT EXISTS idx_bookings_payment_intent ON bookings (stripe_payment_intent_id);
  `;
}

export { sql };
