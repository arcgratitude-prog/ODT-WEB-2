// Single source of truth for "has this dated event already happened?"
// used by every ticket/pass surface (saved passes drawer, member portal,
// digital pass page).
//
// WHY THIS EXISTS
// Before this file, each of those surfaces had its OWN copy of the same
// logic: look at the pass NAME, and compare it against a single hardcoded
// "next occurrence" date. That breaks for recurring events — Bachata
// Invasion, Lab Night, etc. happen again every cycle, so a ticket from a
// PAST occurrence was being compared against the UPCOMING occurrence's
// date and therefore looked like it was still coming up. Centralizing it
// here (plus stamping a real frozen date onto each new ticket — see
// getEventEndsAtISO) fixes that: an old ticket keeps the date it was
// actually for, so once that date passes it correctly reads as past.
//
// IMPORTANT — DATE UPDATES
// The start/end datetimes below are the authoritative ones for
// past-event detection. These are still duplicated elsewhere for other
// purposes and must be kept in sync BY HAND when an event's date changes:
//   - src/components/TicketModal.tsx  (getEventDateLabel — the human
//     "Friday, September 11th…" label shown on the ticket)
//   - src/utils/passCalendar.ts       (the .ics calendar-download date)
//   - src/data/danceData.ts           (marketing copy on the site)
//   - api/_lib/notify.js              (confirmation email copy)
// Update this file alongside those whenever a real event date moves.
//
// Months are 0-indexed in the Date constructor (8 = September).

export interface EventOccurrence {
  startsAt: Date;
  endsAt: Date;
}

// Returns the real start/end for whatever dated event a pass name refers
// to, or null for passes that AREN'T tied to a single calendar date
// (weekly Tiers, class drop-ins, and the private X1 sessions). Those
// never become "past", which matches how they work — they're recurring
// or scheduled directly.
export function occurrenceForPassName(passName: string | null | undefined): EventOccurrence | null {
  const name = passName || '';

  // Sunday, September 20, 2026 — 4:00 PM to 9:00 PM.
  if (/Locura/i.test(name)) {
    return { startsAt: new Date(2026, 8, 20, 16, 0, 0), endsAt: new Date(2026, 8, 20, 21, 0, 0) };
  }
  // Sunday, September 20, 2026 — 1:30 PM to 3:30 PM (before Locura).
  if (/Boot Camp/i.test(name)) {
    return { startsAt: new Date(2026, 8, 20, 13, 30, 0), endsAt: new Date(2026, 8, 20, 15, 30, 0) };
  }
  // Friday, September 18, 2026 — 6:30 PM to 10:30 PM.
  if (/Lab Night/i.test(name)) {
    return { startsAt: new Date(2026, 8, 18, 18, 30, 0), endsAt: new Date(2026, 8, 18, 22, 30, 0) };
  }
  // Friday, September 11, 2026 — 8:00 PM to 1:00 AM the next day.
  if (/Invasion/i.test(name)) {
    return { startsAt: new Date(2026, 8, 11, 20, 0, 0), endsAt: new Date(2026, 8, 12, 1, 0, 0) };
  }

  // Tiers, drop-ins, X1 — no single date.
  return null;
}

// The event-end instant (ISO string) to STAMP onto a brand-new ticket at
// the moment it's purchased, "freezing" the real date so a future
// recurrence of the same event can never make this old ticket look
// upcoming again. Returns null for non-dated passes (nothing to freeze).
export function getEventEndsAtISO(passName: string | null | undefined): string | null {
  const occ = occurrenceForPassName(passName);
  return occ ? occ.endsAt.toISOString() : null;
}

// The one function every ticket surface should call. Precedence:
//   1. The legacy bogus "August 5th" placeholder some very old tickets
//      still carry was never a real event date — always treat as past.
//   2. A stamped eventEndsAt (present on tickets bought after this fix)
//      is the most reliable signal — use it directly. This is what makes
//      recurring events behave correctly ticket-by-ticket.
//   3. Otherwise fall back to the name-based occurrence lookup. Older
//      tickets that predate the stamp use this; it can't distinguish
//      which occurrence a recurring-event ticket was for, but it's the
//      best available and matches the previous behavior.
export function isPassPast(
  input: { passName?: string | null; eventDate?: string | null; eventEndsAt?: string | null },
  now: Date = new Date()
): boolean {
  if (input.eventDate && /August 5th/i.test(input.eventDate)) return true;

  if (input.eventEndsAt) {
    const stamped = new Date(input.eventEndsAt);
    if (!isNaN(stamped.getTime())) return stamped < now;
  }

  const occ = occurrenceForPassName(input.passName);
  return occ ? occ.endsAt < now : false;
}
