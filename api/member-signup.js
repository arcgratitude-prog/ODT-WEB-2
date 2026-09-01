// This file lives at: api/member-signup.js
// Called from the Tier checkout form (before payment) to either create a
// brand-new member account, or verify the password for a returning
// member's email so a stranger can't "buy a tier" using someone else's
// email and silently take over their account.
//
// This endpoint deliberately never touches membership_expires_at — that
// column only changes in stripe-webhook.js, and only after a real,
// successful payment. Creating an account here does NOT make anyone an
// active member; it just sets up the login so the webhook has something
// to activate once payment actually succeeds.

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
      SELECT id, password_hash, password_salt FROM members WHERE LOWER(email) = ${normalizedEmail} LIMIT 1;
    `;

    if (existing.length > 0) {
      // Returning email — this must be the account owner, not someone
      // else checking out with the same address. Verify, don't overwrite.
      const isCorrect = await verifyPassword(password, existing[0].password_hash, existing[0].password_salt);
      if (!isCorrect) {
        return res.status(401).json({
          error: 'An account already exists for this email. Enter the matching password to continue, or use a different email.',
        });
      }
      // Correct password — keep their existing membership_expires_at
      // untouched; just refresh name/phone in case either changed.
      await sql`
        UPDATE members SET name = ${name}, phone = ${phone || null}, updated_at = NOW()
        WHERE LOWER(email) = ${normalizedEmail};
      `;
      return res.status(200).json({ success: true, isNewAccount: false });
    }

    // Brand new member — create the account. membership_expires_at starts
    // in the past (NOW()), meaning "not an active member yet" until the
    // webhook activates it after payment actually succeeds.
    const { hash, salt } = await hashPassword(password);
    await sql`
      INSERT INTO members (email, password_hash, password_salt, name, phone, membership_expires_at)
      VALUES (${normalizedEmail}, ${hash}, ${salt}, ${name}, ${phone || null}, NOW());
    `;
    return res.status(200).json({ success: true, isNewAccount: true });
  } catch (err) {
    console.error('member-signup error:', err);
    return res.status(500).json({ error: 'Something went wrong creating your account. Please try again.' });
  }
}
