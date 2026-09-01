import React from 'react';
import { motion } from 'motion/react';

export const StatementSection: React.FC = () => {
  return (
    <section
      id="statement-section"
      className="relative w-full min-h-0 flex items-center justify-center bg-black px-4 xs:px-6 sm:px-12 py-16 sm:py-20 border-t border-b border-white/10"
    >
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center justify-center w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4 sm:space-y-8 w-full"
        >
          {/* Eyebrow tag — matches the same visual system used across
              every section (see HolisticSection's "[ THE X1 SYSTEM ]"),
              so sections read as one cohesive design instead of isolated
              floating text on wide screens. */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/[0.03] border border-white/10 backdrop-blur-md rounded-full text-[9px] xs:text-[10px] sm:text-xs font-mono tracking-[0.25em] sm:tracking-[0.3em] uppercase text-neutral-300 mb-4 sm:mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)] animate-pulse" />
            [ 01 — PHILOSOPHY ]
          </div>

          {/* Huge text: NOT JUST A CLASS. */}
          <h2
            id="statement-huge-title"
            className="font-display text-2xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight sm:leading-none uppercase select-none break-words"
          >
            NOT JUST A CLASS.
          </h2>

          {/* Small text underneath: Training for dancers who want to get better. */}
          <p
            id="statement-small-subtitle"
            className="text-neutral-400 text-xs xs:text-sm sm:text-base md:text-lg font-light tracking-wide max-w-xl mx-auto px-2"
          >
            Training for dancers who want to get better.
          </p>
        </motion.div>
      </div>
    </section>
  );
};


