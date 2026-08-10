import React, { useState } from 'react';
import { Ticket, Sparkles, Check, DollarSign, Calculator, Shield, Zap, Flame, Award } from 'lucide-react';
import { PASS_OPTIONS } from '../data/danceData';
import { PassOption } from '../types';

interface PricingSectionProps {
  onOpenBooking: (passTypeId?: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onOpenBooking }) => {
  // Calculator state
  const [selectedPassId, setSelectedPassId] = useState<string>('track-progression');
  const [attendeeCount, setAttendeeCount] = useState<number>(1);

  const selectedPass = PASS_OPTIONS.find(p => p.id === selectedPassId) || PASS_OPTIONS[1] || PASS_OPTIONS[0];
  const totalPrice = selectedPass.price * attendeeCount;
  const originalTotalPrice = (selectedPass.originalPrice || selectedPass.price) * attendeeCount;
  const totalSavings = originalTotalPrice - totalPrice;

  return (
    <section id="passes" className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center space-y-4 mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-badge border border-red-500/40 text-xs font-bold text-red-400 uppercase tracking-[0.25em]">
          <Ticket className="w-3.5 h-3.5" />
          CLASS TRACKS & MEMBERSHIPS
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-sans tracking-tight">
          CLASS PRICING <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-300 to-red-600 urban-text-glow">& TRACKS</span>
        </h2>

        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
          Elevate your dance with our 4-week structured tracks. Every track includes access to our monthly Lab Night Practice Social, 20% off ODT socials, and 10% off private lessons!
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {PASS_OPTIONS.filter(p => p.id !== 'free-open-house').map((pass) => (
          <div
            key={pass.id}
            className={`liquid-glass-card rounded-3xl p-6 border flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${
              pass.popular
                ? 'border-red-600/80 shadow-[0_0_40px_rgba(220,38,38,0.35)] bg-gradient-to-b from-[#2e050c] via-[#140608] to-[#0a0a0c]'
                : 'border-white/15'
            }`}
          >
            {/* Popular Banner (Red & Black Theme) */}
            {pass.popular && (
              <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-red-600 via-red-700 to-black text-white text-[10px] font-black uppercase rounded-bl-xl tracking-widest shadow-md border-b border-l border-red-500/50">
                ★ MOST POPULAR
              </div>
            )}

            <div>
              {/* Savings Badge */}
              {pass.savings && (
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase mb-3 ${
                  pass.popular 
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40' 
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {pass.savings}
                </span>
              )}

              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-1">
                {pass.name}
              </h3>

              <p className="text-xs text-slate-300 mb-4 min-h-[32px]">
                {pass.tagline}
              </p>

              {/* Price display */}
              <div className="flex items-baseline gap-2 mb-6">
                <span className={`text-4xl font-black font-mono ${pass.popular ? 'text-red-400' : 'text-white'}`}>
                  ${pass.price}
                </span>
                {pass.originalPrice && (
                  <span className="text-sm font-bold text-slate-400 line-through">
                    ${pass.originalPrice}
                  </span>
                )}
                <span className="text-xs text-slate-400">
                  {pass.type === 'cycle_4week' ? '/ 4 weeks' : '/ drop-in'}
                </span>
              </div>

              {/* Feature List */}
              <div className="space-y-2.5 mb-6 pt-4 border-t border-white/10">
                {pass.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                    <Check className={`w-4 h-4 shrink-0 mt-0.5 ${pass.popular ? 'text-red-500' : 'text-red-400'}`} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action button */}
            <button
              onClick={() => onOpenBooking(pass.id)}
              className={`w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 ${
                pass.popular
                  ? 'bg-gradient-to-r from-red-600 via-red-700 to-black hover:from-red-500 hover:to-zinc-900 text-white border border-red-500/50 shadow-lg shadow-red-600/40'
                  : 'liquid-glass-btn liquid-btn-secondary text-slate-100 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Checkout ${pass.price} - {pass.name}</span>
            </button>

          </div>
        ))}
      </div>

      {/* Interactive Class Calculator (Liquid Glass Studio Panel) */}
      <div className="liquid-glass-panel rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl relative overflow-hidden">
        
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-red-600/20 text-red-400 border border-red-500/30">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white uppercase font-sans">
              QUICK CLASS CALCULATOR
            </h3>
            <p className="text-xs text-slate-300">
              Calculate total pricing for individuals, couples, or group friends attending together.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Controls */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Select Class Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                1. Select Class Option:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PASS_OPTIONS.filter(p => p.id !== 'free-open-house').map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPassId(p.id)}
                    className={`p-3 rounded-2xl text-left border text-xs font-bold transition-all flex justify-between items-center ${
                      selectedPassId === p.id
                        ? 'bg-red-600/30 border-red-500 text-white shadow-md shadow-red-600/30'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div>
                      <div className="text-white uppercase">{p.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{p.classesCount} class(es)</div>
                    </div>
                    <div className="text-sm font-mono text-red-400 font-black">${p.price}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Number of Dancers */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                2. Number of Dancers Attending:
              </label>
              <div className="flex items-center gap-3">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => setAttendeeCount(num)}
                    className={`w-11 h-11 rounded-2xl font-mono font-bold text-sm border transition-all ${
                      attendeeCount === num
                        ? 'bg-red-600 text-white border-red-400 shadow-lg shadow-red-600/40 scale-105'
                        : 'liquid-glass-btn text-slate-300 border-white/10'
                    }`}
                  >
                    {num}
                  </button>
                ))}
                <span className="text-xs text-slate-400 pl-2">
                  {attendeeCount === 1 ? 'Individual Dancer' : attendeeCount === 2 ? 'Couples / Dance Duo' : `${attendeeCount} Dance Crew`}
                </span>
              </div>
            </div>

          </div>

          {/* Calculator Total Glass Display */}
          <div className="lg:col-span-5 bg-slate-950/80 rounded-2xl p-6 border border-white/15 flex flex-col justify-between space-y-4 shadow-inner">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400 uppercase tracking-wider">
                <span>Selected Option</span>
                <span className="text-white font-bold">{selectedPass.name}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400 uppercase tracking-wider">
                <span>Dancers Count</span>
                <span className="text-white font-bold">{attendeeCount} Person(s)</span>
              </div>
              {totalSavings > 0 && (
                <div className="flex justify-between text-xs text-red-400 font-bold uppercase tracking-wider">
                  <span>Bundle Savings</span>
                  <span>-${totalSavings} Total Saved</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                ESTIMATED DIGITAL TICKET TOTAL
              </div>
              <div className="flex items-baseline gap-2 my-1">
                <span className="text-5xl font-black text-white font-mono text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-red-400">
                  ${totalPrice}
                </span>
                {originalTotalPrice > totalPrice && (
                  <span className="text-lg font-bold text-slate-500 line-through font-mono">
                    ${originalTotalPrice}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-300">
                Instant digital mobile ticket generation with QR code for check-in.
              </p>
            </div>

            <button
              onClick={() => onOpenBooking(selectedPass.id)}
              className="liquid-glass-btn liquid-btn-primary w-full py-3.5 rounded-2xl text-xs font-black text-white uppercase tracking-wider shadow-lg shadow-red-600/40 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Checkout Digital Ticket (${totalPrice})</span>
            </button>
          </div>

        </div>

      </div>

    </section>
  );
};
