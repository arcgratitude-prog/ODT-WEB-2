// This file lives at: api/member-signup.js
// Creates a brand-new, free member account (anyone can sign up — no
// purchase required), or verifies the password for a returning member's
// email so a stranger can't take over someone else's account. Also
// called from the Tier checkout form for the same reason.
//
// This endpoint deliberately never touches membership_expires_at — that
// column only changes in stripe-webhook.js, and only after a real,
// successful Tier payment. Creating an account here does NOT make
// anyone an active member or unlock any benefits; it just sets up a
// real login. A brand-new signup's membership_expires_at starts at
// NOW() (i.e. already "expired"/inactive) until a real Tier purchase
// extends it.
//
// Every new account gets a real, unique, database-stored referral code
// here (never derived from the name, which could collide for two people
// who share a name). If the signup arrived via someone else's referral
// link, that relationship is recorded permanently in
// referred_by_member_id — this is the actual source of truth for "who
// referred whom", not a value the frontend can just make up.
//
// Returns the same shape as api/member-login.js (including a session
// token) so the frontend can treat a successful signup exactly like a
// successful login without a second request.

import { randomBytes } from 'crypto';
import { sql, ensureMembersTable } from './lib/db.js';
import { hashPassword, verifyPassword } from './lib/password.js';
import { generateUniqueReferralCode, getReferralCount, findMemberByReferralCode } from './lib/referral.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, password, referralCode } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    await ensureMembersTable();

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await sql`
      SELECT id, password_hash, password_salt, last_pass_name, membership_expires_at, created_at, referral_code
      FROM members WHERE LOWER(email) = ${normalizedEmail} LIMIT 1;
    `;

    if (existing.length > 0) {
      // Returning email — this must be the account owner, not someone
      // else checking out (or signing up) with the same address. Verify,
      // don't overwrite. Also: referred_by_member_id is set exactly once,
      // at real account creation, and never touched again here — an
      // existing account can't be retroactively "referred" by someone
      // just because they happened to click a referral link before
      // logging back in.
      const isCorrect = await verifyPassword(password, existing[0].password_hash, existing[0].password_salt);
      if (!isCorrect) {
        return res.status(401).json({
          error: 'An account already exists for this email. Enter the matching password to continue, or use a different email.',
        });
      }
      const sessionToken = randomBytes(24).toString('hex');
      await sql`
        UPDATE members SET name = ${name}, phone = ${phone || null}, session_token = ${sessionToken}, updated_at = NOW()
        WHERE LOWER(email) = ${normalizedEmail};
      `;
      const referralCount = await getReferralCount(existing[0].id);
      return res.status(200).json({
        success: true,
        isNewAccount: false,
        id: existing[0].id,
        email: normalizedEmail,
        name,
        phone: phone || null,
        lastPassName: existing[0].last_pass_name,
        membershipExpiresAt: existing[0].membership_expires_at,
        isActive: new Date(existing[0].membership_expires_at) > new Date(),
        memberSince: existing[0].created_at,
        sessionToken,
        referralCode: existing[0].referral_code,
        referralCount,
      });
    }

    // Brand new member — create the account. membership_expires_at starts
    // in the past (NOW()), meaning "not an active member yet" — no
    // benefits unlock until a real Tier purchase extends it via the
    // webhook. referralCount always starts at exactly 0 for a genuinely
    // new account — it's computed from real rows, so there is nothing to
    // "pre-fill" or hardcode.
    const { hash, salt } = await hashPassword(password);
    const sessionToken = randomBytes(24).toString('hex');
    const ownReferralCode = await generateUniqueReferralCode();

    // Resolve the referrer (if any) BEFORE inserting, so we know the
    // referrer's id to store. A referral code that doesn't match any
    // real account is silently ignored (no referrer attributed) rather
    // than blocking signup — an old/mistyped/expired code shouldn't
    // prevent someone from creating an account.
    let referredByMemberId = null;
    if (referralCode) {
      const referrer = await findMemberByReferralCode(String(referralCode).trim());
      // Guard against self-referral: this can only really happen if
      // someone already has an account, is somehow re-running signup
      // with their own code, and their email matches — belt-and-suspenders
      // check even though the "existing email" branch above would
      // normally catch a returning email first.
      if (referrer && referrer.email !== normalizedEmail) {
        referredByMemberId = referrer.id;
      }
    }

    const inserted = await sql`
      INSERT INTO members (email, password_hash, password_salt, name, phone, membership_expires_at, session_token, referral_code, referred_by_member_id)
      VALUES (${normalizedEmail}, ${hash}, ${salt}, ${name}, ${phone || null}, NOW(), ${sessionToken}, ${ownReferralCode}, ${referredByMemberId})
      RETURNING id, membership_expires_at, created_at;
    `;
    return res.status(200).json({
      success: true,
      isNewAccount: true,
      id: inserted[0].id,
      email: normalizedEmail,
      name,
      phone: phone || null,
      lastPassName: null,
      membershipExpiresAt: inserted[0].membership_expires_at,
      isActive: false,
      memberSince: inserted[0].created_at,
      sessionToken,
      referralCode: ownReferralCode,
      referralCount: 0,
      wasReferred: referredByMemberId !== null,
    });
  } catch (err) {
    console.error('member-signup error:', err);
    return res.status(500).json({ error: 'Something went wrong creating your account. Please try again.' });
  }
}
