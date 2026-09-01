import React from 'react';
import { motion } from 'motion/react';

export const FoundationSection: React.FC = () => {
  return (
    <section
      id="foundation-section"
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
          {/* Eyebrow tag — same design system as every other section. */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/[0.03] border border-white/10 backdrop-blur-md rounded-full text-[9px] xs:text-[10px] sm:text-xs font-mono tracking-[0.25em] sm:tracking-[0.3em] uppercase text-neutral-300 mb-2 sm:mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)] animate-pulse" />
            [ 03 — FOUNDATION ]
          </div>

          {/* Main Statement */}
          <div className="space-y-1.5 sm:space-y-3">
            <h2
              id="foundation-heading-main"
              className="font-display text-3xl xs:text-5xl sm:text-6xl md:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase leading-none select-none break-words"
            >
              MOVEMENT
            </h2>
            <p
              id="foundation-heading-sub"
              className="font-serif italic text-xl xs:text-2xl sm:text-4xl md:text-5xl text-neutral-400 font-light"
            >
              is the foundation.
            </p>
          </div>

          {/* Underneath, very small: GROOVE · MUSICALITY · BODY CONTROL · FOOTWORK · TEXTURE */}
          <div className="pt-4 sm:pt-8">
            <div
              id="foundation-attributes"
              className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px] xs:text-[11px] sm:text-xs md:text-sm font-medium tracking-[0.2em] sm:tracking-[0.35em] text-neutral-400 uppercase font-mono max-w-2xl mx-auto"
            >
              <span>GROOVE</span>
              <span className="text-neutral-600">·</span>
              <span>MUSICALITY</span>
              <span className="text-neutral-600">·</span>
              <span>BODY CONTROL</span>
              <span className="text-neutral-600">·</span>
              <span>FOOTWORK</span>
              <span className="text-neutral-600">·</span>
              <span>TEXTURE</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};


