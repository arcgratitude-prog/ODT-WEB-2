import React, { useCallback, useMemo } from 'react';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Publishable key is safe to be public — it only allows creating charges,
// never reading account data.
const stripePromise = loadStripe(
  'pk_live_51TVgyc0sK2OeDNeTeiLZtSPCT1Esrjakl3wdToEdsYVEdWt2v5USe0cuaZ3fhkZhFiQoJcL5PTmLUaEp9SezW73O00st5xAx2M'
);

interface StripeEmbeddedCheckoutProps {
  passName: string;
  priceInDollars: number;
}

export const StripeEmbeddedCheckoutBox: React.FC<StripeEmbeddedCheckoutProps> = ({
  passName,
  priceInDollars,
}) => {
  const fetchClientSecret = useCallback(async () => {
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        passName,
        priceInCents: Math.round(priceInDollars * 100),
      }),
    });
    const data = await res.json();
    if (!data.clientSecret) {
      throw new Error(data.error || 'Failed to start checkout');
    }
    return data.clientSecret;
  }, [passName, priceInDollars]);

  const options = useMemo(() => ({ fetchClientSecret }), [fetchClientSecret]);

  return (
    <div className="rounded-2xl overflow-hidden border border-white/15 bg-white">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};
