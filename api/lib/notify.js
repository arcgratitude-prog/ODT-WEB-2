// Sends the "someone just booked" alert email to admins via Resend.
// If RESEND_API_KEY or ADMIN_NOTIFY_EMAILS isn't set, this quietly does
// nothing — the booking still gets saved either way, so a missing/invalid
// email config never blocks or breaks a real customer's payment.

import { Resend } from 'resend';

export async function sendBookingAlertEmail(order) {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmails = (process.env.ADMIN_NOTIFY_EMAILS || '')
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);

  if (!apiKey || adminEmails.length === 0) {
    console.warn('Skipping booking alert email — RESEND_API_KEY or ADMIN_NOTIFY_EMAILS not set.');
    return;
  }

  const resend = new Resend(apiKey);
  const amount = (order.totalAmountCents / 100).toFixed(2);
  const qty = order.quantity || 1;
  const ticketIds = order.ticketIds && order.ticketIds.length > 0 ? order.ticketIds : [order.ticketId];

  const html = `
    <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; background:#0b0d12; color:#e5e7eb; border-radius:16px; overflow:hidden; border:1px solid #23262f;">
      <div style="background: linear-gradient(135deg,#dc2626,#7f1d1d); padding: 20px 24px;">
        <div style="color:#fff; font-size:16px; font-weight:800; text-transform:uppercase; letter-spacing:0.05em;">New Booking${qty > 1 ? ` &times; ${qty}` : ''}</div>
      </div>
      <div style="padding: 20px 24px;">
        <table style="width:100%; font-size:14px; border-collapse: collapse;">
          <tr><td style="color:#9ca3af; padding:6px 0;">Name</td><td style="text-align:right; font-weight:700; color:#fff;">${escapeHtml(order.customerName)}</td></tr>
          <tr><td style="color:#9ca3af; padding:6px 0;">Email</td><td style="text-align:right; font-weight:700; color:#fff;">${escapeHtml(order.customerEmail)}</td></tr>
          ${order.customerPhone ? `<tr><td style="color:#9ca3af; padding:6px 0;">Phone</td><td style="text-align:right; font-weight:700; color:#fff;">${escapeHtml(order.customerPhone)}</td></tr>` : ''}
          <tr><td style="color:#9ca3af; padding:6px 0;">Pass</td><td style="text-align:right; font-weight:700; color:#fff;">${escapeHtml(order.passName)}${qty > 1 ? ` &times; ${qty}` : ''}</td></tr>
          <tr><td style="color:#9ca3af; padding:6px 0;">Amount</td><td style="text-align:right; font-weight:700; color:#34d399;">$${amount}</td></tr>
          ${order.classesIncluded ? `<tr><td style="color:#9ca3af; padding:6px 0;">Classes</td><td style="text-align:right; font-weight:700; color:#fff;">${escapeHtml(order.classesIncluded)}</td></tr>` : ''}
          <tr><td style="color:#9ca3af; padding:6px 0;">Ticket ID${qty > 1 ? 's' : ''}</td><td style="text-align:right; font-weight:700; color:#fff; font-family:monospace; font-size:12px;">${ticketIds.map(escapeHtml).join('<br>')}</td></tr>
        </table>
      </div>
    </div>
  `;

  try {
    await resend.emails.send({
      from: 'Official Dance Theory <tickets@officialdancetheory.com>',
      to: adminEmails,
      subject: `New booking: ${order.customerName} — $${amount} (${order.passName}${qty > 1 ? ` x${qty}` : ''})`,
      html,
    });
  } catch (err) {
    // Never let an email failure break the booking flow — just log it.
    console.error('Failed to send booking alert email:', err);
  }
}

