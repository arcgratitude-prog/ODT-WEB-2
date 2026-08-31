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
      className="relative w-full min-h-[80vh] flex flex-col items-center justify-between bg-black px-6 sm:px-12 pt-32 pb-16 border-t border-white/10"
    >
      {/* Center Statement & Button */}
      <div className="relative z-10 max-w-5xl mx-auto w-full text-center flex flex-col items-center my-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8 sm:space-y-10"
        >
          {/* Huge: YOUR NEXT VERSION STARTS HERE. */}
          <h2
            id="final-cta-huge-title"
            className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] font-black tracking-tight text-white leading-[0.95] uppercase select-none"
          >
            YOUR NEXT VERSION
            <br />
            <span>STARTS HERE.</span>
          </h2>

          {/* X1 & BACHATA INFLUENCE TRAINING */}
          <div className="space-y-2 pt-2">
            <p
              id="final-cta-brand"
              className="font-display text-2xl sm:text-3xl font-black tracking-tight text-white"
            >
              X1
            </p>
            <p
              id="final-cta-subheading"
              className="text-xs sm:text-sm font-semibold tracking-[0.35em] text-neutral-400 uppercase font-mono"
            >
              BACHATA X1
            </p>
          </div>

          {/* Button: JOIN X1 */}
          <div className="pt-4">
            <button
              id="final-join-x1-btn"
              onClick={onOpenJoin}
              className="group inline-flex items-center gap-3 px-10 py-4 sm:px-12 sm:py-4 text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-black bg-white hover:bg-neutral-200 border border-white transition-all duration-300 rounded-none cursor-pointer active:scale-95"
            >
              <span>JOIN X1</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Minimal Footer */}
      <div className="relative z-10 w-full max-w-7xl mx-auto pt-16 flex flex-col sm:flex-row items-center justify-between text-neutral-500 text-[10px] font-mono tracking-widest gap-4">
        <div className="flex items-center gap-4 uppercase">
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


