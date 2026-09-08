import React, { useState } from 'react';
import { X, QrCode, Ticket, Calendar, MapPin, Trash2, ChevronDown } from 'lucide-react';
import { TicketPass } from '../types';
import { isPassPast } from '../utils/eventSchedule';

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
  // Past events start collapsed so the drawer leads with what's still
  // coming up; the ended ones tuck away under an expandable section.
  const [showPast, setShowPast] = useState(false);

  if (!isOpen) return null;

  // Split saved tickets into what's still upcoming vs. events that have
  // already happened. isPassPast() is the single shared rule for this
  // (see src/utils/eventSchedule.ts) — a ticket bought for a dated event
  // moves here on its own once that event's date passes.
  const upcoming = passes.filter((p) => !isPassPast(p));
  const past = passes.filter((p) => isPassPast(p));

  const renderCard = (pass: TicketPass, isPastEvent: boolean) => (
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
                  {upcoming.length} Upcoming{past.length > 0 ? ` · ${past.length} Past` : ''}
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
              {/* Upcoming */}
              {upcoming.length > 0 ? (
                upcoming.map((pass) => renderCard(pass, false))
              ) : (
                <p className="text-xs text-slate-400 text-center py-6">
                  No upcoming tickets right now — your past events are below.
                </p>
              )}

              {/* Past Events — collapsed by default */}
              {past.length > 0 && (
                <div className="pt-2 border-t border-white/10 space-y-3">
                  <button
                    onClick={() => setShowPast((v) => !v)}
                    className="w-full flex items-center justify-between px-1 py-1 text-slate-400 hover:text-white transition-colors"
                  >
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Past Events ({past.length})
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showPast ? 'rotate-180' : ''}`} />
                  </button>
                  {showPast && (
                    <div className="space-y-4">
                      {past.map((pass) => renderCard(pass, true))}
                    </div>
                  )}
                </div>
              )}
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
