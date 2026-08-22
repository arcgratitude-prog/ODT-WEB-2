import React, { useState } from 'react';
import { Instagram, Sparkles, ExternalLink, Volume2, VolumeX, Flame } from 'lucide-react';
import { AutoPlayVideo } from './AutoPlayVideo';

interface DanceReelShowcaseProps {
  reelUrl?: string;
}

export const DanceReelShowcase: React.FC<DanceReelShowcaseProps> = ({
  reelUrl = "https://www.instagram.com/reel/DaYnhyGJtQ_/"
}) => {
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative max-w-7xl mx-auto my-6">
      
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/15 via-rose-600/15 to-purple-600/15 rounded-3xl blur-3xl pointer-events-none -z-10" />

      <div className="liquid-glass-panel rounded-3xl p-6 sm:p-10 border border-red-500/40 shadow-2xl relative overflow-hidden bg-gradient-to-br from-[#0c050a] via-[#15070e] to-[#0a0408]">
        
        {/* Top Header Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-badge border border-red-500/40 text-xs font-mono font-bold text-red-400">
            <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
            <span>SEE THEM DANCING LIVE</span>
          </div>

          <a
            href={reelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 border border-pink-400/40 transition-all flex items-center gap-1.5 shadow-lg shadow-pink-600/30"
          >
            <Instagram className="w-4 h-4 text-white" />
            <span>Watch on Instagram</span>
            <ExternalLink className="w-3 h-3 text-white/80" />
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Description & Highlights */}
          <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '5s' }} />
              <span>ALBINA & ISAAC • URBAN BACHATA DANCE DEMO</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-sans tracking-tight leading-none">
              SEE US IN <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 urban-text-glow">
                ACTION ON THE FLOOR
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
              Get a preview of what you will learn! Check out Albina & Isaac performing urban bachata flow, musicality isolations, smooth partnerwork, and social dancing vibes in Tampa.
            </p>

            {/* Key Dancing Highlights */}
            <div className="grid grid-cols-2 gap-3 pt-1 text-xs font-medium text-slate-200">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-600/30 border border-red-500/40 flex items-center justify-center text-red-400 font-bold">
                  01
                </div>
                <span>Sensual & Urban Flow</span>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-pink-600/30 border border-pink-500/40 flex items-center justify-center text-pink-400 font-bold">
                  02
                </div>
                <span>Hip Hop Isolations</span>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-400 font-bold">
                  03
                </div>
                <span>Smooth Partner Connection</span>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-600/30 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
                  04
                </div>
                <span>Social Dance Musicality</span>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <button
                onClick={toggleMute}
                className="liquid-glass-btn liquid-btn-primary px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2.5 shadow-xl shadow-rose-600/40"
              >
                {isMuted ? (
                  <>
                    <Volume2 className="w-4 h-4 text-white" />
                    <span>Unmute Dance Music</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4 text-white" />
                    <span>Mute Audio</span>
                  </>
                )}
              </button>

              <a
                href={reelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all border border-white/20"
              >
                <Instagram className="w-4 h-4 text-pink-400" />
                <span>Open Instagram Reel</span>
              </a>
            </div>

          </div>

          {/* Right Column: Native Auto-Playing HTML5 Video Container */}
          <div className="lg:col-span-6 w-full flex justify-center">
            <div className="relative w-full max-w-[340px] sm:max-w-[380px] rounded-3xl overflow-hidden border border-rose-500/40 shadow-2xl bg-black aspect-[9/16] min-h-[480px] max-h-[600px] group">
              
              <AutoPlayVideo
                src="/videos/albina_isaac_partner_flow.mp4"
                isMuted={isMuted}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none z-10" />

              {/* Mute/Unmute Toggle Button */}
              <button
                onClick={toggleMute}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/80 backdrop-blur-md text-white hover:bg-pink-600 transition-colors border border-white/30 shadow-lg"
                title={isMuted ? "Click to unmute music" : "Click to mute music"}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-rose-300" />
                ) : (
                  <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                )}
              </button>

              {/* Direct Link Overlay Banner */}
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-black/80 backdrop-blur-md border border-white/20 flex items-center justify-between text-xs text-white z-20">
                <div className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-pink-400" />
                  <span className="font-bold">Albina & Isaac Dance Reel</span>
                </div>
                <a
                  href={reelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 font-bold text-[11px] text-white transition-all flex items-center gap-1"
                >
                  <span>Instagram</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
