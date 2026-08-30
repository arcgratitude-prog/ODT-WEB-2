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

// Sends the branded "you're confirmed!" email to the customer who just
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
  const amount = (booking.amountCents / 100).toFixed(2);
  const firstName = (booking.customerName || '').trim().split(/\s+/)[0] || 'there';

  const html = `
    <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; background:#0b0d12; color:#e5e7eb; border-radius:16px; overflow:hidden; border:1px solid #23262f;">
      <div style="background: linear-gradient(135deg,#dc2626,#7f1d1d); padding: 28px 24px; text-align:center;">
        <div style="color:#fff; font-size:20px; font-weight:800;">You're confirmed, ${escapeHtml(firstName)}! 🎉</div>
        <div style="color:#fecaca; font-size:13px; margin-top:4px;">Official Dance Theory</div>
      </div>
      <div style="padding: 24px;">
        <table style="width:100%; font-size:14px; border-collapse: collapse; margin-bottom: 20px;">
          <tr><td style="color:#9ca3af; padding:6px 0;">Pass</td><td style="text-align:right; font-weight:700; color:#fff;">${escapeHtml(booking.passName)}</td></tr>
          ${booking.classesIncluded ? `<tr><td style="color:#9ca3af; padding:6px 0;">Classes</td><td style="text-align:right; font-weight:700; color:#fff;">${escapeHtml(booking.classesIncluded)}</td></tr>` : ''}
          <tr><td style="color:#9ca3af; padding:6px 0;">Amount Paid</td><td style="text-align:right; font-weight:700; color:#34d399;">$${amount}</td></tr>
          <tr><td style="color:#9ca3af; padding:6px 0;">Ticket ID</td><td style="text-align:right; font-weight:700; color:#fff; font-family:monospace;">${escapeHtml(booking.ticketId)}</td></tr>
        </table>

        <div style="background:#14161c; border:1px solid #23262f; border-radius:12px; padding:16px; margin-bottom:16px;">
          <div style="color:#9ca3af; font-size:11px; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:6px;">Where to go</div>
          <div style="color:#fff; font-size:14px; font-weight:600;">Dance Factory, WestShore Plaza Mall</div>
          <div style="color:#9ca3af; font-size:13px; margin-top:2px;">334 Westshore Plaza A10, Tampa, FL 33609</div>
          <div style="color:#9ca3af; font-size:12px; margin-top:8px;">Free mall parking right outside the main entrance near the studio (A10 suite).</div>
        </div>

        <div style="color:#9ca3af; font-size:13px; line-height:1.5;">
          Show this email or your Ticket ID at check-in. Questions? Just reply to this email — see you on the floor!
        </div>
      </div>
    </div>
  `;

  try {
    await resend.emails.send({
      from: 'Official Dance Theory <tickets@officialdancetheory.com>',
      to: toEmail,
      subject: `You're confirmed! ${booking.passName} — Official Dance Theory`,
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
