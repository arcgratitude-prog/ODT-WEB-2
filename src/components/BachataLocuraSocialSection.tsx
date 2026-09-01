import React, { useState } from 'react';
import { Sparkles, Calendar, MapPin, ExternalLink, Flame, Copy, Check } from 'lucide-react';
import { STUDIO_INFO } from '../data/danceData';
import invasionFlyer from '../assets/images/bachata_invasion_flyer.jpg';
import locuraFlyer from '../assets/images/bachata_locura_flyer.jpg';
// BachataLocuraSocialSection component

interface BachataLocuraSocialSectionProps {
  onOpenBooking: (passTypeId?: string, quantity?: number) => void;
  onNavigateToHome?: () => void;
}

export const BachataLocuraSocialSection: React.FC<BachataLocuraSocialSectionProps> = ({ 
  onOpenBooking,
  onNavigateToHome 
}) => {
  const [activeTab, setActiveTab] = useState<'invasion' | 'locura'>('invasion');
  const [copiedInvasionAddress, setCopiedInvasionAddress] = useState(false);
  const [copiedLocuraAddress, setCopiedLocuraAddress] = useState(false);

  const handleCopyInvasionAddress = () => {
    navigator.clipboard.writeText("334 Westshore Plaza Unit A10, Tampa, FL 33609");
    setCopiedInvasionAddress(true);
    setTimeout(() => setCopiedInvasionAddress(false), 2000);
  };

  const handleCopyLocuraAddress = () => {
    navigator.clipboard.writeText("334 Westshore Plaza, Unit A10, Tampa, FL 33609");
    setCopiedLocuraAddress(true);
    setTimeout(() => setCopiedLocuraAddress(false), 2000);
  };

  return (
    <section id="social" className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative max-w-7xl mx-auto">
      
      {/* Social Event Switcher Header */}
      <div className="text-center space-y-3 mb-8">
        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase font-sans tracking-tight">
          ODT <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-rose-400">SOCIALS</span>
        </h1>

        {/* Dual Social Selector Tabs - 2 Tabs Side-by-Side */}
        <div className="grid grid-cols-2 gap-2 p-2 rounded-2xl bg-slate-900/90 border border-slate-700 shadow-2xl max-w-lg mx-auto w-full mt-2">
          <button
            onClick={() => setActiveTab('invasion')}
            className={`px-2.5 sm:px-4 py-3 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all flex flex-col items-center justify-center gap-1 text-center ${
              activeTab === 'invasion'
                ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white shadow-lg shadow-purple-600/40 border border-purple-400/50 scale-[1.02]'
                : 'text-slate-400 hover:text-slate-200 bg-slate-800/40 border border-slate-800'
            }`}
          >
            {/* Integrated Mobile-Friendly Date Badge */}
            <span className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm border ${
              activeTab === 'invasion'
                ? 'bg-black/40 text-pink-200 border-white/30'
                : 'bg-slate-900 text-pink-300 border border-pink-500/30'
            }`}>
              <Calendar className="w-2.5 h-2.5 text-pink-300" />
              <span>Fri • Sept 11</span>
            </span>
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-pink-400 shrink-0" />
              <span>Bachata Invasion</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('locura')}
            className={`px-2.5 sm:px-4 py-3 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all flex flex-col items-center justify-center gap-1 text-center ${
              activeTab === 'locura'
                ? 'bg-gradient-to-r from-slate-200 via-slate-100 to-slate-300 text-slate-950 shadow-lg shadow-white/30 border border-white/60 scale-[1.02]'
                : 'text-slate-400 hover:text-slate-200 bg-slate-800/40 border border-slate-800'
            }`}
          >
            {/* Integrated Mobile-Friendly Date Badge */}
            <span className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm border ${
              activeTab === 'locura'
                ? 'bg-black/60 text-amber-300 border-black/40'
                : 'bg-slate-900 text-amber-300 border border-amber-500/30'
            }`}>
              <Calendar className="w-2.5 h-2.5 text-amber-400" />
              <span>Sun • Sept 20</span>
            </span>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Bachata Locura</span>
            </div>
          </button>
        </div>
      </div>

      {/* TAB 1: BACHATA INVASION (MONTHLY SOCIAL) */}
      {activeTab === 'invasion' && (
        <div className="relative">
          {/* Neon Purple & Fuchsia Glow BG */}
          <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-900/40 via-purple-900/30 to-indigo-900/40 rounded-3xl blur-2xl pointer-events-none -z-10" />

          <div className="rounded-3xl p-6 sm:p-8 lg:p-10 border border-fuchsia-500/40 bg-gradient-to-br from-[#180924] via-[#11061a] to-[#0a0310] shadow-[0_0_60px_rgba(217,70,239,0.2)] relative overflow-hidden">

            {/* Flyer — the visual centerpiece. Framed and glowing in the
                card's own palette, with a soft fade at the bottom so it
                reads as part of the page rather than a pasted image. */}
            <div className="max-w-sm mx-auto mb-8">
              <div className="relative rounded-2xl overflow-hidden border border-fuchsia-400/50 shadow-[0_0_45px_rgba(236,72,153,0.35)]">
                <img
                  src={invasionFlyer}
                  alt="Bachata Invasion — every 2nd Friday at Dance Factory"
                  className="w-full h-auto block"
                />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0a0310] via-transparent to-transparent" />
                <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10 rounded-2xl" />
              </div>
            </div>

            {/* Readable summary — same info as the flyer, spelled out so no
                one has to zoom in to read it */}
            <div className="max-w-sm mx-auto mb-8 text-center space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black uppercase font-sans tracking-tight text-white">
                Bachata <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400">Invasion</span>
              </h2>
              <p className="text-sm text-purple-100">
                Friday, September 11th · 8 PM–1 AM · <span className="font-bold text-white">$12</span>
              </p>
              <p className="text-xs text-purple-300">
                8–9 PM Class with <span className="text-white font-semibold">Albina & Isaac</span> · Social Dancing with <span className="text-white font-semibold">DJ JR</span>
              </p>
              <p className="text-[10px] text-purple-400 uppercase tracking-wider font-bold">
                90% Bachata · 10% Salsa
              </p>
            </div>

            {/* Ticket Option — same visual system as Locura's circle row:
                the price is the big, featured, clickable circle in the
                middle; Class/Social Dancing are small info circles on
                either side (not separate purchasable tiers, just context). */}
            <div className="mb-8">
              <div className="flex items-center justify-center gap-4 sm:gap-6">

                {/* Class — info only */}
                <div className="flex flex-col items-center gap-1.5 opacity-70">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-zinc-900 border border-fuchsia-500/20 flex items-center justify-center">
                    <span className="text-[10px] sm:text-xs font-black text-purple-200 font-mono">8–9</span>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Class</span>
                  <span className="text-[8px] text-slate-500 uppercase tracking-wide -mt-1">Albina & Isaac</span>
                </div>

                {/* $12 — the featured, purchasable option. Glows/pulses so
                    it visually reads as the one to tap. */}
                <button
                  onClick={() => onOpenBooking('social-invasion-10')}
                  className="flex flex-col items-center gap-1.5 group relative"
                >
                  <span className="absolute top-0 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-fuchsia-400/40 blur-md animate-pulse pointer-events-none" />
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-b from-fuchsia-500 via-purple-600 to-slate-900 border-2 border-fuchsia-200/80 shadow-lg shadow-fuchsia-500/50 flex flex-col items-center justify-center transition-all group-hover:border-white group-hover:shadow-fuchsia-400/80 group-hover:shadow-xl group-hover:scale-105 group-active:scale-95">
                    <span className="text-xl sm:text-2xl font-black text-white font-mono">$12</span>
                  </div>
                  <span className="text-[10px] font-bold text-white uppercase tracking-wide">Tap to Get →</span>
                </button>

                {/* Social Dancing — info only */}
                <div className="flex flex-col items-center gap-1.5 opacity-70">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-zinc-900 border border-fuchsia-500/20 flex items-center justify-center">
                    <span className="text-[9px] sm:text-[10px] font-black text-purple-200 font-mono">9–1</span>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Social</span>
                  <span className="text-[8px] text-slate-500 uppercase tracking-wide -mt-1">DJ JR</span>
                </div>
              </div>
            </div>

            {/* Location & Directions */}
            <div className="p-5 rounded-2xl bg-black/60 border border-fuchsia-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-xl bg-purple-950 text-pink-300 border border-fuchsia-500/40 shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-white">
                    Dance Factory (Westshore Plaza Mall)
                  </h5>
                  <p className="text-xs text-purple-200 font-mono">
                    334 Westshore Plaza, Unit A10, Tampa, FL 33609
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <button
                  onClick={handleCopyInvasionAddress}
                  className="px-3.5 py-2 rounded-xl bg-purple-900/50 hover:bg-purple-900/80 text-purple-200 text-xs font-bold flex items-center gap-1.5 border border-purple-500/30 transition-all"
                >
                  {copiedInvasionAddress ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedInvasionAddress ? 'Address Copied!' : 'Copy Address'}</span>
                </button>

                <a
                  href={STUDIO_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-fuchsia-950 hover:bg-fuchsia-900 text-white text-xs font-bold flex items-center gap-1.5 border border-fuchsia-500/40 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: BACHATA LOCURA (SPECIALTY EVENT) */}
      {activeTab === 'locura' && (
        <div className="relative">
          {/* Background Liquid Chrome Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 via-zinc-800/20 to-slate-900/60 rounded-3xl blur-2xl pointer-events-none -z-10" />

          <div className="rounded-3xl p-6 sm:p-10 border border-slate-300/40 bg-gradient-to-br from-[#121318] via-[#0d0e12] to-[#08080a] shadow-[0_0_50px_rgba(255,255,255,0.08)] relative overflow-hidden">

            {/* Flyer — the visual centerpiece. Framed and glowing in the
                card's own palette, with a soft fade at the bottom so it
                reads as part of the page rather than a pasted image. */}
            <div className="max-w-sm mx-auto mb-8">
              <div className="relative rounded-2xl overflow-hidden border border-slate-300/50 shadow-[0_0_45px_rgba(255,255,255,0.15)]">
                <img
                  src={locuraFlyer}
                  alt="Bachata Locura — Tropical Midnight Edition, September 20th"
                  className="w-full h-auto block"
                />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#08080a] via-transparent to-transparent" />
                <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10 rounded-2xl" />
              </div>
            </div>

            {/* Readable summary — same info as the flyer, spelled out so no
                one has to zoom in to read it */}
            <div className="max-w-sm mx-auto mb-8 text-center space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black uppercase font-sans tracking-tight text-white">
                Bachata <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-slate-300 to-slate-500">Locura</span>
              </h2>
              <p className="text-sm text-slate-300">
                Sunday, September 20th · 4–9 PM · Dress: Pink & Purple
              </p>
              <p className="text-xs text-slate-400">
                Presocial Class at 4 PM with <span className="text-white font-semibold">Albina & Isaac</span> · Music by <span className="text-white font-semibold">DJ JR</span>
              </p>
              <p className="text-xs text-slate-500">
                Westshore Plaza Mall · 334 Westshore Plaza, Unit A10, Tampa, FL 33609
              </p>
            </div>

            {/* Essentials — schedule in one row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 max-w-2xl mx-auto">
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-center">
                <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest block mb-1">4 PM</span>
                <span className="text-sm text-white font-bold block">Presocial Class</span>
                <span className="text-xs text-slate-400 mt-0.5 block">Albina & Isaac</span>
              </div>
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-center">
                <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest block mb-1">4–9 PM</span>
                <span className="text-sm text-white font-bold block">Social Dancing</span>
                <span className="text-xs text-slate-400 mt-0.5 block">DJ JR</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-slate-300/30 text-center">
                <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest block mb-1">Venue</span>
                <span className="text-sm text-white font-bold block">Westshore Plaza Mall</span>
                <span className="text-xs text-slate-400 mt-0.5 block">Tampa, FL</span>
              </div>
            </div>

            {/* Ticket Options — simple round price badges. Pre-Sale is the
                only one that's clickable/purchasable online, so it's the
                biggest circle in the middle; Students/At the Door are
                small door-only info badges on either side. */}
            <div className="mb-8">
              <div className="flex items-center justify-center gap-4 sm:gap-6">

                {/* Students — door only */}
                <div className="flex flex-col items-center gap-1.5 opacity-70">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-zinc-900 border border-white/15 flex items-center justify-center">
                    <span className="text-sm sm:text-base font-black text-emerald-400 font-mono">$15</span>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Student</span>
                  <span className="text-[8px] text-slate-500 uppercase tracking-wide -mt-1">Present ID at Door</span>
                </div>

                {/* Pre-Sale — the featured, purchasable option. Glows/pulses
                    so it visually reads as the one to tap. */}
                <button
                  onClick={() => onOpenBooking('social-presale')}
                  className="flex flex-col items-center gap-1.5 group relative"
                >
                  {/* Save $5 banner */}
                  <span className="absolute -top-2 z-10 px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-400 to-fuchsia-400 text-black text-[9px] font-black uppercase tracking-wide shadow-md">
                    Save $5
                  </span>
                  {/* Soft ambient pulse ring behind the circle */}
                  <span className="absolute top-0 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-fuchsia-400/40 blur-md animate-pulse pointer-events-none" />
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-b from-fuchsia-500 via-purple-600 to-slate-900 border-2 border-fuchsia-200/80 shadow-lg shadow-fuchsia-500/50 flex flex-col items-center justify-center transition-all group-hover:border-white group-hover:shadow-fuchsia-400/80 group-hover:shadow-xl group-hover:scale-105 group-active:scale-95">
                    <span className="text-[9px] font-bold text-fuchsia-100 uppercase tracking-wide">Pre-Sale</span>
                    <span className="text-xl sm:text-2xl font-black text-white font-mono">$15</span>
                  </div>
                  <span className="text-[10px] font-bold text-white uppercase tracking-wide">Tap to Get →</span>
                </button>

                {/* At the Door — door only */}
                <div className="flex flex-col items-center gap-1.5 opacity-70">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-zinc-900 border border-white/15 flex items-center justify-center">
                    <span className="text-sm sm:text-base font-black text-slate-200 font-mono">$20</span>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">At Door</span>
                </div>

              </div>

              <p className="text-center text-[10px] text-slate-500 mt-3">
                Pre-sale ends 9/19 · Students show ID at the door · At the door, pay in person
              </p>
            </div>

            {/* Location & Directions */}
            <div className="p-5 rounded-2xl bg-black/60 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-xl bg-slate-800 text-slate-200 border border-slate-600 shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-white">
                    Westshore Plaza Mall
                  </h5>
                  <p className="text-xs text-slate-300 font-mono">
                    334 Westshore Plaza, Unit A10, Tampa, FL 33609
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <button
                  onClick={handleCopyLocuraAddress}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-white/10 transition-all"
                >
                  {copiedLocuraAddress ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLocuraAddress ? 'Address Copied!' : 'Copy Address'}</span>
                </button>

                <a
                  href={STUDIO_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 border border-slate-600 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};

