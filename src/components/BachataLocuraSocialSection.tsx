import React, { useState } from 'react';
import { Sparkles, Calendar, MapPin, Ticket, ExternalLink, Flame, ArrowRight, Copy, Check } from 'lucide-react';
import { STUDIO_INFO } from '../data/danceData';
import invasionFlyer from '../assets/images/bachata_invasion_flyer.jpg';
import locuraFlyer from '../assets/images/bachata_locura_flyer.jpg';
// BachataLocuraSocialSection component

interface BachataLocuraSocialSectionProps {
  onOpenBooking: (passTypeId?: string) => void;
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
    navigator.clipboard.writeText("11109 N 30th St, Tampa, FL 33612");
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
              <span>2nd Fri • Aug 14</span>
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
              <span>Sun • Aug 16</span>
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
                Every 2nd Friday · 8 PM–1 AM · <span className="font-bold text-white">$12</span>
              </p>
              <p className="text-xs text-purple-300">
                8–9 PM Class with <span className="text-white font-semibold">Albina & Isaac</span> · Social Dancing with <span className="text-white font-semibold">DJ JR</span>
              </p>
            </div>

            {/* Get Ticket CTA */}
            <div className="flex justify-center mb-8">
              <button
                onClick={() => onOpenBooking('social-invasion-10')}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-fuchsia-600/40 transition-all transform hover:scale-[1.03] border border-pink-300/40"
              >
                <Ticket className="w-4 h-4 text-white" />
                <span>Get $12 Ticket</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
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
                  alt="Bachata Locura — Tropical Midnight Edition, September 13th"
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
                Sunday, September 13th · 4–9 PM · Dress: Pink & Purple
              </p>
              <p className="text-xs text-slate-400">
                4 PM Presocial Class with <span className="text-white font-semibold">Albina & Isaac</span> · Social Dancing with <span className="text-white font-semibold">DJ JR</span>
              </p>
              <p className="text-xs text-slate-500">
                Yuengling Draft Haus · 11109 N 30th St, Tampa, FL 33612
              </p>
            </div>

            {/* Ticket Options */}
            <div className="mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                {/* Tier 1: Pre-Sale */}
                <div
                  onClick={() => onOpenBooking('social-presale')}
                  className="p-5 rounded-2xl bg-gradient-to-b from-slate-800/80 to-zinc-900 border border-slate-300/50 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-slate-200 transition-all cursor-pointer"
                >
                  <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-l from-slate-200 to-slate-400 text-black text-[10px] font-black uppercase rounded-bl-xl tracking-wider">
                    SAVE $5
                  </div>

                  <div>
                    <h4 className="text-lg font-black text-white uppercase font-sans">
                      Pre-Sale
                    </h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Ends 10/11
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-baseline justify-between">
                    <span className="text-2xl font-black text-white font-mono">$15</span>
                    <span className="text-[11px] font-bold text-slate-300 group-hover:text-white transition-colors">
                      Get Ticket →
                    </span>
                  </div>
                </div>

                {/* Tier 2: College Students */}
                <div
                  onClick={() => onOpenBooking('social-presale')}
                  className="p-5 rounded-2xl bg-gradient-to-b from-zinc-900 to-black border border-white/10 shadow-lg flex flex-col justify-between hover:border-slate-400/40 transition-all cursor-pointer group"
                >
                  <div>
                    <h4 className="text-lg font-black text-white uppercase font-sans">
                      Students
                    </h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Valid student ID
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-baseline justify-between">
                    <span className="text-2xl font-black text-emerald-400 font-mono">$12</span>
                    <span className="text-[11px] font-bold text-slate-400 group-hover:text-emerald-300 transition-colors">
                      Get Ticket →
                    </span>
                  </div>
                </div>

                {/* Tier 3: At the Door */}
                <div
                  onClick={() => onOpenBooking('social-presale')}
                  className="p-5 rounded-2xl bg-gradient-to-b from-zinc-900 to-black border border-white/10 shadow-lg flex flex-col justify-between hover:border-slate-400/40 transition-all cursor-pointer group"
                >
                  <div>
                    <h4 className="text-lg font-black text-white uppercase font-sans">
                      At the Door
                    </h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Day of event
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-baseline justify-between">
                    <span className="text-2xl font-black text-slate-200 font-mono">$20</span>
                    <span className="text-[11px] font-bold text-slate-400 group-hover:text-slate-200 transition-colors">
                      Info →
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Location & Directions */}
            <div className="p-5 rounded-2xl bg-black/60 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-xl bg-slate-800 text-slate-200 border border-slate-600 shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-white">
                    Yuengling Draft Haus
                  </h5>
                  <p className="text-xs text-slate-300 font-mono">
                    11109 N 30th St, Tampa, FL 33612
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
                  href="https://maps.google.com/?q=Yuengling+Draft+Haus+11109+N+30th+St+Tampa+FL+33612"
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

