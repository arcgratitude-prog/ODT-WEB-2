// This file lives at: api/member-login.js
// Real login for the Member Portal — verifies email+password against the
// members table and returns the account (never the password hash/salt)
// plus a computed isActive flag so the frontend doesn't need to do its
// own date math.

import { sql, ensureMembersTable } from './lib/db.js';
import { verifyPassword } from './lib/password.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    await ensureMembersTable();

    const normalizedEmail = email.trim().toLowerCase();
    const rows = await sql`
      SELECT id, email, password_hash, password_salt, name, phone,
             last_pass_name, membership_expires_at, created_at
      FROM members WHERE LOWER(email) = ${normalizedEmail} LIMIT 1;
    `;

    if (rows.length === 0) {
      return res.status(401).json({ error: 'No member account found for that email.' });
    }

    const member = rows[0];
    const isCorrect = await verifyPassword(password, member.password_hash, member.password_salt);
    if (!isCorrect) {
      return res.status(401).json({ error: 'Incorrect password.' });
    }

    return res.status(200).json({
      id: member.id,
      email: member.email,
      name: member.name,
      phone: member.phone,
      lastPassName: member.last_pass_name,
      membershipExpiresAt: member.membership_expires_at,
      isActive: new Date(member.membership_expires_at) > new Date(),
      memberSince: member.created_at,
    });
  } catch (err) {
    console.error('member-login error:', err);
    return res.status(500).json({ error: 'Something went wrong logging in. Please try again.' });
  }
}
