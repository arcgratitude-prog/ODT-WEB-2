// This file lives at: api/lib/referral.js
// Real, database-backed referral code generation and lookup — the code
// is a random string stored on the member's row and checked for
// collisions before being committed, not something derived from the
// person's name (which could collide for two people who share a name).

import { randomBytes } from 'crypto';
import { sql } from './db.js';

function generateCandidateCode() {
  // 6 characters, lowercase alphanumeric minus visually-ambiguous ones
  // (0/o, 1/l/i) so a code read aloud or handwritten doesn't get
  // misheard/miscopied.
  const alphabet = 'abcdefghjkmnpqrstuvwxyz23456789';
  const bytes = randomBytes(6);
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += alphabet[bytes[i] % alphabet.length];
  }
  return code;
}

// Generates a referral code guaranteed not to collide with an existing
// one, by actually checking the database rather than assuming
// randomness is enough. Retries a handful of times in the astronomically
// unlikely event of a collision before giving up.
export async function generateUniqueReferralCode() {
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = generateCandidateCode();
    const existing = await sql`SELECT id FROM members WHERE referral_code = ${candidate} LIMIT 1;`;
    if (existing.length === 0) return candidate;
  }
  throw new Error('Could not generate a unique referral code after 5 attempts.');
}

// The real, live referral count for a member — always computed directly
// from the database (how many members have this member's id as their
// referred_by_member_id), never a separately stored/incremented counter
// that could drift out of sync, be double-counted, or start "pre-filled"
// for a brand-new account.
export async function getReferralCount(memberId) {
  const rows = await sql`
    SELECT COUNT(*)::int AS count FROM members WHERE referred_by_member_id = ${memberId};
  `;
  return rows[0]?.count ?? 0;
}

// Looks up which member (if any) owns a given referral code. Returns
// null if the code doesn't match a real account — a bad/mistyped/old
// code should silently result in "no referrer", not an error that
// blocks signup.
export async function findMemberByReferralCode(code) {
  if (!code) return null;
  const rows = await sql`SELECT id, email FROM members WHERE referral_code = ${code} LIMIT 1;`;
  return rows[0] || null;
}
