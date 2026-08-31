import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

interface FinalCTAProps {
  onOpenJoin: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenJoin }) => {
  return (
    <section
      id="final-cta-section"
      className="relative w-full min-h-[50vh] flex flex-col items-center justify-between bg-black px-4 xs:px-6 sm:px-12 pt-16 pb-12 border-t border-white/10"
    >
      {/* Center Statement & Button */}
      <div className="relative z-10 max-w-5xl mx-auto w-full text-center flex flex-col items-center my-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6 sm:space-y-10 w-full"
        >
          {/* Huge: YOUR NEXT VERSION STARTS HERE. */}
          <h2
            id="final-cta-huge-title"
            className="font-display text-2xl xs:text-3xl sm:text-6xl md:text-8xl lg:text-[7.5rem] font-black tracking-tight text-white leading-tight sm:leading-[0.95] uppercase select-none break-words"
          >
            YOUR NEXT VERSION
            <br />
            <span>STARTS HERE.</span>
          </h2>

          {/* X1 & BACHATA INFLUENCE TRAINING */}
          <div className="space-y-1.5 sm:space-y-2 pt-2">
            <p
              id="final-cta-brand"
              className="font-brand text-2xl sm:text-3xl font-bold tracking-wider text-chrome drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]"
            >
              X1
            </p>
            <p
              id="final-cta-subheading"
              className="text-[11px] sm:text-sm font-semibold tracking-[0.25em] sm:tracking-[0.35em] text-neutral-400 uppercase font-mono"
            >
              BACHATA X1
            </p>
          </div>

          {/* Button: JOIN X1 */}
          <div className="pt-2 sm:pt-4">
            <button
              id="final-join-x1-btn"
              onClick={onOpenJoin}
              className="group inline-flex items-center gap-3 px-8 sm:px-12 py-3.5 sm:py-4 text-xs sm:text-sm font-semibold tracking-[0.2em] sm:tracking-[0.25em] uppercase text-white bg-gradient-to-b from-white/20 via-white/10 to-white/[0.04] hover:from-white/30 hover:via-white/15 hover:to-white/[0.08] border border-white/25 hover:border-white/50 transition-all duration-300 rounded-lg backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_15px_35px_rgba(0,0,0,0.8)] cursor-pointer active:scale-95 hover:scale-[1.02]"
            >
              <span>JOIN X1</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Minimal Footer */}
      <div className="relative z-10 w-full max-w-7xl mx-auto pt-12 sm:pt-16 flex flex-col sm:flex-row items-center justify-between text-neutral-500 text-[10px] font-mono tracking-widest gap-3 sm:gap-4 text-center sm:text-left">
        <div className="flex items-center gap-3 sm:gap-4 uppercase">
          <span>X1</span>
          <span>·</span>
          <span>BACHATA X1</span>
        </div>
        <div className="text-neutral-500 uppercase">
          <span>ALL RIGHTS RESERVED</span>
        </div>
      </div>
    </section>
  );
};


