import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Filter, Sparkles, Flame, Ticket, MapPin, Clock, ExternalLink, ArrowRight, Radio, CheckCircle, Share2 } from 'lucide-react';
import { STUDIO_INFO, CLASSES_DATA } from '../data/danceData';

interface CalendarPageProps {
  onOpenBooking: (passTypeId?: string) => void;
  onNavigate: (page: 'home' | 'social' | 'schedule', sectionId?: string) => void;
}

interface CalendarEvent {
  id: string;
  title: string;
  date: Date; // standard Date object
  timeStr: string;
  category: 'social' | 'class' | 'open-house';
  location: string;
  passTypeId?: string;
  description: string;
  badge: string;
  color: string;
  isFeatured?: boolean;
}

export const CalendarPage: React.FC<CalendarPageProps> = ({ onOpenBooking, onNavigate }) => {
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(7); // 0-indexed: 7 = August
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'social' | 'class' | 'open-house'>('ALL');
  const [viewMode, setViewMode] = useState<'month' | 'agenda'>('month');
  const [activeEvent, setActiveEvent] = useState<CalendarEvent | null>(null);

  // Month Names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Generate calendar events dynamically for August 2026 & surrounding months
  const generateEvents = (): CalendarEvent[] => {
    const events: CalendarEvent[] = [];

    // 1. Featured Social Event: Sunday, August 16, 2026
    events.push({
      id: 'locura-aug16',
      title: 'Bachata Locura Social @ Yuengling',
      date: new Date(2026, 7, 16),
      timeStr: '4:00 PM – 9:00 PM',
      category: 'social',
      location: 'Yuengling Draft Haus (11109 N 30th St, Tampa, FL)',
      passTypeId: 'social-presale',
      description: 'Special Tampa Social with Presocial Class by Albina & Isaac (4 PM) and Social Dancing with DJ JR (5-9 PM).',
      badge: '★ SPECIAL SOCIAL',
      color: 'from-slate-200 via-white to-slate-300 text-black',
      isFeatured: true
    });

    // 2. Free Open House: Wednesday, August 5, 2026
    events.push({
      id: 'open-house-aug5',
      title: 'Free Open House & Intro Class',
      date: new Date(2026, 7, 5),
      timeStr: '7:00 PM – 10:00 PM',
      category: 'open-house',
      location: 'Dance Factory - WestShore Plaza Mall, Tampa, FL',
      passTypeId: 'free-open-house',
      description: 'Free community night! Experience our Urban Bachata classes with zero commitment.',
      badge: 'FREE PASS',
      color: 'from-emerald-500 to-teal-600 text-white'
    });

    // 3. Wednesday Classes (every Wednesday in Aug & Sept)
    const wednesdayDatesInAug = [5, 12, 19, 26];
    const wednesdayDatesInSept = [2, 9, 16, 23, 30];

    wednesdayDatesInAug.forEach((day) => {
      if (day !== 5) { // Skip open house date for standard class listing or combine
        events.push({
          id: `wed-classes-aug-${day}`,
          title: 'Wednesday Urban Bachata Classes',
          date: new Date(2026, 7, day),
          timeStr: '7:00 PM – 10:00 PM',
          category: 'class',
          location: 'Dance Factory - WestShore Plaza Mall, Tampa, FL',
          passTypeId: 'dropin-full',
          description: '3 Progressive Classes: 7PM Foundations, 8PM Sensual Skills, 9PM Urban Flow & Partnerwork.',
          badge: 'WEEKLY CLASSES',
          color: 'from-red-600 to-rose-700 text-white'
        });
      }
    });

    wednesdayDatesInSept.forEach((day) => {
      events.push({
        id: `wed-classes-sept-${day}`,
        title: 'Wednesday Urban Bachata Classes',
        date: new Date(2026, 8, day),
        timeStr: '7:00 PM – 10:00 PM',
        category: 'class',
        location: 'Dance Factory - WestShore Plaza Mall, Tampa, FL',
        passTypeId: 'dropin-full',
        description: '3 Progressive Classes: 7PM Foundations, 8PM Sensual Skills, 9PM Urban Flow & Partnerwork.',
        badge: 'WEEKLY CLASSES',
        color: 'from-red-600 to-rose-700 text-white'
      });
    });

    return events;
  };

  const allEvents = generateEvents();

  const filteredEvents = allEvents.filter(evt => {
    if (selectedCategory !== 'ALL' && evt.category !== selectedCategory) return false;
    return true;
  });

  // Calendar Grid Calculations
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun, 1 = Mon ...

  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const getEventsForDate = (year: number, month: number, day: number) => {
    return filteredEvents.filter(evt => 
      evt.date.getFullYear() === year &&
      evt.date.getMonth() === month &&
      evt.date.getDate() === day
    );
  };

  const generateGoogleCalendarUrl = (evt: CalendarEvent) => {
    const yyyy = evt.date.getFullYear();
    const mm = String(evt.date.getMonth() + 1).padStart(2, '0');
    const dd = String(evt.date.getDate()).padStart(2, '0');
    
    let isoStart = `${yyyy}${mm}${dd}T190000`;
    let isoEnd = `${yyyy}${mm}${dd}T220000`;

    if (evt.category === 'social') {
      isoStart = `${yyyy}${mm}${dd}T160000`;
      isoEnd = `${yyyy}${mm}${dd}T210000`;
    }

    const title = encodeURIComponent(evt.title);
    const details = encodeURIComponent(`${evt.description}\n\nLocation: ${evt.location}`);
    const location = encodeURIComponent(evt.location);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${isoStart}/${isoEnd}&details=${details}&location=${location}`;
  };

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      
      {/* Header Banner */}
      <div className="text-center space-y-4 mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-badge border border-red-500/40 text-xs font-bold text-red-400 uppercase tracking-[0.2em]">
          <CalendarIcon className="w-4 h-4 text-red-400" />
          OFFICIAL SCHEDULE & CALENDAR
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase font-sans tracking-tight">
          TAMPA URBAN BACHATA <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-300 to-red-600 urban-text-glow">CALENDAR</span>
        </h1>

        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
          Explore upcoming Wednesday classes, special socials, and open house dates. Click any event to reserve your pass or sync to Google Calendar.
        </p>

        {/* Category Filters & View Toggle */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-4 max-w-4xl mx-auto border-t border-white/10">
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-slate-400 font-bold uppercase mr-1">Filter:</span>
            {[
              { id: 'ALL', label: 'All Events' },
              { id: 'social', label: 'Socials', icon: Flame },
              { id: 'class', label: 'Wednesday Classes', icon: Ticket },
              { id: 'open-house', label: 'Free Open House', icon: Sparkles },
            ].map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 ${
                    selectedCategory === cat.id
                      ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/30'
                      : 'bg-slate-900/80 text-slate-300 border-white/10 hover:text-white'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5 text-slate-200" />}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'month' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Month View
            </button>
            <button
              onClick={() => setViewMode('agenda')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'agenda' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Agenda List
            </button>
          </div>
        </div>
      </div>

      {/* Month Navigation Control */}
      <div className="mb-6 flex items-center justify-between bg-slate-900/90 border border-slate-700/60 rounded-2xl p-4 shadow-xl">
        <button
          onClick={prevMonth}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 flex items-center gap-1 text-xs font-bold transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous Month</span>
        </button>

        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-black text-white font-mono uppercase tracking-wider">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <span className="text-[11px] text-slate-400 font-mono font-semibold">
            {filteredEvents.length} Event(s) Found
          </span>
        </div>

        <button
          onClick={nextMonth}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 flex items-center gap-1 text-xs font-bold transition-all"
        >
          <span className="hidden sm:inline">Next Month</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* MONTH GRID VIEW */}
      {viewMode === 'month' ? (
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-3xl p-3 sm:p-6 shadow-2xl overflow-hidden">
          
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
              <div 
                key={d} 
                className={`py-2 text-xs font-mono font-bold uppercase tracking-wider ${
                  i === 0 || i === 3 ? 'text-red-400 font-black' : 'text-slate-400'
                }`}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Grid of days */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            
            {/* Previous month padding cells */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div 
                key={`prev-${i}`} 
                className="min-h-[70px] sm:min-h-[110px] p-1 sm:p-2 rounded-2xl bg-slate-900/20 border border-slate-800/20 opacity-30 select-none"
              >
                <span className="text-[10px] font-mono text-slate-600 font-bold">
                  {prevMonthDays - firstDayOfWeek + i + 1}
                </span>
              </div>
            ))}

            {/* Current Month Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dayEvents = getEventsForDate(currentYear, currentMonth, dayNum);
              const isToday = currentYear === 2026 && currentMonth === 7 && dayNum === 16; // Highlight social date or today

              return (
                <div
                  key={`day-${dayNum}`}
                  className={`min-h-[85px] sm:min-h-[120px] p-1.5 sm:p-2 rounded-2xl border transition-all flex flex-col justify-between ${
                    dayEvents.length > 0
                      ? 'bg-slate-900/90 border-slate-700/80 hover:border-red-500/50 shadow-md'
                      : 'bg-slate-900/40 border-slate-800/40'
                  } ${isToday ? 'ring-2 ring-red-500 shadow-[0_0_15px_rgba(220,38,38,0.3)]' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs sm:text-sm font-mono font-black ${
                      dayEvents.length > 0 ? 'text-white' : 'text-slate-500'
                    }`}>
                      {dayNum}
                    </span>
                    {dayEvents.some(e => e.isFeatured) && (
                      <span className="text-[9px] px-1 rounded bg-slate-100 text-black font-black uppercase tracking-tight">
                        ★ EVENT
                      </span>
                    )}
                  </div>

                  {/* Events list inside cell */}
                  <div className="space-y-1 mt-1">
                    {dayEvents.map((evt) => (
                      <button
                        key={evt.id}
                        onClick={() => {
                          if (evt.category === 'social') {
                            onNavigate('social');
                          } else {
                            setActiveEvent(evt);
                          }
                        }}
                        className={`w-full text-left p-1 sm:p-1.5 rounded-lg text-[10px] sm:text-xs font-bold leading-tight block truncate transition-transform hover:scale-105 border ${
                          evt.category === 'social'
                            ? 'bg-gradient-to-r from-slate-200 to-slate-100 text-black border-white shadow-sm'
                            : evt.category === 'open-house'
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                            : 'bg-red-950/80 text-red-200 border-red-500/40'
                        }`}
                        title={`${evt.title} (${evt.timeStr})`}
                      >
                        <div className="truncate font-black">{evt.title}</div>
                        <div className="text-[9px] opacity-80 hidden sm:block">{evt.timeStr}</div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* AGENDA LIST VIEW */
        <div className="space-y-4">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/50 rounded-3xl border border-slate-800 text-slate-400 font-mono">
              No scheduled events found for this filter in {monthNames[currentMonth]} {currentYear}.
            </div>
          ) : (
            filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className={`p-5 sm:p-6 rounded-3xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  evt.isFeatured
                    ? 'bg-gradient-to-r from-slate-900 via-zinc-900 to-slate-950 border-slate-300/50 shadow-2xl'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 shadow-xl'
                }`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-3 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-gradient-to-r ${evt.color}`}>
                      {evt.badge}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-red-400" />
                      {evt.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} • {evt.timeStr}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white uppercase font-sans">
                    {evt.title}
                  </h3>

                  <p className="text-slate-300 text-xs sm:text-sm">
                    {evt.description}
                  </p>

                  <div className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-red-400" />
                    <span>{evt.location}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-white/10">
                  {evt.category === 'social' ? (
                    <button
                      onClick={() => onNavigate('social')}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-white text-black text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg"
                    >
                      <Flame className="w-4 h-4 text-black" />
                      <span>View Social Page</span>
                      <ArrowRight className="w-4 h-4 text-black" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onOpenBooking(evt.passTypeId)}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-red-600/30"
                    >
                      <Ticket className="w-4 h-4 text-white" />
                      <span>Reserve Pass</span>
                    </button>
                  )}

                  <a
                    href={generateGoogleCalendarUrl(evt)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 flex items-center justify-center transition-colors"
                    title="Add to Google Calendar"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* EVENT POPUP MODAL */}
      {activeEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="liquid-glass-panel rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-white/20 shadow-2xl relative space-y-5">
            <button
              onClick={() => setActiveEvent(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white"
            >
              ✕
            </button>

            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-gradient-to-r ${activeEvent.color}`}>
              {activeEvent.badge}
            </span>

            <h3 className="text-2xl font-black text-white font-sans uppercase">
              {activeEvent.title}
            </h3>

            <div className="space-y-2 text-xs sm:text-sm text-slate-300 font-mono border-y border-white/10 py-3">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-red-400" />
                <span>{activeEvent.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-400" />
                <span>{activeEvent.timeStr}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-400" />
                <span>{activeEvent.location}</span>
              </div>
            </div>

            <p className="text-slate-300 text-sm">
              {activeEvent.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  const pass = activeEvent.passTypeId;
                  setActiveEvent(null);
                  onOpenBooking(pass);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-600/40"
              >
                <Ticket className="w-4 h-4" />
                <span>Get Pass Now</span>
              </button>

              <a
                href={generateGoogleCalendarUrl(activeEvent)}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-600"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Add to Calendar</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
