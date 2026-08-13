import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Calendar, MapPin, ArrowRight, Music, Clock, Users, Play, ShieldCheck, MessageCircle, Instagram, Flame, ExternalLink, Volume2, VolumeX } from 'lucide-react';
import { STUDIO_INFO } from '../data/danceData';
import { AiUrbanoLogo } from './AiUrbanoLogo';
import { AutoPlayVideo } from './AutoPlayVideo';
import coupleImg from '../../albina_isaac_directors.jpg';
import studioHeroImg from '../assets/images/urban_studio_hero_1784906979054.jpg';

interface HeroProps {
  onOpenBooking: (passTypeId?: string) => void;
  onToggleMusic: () => void;
  isPlayingMusic: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenBooking,
  onToggleMusic,
  isPlayingMusic
}) => {
  const [isClassMuted, setIsClassMuted] = useState(true);
  const [isDancingMuted, setIsDancingMuted] = useState(true);
  const [isDesktopScreen, setIsDesktopScreen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsDesktopScreen(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleClassMute = () => {
    setIsClassMuted(prev => {
      const next = !prev;
      if (!next) {
        setIsDancingMuted(true);
      }
      return next;
    });
  };

  const toggleDancingMute = () => {
    setIsDancingMuted(prev => {
      const next = !prev;
      if (!next) {
        setIsClassMuted(true);
      }
      return next;
    });
  };
  // Countdown to August 5th
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('2026-08-05T19:00:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[90vh] pt-20 sm:pt-28 pb-12 sm:pb-16 px-3.5 sm:px-6 lg:px-8 flex flex-col justify-center overflow-hidden urban-brick-bg">
      
      {/* Background Studio Hero image with dark gradient mask & liquid glow blur */}
      <div className="absolute inset-0 z-0 opacity-25 mix-blend-luminosity pointer-events-none overflow-hidden">
        <img 
          src={studioHeroImg} 
          alt="Urban Studio Backdrop" 
          className="w-full h-full object-cover scale-105 filter blur-[2px]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-[#090a0f]/80 to-transparent" />
      </div>

      {/* Floating Ambient Glowing Liquid Blobs */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-red-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-blue-600/15 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto w-full">

        {/* MAIN CONTENT GRID: Left = Headlines & Booking / Right = Instructor Photo + 2 Videos + WhatsApp & Location */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start w-full">
          
          {/* Left Column: Headlines & Information */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            
            {/* Badges Header Row */}
            {/* Desktop Version: Full text pill badges */}
            <div className="hidden sm:flex flex-wrap items-center gap-2">
              <a 
                href={STUDIO_INFO.instagramUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="glass-badge px-4 py-1.5 rounded-full text-xs font-black tracking-[0.2em] text-red-400 hover:text-white hover:bg-red-600/30 uppercase flex items-center gap-2 border border-red-500/40 shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all"
                title="Visit @ai.urbano on Instagram"
              >
                <Instagram className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                {STUDIO_INFO.instagram}
              </a>

              <a 
                href={STUDIO_INFO.whatsappLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="glass-badge px-4 py-1.5 rounded-full text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:bg-emerald-600/30 uppercase flex items-center gap-2 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
                title="Join Urban Bachata WhatsApp Group"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                WhatsApp Community
              </a>

              <a 
                href={STUDIO_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-badge px-4 py-1.5 rounded-full text-xs font-medium text-white/80 hover:text-white flex items-center gap-1.5"
                title="Dance Factory Location"
              >
                <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                Dance Factory • WestShore Plaza
              </a>
            </div>

            {/* Mobile Version: Single Line with 3 Circular Icon Buttons */}
            <div className="flex sm:hidden items-center gap-3 py-1">
              {/* Dance Factory Location Circle */}
              <a 
                href={STUDIO_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-slate-900/95 hover:bg-slate-800 border border-white/30 shadow-lg flex items-center justify-center text-red-400 transition-transform active:scale-95"
                title="Dance Factory Location (Google Maps)"
              >
                <MapPin className="w-5 h-5 text-red-400" />
              </a>

              {/* WhatsApp Community Circle */}
              <a 
                href={STUDIO_INFO.whatsappLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-emerald-950/95 hover:bg-emerald-900 border border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center justify-center text-emerald-400 transition-transform active:scale-95"
                title="Join Urban Bachata WhatsApp Community"
              >
                <MessageCircle className="w-5 h-5 text-emerald-400" />
              </a>

              {/* Instagram Circle */}
              <a 
                href={STUDIO_INFO.instagramUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-red-950/95 hover:bg-red-900 border border-red-500/60 shadow-[0_0_15px_rgba(220,38,38,0.4)] flex items-center justify-center text-red-400 transition-transform active:scale-95"
                title="Visit @ai.urbano on Instagram"
              >
                <Instagram className="w-5 h-5 text-red-400" />
              </a>
            </div>

            {/* Main Title Banner */}
            <div className="space-y-3 relative w-full">
              <div>
                <span className="text-red-500 font-bold tracking-[0.3em] uppercase text-xs block">
                  EVERY WEDNESDAY
                </span>

                <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tighter text-white uppercase font-sans leading-[0.95]">
                  BACHATA CLASSES <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-300 to-red-600 urban-text-glow font-mono">
                    IN TAMPA
                  </span>
                </h1>
              </div>

              <p className="text-base sm:text-lg text-white/80 max-w-xl font-light leading-relaxed pt-1">
                Learn Bachata in Tampa, FL with directors Albina & Isaac! Top-rated beginner Bachata classes, progressive 4-week tracks, and Urban Sensual Bachata flow at Dance Factory in WestShore Plaza. No partner needed!
              </p>
            </div>

            {/* Primary Action Buttons (Liquid Glass) */}
            <div className="flex flex-wrap items-center gap-3 pt-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  const el = document.getElementById('passes');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                id="hero-join-class-btn"
                className="liquid-glass-btn liquid-btn-primary px-6 py-3.5 rounded-2xl text-sm font-extrabold text-white flex items-center justify-center gap-2.5 shadow-xl shadow-red-600/40 w-full sm:w-auto"
              >
                <Calendar className="w-4 h-4 text-red-400" />
                <span>Join a Class</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onToggleMusic}
                id="hero-audio-vibe-btn"
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-center gap-2 text-xs font-semibold ${
                  isPlayingMusic 
                    ? 'bg-red-600/30 text-red-300 border-red-500/50 shadow-lg shadow-red-500/30' 
                    : 'bg-white/5 text-slate-300 border-white/15 hover:bg-white/10'
                }`}
                title="Play Urban Bachata Beat"
              >
                <Music className={`w-4 h-4 ${isPlayingMusic ? 'animate-bounce text-red-400' : ''}`} />
                <span className="hidden sm:inline">{isPlayingMusic ? 'Beat Playing...' : 'Play Vibe'}</span>
              </button>
            </div>

            {/* Quick Stats Trust Bar */}
            <div className="pt-4 border-t border-white/10 w-full flex flex-wrap items-center justify-between gap-2 sm:gap-4 text-slate-300 text-[11px] sm:text-xs font-medium">
              <div className="flex items-center gap-1.5 shrink-0">
                <Clock className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>Wednesdays 7-10 PM</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Users className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>No Partner Required</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Free Mall Parking</span>
              </div>
            </div>

          </div>

          {/* Right Column: Instructor Photo Card + 2 Videos Below + WhatsApp & Location Buttons */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center gap-5 w-full mx-auto max-w-[480px] lg:max-w-none">
            
            {/* 1. TOP: The Instructor Picture Card */}
            <div className="relative w-full aspect-[4/3] rounded-[32px] overflow-hidden border border-white/25 shadow-[0_25px_60px_rgba(0,0,0,0.85)] z-10 bg-[#0a0a0c] group hover:scale-[1.02] transition-transform duration-500">
              {/* Image Wrapper */}
              <div className="relative w-full h-full bg-slate-950/80">
                <img 
                  src={coupleImg} 
                  alt="AI Urbano Bachata Tampa Directors Albina and Isaac - Bachata Dance Instructors in Tampa FL" 
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Glossy gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 z-20" />
                <div className="absolute inset-0 bg-red-950/20 mix-blend-overlay z-10 pointer-events-none" />

                {/* Floating Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-30">
                  <span className="glass-badge px-3 py-1 rounded-full text-[10px] font-mono font-bold text-white tracking-widest uppercase border border-white/30 shadow-xl bg-black/60 backdrop-blur-md">
                    PRO INSTRUCTORS
                  </span>
                  <span className="glass-badge px-3 py-1 rounded-full text-[10px] font-bold text-red-400 bg-black/80 border border-red-500/50 uppercase tracking-widest shadow-xl backdrop-blur-md">
                    TAMPA, FL
                  </span>
                </div>

                {/* Bottom Card Information overlay */}
                <div className="absolute bottom-4 left-5 right-5 z-30 pointer-events-none">
                  <p className="text-[10px] tracking-[0.35em] uppercase text-red-400 font-mono font-extrabold mb-1">ALBINA & ISAAC</p>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">Urban Bachata Directors</h3>
                </div>
              </div>
            </div>

            {/* 2. MIDDLE: Two Auto-Playing Video Reels BELOW the Instructor Photo (all screen sizes) */}
            {(
              <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
                
                {/* Video 1: CLASS */}
                <div className="relative aspect-[9/14] rounded-[24px] overflow-hidden border border-amber-500/40 shadow-xl bg-black group hover:scale-[1.03] transition-transform duration-300 z-20">
                  {/* Top Center Badge */}
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                    <span className="px-2.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-mono font-extrabold text-black bg-amber-400 flex items-center gap-1 shadow-md uppercase tracking-wider whitespace-nowrap">
                      <Users className="w-2.5 h-2.5 text-black" />
                      <span>CLASS</span>
                    </span>
                  </div>

                  {/* Top Right Controls */}
                  <div className="absolute top-2.5 right-2.5 z-30 pointer-events-auto">
                    <button
                      onClick={toggleClassMute}
                      className="p-1 rounded-full bg-black/80 text-white hover:bg-amber-500 transition-colors border border-white/20"
                      title={isClassMuted ? "Unmute Class Sound" : "Mute Class Sound"}
                    >
                      {isClassMuted ? (
                        <VolumeX className="w-3 h-3 text-amber-300" />
                      ) : (
                        <Volume2 className="w-3 h-3 text-emerald-400 animate-pulse" />
                      )}
                    </button>
                  </div>

                  {/* Auto-playing Class Video */}
                  <div className="absolute inset-0 w-full h-full bg-black">
                    <AutoPlayVideo
                      src="/videos/urbano_wednesday_class.mp4"
                      isMuted={isClassMuted}
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none z-10" />
                  </div>

                  {/* Bottom Caption Overlay */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 z-20 pointer-events-none">
                    <span className="text-[8px] font-mono font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                      Live Class Vibe
                    </span>
                    <p className="text-[10px] sm:text-xs font-bold text-white truncate">Wednesday Socials</p>
                  </div>
                </div>

                {/* Video 2: AI.URBANO */}
                <div className="relative aspect-[9/14] rounded-[24px] overflow-hidden border border-rose-500/50 shadow-xl bg-black group hover:scale-[1.03] transition-transform duration-300 z-20">
                  {/* Top Center Badge */}
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                    <span className="px-2.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-mono font-extrabold text-white bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 flex items-center gap-1 shadow-md uppercase tracking-wider whitespace-nowrap">
                      <Flame className="w-2.5 h-2.5 text-yellow-300 animate-pulse" />
                      <span>AI.URBANO</span>
                    </span>
                  </div>

                  {/* Top Right Controls */}
                  <div className="absolute top-2.5 right-2.5 z-30 flex items-center gap-1 pointer-events-auto">
                    <button
                      onClick={toggleDancingMute}
                      className="p-1 rounded-full bg-black/80 text-white hover:bg-pink-600 transition-colors border border-white/20"
                      title={isDancingMuted ? "Unmute Dancing Sound" : "Mute Dancing Sound"}
                    >
                      {isDancingMuted ? (
                        <VolumeX className="w-3 h-3 text-rose-300" />
                      ) : (
                        <Volume2 className="w-3 h-3 text-emerald-400 animate-pulse" />
                      )}
                    </button>

                    <a
                      href="https://www.instagram.com/reel/DaYnhyGJtQ_/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded-full bg-black/80 text-white hover:bg-pink-600 transition-colors border border-white/20"
                      title="Open on Instagram"
                    >
                      <Instagram className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Auto-playing Dancing Video */}
                  <div className="absolute inset-0 w-full h-full bg-black">
                    <AutoPlayVideo
                      src="/videos/albina_isaac_partner_flow.mp4"
                      isMuted={isDancingMuted}
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none z-10" />
                  </div>

                  {/* Bottom Caption Overlay */}
                  <a
                    href="https://www.instagram.com/reel/DaYnhyGJtQ_/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between text-white text-xs pointer-events-auto"
                  >
                    <div>
                      <span className="text-[8px] font-mono font-bold text-pink-300 uppercase tracking-wider block">
                        Urban Bachata Flow
                      </span>
                      <p className="text-[10px] sm:text-xs font-bold text-white truncate">Albina & Isaac Demo</p>
                    </div>
                    <ExternalLink className="w-3 h-3 text-pink-400 shrink-0" />
                  </a>
                </div>

              </div>
            )}

            {/* 3. BOTTOM: WhatsApp Community & Dance Factory Location Buttons BELOW the Pictures & Videos (Desktop Only - Mobile uses circular icons above) */}
            <div className="hidden sm:flex flex-row items-center justify-center gap-2.5 w-full">
              <a 
                href={STUDIO_INFO.whatsappLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-2xl text-xs font-bold text-emerald-300 hover:text-white bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-500/50 shadow-lg shadow-emerald-950/50 uppercase flex items-center justify-center gap-2 transition-all"
                title="Join Urban Bachata WhatsApp Group"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>AI Urbano WhatsApp Community</span>
              </a>

              <a 
                href={STUDIO_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-2xl text-xs font-semibold text-white/90 bg-slate-900/90 hover:bg-slate-800 border border-white/20 uppercase flex items-center justify-center gap-2 transition-all shadow-md"
                title="View Dance Factory on Google Maps"
              >
                <MapPin className="w-4 h-4 text-red-400 shrink-0" />
                <span>Dance Factory Location</span>
              </a>
            </div>

            {/* Decorative Outer Ambient Glow */}
            <div className="absolute w-[420px] h-[420px] rounded-full bg-gradient-to-r from-red-600/10 to-rose-600/10 blur-3xl pointer-events-none -z-10" />

          </div>

        </div>

      </div>
    </section>
  );
};
