import React from 'react';
import { X, QrCode, Ticket, Calendar, MapPin, Trash2, CheckCircle2 } from 'lucide-react';
import { TicketPass } from '../types';

interface SavedPassesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  passes: TicketPass[];
  onRemovePass: (ticketId: string) => void;
}

export const SavedPassesDrawer: React.FC<SavedPassesDrawerProps> = ({
  isOpen,
  onClose,
  passes,
  onRemovePass
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      
      <div className="w-full max-w-md h-full liquid-glass-panel p-6 border-l border-white/20 shadow-2xl flex flex-col justify-between overflow-y-auto">
        
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase font-sans">
                  MY SAVED CLASS TICKETS
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {passes.length} Saved Mobile Ticket(s)
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Passes List */}
          {passes.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Ticket className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">
                No saved classes on this device yet.
              </p>
              <p className="text-xs text-slate-400">
                Claim a class pass to see your digital ticket here!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {passes.map((pass) => {
                let isPastEvent = /August 5th/i.test(pass.eventDate);
                if (!isPastEvent && /Locura/i.test(pass.passName)) {
                  isPastEvent = new Date('2026-09-20T21:00:00') < new Date();
                } else if (!isPastEvent && /Invasion/i.test(pass.passName)) {
                  isPastEvent = new Date('2026-09-12T01:00:00') < new Date();
                }

                return (
                <div
                  key={pass.ticketId}
                  className={`liquid-glass-card rounded-2xl p-4 border space-y-3 relative overflow-hidden ${
                    isPastEvent ? 'border-white/5 opacity-50 grayscale' : 'border-white/15'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono text-red-400 font-bold uppercase block">
                        TICKET #{pass.ticketId}
                      </span>
                      <h4 className="text-sm font-bold text-white uppercase">
                        {pass.passName}
                      </h4>
                      <span className="text-xs text-slate-300 block">{pass.userName}</span>
                    </div>

                    <button
                      onClick={() => onRemovePass(pass.ticketId)}
                      className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                      title="Remove pass"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-[11px] text-slate-300 space-y-1 bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>{pass.eventDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>{pass.location}</span>
                    </div>
                  </div>

                  {/* QR Preview */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-10 h-10 text-white p-1 bg-white/10 rounded-lg" />
                      <span className={`text-[10px] font-mono font-bold uppercase ${isPastEvent ? 'text-slate-400' : 'text-emerald-400'}`}>
                        {isPastEvent ? 'Event Has Passed' : 'Ready for Check-in'}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-black text-white">
                      {pass.price === 0 ? '$0 FREE' : `$${pass.price}`}
                    </span>
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-white/10 text-xs font-bold text-white hover:bg-white/20 transition-colors uppercase tracking-wider"
          >
            Close Saved Passes
          </button>
        </div>

      </div>

    </div>
  );
};
