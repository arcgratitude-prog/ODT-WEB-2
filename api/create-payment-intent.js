// This file lives at: api/create-payment-intent.js
// Creates a Stripe "Payment Intent" — the building block needed for a fully
// custom payment UI (as opposed to Stripe's pre-built checkout page).
// The secret key never leaves this server-side file.

import Stripe from 'stripe';
import { sql, ensureMembersTable, ensureBookingsTable } from './_lib/db.js';
import { verifyPassword } from './_lib/password.js';
import { getRealPriceInCents } from './_lib/priceCatalog.js';
import { getDiscountEventKey } from './_lib/discountEvents.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      passName,
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

    if (!passName) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    // The real per-ticket price, looked up server-side from a catalog
    // this file owns — never taken from the request body. A previous
    // version of this endpoint trusted a client-submitted price number
    // (with only a 50-cent floor check), which meant anyone editing the
    // network request in dev tools could pay whatever they wanted for
    // any pass. That vulnerability is now closed: the client no longer
    // gets any say in the base price at all.
    const realPricePerTicketCents = getRealPriceInCents(passName);
    if (realPricePerTicketCents === null) {
      return res.status(400).json({ error: 'Unrecognized pass — cannot determine price.' });
    }

    // Clamp defensively — matches the same 1–10 range enforced again in
    // the webhook when it actually creates the booking rows, so a bad or
    // tampered client value can't create an absurd number of tickets.
    const rawQty = parseInt(quantity, 10);
    const qty = Number.isFinite(rawQty) ? Math.min(Math.max(rawQty, 1), 10) : 1;

    const realTotalInCents = realPricePerTicketCents * qty;

    // Active-member discount: 20% off, but only ever on ONE ticket per
    // order — buying 3 tickets doesn't mean 3 discounts, it means 2 full
    // price + 1 discounted. This independently verifies the member
    // against the real database and recomputes the charge from scratch,
    // so nobody can just edit a number in their browser (or hand their
    // login to a friend mid-purchase) to get a discount that wasn't
    // actually earned. Applies to the three ticketed Locura-weekend
    // events — Invasion, Locura, and Boot Camp — not weekly Tiers/
    // drop-ins.
    //
    // Also only ever ONE discount per member PER EVENT — checked against
    // real past bookings below, not just trusted per-order. Without this,
    // someone could split one visit into several separate small orders
    // and get the discount again on each one; "one ticket per order" on
    // its own doesn't stop that. See api/_lib/discountEvents.js for how
    // "this event" is identified.
    //
    // Two ways to prove membership: a password (manual entry at
    // checkout) or a session token (issued at Member Portal login, so
    // someone already logged in gets the discount automatically without
    // re-typing their password — the frontend never stores the password
    // itself for this, only the token).
    let finalPriceInCents = realTotalInCents;
    let memberDiscountApplied = false;
    // Set only when membership/credentials check out but the discount is
    // still being withheld — lets the frontend show an accurate reason
    // ("already used" vs "wrong password") instead of one generic
    // message for every case.
    let discountDeniedReason = null;
    const isDiscountEligibleEvent = /Locura|Invasion|Boot Camp/i.test(passName);
    const discountEventKey = getDiscountEventKey(passName);

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
          let alreadyUsedForThisEvent = false;
          if (discountEventKey) {
            await ensureBookingsTable();
            const priorDiscountedBooking = await sql`
              SELECT 1 FROM bookings
              WHERE LOWER(customer_email) = ${normalizedMemberEmail}
                AND discount_event_key = ${discountEventKey}
              LIMIT 1;
            `;
            alreadyUsedForThisEvent = priorDiscountedBooking.length > 0;
          }
          if (alreadyUsedForThisEvent) {
            discountDeniedReason = 'already_used';
          } else {
            // Recompute from the REAL per-ticket price (never the client's).
            const discountedFirstTicket = Math.round(realPricePerTicketCents * 0.8);
            finalPriceInCents = discountedFirstTicket + realPricePerTicketCents * (qty - 1);
            memberDiscountApplied = true;
          }
        } else {
          discountDeniedReason = 'invalid_credentials';
        }
        // Wrong password/token or expired membership: silently fall back
        // to full price rather than erroring out the whole checkout —
        // the customer still gets to complete their purchase, just
        // without the discount they didn't actually qualify for.
      } else {
        discountDeniedReason = 'invalid_credentials';
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
        // Only set when a discount was actually granted — this is what
        // the webhook stamps onto the discounted ticket's booking row,
        // and what the next purchase attempt checks against.
        discountEventKey: memberDiscountApplied && discountEventKey ? discountEventKey : '',
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      memberDiscountApplied,
      // The REAL total being charged, in cents — this is what Stripe is
      // actually about to bill. Previously only `memberDiscountApplied`
      // (true/false) came back, and the frontend kept showing its own
      // client-computed, always-undiscounted price everywhere a dollar
      // amount appeared (the checkout card's big price, and the Apple/
      // Google Pay wallet sheet total). The charge itself was always
      // correct — this was a display-only bug — but it meant a member
      // could see "✓ Member discount applied" and then, right below it,
      // a price that never actually changed. Sending the real number
      // back lets the frontend show what's actually being charged.
      finalPriceInCents,
      // Why the discount wasn't applied, when it wasn't — 'already_used'
      // or 'invalid_credentials' — so the frontend can show an accurate
      // reason instead of one generic message for every case. Null when
      // the discount was applied, or wasn't attempted at all.
      discountDeniedReason,
    });
  } catch (err) {
    console.error('Stripe PaymentIntent error:', err);
    res.status(500).json({ error: 'Something went wrong creating payment.' });
  }
}
