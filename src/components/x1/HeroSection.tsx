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
      className="relative w-full flex items-start justify-center overflow-hidden bg-black text-white pb-16"
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
      <div className="relative z-10 max-w-5xl mx-auto px-4 xs:px-6 sm:px-12 text-center flex flex-col items-center justify-center pt-36">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center w-full"
        >
          {/* Sleek Liquid Chrome & Ambient Glow X1 */}
          <div className="relative flex items-center justify-center max-w-full">
            {/* Ambient diffused back-glow */}
            <div className="absolute inset-0 blur-3xl bg-gradient-to-b from-white/20 via-white/5 to-transparent rounded-full pointer-events-none scale-125" />

            <div
              id="hero-main-title"
              className="relative z-10 font-brand text-6xl xs:text-7xl sm:text-9xl md:text-[10rem] lg:text-[12rem] font-bold tracking-wider sm:tracking-widest text-chrome drop-shadow-[0_0_35px_rgba(255,255,255,0.35)] leading-none select-none"
            >
              X1
            </div>
          </div>

          {/* Subheading: BACHATA X1 */}
          <h1
            id="hero-subheading"
            className="mt-4 sm:mt-8 text-[11px] xs:text-xs sm:text-sm md:text-base font-semibold tracking-[0.25em] sm:tracking-[0.35em] text-neutral-300 uppercase font-mono"
          >
            BACHATA X1
          </h1>

          {/* Tagline */}
          <p
            id="hero-tagline"
            className="mt-3 sm:mt-4 text-xs xs:text-sm sm:text-base md:text-lg text-neutral-400 font-light tracking-wide max-w-md px-2"
          >
            For dancers committed to improving.
          </p>

          {/* Sleek CTA Glass Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mt-8 sm:mt-12"
          >
            <button
              id="hero-join-x1-btn"
              onClick={onOpenJoin}
              className="group relative px-8 sm:px-10 py-3 sm:py-3.5 text-[11px] sm:text-xs font-semibold tracking-[0.2em] sm:tracking-[0.25em] uppercase text-white bg-gradient-to-b from-white/15 via-white/[0.08] to-white/[0.03] hover:from-white/25 hover:via-white/15 hover:to-white/[0.06] active:from-white/30 border border-white/25 hover:border-white/50 transition-all duration-300 rounded-lg backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_10px_30px_rgba(0,0,0,0.8)] cursor-pointer active:scale-95 hover:scale-[1.02]"
            >
              <span className="relative z-10">JOIN X1</span>
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


