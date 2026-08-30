import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  QrCode, 
  Flame, 
  CheckCircle2, 
  Sparkles, 
  Share2, 
  ShieldCheck, 
  ArrowRight 
} from 'lucide-react';
import { TicketData } from '../../types/digitalPass';
import { playClickSound, playSuccessChime } from '../../utils/passAudio';

interface WalletPassModalProps {
  ticket: TicketData;
  isOpen: boolean;
  onClose: () => void;
}

export const WalletPassModal: React.FC<WalletPassModalProps> = ({
  ticket,
  isOpen,
  onClose,
}) => {
  const [added, setAdded] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleAddToAppleWallet = () => {
    playSuccessChime();
    setAdded(true);
    setTimeout(() => {
      // simulate prompt
    }, 500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-[#101320] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            playClickSound();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-['Syne'] text-lg font-bold text-white">
              Mobile Wallet Digital Pass
            </h3>
            <p className="text-xs text-white/50">
              Save to Apple Wallet or Google Wallet
            </p>
          </div>
        </div>

        {/* Apple Wallet Style Card Mockup */}
        <div className="relative rounded-2xl bg-gradient-to-b from-[#1e2336] to-[#121522] border border-white/15 p-5 shadow-2xl space-y-4 mb-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span className="font-['Syne'] text-xs font-black tracking-wider text-white">
                DANCE THEORY
              </span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40">
              {ticket.tierName}
            </span>
          </div>

          {/* Event info */}
          <div>
            <p className="text-white/50 text-[10px] uppercase font-bold tracking-wider">
              Event
            </p>
            <h4 className="font-bold text-white text-sm">
              {ticket.eventName}
            </h4>
            <p className="text-white/70 text-xs mt-0.5">
              {ticket.date} • {ticket.time}
            </p>
          </div>

          {/* Attendee info grid */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5 text-xs">
            <div>
              <p className="text-white/40 text-[10px] uppercase font-bold">Passholder</p>
              <p className="text-white font-semibold truncate">{ticket.attendeeName}</p>
            </div>
            <div>
              <p className="text-white/40 text-[10px] uppercase font-bold">Venue</p>
              <p className="text-white font-semibold truncate">{ticket.venueName}</p>
            </div>
          </div>

          {/* Wallet Barcode / QR */}
          <div className="pt-3 border-t border-dashed border-white/15 flex flex-col items-center justify-center bg-black/40 rounded-xl p-3">
            {/* Aztec / QR Code */}
            <div className="w-20 h-20 bg-white rounded-lg p-1.5 shadow-md flex items-center justify-center mb-1.5">
              <svg viewBox="0 0 100 100" className="w-full h-full text-black fill-current">
                <rect x="10" y="10" width="30" height="30" fill="#000" stroke="#fff" strokeWidth="6" />
                <rect x="20" y="20" width="10" height="10" fill="#fff" />
                <rect x="60" y="10" width="30" height="30" fill="#000" stroke="#fff" strokeWidth="6" />
                <rect x="70" y="20" width="10" height="10" fill="#fff" />
                <rect x="10" y="60" width="30" height="30" fill="#000" stroke="#fff" strokeWidth="6" />
                <rect x="20" y="70" width="10" height="10" fill="#fff" />
                <rect x="45" y="15" width="8" height="18" fill="#000" />
                <rect x="45" y="45" width="10" height="10" fill="#000" />
                <rect x="60" y="45" width="15" height="8" fill="#000" />
                <rect x="80" y="60" width="10" height="25" fill="#000" />
                <rect x="45" y="65" width="20" height="10" fill="#000" />
                <rect x="70" y="75" width="8" height="15" fill="#000" />
              </svg>
            </div>
            <span className="font-mono text-[10px] text-white/60 tracking-wider">
              {ticket.barcodeNumber}
            </span>
          </div>
        </div>

        {/* Action Button */}
        {added ? (
          <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Pass Added to Apple Wallet! Instant Door Access Ready.</span>
          </div>
        ) : (
          <div className="space-y-2">
            <button
              type="button"
              id="btn-confirm-add-wallet"
              onClick={handleAddToAppleWallet}
              className="w-full py-3 px-4 rounded-2xl bg-black hover:bg-zinc-900 border border-white/20 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer hover:scale-[1.02] active:scale-98"
            >
              <span>Add to Apple Wallet</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>

            <button
              type="button"
              id="btn-confirm-add-google-wallet"
              onClick={handleAddToAppleWallet}
              className="w-full py-2.5 px-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white/90 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Save to Google Wallet</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
