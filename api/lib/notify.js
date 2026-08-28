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
      from: 'AI Urbano Bookings <onboarding@resend.dev>',
      to: adminEmails,
      subject: `New booking: ${booking.customerName} — $${amount} (${booking.passName})`,
      html,
    });
  } catch (err) {
    // Never let an email failure break the booking flow — just log it.
    console.error('Failed to send booking alert email:', err);
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
