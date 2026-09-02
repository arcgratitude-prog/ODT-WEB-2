import React, { useState } from 'react';
import { Shield, RotateCcw, ArrowLeft } from 'lucide-react';
import { STUDIO_INFO } from '../data/danceData';

interface PolicyPageProps {
  onBack: () => void;
}

// Basic, genuine policy content — a real starting point that fills the
// gap of having NO policy pages at all, which matters here since this
// site takes real payments and collects real personal data. This is not
// a substitute for review by an actual lawyer, especially once the
// business scales, but launching with nothing at all is worse than
// launching with this.
export const PolicyPage: React.FC<PolicyPageProps> = ({ onBack }) => {
  const [tab, setTab] = useState<'privacy' | 'refund'>('privacy');

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto min-h-screen text-slate-200">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="flex rounded-2xl bg-white/5 border border-white/10 p-1 mb-8 max-w-sm">
        <button
          onClick={() => setTab('privacy')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-1.5 transition-colors ${
            tab === 'privacy' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Shield className="w-3.5 h-3.5" /> Privacy
        </button>
        <button
          onClick={() => setTab('refund')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-1.5 transition-colors ${
            tab === 'refund' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" /> Refunds & Cancellations
        </button>
      </div>

      {tab === 'privacy' ? (
        <div className="space-y-6 text-sm leading-relaxed">
          <h1 className="text-2xl font-black text-white uppercase">Privacy Policy</h1>
          <p className="text-slate-400 text-xs">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>

          <section className="space-y-2">
            <h2 className="text-white font-bold text-base">What we collect</h2>
            <p>When you buy a pass or create a member account, we collect your name, email address, and (optionally) phone number. We never ask for or store your payment card details directly — those go straight to our payment processor, Stripe, which handles them under its own security standards.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-white font-bold text-base">How we use it</h2>
            <p>We use your information to process your purchase, send you a confirmation and any updates about the class or event you booked, and — only if you create a member account — to verify your membership status and any discounts you're eligible for. We do not sell your information to third parties.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-white font-bold text-base">Member accounts</h2>
            <p>If you create a member account (required for Tier passes), your password is stored using industry-standard one-way hashing — we never store or have access to your actual password.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-white font-bold text-base">Third parties we use</h2>
            <p>Stripe (payment processing), Resend (transactional email), and Neon (database hosting). Each has its own privacy practices governing the data that passes through their systems.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-white font-bold text-base">Contact us</h2>
            <p>Questions about your data? Reach out via our <a href={STUDIO_INFO.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">Instagram</a> or our WhatsApp group linked in the footer.</p>
          </section>
        </div>
      ) : (
        <div className="space-y-6 text-sm leading-relaxed">
          <h1 className="text-2xl font-black text-white uppercase">Refunds & Cancellations</h1>
          <p className="text-slate-400 text-xs">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>

          <section className="space-y-2">
            <h2 className="text-white font-bold text-base">Class passes & Tiers</h2>
            <p>Weekly class Tiers and drop-ins are non-refundable once purchased, since they reserve your spot in a limited-capacity class. If something comes up and you can't make a class, reach out to us directly — we handle these on a case-by-case basis and want to work with you.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-white font-bold text-base">Socials (Bachata Locura & Bachata Invasion)</h2>
            <p>Social event tickets are non-refundable, but transferable — if you can't make it, you're welcome to give your ticket to a friend. Just let us know their name in advance so we can check them in smoothly at the door.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-white font-bold text-base">Event cancellations by us</h2>
            <p>If we cancel or reschedule an event or class for any reason, you'll receive a full refund or the option to transfer your pass to the rescheduled date — your choice.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-white font-bold text-base">How to request something</h2>
            <p>Message us directly via Instagram or our WhatsApp group (both linked in the footer) with your order details, and we'll get back to you as quickly as we can.</p>
          </section>
        </div>
      )}
    </div>
  );
};
