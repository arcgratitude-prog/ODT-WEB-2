// This file lives at: api/member-reset-password.js
// Real "forgot password" flow, step 2: verify the reset token (exists,
// not expired, not already used) and set the new password. The token is
// marked used immediately so it can never be replayed, even if someone
// intercepts the reset link after it's already been used once.

import { sql, ensureMembersTable, ensurePasswordResetTable } from './lib/db.js';
import { hashPassword } from './lib/password.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Reset token and new password are required.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    await ensureMembersTable();
    await ensurePasswordResetTable();

    const rows = await sql`
      SELECT id, member_id, expires_at, used FROM password_resets WHERE token = ${token} LIMIT 1;
    `;

    if (rows.length === 0) {
      return res.status(400).json({ error: 'This reset link is invalid.' });
    }

    const resetRow = rows[0];
    if (resetRow.used) {
      return res.status(400).json({ error: 'This reset link has already been used. Request a new one if you still need to reset your password.' });
    }
    if (new Date(resetRow.expires_at) < new Date()) {
      return res.status(400).json({ error: 'This reset link has expired. Request a new one.' });
    }

    const { hash, salt } = await hashPassword(newPassword);

    // Mark the token used FIRST, in the same breath as updating the
    // password — either both happen or neither does, so a token can
    // never be left in a "used but password unchanged" or "password
    // changed but token still valid" inconsistent state.
    await sql`UPDATE password_resets SET used = TRUE WHERE id = ${resetRow.id};`;
    await sql`
      UPDATE members SET password_hash = ${hash}, password_salt = ${salt}, session_token = NULL, updated_at = NOW()
      WHERE id = ${resetRow.member_id};
    `;

    return res.status(200).json({ success: true, message: 'Your password has been reset. You can now log in with your new password.' });
  } catch (err) {
    console.error('member-reset-password error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