// Sends the branded, ticket-style confirmation email to the customer who
// just booked. This design is ported from an earlier manual tool
// (resend-tickets.js) that was already proven out on real customers —
// rebuilt here to run automatically off the live webhook's booking data
// instead of being triggered by hand, with a few fixes along the way:
//   - Field names updated to match the current booking object (the old
//     tool used a different checkout system's metadata shape).
//   - Event date/time/venue updated to the current, correct info (the old
//     tool had stale placeholder details baked in).
//   - Accent colors now match the live checkout's actual theme per
//     category (red / fuchsia / silver) instead of the old tool's colors.
// Sends the branded confirmation email to the customer who just booked.
// Design ported from a Google Stitch mockup (dark violet/fuchsia "order
// receipt" aesthetic) and adapted to real, current data:
//   - Gradient text and blur effects from the mockup are replaced with
//     solid colors, since those aren't reliably supported across email
//     clients (especially Outlook) — this keeps the email looking right
//     everywhere instead of just in a browser preview.
//   - Interactive buttons from the mockup (Add to Wallet, door-scanner
//     test, in-email Resend) were dropped: they were wired to demo-only
//     JS in the mockup and have no real backend behind them here. A real
//     "Add to Wallet" would need Apple/Google Wallet pass-signing
//     infrastructure — a separate project, not just styling.
//   - Payment method shows generically ("Card via Stripe") rather than a
//     specific card brand/last4, since that data isn't captured here.
//   - No promo/discount or processing-fee line items, since the current
//     checkout has no such concepts — the total is just the pass price.
// Resolves "every 2nd Friday" to the actual next occurrence date, so the
// email shows a real date instead of just the recurring pattern. Same
// logic as getNextSecondFriday in src/utils/passCalendar.ts — duplicated
// here since this file runs server-side. Keep both in sync.
function getNextSecondFriday(from) {
  let d = new Date(from.getFullYear(), from.getMonth(), 1);
  let fridayCount = 0;
  while (fridayCount < 2) {
    if (d.getDay() === 5) fridayCount++;
    if (fridayCount < 2) d.setDate(d.getDate() + 1);
  }
  if (d < from) {
    d = new Date(from.getFullYear(), from.getMonth() + 1, 1);
    fridayCount = 0;
    while (fridayCount < 2) {
      if (d.getDay() === 5) fridayCount++;
      if (fridayCount < 2) d.setDate(d.getDate() + 1);
    }
  }
  return d;
}

