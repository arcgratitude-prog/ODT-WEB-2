import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, ArrowUpRight } from 'lucide-react';

interface NavigationProps {
  onOpenJoin: () => void;
  onBackToSite: () => void;
  isAudioPlaying?: boolean;
  toggleAudio?: () => void;
}

export const X1Navigation: React.FC<NavigationProps> = ({
  onOpenJoin,
  onBackToSite,
  isAudioPlaying = false,
  toggleAudio,
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      id="main-navigation"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-black/90 backdrop-blur-md border-b border-white/10 py-4'
          : 'bg-transparent py-6 sm:py-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 flex items-center justify-between">
        {/* Brand Identity */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            id="nav-back-to-site"
            onClick={onBackToSite}
            className="text-[10px] sm:text-xs font-mono tracking-widest text-neutral-400 hover:text-white uppercase transition-colors"
          >
            &larr; ODT
          </button>
          <a
            href="#"
            id="nav-brand-logo"
            onClick={(e) => e.preventDefault()}
            className="group flex items-center gap-3 text-white focus:outline-none"
          >
            <span className="font-display text-2xl sm:text-3xl tracking-tighter font-black text-white group-hover:text-neutral-300 transition-colors">
              X1
            </span>
            <span className="hidden sm:inline-block text-[10px] tracking-[0.3em] text-neutral-400 uppercase font-mono">
              BACHATA X1
            </span>
          </a>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {toggleAudio && (
            <button
              id="nav-audio-toggle"
              onClick={toggleAudio}
              className="p-2 text-neutral-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
              aria-label={isAudioPlaying ? "Mute studio atmosphere" : "Play studio atmosphere"}
              title="Studio Atmosphere"
            >
              {isAudioPlaying ? (
                <Volume2 className="w-4 h-4 text-white" />
              ) : (
                <VolumeX className="w-4 h-4 text-neutral-500" />
              )}
            </button>
          )}

          <button
            id="nav-join-button"
            onClick={onOpenJoin}
            className="group inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold tracking-[0.2em] uppercase text-black bg-white hover:bg-neutral-200 border border-white transition-all duration-300 rounded-none cursor-pointer active:scale-95"
          >
            <span>JOIN X1</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </header>
  );
};


