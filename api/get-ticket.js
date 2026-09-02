// Fetches a single booking by its ticket ID, for the interactive digital
// pass page (/?ticket=<id>). Read-only — this never modifies a booking.
//
// A ticket ID (e.g. "UB-XXXXXXXX") is high-entropy and not sequential/
// guessable, similar to how many real-world ticketing systems (Eventbrite,
// etc.) treat a ticket link as the access control — knowing the exact ID
// is treated as proof you're allowed to view that one booking's basic
// details. This does not expose a list of bookings or anyone else's data.

import { sql, ensureBookingsTable } from './_lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ticketId = (req.query.id || '').trim();
  if (!ticketId) {
    return res.status(400).json({ error: 'Missing ticket id' });
  }

  try {
    await ensureBookingsTable();

    const rows = await sql`
      SELECT
        ticket_id, customer_name, customer_email,
        pass_name, pass_type, amount_cents, classes_included,
        ticket_number, ticket_count,
        checked_in, created_at
      FROM bookings
      WHERE ticket_id = ${ticketId}
      LIMIT 1;
    `;

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const b = rows[0];
    return res.status(200).json({
      ticketId: b.ticket_id,
      customerName: b.customer_name,
      customerEmail: b.customer_email,
      passName: b.pass_name,
      passType: b.pass_type,
      amountCents: b.amount_cents,
      classesIncluded: b.classes_included,
      ticketNumber: b.ticket_number,
      ticketCount: b.ticket_count,
      checkedIn: b.checked_in,
      createdAt: b.created_at,
    });
  } catch (err) {
    console.error('Failed to fetch ticket:', err);
    return res.status(500).json({ error: 'Failed to fetch ticket' });
  }
}
