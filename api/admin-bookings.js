// Admin-only endpoint: lists recent bookings and lets staff mark someone
// checked in. Protected by a shared password (ADMIN_PASSWORD env var) sent
// in the "x-admin-password" header — simple, no user accounts to manage,
// good enough for a small team sharing one door-check device.

import { ensureBookingsTable, sql } from './lib/db.js';

function isAuthorized(req) {
  const provided = req.headers['x-admin-password'];
  const expected = process.env.ADMIN_PASSWORD;
  return expected && provided === expected;
}

export default async function handler(req, res) {
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await ensureBookingsTable();

  if (req.method === 'GET') {
    // Return the most recent 200 bookings — enough for any single event day.
    const rows = await sql`
      SELECT id, ticket_id, customer_name, customer_email, customer_phone,
             pass_name, pass_type, amount_cents, classes_included,
             ticket_number, ticket_count, referred_by,
             checked_in, checked_in_at, created_at
      FROM bookings
      ORDER BY created_at DESC
      LIMIT 200;
    `;
    return res.status(200).json({ bookings: rows });
  }

  if (req.method === 'POST') {
    // Toggle check-in status for one booking, by ticket ID.
    const { ticketId, checkedIn } = req.body || {};
    if (!ticketId || typeof checkedIn !== 'boolean') {
      return res.status(400).json({ error: 'Invalid request' });
    }

    const rows = await sql`
      UPDATE bookings
      SET checked_in = ${checkedIn},
          checked_in_at = ${checkedIn ? new Date().toISOString() : null}
      WHERE ticket_id = ${ticketId}
      RETURNING id, ticket_id, checked_in, checked_in_at;
    `;

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    return res.status(200).json({ booking: rows[0] });
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method not allowed' });
}
