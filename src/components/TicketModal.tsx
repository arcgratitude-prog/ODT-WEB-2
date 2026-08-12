import React, { useState, useEffect } from 'react';
import { X, Sparkles, CheckCircle2, Calendar, MapPin, Download, QrCode, Ticket, ShieldCheck, User, Mail, Phone, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PASS_OPTIONS, SOCIAL_PASS_OPTION, BACHATA_INVASION_PASS_OPTION, SECRET_OPEN_HOUSE_PASS, STUDIO_INFO } from '../data/danceData';
import { TicketPass } from '../types';
import { StripeEmbeddedCheckoutBox } from './StripeEmbeddedCheckout';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPassTypeId?: string;
  onPassCreated: (pass: TicketPass) => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({
  isOpen,
  onClose,
  initialPassTypeId = 'free-open-house',
  onPassCreated
}) => {
  const [selectedPassId, setSelectedPassId] = useState<string>(initialPassTypeId);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedPass, setGeneratedPass] = useState<TicketPass | null>(null);

  useEffect(() => {
    if (initialPassTypeId) {
      setSelectedPassId(initialPassTypeId);
      setGeneratedPass(null);
    }
  }, [initialPassTypeId]);

  if (!isOpen) return null;

  const allAvailablePasses = [BACHATA_INVASION_PASS_OPTION, SOCIAL_PASS_OPTION, SECRET_OPEN_HOUSE_PASS, ...PASS_OPTIONS];
  const currentPassOption = allAvailablePasses.find(p => p.id === selectedPassId) || PASS_OPTIONS[0];
  const isPaidPass = currentPassOption.price > 0;

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

      const ticketId = `UB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      const newPass: TicketPass = {
        ticketId,
        userName: name,
        userEmail: email,
        userPhone: phone || 'N/A',
        passName: currentPassOption.name,
        passType: currentPassOption.type,
        price: currentPassOption.price,
        classesIncluded: `${currentPassOption.classesCount} Class Session(s)`,
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

  const calendarUrl = generatedPass ? `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Urban Bachata Class @ Dance Factory')}&details=${encodeURIComponent(`Pass ID: ${generatedPass.ticketId}\nPass: ${generatedPass.passName}`)}&location=${encodeURIComponent(STUDIO_INFO.fullAddress)}` : '#';

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
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-badge border border-red-500/30 text-xs font-bold text-red-400 uppercase">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                {isPaidPass ? 'SECURE CHECKOUT' : 'DIGITAL CLASS TICKET'}
              </div>
              <h3 className="text-2xl font-black text-white uppercase font-sans">
                {isPaidPass ? 'COMPLETE YOUR BOOKING' : 'CLAIM YOUR DANCE TICKET'}
              </h3>
            </div>

            {/* Selected Pass Summary Card */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-2xl p-4 sm:p-5 border border-red-500/40 shadow-xl space-y-3">
              <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30 uppercase tracking-wider">
                    {currentPassOption.price === 0 ? 'FREE PASS CHECKOUT' : `CHECKOUT: $${currentPassOption.price}`}
                  </span>
                  <h4 className="text-lg font-black text-white uppercase mt-1">
                    {currentPassOption.name}
                  </h4>
                  <p className="text-xs text-slate-300 font-medium">
                    {currentPassOption.tagline}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xl sm:text-2xl font-mono font-black text-red-400">
                    {currentPassOption.price === 0 ? 'FREE' : `$${currentPassOption.price}`}
                  </div>
                </div>
              </div>
            </div>

            {isPaidPass ? (
              /* Real Stripe embedded payment box — handles card, Apple Pay, Google Pay */
              <StripeEmbeddedCheckoutBox
                passName={currentPassOption.name}
                priceInDollars={currentPassOption.price}
              />
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
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950/80 border border-white/15 text-white text-xs focus:outline-none focus:border-red-500 transition-colors"
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
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950/80 border border-white/15 text-white text-xs focus:outline-none focus:border-red-500 transition-colors"
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
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950/80 border border-white/15 text-white text-xs focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="liquid-glass-btn liquid-btn-primary w-full py-4 rounded-2xl text-xs font-black text-white uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-red-600/40"
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

            <div className="liquid-glass-card rounded-3xl p-6 border border-red-500/40 text-left space-y-4 relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 shadow-2xl">
              <div className="flex justify-between items-start border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold text-red-400 uppercase block">
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
                className="liquid-glass-btn liquid-btn-primary py-3.5 rounded-2xl text-xs font-bold text-white uppercase tracking-wider flex items-center justify-center gap-2"
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
