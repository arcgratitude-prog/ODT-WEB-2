import { TicketData } from '../types/digitalPass';

// Ported from the Stitch prototype's calendar.ts, with one real fix: the
// original always used `Date.now() + 5 days` as a placeholder — meaning
// every downloaded .ics file had the wrong date, regardless of the actual
// event. This version derives the real start/end time from the ticket's
// own event, falling back to the .ics DTSTART/DTEND format only for
// events that have an actual calendar date (weekly class passes don't —
// there's no single date to add to a calendar for those).
function resolveEventDateRange(ticket: TicketData): { start: Date; end: Date } | null {
  const eventLower = ticket.eventName.toLowerCase();

  if (eventLower.includes('locura')) {
    // Sunday, September 20, 2026 — 4:00 PM to 9:00 PM. Update here
    // alongside BachataLocuraSocialSection.tsx if the date ever changes.
    const start = new Date(2026, 8, 20, 16, 0, 0); // month is 0-indexed: 8 = September
    const end = new Date(2026, 8, 20, 21, 0, 0);
    return { start, end };
  }

  if (eventLower.includes('invasion')) {
    // Friday, September 11, 2026 — 8:00 PM to 1:00 AM. Update here
    // alongside BachataLocuraSocialSection.tsx if the date ever changes.
    const start = new Date(2026, 8, 11, 20, 0, 0);
    const end = new Date(2026, 8, 12, 1, 0, 0);
    return { start, end };
  }

  // Weekly class passes have no single date — nothing to add to a calendar.
  return null;
}

export function downloadCalendarEvent(ticket: TicketData): boolean {
  const range = resolveEventDateRange(ticket);
  if (!range) return false; // No single date to add — caller should hide/disable this action.

  const { start, end } = range;
  const formatDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Official Dance Theory//Ticket Confirmation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `SUMMARY:${ticket.eventName} - Official Dance Theory`,
    `DESCRIPTION:${ticket.subtitle}\\nPass: ${ticket.tierName}\\nOrder #${ticket.orderNumber}\\nInstructors: ${ticket.instructors.join(', ')}\\nBring comfortable dance shoes and have your digital pass ready at the door.`,
    `LOCATION:${ticket.venueName}, ${ticket.venueAddress}, ${ticket.cityState}`,
    `DTSTART:${formatDate(start)}`,
    `DTEND:${formatDate(end)}`,
    `UID:${ticket.orderNumber}@officialdancetheory.com`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `${ticket.eventName.replace(/\s+/g, '_')}_Ticket.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(link.href);
  return true;
}
