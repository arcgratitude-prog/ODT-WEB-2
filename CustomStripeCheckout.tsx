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
    className={`relative w-full text-left p-3.5 rounded-xl transition-all duration-200 flex items-center justify-between overflow-hidden ${
      isSelected
        ? 'bg-white/10 border-2 border-[#ff2a4b] shadow-[0_0_20px_rgba(255,42,75,0.4),inset_0_0_15px_rgba(255,42,75,0.15)] p-[13px]'
        : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20'
    }`}
  >
    <div className="flex items-center space-x-3.5 z-10">
      {icon}
      <div className="font-mono text-xs font-bold uppercase tracking-wider text-white">
        {title}
      </div>
    </div>
    <div className="z-10">
      {isSelected ? (
        <div className="w-5 h-5 rounded-full bg-[#ff2a4b] text-white flex items-center justify-center shadow-[0_0_10px_rgba(255,42,75,0.9)] border border-white/60">
          <Check className="w-3 h-3 stroke-[3]" />
        </div>
      ) : (
        <div className="w-4 h-4 rounded-full border border-white/20" />
      )}
    </div>
  </button>
);

const cardElementOptions = {
  style: {
    base: {
      fontSize: '13px',
      fontFamily: 'ui-monospace, monospace',
      color: '#ffffff',
      letterSpacing: '0.02em',
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

  useEffect(() => {
    if (!stripe) return;

    const pr = stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: { label: passName, amount: Math.round(priceInDollars * 100) },
      requestPayerName: false,
      requestPayerEmail: false,
    });

    pr.canMakePayment().then((result) => {
      if (result) {
        setWalletLabel(result.applePay ? 'Apple Pay' : 'Google Pay');
        setSelected('wallet');
        setPaymentRequest(pr);
      }
    });

    pr.on('paymentmethod', async (ev) => {
      setIsProcessing(true);
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
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
        const { error: actionError } = await stripe.confirmCardPayment(clientSecret);
        if (actionError) {
          setErrorMsg(actionError.message || 'Payment failed.');
          setIsProcessing(false);
          return;
        }
      }

      handleSuccess();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stripe]);

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
      {/* Glassy neon card — pulled from the reference bg-glass-card style */}
      <div
        className="rounded-2xl overflow-hidden border border-[#ff2a4b]/25"
        style={{
          background: 'linear-gradient(135deg, rgba(30,18,24,0.65) 0%, rgba(15,15,20,0.75) 100%)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0 0 35px rgba(255,42,75,0.15), 0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-white/10">
          <div className="text-2xl font-black text-white font-mono [text-shadow:0_0_12px_rgba(255,255,255,0.5)]">
            ${priceInDollars.toFixed(2)}
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">
            {passName}
          </div>
        </div>

        {/* Payment method rows */}
        <div className="p-5 space-y-2.5">
          {walletLabel && (
            <MethodRow
              isSelected={selected === 'wallet'}
              onSelect={() => setSelected('wallet')}
              title={walletLabel}
              icon={
                <div className="flex items-center justify-center px-2.5 py-1 rounded-md bg-white text-black font-semibold text-xs">
                  {walletLabel}
                </div>
              }
            />
          )}

          <MethodRow
            isSelected={selected === 'card'}
            onSelect={() => setSelected('card')}
            title="Card"
            icon={
              <div className="flex items-center justify-center w-9 h-7 rounded-md bg-[#251820] text-[#ff4d6d] border border-[#ff2a4b]/30">
                <CreditCard className="w-4 h-4" />
              </div>
            }
          />

          {/* Secure card field — Stripe's real secure iframe, styled to blend
              into the glassy design; card numbers never touch your own code. */}
          <div
            className={`transition-all duration-200 ${
              selected === 'card' ? 'opacity-100 max-h-24 mt-1' : 'opacity-0 max-h-0 overflow-hidden'
            }`}
          >
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <CardElement options={cardElementOptions} />
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="mx-5 mb-4 px-3 py-2 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-300">
            {errorMsg}
          </div>
        )}

        {/* Pay Now — glassy neon glow on hover */}
        <div className="px-5 pb-5">
          <button
            onClick={handlePayNow}
            disabled={!stripe || isProcessing}
            className="w-full py-4 rounded-2xl border border-[#ff2a4b]/60 bg-[#ff2a4b]/5 hover:bg-[#ff2a4b]/15 hover:shadow-[0_0_25px_rgba(255,42,75,0.35)] text-[#ff6b85] font-black text-sm uppercase tracking-[0.2em] transition-all disabled:opacity-40 flex items-center justify-center gap-2"
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

          <div className="flex items-center justify-center gap-1.5 mt-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            <ShieldCheck className="w-3 h-3" />
            <span>Secured by Stripe · SSL Encrypted</span>
          </div>
        </div>
      </div>

      {/* Processing overlay */}
      {isProcessing && (
        <div className="absolute inset-0 rounded-2xl bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-20">
          <Loader2 className="w-8 h-8 text-[#ff2a4b] animate-spin" />
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#ff6b85]">
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
}) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        passName,
        priceInCents: Math.round(priceInDollars * 100),
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
  }, [passName, priceInDollars]);

  if (loadError) {
    return <div className="text-center py-8 text-sm text-red-400">{loadError}</div>;
  }

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-[#ff2a4b] animate-spin" />
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
