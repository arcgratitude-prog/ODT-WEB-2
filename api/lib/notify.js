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
  const passNameLower = (booking.passName || '').toLowerCase();
  const isLocura = passNameLower.includes('locura');
  const isInvasion = passNameLower.includes('invasion');
  const amount = (booking.amountCents / 100).toFixed(2);

  // Real, current perks per category — pulled from the site's own copy,
  // not invented. Update alongside BachataLocuraSocialSection.tsx /
  // danceData.ts if event details or class descriptions change.
  let perks;
  if (isLocura) {
    perks = ['4 PM presocial class with Albina & Isaac', 'Full night of social dancing, 4–9 PM', 'Music by DJ JR', 'Pink & Purple dress theme'];
  } else if (isInvasion) {
    perks = ['8–9 PM class with Albina & Isaac', 'Social dancing 9 PM–1 AM', 'Music by DJ JR'];
  } else {
    perks = ['Structured Urban Bachata curriculum', 'Video recaps after class'];
    if (booking.classesIncluded) perks.push(`Classes: ${booking.classesIncluded}`);
  }

  const tierLine = isLocura ? 'Bachata Locura' : isInvasion ? 'Bachata Invasion' : (booking.classesIncluded || 'Class Pass');

  const perksHtml = perks.map((p) => `
              <tr>
                <td style="padding:3px 0; font-size:12px; color:rgba(255,255,255,0.85); vertical-align:top; width:14px;">&#9642;</td>
                <td style="padding:3px 0; font-size:12px; color:rgba(255,255,255,0.85);">${escapeHtml(p)}</td>
              </tr>`).join('');

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Your ${escapeHtml(booking.passName)} order — Official Dance Theory</title></head>
<body style="margin:0;padding:0;background:#0a0717;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;" bgcolor="#0a0717">
<table width="100%" cellpadding="0" cellspacing="0" bgcolor="#0a0717" style="background:#0a0717;padding:28px 12px;">
<tr><td align="center" bgcolor="#0a0717">
<table width="100%" style="max-width:480px;" cellpadding="0" cellspacing="0">

  <!-- Hero -->
  <tr><td bgcolor="#14102a" style="background:#14102a;border-radius:20px;padding:28px 24px;border:1px solid rgba(255,255,255,0.08);">
    <table cellpadding="0" cellspacing="0"><tr>
      <td bgcolor="#052e21" style="background:#052e21;border:1px solid rgba(52,211,153,0.4);border-radius:999px;padding:6px 14px;">
        <span style="font-size:10px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;color:#34d399;">&#10003; Order #${escapeHtml(booking.ticketId)} Verified</span>
      </td>
    </tr></table>
    <p style="margin:18px 0 8px;font-size:26px;font-weight:800;color:#ffffff;line-height:1.2;">
      Get ready to dance, <span style="color:#e879f9;">${escapeHtml(name.split(/\s+/)[0] || name)}</span>!
    </p>
    <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.65);line-height:1.6;">
      Thank you for purchasing your pass for <strong style="color:#ffffff;">${escapeHtml(booking.passName)}</strong>. Show this email (or your Order # above) at check-in.
    </p>
  </td></tr>

  <tr><td style="height:16px; line-height:16px; font-size:0;">&nbsp;</td></tr>

  <!-- Order Receipt -->
  <tr><td bgcolor="#14102a" style="background:#14102a;border-radius:20px;padding:24px;border:1px solid rgba(255,255,255,0.08);">
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;"><tr>
      <td>
        <p style="margin:0;font-size:15px;font-weight:800;color:#ffffff;">Order Receipt</p>
        <p style="margin:2px 0 0;font-size:11px;color:rgba(255,255,255,0.45);">Processed securely via Stripe</p>
      </td>
      <td align="right" style="vertical-align:top;">
        <span style="font-size:10px;font-weight:800;letter-spacing:0.05em;color:#34d399;background:#052e21;border:1px solid rgba(52,211,153,0.4);border-radius:999px;padding:5px 10px;white-space:nowrap;">&#10003; Paid in Full</span>
      </td>
    </tr></table>

    <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid rgba(255,255,255,0.08);padding-top:12px;">
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
          <p style="margin:0;font-size:13px;font-weight:700;color:#ffffff;">${escapeHtml(booking.passName)}</p>
          <p style="margin:2px 0 0;font-size:11px;color:rgba(255,255,255,0.5);">${escapeHtml(tierLine)}</p>
        </td>
        <td align="right" style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);vertical-align:top;">
          <span style="font-size:13px;font-weight:700;color:#ffffff;font-family:monospace;">$${amount}</span>
        </td>
      </tr>
      <tr>
        <td colspan="2" style="padding:12px 0 0;">
          <table width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="font-size:15px;font-weight:800;color:#ffffff;">Total Charged</td>
            <td align="right" style="font-size:18px;font-weight:800;color:#f472b6;font-family:monospace;">$${amount}</td>
          </tr></table>
        </td>
      </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px;"><tr>
      <td width="48%" bgcolor="#0f0b21" style="background:#0f0b21;border-radius:14px;padding:12px;vertical-align:top;">
        <p style="margin:0 0 4px;font-size:9px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.45);">Payment Method</p>
        <p style="margin:0;font-size:12px;font-weight:600;color:#ffffff;">Card via Stripe</p>
        <p style="margin:6px 0 0;font-size:10px;font-family:monospace;color:rgba(255,255,255,0.4);">Ref: ${escapeHtml(booking.ticketId)}</p>
      </td>
      <td width="4%"></td>
      <td width="48%" bgcolor="#0f0b21" style="background:#0f0b21;border-radius:14px;padding:12px;vertical-align:top;">
        <p style="margin:0 0 4px;font-size:9px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.45);">Billing Info</p>
        <p style="margin:0;font-size:12px;font-weight:600;color:#ffffff;">${escapeHtml(name)}</p>
        <p style="margin:2px 0 0;font-size:10px;color:rgba(255,255,255,0.4);">${escapeHtml(booking.customerEmail)}</p>
      </td>
    </tr></table>

    <table width="100%" cellpadding="0" cellspacing="0" bgcolor="#1a1030" style="background:#1a1030;border:1px solid rgba(232,121,249,0.25);border-radius:14px;padding:14px;margin-top:16px;">
      <tr><td>
        <p style="margin:0 0 8px;font-size:10px;font-weight:800;letter-spacing:0.06em;text-transform:uppercase;color:#e879f9;">&#10024; Included in your pass</p>
        <table cellpadding="0" cellspacing="0">${perksHtml}</table>
      </td></tr>
    </table>
  </td></tr>

  <tr><td style="height:20px; line-height:20px; font-size:0;">&nbsp;</td></tr>

  <tr><td align="center" style="padding:0 12px;">
    <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.4);line-height:1.6;">
      Questions? Just reply to this email. See you on the floor!<br>
      Official Dance Theory · Tampa, FL · officialdancetheory.com
    </p>
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
