import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import albumCoverImg from '../assets/images/albina_and_isaac_1784919294060.jpg';

interface BackgroundVinylPlayerProps {
  videoId?: string;
}

export const BackgroundVinylPlayer: React.FC<BackgroundVinylPlayerProps> = ({
  videoId = "kE1-O0tU-UU"
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Unlock audio on iOS Safari on initial touch gesture
  useEffect(() => {
    const unlockAudio = () => {
      if (iframeRef.current && isPlaying) {
        try {
          iframeRef.current.contentWindow?.postMessage(
            JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
            '*'
          );
        } catch {
          // Ignore
        }
      }
    };

    window.addEventListener('touchstart', unlockAudio, { once: true, passive: true });
    window.addEventListener('click', unlockAudio, { once: true, passive: true });

    return () => {
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('click', unlockAudio);
    };
  }, [isPlaying]);

  // Toggle Play / Pause with user interaction
  const togglePlay = (e?: React.MouseEvent | React.TouchEvent) => {
    e?.stopPropagation();
    setIsPlaying(prev => !prev);
  };

  const toggleMute = (e?: React.MouseEvent | React.TouchEvent) => {
    e?.stopPropagation();
    setIsMuted(prev => !prev);
  };

  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&playsinline=1&rel=0`;

  return (
    <>
      {/* Floating Vinyl Player Button */}
      <div className="fixed bottom-20 right-3.5 sm:bottom-auto sm:top-20 sm:right-6 z-40 flex items-center gap-2 pointer-events-auto">
        
        {/* Vinyl Disc Container Button */}
        <div 
          className="relative group/vinyl cursor-pointer shrink-0"
          onClick={togglePlay}
          title={isPlaying ? "Click to Pause En Privado" : "Click to Play En Privado"}
        >
          {/* Animated Glow Aura when playing */}
          <div 
            className={`absolute -inset-1.5 rounded-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 blur-md transition-opacity duration-300 ${
              isPlaying ? 'opacity-80 animate-pulse' : 'opacity-0 group-hover/vinyl:opacity-50'
            }`}
          />

          {/* Outer Vinyl Disc Body */}
          <div 
            className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-zinc-950 border-2 border-red-500/70 shadow-2xl flex items-center justify-center overflow-hidden transition-all duration-300 group-hover/vinyl:scale-110 active:scale-95 ${
              isPlaying ? 'animate-spin' : ''
            }`}
            style={{ animationDuration: '3s' }}
          >
            {/* Vinyl Grooves Texture Rings */}
            <div className="absolute inset-1 rounded-full border border-zinc-800/80 pointer-events-none z-0" />
            <div className="absolute inset-2 rounded-full border border-zinc-800/80 pointer-events-none z-0" />
            <div className="absolute inset-3.5 rounded-full border border-zinc-800/80 pointer-events-none z-0" />

            {/* Album Cover Center Label */}
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-amber-400/90 overflow-hidden relative z-10 shadow-lg flex items-center justify-center bg-black">
              <img 
                src={albumCoverImg} 
                alt="En Privado" 
                className="w-full h-full object-cover object-center" 
              />
              {/* Spindle Center Hole */}
              <div className="w-2 h-2 rounded-full bg-black border border-white/60 absolute z-20" />
            </div>
          </div>

          {/* Center Play/Pause Badge Indicator Overlay */}
          <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/80 backdrop-blur-sm border border-white/60 flex items-center justify-center transition-all ${
              isPlaying ? 'opacity-0 group-hover/vinyl:opacity-100 scale-90 group-hover/vinyl:scale-100' : 'opacity-100 scale-100'
            }`}>
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 text-white fill-white" />
              ) : (
                <Play className="w-4 h-4 text-yellow-300 fill-yellow-300 ml-0.5" />
              )}
            </div>
          </div>

          {/* Mute/Unmute Badge Toggle */}
          <button
            onClick={toggleMute}
            className="absolute -top-1 -right-1 z-40 p-1 rounded-full bg-slate-900/90 border border-red-500/60 text-white hover:bg-red-950 transition-transform hover:scale-110 shadow-lg"
            title={isMuted ? "Unmute En Privado" : "Mute En Privado"}
          >
            {isMuted ? (
              <VolumeX className="w-3 h-3 text-red-400" />
            ) : (
              <Volume2 className="w-3 h-3 text-emerald-400 animate-pulse" />
            )}
          </button>

          {/* Audio Playing Wave Indicator Badge */}
          {isPlaying && !isMuted && (
            <div className="absolute -bottom-1 -left-1 z-40 px-1.5 py-0.5 rounded-full bg-red-600 text-white text-[8px] font-mono font-bold border border-white/40 flex items-center gap-0.5 shadow-md">
              <span className="w-0.5 h-2 bg-white rounded-full animate-pulse" />
              <span className="w-0.5 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
              <span className="w-0.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
            </div>
          )}
        </div>

        {/* YouTube Background Player Frame for En Privado */}
        {isPlaying && (
          <iframe
            ref={iframeRef}
            src={embedUrl}
            title="En Privado - Background Song"
            className="w-12 h-12 opacity-[0.01] pointer-events-none absolute inset-0 z-0 overflow-hidden"
            allow="autoplay; encrypted-media; picture-in-picture"
          />
        )}
      </div>
    </>
  );
};


