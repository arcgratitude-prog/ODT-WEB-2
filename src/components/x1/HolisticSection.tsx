import React from 'react';
import { motion } from 'motion/react';

export const HolisticSection: React.FC = () => {
  return (
    <section
      id="holistic-section"
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
          {/* Main Visual Message: BODY. MIND. MOVEMENT. */}
          <h2
            id="holistic-heading-main"
            className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white uppercase leading-none select-none"
          >
            BODY. MIND. MOVEMENT.
          </h2>

          {/* Short Supporting Line */}
          <p
            id="holistic-supporting-line"
            className="text-neutral-400 text-base sm:text-lg md:text-xl font-light tracking-wide max-w-xl mx-auto"
          >
            Train your body. Clear your mind. Find your movement.
          </p>

          {/* Subtle Pillars Reference */}
          <div className="pt-4 sm:pt-6">
            <p
              id="holistic-attributes"
              className="text-[11px] sm:text-xs md:text-sm font-medium tracking-[0.2em] sm:tracking-[0.3em] text-neutral-400 uppercase font-mono leading-relaxed"
            >
              <span>PHYSICAL FITNESS</span>
              <span className="text-neutral-600 mx-2 sm:mx-3">·</span>
              <span>MENTAL RESET</span>
              <span className="text-neutral-600 mx-2 sm:mx-3">·</span>
              <span>CONFIDENCE</span>
              <span className="text-neutral-600 mx-2 sm:mx-3">·</span>
              <span>SELF-EXPRESSION</span>
              <span className="text-neutral-600 mx-2 sm:mx-3">·</span>
              <span>CONNECTION</span>
              <span className="text-neutral-600 mx-2 sm:mx-3">·</span>
              <span>GROWTH</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
