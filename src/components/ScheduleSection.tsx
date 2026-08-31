import React, { useState } from 'react';
import { Clock, Footprints, Zap, Flame, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { CLASSES_DATA } from '../data/danceData';

interface ScheduleSectionProps {
  onOpenBooking: (passTypeId?: string, quantity?: number) => void;
}

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({ onOpenBooking }) => {
  const [expandedClassId, setExpandedClassId] = useState<string>('');

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Open Level':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Intermediate':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Footprints':
        return <Footprints className="w-5 h-5 text-emerald-400" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-red-400" />;
      default:
        return <Footprints className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <section id="schedule" className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative max-w-4xl mx-auto">

      {/* Section Header */}
      <div className="text-center space-y-4 mb-10 sm:mb-12">
        <h2 className="text-2xl sm:text-5xl font-black text-white uppercase font-sans tracking-tight">
          <span className="block">EVERY WEDNESDAY</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-300 to-red-600 urban-text-glow">7:00 PM – 10:00 PM</span>
        </h2>

        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
          Located inside <strong>Dance Factory at WestShore Plaza Mall</strong>.
        </p>
      </div>

      {/* Single Unified Class List Block */}
      <div className="liquid-glass-panel rounded-3xl border border-white/15 overflow-hidden">
        {CLASSES_DATA.map((item, idx) => {
          const isExpanded = expandedClassId === item.id;

          return (
            <div
              key={item.id}
              className={`p-5 sm:p-6 ${idx !== 0 ? 'border-t border-white/10' : ''}`}
            >
              <button
                onClick={() => setExpandedClassId(isExpanded ? '' : item.id)}
                className="w-full flex items-center justify-between gap-4 text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 shrink-0">
                    {getIcon(item.iconName)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wide">
                      {item.title}
                    </h3>
                    <div className="mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getLevelBadgeColor(item.level)}`}>
                        {item.level}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 mt-1">
                      <Clock className="w-3 h-3 text-red-400" />
                      <span>{item.time}</span>
                    </div>
                  </div>
                </div>

                <div className="p-1.5 rounded-full bg-white/10 text-slate-300 shrink-0">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="mt-4 pl-0 sm:pl-14 space-y-3 animate-in fade-in duration-200">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="space-y-1.5">
                    {item.focus.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-200">
                        <CheckCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-slate-400 italic">
                    {item.recommendedFor}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </section>
  );
};
