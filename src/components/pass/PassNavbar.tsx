import React from 'react';
import { 
  Flame, 
  Mail, 
  Rotate3d, 
  Printer, 
  Sparkles, 
  Sliders, 
  Share2, 
  Check, 
  Download,
  Calendar,
  Wallet
} from 'lucide-react';
import { ViewMode, TicketData } from '../../types/digitalPass';
import { EVENT_PRESETS } from '../../data/digitalPassMockPresets';
import { playClickSound } from '../../utils/passAudio';

interface NavbarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  selectedTicket: TicketData;
  onSelectPreset: (ticket: TicketData) => void;
  onOpenCustomizer: () => void;
  onOpenWallet: () => void;
  onDownloadCalendar: () => void;
}

export const PassNavbar: React.FC<NavbarProps> = ({
  viewMode,
  setViewMode,
  selectedTicket,
  onSelectPreset,
  onOpenCustomizer,
  onOpenWallet,
  onDownloadCalendar,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyLink = () => {
    playClickSound();
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <a 
            href="https://www.officialdancetheory.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-pink-500 p-[1.5px] shadow-lg shadow-fuchsia-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0a0a0a] rounded-[10px] flex items-center justify-center">
                <Flame className="w-5 h-5 text-fuchsia-400 group-hover:text-pink-300 transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Syne'] text-lg sm:text-xl font-extrabold tracking-wider text-white">
                  DANCE THEORY
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30">
                  TAMPA
                </span>
              </div>
              <p className="text-[11px] text-white/50 font-medium hidden sm:block">
                Bachata • Salsa • Academy & Events
              </p>
            </div>
          </a>
        </div>

        {/* View Mode Navigation Pill */}
        <div className="flex items-center bg-white/5 border border-white/10 p-1 rounded-2xl shadow-inner">
          <button
            type="button"
            id="nav-tab-email"
            onClick={() => {
              playClickSound();
              setViewMode('email');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'email'
                ? 'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 text-white font-bold shadow-md shadow-fuchsia-500/20'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Email Confirmation</span>
            <span className="sm:hidden">Email</span>
          </button>

          <button
            type="button"
            id="nav-tab-3dstage"
            onClick={() => {
              playClickSound();
              setViewMode('stage3d');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'stage3d'
                ? 'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 text-white font-bold shadow-md shadow-fuchsia-500/20'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Rotate3d className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">3D Holo Stage</span>
            <span className="sm:hidden">3D Stage</span>
          </button>

          <button
            type="button"
            id="nav-tab-print"
            onClick={() => {
              playClickSound();
              setViewMode('print');
              window.print();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'print'
                ? 'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 text-white font-bold shadow-md shadow-fuchsia-500/20'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print Pass</span>
            <span className="sm:hidden">Print</span>
          </button>
        </div>

        {/* Right Actions: Event Presets, Customizer & Share */}
        <div className="flex items-center gap-2">
          {/* Preset Selector Dropdown */}
          <div className="relative hidden md:block">
            <select
              id="event-preset-dropdown"
              aria-label="Select Event Preset"
              value={selectedTicket.id}
              onChange={(e) => {
                const found = EVENT_PRESETS.find(p => p.id === e.target.value);
                if (found) {
                  playClickSound();
                  onSelectPreset(found);
                }
              }}
              className="bg-[#141026] border border-white/15 text-xs text-white rounded-xl px-3 py-2 pr-8 focus:outline-none focus:border-fuchsia-400 font-medium cursor-pointer"
            >
              {/* The real ticket being viewed isn't one of the demo presets
                  below — without this option, the <select> would have no
                  matching value and silently fall back to showing the
                  first demo preset's name instead of the real one. */}
              {!EVENT_PRESETS.some(p => p.id === selectedTicket.id) && (
                <option value={selectedTicket.id} className="bg-[#141026] text-white">
                  {selectedTicket.eventName} (Your Pass)
                </option>
              )}
              {EVENT_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id} className="bg-[#141026] text-white">
                  {preset.eventName}
                </option>
              ))}
            </select>
          </div>

          {/* Customize Pass Button */}
          <button
            type="button"
            id="btn-customize-order"
            onClick={() => {
              playClickSound();
              onOpenCustomizer();
            }}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95"
            title="Customize Attendee Name, Theme & Pass Details"
          >
            <Sliders className="w-3.5 h-3.5 text-fuchsia-400" />
            <span className="hidden lg:inline">Customize</span>
          </button>

          {/* Share / Copy Confirmation Button */}
          <button
            type="button"
            id="btn-share-confirmation"
            onClick={handleCopyLink}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Share or Copy Confirmation Link"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-white/80" />
                <span className="hidden sm:inline">Share</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
