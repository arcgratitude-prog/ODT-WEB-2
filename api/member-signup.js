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
// Returns the same shape as api/member-login.js (including a session
// token) so the frontend can treat a successful signup exactly like a
// successful login without a second request.

import { randomBytes } from 'crypto';
import { sql, ensureMembersTable } from './lib/db.js';
import { hashPassword, verifyPassword } from './lib/password.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    await ensureMembersTable();

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await sql`
      SELECT id, password_hash, password_salt, last_pass_name, membership_expires_at, created_at
      FROM members WHERE LOWER(email) = ${normalizedEmail} LIMIT 1;
    `;

    if (existing.length > 0) {
      // Returning email — this must be the account owner, not someone
      // else checking out (or signing up) with the same address. Verify,
      // don't overwrite.
      const isCorrect = await verifyPassword(password, existing[0].password_hash, existing[0].password_salt);
      if (!isCorrect) {
        return res.status(401).json({
          error: 'An account already exists for this email. Enter the matching password to continue, or use a different email.',
        });
      }
      // Correct password — keep their existing membership_expires_at
      // untouched; just refresh name/phone in case either changed, and
      // issue a fresh session token same as a real login would.
      const sessionToken = randomBytes(24).toString('hex');
      await sql`
        UPDATE members SET name = ${name}, phone = ${phone || null}, session_token = ${sessionToken}, updated_at = NOW()
        WHERE LOWER(email) = ${normalizedEmail};
      `;
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
      });
    }

    // Brand new member — create the account. membership_expires_at starts
    // in the past (NOW()), meaning "not an active member yet" — no
    // benefits unlock until a real Tier purchase extends it via the
    // webhook.
    const { hash, salt } = await hashPassword(password);
    const sessionToken = randomBytes(24).toString('hex');
    const inserted = await sql`
      INSERT INTO members (email, password_hash, password_salt, name, phone, membership_expires_at, session_token)
      VALUES (${normalizedEmail}, ${hash}, ${salt}, ${name}, ${phone || null}, NOW(), ${sessionToken})
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
    });
  } catch (err) {
    console.error('member-signup error:', err);
    return res.status(500).json({ error: 'Something went wrong creating your account. Please try again.' });
  }
}
