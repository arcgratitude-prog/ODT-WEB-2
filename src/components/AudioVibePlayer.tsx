import React, { useState } from 'react';
import { Play, Volume2, Radio, ExternalLink, Sparkles, Youtube, Music } from 'lucide-react';

interface AudioVibePlayerProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const AudioVibePlayer: React.FC<AudioVibePlayerProps> = ({ isPlaying, onTogglePlay }) => {
  const [showVideo, setShowVideo] = useState<boolean>(false);

  const playlistUrl = "https://youtu.be/FUo0kZd2OZ4?si=qlXeWbJJ_-HpY7zM";
  const embedUrl = "https://www.youtube-nocookie.com/embed/FUo0kZd2OZ4?autoplay=1&rel=0";

  const handleStartPlay = () => {
    setShowVideo(true);
    onTogglePlay();
  };

  return (
    <section id="vibe" className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative max-w-7xl mx-auto">
      
      <div className="liquid-glass-panel rounded-3xl p-6 sm:p-10 border border-red-500/40 shadow-2xl relative overflow-hidden bg-gradient-to-r from-[#0a0a0c] via-[#140608]/90 to-[#0a0a0c]">
        
        {/* Top Header Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-badge border border-red-500/40 text-xs font-mono font-bold text-red-400">
            <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span>AI URBANO OFFICIAL PLAYLIST</span>
          </div>

          <a
            href={playlistUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-1.5 rounded-full text-xs font-bold text-red-300 bg-red-950/60 border border-red-500/40 hover:bg-red-900 transition-all flex items-center gap-1.5"
          >
            <Youtube className="w-4 h-4 text-red-500" />
            <span>Listen on YouTube</span>
            <ExternalLink className="w-3 h-3 text-red-400" />
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Playlist Details & Description */}
          <div className="lg:col-span-5 space-y-4 text-center lg:text-left">
            <h3 className="text-3xl sm:text-5xl font-black text-white uppercase font-sans tracking-tight leading-none">
              FEEL THE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-300 to-red-600 urban-text-glow">
                URBAN RHYTHM
              </span>
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
              Immerse yourself in AI Urbano’s hand-picked Bachata playlist! Featuring high-energy urban flow, sensual remixes, syncopated beats, and social dance essentials curated for Tampa dancers.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              {!showVideo ? (
                <button
                  onClick={handleStartPlay}
                  id="audio-synth-play-btn"
                  className="liquid-glass-btn liquid-btn-primary px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-3 shadow-xl shadow-red-600/40 transition-all hover:scale-105"
                >
                  <Play className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                  <span>PLAY PLAYLIST IN APP</span>
                </button>
              ) : (
                <div className="px-4 py-2.5 rounded-2xl bg-red-950/80 border border-red-500/40 text-xs font-mono font-bold text-red-300 flex items-center gap-2">
                  <Music className="w-4 h-4 text-red-400 animate-bounce" />
                  <span>NOW PLAYING AI URBANO PLAYLIST</span>
                </div>
              )}

              <a
                href={playlistUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="liquid-glass-btn liquid-btn-secondary px-5 py-3.5 rounded-2xl text-xs font-bold text-slate-200 hover:text-white flex items-center gap-2"
              >
                <Youtube className="w-4 h-4 text-red-500" />
                <span>Open in YouTube</span>
              </a>
            </div>

            {/* Vibe Metrics */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-3 text-[11px] font-mono text-slate-400">
              <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                Urban & Sensual Remixes
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-red-400" />
                100% Danceable Beats
              </span>
            </div>
          </div>

          {/* Right Column: Embedded YouTube Video Container */}
          <div className="lg:col-span-7 w-full">
            <div className="relative rounded-2xl overflow-hidden border border-red-500/40 shadow-2xl bg-black aspect-video group">
              {!showVideo ? (
                <div 
                  onClick={handleStartPlay}
                  className="absolute inset-0 bg-gradient-to-t from-black via-zinc-900/90 to-black/80 flex flex-col items-center justify-center p-6 text-center cursor-pointer group-hover:scale-105 transition-transform duration-500"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-red-600 to-rose-600 flex items-center justify-center shadow-2xl shadow-red-600/50 mb-4 border border-red-400/50">
                    <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-white ml-1" />
                  </div>

                  <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest mb-1">
                    AI URBANO TAMPA BAY
                  </span>
                  <h4 className="text-lg sm:text-2xl font-black text-white uppercase font-sans">
                    LISTEN TO OUR OFFICIAL BACHATA PLAYLIST
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 max-w-sm">
                    Click to start playback directly on this page
                  </p>
                </div>
              ) : (
                <iframe
                  src={embedUrl}
                  title="AI Urbano Bachata Playlist"
                  className="w-full h-full rounded-2xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              )}
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};

