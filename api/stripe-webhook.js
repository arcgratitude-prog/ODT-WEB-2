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
import { ensureBookingsTable, sql } from './lib/db.js';
import { sendBookingAlertEmail, sendBookingPushNotification } from './lib/notify.js';

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
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

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

  const booking = {
    ticketId: metadata.ticketId || `UB-${paymentIntent.id.slice(-8).toUpperCase()}`,
    customerName: metadata.customerName || 'Unknown',
    customerEmail: metadata.customerEmail || 'unknown@example.com',
    customerPhone: metadata.customerPhone || null,
    passName: metadata.passName || paymentIntent.description || 'Unknown Pass',
    passType: metadata.passType || null,
    amountCents: paymentIntent.amount,
    classesIncluded: metadata.classesIncluded || null,
    stripePaymentIntentId: paymentIntent.id,
  };

  try {
    await ensureBookingsTable();

    await sql`
      INSERT INTO bookings (
        ticket_id, customer_name, customer_email, customer_phone,
        pass_name, pass_type, amount_cents, classes_included,
        stripe_payment_intent_id
      ) VALUES (
        ${booking.ticketId}, ${booking.customerName}, ${booking.customerEmail}, ${booking.customerPhone},
        ${booking.passName}, ${booking.passType}, ${booking.amountCents}, ${booking.classesIncluded},
        ${booking.stripePaymentIntentId}
      )
      ON CONFLICT (stripe_payment_intent_id) DO NOTHING;
    `;
  } catch (err) {
    console.error('Failed to save booking to database:', err);
    // Still try to send the alert even if the DB save failed — better an
    // admin gets a heads-up than nothing at all. Return 500 so Stripe
    // retries the DB save on its next attempt.
    await sendBookingAlertEmail(booking);
    await sendBookingPushNotification(booking);
    return res.status(500).json({ error: 'Database save failed' });
  }

  // Fire both notification channels — neither one blocks the other or
  // the webhook response.
  await Promise.all([
    sendBookingAlertEmail(booking),
    sendBookingPushNotification(booking),
  ]);

  res.status(200).json({ received: true });
}
