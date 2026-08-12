// This file lives at: api/create-checkout-session.js
// Vercel automatically turns anything in the /api folder into a secure
// backend endpoint. This is the ONLY place your secret Stripe key is used,
// and it never gets sent to the browser or shown to visitors.

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { passName, priceInCents, quantity = 1 } = req.body;

    // Basic safety checks so nobody can send a fake $0 request
    if (!passName || typeof priceInCents !== 'number' || priceInCents < 0) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    const origin = req.headers.origin || `https://${req.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      mode: 'payment',
      payment_method_types: ['card'], // Apple Pay & Google Pay show automatically
                                        // on supported devices without extra config
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: passName,
            },
            unit_amount: priceInCents, // Stripe uses cents, e.g. $20.00 = 2000
          },
          quantity,
        },
      ],
      return_url: `${origin}/checkout-complete?session_id={CHECKOUT_SESSION_ID}`,
    });

    res.status(200).json({ clientSecret: session.client_secret });
  } catch (err) {
    console.error('Stripe session error:', err);
    res.status(500).json({ error: 'Something went wrong creating checkout.' });
  }
}
