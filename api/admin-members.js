// Admin-only endpoint: lists all Tier members (regardless of active
// status — filtering active-only happens client-side so staff can toggle
// between "everyone who ever had a membership" and "who's active right
// now" without extra requests). Also handles manual corrections to a
// member's expiration date (PATCH) — kept in this same file rather than
// a new one, since Vercel's plan caps the number of serverless
// functions and this is the same underlying resource anyway.
// Same shared-password protection as admin-bookings.js.

import { ensureMembersTable, sql } from './_lib/db.js';

function isAuthorized(req) {
  const provided = req.headers['x-admin-password'];
  const expected = process.env.ADMIN_PASSWORD;
  return expected && provided === expected;
}

export default async function handler(req, res) {
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await ensureMembersTable();

  if (req.method === 'PATCH') {
    // Manual correction to a specific member's expiration date — for
    // real edge cases (e.g. someone bought right after that day's class
    // already happened, so their real 4-week window should be counted
    // differently than a pure "purchase timestamp + 28 days" would give
    // them). This is a deliberate, staff-initiated override, not
    // something the automated purchase flow ever does on its own.
    const { memberId, newExpiresAt } = req.body;
    if (!memberId || !newExpiresAt) {
      return res.status(400).json({ error: 'memberId and newExpiresAt are required.' });
    }
    const parsedDate = new Date(newExpiresAt);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: 'newExpiresAt is not a valid date.' });
    }
    const updated = await sql`
      UPDATE members SET membership_expires_at = ${parsedDate.toISOString()}, updated_at = NOW()
      WHERE id = ${memberId}
      RETURNING id, name, email, membership_expires_at;
    `;
    if (updated.length === 0) {
      return res.status(404).json({ error: 'No member found with that id.' });
    }
    return res.status(200).json({ success: true, member: updated[0] });
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, PATCH');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const rows = await sql`
    SELECT id, email, name, phone, last_pass_name, last_ticket_id,
           membership_expires_at, created_at
    FROM members
    ORDER BY membership_expires_at DESC
    LIMIT 500;
  `;

  const now = new Date();
  const members = rows.map((m) => ({
    ...m,
    isActive: new Date(m.membership_expires_at) > now,
  }));

  return res.status(200).json({ members });
}
