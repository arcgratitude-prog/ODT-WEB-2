// One-time setup script — creates the "bookings" table in your database.
// Run this once (from your own machine, with DATABASE_URL set) after the
// database is connected to Vercel. Safe to run again later; it won't
// duplicate or wipe anything if the table already exists.
//
// How to run:
//   1. Make sure DATABASE_URL is set in your terminal (Vercel does this
//      automatically if you run `vercel env pull` first — see README-BOOKINGS.md)
//   2. node scripts/setup-database.js

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function main() {
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

  console.log('Done — "bookings" table is ready.');
}

main().catch((err) => {
  console.error('Setup failed:', err);
  process.exit(1);
});
