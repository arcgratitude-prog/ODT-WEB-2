import React, { useState } from 'react';
import { Sparkles, Calendar, Clock, MapPin, Ticket, ExternalLink, ShieldCheck, Flame, Music, Users, ArrowRight, Copy, Check, Zap, Radio } from 'lucide-react';
import { STUDIO_INFO } from '../data/danceData';
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
      
      {/* Top Navigation Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        {onNavigateToHome && (
          <button
            onClick={onNavigateToHome}
            className="px-4 py-2 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold flex items-center gap-2 transition-all shadow-md group"
          >
            <span className="text-red-400 group-hover:-translate-x-1 transition-transform">←</span>
            <span>Back to Wednesday Classes & Studio Schedule</span>
          </button>
        )}

        <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
          <span>TAMPA BAY BACHATA SOCIAL DANCE NIGHTS</span>
        </span>
      </div>

      {/* Social Event Switcher Header */}
      <div className="text-center space-y-3 mb-8">
        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase font-sans tracking-tight">
          ODT <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-rose-400">SOCIALS</span>
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto">
          We host 2 iconic social dance events in Tampa Bay! Join our monthly 2nd Friday night party at Dance Factory or our specialty Sunday socials.
        </p>

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

          <div className="rounded-3xl p-4 sm:p-8 lg:p-10 border border-fuchsia-500/40 bg-gradient-to-br from-[#180924] via-[#11061a] to-[#0a0310] shadow-[0_0_60px_rgba(217,70,239,0.2)] relative overflow-hidden">
            
            {/* Top Badge Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 pb-6 border-b border-fuchsia-500/20">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold tracking-widest text-fuchsia-200 bg-fuchsia-950/80 border border-fuchsia-500/40 uppercase max-w-full">
                  MONTHLY SOCIAL • EVERY 2ND FRIDAY
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold tracking-widest text-pink-300 bg-pink-950/60 border border-pink-500/40 uppercase flex items-center gap-1.5 max-w-full">
                  <Flame className="w-3.5 h-3.5 text-pink-400" />
                  <span>90% BACHATA / 10% SALSA</span>
                </span>
              </div>

              <div className="px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-black tracking-widest text-white bg-gradient-to-r from-purple-600 to-pink-600 border border-purple-400/40 shadow-lg shadow-purple-600/30 uppercase flex items-center gap-1.5 self-start sm:self-auto max-w-full">
                <Zap className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
                <span>FRIDAY AT DANCE FACTORY</span>
              </div>
            </div>

            {/* Header Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-10">
              
              <div className="lg:col-span-7 space-y-4 text-left">
                <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-pink-300 uppercase bg-pink-950/50 px-3 py-1 rounded-lg border border-pink-500/30">
                  <Calendar className="w-4 h-4 text-pink-400" />
                  EVERY 2ND FRIDAY OF THE MONTH • 8:00 PM - 1:00 AM
                </div>

                <h2 className="text-4xl sm:text-6xl font-black uppercase font-sans tracking-tight leading-none text-white">
                  BACHATA <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400 drop-shadow-[0_0_25px_rgba(236,72,153,0.5)]">
                    INVASION
                  </span>
                </h2>

                <p className="text-sm sm:text-base text-purple-100 leading-relaxed max-w-xl">
                  Tampa’s highest energy monthly Friday night Bachata social! Kick off the night with an 8 PM workshop led by <strong className="text-white">Albina & Isaac (AI Urbano / ODT)</strong>, then dance all night to fire tracks with <strong className="text-white">DJ JR</strong>!
                </p>

                {/* Artists & DJs Highlights */}
                <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono">
                  <span className="px-3 py-1 rounded-xl bg-purple-900/60 border border-purple-500/40 text-purple-200">
                    🎧 DJ JR on Decks
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-purple-900/60 border border-purple-500/40 text-purple-200">
                    💃 Class by Albina & Isaac (AI Urbano / ODT)
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
                    🚗 FREE Mall Parking
                  </span>
                </div>
              </div>

              {/* Schedule Box */}
              <div className="lg:col-span-5 bg-gradient-to-br from-purple-950/80 via-fuchsia-950/60 to-black p-6 rounded-2xl border border-fuchsia-500/40 shadow-2xl space-y-4">
                <div className="text-xs font-bold text-pink-300 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-pink-400" />
                    INVASION SCHEDULE
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-pink-500 text-black font-black text-[10px]">
                    ONLY $12
                  </span>
                </div>

                <div className="space-y-3 divide-y divide-fuchsia-500/20">
                  <div className="pt-1 flex justify-between items-center text-xs sm:text-sm">
                    <div>
                      <span className="text-purple-200 font-medium block">8:00 PM - 9:00 PM</span>
                      <span className="text-white font-bold">Urban Bachata Class by Albina & Isaac</span>
                    </div>
                    <span className="font-mono text-pink-300 bg-purple-900/80 px-2.5 py-1 rounded-lg text-xs font-bold">
                      Class
                    </span>
                  </div>

                  <div className="pt-3 flex justify-between items-center text-xs sm:text-sm">
                    <div>
                      <span className="text-purple-200 font-medium block">9:00 PM - 1:00 AM</span>
                      <span className="text-white font-bold">Social Dancing with DJ JR</span>
                    </div>
                    <span className="font-mono text-pink-300 bg-purple-900/80 px-2.5 py-1 rounded-lg text-xs font-bold">
                      Social
                    </span>
                  </div>

                  <div className="pt-3 flex justify-between items-center text-xs sm:text-sm">
                    <div>
                      <span className="text-purple-200 font-medium block">Location</span>
                      <span className="text-white font-bold">Dance Factory (Westshore Plaza Mall)</span>
                    </div>
                    <span className="font-mono text-emerald-400 text-xs">
                      Free Parking
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Admission Pricing Card */}
            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-purple-900/60 via-fuchsia-900/40 to-purple-950/80 border border-fuchsia-500/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center md:text-left">
                <span className="text-xs font-mono font-bold text-pink-300 uppercase tracking-widest block">
                  ALL-INCLUSIVE ADMISSION PASS
                </span>
                <h3 className="text-2xl font-black text-white uppercase font-sans">
                  $12 FULL NIGHT PASS
                </h3>
                <p className="text-xs text-purple-200">
                  Includes 8:00 PM Class + Full 9:00 PM - 1:00 AM Social Dancing Session!
                </p>
              </div>

              <button
                onClick={() => onOpenBooking('social-invasion-10')}
                className="w-full md:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-fuchsia-600/40 transition-all transform hover:scale-[1.03] border border-pink-300/40"
              >
                <Ticket className="w-4 h-4 text-white" />
                <span>GET $12 BACHATA INVASION PASS</span>
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
                  <span className="text-xs font-mono font-bold text-purple-300 uppercase block">
                    VENUE LOCATION
                  </span>
                  <h5 className="text-sm font-bold text-white">
                    Dance Factory (Inside Westshore Plaza Mall)
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
            
            {/* Top Metallic Banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-6 border-b border-white/10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold tracking-widest text-slate-200 bg-slate-800/80 border border-slate-400/40 uppercase shadow-inner">
                  RELPRO X URBAN BACHATA PRESENTS
                </span>
                <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold tracking-widest text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 uppercase animate-pulse">
                  ★ SPECIALTY EDITION SOCIAL
                </span>
              </div>

              <div className="px-4 py-1.5 rounded-full text-xs font-black tracking-widest text-slate-100 bg-gradient-to-r from-slate-700 via-slate-500 to-slate-800 border border-slate-200/50 shadow-lg shadow-white/10 uppercase flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-slate-200" />
                <span>DRESS THEME: SILVER & BLACK</span>
              </div>
            </div>

            {/* Header Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-10">
              
              <div className="lg:col-span-7 space-y-4 text-left">
                <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-slate-300 uppercase">
                  <Calendar className="w-4 h-4 text-slate-300" />
                  SUNDAY, AUGUST 16TH • TAMPA, FL
                </div>

                <h2 className="text-4xl sm:text-6xl font-black uppercase font-sans tracking-tight leading-none text-white">
                  BACHATA <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-slate-300 to-slate-500 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                    LOCURA
                  </span>
                </h2>

                <div className="inline-block px-3 py-1 rounded-lg bg-zinc-800/90 border border-slate-400/30 text-xs font-mono font-bold text-slate-200 uppercase tracking-widest">
                  SPECIALTY EVENT EDITION
                </div>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                  Get ready for Tampa’s premier Sunday Bachata social experience! Fusing high-vibe social dancing, sleek aesthetics, special guest presocial class with <strong className="text-white">Albina & Isaac</strong>, and fire music set by <strong className="text-white">DJ JR</strong>.
                </p>
              </div>

              {/* Quick Highlight Metrics Box */}
              <div className="lg:col-span-5 bg-gradient-to-br from-zinc-900 via-slate-900/90 to-black p-6 rounded-2xl border border-slate-400/30 shadow-2xl space-y-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-300" />
                  EVENT SCHEDULE & ARTISTS
                </div>

                <div className="space-y-3 divide-y divide-white/10">
                  <div className="pt-1 flex justify-between items-center text-xs sm:text-sm">
                    <div>
                      <span className="text-slate-300 font-medium block">Presocial Class</span>
                      <span className="text-slate-100 font-bold">Albina & Isaac</span>
                    </div>
                    <span className="font-mono text-slate-300 bg-slate-800 px-2.5 py-1 rounded-lg text-xs font-bold">
                      4:00 PM
                    </span>
                  </div>

                  <div className="pt-3 flex justify-between items-center text-xs sm:text-sm">
                    <div>
                      <span className="text-slate-300 font-medium block">Social Dance Session</span>
                      <span className="text-slate-100 font-bold">DJ JR on the Decks</span>
                    </div>
                    <span className="font-mono text-slate-300 bg-slate-800 px-2.5 py-1 rounded-lg text-xs font-bold">
                      5:00 PM - 9:00 PM
                    </span>
                  </div>

                  <div className="pt-3 flex justify-between items-center text-xs sm:text-sm">
                    <div>
                      <span className="text-slate-300 font-medium block">Venue</span>
                      <span className="text-slate-100 font-bold">Yuengling Draft Haus</span>
                    </div>
                    <span className="font-mono text-slate-400 text-xs">
                      Tampa, FL
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Pricing & Ticket Tier Cards */}
            <div className="mb-10">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Ticket className="w-4 h-4 text-slate-300" />
                TICKET PASS OPTIONS
              </div>

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
                    <span className="text-[10px] text-slate-400 font-mono font-bold uppercase block mb-1">
                      LIMITED TIME PRE-SALE
                    </span>
                    <h4 className="text-lg font-black text-white uppercase font-sans">
                      PRE-SALE TICKET
                    </h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Full entry including presocial class & social dancing. Ends Aug 14th!
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-black text-white font-mono">$15</span>
                      <span className="text-[10px] text-slate-400 block">*Ends 8/14</span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-300 group-hover:text-white transition-colors flex items-center gap-1">
                      Get Pass →
                    </span>
                  </div>
                </div>

                {/* Tier 2: College Students */}
                <div 
                  onClick={() => onOpenBooking('social-presale')}
                  className="p-5 rounded-2xl bg-gradient-to-b from-zinc-900 to-black border border-white/10 shadow-lg flex flex-col justify-between hover:border-slate-400/40 transition-all cursor-pointer group"
                >
                  <div>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase block mb-1">
                      STUDENT DISCOUNT
                    </span>
                    <h4 className="text-lg font-black text-white uppercase font-sans">
                      COLLEGE STUDENTS
                    </h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Special rate for active college students with valid student ID.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-black text-emerald-400 font-mono">$12</span>
                      <span className="text-[10px] text-slate-400 block">Valid Student ID</span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 group-hover:text-emerald-300 transition-colors">
                      Reserve →
                    </span>
                  </div>
                </div>

                {/* Tier 3: At the Door */}
                <div 
                  onClick={() => onOpenBooking('social-presale')}
                  className="p-5 rounded-2xl bg-gradient-to-b from-zinc-900 to-black border border-white/10 shadow-lg flex flex-col justify-between hover:border-slate-400/40 transition-all cursor-pointer group"
                >
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono font-bold uppercase block mb-1">
                      DAY OF EVENT
                    </span>
                    <h4 className="text-lg font-black text-white uppercase font-sans">
                      AT THE DOOR
                    </h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Standard door admission available on Sunday, August 16th.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-black text-slate-200 font-mono">$20</span>
                      <span className="text-[10px] text-slate-400 block">At Venue</span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 group-hover:text-slate-200 transition-colors">
                      Info →
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Location & Directions Card */}
            <div className="p-5 rounded-2xl bg-black/60 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-xl bg-slate-800 text-slate-200 border border-slate-600 shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase block">
                    VENUE LOCATION
                  </span>
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

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-white/10">
              <button
                onClick={() => onOpenBooking('social-presale')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-slate-200 via-slate-100 to-slate-300 hover:from-white hover:to-slate-200 text-black text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-white/10 transition-all transform hover:scale-[1.02]"
              >
                <Ticket className="w-4 h-4 text-black" />
                <span>GET PRE-SALE SOCIAL PASS ($15)</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>

              <a
                href={STUDIO_INFO.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
              >
                <span>Join WhatsApp Social Group</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </a>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};

