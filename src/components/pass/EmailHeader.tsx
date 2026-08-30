import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Download, 
  Calendar, 
  Wallet, 
  Mail, 
  Smartphone, 
  Printer, 
  ArrowRight,
  ShieldCheck,
  Send,
  Check
} from 'lucide-react';
import { TicketData } from '../../types/digitalPass';
import { playClickSound, playSuccessChime } from '../../utils/passAudio';

interface EmailHeaderProps {
  ticket: TicketData;
  onOpenWallet: () => void;
  onDownloadCalendar: () => void;
  onSimulateCheckIn: () => void;
}

export const EmailHeader: React.FC<EmailHeaderProps> = ({
  ticket,
  onOpenWallet,
  onDownloadCalendar,
  onSimulateCheckIn,
}) => {
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  const handleResend = () => {
    playSuccessChime();
    setResendStatus('Sending...');
    setTimeout(() => {
      setResendStatus('Receipt resent to ' + ticket.attendeeEmail);
      setTimeout(() => setResendStatus(null), 4000);
    }, 1000);
  };

  return (
    <div id="email-confirmation-header" className="space-y-6">
      {/* Email Client Top Bar / Context Envelope */}
      <div className="bg-[#141026] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-white/60 pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white/90">From:</span>
            <span className="text-fuchsia-400 font-mono">Dance Theory Tickets &lt;tickets@officialdancetheory.com&gt;</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white/90">To:</span>
            <span className="text-white/90 font-mono">{ticket.attendeeEmail}</span>
          </div>
        </div>

        {/* Email Subject Line */}
        <div className="pt-3 flex flex-wrap items-center justify-between gap-2">
          <h1 className="font-['Syne'] text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span>🎟️ Your Dance Theory Pass is Confirmed! (Order #{ticket.orderNumber})</span>
          </h1>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> Confirmed & Paid
          </span>
        </div>
      </div>

      {/* Main Hero Order Confirmation Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#191232] via-[#110c24] to-[#0a0717] border border-white/10 p-6 sm:p-8 shadow-2xl">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide uppercase mb-4">
            <CheckCircle2 className="w-4 h-4" />
            <span>Order #{ticket.orderNumber} Verified</span>
          </div>

          <h2 className="font-['Syne'] text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-2">
            Get Ready to Dance, <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-pink-400 to-amber-300">{ticket.attendeeName}</span>!
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl font-normal leading-relaxed mb-6">
            Thank you for purchasing your pass for <strong className="text-white font-semibold">{ticket.eventName}</strong>. Your interactive 3D digital pass is generated and ready for rapid gate entry at the venue door.
          </p>

          {/* Quick Action Button Hub */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Add to Apple / Google Wallet */}
            <button
              type="button"
              id="btn-add-to-wallet"
              onClick={() => {
                playClickSound();
                onOpenWallet();
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 hover:from-violet-500 hover:to-pink-400 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-fuchsia-500/25 hover:scale-105 active:scale-95"
            >
              <Wallet className="w-4 h-4 text-white" />
              <span>Add to Mobile Wallet</span>
            </button>

            {/* Add to Calendar */}
            <button
              type="button"
              id="btn-add-calendar"
              onClick={() => {
                playClickSound();
                onDownloadCalendar();
              }}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <Calendar className="w-4 h-4 text-fuchsia-400" />
              <span>Add to Calendar (.ics)</span>
            </button>

            {/* Door Check-In Simulator */}
            <button
              type="button"
              id="btn-door-scan-simulator"
              onClick={() => {
                playClickSound();
                onSimulateCheckIn();
              }}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <span>Test Door Scanner</span>
            </button>

            {/* Resend Receipt Email */}
            <button
              type="button"
              id="btn-resend-receipt"
              onClick={handleResend}
              className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Resend Email</span>
            </button>
          </div>

          {/* Resend Toast notification */}
          {resendStatus && (
            <div className="mt-3 p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center gap-2 animate-fade-in">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{resendStatus}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
