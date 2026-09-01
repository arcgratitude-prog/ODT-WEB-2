import React from 'react';

// Simple, self-contained "coming soon" placeholder for Bachata X1.
// Matches the same font-brand chrome-text treatment as the real X1 page
// so it still feels on-brand rather than like a broken/empty page.
export const X1ComingSoon: React.FC = () => {
  return (
    <div className="bg-black text-[#ededed] antialiased overflow-x-hidden min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-24">
      <span className="inline-flex items-center gap-2 px-3.5 py-1 mb-8 bg-white/[0.03] border border-white/10 backdrop-blur-md rounded-full text-[10px] sm:text-xs font-mono tracking-[0.3em] uppercase text-neutral-300">
        <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)] animate-pulse" />
        Coming Soon
      </span>

      <h1 className="font-brand text-6xl xs:text-7xl sm:text-8xl md:text-8xl font-bold tracking-wider sm:tracking-widest text-chrome drop-shadow-[0_0_35px_rgba(255,255,255,0.35)] leading-none select-none mb-6">
        X1
      </h1>

      <p className="font-display text-xs sm:text-sm font-bold tracking-[0.3em] uppercase text-neutral-400 mb-3">
        Bachata X1
      </p>

      <p className="text-sm sm:text-base text-neutral-400 max-w-md">
        Something new is on the way. Private training sessions with Albina &amp; Antonio — details and booking coming soon.
      </p>
    </div>
  );
};
