import React from 'react';
import { motion } from 'motion/react';
import heroDancersImg from '../../assets/images/x1/x1_hero_dancers_1788137713013.jpg';

interface HeroSectionProps {
  onOpenJoin: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenJoin }) => {
  return (
    <section
      id="hero-section"
      className="relative w-full min-h-[85vh] flex items-start justify-center overflow-hidden bg-black text-white"
    >
      {/* Background Cinematic Photo with Pure Black Overlays */}
      <div className="absolute inset-0 z-0 select-none">
        <img
          src={heroDancersImg}
          alt="Dancers training in a dark studio"
          className="w-full h-full object-cover object-center filter brightness-[0.4] contrast-125 grayscale"
          referrerPolicy="no-referrer"
        />
        {/* Cinematic dark gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/80" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Hero Core Content - Strictly Centered, High Impact */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-12 text-center flex flex-col items-center justify-center pt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          {/* Monolithic X1 */}
          <div
            id="hero-main-title"
            className="font-display text-8xl sm:text-9xl md:text-[11rem] lg:text-[13rem] font-black tracking-tighter text-white leading-none select-none"
          >
            X1
          </div>

          {/* Subheading: BACHATA X1 */}
          <h1
            id="hero-subheading"
            className="mt-6 sm:mt-8 text-xs sm:text-sm md:text-base font-semibold tracking-[0.35em] text-neutral-300 uppercase font-mono"
          >
            BACHATA X1
          </h1>

          {/* Tagline */}
          <p
            id="hero-tagline"
            className="mt-4 text-sm sm:text-base md:text-lg text-neutral-400 font-light tracking-wide max-w-md"
          >
            For dancers committed to improving.
          </p>

          {/* Sleek CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mt-10 sm:mt-12"
          >
            <button
              id="hero-join-x1-btn"
              onClick={onOpenJoin}
              className="px-8 py-3 text-xs font-semibold tracking-[0.25em] uppercase text-black bg-white hover:bg-neutral-200 border border-white transition-all duration-300 rounded-none cursor-pointer active:scale-95"
            >
              JOIN X1
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Subtle bottom scroll line */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center opacity-30">
        <div className="w-[1px] h-8 bg-gradient-to-b from-transparent to-white" />
      </div>
    </section>
  );
};


