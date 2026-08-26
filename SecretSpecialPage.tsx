import React, { useState, useEffect } from 'react';
import { Lock, QrCode, Sparkles, CheckCircle2, Clock, ShieldCheck, Ticket, AlertTriangle, ArrowRight, Copy, Check, Eye, EyeOff, Radio, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SECRET_OPEN_HOUSE_PASS, STUDIO_INFO } from '../data/danceData';

interface SecretSpecialPageProps {
  onOpenBooking: (passTypeId?: string) => void;
  onNavigateHome: () => void;
}

export const SecretSpecialPage: React.FC<SecretSpecialPageProps> = ({
  onOpenBooking,
  onNavigateHome
}) => {
  // Deactivation state toggle (Active by default, deactivates next day)
  const [isOfferActive, setIsOfferActive] = useState<boolean>(true);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [showQrProjector, setShowQrProjector] = useState<boolean>(false);
  
  // Countdown timer state (e.g. 23 hours 59 mins)
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 23,
    minutes: 59,
    seconds: 45
  });

  useEffect(() => {
    if (!isOfferActive) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          setIsOfferActive(false);
          return { hours: 0, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOfferActive]);

  const secretUrl = `${window.location.origin}${window.location.pathname}?code=OPENHOUSE120`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(secretUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleClaimPass = () => {
    if (!isOfferActive) return;
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
    onOpenBooking('secret-open-house-120');
  };

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto min-h-screen">
      
      {/* Top Banner: Secret Scan Verification */}
      <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-red-950/80 via-zinc-900 to-red-950/80 border border-red-500/50 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600/30 border border-red-500/50 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest flex items-center gap-1">
                <Radio className="w-3 h-3 animate-ping text-red-500" />
                ON-SITE ACCESS GRANTED
              </span>
              <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[10px] font-mono font-bold border border-red-500/30">
                PROMO CODE: OPENHOUSE120
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Unlocked via Open House QR Code Scan. Unlisted private page.
            </p>
          </div>
        </div>

        {/* Studio Owner / Admin Simulator Controls */}
        <div className="flex items-center gap-2 shrink-0 bg-slate-950/80 p-2 rounded-xl border border-white/10 text-xs">
          <span className="text-[10px] text-slate-400 uppercase font-mono font-bold pl-1">Status:</span>
          <button
            onClick={() => setIsOfferActive(!isOfferActive)}
            className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
              isOfferActive 
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' 
                : 'bg-red-900/80 text-red-300 border border-red-500/40'
            }`}
            title="Click to toggle offer active / deactivated state"
          >
            {isOfferActive ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>ACTIVE (120)</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>DEACTIVATED</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Container */}
      {isOfferActive ? (
        <div className="space-y-10">
          
          {/* Hero Deal Card */}
          <div className="liquid-glass-card rounded-3xl p-6 sm:p-10 border-2 border-red-500/60 shadow-[0_0_50px_rgba(220,38,38,0.3)] bg-gradient-to-b from-slate-900 via-zinc-950 to-slate-950 relative overflow-hidden text-center space-y-6">
            
            {/* Background Glow Badges */}
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-red-600/20 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-48 h-48 rounded-full bg-rose-600/20 blur-3xl pointer-events-none" />

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-red-600/40 animate-pulse">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              SPECIAL OPEN HOUSE ATTENDEE OFFER
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl font-black text-white font-sans uppercase tracking-tight leading-tight">
                4-WEEK URBAN BACHATA CYCLE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-300 to-red-500 urban-text-glow">
                  ONLY $120
                </span>
              </h1>
              <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto font-sans">
                Regular price is $200. Claim this exclusive on-site discount to lock in all 12 classes across 4 Wednesdays for just $120 ($10 per class)!
              </p>
            </div>

            {/* Price Tag & Countdown Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto pt-2">
              
              {/* Pricing Box */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-red-500/40 flex flex-col justify-center items-center">
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  SPECIAL OPEN HOUSE RATE
                </span>
                <div className="flex items-baseline gap-3 my-1">
                  <span className="text-4xl sm:text-5xl font-black font-mono text-white">$120</span>
                  <span className="text-lg font-mono text-slate-500 line-through">$200</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  SAVE $80 INSTANTLY
                </span>
              </div>

              {/* Countdown Timer Box */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-700/80 flex flex-col justify-center items-center">
                <span className="text-[11px] font-mono font-bold text-red-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                  OFFER DEACTIVATES IN
                </span>
                <div className="flex items-center gap-2 font-mono font-black text-2xl sm:text-3xl text-white my-2">
                  <div className="bg-slate-950 px-3 py-1 rounded-xl border border-white/10">
                    {String(timeLeft.hours).padStart(2, '0')}h
                  </div>
                  <span>:</span>
                  <div className="bg-slate-950 px-3 py-1 rounded-xl border border-white/10">
                    {String(timeLeft.minutes).padStart(2, '0')}m
                  </div>
                  <span>:</span>
                  <div className="bg-slate-950 px-3 py-1 rounded-xl border border-white/10 text-red-400">
                    {String(timeLeft.seconds).padStart(2, '0')}s
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  Deactivates tomorrow at midnight
                </span>
              </div>

            </div>

            {/* Features Checklist */}
            <div className="pt-4 max-w-xl mx-auto text-left bg-slate-950/60 p-6 rounded-2xl border border-white/10 space-y-3">
              <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">
                WHAT'S INCLUDED IN YOUR $120 PASS:
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                {SECRET_OPEN_HOUSE_PASS.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Main CTA Button */}
            <div className="pt-2 max-w-md mx-auto space-y-3">
              <button
                onClick={handleClaimPass}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-sm uppercase tracking-wider shadow-2xl shadow-red-600/50 flex items-center justify-center gap-3 transition-transform hover:scale-[1.02]"
              >
                <Ticket className="w-5 h-5 text-white" />
                <span>CLAIM $120 OPEN HOUSE PASS NOW</span>
                <ArrowRight className="w-5 h-5 text-white" />
              </button>

              <p className="text-[11px] text-slate-400 font-mono">
                ✓ Instant mobile ticket generated • Guaranteed spot in 4-week cycle
              </p>
            </div>

          </div>

          {/* Studio Organizer QR Projector / Scanner Tool */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-white uppercase font-sans flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-red-400" />
                  STUDIO ORGANIZER QR CODE TOOL
                </h3>
                <p className="text-xs text-slate-300">
                  Project or print this QR code at the Open House venue so dancers can scan to access this $120 rate!
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowQrProjector(!showQrProjector)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-600 flex items-center gap-1.5"
                >
                  {showQrProjector ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>{showQrProjector ? 'Hide QR Screen' : 'Show Full QR Code'}</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 rounded-xl bg-red-600/30 hover:bg-red-600/50 text-red-200 text-xs font-bold border border-red-500/40 flex items-center gap-1.5"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'Link Copied!' : 'Copy Secret Link'}</span>
                </button>
              </div>
            </div>

            {/* QR Projector View */}
            {showQrProjector && (
              <div className="pt-4 border-t border-slate-800 flex flex-col items-center justify-center p-8 bg-slate-950 rounded-2xl border border-red-500/30 text-center space-y-4 animate-in fade-in">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 font-mono text-xs font-bold">
                  SCAN WITH PHONE CAMERA TO OPEN $120 RATE
                </div>

                {/* Styled Large QR Code Simulation */}
                <div className="p-6 bg-white rounded-3xl shadow-2xl border-4 border-red-500 flex flex-col items-center justify-center">
                  <QrCode className="w-56 h-56 text-slate-950" />
                  <span className="text-[11px] font-mono font-black text-slate-900 mt-2">
                    OPENHOUSE120 • TAMPA URBAN BACHATA
                  </span>
                </div>

                <div className="max-w-md text-xs text-slate-400 font-mono">
                  Directs attendees to: <br />
                  <span className="text-red-400 break-all">{secretUrl}</span>
                </div>
              </div>
            )}
          </div>

        </div>
      ) : (
        /* Deactivated / Expired State */
        <div className="liquid-glass-card rounded-3xl p-8 sm:p-12 border border-slate-800 bg-slate-900/90 text-center space-y-6 max-w-2xl mx-auto my-12">
          
          <div className="w-16 h-16 rounded-2xl bg-red-950 text-red-400 border border-red-500/40 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest">
              OFFER EXPIRED & DEACTIVATED
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white uppercase font-sans">
              THIS $120 SPECIAL IS NO LONGER ACTIVE
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto">
              This special Open House rate of $120 was exclusively available for on-site attendees on August 5th and has now expired.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onNavigateHome}
              className="px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg"
            >
              View Standard Class Passes
            </button>
            <button
              onClick={() => setIsOfferActive(true)}
              className="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold border border-slate-700 flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reactivate Offer (Admin Test)</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
