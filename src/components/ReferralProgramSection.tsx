import React, { useState } from 'react';
import { Gift, Users, Award, Sparkles, Share2, Copy, Check, MessageCircle, Heart, Flame, ShieldCheck, Trophy, ArrowRight } from 'lucide-react';

interface ReferralProgramSectionProps {
  onOpenBooking?: (passTypeId?: string) => void;
  onNavigateHome?: () => void;
}

export const ReferralProgramSection: React.FC<ReferralProgramSectionProps> = ({ onOpenBooking, onNavigateHome }) => {
  const [userName, setUserName] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [referralCount, setReferralCount] = useState<number>(1);

  const refLink = userName.trim() 
    ? `https://officialdancetheory.com?ref=${encodeURIComponent(userName.trim().toLowerCase().replace(/\s+/g, ''))}`
    : `https://officialdancetheory.com?ref=dancefriend`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(refLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = `Hey! Come dance Urban Bachata with me in Tampa at AI Urbano with Albina & Isaac! Get your free open house or class pass here: ${refLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="referrals" className="py-8 sm:py-12 px-3.5 sm:px-6 lg:px-8 relative max-w-7xl mx-auto my-2">
      
      {/* Top Back Navigation Button */}
      {onNavigateHome && (
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={onNavigateHome}
            className="px-4 py-2 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold flex items-center gap-2 transition-all shadow-md group"
          >
            <span className="text-red-400 group-hover:-translate-x-1 transition-transform">←</span>
            <span>Back to Wednesday Classes & Studio Schedule</span>
          </button>
        </div>
      )}

      {/* Background Neon Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-950/30 via-rose-950/20 to-purple-950/30 rounded-3xl blur-3xl pointer-events-none -z-10" />

      <div className="rounded-3xl p-5 sm:p-10 border border-red-500/30 bg-gradient-to-br from-[#12080d] via-[#0d0609] to-[#070305] shadow-[0_20px_60px_rgba(225,29,72,0.15)] relative overflow-hidden">
        
        {/* Header Title */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-mono font-bold text-xs uppercase tracking-widest shadow-md">
            <Gift className="w-4 h-4 text-red-400 animate-bounce" />
            <span>AI URBANO REFERRAL REWARDS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight font-sans">
            BRING FRIENDS. <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-pink-500">GET FREE DANCE.</span>
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            Dancing is always better with friends! Invite your dance crew to AI Urbano Bachata in Tampa and unlock free socials, discounts on full cycles, and private lessons with Albina & Isaac.
          </p>
        </div>

        {/* 3 Tier Reward Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-10">
          
          {/* TIER 1 */}
          <div className={`p-6 rounded-2xl border transition-all relative flex flex-col justify-between ${
            referralCount >= 1 
              ? 'bg-gradient-to-b from-red-950/70 via-red-950/40 to-black border-red-500/60 shadow-lg shadow-red-600/20' 
              : 'bg-slate-900/40 border-slate-800'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-black uppercase tracking-wider bg-red-600 text-white shadow-md">
                  1 REFERRAL
                </span>
                <Users className="w-5 h-5 text-red-400" />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">Free Social OR Free Drop-In</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Bring 1 friend to any Wednesday class or social event, and your next Social entry or Drop-in class is 100% FREE!
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">Value: $10 – $20</span>
              <span className="text-xs font-bold text-red-400 flex items-center gap-1">
                Reward Tier 1 <Check className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* TIER 2 */}
          <div className={`p-6 rounded-2xl border transition-all relative flex flex-col justify-between ${
            referralCount >= 3 
              ? 'bg-gradient-to-b from-rose-950/80 via-rose-950/40 to-black border-rose-500/70 shadow-xl shadow-rose-600/25 scale-[1.02]' 
              : 'bg-slate-900/50 border-slate-800'
          }`}>
            <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-md">
              MOST POPULAR
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-black uppercase tracking-wider bg-rose-600 text-white shadow-md">
                  3 REFERRALS
                </span>
                <Award className="w-5 h-5 text-rose-400" />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">$20 OFF Any Cycle</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Bring 3 friends to join AI Urbano, and receive $20 OFF any 4-Week or 8-Week Progressive Bachata Cycle of your choice!
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">Save $20 Instant</span>
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                Reward Tier 2 <Check className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* TIER 3 */}
          <div className={`p-6 rounded-2xl border transition-all relative flex flex-col justify-between ${
            referralCount >= 5 
              ? 'bg-gradient-to-b from-amber-950/80 via-purple-950/40 to-black border-amber-500/70 shadow-2xl shadow-amber-500/20' 
              : 'bg-slate-900/40 border-slate-800'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md">
                  5 REFERRALS
                </span>
                <Trophy className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">FREE 1-on-1 Private Lesson</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Refer 5 friends and unlock a FREE 60-minute 1-on-1 private dance coaching session with directors Albina & Isaac!
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] font-mono text-amber-300 font-bold">Value: $100+</span>
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                VIP Tier 3 <Sparkles className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

        </div>

        {/* Interactive Link Generator Box */}
        <div className="bg-black/60 rounded-2xl p-4 sm:p-6 border border-white/10 max-w-3xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Share2 className="w-4 h-4 text-red-400" />
                <span>Get Your Personalized Referral Link</span>
              </h4>
              <p className="text-[11px] text-slate-400">Enter your name or Instagram handle to generate your link</p>
            </div>

            {onOpenBooking && (
              <button
                onClick={() => onOpenBooking('dropin-1')}
                className="px-4 py-1.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto transition-all shadow-md"
              >
                <span>Claim Rewards at Check-in</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
            <input
              type="text"
              placeholder="Your Name (e.g., Alex)"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="sm:col-span-4 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500"
            />

            <div className="sm:col-span-5 relative flex items-center">
              <input
                type="text"
                readOnly
                value={refLink}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-red-300 focus:outline-none truncate pr-10"
              />
              <button
                onClick={handleCopyLink}
                className="absolute right-2 p-1.5 text-slate-400 hover:text-white"
                title="Copy Link"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <button
              onClick={handleShareWhatsApp}
              className="sm:col-span-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Share Link</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
