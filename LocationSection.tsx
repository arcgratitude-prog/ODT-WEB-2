import React, { useState } from 'react';
import { MapPin, Navigation, Copy, Check, Car, Compass, Instagram } from 'lucide-react';
import { STUDIO_INFO } from '../data/danceData';

export const LocationSection: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(STUDIO_INFO.fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mapsUrl = STUDIO_INFO.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STUDIO_INFO.fullAddress)}`;

  return (
    <section id="location" className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative max-w-4xl mx-auto">

      {/* Section Header */}
      <div className="text-center space-y-3 mb-10 sm:mb-12">
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

      {/* Single Unified Block */}
      <div className="liquid-glass-panel rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl space-y-6">

        <div className="flex items-start justify-between gap-4 flex-wrap">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        {/* Smaller Map Embed */}
        <div className="rounded-2xl overflow-hidden border border-white/10">
          <iframe
            title="Google Map - AI Urbano Dance Studio Tampa"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3524.321798305711!2d-82.52939328817743!3d27.94648317593688!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88c2c34d346e81f9%3A0xb7e00c082c6ea9c6!2sAI%20Urbano!5e0!3m2!1sen!2sus!4v1710000000000!5m2!1sen!2sus"
            width="100%"
            height="220"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10 mt-2">
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

    </section>
  );
};
