// Sends the "someone just booked" alert email to admins via Resend.
// If RESEND_API_KEY or ADMIN_NOTIFY_EMAILS isn't set, this quietly does
// nothing — the booking still gets saved either way, so a missing/invalid
// email config never blocks or breaks a real customer's payment.

import { Resend } from 'resend';

export async function sendBookingAlertEmail(booking) {
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
  const amount = (booking.amountCents / 100).toFixed(2);

  const html = `
    <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; background:#0b0d12; color:#e5e7eb; border-radius:16px; overflow:hidden; border:1px solid #23262f;">
      <div style="background: linear-gradient(135deg,#dc2626,#7f1d1d); padding: 20px 24px;">
        <div style="color:#fff; font-size:16px; font-weight:800; text-transform:uppercase; letter-spacing:0.05em;">New Booking</div>
      </div>
      <div style="padding: 20px 24px;">
        <table style="width:100%; font-size:14px; border-collapse: collapse;">
          <tr><td style="color:#9ca3af; padding:6px 0;">Name</td><td style="text-align:right; font-weight:700; color:#fff;">${escapeHtml(booking.customerName)}</td></tr>
          <tr><td style="color:#9ca3af; padding:6px 0;">Email</td><td style="text-align:right; font-weight:700; color:#fff;">${escapeHtml(booking.customerEmail)}</td></tr>
          ${booking.customerPhone ? `<tr><td style="color:#9ca3af; padding:6px 0;">Phone</td><td style="text-align:right; font-weight:700; color:#fff;">${escapeHtml(booking.customerPhone)}</td></tr>` : ''}
          <tr><td style="color:#9ca3af; padding:6px 0;">Pass</td><td style="text-align:right; font-weight:700; color:#fff;">${escapeHtml(booking.passName)}</td></tr>
          <tr><td style="color:#9ca3af; padding:6px 0;">Amount</td><td style="text-align:right; font-weight:700; color:#34d399;">$${amount}</td></tr>
          ${booking.classesIncluded ? `<tr><td style="color:#9ca3af; padding:6px 0;">Classes</td><td style="text-align:right; font-weight:700; color:#fff;">${escapeHtml(booking.classesIncluded)}</td></tr>` : ''}
          <tr><td style="color:#9ca3af; padding:6px 0;">Ticket ID</td><td style="text-align:right; font-weight:700; color:#fff; font-family:monospace;">${escapeHtml(booking.ticketId)}</td></tr>
        </table>
      </div>
    </div>
  `;

  try {
    await resend.emails.send({
      from: 'Official Dance Theory <tickets@officialdancetheory.com>',
      to: adminEmails,
      subject: `New booking: ${booking.customerName} — $${amount} (${booking.passName})`,
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
function buildOrderReceiptEmail(booking) {
  const name = (booking.customerName || 'there').trim();
  const firstName = name.split(/\s+/)[0] || name;
  const passNameLower = (booking.passName || '').toLowerCase();
  const isLocura = passNameLower.includes('locura');
  const isInvasion = passNameLower.includes('invasion');
  const amount = (booking.amountCents / 100).toFixed(2);

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
    dateBig = '2ND FRI';
    dateSmall = 'MONTHLY';
    dj = 'DJ JR';
  } else {
    timeLabel = booking.classesIncluded || 'See schedule';
    dateBig = 'WEEKLY';
    dateSmall = 'ONGOING';
    dj = null;
  }

  const eventTitle = isLocura ? 'Bachata Locura' : isInvasion ? 'Bachata Invasion' : booking.passName;
  const venueName = 'Dance Factory Tampa';
  const venueAddress = '334 Westshore Plaza A10';
  const cityState = 'Tampa, FL 33609';
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venueName} ${venueAddress} ${cityState}`)}`;
  const passUrl = `https://officialdancetheory.com/?ticket=${encodeURIComponent(booking.ticketId)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&bgcolor=ffffff&color=1a0b2e&data=${encodeURIComponent(passUrl)}`;

  // Ticket info grid rows — DJ only shown for social events (classes don't have one).
  const infoCells = [
    { label: 'Time', value: timeLabel },
    { label: 'Venue', value: venueName },
    ...(dj ? [{ label: 'DJ', value: dj }] : []),
    { label: 'Instructors', value: 'Albina & Isaac' },
  ];
  // Render as a 2-column grid, pairing cells two at a time.
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

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Your ${escapeHtml(booking.passName)} order — Official Dance Theory</title></head>
<body style="margin:0;padding:0;background:#0a0717;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;" bgcolor="#0a0717">
<table width="100%" cellpadding="0" cellspacing="0" bgcolor="#0a0717" style="background:#0a0717;padding:28px 12px;">
<tr><td align="center" bgcolor="#0a0717">
<table width="100%" style="max-width:440px;" cellpadding="0" cellspacing="0">

  <!-- One single card: greeting, ticket, payment, address — everything
       minimal and on one screen, no separate stacked sections. -->
  <tr><td bgcolor="#14102a" style="background:#14102a;border-radius:20px;padding:24px;border:1px solid rgba(255,255,255,0.08);">

    <!-- Greeting -->
    <p style="margin:0 0 4px;font-size:22px;font-weight:800;color:#ffffff;line-height:1.2;">Get ready to dance, <span style="color:#e879f9;">${escapeHtml(firstName)}</span>!</p>
    <p style="margin:0 0 18px;font-size:12px;color:rgba(255,255,255,0.55);">Your pass for <strong style="color:#ffffff;">${escapeHtml(booking.passName)}</strong> is confirmed.</p>

    <!-- Ticket -->
    <table width="100%" cellpadding="0" cellspacing="0" bgcolor="#1a0f30" style="background:#1a0f30;border-radius:16px;padding:18px;border:1px solid rgba(232,121,249,0.3);">
      <tr><td>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;"><tr>
          <td style="vertical-align:top;">
            <span style="font-size:9px;font-weight:800;letter-spacing:0.05em;text-transform:uppercase;color:#34d399;">&#10003; Order #${escapeHtml(booking.ticketId)}</span>
          </td>
          <td align="right" style="vertical-align:top;">
            <table cellpadding="0" cellspacing="0" bgcolor="#3b0a52" style="background:#3b0a52;border:1px solid rgba(232,121,249,0.5);border-radius:10px;"><tr>
              <td align="center" style="padding:5px 10px;">
                <span style="display:block;font-size:15px;font-weight:900;color:#f0abfc;line-height:1;white-space:nowrap;">${escapeHtml(dateBig)}</span>
                <span style="display:block;font-size:7px;font-weight:700;letter-spacing:0.1em;color:rgba(240,171,252,0.8);text-transform:uppercase;margin-top:2px;">${escapeHtml(dateSmall)}</span>
              </td>
            </tr></table>
          </td>
        </tr></table>

        <p style="margin:0 0 12px;font-size:22px;font-weight:900;color:#ffffff;text-transform:uppercase;letter-spacing:0.01em;text-align:center;">${escapeHtml(eventTitle)}</p>

        <table width="100%" cellpadding="0" cellspacing="0" bgcolor="#0f0821" style="background:#0f0821;border-radius:12px;padding:12px;margin-bottom:12px;">${infoGridHtml}</table>

        <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px dashed rgba(255,255,255,0.2);padding-top:12px;"><tr>
          <td width="60" style="vertical-align:top;">
            <a href="${passUrl}"><img src="${qrUrl}" width="52" height="52" alt="Scan for digital pass" style="display:block;border-radius:6px;"></a>
          </td>
          <td style="vertical-align:top;padding-left:10px;">
            <p style="margin:0;font-size:11px;font-weight:700;color:#ffffff;">${escapeHtml(name)}</p>
            <p style="margin:0;font-size:9px;font-family:monospace;color:rgba(255,255,255,0.4);">${escapeHtml(booking.ticketId)}</p>
            <p style="margin:4px 0 0;"><a href="${passUrl}" style="font-size:10px;font-weight:700;color:#e879f9;text-decoration:none;">View Digital Pass &rarr;</a></p>
          </td>
        </tr></table>
      </td></tr>
    </table>

    <!-- Payment + Address, compact -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;"><tr>
      <td>
        <p style="margin:0;font-size:9px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:rgba(255,255,255,0.45);">Paid</p>
        <p style="margin:0;font-size:15px;font-weight:800;color:#f472b6;font-family:monospace;">$${amount}</p>
      </td>
      <td align="right" style="vertical-align:top;">
        <p style="margin:0;font-size:9px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:rgba(255,255,255,0.45);">Card via Stripe</p>
        <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.5);">Ref ${escapeHtml(booking.ticketId)}</p>
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

  const subject = `Your order for ${booking.passName} — Official Dance Theory`;
  return { subject, html };
}

// Sends the branded ticket confirmation email to the customer who just
// booked. Same fail-safe philosophy as the admin alert above: if Resend
// isn't configured, or the email address on file looks bogus, this quietly
// skips rather than blocking the booking or throwing an error Stripe would
// see as a failure and retry unnecessarily.
export async function sendCustomerConfirmationEmail(booking) {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = (booking.customerEmail || '').trim();
  const looksLikeRealEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(toEmail) && toEmail !== 'unknown@example.com';

  if (!apiKey || !looksLikeRealEmail) {
    console.warn('Skipping customer confirmation email — RESEND_API_KEY not set or no valid customer email on file.');
    return;
  }

  const resend = new Resend(apiKey);
  const { subject, html } = buildOrderReceiptEmail(booking);

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
export async function sendBookingPushNotification(booking) {
  const topic = process.env.NTFY_TOPIC;
  if (!topic) return;

  const amount = (booking.amountCents / 100).toFixed(2);

  try {
    await fetch(`https://ntfy.sh/${encodeURIComponent(topic)}`, {
      method: 'POST',
      headers: {
        Title: 'New Booking!',
        Priority: 'high',
        Tags: 'moneybag',
      },
      body: `${booking.customerName} booked ${booking.passName} — $${amount}`,
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
