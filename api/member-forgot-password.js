// This file lives at: api/member-forgot-password.js
// Real "forgot password" flow, step 1: generate a random, single-use,
// time-limited reset token, store it, and email a reset link. Reuses
// the same Resend setup already used for booking confirmation emails.
//
// Deliberately does NOT reveal whether an email address has an account
// or not — the response is identical either way ("if that email has an
// account, a reset link is on its way"). Telling an attacker "no account
// found" for a given email would leak which emails are real customers.

import { randomBytes } from 'crypto';
import { Resend } from 'resend';
import { sql, ensureMembersTable, ensurePasswordResetTable } from './_lib/db.js';

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    await ensureMembersTable();
    await ensurePasswordResetTable();

    const normalizedEmail = email.trim().toLowerCase();
    const members = await sql`SELECT id, name FROM members WHERE LOWER(email) = ${normalizedEmail} LIMIT 1;`;

    // Same generic response whether or not the account exists — see note
    // above. Only actually send an email / create a token if it's real.
    const genericResponse = {
      success: true,
      message: "If that email has an account, we've sent a password reset link to it.",
    };

    if (members.length === 0) {
      return res.status(200).json(genericResponse);
    }

    const member = members[0];
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS).toISOString();

    await sql`
      INSERT INTO password_resets (member_id, token, expires_at)
      VALUES (${member.id}, ${token}, ${expiresAt});
    `;

    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const resend = new Resend(apiKey);
      const resetLink = `https://officialdancetheory.com/?reset=${token}`;
      try {
        await resend.emails.send({
          from: 'Official Dance Theory <tickets@officialdancetheory.com>',
          to: normalizedEmail,
          subject: 'Reset your Member Portal password',
          html: `
            <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; background:#0b0d12; color:#e5e7eb; border-radius:16px; overflow:hidden; border:1px solid #23262f; padding: 32px 24px;">
              <h2 style="color:#fff; margin-top:0;">Reset your password</h2>
              <p>Hi ${member.name ? member.name.split(' ')[0] : 'there'}, we received a request to reset your Member Portal password.</p>
              <p style="margin: 24px 0;">
                <a href="${resetLink}" style="display:inline-block; background:#dc2626; color:#fff; padding:12px 24px; border-radius:10px; text-decoration:none; font-weight:bold;">Reset Password</a>
              </p>
              <p style="color:#9ca3af; font-size:13px;">This link expires in 1 hour and can only be used once. If you didn't request this, you can safely ignore this email — your password won't change.</p>
            </div>
          `,
        });
      } catch (err) {
        // Never reveal an email delivery failure to the client — same
        // generic response either way, but log it for follow-up.
        console.error('Failed to send password reset email:', err);
      }
    } else {
      console.warn('Skipping password reset email — RESEND_API_KEY not set.');
    }

    return res.status(200).json(genericResponse);
  } catch (err) {
    console.error('member-forgot-password error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
