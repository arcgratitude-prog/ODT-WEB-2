import React from 'react';
import { motion } from 'motion/react';

const steps = [
  { id: '01', word: 'WARM UP' },
  { id: '02', word: 'MOBILITY' },
  { id: '03', word: 'ISOLATION' },
  { id: '04', word: 'TRAIN' },
  { id: '05', word: 'CONCEPT' },
  { id: '06', word: 'MOVEMENT' },
  { id: '07', word: 'APPLY' },
];

export const ExperienceTimeline: React.FC = () => {
  return (
    <section
      id="experience-timeline-section"
      className="relative w-full bg-black px-6 sm:px-12 py-16 sm:py-20 border-t border-b border-white/10"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section title */}
        <div className="mb-12 sm:mb-16 border-b border-white/10 pb-4">
          <span className="text-[11px] sm:text-xs font-mono tracking-[0.3em] uppercase text-neutral-400">
            THE 90-MINUTE EXPERIENCE
          </span>
        </div>

        {/* Minimal List of 7 stages */}
        <div className="divide-y divide-white/5">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.5,
                delay: index * 0.04,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group flex items-baseline justify-between py-5 sm:py-6 transition-colors duration-200"
            >
              <div className="flex items-baseline gap-6 sm:gap-10">
                <span className="text-xs font-mono text-neutral-600 group-hover:text-white transition-colors">
                  {step.id}
                </span>
                <span className="font-display text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-400 group-hover:text-white transition-colors duration-200 uppercase">
                  {step.word}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};


