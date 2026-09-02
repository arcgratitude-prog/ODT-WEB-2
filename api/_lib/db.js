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
      referred_by TEXT,
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
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS referred_by TEXT;`;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings (created_at DESC);
  `;
  // Speeds up the "has this payment intent already been processed?"
  // idempotency check used for multi-ticket orders (see stripe-webhook.js).
  await sql`
    CREATE INDEX IF NOT EXISTS idx_bookings_payment_intent ON bookings (stripe_payment_intent_id);
  `;
}

// Members are a separate concept from bookings: a booking is one purchase
// (any pass type), a member is a real account with a password, created
// only when someone buys a weekly Tier pass (not drop-ins). Membership
// auto-expires 28 days after the purchase that created/renewed it — no
// manual toggle, "active" is always just "membership_expires_at > now".
export async function ensureMembersTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS members (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT,
      last_pass_name TEXT,
      last_ticket_id TEXT,
      session_token TEXT,
      referral_code TEXT UNIQUE,
      referred_by_member_id INTEGER REFERENCES members(id),
      membership_expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_members_email ON members (LOWER(email));
  `;
  await sql`ALTER TABLE members ADD COLUMN IF NOT EXISTS session_token TEXT;`;
  // Real, stored, unique referral code per account (not derived from name
  // client-side, which could collide for two people sharing a name) and
  // a foreign key recording exactly which member — if any — referred
  // this one. This is the real, database-backed relationship the
  // referral system is built on; "referral count" for any member is
  // always computed live as COUNT(*) of rows where
  // referred_by_member_id = that member's id, never a separately
  // stored/incremented counter that could drift out of sync or be
  // double-counted.
  await sql`ALTER TABLE members ADD COLUMN IF NOT EXISTS referral_code TEXT;`;
  await sql`ALTER TABLE members ADD COLUMN IF NOT EXISTS referred_by_member_id INTEGER REFERENCES members(id);`;
  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_members_referral_code ON members (referral_code) WHERE referral_code IS NOT NULL;
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_members_expires_at ON members (membership_expires_at DESC);
  `;
}

// Password reset tokens — short-lived, single-use. Kept in their own
// table rather than a column on members so a token can be cleanly
// deleted the moment it's used (or expired), with no risk of stale
// token data lingering on the member row itself.
export async function ensurePasswordResetTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS password_resets (
      id SERIAL PRIMARY KEY,
      member_id INTEGER NOT NULL REFERENCES members(id),
      token TEXT UNIQUE NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      used BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_password_resets_token ON password_resets (token);
  `;
}

export { sql };
