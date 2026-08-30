import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Compass, 
  HelpCircle, 
  ChevronDown, 
  Sparkles, 
  Navigation, 
  Check, 
  Shirt, 
  ExternalLink 
} from 'lucide-react';
import { TicketData } from '../../types/digitalPass';

interface EventDetailsProps {
  ticket: TicketData;
}

export const EventDetails: React.FC<EventDetailsProps> = ({ ticket }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Do I need to bring a dance partner?',
      a: 'No partner required! During our workshops, we rotate partners frequently so everyone gets to practice and meet fellow dancers. If you come with a partner and prefer not to rotate, you are also welcome to stay paired up.'
    },
    {
      q: 'What is the recommended dress code and footwear?',
      a: 'Smart casual, stylish Latin nightlife attire, or athletic-breathable clothing for workshops. Suede-soled or smooth leather dance shoes are recommended. Flat rubber sneakers with heavy grip are not advised as they restrict turns.'
    },
    {
      q: 'How do I check in at the door on the night of the event?',
      a: 'Simply have your interactive 3D digital pass, Apple/Google Wallet pass, or barcode open on your phone. Our door staff will scan your QR code for instant entry and issue your wristband.'
    },
    {
      q: 'Can I transfer my pass to a friend if I cannot attend?',
      a: 'Yes! Passes can be transferred up to 4 hours before doors open by emailing tickets@officialdancetheory.com with your Order Number and the new attendee\'s full name.'
    }
  ];

  return (
    <div id="odt-event-details-section" className="space-y-6">
      {/* Schedule & Curriculum */}
      <div className="bg-[#141026] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="p-2 rounded-xl bg-pink-500/15 border border-pink-500/30 text-pink-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-['Syne'] text-lg font-bold text-white">
              Event Timeline & Workshop Schedule
            </h3>
            <p className="text-xs text-white/50">
              Doors open 30 minutes before workshop start
            </p>
          </div>
        </div>

        {/* Timeline Items */}
        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-fuchsia-500 before:via-violet-500 before:to-cyan-400">
          {ticket.schedule.map((item, idx) => (
            <div key={idx} className="relative group">
              {/* Timeline Dot */}
              <div className="absolute -left-[29px] top-1.5 w-4 h-4 rounded-full bg-[#141026] border-2 border-fuchsia-400 flex items-center justify-center group-hover:scale-125 transition-transform shadow-[0_0_8px_#d946ef]">
                <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-400" />
              </div>

              <div className="bg-black/30 border border-white/5 rounded-2xl p-4 hover:border-white/15 transition-all">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-fuchsia-300 bg-fuchsia-950/60 px-2 py-0.5 rounded border border-fuchsia-500/30">
                    {item.time}
                  </span>
                  <span className="text-[11px] text-white/40">Official Dance Theory Session</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-300">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Course Curriculum Highlights if available */}
        {ticket.curriculum && ticket.curriculum.length > 0 && (
          <div className="mt-6 pt-5 border-t border-white/10">
            <h4 className="text-xs font-bold uppercase tracking-wider text-fuchsia-400 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Core Concepts Covered:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ticket.curriculum.map((topic, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-white/80 bg-white/5 p-2.5 rounded-xl border border-white/5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{topic}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Venue Location & Directions */}
      <div className="bg-[#141026] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-['Syne'] text-lg font-bold text-white">
                Venue & Arrival Information
              </h3>
              <p className="text-xs text-white/50">
                Tampa, Florida
              </p>
            </div>
          </div>

          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ticket.venueName + ' ' + ticket.venueAddress + ' ' + ticket.cityState)}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Open in Google Maps</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-3">
            <div className="bg-black/30 p-4 rounded-2xl border border-white/5">
              <p className="text-white/50 text-[10px] uppercase font-bold tracking-wider mb-1">
                Studio Address
              </p>
              <p className="text-white font-bold text-sm">
                {ticket.venueName}
              </p>
              <p className="text-slate-300 text-xs mt-0.5">
                {ticket.venueAddress}
              </p>
              <p className="text-slate-300 text-xs">
                {ticket.cityState}
              </p>
            </div>

            <div className="bg-black/30 p-4 rounded-2xl border border-white/5 space-y-1.5 text-xs text-slate-300">
              <p className="text-fuchsia-400 font-bold uppercase tracking-wider text-[10px]">
                🚗 Parking & Entrance Guide:
              </p>
              <p>• Free spacious parking lot directly in front of the venue.</p>
              <p>• Enter through the main double doors marked "Dance Factory / Dance Theory".</p>
              <p>• Have your ID and digital pass ready for scan upon entry.</p>
            </div>
          </div>

          {/* Interactive Map Visual Simulator */}
          <div className="relative h-48 sm:h-auto min-h-[160px] rounded-2xl overflow-hidden border border-white/10 bg-[#0d0a1c] flex flex-col items-center justify-center p-4 text-center">
            {/* Stylized dark map grid background */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d946ef_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0a1c] via-transparent to-transparent" />

            <div className="relative z-10 space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-pink-500 p-0.5 mx-auto shadow-lg shadow-fuchsia-500/20 animate-bounce">
                <div className="w-full h-full bg-[#0a0a0a] rounded-[14px] flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-pink-400" />
                </div>
              </div>
              <p className="font-['Syne'] text-white font-bold text-sm">
                {ticket.venueName}
              </p>
              <p className="text-[11px] text-cyan-300 font-mono">
                Tampa, Florida • ODT Home Ground
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-[#141026] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="p-2 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-['Syne'] text-lg font-bold text-white">
              Frequently Asked Questions
            </h3>
            <p className="text-xs text-white/50">
              Need help preparing for class or the social?
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx} 
                className="bg-black/30 border border-white/5 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 text-sm font-semibold text-white hover:text-fuchsia-400 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-white/50 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-fuchsia-400' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-white/5 pt-2">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
