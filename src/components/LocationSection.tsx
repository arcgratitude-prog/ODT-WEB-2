import React, { useState } from 'react';
import { MapPin, Navigation, Copy, Check, Car, ShieldCheck, Sparkles, Clock, Compass, MessageCircle, Instagram } from 'lucide-react';
import { STUDIO_INFO } from '../data/danceData';
import { AiUrbanoLogo } from './AiUrbanoLogo';

export const LocationSection: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(STUDIO_INFO.fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mapsUrl = STUDIO_INFO.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STUDIO_INFO.fullAddress)}`;

  return (
    <section id="location" className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center space-y-3 mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-badge border border-red-500/40 text-xs font-bold text-red-400 uppercase tracking-[0.25em]">
          <MapPin className="w-3.5 h-3.5 text-red-400" />
          STUDIO LOCATION & PARKING
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-sans tracking-tight">
          DANCE FACTORY • <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-300 to-red-600 urban-text-glow">WESTSHORE PLAZA</span>
        </h2>

        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
          Located inside WestShore Plaza Mall in Tampa, FL. Free parking & air-conditioned studio!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Address Card */}
        <div className="lg:col-span-6 liquid-glass-panel rounded-3xl p-6 sm:p-8 border border-white/20 flex flex-col justify-between shadow-2xl">
          
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest block mb-1">
                  OFFICIAL STUDIO SUITE
                </span>
                <h3 className="text-2xl font-black text-white uppercase font-sans">
                  {STUDIO_INFO.name}
                </h3>
                <p className="text-sm font-semibold text-slate-300">
                  Located inside {STUDIO_INFO.mallName}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-red-600/20 text-red-400 border border-red-500/30 shrink-0">
                <Navigation className="w-6 h-6" />
              </div>
            </div>

            {/* Address Box */}
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/10 space-y-2">
              <div className="text-xs font-mono text-slate-400 uppercase font-bold">
                Street Address:
              </div>
              <div className="text-base font-bold text-white font-mono">
                {STUDIO_INFO.fullAddress}
              </div>
            </div>

            {/* Parking & Mall Directions */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 shrink-0 mt-0.5">
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase">Free Mall Parking</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {STUDIO_INFO.parkingInfo}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase">Mall Entrance Guide</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Enter through the main mall wing facing Westshore Plaza. Look for suite <strong>A10 (Dance Factory)</strong> near the center courtyard.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 border-t border-white/10 mt-6">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="liquid-glass-btn liquid-btn-primary py-3.5 px-4 rounded-2xl text-xs font-black text-white uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-600/30"
            >
              <Navigation className="w-4 h-4" />
              <span>Open Google Maps</span>
            </a>

            <button
              onClick={copyAddress}
              className="liquid-glass-btn liquid-btn-secondary py-3.5 px-4 rounded-2xl text-xs font-bold text-slate-200 hover:text-white flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Address Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Copy Address</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Right Column: Studio Amenities Grid */}
        <div className="lg:col-span-6 liquid-glass-panel rounded-3xl p-6 sm:p-8 border border-white/15 flex flex-col justify-between shadow-xl">
          <div>
            <h3 className="text-xl font-black text-white uppercase font-sans mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              STUDIO AMENITIES & FEATURES
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {STUDIO_INFO.amenities.map((amenity, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 flex items-center gap-3"
                >
                  <ShieldCheck className="w-4 h-4 text-red-400 shrink-0" />
                  <span className="text-xs font-semibold text-slate-200">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Social & Community Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {/* Instagram Banner */}
            <a
              href={STUDIO_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-red-950/80 to-black p-4 rounded-2xl border border-red-500/40 hover:border-red-500 flex items-center justify-between gap-3 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-red-400 font-mono font-bold uppercase block">
                    Instagram
                  </span>
                  <span className="text-sm font-black text-white font-mono group-hover:text-red-400 transition-colors flex items-center gap-1.5">
                    <Instagram className="w-4 h-4 text-red-400 shrink-0" />
                    {STUDIO_INFO.instagram}
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Follow →</span>
            </a>

            {/* WhatsApp Community Chat Banner */}
            <a
              href={STUDIO_INFO.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-emerald-950/80 to-black p-4 rounded-2xl border border-emerald-500/40 hover:border-emerald-500 flex items-center justify-between gap-3 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase block">
                    WhatsApp Group
                  </span>
                  <span className="text-sm font-black text-white font-mono group-hover:text-emerald-300 transition-colors">
                    Join Community
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Join Chat →</span>
            </a>
          </div>

        </div>

      </div>

      {/* Google Map Embed & Service Area Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-8">
        
        {/* Map Embed Container */}
        <div className="lg:col-span-7 liquid-glass-panel rounded-3xl p-3 border border-white/20 shadow-2xl overflow-hidden min-h-[320px]">
          <iframe
            title="Google Map - AI Urbano Dance Studio Tampa"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3524.321798305711!2d-82.52939328817743!3d27.94648317593688!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88c2c34d346e81f9%3A0xb7e00c082c6ea9c6!2sAI%20Urbano!5e0!3m2!1sen!2sus!4v1710000000000!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0, borderRadius: '1.25rem', minHeight: '320px' }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Tampa Service Areas & Neighborhoods Card */}
        <div className="lg:col-span-5 liquid-glass-panel rounded-3xl p-6 sm:p-8 border border-white/15 flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest block">
              LOCAL TAMPA BAY SERVICE AREA
            </span>
            <h3 className="text-2xl font-black text-white uppercase font-sans">
              BACHATA CLASSES IN TAMPA & NEARBY AREAS
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Conveniently located at WestShore Plaza in South Tampa, AI Urbano welcomes dancers from across the entire Tampa Bay metropolitan area:
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2">
              {[
                { name: 'South Tampa', time: '5 mins away' },
                { name: 'Ybor City', time: '12 mins away' },
                { name: 'Downtown Tampa', time: '10 mins away' },
                { name: 'Brandon / Riverview', time: '18 mins away' },
                { name: 'St. Petersburg', time: '20 mins away' },
                { name: 'Clearwater', time: '25 mins away' },
                { name: 'Carrollwood', time: '15 mins away' },
                { name: 'Wesley Chapel', time: '30 mins away' }
              ].map((area, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-950/70 border border-white/10 flex flex-col">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                    {area.name}
                  </span>
                  <span className="text-[10px] text-slate-400 pl-4">{area.time}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-slate-400 italic pt-4 border-t border-white/10 mt-4">
            * Direct highway access via I-275 & Selmon Expressway with ample free mall parking right at our studio entrance!
          </p>
        </div>

      </div>

    </section>
  );
};
