import React from 'react';
import { Sparkles, Calendar, Gift, ArrowRight, ShieldCheck, Flame, Users } from 'lucide-react';
import { SPECIAL_EVENTS } from '../data/danceData';

interface SpecialEventsSectionProps {
  onOpenBooking: (passTypeId?: string) => void;
}

export const SpecialEventsSection: React.FC<SpecialEventsSectionProps> = ({ onOpenBooking }) => {
  return (
    <section id="events" className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center space-y-3 mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-badge border border-red-500/30 text-[11px] font-mono font-bold text-red-400 uppercase tracking-[0.2em] mb-1">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          <span>FEATURED HIGHLIGHTS</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-sans tracking-tight">
          UPCOMING <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-300 to-red-600 urban-text-glow">4-WEEK CYCLES</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 max-w-2xl mx-auto gap-8 lg:gap-10">
        
        {/* 4-Week Cycle Card (Most Popular Red & Black Theme) */}
        <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 border border-red-600/80 shadow-[0_0_35px_rgba(220,38,38,0.35)] bg-gradient-to-br from-[#2e050c] via-[#140608] to-[#0a0a0c] relative overflow-hidden flex flex-col justify-between">
          
          <div className="absolute top-0 right-0 px-4 py-1.5 bg-gradient-to-r from-red-600 via-red-700 to-black text-white text-xs font-black uppercase rounded-bl-2xl tracking-widest border-b border-l border-red-500/50">
            ★ MOST POPULAR COURSE
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-red-400" />
              <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest">
                AUG 12 – SEPT 2 (4 WEDNESDAYS)
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase font-sans tracking-tight mb-3">
              4-WEEK URBAN BACHATA CYCLE
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              {SPECIAL_EVENTS[0].description}
            </p>

            {/* Cycle Breakdown */}
            <div className="space-y-2 mb-6 bg-black/60 p-4 rounded-2xl border border-red-500/20">
              <div className="flex justify-between text-xs text-slate-300">
                <span className="font-bold text-red-400">Week 1 (Aug 12):</span>
                <span>Frame, Isolations & Smooth Lead/Follow</span>
              </div>
              <div className="flex justify-between text-xs text-slate-300">
                <span className="font-bold text-red-400">Week 2 (Aug 19):</span>
                <span>Pasitos, Footwork Syncopations & Styling</span>
              </div>
              <div className="flex justify-between text-xs text-slate-300">
                <span className="font-bold text-red-400">Week 3 (Aug 26):</span>
                <span>Sensual Body Rolls, Dips & Weight Support</span>
              </div>
              <div className="flex justify-between text-xs text-slate-300">
                <span className="font-bold text-red-400">Week 4 (Sept 2):</span>
                <span>Musicality Accents & Full Urban Combos</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="text-left shrink-0">
              <span className="text-[10px] text-red-300 uppercase block font-bold">12 Classes Bundle</span>
              <div className="flex items-baseline gap-2">
                {/* TEST PRICING: temporarily $1 to verify the Stripe checkout flow
                    end-to-end. Books 'track-unlimited' (see danceData.ts), which is
                    also set to $1 right now. Revert both together when done testing. */}
                <span className="text-3xl font-black text-red-400 font-mono">$1</span>
                <span className="text-xs font-bold text-slate-400 line-through">$200</span>
              </div>
            </div>

            <button
              onClick={() => onOpenBooking('track-unlimited')}
              className="bg-gradient-to-r from-red-600 via-red-700 to-black hover:from-red-500 hover:to-zinc-900 text-white border border-red-500/50 shadow-lg shadow-red-600/40 w-full py-4 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Register 4-Week Cycle</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>

        </div>

      </div>

    </section>
  );
};