function buildOrderReceiptEmail(order) {
  const name = (order.customerName || 'there').trim();
  const firstName = name.split(/\s+/)[0] || name;
  const passNameLower = (order.passName || '').toLowerCase();
  const isLocura = passNameLower.includes('locura');
  const isInvasion = passNameLower.includes('invasion');
  const totalAmount = (order.totalAmountCents / 100).toFixed(2);
  const ticketIds = order.ticketIds && order.ticketIds.length > 0 ? order.ticketIds : [order.ticketId];
  const quantity = ticketIds.length;

  // Real event details per category — same source data used on the
  // digital pass page (DigitalPassPage.tsx), duplicated here since this
  // file runs server-side. Update both together if details ever change.
  let timeLabel, dateBig, dateSmall, dj;
  if (isLocura) {
    timeLabel = '4–9 PM EDT';
    dateBig = 'SEPT 13';
    dateSmall = 'SUNDAY';
    dj = 'DJ JR';
  } else if (isInvasion) {
    timeLabel = '8 PM–1 AM EDT';
    const nextFriday = getNextSecondFriday(new Date());
    dateBig = nextFriday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
    dateSmall = 'FRIDAY';
    dj = 'DJ JR';
  } else {
    timeLabel = order.classesIncluded || 'See schedule';
    dateBig = 'WEEKLY';
    dateSmall = 'ONGOING';
    dj = null;
  }

  const eventTitle = isLocura ? 'Bachata Locura' : isInvasion ? 'Bachata Invasion' : order.passName;

  // Accent colors match the live checkout's actual theme per category
  // (see ACCENT_CLASSES in CustomStripeCheckout.tsx) — red for classes,
  // fuchsia for Invasion, silver/slate for Locura — so the confirmation
  // email visually matches whatever the customer just checked out from,
  // instead of always looking the same regardless of what they bought.
  const accent = isLocura
    ? { main: '#cbd5e1', badgeBg: '#1e293b', border30: 'rgba(203,213,225,0.3)', border50: 'rgba(203,213,225,0.5)', dateText: '#e2e8f0', dateTextDim: 'rgba(226,232,240,0.8)' }
    : isInvasion
    ? { main: '#e879f9', badgeBg: '#3b0a52', border30: 'rgba(232,121,249,0.3)', border50: 'rgba(232,121,249,0.5)', dateText: '#f0abfc', dateTextDim: 'rgba(240,171,252,0.8)' }
    : { main: '#f87171', badgeBg: '#450a0a', border30: 'rgba(248,113,113,0.3)', border50: 'rgba(248,113,113,0.5)', dateText: '#fecaca', dateTextDim: 'rgba(254,202,202,0.8)' };

  const venueName = 'Dance Factory Tampa';
  const venueAddress = '334 Westshore Plaza A10';
  const cityState = 'Tampa, FL 33609';
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venueName} ${venueAddress} ${cityState}`)}`;

  // Specific classes selected (e.g. "7:00 PM (Bachata Foundation), 8:00 PM
  // (Skills and Drills)") get their own prominent list rather than being
  // crammed into a compact grid cell — that's the whole point of showing
  // the customer exactly which classes they picked.
  const classList = (!isLocura && !isInvasion && order.classesIncluded)
    ? order.classesIncluded.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const classListHtml = classList.length > 0 ? `
        <table width="100%" cellpadding="0" cellspacing="0" bgcolor="#0f0821" style="background:#0f0821;border-radius:12px;padding:12px;margin-bottom:12px;"><tr><td>
          <p style="margin:0 0 6px;font-size:9px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.45);">Classes Selected</p>
          ${classList.map((c) => `<p style="margin:0 0 3px;font-size:12px;font-weight:700;color:#ffffff;">&#9642; ${escapeHtml(c)}</p>`).join('')}
        </td></tr></table>` : '';

  // Renders one ticket visual — called once per ticket in the order, so a
  // "2 tickets" purchase shows two full ticket blocks, each with its own
  // QR code and Order # (each is independently scannable/checkable at
  // the door — see the multi-ticket fix in stripe-webhook.js).
  function renderTicketBlock(ticketId, ticketNumber) {
    const passUrl = `https://officialdancetheory.com/?ticket=${encodeURIComponent(ticketId)}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&bgcolor=ffffff&color=1a0b2e&data=${encodeURIComponent(passUrl)}`;

    // Ticket info grid rows — DJ only for social events, Time only when
    // there isn't already a dedicated classes list showing that info.
    const infoCells = [
      ...(classList.length === 0 ? [{ label: 'Time', value: timeLabel }] : []),
      { label: 'Venue', value: venueName },
      ...(dj ? [{ label: 'DJ', value: dj }] : []),
      { label: 'Instructors', value: 'Albina & Isaac' },
    ];
    let infoGridHtml = '';
    for (let i = 0; i < infoCells.length; i += 2) {
      const a = infoCells[i];
      const b = infoCells[i + 1];
      infoGridHtml += `
        <tr>
          <td width="50%" style="padding:0 0 10px 0;vertical-align:top;">
            <p style="margin:0;font-size:9px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.45);">${escapeHtml(a.label)}</p>
            <p style="margin:0;font-size:12px;font-weight:700;color:#ffffff;">${escapeHtml(a.value)}</p>
          </td>
          ${b ? `<td width="50%" style="padding:0 0 10px 0;vertical-align:top;">
            <p style="margin:0;font-size:9px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.45);">${escapeHtml(b.label)}</p>
            <p style="margin:0;font-size:12px;font-weight:700;color:#ffffff;">${escapeHtml(b.value)}</p>
          </td>` : '<td width="50%"></td>'}
        </tr>`;
    }

    return `
    <table width="100%" cellpadding="0" cellspacing="0" bgcolor="#1a0f30" style="background:#1a0f30;border-radius:16px;padding:18px;border:1px solid ${accent.border30};${ticketNumber > 1 ? 'margin-top:12px;' : ''}">
      <tr><td>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;"><tr>
          <td style="vertical-align:top;">
            <span style="font-size:9px;font-weight:800;letter-spacing:0.05em;text-transform:uppercase;color:#34d399;">&#10003; Order #${escapeHtml(ticketId)}</span>
            ${quantity > 1 ? `<br><span style="font-size:9px;font-weight:700;color:${accent.dateText};">Ticket ${ticketNumber} of ${quantity}</span>` : ''}
          </td>
          <td align="right" style="vertical-align:top;">
            <table cellpadding="0" cellspacing="0" bgcolor="${accent.badgeBg}" style="background:${accent.badgeBg};border:1px solid ${accent.border50};border-radius:10px;"><tr>
              <td align="center" style="padding:5px 10px;">
                <span style="display:block;font-size:15px;font-weight:900;color:${accent.dateText};line-height:1;white-space:nowrap;">${escapeHtml(dateBig)}</span>
                <span style="display:block;font-size:7px;font-weight:700;letter-spacing:0.1em;color:${accent.dateTextDim};text-transform:uppercase;margin-top:2px;">${escapeHtml(dateSmall)}</span>
              </td>
            </tr></table>
          </td>
        </tr></table>

        <p style="margin:0 0 12px;font-size:22px;font-weight:900;color:#ffffff;text-transform:uppercase;letter-spacing:0.01em;text-align:center;">${escapeHtml(eventTitle)}</p>

        ${classListHtml}
        <table width="100%" cellpadding="0" cellspacing="0" bgcolor="#0f0821" style="background:#0f0821;border-radius:12px;padding:12px;margin-bottom:12px;">${infoGridHtml}</table>

        <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px dashed rgba(255,255,255,0.2);padding-top:12px;"><tr>
          <td width="60" style="vertical-align:top;">
            <a href="${passUrl}"><img src="${qrUrl}" width="52" height="52" alt="Scan for digital pass" style="display:block;border-radius:6px;"></a>
          </td>
          <td style="vertical-align:top;padding-left:10px;">
            <p style="margin:0;font-size:11px;font-weight:700;color:#ffffff;">${escapeHtml(name)}</p>
            <p style="margin:0;font-size:9px;font-family:monospace;color:rgba(255,255,255,0.4);">${escapeHtml(ticketId)}</p>
          </td>
        </tr></table>
      </td></tr>
    </table>`;
  }

  const ticketBlocksHtml = ticketIds.map((id, idx) => renderTicketBlock(id, idx + 1)).join('');

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Your ${escapeHtml(order.passName)} order — Official Dance Theory</title></head>
<body style="margin:0;padding:0;background:#0a0717;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;" bgcolor="#0a0717">
<table width="100%" cellpadding="0" cellspacing="0" bgcolor="#0a0717" style="background:#0a0717;padding:28px 12px;">
<tr><td align="center" bgcolor="#0a0717">
<table width="100%" style="max-width:440px;" cellpadding="0" cellspacing="0">

  <!-- One single card: greeting, ticket(s), payment, address — everything
       minimal and on one screen, no separate stacked sections. -->
  <tr><td bgcolor="#14102a" style="background:#14102a;border-radius:20px;padding:24px;border:1px solid rgba(255,255,255,0.08);">

    <!-- Greeting -->
    <p style="margin:0 0 4px;font-size:22px;font-weight:800;color:#ffffff;line-height:1.2;">Get ready to dance, <span style="color:${accent.main};">${escapeHtml(firstName)}</span>!</p>
    <p style="margin:0 0 18px;font-size:12px;color:rgba(255,255,255,0.55);">Your pass${quantity > 1 ? `es (${quantity} tickets)` : ''} for <strong style="color:#ffffff;">${escapeHtml(order.passName)}</strong> ${quantity > 1 ? 'are' : 'is'} confirmed.</p>

    <!-- Ticket(s) -->
    ${ticketBlocksHtml}

    <!-- Payment + Address, compact -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;"><tr>
      <td>
        <p style="margin:0;font-size:9px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:rgba(255,255,255,0.45);">Paid${quantity > 1 ? ` (${quantity} tickets)` : ''}</p>
        <p style="margin:0;font-size:15px;font-weight:800;color:${accent.main};font-family:monospace;">$${totalAmount}</p>
      </td>
      <td align="right" style="vertical-align:top;">
        <p style="margin:0;font-size:9px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:rgba(255,255,255,0.45);">Card via Stripe</p>
        <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.5);">Ref ${escapeHtml(order.stripePaymentIntentId || ticketIds[0])}</p>
      </td>
    </tr></table>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:14px;border-top:1px solid rgba(255,255,255,0.08);padding-top:14px;"><tr>
      <td style="vertical-align:top;">
        <p style="margin:0;font-size:12px;font-weight:700;color:#ffffff;">${escapeHtml(venueName)}</p>
        <p style="margin:1px 0 0;font-size:11px;color:rgba(255,255,255,0.5);">${escapeHtml(venueAddress)}, ${escapeHtml(cityState)}</p>
      </td>
      <td align="right" style="vertical-align:top;white-space:nowrap;">
        <a href="${mapsUrl}" style="font-size:11px;font-weight:700;color:#67e8f9;text-decoration:none;">Directions &rarr;</a>
      </td>
    </tr></table>

    <p style="margin:16px 0 0;font-size:11px;color:rgba(255,255,255,0.35);text-align:center;">Questions? Just reply to this email. See you on the floor!</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  const subject = `Your order for ${order.passName}${quantity > 1 ? ` (${quantity} tickets)` : ''} — Official Dance Theory`;
  return { subject, html };
}

