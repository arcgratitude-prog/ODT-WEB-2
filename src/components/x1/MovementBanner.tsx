import React from 'react';
import { motion } from 'motion/react';
import movementTrainImg from '../../assets/images/x1/x1_movement_train_1788137728480.jpg';

export const MovementBanner: React.FC = () => {
  return (
    <section
      id="movement-banner-section"
      className="relative w-full min-h-[80vh] sm:min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Large Cinematic Image of Dancers Training */}
      <div className="absolute inset-0 z-0 select-none">
        <img
          src={movementTrainImg}
          alt="Dancers in intense dynamic training"
          className="w-full h-full object-cover object-center filter brightness-[0.4] contrast-125 grayscale"
          referrerPolicy="no-referrer"
        />
        {/* Pure dark gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Overlay: TRAIN. MOVE. EVOLVE. */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 w-full">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, staggerChildren: 0.15 }}
          className="flex flex-col space-y-2 sm:space-y-4 font-display font-black text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] tracking-tight text-white uppercase leading-none select-none"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="block text-white"
          >
            TRAIN.
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="block text-neutral-300"
          >
            MOVE.
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="block text-neutral-400"
          >
            EVOLVE.
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
};


