// Admin-only endpoint: lists recent bookings and lets staff mark someone
// checked in. Protected by a shared password (ADMIN_PASSWORD env var) sent
// in the "x-admin-password" header — simple, no user accounts to manage,
// good enough for a small team sharing one door-check device.

import { ensureBookingsTable, ensureMembersTable, sql } from './_lib/db.js';
import { isAdminAuthorized } from './_lib/auth.js';

export default async function handler(req, res) {
  if (!isAdminAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await ensureBookingsTable();
  await ensureMembersTable();

  if (req.method === 'GET') {
    // Return the most recent 200 bookings — enough for any single event day.
    // LEFT JOINed against members (matched by lowercased email) to also
    // return each customer's REAL membership_expires_at — the same
    // authoritative date the member portal, discount system, and the
    // /members admin page's expiration editor all use. The check-in page
    // uses this (rather than re-deriving its own guess from this Tier
    // booking's created_at) so that a manual correction made on the
    // Members page for a real-world edge case — e.g. someone who used
    // their Tier the same day they bought it, versus someone who bought
    // ahead and started the following week — shows up correctly at
    // check-in too, instead of two different "expires" dates existing
    // in two different places.
    const rows = await sql`
      SELECT b.id, b.ticket_id, b.customer_name, b.customer_email, b.customer_phone,
             b.pass_name, b.pass_type, b.amount_cents, b.classes_included,
             b.ticket_number, b.ticket_count, b.referred_by,
             b.checked_in, b.checked_in_at, b.created_at,
             m.membership_expires_at
      FROM bookings b
      LEFT JOIN members m ON LOWER(m.email) = LOWER(b.customer_email)
      ORDER BY b.created_at DESC
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

  if (req.method === 'PATCH') {
    // Manual correction to one booking's pass name and/or customer name —
    // for fixing bad data (e.g. a booking that somehow ended up with the
    // wrong event name, or a name that got saved as "Unknown"). This is
    // a deliberate, staff-initiated override, not something the normal
    // purchase flow ever does — same reasoning as the Members page's
    // expiration-date editor.
    const { id, passName, customerName } = req.body || {};
    if (!id) {
      return res.status(400).json({ error: 'id is required.' });
    }
    if (passName === undefined && customerName === undefined) {
      return res.status(400).json({ error: 'Nothing to update — provide passName and/or customerName.' });
    }

    let updated;
    if (passName !== undefined && customerName !== undefined) {
      updated = await sql`
        UPDATE bookings SET pass_name = ${passName}, customer_name = ${customerName}
        WHERE id = ${id}
        RETURNING id, ticket_id, pass_name, customer_name;
      `;
    } else if (passName !== undefined) {
      updated = await sql`
        UPDATE bookings SET pass_name = ${passName} WHERE id = ${id}
        RETURNING id, ticket_id, pass_name, customer_name;
      `;
    } else {
      updated = await sql`
        UPDATE bookings SET customer_name = ${customerName} WHERE id = ${id}
        RETURNING id, ticket_id, pass_name, customer_name;
      `;
    }

    if (updated.length === 0) {
      return res.status(404).json({ error: 'Booking not found.' });
    }
    return res.status(200).json({ success: true, booking: updated[0] });
  }

  res.setHeader('Allow', 'GET, POST, PATCH');
  return res.status(405).json({ error: 'Method not allowed' });
}
