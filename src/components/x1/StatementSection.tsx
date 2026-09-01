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


