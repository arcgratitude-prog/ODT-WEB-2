import React, { useState, useEffect } from 'react';
import { X, Sparkles, CheckCircle2, Calendar, MapPin, Download, QrCode, Ticket, ShieldCheck, User, Mail, Phone, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PASS_OPTIONS, SOCIAL_PASS_OPTION, BACHATA_INVASION_PASS_OPTION, STUDIO_INFO } from '../data/danceData';
import { TicketPass, CheckoutTheme } from '../types';
import { CustomStripeCheckout } from './CustomStripeCheckout';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPassTypeId?: string;
  initialClassTimes?: string[];
  initialQuantity?: number;
  onPassCreated: (pass: TicketPass) => void;
}

// Checkout theme — matches whatever section the customer is booking from,
// instead of always showing the same red. Weekly classes/tiers/drop-ins
// keep the site's red accent; the two social events get their own colors.
// What to show for "classes included" when the customer didn't pick
// specific class times (only tiers requiring 1-2 picks collect those —
// see TRACK_PICK_COUNTS in PricingSection.tsx). A bare "12 Class
// Session(s)" reads like a countdown rather than what it actually is:
// full, unlimited access to every class each week. Only the Unlimited
// tier and any pass explicitly needing no picks gets this framing —
// specific drop-in counts (e.g. "3 Class Session(s)") still make sense
// as a literal count since those really are a fixed number of visits.
const getClassesIncludedLabel = (passOption: { id: string; classesCount: number }, classTimes: string[]): string => {
  if (classTimes.length > 0) return classTimes.join(', ');
  if (passOption.id === 'track-unlimited') return 'All Classes Included — Full Weekly Access';
  return `${passOption.classesCount} Class Session(s)`;
};

const getCheckoutTheme = (passId: string): CheckoutTheme => {
  if (passId.startsWith('social-invasion')) return 'fuchsia'; // Bachata Invasion
  if (passId.startsWith('social-presale')) return 'silver'; // Bachata Locura
  return 'red'; // weekly tiers, drop-ins, open house, 4-week cycle
};

const THEME_CLASSES: Record<CheckoutTheme, {
  badgeBorder: string;
  badgeText: string;
  cardBorder: string;
  chipBg: string;
  chipText: string;
  chipBorder: string;
  priceText: string;
  focusBorder: string;
  btnShadow: string;
  btnGradient: string;
  btnBorder: string;
  ticketBorder: string;
  ticketAccent: string;
}> = {
  red: {
    badgeBorder: 'border-red-500/30',
    badgeText: 'text-red-400',
    cardBorder: 'border-red-500/40',
    chipBg: 'bg-red-500/20',
    chipText: 'text-red-400',
    chipBorder: 'border-red-500/30',
    priceText: 'text-red-400',
    focusBorder: 'focus:border-red-500',
    btnShadow: 'shadow-red-600/40',
    btnGradient: 'bg-gradient-to-br from-red-600 to-slate-950 hover:from-red-500 hover:to-slate-900',
    btnBorder: 'border-red-300/50',
    ticketBorder: 'border-red-500/40',
    ticketAccent: 'text-red-400',
  },
  fuchsia: {
    badgeBorder: 'border-fuchsia-500/40',
    badgeText: 'text-fuchsia-400',
    cardBorder: 'border-fuchsia-500/40',
    chipBg: 'bg-fuchsia-500/20',
    chipText: 'text-fuchsia-300',
    chipBorder: 'border-fuchsia-500/30',
    priceText: 'text-fuchsia-400',
    focusBorder: 'focus:border-fuchsia-500',
    btnShadow: 'shadow-fuchsia-600/40',
    btnGradient: 'bg-gradient-to-br from-fuchsia-600 to-purple-950 hover:from-fuchsia-500 hover:to-purple-900',
    btnBorder: 'border-fuchsia-300/50',
    ticketBorder: 'border-fuchsia-500/40',
    ticketAccent: 'text-fuchsia-400',
  },
  silver: {
    badgeBorder: 'border-slate-300/40',
    badgeText: 'text-slate-200',
    cardBorder: 'border-slate-300/40',
    chipBg: 'bg-slate-300/20',
    chipText: 'text-slate-200',
    chipBorder: 'border-slate-300/30',
    priceText: 'text-slate-100',
    focusBorder: 'focus:border-slate-300',
    btnShadow: 'shadow-slate-400/30',
    btnGradient: 'bg-gradient-to-br from-slate-400 to-slate-950 hover:from-slate-300 hover:to-slate-900',
    btnBorder: 'border-slate-200/60',
    ticketBorder: 'border-slate-300/40',
    ticketAccent: 'text-slate-200',
  },
};