// Sends the branded ticket confirmation email to the customer who just
// booked. Same fail-safe philosophy as the admin alert above: if Resend
// isn't configured, or the email address on file looks bogus, this quietly
// skips rather than blocking the booking or throwing an error Stripe would
// see as a failure and retry unnecessarily.
export async function sendCustomerConfirmationEmail(order) {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = (order.customerEmail || '').trim();
  const looksLikeRealEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(toEmail) && toEmail !== 'unknown@example.com';

  if (!apiKey || !looksLikeRealEmail) {
    console.warn('Skipping customer confirmation email — RESEND_API_KEY not set or no valid customer email on file.');
    return;
  }

  const resend = new Resend(apiKey);
  const { subject, html } = buildOrderReceiptEmail(order);

  try {
    await resend.emails.send({
      from: 'Official Dance Theory <tickets@officialdancetheory.com>',
      to: toEmail,
      subject,
      html,
    });
  } catch (err) {
    // Never let an email failure break the booking flow — just log it.
    console.error('Failed to send customer confirmation email:', err);
  }
}

// Optional bonus channel: sends a push notification via ntfy.sh if
// NTFY_TOPIC is set. Completely skipped (no error) if not configured.
export async function sendBookingPushNotification(order) {
  const topic = process.env.NTFY_TOPIC;
  if (!topic) return;

  const amount = (order.totalAmountCents / 100).toFixed(2);
  const qty = order.quantity || 1;

  try {
    await fetch(`https://ntfy.sh/${encodeURIComponent(topic)}`, {
      method: 'POST',
      headers: {
        Title: 'New Booking!',
        Priority: 'high',
        Tags: 'moneybag',
      },
      body: `${order.customerName} booked ${order.passName}${qty > 1 ? ` x${qty}` : ''} — $${amount}`,
    });
  } catch (err) {
    console.error('Failed to send ntfy push notification:', err);
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
