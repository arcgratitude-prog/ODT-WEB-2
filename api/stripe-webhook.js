// Stripe calls this endpoint automatically the instant a payment succeeds
// (or fails, or any other event happens). This is the reliable source of
// truth for "did someone actually pay" — unlike relying on the customer's
// browser to report success, which can be closed, crash, or lose
// connection before it tells us anything.
//
// Setup (one-time, in your Stripe Dashboard):
//   1. Go to Developers -> Webhooks -> Add endpoint
//   2. Endpoint URL: https://YOUR-DOMAIN/api/stripe-webhook
//   3. Select event: payment_intent.succeeded
//   4. Stripe will show you a "Signing secret" (starts with whsec_) —
//      copy that into your Vercel environment variables as
//      STRIPE_WEBHOOK_SECRET

import Stripe from 'stripe';
import { ensureBookingsTable, ensureMembersTable, sql } from './_lib/db.js';
import { sendBookingAlertEmail, sendBookingPushNotification, sendCustomerConfirmationEmail } from './_lib/notify.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Vercel needs the raw request body (not JSON-parsed) to verify the
// webhook signature, so we turn off the default body parsing here.
export const config = {
  api: {
    bodyParser: false,
  },
};

function buffer(readable) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readable.on('data', (chunk) => chunks.push(chunk));
    readable.on('end', () => resolve(Buffer.concat(chunks)));
    readable.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  // .trim() guards against a common copy/paste gotcha: an accidental
  // leading/trailing space or newline in the Vercel env var value breaks
  // Stripe's signature verification with a cryptic 400 error, even though
  // the secret "looks" correct. Trimming here fixes it without needing to
  // re-save the Vercel value.
  const webhookSecret = (process.env.STRIPE_WEBHOOK_SECRET || '').trim();

  let event;
  try {
    const rawBody = await buffer(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  if (event.type !== 'payment_intent.succeeded') {
    // We only care about successful payments right now — acknowledge
    // everything else so Stripe doesn't keep retrying it.
    return res.status(200).json({ received: true, ignored: event.type });
  }

  const paymentIntent = event.data.object;
  const metadata = paymentIntent.metadata || {};

  // Quantity comes from checkout metadata (see api/create-payment-intent.js).
  // Clamped defensively in case of a bad/missing value — 1 to 10 covers any
  // realistic group purchase without letting a malformed value create an
  // absurd number of rows.
  const rawQuantity = parseInt(metadata.quantity, 10);
  const quantity = Number.isFinite(rawQuantity) ? Math.min(Math.max(rawQuantity, 1), 10) : 1;

  const baseTicketId = metadata.ticketId || `UB-${paymentIntent.id.slice(-8).toUpperCase()}`;
  const perTicketAmountCents = Math.round(paymentIntent.amount / quantity);

  const commonFields = {
    customerName: metadata.customerName || 'Unknown',
    customerEmail: metadata.customerEmail || 'unknown@example.com',
    customerPhone: metadata.customerPhone || null,
    passName: metadata.passName || paymentIntent.description || 'Unknown Pass',
    passType: metadata.passType || null,
    classesIncluded: metadata.classesIncluded || null,
    referredBy: metadata.referredBy || null,
    stripePaymentIntentId: paymentIntent.id,
  };

  // One booking row per ticket — the 2nd, 3rd, etc. ticket in a
  // multi-ticket order needs its OWN row, its OWN ticket_id, and its OWN
  // QR code so each admission can be scanned and checked in
  // independently. A single shared row/QR for a "2 tickets" purchase
  // would mean only one of the two people could ever actually get in.
  const ticketRows = Array.from({ length: quantity }, (_, i) => {
    const n = i + 1;
    return {
      ...commonFields,
      ticketId: n === 1 ? baseTicketId : `${baseTicketId}-${n}`,
      ticketNumber: n,
      ticketCount: quantity,
      amountCents: perTicketAmountCents,
    };
  });

  let isNewOrder = true;

  try {
    await ensureBookingsTable();

    // Idempotency check happens BEFORE inserting the batch, rather than
    // relying on a single INSERT...ON CONFLICT like a single-ticket order
    // would: with multiple rows sharing one payment_intent_id (see the
    // schema migration in db.js), there's no single unique row to detect
    // a conflict against. Checking first, then inserting the whole batch,
    // keeps a Stripe retry from creating duplicate tickets.
    const existing = await sql`
      SELECT 1 FROM bookings WHERE stripe_payment_intent_id = ${paymentIntent.id} LIMIT 1;
    `;
    isNewOrder = existing.length === 0;

    if (isNewOrder) {
      for (const row of ticketRows) {
        await sql`
          INSERT INTO bookings (
            ticket_id, customer_name, customer_email, customer_phone,
            pass_name, pass_type, amount_cents, classes_included,
            referred_by, stripe_payment_intent_id, ticket_number, ticket_count
          ) VALUES (
            ${row.ticketId}, ${row.customerName}, ${row.customerEmail}, ${row.customerPhone},
            ${row.passName}, ${row.passType}, ${row.amountCents}, ${row.classesIncluded},
            ${row.referredBy}, ${row.stripePaymentIntentId}, ${row.ticketNumber}, ${row.ticketCount}
          )
          ON CONFLICT (ticket_id) DO NOTHING;
        `;
      }
    }
  } catch (err) {
    console.error('Failed to save booking to database:', err);
    // Still alert the admin even though the DB save failed — better a
    // human gets a heads-up than nothing at all. We deliberately do NOT
    // send the customer confirmation here: since we don't know whether
    // this order was actually recorded, sending it now risks a duplicate
    // once the DB save succeeds on a later retry. Return 500 so Stripe
    // retries the save on its next attempt.
    const order = { ...commonFields, ticketIds: ticketRows.map((r) => r.ticketId), quantity, totalAmountCents: paymentIntent.amount, ticketId: baseTicketId };
    await sendBookingAlertEmail(order);
    await sendBookingPushNotification(order);
    return res.status(500).json({ error: 'Database save failed' });
  }

  const order = {
    ...commonFields,
    ticketIds: ticketRows.map((r) => r.ticketId),
    quantity,
    totalAmountCents: paymentIntent.amount,
    ticketId: baseTicketId, // kept for backward-compat fields that expect a single ticketId
  };

  // Membership activation — only for real weekly Tiers (Tier 1/2/3), not
  // drop-ins, not X1 Monthly (a completely separate program that happens
  // to share the same "cycle_4week" passType). Matching on the pass name
  // itself ("Tier 1: ...", "Tier 2: ...") is the reliable way to tell
  // them apart. Fully automatic: always resets to exactly 28 days from
  // *this* successful payment, no manual override, no stacking.
  const isTierPurchase = isNewOrder && /^Tier \d+:/.test(order.passName || '');
  if (isTierPurchase) {
    try {
      await ensureMembersTable();
      const normalizedEmail = (order.customerEmail || '').trim().toLowerCase();
      if (normalizedEmail && normalizedEmail !== 'unknown@example.com') {
        const expiresAt = new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString();
        await sql`
          UPDATE members
          SET membership_expires_at = ${expiresAt},
              last_pass_name = ${order.passName},
              last_ticket_id = ${baseTicketId},
              updated_at = NOW()
          WHERE LOWER(email) = ${normalizedEmail};
        `;
        // If no account exists yet (e.g. the signup call failed/was
        // skipped client-side), we don't silently create one here without
        // a password — that would leave an unusable, password-less
        // account. Log it so it's visible in Vercel's function logs
        // rather than a booking quietly not becoming a membership.
        console.log(`Membership extended to ${expiresAt} for ${normalizedEmail} (or no matching account existed).`);
      }
    } catch (err) {
      // Never let a membership hiccup block the actual booking/notifications
      // that already succeeded — just log it for follow-up.
      console.error('Failed to activate/extend membership:', err);
    }
  }

  if (isNewOrder) {
    // Fire all three notification channels — none of them block each
    // other or the webhook response.
    await Promise.all([
      sendBookingAlertEmail(order),
      sendBookingPushNotification(order),
      sendCustomerConfirmationEmail(order),
    ]);
  } else {
    console.log(`Skipping notifications — order ${paymentIntent.id} was already processed.`);
  }

  res.status(200).json({ received: true });
}
