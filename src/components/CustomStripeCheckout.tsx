import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe, PaymentRequest, type StripeCardElement } from '@stripe/stripe-js';
import { Check, CreditCard, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';

const stripePromise = loadStripe(
  'pk_live_51TVgyc0sK2OeDNeTeiLZtSPCT1Esrjakl3wdToEdsYVEdWt2v5USe0cuaZ3fhkZhFiQoJcL5PTmLUaEp9SezW73O00st5xAx2M'
);

interface CustomStripeCheckoutProps {
  passName: string;
  priceInDollars: number;
  onSuccess: () => void;
  // Booking metadata — rides along on the Stripe PaymentIntent so the
  // webhook (api/stripe-webhook.js) can save a real booking record and
  // notify admins with the actual customer's info, not a placeholder.
  passType?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  classesIncluded?: string;
  ticketId?: string;
}

type SelectableMethod = 'wallet' | 'card';

// ---- Payment method row — glassy, neon-glow selected state ----
const MethodRow: React.FC<{
  isSelected: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  title: string;
}> = ({ isSelected, onSelect, icon, title }) => (
  <button
    type="button"
    onClick={onSelect}
    className={`relative w-full text-left p-4 rounded-2xl transition-all duration-200 flex items-center justify-between ${
      isSelected
        ? 'bg-white/[0.06] border border-sky-400/50'
        : 'bg-white/[0.03] hover:bg-white/[0.05] border border-white/10'
    }`}
  >
    <div className="flex items-center space-x-3">
      {icon}
      <div className="text-sm font-semibold text-white">
        {title}
      </div>
    </div>
    {isSelected && (
      <Check className="w-4 h-4 text-sky-400 stroke-[3]" />
    )}
  </button>
);

const cardElementOptions = {
  style: {
    base: {
      fontSize: '13px',
      fontFamily: 'inherit',
      color: '#ffffff',
      letterSpacing: '0.01em',
      '::placeholder': { color: 'rgba(255,255,255,0.35)' },
    },
    invalid: { color: '#f87171' },
  },
};

// ---- Inner form (needs Elements context) ----
const InnerCheckoutForm: React.FC<{
  passName: string;
  priceInDollars: number;
  clientSecret: string;
  onSuccess: () => void;
}> = ({ passName, priceInDollars, clientSecret, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [selected, setSelected] = useState<SelectableMethod>('card');
  const [walletLabel, setWalletLabel] = useState<'Apple Pay' | 'Google Pay' | null>(null);
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const successFired = useRef(false);

  // Always let the async wallet callback read the *latest* PaymentIntent secret,
  // not the one captured the moment the handler was first attached. Otherwise a
  // price change (which mints a new intent) leaves the wallet confirming the old
  // one — the card path would charge correctly while Apple/Google Pay lags behind.
  const clientSecretRef = useRef(clientSecret);
  useEffect(() => {
    clientSecretRef.current = clientSecret;
  }, [clientSecret]);

  // Hold the live PaymentRequest so a separate effect can keep its amount in sync.
  const paymentRequestRef = useRef<PaymentRequest | null>(null);

  useEffect(() => {
    if (!stripe) return;

    const pr = stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: { label: passName, amount: Math.round(priceInDollars * 100) },
      requestPayerName: true,
      requestPayerEmail: true,
    });
    paymentRequestRef.current = pr;

    let active = true;
    pr.canMakePayment().then((result) => {
      if (!active) return;
      if (result) {
        setWalletLabel(result.applePay ? 'Apple Pay' : 'Google Pay');
        setSelected('wallet');
        setPaymentRequest(pr);
      }
    });

    pr.on('paymentmethod', async (ev) => {
      setIsProcessing(true);
      // Read the current secret at confirm time so the amount shown in the wallet
      // sheet and the amount actually charged both come from the same live intent.
      const secret = clientSecretRef.current;
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        secret,
        { payment_method: ev.paymentMethod.id },
        { handleActions: false }
      );

      if (error) {
        ev.complete('fail');
        setErrorMsg(error.message || 'Payment failed.');
        setIsProcessing(false);
        return;
      }

      ev.complete('success');

      if (paymentIntent?.status === 'requires_action') {
        const { error: actionError } = await stripe.confirmCardPayment(secret);
        if (actionError) {
          setErrorMsg(actionError.message || 'Payment failed.');
          setIsProcessing(false);
          return;
        }
      }

      handleSuccess();
    });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stripe]);

  // Keep the Apple Pay / Google Pay sheet showing the CURRENT price + label.
  // Without this the wallet total stays frozen at whatever it was when the
  // PaymentRequest was first created, even though the charge uses the live intent.
  useEffect(() => {
    if (!paymentRequestRef.current) return;
    paymentRequestRef.current.update({
      total: { label: passName, amount: Math.round(priceInDollars * 100) },
    });
  }, [passName, priceInDollars]);

  const handleSuccess = useCallback(() => {
    if (successFired.current) return;
    successFired.current = true;
    setIsProcessing(false);
    setIsSuccess(true);
  }, []);

  const handlePayNow = async () => {
    if (!stripe || !elements) return;
    setErrorMsg(null);

    if (selected === 'wallet' && paymentRequest) {
      paymentRequest.show();
      return;
    }

    // getElement(CardElement) returns the card element at runtime; the installed
    // Stripe typings infer a broader element union, so we narrow it explicitly.
    const cardElement = elements.getElement(CardElement) as unknown as StripeCardElement | null;
    if (!cardElement) return;

    setIsProcessing(true);
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    });

    if (error) {
      setErrorMsg(error.message || 'Payment failed. Please try again.');
      setIsProcessing(false);
      return;
    }

    if (paymentIntent?.status === 'succeeded') {
      handleSuccess();
    } else {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-10 px-4 space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.35)]">
          <CheckCircle2 className="w-9 h-9 text-emerald-400" />
        </div>
        <div>
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
            Payment Confirmed
          </div>
          <div className="text-lg font-black text-white uppercase mt-1 [text-shadow:0_0_10px_rgba(255,255,255,0.5)]">
            {passName}
          </div>
        </div>
        <button
          onClick={onSuccess}
          className="w-full py-3.5 rounded-2xl border border-emerald-500/50 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-black text-xs uppercase tracking-[0.2em] transition-all"
        >
          View My Ticket
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto relative">
      {/* Minimal dark checkout card */}
      <div
        className="rounded-3xl overflow-hidden border border-white/10"
        style={{
          background: '#0b0d12',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-5">
          <div className="text-3xl font-bold text-white">
            ${priceInDollars.toFixed(2)}
          </div>
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 mt-1">
            {passName}
          </div>
        </div>

        {/* Payment method rows — wallet (Apple/Google Pay) first, card second */}
        <div className="px-6 pb-6 space-y-3">
          {walletLabel && (
            <MethodRow
              isSelected={selected === 'wallet'}
              onSelect={() => setSelected('wallet')}
              title={walletLabel}
              icon={
                <div className="flex items-center justify-center w-9 h-7 rounded-md bg-black text-white">
                  {walletLabel === 'Apple Pay' ? (
                    <span className="text-sm"></span>
                  ) : (
                    <span className="text-[10px] font-bold">G Pay</span>
                  )}
                </div>
              }
            />
          )}

          <MethodRow
            isSelected={selected === 'card'}
            onSelect={() => setSelected('card')}
            title="Card"
            icon={
              <div className="flex items-center justify-center w-9 h-7 rounded-md bg-white/10 text-slate-300">
                <CreditCard className="w-4 h-4" />
              </div>
            }
          />

          {/* Secure card field — Stripe's real secure iframe, styled to blend
              into the minimal design; card numbers never touch your own code. */}
          <div
            className={`transition-all duration-200 ${
              selected === 'card' ? 'opacity-100 max-h-24 mt-1' : 'opacity-0 max-h-0 overflow-hidden'
            }`}
          >
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <CardElement options={cardElementOptions} />
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="mx-6 mb-5 px-3 py-2 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-300">
            {errorMsg}
          </div>
        )}

        {/* Pay Now — minimal outlined button */}
        <div className="px-6 pb-6">
          <button
            onClick={handlePayNow}
            disabled={!stripe || isProcessing}
            className="w-full py-4 rounded-2xl border border-sky-400/50 bg-sky-400/5 hover:bg-sky-400/10 text-sky-300 font-bold text-sm uppercase tracking-[0.15em] transition-all disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>Pay Now</span>
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 mt-4 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            <ShieldCheck className="w-3 h-3" />
            <span>Secured by Stripe · SSL Encrypted</span>
          </div>
        </div>
      </div>

      {/* Processing overlay */}
      {isProcessing && (
        <div className="absolute inset-0 rounded-3xl bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-20">
          <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-sky-300">
            Confirming Payment...
          </span>
        </div>
      )}
    </div>
  );
};

export const CustomStripeCheckout: React.FC<CustomStripeCheckoutProps> = ({
  passName,
  priceInDollars,
  onSuccess,
  passType,
  customerName,
  customerEmail,
  customerPhone,
  classesIncluded,
  ticketId,
}) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    // Drop the previous intent immediately so the form falls back to its loader
    // instead of briefly showing the new price against the old PaymentIntent
    // (which is locked to the old amount server-side).
    setClientSecret(null);
    setLoadError(null);

    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        passName,
        priceInCents: Math.round(priceInDollars * 100),
        passType,
        customerName,
        customerEmail,
        customerPhone,
        classesIncluded,
        ticketId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setLoadError(data.error || 'Could not start checkout.');
        }
      })
      .catch(() => {
        if (!cancelled) setLoadError('Could not reach payment server.');
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passName, priceInDollars, customerName, customerEmail, customerPhone]);

  if (loadError) {
    return <div className="text-center py-8 text-sm text-red-400">{loadError}</div>;
  }

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-sky-400 animate-spin" />
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <InnerCheckoutForm
        passName={passName}
        priceInDollars={priceInDollars}
        clientSecret={clientSecret}
        onSuccess={onSuccess}
      />
    </Elements>
  );
};
