import React from 'react';
import { motion } from 'motion/react';

export const FoundationSection: React.FC = () => {
  return (
    <section
      id="foundation-section"
      className="relative w-full min-h-0 flex items-center justify-center bg-black px-6 sm:px-12 py-16 sm:py-20 border-t border-b border-white/10"
    >
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6 sm:space-y-8"
        >
          {/* Main Statement */}
          <div className="space-y-2 sm:space-y-3">
            <h2
              id="foundation-heading-main"
              className="font-display text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black tracking-tight text-white uppercase leading-none select-none"
            >
              MOVEMENT
            </h2>
            <p
              id="foundation-heading-sub"
              className="font-serif italic text-2xl sm:text-4xl md:text-5xl text-neutral-400 font-light"
            >
              is the foundation.
            </p>
          </div>

          {/* Underneath, very small: GROOVE · MUSICALITY · BODY CONTROL · FOOTWORK · TEXTURE */}
          <div className="pt-6 sm:pt-8">
            <p
              id="foundation-attributes"
              className="text-[11px] sm:text-xs md:text-sm font-medium tracking-[0.25em] sm:tracking-[0.35em] text-neutral-400 uppercase font-mono"
            >
              <span>GROOVE</span>
              <span className="text-neutral-600 mx-2 sm:mx-3">·</span>
              <span>MUSICALITY</span>
              <span className="text-neutral-600 mx-2 sm:mx-3">·</span>
              <span>BODY CONTROL</span>
              <span className="text-neutral-600 mx-2 sm:mx-3">·</span>
              <span>FOOTWORK</span>
              <span className="text-neutral-600 mx-2 sm:mx-3">·</span>
              <span>TEXTURE</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};


