import React from 'react';
import { Crown, MapPin, Instagram, Sparkles, Heart, MessageCircle } from 'lucide-react';
import { STUDIO_INFO } from '../data/danceData';
import { AiUrbanoLogo } from './AiUrbanoLogo';

interface FooterProps {
  onNavigateToSecret?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateToSecret }) => {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#0a0a0c]/90 backdrop-blur-xl pt-12 pb-28 md:pb-12 px-4 sm:px-6 lg:px-8">
      
      {/* Top Metrics Row */}
      <div className="max-w-7xl mx-auto pb-8 mb-8 border-b border-white/10 flex flex-wrap justify-between items-center gap-6">
        <div className="flex flex-wrap gap-8 sm:gap-12">
          <div>
            <p className="text-2xl sm:text-3xl font-black text-white font-mono">100%</p>
            <p className="text-[10px] tracking-[0.25em] uppercase text-white/50 font-bold">Urban Vibe Rating</p>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="flex items-center gap-3">
          <a 
            href={STUDIO_INFO.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-xs font-bold text-white/80 hover:text-white hover:border-red-500 hover:bg-red-500/20 transition-all"
            title="Instagram @ai.urbano"
          >
            IG
          </a>
          <a 
            href={STUDIO_INFO.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-full border border-emerald-500/40 bg-emerald-950/30 flex items-center justify-center text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:border-emerald-400 hover:bg-emerald-600/30 transition-all"
            title="Join WhatsApp Group Chat"
          >
            WA
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Brand */}
        <div className="md:col-span-5 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 via-red-800 to-black p-[1px] shadow-[0_0_15px_rgba(220,38,38,0.4)] flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-[#0a0a0c] flex items-center justify-center">
                <AiUrbanoLogo className="w-7 h-7" />
              </div>
            </div>
            <span className="text-lg font-black tracking-wider text-white font-mono flex items-center gap-1.5">
              <Instagram className="w-4 h-4 text-red-400 shrink-0" />
              {STUDIO_INFO.instagram}
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-sm">
            Top-rated Bachata classes in Tampa, FL. Learn beginner Bachata lessons, progressive 4-week tracks, and Urban Bachata flow at Dance Factory inside WestShore Plaza Mall.
          </p>
          <div className="text-[11px] text-slate-400 font-mono leading-tight pt-1">
            <span className="text-white font-bold">Serving Tampa Bay:</span> South Tampa - Ybor City - Downtown Tampa - Brandon - Riverview - St. Petersburg - Clearwater - Carrollwood - Wesley Chapel
          </div>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-4 space-y-2 text-xs text-slate-300">
          <div className="font-bold uppercase tracking-wider text-white mb-2">Location & Community</div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-400 shrink-0" />
            <span>{STUDIO_INFO.fullAddress}</span>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <Instagram className="w-4 h-4 text-red-400 shrink-0" />
            <a
              href={STUDIO_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 font-mono font-bold hover:underline"
            >
              {STUDIO_INFO.instagram} on Instagram
            </a>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <a
              href={STUDIO_INFO.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 font-mono font-bold hover:underline"
            >
              Join Official WhatsApp Group
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="md:col-span-3 text-left md:text-right text-xs text-slate-400 space-y-1">
          <div>&copy; {new Date().getFullYear()} Urban Bachata Tampa</div>
          <div className="flex items-center md:justify-end gap-1 text-[11px] text-slate-400">
            <span>Crafted for Urban Bachata Dancers</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
          </div>
          {onNavigateToSecret && (
            <div className="pt-1">
              <button
                onClick={onNavigateToSecret}
                className="text-[10px] text-slate-400 hover:text-red-400 font-mono transition-colors opacity-70 hover:opacity-100 flex items-center md:justify-end gap-1"
                title="Organizer / On-Site Open House Secret Page"
              >
                <span>Open House Secret Scan ($120)</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </footer>
  );
};
