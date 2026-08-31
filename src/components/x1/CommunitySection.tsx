import React from 'react';
import { motion } from 'motion/react';
import communityCrewImg from '../../assets/images/x1/x1_community_crew_1788137741983.jpg';

export const CommunitySection: React.FC = () => {
  return (
    <section
      id="community-section"
      className="relative w-full min-h-[50vh] sm:min-h-[60vh] flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Cinematic Photo of Dancers Together in Dark Studio */}
      <div className="absolute inset-0 z-0 select-none">
        <img
          src={communityCrewImg}
          alt="Dancers together in cohesive formation in a dark studio"
          className="w-full h-full object-cover object-center filter brightness-[0.4] contrast-125 grayscale"
          referrerPolicy="no-referrer"
        />
        {/* Pure black overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Typography: Small heading ONE ROOM. Large heading ONE STANDARD. */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-12 w-full text-center flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4 sm:space-y-6"
        >
          {/* Small heading: ONE ROOM. */}
          <p
            id="community-small-heading"
            className="text-xs sm:text-sm md:text-base font-mono tracking-[0.35em] text-neutral-400 uppercase font-medium"
          >
            ONE ROOM.
          </p>

          {/* Large heading: ONE STANDARD. */}
          <h2
            id="community-large-heading"
            className="font-display text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black tracking-tight text-white uppercase leading-none select-none"
          >
            ONE STANDARD.
          </h2>
        </motion.div>
      </div>
    </section>
  );
};