export const TicketModal: React.FC<TicketModalProps> = ({
  isOpen,
  onClose,
  initialPassTypeId = 'dropin-1',
  initialClassTimes = [],
  initialQuantity = 1,
  onPassCreated
}) => {
  const [selectedPassId, setSelectedPassId] = useState<string>(initialPassTypeId);
  const [quantity, setQuantity] = useState<number>(Math.max(1, initialQuantity));
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedPass, setGeneratedPass] = useState<TicketPass | null>(null);
  // Paid passes need a name + email up front too — Stripe alone doesn't
  // guarantee we get this from a card payment, only from wallet payments.
  const [contactConfirmed, setContactConfirmed] = useState(false);
  const ticketIdRef = React.useRef(`UB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);

  useEffect(() => {
    if (initialPassTypeId) {
      setSelectedPassId(initialPassTypeId);
      setGeneratedPass(null);
    }
  }, [initialPassTypeId]);

  // Reset the contact form each time the modal is freshly opened, and mint
  // a fresh ticket ID so the webhook can't collide with a previous attempt.
  useEffect(() => {
    if (isOpen) {
      setContactConfirmed(false);
      setQuantity(Math.max(1, initialQuantity));
      ticketIdRef.current = `UB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const allAvailablePasses = [BACHATA_INVASION_PASS_OPTION, SOCIAL_PASS_OPTION, ...PASS_OPTIONS];
  const currentPassOption = allAvailablePasses.find(p => p.id === selectedPassId) || PASS_OPTIONS[0];
  const isPaidPass = currentPassOption.price > 0;
  const theme = THEME_CLASSES[getCheckoutTheme(currentPassOption.id)];
  // Buying more than one only makes sense for the two social events right
  // now (a "party of 3" is a real thing for Invasion/Locura; buying 3 of
  // the same weekly class tier isn't). Everything else stays locked to 1.
  const canPickQuantity = currentPassOption.id === 'social-invasion-10' || currentPassOption.id === 'social-presale';
  const effectiveQuantity = canPickQuantity ? quantity : 1;
  const totalPrice = currentPassOption.price * effectiveQuantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      const ticketId = ticketIdRef.current;

      const newPass: TicketPass = {
        ticketId,
        userName: name,
        userEmail: email,
        userPhone: phone || 'N/A',
        passName: currentPassOption.name,
        passType: currentPassOption.type,
        price: totalPrice,
        classesIncluded: getClassesIncludedLabel(currentPassOption, initialClassTimes),
        eventDate: 'Wednesday, August 5th (7:00 PM - 10:00 PM)',
        location: 'Dance Factory - WestShore Plaza Mall, Tampa, FL',
        purchaseTimestamp: Date.now(),
        status: 'CONFIRMED',
        qrCodeSeed: ticketId
      };

      setGeneratedPass(newPass);
      onPassCreated(newPass);
      setIsSubmitting(false);
    }, 600);
  };

  const handlePaymentSuccess = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    const ticketId = ticketIdRef.current;

    const newPass: TicketPass = {
      ticketId,
      userName: name.trim() || 'Valued Dancer',
      userEmail: email.trim() || 'N/A',
      userPhone: phone.trim() || 'N/A',
      passName: currentPassOption.name,
      passType: currentPassOption.type,
      price: totalPrice,
      classesIncluded: getClassesIncludedLabel(currentPassOption, initialClassTimes),
      eventDate: 'Wednesday, August 5th (7:00 PM - 10:00 PM)',
      location: 'Dance Factory - WestShore Plaza Mall, Tampa, FL',
      purchaseTimestamp: Date.now(),
      status: 'CONFIRMED',
      qrCodeSeed: ticketId
    };

    setGeneratedPass(newPass);
    onPassCreated(newPass);
  };

  const calendarUrl = generatedPass ? `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Urban Bachata Class @ Dance Factory')}&details=${encodeURIComponent(`Pass ID: ${generatedPass.ticketId}\nPass: ${generatedPass.passName}\nClasses: ${generatedPass.classesIncluded}`)}&location=${encodeURIComponent(STUDIO_INFO.fullAddress)}` : '#';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">

      <div className="relative w-full max-w-lg liquid-glass-panel rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {!generatedPass ? (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-badge border ${theme.badgeBorder} text-xs font-bold ${theme.badgeText} uppercase`}>
                <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                {isPaidPass ? 'SECURE CHECKOUT' : 'DIGITAL CLASS TICKET'}
              </div>
              <h3 className="text-2xl font-black text-white uppercase font-sans">
                {isPaidPass ? 'COMPLETE YOUR BOOKING' : 'CLAIM YOUR DANCE TICKET'}
              </h3>
            </div>

            {/* Selected Pass Summary Card */}
            <div className={`bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-2xl p-4 sm:p-5 border ${theme.cardBorder} shadow-xl space-y-3`}>
              <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
                <div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${theme.chipBg} ${theme.chipText} border ${theme.chipBorder} uppercase tracking-wider`}>
                    {totalPrice === 0 ? 'FREE PASS CHECKOUT' : `CHECKOUT: $${totalPrice}`}
                  </span>
                  <h4 className="text-lg font-black text-white uppercase mt-1">
                    {currentPassOption.name}{effectiveQuantity > 1 ? ` × ${effectiveQuantity}` : ''}
                  </h4>
                  <p className="text-xs text-slate-300 font-medium">
                    {currentPassOption.tagline}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className={`text-xl sm:text-2xl font-mono font-black ${theme.priceText}`}>
                    {totalPrice === 0 ? 'FREE' : `$${totalPrice}`}
                  </div>
                </div>
              </div>

              {/* Quantity picker — only for the two social events, where
                  buying for a group is a real thing. Locked to checkout
                  once payment is underway so the charge can't shift under
                  a half-submitted payment. */}
              {canPickQuantity && !contactConfirmed && (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">How many tickets?</span>
                  <div className="flex items-center gap-3 bg-black/30 rounded-full px-3 py-1.5 border border-white/10">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      aria-label="Decrease ticket quantity"
                      className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold flex items-center justify-center transition-colors"
                    >
                      &minus;
                    </button>
                    <span className="text-white font-black text-sm w-4 text-center font-mono">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(6, q + 1))}
                      disabled={quantity >= 6}
                      aria-label="Increase ticket quantity"
                      className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold flex items-center justify-center transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
              {effectiveQuantity > 1 && (
                <p className="text-[10px] text-slate-400 font-mono">
                  {effectiveQuantity} tickets &middot; ${currentPassOption.price} each
                </p>
              )}

              {initialClassTimes.length > 0 && (
                <div className="pt-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    Class{initialClassTimes.length > 1 ? 'es' : ''} Selected
                  </span>
                  <div className="space-y-1">
                    {initialClassTimes.map((t, idx) => (
                      <p key={idx} className="text-xs font-bold text-white">{t}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {isPaidPass ? (
              contactConfirmed ? (
                /* Custom minimal payment UI — handles card, Apple Pay, Google Pay */
                <CustomStripeCheckout
                  passName={currentPassOption.name}
                  priceInDollars={totalPrice}
                  onSuccess={handlePaymentSuccess}
                  passType={currentPassOption.type}
                  customerName={name}
                  customerEmail={email}
                  customerPhone={phone}
                  classesIncluded={
                    getClassesIncludedLabel(currentPassOption, initialClassTimes)
                  }
                  ticketId={ticketIdRef.current}
                  quantity={effectiveQuantity}
                  theme={getCheckoutTheme(currentPassOption.id)}
                />
              ) : (
                /* Collect name + email before payment so we always have real
                   contact info for the booking record and admin alert — card
                   payments don't hand this over the way wallet payments do. */
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!name.trim() || !email.trim()) return;
                    setContactConfirmed(true);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alex Rivera"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950/80 border border-white/15 text-white text-xs focus:outline-none ${theme.focusBorder} transition-colors`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        placeholder="e.g. alex@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950/80 border border-white/15 text-white text-xs focus:outline-none ${theme.focusBorder} transition-colors`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                      Phone Number (Optional)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="tel"
                        placeholder="e.g. (813) 555-0199"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950/80 border border-white/15 text-white text-xs focus:outline-none ${theme.focusBorder} transition-colors`}
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className={`w-full py-4 rounded-2xl border ${theme.btnBorder} ${theme.btnGradient} text-xs font-black text-white uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl ${theme.btnShadow} transition-all active:scale-95`}
                    >
                      <Sparkles className="w-4 h-4 text-yellow-300" />
                      <span>Continue to Payment</span>
                    </button>
                  </div>
                </form>
              )
            ) : (
              /* Free pass keeps the simple name/email form, no payment needed */
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Rivera"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950/80 border border-white/15 text-white text-xs focus:outline-none ${theme.focusBorder} transition-colors`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. alex@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950/80 border border-white/15 text-white text-xs focus:outline-none ${theme.focusBorder} transition-colors`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      placeholder="e.g. (813) 555-0199"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950/80 border border-white/15 text-white text-xs focus:outline-none ${theme.focusBorder} transition-colors`}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-2xl border ${theme.btnBorder} ${theme.btnGradient} text-xs font-black text-white uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl ${theme.btnShadow} transition-all active:scale-95`}
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse">Generating Pass...</span>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-yellow-300" />
                        <span>Get Free Ticket Pass</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* Confirmation screen — only used for FREE passes now.
             Paid passes are confirmed by Stripe's own checkout flow. */
          <div className="space-y-6 text-center">

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mb-2">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                PASS CONFIRMED & SAVED
              </span>
              <h3 className="text-2xl font-black text-white uppercase font-sans">
                YOUR DIGITAL TICKET
              </h3>
            </div>

            <div className={`liquid-glass-card rounded-3xl p-6 border ${theme.ticketBorder} text-left space-y-4 relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 shadow-2xl`}>
              <div className="flex justify-between items-start border-b border-white/10 pb-3">
                <div>
                  <span className={`text-[10px] font-mono font-bold ${theme.ticketAccent} uppercase block`}>
                    {STUDIO_INFO.instagram} • TAMPA
                  </span>
                  <h4 className="text-base font-black text-white uppercase">
                    {generatedPass.passName}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 block">TICKET ID</span>
                  <span className="text-xs font-mono font-black text-white bg-slate-900 px-2 py-0.5 rounded border border-white/10">
                    {generatedPass.ticketId}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Pass Holder</span>
                  <span className="font-bold text-white">{generatedPass.userName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Price Paid</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {generatedPass.price === 0 ? '$0 FREE' : `$${generatedPass.price}`}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] text-slate-400 uppercase block">Class{generatedPass.classesIncluded.includes(',') ? 'es' : ''} Selected</span>
                  <span className="font-bold text-white">{generatedPass.classesIncluded}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex flex-col items-center justify-center space-y-2">
                <div className="p-3 bg-white rounded-2xl shadow-inner flex items-center justify-center">
                  <QrCode className="w-24 h-24 text-slate-950" />
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  Scan at studio entrance for fast check-in
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <a
                href={calendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`border ${theme.btnBorder} ${theme.btnGradient} py-3.5 rounded-2xl text-xs font-bold text-white uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95`}
              >
                <Calendar className="w-4 h-4" />
                <span>Add To Calendar</span>
              </a>

              <button
                onClick={onClose}
                className="liquid-glass-btn liquid-btn-secondary py-3.5 rounded-2xl text-xs font-bold text-slate-200 hover:text-white uppercase tracking-wider"
              >
                Close & View Pass
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
