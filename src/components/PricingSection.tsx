import React, { useState } from 'react';
import { Ticket, Sparkles, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { PASS_OPTIONS, CLASSES_DATA } from '../data/danceData';

interface PricingSectionProps {
  onOpenBooking: (passTypeId?: string, quantity?: number) => void;
  onOpenDropInBooking: (passTypeId: string, classTimes: string[]) => void;
}

const DROP_IN_IDS = ['dropin-1', 'dropin-2', 'dropin-full'];

// How many of the 3 weekly class hours a customer picks for each tier track.
// Foundations = pick 1 of the 3 hourly classes to attend each Wednesday.
// Progression = pick 2 of the 3 hourly classes to attend each Wednesday.
// Unlimited = all 3, always (no picking needed).
const TRACK_PICK_COUNTS: Record<string, number> = {
  'track-foundations': 1,
  'track-progression': 2
};

export const PricingSection: React.FC<PricingSectionProps> = ({ onOpenBooking, onOpenDropInBooking }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedDropInId, setSelectedDropInId] = useState<string>('dropin-1');
  // Which specific class hour(s) the customer picked, keyed by pass id —
  // works for both the Drop-Ins quantity picker and the tier tracks below.
  const [selectedClassIdsByPass, setSelectedClassIdsByPass] = useState<Record<string, string[]>>({});

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const dropInPasses = PASS_OPTIONS.filter(p => DROP_IN_IDS.includes(p.id));
  const otherPasses = PASS_OPTIONS.filter(p => !DROP_IN_IDS.includes(p.id));
  const selectedDropIn = dropInPasses.find(p => p.id === selectedDropInId) || dropInPasses[0];

  const handleSelectDropInQuantity = (passId: string) => {
    setSelectedDropInId(passId);
    setSelectedClassIdsByPass(prev => ({ ...prev, [passId]: [] }));
  };

  const toggleClassSelection = (passId: string, classId: string, maxAllowed: number) => {
    setSelectedClassIdsByPass(prev => {
      const current = prev[passId] || [];
      let next: string[];
      if (current.includes(classId)) {
        next = current.filter(id => id !== classId);
      } else if (current.length >= maxAllowed) {
        // Swap out the earliest pick so it's always clear which are selected
        next = [...current.slice(1), classId];
      } else {
        next = [...current, classId];
      }
      return { ...prev, [passId]: next };
    });
  };

  const getClassTimes = (classIds: string[]) => classIds
    .map(id => CLASSES_DATA.find(c => c.id === id))
    .filter((c): c is typeof CLASSES_DATA[number] => Boolean(c))
    .map(c => `${c.time} (${c.title})`);

  const selectedDropInClassIds = selectedClassIdsByPass[selectedDropInId] || [];
  const selectedClassTimes = getClassTimes(selectedDropInClassIds);

  const needsClassSelection = selectedDropIn?.classesCount === 1 || selectedDropIn?.classesCount === 2;
  const hasPickedEnoughClasses = !needsClassSelection || selectedDropInClassIds.length === selectedDropIn.classesCount;

  const handleBookDropIn = () => {
    onOpenDropInBooking(selectedDropIn.id, selectedClassTimes);
  };

  const handleBookTrack = (passId: string) => {
    const classIds = selectedClassIdsByPass[passId] || [];
    onOpenDropInBooking(passId, getClassTimes(classIds));
  };

  return (
    <section id="passes" className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative max-w-5xl mx-auto">

      {/* Section Header */}
      <div className="text-center space-y-4 mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-badge border border-red-500/40 text-xs font-bold text-red-400 uppercase tracking-[0.25em]">
          <Ticket className="w-3.5 h-3.5" />
          CLASS TRACKS & PASSES
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-sans tracking-tight">
          FIND YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-300 to-red-600 urban-text-glow">TRACK</span>
        </h2>

        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
          Tap a track to see what's included, or just pick one and go.
        </p>
      </div>

      {/* Minimal Expandable Pricing List */}
      <div className="space-y-3">
        {/* Merged Drop-In Track — pick 1, 2, or 3 classes inside */}
        {selectedDropIn && (() => {
          const isExpanded = expandedId === 'dropin';

          return (
            <div
              className={`rounded-2xl border overflow-hidden transition-all duration-200 ${
                selectedDropIn.popular
                  ? 'border-red-600/70 shadow-[0_0_25px_rgba(220,38,38,0.2)] bg-gradient-to-r from-[#1a060a] via-[#120508] to-[#0a0a0c]'
                  : 'border-white/12 bg-white/[0.03]'
              }`}
            >
              {/* Collapsed row — always visible */}
              <button
                onClick={() => toggleExpanded('dropin')}
                className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-tight truncate">
                      Class Drop-Ins
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                      {selectedDropIn.tagline}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-xl sm:text-2xl font-black font-mono text-white">
                      ${selectedDropIn.price}
                    </span>
                  </div>
                  <div className="p-1.5 rounded-full bg-white/10 text-slate-300">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </button>

              {/* Expanded details — only when opened */}
              {isExpanded && (
                <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-white/10 animate-in fade-in duration-200">
                  {/* Quantity Tabs */}
                  <div className="flex items-center gap-2 mt-3 mb-4">
                    {dropInPasses.map((pass) => (
                      <button
                        key={pass.id}
                        onClick={() => handleSelectDropInQuantity(pass.id)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide transition-all ${
                          selectedDropInId === pass.id
                            ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                            : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {pass.classesCount} Class{pass.classesCount > 1 ? 'es' : ''}
                        <span className="block font-mono text-[11px] opacity-80">${pass.price}</span>
                      </button>
                    ))}
                  </div>

                  {/* Class Hour Sub-Selection — only when picking 1 or 2 classes */}
                  {needsClassSelection && (
                    <div className="mb-4">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Choose {selectedDropIn.classesCount} class{selectedDropIn.classesCount > 1 ? 'es' : ''} ({selectedDropInClassIds.length}/{selectedDropIn.classesCount} selected)
                      </p>
                      <div className="space-y-2">
                        {CLASSES_DATA.map((classItem) => {
                          const isSelected = selectedDropInClassIds.includes(classItem.id);
                          return (
                            <button
                              key={classItem.id}
                              onClick={() => toggleClassSelection(selectedDropInId, classItem.id, selectedDropIn.classesCount)}
                              className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all border ${
                                isSelected
                                  ? 'bg-red-600/20 border-red-500/60 text-white'
                                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                              }`}
                            >
                              <div className="min-w-0">
                                <span className="text-xs font-bold block truncate">{classItem.title}</span>
                                <span className="text-[10px] font-mono text-slate-400">{classItem.time}</span>
                              </div>
                              {isSelected && <Check className="w-4 h-4 text-red-400 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 mb-4">
                    {selectedDropIn.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                        <Check className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red-400" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleBookDropIn}
                    disabled={!hasPickedEnoughClasses}
                    className="w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 liquid-glass-btn liquid-btn-secondary text-slate-100 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                    <span>
                      {hasPickedEnoughClasses
                        ? `Book This Track — $${selectedDropIn.price}`
                        : `Select ${selectedDropIn.classesCount} Class${selectedDropIn.classesCount > 1 ? 'es' : ''} to Continue`}
                    </span>
                  </button>
                </div>
              )}
            </div>
          );
        })()}

        {otherPasses.map((pass) => {
          const isExpanded = expandedId === pass.id;

          return (
            <div
              key={pass.id}
              className={`rounded-2xl border overflow-hidden transition-all duration-200 ${
                pass.popular
                  ? 'border-red-600/70 shadow-[0_0_25px_rgba(220,38,38,0.2)] bg-gradient-to-r from-[#1a060a] via-[#120508] to-[#0a0a0c]'
                  : 'border-white/12 bg-white/[0.03]'
              }`}
            >
              {/* Collapsed row — always visible */}
              <button
                onClick={() => toggleExpanded(pass.id)}
                className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {pass.popular && (
                    <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-red-600 text-white shrink-0">
                      Popular
                    </span>
                  )}
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-tight truncate">
                      {pass.name}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                      {pass.tagline}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className={`text-xl sm:text-2xl font-black font-mono ${pass.popular ? 'text-red-400' : 'text-white'}`}>
                      ${pass.price}
                    </span>
                    {pass.originalPrice && (
                      <span className="text-[10px] font-bold text-slate-500 line-through ml-1.5">
                        ${pass.originalPrice}
                      </span>
                    )}
                  </div>
                  <div className="p-1.5 rounded-full bg-white/10 text-slate-300">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </button>

              {/* Expanded details — only when opened */}
              {isExpanded && (() => {
                const pickCount = TRACK_PICK_COUNTS[pass.id];
                const trackClassIds = selectedClassIdsByPass[pass.id] || [];
                const trackNeedsSelection = Boolean(pickCount);
                const trackHasPickedEnough = !trackNeedsSelection || trackClassIds.length === pickCount;

                return (
                  <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-white/10 animate-in fade-in duration-200">
                    <div className="space-y-2 mb-4 mt-3">
                      {pass.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                          <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${pass.popular ? 'text-red-500' : 'text-red-400'}`} />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Class Hour Sub-Selection — only for tracks that require picking (Progression) */}
                    {trackNeedsSelection && (
                      <div className="mb-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                          Choose {pickCount} classes to attend weekly ({trackClassIds.length}/{pickCount} selected)
                        </p>
                        <div className="space-y-2">
                          {CLASSES_DATA.map((classItem) => {
                            const isSelected = trackClassIds.includes(classItem.id);
                            return (
                              <button
                                key={classItem.id}
                                onClick={() => toggleClassSelection(pass.id, classItem.id, pickCount)}
                                className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all border ${
                                  isSelected
                                    ? 'bg-red-600/20 border-red-500/60 text-white'
                                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                                }`}
                              >
                                <div className="min-w-0">
                                  <span className="text-xs font-bold block truncate">{classItem.title}</span>
                                  <span className="text-[10px] font-mono text-slate-400">{classItem.time}</span>
                                </div>
                                {isSelected && <Check className="w-4 h-4 text-red-400 shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => handleBookTrack(pass.id)}
                      disabled={!trackHasPickedEnough}
                      className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
                        pass.popular
                          ? 'bg-gradient-to-r from-red-600 via-red-700 to-black hover:from-red-500 hover:to-zinc-900 text-white shadow-lg shadow-red-600/40'
                          : 'liquid-glass-btn liquid-btn-secondary text-slate-100 hover:text-white'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                      <span>
                        {trackHasPickedEnough
                          ? `Book This Track — $${pass.price}`
                          : `Select ${pickCount} Classes to Continue`}
                      </span>
                    </button>
                  </div>
                );
              })()}
            </div>
          );
        })}
      </div>

    </section>
  );
};
