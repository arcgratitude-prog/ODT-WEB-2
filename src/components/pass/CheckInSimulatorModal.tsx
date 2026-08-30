import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Scan, 
  Flame, 
  ShieldCheck, 
  Sparkles, 
  UserCheck, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TicketData } from '../../types/digitalPass';
import { playSuccessChime, playClickSound } from '../../utils/passAudio';

interface CheckInSimulatorModalProps {
  ticket: TicketData;
  isOpen: boolean;
  onClose: () => void;
}

export const CheckInSimulatorModal: React.FC<CheckInSimulatorModalProps> = ({
  ticket,
  isOpen,
  onClose,
}) => {
  const [scanning, setScanning] = useState<boolean>(true);
  const [verified, setVerified] = useState<boolean>(false);
  const [scanTimestamp, setScanTimestamp] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setScanning(true);
      setVerified(false);

      const timer = setTimeout(() => {
        setScanning(false);
        setVerified(true);
        playSuccessChime();
        setScanTimestamp(new Date().toLocaleTimeString('en-US'));

        // Fire festive celebratory confetti
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#f43f5e', '#06b6d4', '#10b981']
        });
      }, 1600);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-[#101320] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden text-center"
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

        {scanning ? (
          <div className="py-8 space-y-5">
            <div className="relative w-28 h-28 mx-auto rounded-2xl bg-black border border-white/15 p-3 flex items-center justify-center overflow-hidden">
              <Scan className="w-14 h-14 text-amber-400 animate-pulse" />
              {/* Laser beam */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent shadow-[0_0_12px_#f43f5e] animate-bounce" />
            </div>

            <div>
              <h3 className="font-['Syne'] text-lg font-bold text-white">
                Scanning Ticket QR Code...
              </h3>
              <p className="text-xs text-white/50 mt-1">
                Authenticating with Dance Theory Tampa Gate Registry
              </p>
            </div>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            {/* Success Check Badge */}
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)] animate-scale-up">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/40">
                DOOR ENTRY APPROVED
              </span>
              <h3 className="font-['Syne'] text-2xl font-black text-white mt-2">
                Welcome to Dance Theory!
              </h3>
              <p className="text-slate-300 text-xs mt-1">
                Wristband tier authorized: <strong className="text-amber-400 font-semibold">{ticket.tierName}</strong>
              </p>
            </div>

            {/* Scanned Credentials Card */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-white/40">Attendee:</span>
                <span className="text-white font-bold">{ticket.attendeeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Order:</span>
                <span className="font-mono text-amber-400 font-bold">#{ticket.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Venue:</span>
                <span className="text-white truncate max-w-[200px]">{ticket.venueName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Check-in Time:</span>
                <span className="text-emerald-400 font-mono font-bold">{scanTimestamp}</span>
              </div>
            </div>

            <button
              type="button"
              id="btn-close-scanner"
              onClick={() => {
                playClickSound();
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg hover:scale-[1.02] active:scale-98"
            >
              Done & Return to Pass
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
