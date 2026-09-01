// Admin-only endpoint: lists all Tier members (regardless of active
// status — filtering active-only happens client-side so staff can toggle
// between "everyone who ever had a membership" and "who's active right
// now" without extra requests). Same shared-password protection as
// admin-bookings.js.

import { ensureMembersTable, sql } from './lib/db.js';

function isAuthorized(req) {
  const provided = req.headers['x-admin-password'];
  const expected = process.env.ADMIN_PASSWORD;
  return expected && provided === expected;
}

export default async function handler(req, res) {
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await ensureMembersTable();

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
