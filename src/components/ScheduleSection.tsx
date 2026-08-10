import React, { useState, useEffect } from 'react';
import { Clock, Footprints, Zap, Flame, CheckCircle, Calendar, Sparkles, ChevronDown, ChevronUp, UserCheck, CalendarDays, ExternalLink, Radio } from 'lucide-react';
import { CLASSES_DATA } from '../data/danceData';
import { ClassItem } from '../types';

interface ScheduleSectionProps {
  onOpenBooking: (passTypeId?: string) => void;
}

// Generate dynamic upcoming Wednesday dates starting from today
const getUpcomingWednesdays = (count = 6) => {
  const dates: Date[] = [];
  const now = new Date();
  const current = new Date(now);
  
  const day = current.getDay();
  // Wednesday is day 3
  let diff = (3 - day + 7) % 7;
  // If it's Wednesday after 10 PM, show next week
  if (diff === 0 && now.getHours() >= 22) {
    diff = 7;
  }
  current.setDate(current.getDate() + diff);

  for (let i = 0; i < count; i++) {
    const d = new Date(current);
    d.setDate(current.getDate() + i * 7);
    dates.push(d);
  }
  return dates;
};

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({ onOpenBooking }) => {
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [expandedClassId, setExpandedClassId] = useState<string>('foundations');
  const [selectedWeekIndex, setSelectedWeekIndex] = useState<number>(0);
  
  const upcomingDates = getUpcomingWednesdays(6);
  const selectedDate = upcomingDates[selectedWeekIndex] || upcomingDates[0];

  const formattedDateHeader = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const filteredClasses = selectedLevel === 'ALL'
    ? CLASSES_DATA
    : CLASSES_DATA.filter(c => c.level.toUpperCase().includes(selectedLevel));

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

  const generateGoogleCalendarUrl = (item: ClassItem, dateObj: Date) => {
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    
    // Parse class times (e.g. 7:00 PM - 8:00 PM)
    const [startStr, endStr] = item.time.split(' - ');
    const parseHour = (str: string) => {
      const isPm = str.includes('PM');
      let hour = parseInt(str.split(':')[0], 10);
      if (isPm && hour !== 12) hour += 12;
      if (!isPm && hour === 12) hour = 0;
      return String(hour).padStart(2, '0');
    };

    const startHour = parseHour(startStr);
    const endHour = parseHour(endStr);
    
    const isoStart = `${yyyy}${mm}${dd}T${startHour}0000`;
    const isoEnd = `${yyyy}${mm}${dd}T${endHour}0000`;

    const title = encodeURIComponent(`Urban Bachata: ${item.title} (${item.level})`);
    const details = encodeURIComponent(`${item.description}\n\nLocation: Dance Factory - WestShore Plaza Mall, Tampa, FL`);
    const location = encodeURIComponent('Dance Factory, 334 Westshore Plaza A10, Tampa, FL 33609');
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${isoStart}/${isoEnd}&details=${details}&location=${location}`;
  };

  const generateFullNightCalendarUrl = (dateObj: Date) => {
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const isoStart = `${yyyy}${mm}${dd}T190000`;
    const isoEnd = `${yyyy}${mm}${dd}T220000`;

    const title = encodeURIComponent(`Urban Bachata Full Night Classes (7-10 PM)`);
    const details = encodeURIComponent(`3 Bachata Classes (Foundations, Sensual Skills, Urban Flow)\nLocation: Dance Factory at WestShore Plaza Mall`);
    const location = encodeURIComponent('Dance Factory, 334 Westshore Plaza A10, Tampa, FL 33609');

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${isoStart}/${isoEnd}&details=${details}&location=${location}`;
  };

  return (
    <section id="schedule" className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center space-y-4 mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-badge border border-red-500/40 text-xs font-bold text-red-400 uppercase tracking-[0.25em]">
          <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
          AUTO-UPDATING LIVE SCHEDULE
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-sans tracking-tight">
          EVERY WEDNESDAY • <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-300 to-red-600 urban-text-glow">7:00 PM – 10:00 PM</span>
        </h2>

        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
          Located inside <strong>Dance Factory at WestShore Plaza Mall</strong>. Schedule updates automatically each week.
        </p>

        {/* Level Filter Liquid Glass Pills */}
        <div className="flex flex-wrap justify-center gap-2 pt-4">
          {[
            { id: 'ALL', label: 'All 3 Classes' },
            { id: 'BEGINNER', label: 'Beginner' },
            { id: 'OPEN LEVEL', label: 'Open Level' },
            { id: 'INTERMEDIATE', label: 'Intermediate' }
          ].map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => setSelectedLevel(lvl.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border ${
                selectedLevel === lvl.id
                  ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/40 scale-105'
                  : 'liquid-glass-btn text-slate-300 border-white/10 hover:text-white'
              }`}
            >
              {lvl.label}
            </button>
          ))}
        </div>
      </div>

      {/* Class Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredClasses.map((item) => {
          const isExpanded = expandedClassId === item.id;
          
          return (
            <div
              key={item.id}
              className="liquid-glass-card rounded-3xl p-6 border border-white/15 flex flex-col justify-between group"
            >
              <div>
                {/* Top Badge & Time */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 border border-white/10 text-xs font-mono font-bold text-slate-200">
                    <Clock className="w-3.5 h-3.5 text-red-400" />
                    {item.time}
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getLevelBadgeColor(item.level)}`}>
                    {item.level}
                  </span>
                </div>

                {/* Class Title */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 shrink-0 group-hover:scale-110 transition-transform">
                    {getIcon(item.iconName)}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-wide">
                      {item.title}
                    </h3>
                    <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">
                      {item.tag}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {item.description}
                </p>

                {/* Focus List */}
                <div className="space-y-2 mb-4 bg-slate-950/40 rounded-2xl p-3 border border-white/5">
                  <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider block mb-1">
                    Key Focus Areas:
                  </span>
                  {item.focus.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-200">
                      <CheckCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                {/* Instructor Note Expandable */}
                {isExpanded && (
                  <div className="text-xs space-y-2 mb-4 bg-red-950/20 p-3 rounded-2xl border border-red-500/20 animate-in fade-in duration-200">
                    <div>
                      <strong className="text-red-300">Who it is for:</strong>{' '}
                      <span className="text-slate-300">{item.recommendedFor}</span>
                    </div>
                    <div>
                      <strong className="text-red-300">Instructor Tip:</strong>{' '}
                      <span className="text-slate-300">{item.instructorNote}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
                
                <button
                  onClick={() => setExpandedClassId(isExpanded ? '' : item.id)}
                  className="text-[11px] font-bold text-slate-400 hover:text-white flex items-center justify-center gap-1 py-1"
                >
                  {isExpanded ? (
                    <>Less Details <ChevronUp className="w-3.5 h-3.5" /></>
                  ) : (
                    <>More Class Details & Tips <ChevronDown className="w-3.5 h-3.5" /></>
                  )}
                </button>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href={generateGoogleCalendarUrl(item, selectedDate)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="liquid-glass-btn liquid-btn-secondary py-2 px-3 rounded-xl text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1.5"
                    title="Add to Google Calendar"
                  >
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <span>Calendar</span>
                  </a>

                  <button
                    onClick={() => onOpenBooking('dropin-1')}
                    className="liquid-glass-btn liquid-btn-primary py-2 px-3 rounded-xl text-xs font-extrabold text-white flex items-center justify-center gap-1.5 shadow-md shadow-red-600/30"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                    <span>Get $20 Pass</span>
                  </button>
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* Bottom Schedule Callout */}
      <div className="mt-8 liquid-glass-panel rounded-3xl p-6 border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-400 flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-extrabold text-white uppercase">
              No Partner or Experience Required!
            </h4>
            <p className="text-xs text-slate-300">
              We rotate partners in every class so everyone gets to practice. Bring comfortable shoes and great energy!
            </p>
          </div>
        </div>

        <button
          onClick={() => onOpenBooking('dropin-full')}
          className="liquid-glass-btn liquid-btn-primary px-6 py-3 rounded-2xl text-xs font-black text-white shrink-0 uppercase tracking-wider"
        >
          Book Full Night ($50)
        </button>
      </div>

    </section>
  );
};
