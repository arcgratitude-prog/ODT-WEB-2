import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Brain,
  Dumbbell,
  Compass,
  Music,
  Shield,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface PillarNode {
  id: string;
  title: string;
  category: string;
  benefitLabel: string;
  icon: React.ElementType;
  benefitDesc: string;
  highlights: string[];
}

export const HolisticSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [slideDirection, setSlideDirection] = useState<number>(0);

  const pillars: PillarNode[] = useMemo(
    () => [
      {
        id: 'body',
        title: 'BODY',
        category: 'PHYSICAL CONDITIONING',
        benefitLabel: 'HOW X1 BUILDS YOUR BODY',
        icon: Dumbbell,
        benefitDesc:
          'Develops athletic core power, dynamic stamina, and explosive control so you can execute high-output choreography without hitting muscular fatigue.',
        highlights: ['Explosive Core Power', '90-Min High Stamina', 'Deceleration Control'],
      },
      {
        id: 'brain',
        title: 'BRAIN',
        category: 'COGNITIVE ADAPTATION',
        benefitLabel: 'HOW X1 SHARPENS YOUR MIND',
        icon: Brain,
        benefitDesc:
          'Accelerates sequence retention and rapid pattern decoding under musical tempo—training your mind to learn choreography twice as fast and stay locked in.',
        highlights: ['Faster Sequence Recall', 'Laser Presence', 'Adaptive Reflexes'],
      },
      {
        id: 'movement',
        title: 'MOVEMENT',
        category: 'DYNAMIC ISOLATION',
        benefitLabel: 'HOW X1 ELEVATES YOUR MOVEMENT',
        icon: Compass,
        benefitDesc:
          'Unlocks micro-articulation across your chest, ribs, and hips—giving you surgical body control, crisp dynamic textures, and effortless kinetic flow.',
        highlights: ['Micro-Isolations', 'Fluid Transitions', 'Total Body Control'],
      },
      {
        id: 'musicality',
        title: 'MUSICALITY',
        category: 'RHYTHM & EXPRESSION',
        benefitLabel: 'HOW X1 EVOLVES YOUR MUSICALITY',
        icon: Music,
        benefitDesc:
          'Trains your ear to isolate syncopated polyrhythms and dynamic instruments—allowing you to dance inside the music and hit micro-accents naturally.',
        highlights: ['Polyrhythmic Ear', 'Dynamic Cadence', 'Expressive Phrasing'],
      },
      {
        id: 'longevity',
        title: 'LONGEVITY',
        category: 'MOBILITY & RECOVERY',
        benefitLabel: 'HOW X1 PROTECTS YOUR LONGEVITY',
        icon: Shield,
        benefitDesc:
          'Restores multi-planar mobility, decompresses high-impact joints, and builds balanced stabilizer muscles to keep you dancing resiliently and injury-free.',
        highlights: ['Joint Decompression', 'Full-Range Mobility', 'Injury Prevention'],
      },
    ],
    []
  );

  // Symmetrical 5-node arrangement around 360 degrees (72 deg apart)
  // Tuned coordinate radius from 135 to 128 to give full breathing room within viewBox (-200..200) for button edges
  const nodePositions = useMemo(() => {
    const radius = 126; // viewBox coordinate radius (-200 to 200)
    return pillars.map((pillar, i) => {
      const angleDeg = -90 + i * (360 / pillars.length);
      const angleRad = (angleDeg * Math.PI) / 180;
      return {
        ...pillar,
        index: i,
        x: radius * Math.cos(angleRad),
        y: radius * Math.sin(angleRad),
        angleDeg,
      };
    });
  }, [pillars]);

  const activePillar = pillars[currentIndex];

  const handlePrev = useCallback(() => {
    setSlideDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? pillars.length - 1 : prev - 1));
  }, [pillars.length]);

  const handleNext = useCallback(() => {
    setSlideDirection(1);
    setCurrentIndex((prev) => (prev === pillars.length - 1 ? 0 : prev + 1));
  }, [pillars.length]);

  const handleSelect = useCallback(
    (index: number) => {
      setSlideDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
    },
    [currentIndex]
  );

  return (
    <section
      id="holistic-core-section"
      className="relative w-full bg-black px-4 sm:px-8 py-20 sm:py-28 border-t border-b border-white/10 overflow-hidden select-none"
    >
      {/* Matte ambient depth glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_65%_at_50%_45%,rgba(255,255,255,0.04),rgba(0,0,0,0))] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-3 max-w-2xl mb-5 sm:mb-10 px-2"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/[0.03] border border-white/10 backdrop-blur-md rounded-full text-[9px] xs:text-[10px] sm:text-xs font-mono tracking-[0.25em] sm:tracking-[0.3em] uppercase text-neutral-300">
            <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)] animate-pulse" />
            [ THE X1 SYSTEM ]
          </div>

          <h2
            id="holistic-heading-main"
            className="font-display text-2xl xs:text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white uppercase leading-tight sm:leading-[1.08] break-words"
          >
            TRAIN THE BODY.
            <br />
            <span className="text-neutral-400">CHALLENGE THE BRAIN.</span>
          </h2>

          <p
            id="holistic-supporting-line"
            className="text-neutral-400 text-xs sm:text-sm md:text-base font-light tracking-wide max-w-lg mx-auto"
          >
            Five direct training benefits powering one complete athletic dancer. Tap any circle or slide to explore.
          </p>
        </motion.div>

        {/* 2D POWERING RADIAL ENGINE CONTAINER (Spacious, balanced sizing for all mobile & desktop viewports) */}
        <div className="w-full max-w-[340px] xs:max-w-[370px] sm:max-w-[420px] md:max-w-[460px] aspect-square relative flex items-center justify-center p-1 sm:p-2 mx-auto my-1">
          {/* SVG Power Conduits, Inward Energy Flow, and Orbit Ring */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="-200 -200 400 400"
          >
            <defs>
              {/* Radial gradient for glowing core aura */}
              <radialGradient id="coreAura" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(255, 255, 255, 0.28)" />
                <stop offset="60%" stopColor="rgba(255, 255, 255, 0.06)" />
                <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
              </radialGradient>
            </defs>

            {/* Ambient Core Glow */}
            <circle cx="0" cy="0" r="85" fill="url(#coreAura)">
              <animate
                attributeName="r"
                values="75;95;75"
                dur="3s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.6;1;0.6"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Orbit Constellation Ring */}
            <circle
              cx="0"
              cy="0"
              r="126"
              fill="none"
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="1.5"
              strokeDasharray="4 6"
            />

            {/* Inward Energy Rays from Outer 5 Nodes into Center X1 CORE */}
            {nodePositions.map((node, i) => {
              const isActive = currentIndex === i;
              return (
                <g key={`conduit-${node.id}`}>
                  {/* Base Power Conduit Line */}
                  <line
                    x1={node.x}
                    y1={node.y}
                    x2="0"
                    y2="0"
                    stroke={isActive ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.18)'}
                    strokeWidth={isActive ? '2' : '1.5'}
                    className="transition-colors duration-300"
                  />

                  {/* Animated Inward Power Pulse (Moving toward X1 Core) */}
                  <circle r={isActive ? '3.5' : '2.5'} fill="#ffffff">
                    <animateMotion
                      path={`M ${node.x} ${node.y} L 0 0`}
                      dur={isActive ? '1.2s' : '2s'}
                      repeatCount="indefinite"
                      begin={`${i * 0.36}s`}
                    />
                    <animate
                      attributeName="opacity"
                      values="0.2;1;0.9;0"
                      dur={isActive ? '1.2s' : '2s'}
                      repeatCount="indefinite"
                      begin={`${i * 0.36}s`}
                    />
                  </circle>
                </g>
              );
            })}
          </svg>

          {/* POWERED CENTRAL X1 CORE WITH ENERGIZED PULSE ANIMATIONS */}
          <motion.div
            animate={{
              scale: [1, 1.03, 1],
              boxShadow: [
                '0 0 40px rgba(255,255,255,0.16), 0 0 15px rgba(0,0,0,0.95), inset 0 2px 4px rgba(255,255,255,0.45)',
                '0 0 65px rgba(255,255,255,0.32), 0 0 25px rgba(255,255,255,0.15), inset 0 2px 6px rgba(255,255,255,0.7)',
                '0 0 40px rgba(255,255,255,0.16), 0 0 15px rgba(0,0,0,0.95), inset 0 2px 4px rgba(255,255,255,0.45)',
              ],
            }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative z-10 w-22 h-22 xs:w-24 xs:h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-b from-[#252525] via-[#0e0e0e] to-[#040404] border-2 border-white/50 backdrop-blur-2xl flex flex-col items-center justify-center text-center group cursor-default"
          >
            {/* Outward soft energy pulse wave 1 */}
            <motion.div
              animate={{
                scale: [1, 1.35],
                opacity: [0.4, 0],
              }}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                ease: 'easeOut',
              }}
              className="absolute inset-0 rounded-full border border-white/35 pointer-events-none"
            />

            {/* Outward soft energy pulse wave 2 (offset) */}
            <motion.div
              animate={{
                scale: [1, 1.35],
                opacity: [0.3, 0],
              }}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                delay: 1.3,
                ease: 'easeOut',
              }}
              className="absolute inset-0 rounded-full border border-white/20 pointer-events-none"
            />

            {/* Spinning geometric energy reactor rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-2 rounded-full border border-dashed border-white/25 pointer-events-none"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-1 rounded-full border border-white/10 pointer-events-none"
            />

            {/* Inner Core Ambient Glow Accent */}
            <motion.div
              animate={{
                opacity: [0.3, 0.7, 0.3],
                scale: [0.85, 1.05, 0.85],
              }}
              transition={{
                duration: 3.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute inset-2.5 rounded-full bg-radial from-white/15 to-transparent blur-xs pointer-events-none"
            />

            {/* Inner Core Typography & Indicator */}
            <div className="relative flex flex-col items-center justify-center">
              <span className="font-brand text-xl xs:text-2xl sm:text-3xl md:text-4xl font-black text-chrome drop-shadow-[0_0_16px_rgba(255,255,255,0.6)] tracking-tight leading-none select-none">
                X1
              </span>
              <span className="font-brand text-[7.5px] xs:text-[8px] sm:text-[9.5px] font-bold tracking-[0.35em] text-neutral-300 uppercase mt-0.5 sm:mt-1">
                CORE
              </span>
              <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5 sm:mt-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/15">
                <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#fff] animate-ping" />
                <span className="text-[6.5px] sm:text-[7px] font-mono tracking-[0.25em] text-neutral-300 uppercase font-semibold">
                  POWERED
                </span>
              </div>
            </div>
          </motion.div>

          {/* 5 SURROUNDING POWERING CIRCLES (Clickable to switch slide) */}
          {nodePositions.map((node, i) => {
            const Icon = node.icon;
            const isActive = currentIndex === i;

            // Convert viewBox coords (-200..200) to percentage (0..100%)
            const leftPct = ((node.x + 200) / 400) * 100;
            const topPct = ((node.y + 200) / 400) * 100;

            return (
              <div
                key={node.id}
                style={{
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
              >
                <button
                  id={`x1-node-btn-${node.id}`}
                  onClick={() => handleSelect(i)}
                  className={`group relative flex flex-col items-center justify-center text-center rounded-full transition-all duration-300 cursor-pointer backdrop-blur-xl px-1 py-1 ${
                    isActive
                      ? 'w-[74px] h-[74px] xs:w-[80px] xs:h-[80px] sm:w-[90px] sm:h-[90px] md:w-[96px] md:h-[96px] bg-gradient-to-b from-white/30 via-white/15 to-[#121212] border-2 border-white scale-105 shadow-[0_0_25px_rgba(255,255,255,0.35),inset_0_2px_2px_rgba(255,255,255,0.4)]'
                      : 'w-[66px] h-[66px] xs:w-[72px] xs:h-[72px] sm:w-[82px] sm:h-[82px] md:w-[88px] md:h-[88px] bg-gradient-to-b from-[#181818]/95 via-[#0d0d0d] to-[#040404] border border-white/25 hover:border-white/60 hover:scale-105 shadow-[0_10px_25px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)]'
                  }`}
                  aria-label={`View ${node.title} benefits`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-4.5 sm:h-4.5 mb-0.5 transition-colors ${
                      isActive ? 'text-white' : 'text-neutral-300 group-hover:text-white'
                    }`}
                  />
                  <span className="font-grotesk text-[9px] xs:text-[10px] sm:text-[11.5px] md:text-[12px] font-bold tracking-tight text-white uppercase whitespace-nowrap leading-none px-1">
                    {node.title}
                  </span>
                  <span
                    className={`text-[6.5px] xs:text-[7px] sm:text-[8px] font-mono tracking-wider uppercase font-medium mt-0.5 whitespace-nowrap ${
                      isActive ? 'text-neutral-200 font-bold' : 'text-neutral-400'
                    }`}
                  >
                    {node.category.split(' ')[0]}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {/* COMPACT INTERACTIVE BENEFITS SLIDER */}
        <div className="w-full max-w-2xl mt-6 sm:mt-8">
          {/* Slider Container with Touch Swipe & Arrow Navigation */}
          <div className="relative bg-gradient-to-b from-[#141414] to-[#080808] border border-white/15 rounded-2xl p-5 sm:p-7 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] overflow-hidden">
            {/* Top subtle gloss line */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

            <div className="flex items-center justify-between gap-3 mb-4">
              {/* Pillar Title & Benefit Category */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                  {React.createElement(activePillar.icon, { className: 'w-5 h-5' })}
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg sm:text-xl font-black tracking-tight text-white uppercase truncate">
                      {activePillar.title}
                    </h3>
                    <span className="text-[9px] font-mono text-neutral-400 font-bold">
                      0{currentIndex + 1} / 0{pillars.length}
                    </span>
                  </div>
                  <p className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase truncate">
                    {activePillar.category}
                  </p>
                </div>
              </div>

              {/* Slider Arrows */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  id="pillar-slide-prev-btn"
                  onClick={handlePrev}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 active:scale-95 border border-white/10 text-white flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Previous benefit"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  id="pillar-slide-next-btn"
                  onClick={handleNext}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 active:scale-95 border border-white/10 text-white flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Next benefit"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Animated Benefit Description Body (Swipable) */}
            <div className="min-h-[90px] sm:min-h-[80px] flex items-center">
              <AnimatePresence mode="wait" custom={slideDirection}>
                <motion.div
                  key={activePillar.id}
                  custom={slideDirection}
                  initial={{ opacity: 0, x: slideDirection * 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: slideDirection * -25 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -40) handleNext();
                    else if (info.offset.x > 40) handlePrev();
                  }}
                  className="w-full cursor-grab active:cursor-grabbing"
                >
                  {/* Benefit Subtitle */}
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Sparkles className="w-3 h-3 text-neutral-400" />
                    <span className="text-[10px] sm:text-[11px] font-mono tracking-wider text-neutral-300 uppercase font-semibold">
                      {activePillar.benefitLabel}
                    </span>
                  </div>

                  <p className="text-neutral-300 text-xs sm:text-sm font-light leading-relaxed mb-3.5">
                    {activePillar.benefitDesc}
                  </p>

                  {/* Highlights Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    {activePillar.highlights.map((item, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/60 border border-white/10 text-[10px] font-mono font-medium text-neutral-300 uppercase tracking-wider"
                      >
                        <span className="w-1 h-1 rounded-full bg-white" />
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Pagination Line / Dots */}
            <div className="flex items-center justify-center gap-1.5 mt-5 pt-3 border-t border-white/5">
              {pillars.map((pillar, idx) => (
                <button
                  key={`dot-${pillar.id}`}
                  onClick={() => handleSelect(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx
                      ? 'w-8 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                      : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to ${pillar.title} benefit`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* UNDERNEATH STATEMENT & ANTHEM */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-3xl text-center space-y-4 mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-white/10 px-2"
        >
          <div className="space-y-1.5">
            <h3
              id="holistic-full-experience"
              className="font-display text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white uppercase break-words"
            >
              Dance is a full-body, full-brain experience.
            </h3>
            <p className="text-neutral-400 text-xs sm:text-sm font-light max-w-xl mx-auto leading-relaxed">
              It challenges coordination, rhythm, memory, and decision-making while building strength, endurance, and mobility.
            </p>
          </div>

          <div className="pt-2 sm:pt-3 space-y-1.5">
            <p
              id="holistic-anthem"
              className="font-display text-base xs:text-lg sm:text-2xl md:text-3xl font-black tracking-normal sm:tracking-wider text-white uppercase break-words"
            >
              MOVE. LEARN. ADAPT. EVOLVE.
            </p>
            <p
              id="holistic-final-line"
              className="text-[10px] xs:text-[11px] sm:text-xs font-mono tracking-[0.2em] sm:tracking-[0.25em] text-neutral-400 uppercase font-medium"
            >
              Not just training your dance. Training the dancer.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
