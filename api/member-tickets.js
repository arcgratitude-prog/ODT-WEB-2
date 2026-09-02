// This file lives at: api/member-tickets.js
// Returns every real booking tied to a member's email, so the Member
// Portal can show actual purchase history from the database instead of
// only whatever happens to be saved in that one browser's local storage
// (which breaks the moment someone logs in on a different device).
//
// Requires the session token issued at login (api/member-login.js) —
// never just an email by itself, since that would let anyone see anyone
// else's purchase history just by guessing/knowing their email address.

import { sql, ensureBookingsTable, ensureMembersTable } from './_lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, sessionToken } = req.body;
    if (!email || !sessionToken) {
      return res.status(400).json({ error: 'Email and session token are required.' });
    }

    await ensureMembersTable();
    await ensureBookingsTable();

    const normalizedEmail = String(email).trim().toLowerCase();
    const memberRows = await sql`
      SELECT session_token FROM members WHERE LOWER(email) = ${normalizedEmail} LIMIT 1;
    `;

    if (memberRows.length === 0 || memberRows[0].session_token !== sessionToken) {
      return res.status(401).json({ error: 'Invalid session — please log in again.' });
    }

    const bookings = await sql`
      SELECT ticket_id, pass_name, amount_cents, classes_included,
             ticket_number, ticket_count, checked_in, created_at
      FROM bookings
      WHERE LOWER(customer_email) = ${normalizedEmail}
      ORDER BY created_at DESC
      LIMIT 100;
    `;

    return res.status(200).json({
      tickets: bookings.map((b) => ({
        ticketId: b.ticket_id,
        passName: b.pass_name,
        amountCents: b.amount_cents,
        classesIncluded: b.classes_included,
        ticketNumber: b.ticket_number,
        ticketCount: b.ticket_count,
        checkedIn: b.checked_in,
        createdAt: b.created_at,
      })),
    });
  } catch (err) {
    console.error('member-tickets error:', err);
    return res.status(500).json({ error: 'Could not load your tickets. Please try again.' });
  }
}
