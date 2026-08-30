import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Sparkles, 
  QrCode, 
  Rotate3d, 
  Calendar, 
  MapPin, 
  User, 
  ShieldCheck, 
  Music, 
  Clock, 
  CheckCircle2, 
  Flame,
  Volume2,
  VolumeX,
  Maximize2,
  Layers,
  Sparkle
} from 'lucide-react';
import { TicketData } from '../../types/digitalPass';
import { playFlipSound, playClickSound, isSoundEnabled, setSoundEnabled } from '../../utils/passAudio';

interface Ticket3DProps {
  ticket: TicketData;
  isStageMode?: boolean;
  onOpenCheckIn?: () => void;
  onOpenWallet?: () => void;
}

export const Ticket3D: React.FC<Ticket3DProps> = ({ 
  ticket, 
  isStageMode = false,
  onOpenCheckIn,
  onOpenWallet
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 3D rotation state
  const [rotateX, setRotateX] = useState<number>(0);
  const [rotateY, setRotateY] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isAutoSpinning, setIsAutoSpinning] = useState<boolean>(true);
  const [glarePos, setGlarePos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [soundOn, setSoundOn] = useState<boolean>(isSoundEnabled());
  const [currentTime, setCurrentTime] = useState<string>('');

  const dragStartRef = useRef<{ x: number; y: number; rotX: number; rotY: number }>({
    x: 0,
    y: 0,
    rotX: 0,
    rotY: 0,
  });
  
  const animationFrameRef = useRef<number | null>(null);
  const autoSpinAngleRef = useRef<number>(0);

  // Live anti-counterfeit clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }) + '.' + String(now.getMilliseconds()).padStart(3, '0'));
    };
    updateTime();
    const interval = setInterval(updateTime, 73);
    return () => clearInterval(interval);
  }, []);

  // Ambient auto-float and gentle 3D rocking
  useEffect(() => {
    let t = 0;
    const animate = () => {
      if (isAutoSpinning && !isDragging) {
        t += 0.025;
        // Gentle floating pitch and yaw
        const floatPitch = Math.sin(t * 0.8) * 7;
        const floatYaw = Math.cos(t * 0.6) * 14;
        
        setRotateX(floatPitch);
        setRotateY(isFlipped ? 180 + floatYaw : floatYaw);
        
        // Update holographic sheen position
        setGlarePos({
          x: 50 + Math.cos(t) * 35,
          y: 50 + Math.sin(t * 0.8) * 35,
        });
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isAutoSpinning, isDragging, isFlipped]);

  // Pointer move handler (mouse tilt / lighting)
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      
      const newY = dragStartRef.current.rotY + deltaX * 0.55;
      const newX = Math.max(-45, Math.min(45, dragStartRef.current.rotX - deltaY * 0.45));
      
      setRotateX(newX);
      setRotateY(newY);
      return;
    }

    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const pctX = (x / rect.width) * 100;
    const pctY = (y / rect.height) * 100;
    setGlarePos({ x: pctX, y: pctY });

    if (!isAutoSpinning) {
      const normX = (x / rect.width) * 2 - 1;
      const normY = (y / rect.height) * 2 - 1;
      setRotateX(-normY * 18);
      setRotateY((isFlipped ? 180 : 0) + normX * 22);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      rotX: rotateX,
      rotY: rotateY,
    };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      // Ignored
    }
  };

  const toggleFlip = useCallback(() => {
    playFlipSound();
    setIsFlipped(prev => {
      const next = !prev;
      setRotateY(curr => (next ? 180 : 0));
      return next;
    });
  }, []);

  const resetOrientation = () => {
    playClickSound();
    setIsFlipped(false);
    setRotateX(0);
    setRotateY(0);
    setIsAutoSpinning(true);
  };

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playClickSound();
  };

  // Color Theme Styles
  const getThemeStyles = () => {
    switch (ticket.passColorTheme) {
      case 'vibrant':
        return {
          cardBg: 'from-[#1a0f30] via-[#120a24] to-[#0a0614]',
          borderColor: 'border-fuchsia-500/50',
          accentGradient: 'from-violet-400 via-fuchsia-400 to-pink-400',
          accentText: 'text-fuchsia-300',
          badgeBg: 'bg-fuchsia-950/80 border-fuchsia-500/50 text-fuchsia-300 shadow-[0_0_12px_rgba(217,70,239,0.3)]',
          glowColor: 'rgba(217, 70, 239, 0.35)',
          hologramColor: 'linear-gradient(135deg, rgba(168,85,247,0.4) 0%, rgba(236,72,153,0.35) 35%, rgba(6,182,212,0.3) 70%, rgba(245,158,11,0.35) 100%)',
          ribbon: 'from-violet-500 via-fuchsia-500 to-amber-400',
        };
      case 'ruby':
        return {
          cardBg: 'from-[#1e0810] via-[#14050b] to-[#0a0206]',
          borderColor: 'border-rose-500/50',
          accentGradient: 'from-rose-500 via-pink-400 to-amber-400',
          accentText: 'text-rose-400',
          badgeBg: 'bg-rose-950/80 border-rose-500/50 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.3)]',
          glowColor: 'rgba(244, 63, 94, 0.32)',
          hologramColor: 'linear-gradient(135deg, rgba(244,63,94,0.4) 0%, rgba(251,191,36,0.3) 50%, rgba(217,70,239,0.35) 100%)',
          ribbon: 'from-rose-500 via-pink-500 to-amber-400',
        };
      case 'holographic':
        return {
          cardBg: 'from-[#0d1230] via-[#090d22] to-[#040612]',
          borderColor: 'border-cyan-500/50',
          accentGradient: 'from-cyan-400 via-indigo-400 to-fuchsia-400',
          accentText: 'text-cyan-300',
          badgeBg: 'bg-cyan-950/80 border-cyan-500/50 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.3)]',
          glowColor: 'rgba(6, 182, 212, 0.32)',
          hologramColor: 'linear-gradient(135deg, rgba(6,182,212,0.4) 0%, rgba(99,102,241,0.35) 30%, rgba(236,72,153,0.35) 60%, rgba(245,158,11,0.35) 100%)',
          ribbon: 'from-cyan-400 via-indigo-500 to-fuchsia-500',
        };
      case 'obsidian':
        return {
          cardBg: 'from-[#161722] via-[#0e1017] to-[#08090d]',
          borderColor: 'border-violet-500/40',
          accentGradient: 'from-slate-200 via-violet-300 to-zinc-300',
          accentText: 'text-violet-300',
          badgeBg: 'bg-zinc-900/90 border-violet-500/40 text-violet-200 shadow-[0_0_10px_rgba(139,92,246,0.2)]',
          glowColor: 'rgba(139, 92, 246, 0.25)',
          hologramColor: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(168,85,247,0.25) 50%, rgba(6,182,212,0.2) 100%)',
          ribbon: 'from-violet-400 via-slate-300 to-amber-300',
        };
      case 'gold':
      default:
        return {
          cardBg: 'from-[#221706] via-[#160f04] to-[#0c0802]',
          borderColor: 'border-amber-500/50',
          accentGradient: 'from-amber-400 via-yellow-300 to-orange-500',
          accentText: 'text-amber-400',
          badgeBg: 'bg-amber-950/80 border-amber-500/50 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]',
          glowColor: 'rgba(245, 158, 11, 0.32)',
          hologramColor: 'linear-gradient(135deg, rgba(245,158,11,0.4) 0%, rgba(253,224,71,0.3) 40%, rgba(249,115,22,0.35) 70%, rgba(217,70,239,0.25) 100%)',
          ribbon: 'from-amber-400 via-yellow-300 to-rose-500',
        };
    }
  };

  const theme = getThemeStyles();

  return (
    <div 
      id="odt-3d-ticket-viewport"
      className="relative flex flex-col items-center justify-center w-full select-none py-6 perspective-[1400px]"
    >
      {/* 3D Scene Ambient Glow & Floor Shadow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[540px] h-[340px] sm:h-[400px] rounded-full blur-[100px] pointer-events-none transition-colors duration-700"
        style={{ background: theme.glowColor }}
      />

      {/* Floating 3D Ticket Stage */}
      <div
        ref={containerRef}
        id="odt-interactive-ticket-card"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className={`relative cursor-grab active:cursor-grabbing transition-transform duration-100 ease-out will-change-transform transform-style-3d ${
          isStageMode ? 'w-[94vw] max-w-[640px] min-h-[400px]' : 'w-full max-w-[560px] min-h-[350px] sm:min-h-[380px]'
        }`}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0px)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* ========================================================
            FRONT SIDE OF 3D TICKET
            ======================================================== */}
        <div 
          id="ticket-face-front"
          className={`relative w-full rounded-2xl sm:rounded-3xl border ${theme.borderColor} bg-gradient-to-br ${theme.cardBg} backdrop-blur-xl p-5 sm:p-7 shadow-2xl overflow-hidden transition-all duration-300 transform-style-3d`}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            boxShadow: `0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px 0 ${theme.glowColor}`,
          }}
        >
          {/* Holographic Sheen Specular Overlay */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.7) 0%, transparent 60%), ${theme.hologramColor}`,
            }}
          />

          {/* Micro-dot security pattern watermark */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px]" 
          />

          {/* Holographic Security Edge Ribbon */}
          <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${theme.ribbon}`} />

          {/* Ticket Header & Brand Identity */}
          <div className="relative flex items-center justify-between gap-3 border-b border-white/10 pb-4 mb-4">
            <div className="flex items-center gap-3">
              {/* ODT Hologram Icon */}
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-white/15 to-white/5 border border-white/20 p-0.5 flex items-center justify-center shadow-inner group">
                <div className="w-full h-full rounded-[10px] bg-black/60 flex items-center justify-center relative overflow-hidden">
                  <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-rose-500/20 blur-[2px]" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-['Syne'] font-extrabold text-base sm:text-lg tracking-wider text-white">
                    DANCE THEORY
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-white/10 text-white/80 border border-white/10">
                    TAMPA
                  </span>
                </div>
                <p className="text-[11px] text-white/60 font-medium tracking-wide">
                  Official Event & Class Pass
                </p>
              </div>
            </div>

            {/* Pass Tier Badge */}
            <div className={`px-2.5 sm:px-3 py-1 rounded-full border text-[10px] sm:text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-sm ${theme.badgeBg}`}>
              <Sparkles className="w-3 h-3 animate-spin" style={{ animationDuration: '6s' }} />
              <span>{ticket.tierName}</span>
            </div>
          </div>

          {/* Event Main Title */}
          <div className="relative mb-4">
            <h2 className="font-['Syne'] text-xl sm:text-2xl font-black text-white leading-tight tracking-tight drop-shadow-md">
              {ticket.eventName}
            </h2>
            <p className={`text-xs sm:text-sm font-medium mt-0.5 ${theme.accentText}`}>
              {ticket.subtitle}
            </p>
          </div>

          {/* Ticket Information Grid */}
          <div className="relative grid grid-cols-2 gap-3 sm:gap-4 bg-black/30 border border-white/5 rounded-xl p-3 sm:p-4 mb-4 backdrop-blur-sm">
            <div>
              <div className="flex items-center gap-1.5 text-white/50 text-[10px] sm:text-[11px] uppercase font-bold tracking-wider">
                <Calendar className="w-3 h-3 text-amber-400" />
                <span>Date & Time</span>
              </div>
              <p className="text-white text-xs sm:text-sm font-bold mt-0.5 line-clamp-1">
                {ticket.date}
              </p>
              <p className="text-white/70 text-[11px] font-medium">
                {ticket.time}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-white/50 text-[10px] sm:text-[11px] uppercase font-bold tracking-wider">
                <MapPin className="w-3 h-3 text-rose-400" />
                <span>Venue & City</span>
              </div>
              <p className="text-white text-xs sm:text-sm font-bold mt-0.5 line-clamp-1">
                {ticket.venueName}
              </p>
              <p className="text-white/70 text-[11px] font-medium truncate">
                {ticket.cityState}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-white/50 text-[10px] sm:text-[11px] uppercase font-bold tracking-wider">
                <User className="w-3 h-3 text-cyan-400" />
                <span>Attendee</span>
              </div>
              <p className="text-white text-xs sm:text-sm font-bold mt-0.5 truncate">
                {ticket.attendeeName}
              </p>
              <p className="text-white/50 text-[10px] font-mono">
                Order #{ticket.orderNumber}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-white/50 text-[10px] sm:text-[11px] uppercase font-bold tracking-wider">
                <Music className="w-3 h-3 text-purple-400" />
                <span>Instructors</span>
              </div>
              <p className="text-white text-xs sm:text-sm font-bold mt-0.5 truncate">
                {ticket.instructors.join(', ')}
              </p>
              <p className="text-emerald-400 text-[10px] font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 inline" /> Verified Pass
              </p>
            </div>
          </div>

          {/* Ticket Perforation & QR Fast-Scan Section */}
          <div className="relative pt-3 border-t border-dashed border-white/20 flex items-center justify-between gap-3">
            {/* Notch Cutout Left */}
            <div className="absolute -left-7 -top-3 w-5 h-6 rounded-r-full bg-[#090a0f] border-r border-white/10" />
            {/* Notch Cutout Right */}
            <div className="absolute -right-7 -top-3 w-5 h-6 rounded-l-full bg-[#090a0f] border-l border-white/10" />

            <div className="flex items-center gap-3">
              {/* QR Code Container with scan glow */}
              <div 
                onClick={onOpenCheckIn}
                title="Click to simulate gate check-in"
                className="group relative cursor-pointer bg-white p-1.5 rounded-lg shadow-lg hover:scale-105 transition-transform"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-black rounded flex items-center justify-center relative overflow-hidden">
                  {/* Dynamic QR SVG Pattern */}
                  <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
                    <rect x="10" y="10" width="30" height="30" fill="#000" stroke="#fff" strokeWidth="6" />
                    <rect x="20" y="20" width="10" height="10" fill="#fff" />
                    <rect x="60" y="10" width="30" height="30" fill="#000" stroke="#fff" strokeWidth="6" />
                    <rect x="70" y="20" width="10" height="10" fill="#fff" />
                    <rect x="10" y="60" width="30" height="30" fill="#000" stroke="#fff" strokeWidth="6" />
                    <rect x="20" y="70" width="10" height="10" fill="#fff" />
                    <rect x="45" y="15" width="8" height="18" fill="#fff" />
                    <rect x="45" y="45" width="10" height="10" fill="#fff" />
                    <rect x="60" y="45" width="15" height="8" fill="#fff" />
                    <rect x="80" y="60" width="10" height="25" fill="#fff" />
                    <rect x="45" y="65" width="20" height="10" fill="#fff" />
                    <rect x="70" y="75" width="8" height="15" fill="#fff" />
                  </svg>
                  
                  {/* Laser Scan line on hover */}
                  <div className="absolute inset-x-0 h-0.5 bg-red-500 shadow-[0_0_8px_#ef4444] animate-bounce opacity-75" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-white/90 font-mono text-[10px] sm:text-xs font-bold">
                  <span>{ticket.barcodeNumber.slice(0, 4)}</span>
                  <span>{ticket.barcodeNumber.slice(4, 8)}</span>
                  <span>{ticket.barcodeNumber.slice(8, 12)}</span>
                </div>
                <p className="text-[10px] text-white/50 font-medium">
                  {ticket.gateSection}
                </p>
                <div className="flex items-center gap-1 text-[9px] text-amber-400/90 font-mono mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                  <span>TAP TO FLIP OR SCAN</span>
                </div>
              </div>
            </div>

            {/* Quick Action Badges */}
            <div className="flex flex-col items-end gap-1">
              <button
                type="button"
                id="btn-flip-card-front"
                onClick={toggleFlip}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-white text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <Rotate3d className="w-3.5 h-3.5 text-amber-400" />
                <span>Flip Pass</span>
              </button>
              <span className="text-[9px] text-white/40 font-mono">ODT SECURE PASS</span>
            </div>
          </div>
        </div>

        {/* ========================================================
            BACK SIDE OF 3D TICKET (180deg Rotated)
            ======================================================== */}
        <div 
          id="ticket-face-back"
          className={`absolute inset-0 rounded-2xl sm:rounded-3xl border ${theme.borderColor} bg-gradient-to-br ${theme.cardBg} backdrop-blur-xl p-5 sm:p-7 shadow-2xl overflow-hidden transform-style-3d flex flex-col justify-between`}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            boxShadow: `0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px 0 ${theme.glowColor}`,
          }}
        >
          {/* Holographic Specular Layer on Back */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay"
            style={{
              background: `radial-gradient(circle at ${100 - glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.6) 0%, transparent 60%), ${theme.hologramColor}`,
            }}
          />

          {/* Top Bar on Back */}
          <div className="relative flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold tracking-wider text-white">
                GATE VERIFICATION & POLICY
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono text-[10px] text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
              <Clock className="w-3 h-3 animate-spin" style={{ animationDuration: '10s' }} />
              <span>LIVE SEC: {currentTime}</span>
            </div>
          </div>

          {/* Event Schedule Snapshot */}
          <div className="relative space-y-2 my-2 bg-black/40 p-3 rounded-xl border border-white/5 text-[11px]">
            <p className="text-white/60 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-amber-400" />
              Night Schedule & Entry Times:
            </p>
            {ticket.schedule.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-white/80">
                <span className="font-mono text-amber-400 font-bold shrink-0">{item.time}</span>
                <span className="text-white/90">{item.title}</span>
              </div>
            ))}
          </div>

          {/* Entry Rules & Studio Policies */}
          <div className="relative space-y-1 text-[10px] text-white/60">
            <p>• Valid government photo ID required at door. 18+ to enter, 21+ to drink.</p>
            <p>• Clean indoor dance shoes or suede soles strongly recommended.</p>
            <p>• Rotate partners during workshops or stick with your dance partner.</p>
            <p>• Questions? Contact <span className="text-amber-400">info@officialdancetheory.com</span></p>
          </div>

          {/* Gate Scanner Barcode Area */}
          <div className="relative pt-2 border-t border-dashed border-white/20 flex items-center justify-between gap-2">
            <div>
              {/* Simulated High Density Barcode */}
              <div className="flex items-center gap-[2px] h-9 bg-white px-2 py-1 rounded">
                {[4,2,3,1,5,2,1,4,3,2,5,1,2,4,1,3,2,4,1,5,3,2,1,4,2,3,5,1,2,4].map((width, i) => (
                  <div 
                    key={i} 
                    className="bg-black h-full" 
                    style={{ width: `${width}px` }} 
                  />
                ))}
              </div>
              <p className="text-[9px] font-mono text-white/50 mt-1">
                AUTH: {ticket.barcodeNumber} • ODT-TAMPA-GATE-1
              </p>
            </div>

            <button
              type="button"
              id="btn-flip-card-back"
              onClick={toggleFlip}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg"
            >
              <Rotate3d className="w-3.5 h-3.5" />
              <span>Front Pass</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3D Stage Floating Controls Bar */}
      <div 
        id="odt-ticket-controls"
        className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3 bg-white/5 border border-white/10 backdrop-blur-md px-3 sm:px-4 py-2 rounded-2xl shadow-xl z-10"
      >
        <button
          type="button"
          id="control-flip-ticket"
          onClick={toggleFlip}
          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95"
        >
          <Rotate3d className="w-3.5 h-3.5 text-amber-400" />
          <span>Flip ({isFlipped ? 'Back' : 'Front'})</span>
        </button>

        <button
          type="button"
          id="control-autospin-toggle"
          onClick={() => {
            playClickSound();
            setIsAutoSpinning(!isAutoSpinning);
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95 ${
            isAutoSpinning 
              ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300' 
              : 'bg-white/10 text-white/80 hover:bg-white/20'
          }`}
        >
          <Sparkle className="w-3.5 h-3.5" />
          <span>{isAutoSpinning ? 'Auto-Float: ON' : 'Auto-Float: OFF'}</span>
        </button>

        <button
          type="button"
          id="control-reset-orientation"
          onClick={resetOrientation}
          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95"
        >
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Reset 3D</span>
        </button>

        <button
          type="button"
          id="control-sound-toggle"
          onClick={toggleSound}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs transition-all cursor-pointer"
          title={soundOn ? 'Mute Sound Effects' : 'Enable Sound Effects'}
        >
          {soundOn ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-white/40" />}
        </button>

        {onOpenCheckIn && (
          <button
            type="button"
            id="control-simulate-checkin"
            onClick={onOpenCheckIn}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-black" />
            <span>Simulate Door Scan</span>
          </button>
        )}
      </div>

      <p className="text-[11px] text-white/40 font-medium mt-2 text-center">
        💡 Drag with your mouse or touch to inspect the 3D ticket in 360° space
      </p>
    </div>
  );
};
