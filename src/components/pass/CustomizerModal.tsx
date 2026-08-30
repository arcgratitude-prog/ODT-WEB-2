import React, { useState } from 'react';
import { 
  X, 
  Sliders, 
  Sparkles, 
  Check, 
  Palette, 
  User, 
  Mail, 
  Ticket 
} from 'lucide-react';
import { TicketData } from '../../types/digitalPass';
import { EVENT_PRESETS } from '../../data/digitalPassMockPresets';
import { playClickSound, playSuccessChime } from '../../utils/passAudio';

interface CustomizerModalProps {
  ticket: TicketData;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTicket: (updated: TicketData) => void;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  ticket,
  isOpen,
  onClose,
  onUpdateTicket,
}) => {
  const [formData, setFormData] = useState<TicketData>({ ...ticket });

  if (!isOpen) return null;

  const themes: Array<{ id: TicketData['passColorTheme']; name: string; color: string; border: string }> = [
    { id: 'vibrant', name: 'Vibrant Neon', color: 'from-violet-500 via-fuchsia-500 to-pink-500', border: 'border-fuchsia-400' },
    { id: 'gold', name: 'Electro Gold', color: 'from-amber-400 to-yellow-600', border: 'border-amber-400' },
    { id: 'holographic', name: 'Prism Holo', color: 'from-cyan-400 via-purple-400 to-pink-400', border: 'border-cyan-400' },
    { id: 'ruby', name: 'Sensual Ruby', color: 'from-rose-500 to-red-700', border: 'border-rose-400' },
    { id: 'obsidian', name: 'Obsidian Stealth', color: 'from-slate-300 to-zinc-600', border: 'border-zinc-300' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    playSuccessChime();
    onUpdateTicket(formData);
    onClose();
  };

  const handlePresetSelect = (presetId: string) => {
    const found = EVENT_PRESETS.find(p => p.id === presetId);
    if (found) {
      setFormData({
        ...found,
        attendeeName: formData.attendeeName || found.attendeeName,
        attendeeEmail: formData.attendeeEmail || found.attendeeEmail,
      });
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-[#101320] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
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

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-['Syne'] text-lg font-bold text-white">
              Customize 3D Ticket & Order
            </h3>
            <p className="text-xs text-white/50">
              Personalize confirmation details, name & 3D foil theme
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* Event Preset Switcher */}
          <div>
            <label className="block text-white/70 font-semibold mb-1">
              Select Event / Class Preset
            </label>
            <select
              value={formData.id}
              onChange={(e) => handlePresetSelect(e.target.value)}
              className="w-full bg-[#181c2e] border border-white/15 rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:border-amber-400"
            >
              {EVENT_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.eventName} ({p.tierName})
                </option>
              ))}
            </select>
          </div>

          {/* Attendee Name */}
          <div>
            <label className="block text-white/70 font-semibold mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" />
              Attendee Full Name
            </label>
            <input
              type="text"
              required
              value={formData.attendeeName}
              onChange={(e) => setFormData({ ...formData, attendeeName: e.target.value })}
              className="w-full bg-[#181c2e] border border-white/15 rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:border-amber-400"
              placeholder="e.g. Maria Gonzalez"
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-white/70 font-semibold mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              Delivery Email Address
            </label>
            <input
              type="email"
              required
              value={formData.attendeeEmail}
              onChange={(e) => setFormData({ ...formData, attendeeEmail: e.target.value })}
              className="w-full bg-[#181c2e] border border-white/15 rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:border-amber-400"
              placeholder="e.g. maria@example.com"
            />
          </div>

          {/* Holographic 3D Pass Theme */}
          <div>
            <label className="block text-white/70 font-semibold mb-2 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-rose-400" />
              3D Ticket Foil & Finish Theme
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {themes.map((th) => {
                const isSelected = formData.passColorTheme === th.id;
                return (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setFormData({ ...formData, passColorTheme: th.id });
                    }}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                      isSelected 
                        ? `${th.border} bg-white/10 ring-2 ring-amber-400/40` 
                        : 'border-white/10 bg-[#181c2e] hover:border-white/20'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${th.color} shadow-sm`} />
                    <span className="text-[11px] font-bold text-white">{th.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Order Number & Gate Section */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-white/60 text-[11px] font-semibold mb-1">
                Order Number
              </label>
              <input
                type="text"
                value={formData.orderNumber}
                onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                className="w-full bg-[#181c2e] border border-white/15 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-white/60 text-[11px] font-semibold mb-1">
                Tier Label
              </label>
              <input
                type="text"
                value={formData.tierName}
                onChange={(e) => setFormData({ ...formData, tierName: e.target.value })}
                className="w-full bg-[#181c2e] border border-white/15 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              id="btn-save-ticket-customization"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg hover:scale-105"
            >
              <Check className="w-4 h-4" />
              <span>Apply Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
