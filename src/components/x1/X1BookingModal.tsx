import React from 'react';
import { X, ArrowRight } from 'lucide-react';

interface X1BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPass: (passId: string) => void;
}

// Replaces the original design's "cohort application" concept (multiple
// cohorts, waitlist, audition-only statuses) with what this actually is:
// a real, bookable pass. Picking an option here calls straight into the
// site's real Stripe checkout (TicketModal), the same flow every other
// pass on the site uses.
export const X1BookingModal: React.FC<X1BookingModalProps> = ({ isOpen, onClose, onSelectPass }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-white/10 bg-black">
          <div className="flex items-center gap-3">
            <span className="font-display font-black text-2xl text-white tracking-tight">X1</span>
            <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase bg-white/5 px-2.5 py-1 border border-white/10">
              Book a Session
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-4">
          <button
            onClick={() => onSelectPass('x1-monthly')}
            className="group w-full text-left p-5 border border-white/15 hover:border-white bg-white/[0.02] hover:bg-white/[0.05] transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-display text-lg font-black text-white uppercase tracking-tight">Monthly</span>
                  <span className="text-[9px] font-mono tracking-widest text-black bg-white px-2 py-0.5 uppercase">Best Value</span>
                </div>
                <p className="text-xs text-neutral-400 font-light">Weekly 90-minute private session with Isaac &amp; Albina.</p>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
            </div>
            <div className="mt-3 font-display text-2xl font-black text-white">$100<span className="text-xs font-normal text-neutral-500">/mo</span></div>
          </button>

          <button
            onClick={() => onSelectPass('x1-dropin')}
            className="group w-full text-left p-5 border border-white/15 hover:border-white bg-white/[0.02] hover:bg-white/[0.05] transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="font-display text-lg font-black text-white uppercase tracking-tight">Drop-In</span>
                <p className="text-xs text-neutral-400 font-light mt-1">One 90-minute private session with Isaac &amp; Albina.</p>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
            </div>
            <div className="mt-3 font-display text-2xl font-black text-white">$30</div>
          </button>
        </div>
      </div>
    </div>
  );
};
