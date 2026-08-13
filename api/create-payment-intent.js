// This file lives at: api/create-payment-intent.js
// Creates a Stripe "Payment Intent" — the building block needed for a fully
// custom payment UI (as opposed to Stripe's pre-built checkout page).
// The secret key never leaves this server-side file.

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { passName, priceInCents } = req.body;

    if (!passName || typeof priceInCents !== 'number' || priceInCents < 50) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: priceInCents,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      description: passName,
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('Stripe PaymentIntent error:', err);
    res.status(500).json({ error: 'Something went wrong creating payment.' });
  }
}
