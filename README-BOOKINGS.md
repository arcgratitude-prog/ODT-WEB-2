# Booking Alerts & Check-In — Setup Guide

This adds three things to your site:
1. Every paid booking is saved permanently in a real database (not just the customer's browser).
2. You get an email the instant someone books, with their name, what they bought, and how much they paid.
3. A private staff page at `yoursite.com/?admin=checkin` where you can see everyone booked and tap their name to check them in.

None of this works yet until you finish the steps below — they're all done in Vercel's website (no coding), and should take about 10 minutes total.

## Step 1 — Add your environment variables in Vercel

Go to your project in vercel.com → **Settings** → **Environment Variables**, and add each of these:

| Name | Value |
|---|---|
| `DATABASE_URL` | Your Neon connection string (the one starting with `postgresql://...` — use the "pooled" one) |
| `RESEND_API_KEY` | Your Resend API key (starts with `re_`) |
| `ADMIN_NOTIFY_EMAILS` | The email(s) that should get booking alerts, e.g. `arcgratitude@gmail.com` (comma-separate if more than one) |
| `ADMIN_PASSWORD` | A password you make up — this protects the staff check-in page. Pick something only staff know. |
| `NTFY_TOPIC` | *(Optional)* If you set up the ntfy.sh phone app, put your topic name here for instant phone alerts. Leave blank/skip if not using this yet. |

After adding these, **redeploy** the site once (Vercel does this automatically on your next push, so you don't need to do anything extra here — just make sure you run the push script after this step).

## Step 2 — Connect the Stripe webhook

This is the piece that tells your site "a payment just succeeded" the instant it happens.

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com) → **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Endpoint URL: `https://YOUR-LIVE-DOMAIN/api/stripe-webhook` (replace with your actual domain, e.g. `https://odt2.vercel.app/api/stripe-webhook`)
4. Under "Select events," choose **payment_intent.succeeded**
5. Click **Add endpoint**
6. Stripe will show you a **Signing secret** starting with `whsec_` — copy it
7. Go back to Vercel → Environment Variables and add one more:

| Name | Value |
|---|---|
| `STRIPE_WEBHOOK_SECRET` | The `whsec_...` value from Stripe |

Redeploy again after adding this (same as Step 1 — just push once more).

## Step 3 — Test it

1. Book yourself a class through the live site with a real card (or Stripe's test mode if you have that on)
2. Check that you get the email alert within a few seconds
3. Go to `yoursite.com/?admin=checkin`, enter your `ADMIN_PASSWORD`, and confirm your test booking shows up
4. Tap "Check In" next to it and confirm it turns green

## What changed in the code

- Paid checkout now asks for name + email before payment (previously it skipped straight to payment and never captured this for card payments)
- `api/create-payment-intent.js` now attaches booking details to the Stripe payment as "metadata"
- `api/stripe-webhook.js` — new. Stripe calls this the instant payment succeeds; it saves the booking to your database and sends the alert email (and phone push, if `NTFY_TOPIC` is set)
- `api/admin-bookings.js` — new. Powers the check-in page: lists bookings, lets staff mark someone checked in
- `src/components/AdminCheckIn.tsx` — new. The private check-in page itself

## Not built yet (let me know if you want these next)

- QR code scanning at the door (right now check-in is name-search + tap, which works great on a phone, but no camera scanning yet)
- Text message alerts (only email + optional ntfy.sh push right now)
- Multiple admin passwords / staff accounts (currently one shared password for everyone)
