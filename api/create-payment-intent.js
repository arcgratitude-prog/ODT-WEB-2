// This file lives at: api/create-payment-intent.js
// Creates a Stripe "Payment Intent" — the building block needed for a fully
// custom payment UI (as opposed to Stripe's pre-built checkout page).
// The secret key never leaves this server-side file.

import Stripe from 'stripe';
import { sql, ensureMembersTable } from './lib/db.js';
import { verifyPassword } from './lib/password.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      passName,
      priceInCents,
      passType,
      customerName,
      customerEmail,
      customerPhone,
      referredBy,
      classesIncluded,
      ticketId,
      quantity,
      memberEmail,
      memberPassword,
      memberSessionToken,
    } = req.body;

    if (!passName || typeof priceInCents !== 'number' || priceInCents < 50) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    // Clamp defensively — matches the same 1–10 range enforced again in
    // the webhook when it actually creates the booking rows, so a bad or
    // tampered client value can't create an absurd number of tickets.
    const rawQty = parseInt(quantity, 10);
    const qty = Number.isFinite(rawQty) ? Math.min(Math.max(rawQty, 1), 10) : 1;

    // Active-member discount: 20% off, but only ever on ONE ticket per
    // order — buying 3 tickets doesn't mean 3 discounts, it means 2 full
    // price + 1 discounted. This entire block ignores whatever the
    // client suggested the price should be; it independently verifies
    // the member against the real database and recomputes the charge
    // from scratch, so nobody can just edit a number in their browser
    // (or hand their login to a friend mid-purchase) to get a discount
    // that wasn't actually earned. Only applies to the two social
    // events — Locura and Invasion — not weekly Tiers/drop-ins.
    //
    // Two ways to prove membership: a password (manual entry at
    // checkout) or a session token (issued at Member Portal login, so
    // someone already logged in gets the discount automatically without
    // re-typing their password — the frontend never stores the password
    // itself for this, only the token).
    let finalPriceInCents = priceInCents;
    let memberDiscountApplied = false;
    const isDiscountEligibleEvent = /Locura|Invasion/i.test(passName);

    if (isDiscountEligibleEvent && memberEmail && (memberPassword || memberSessionToken)) {
      await ensureMembersTable();
      const normalizedMemberEmail = String(memberEmail).trim().toLowerCase();
      const memberRows = await sql`
        SELECT password_hash, password_salt, session_token, membership_expires_at
        FROM members WHERE LOWER(email) = ${normalizedMemberEmail} LIMIT 1;
      `;
      if (memberRows.length > 0) {
        const isVerified = memberSessionToken
          ? memberSessionToken === memberRows[0].session_token
          : await verifyPassword(memberPassword, memberRows[0].password_hash, memberRows[0].password_salt);
        const isActiveMember = new Date(memberRows[0].membership_expires_at) > new Date();
        if (isVerified && isActiveMember) {
          // Recompute from the pass's real per-ticket price rather than
          // trusting any client math — priceInCents here is expected to
          // be the FULL undiscounted total (base price × qty).
          const perTicketCents = Math.round(priceInCents / qty);
          const discountedFirstTicket = Math.round(perTicketCents * 0.8);
          finalPriceInCents = discountedFirstTicket + perTicketCents * (qty - 1);
          memberDiscountApplied = true;
        }
        // Wrong password/token or expired membership: silently fall back
        // to full price rather than erroring out the whole checkout —
        // the customer still gets to complete their purchase, just
        // without the discount they didn't actually qualify for.
      }
    }

    // Look up or create a Stripe Customer so the buyer's name/email shows
    // front-and-center in the Stripe Dashboard (payment list + detail view),
    // not just buried in metadata. Search by email first so repeat buyers
    // don't create duplicate customer records.
    let customerId;
    if (customerEmail && customerEmail !== 'N/A') {
      const existing = await stripe.customers.list({ email: customerEmail, limit: 1 });
      if (existing.data.length > 0) {
        customerId = existing.data[0].id;
        // Keep the name/phone on file current in case they changed it.
        await stripe.customers.update(customerId, {
          name: customerName || undefined,
          phone: customerPhone || undefined,
        });
      } else {
        const created = await stripe.customers.create({
          name: customerName || undefined,
          email: customerEmail,
          phone: customerPhone || undefined,
        });
        customerId = created.id;
      }
    }

    // Shortens verbose pass names for the Stripe payment description —
    // "Bachata Locura Social Pass" reads better as just "Bachata Locura",
    // and "Tier 2: Grindin'" as just "Tier 2", when it's sitting next to
    // the customer's name in a payment list. The full name is still kept
    // everywhere else (metadata, database, emails) — this only affects
    // what's readable at a glance in the Stripe Dashboard.
    const shortPassName = (passName || '')
      .replace(/^(Tier \d+):.*$/, '$1')
      .replace(/\s+Social Pass$/i, '');

    // The description is what shows front-and-center in the Stripe
    // Dashboard's payment list — pass name first, then customer, so a
    // glance at the list reads "what" before "who".
    const description = customerName
      ? `${shortPassName} - ${customerName}${qty > 1 ? ` x${qty}` : ''}`
      : `${shortPassName}${qty > 1 ? ` x${qty}` : ''}`;

    // These ride along on the PaymentIntent as metadata so the webhook
    // (api/stripe-webhook.js) can read them back once payment succeeds —
    // Stripe is the source of truth here, not the customer's browser.
    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalPriceInCents,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      description: memberDiscountApplied ? `${description} (Member Discount)` : description,
      ...(customerId ? { customer: customerId } : {}),
      metadata: {
        passName,
        passType: passType || '',
        customerName: customerName || '',
        customerEmail: customerEmail || '',
        customerPhone: customerPhone || '',
        referredBy: referredBy || '',
        classesIncluded: classesIncluded || '',
        ticketId: ticketId || '',
        quantity: String(qty),
        memberDiscountApplied: memberDiscountApplied ? 'true' : 'false',
      },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret, memberDiscountApplied });
  } catch (err) {
    console.error('Stripe PaymentIntent error:', err);
    res.status(500).json({ error: 'Something went wrong creating payment.' });
  }
}
