import React, { useState } from 'react';
import { Sparkles, Calendar, Ticket, MapPin, Crown, Menu, X, CheckCircle2, MessageCircle, Instagram, Flame, Star, Gift, User, ChevronDown } from 'lucide-react';
import { STUDIO_INFO } from '../data/danceData';
import { AiUrbanoLogo } from './AiUrbanoLogo';

// X1 isn't ready to launch yet — hides the nav tab entirely rather than
// showing a disabled/"coming soon" state. Flip to true (and flip
// X1_IS_LIVE in BachataX1Page.tsx) when it's time to bring X1 live.
const SHOW_X1_TAB = false;

interface NavbarProps {
  onOpenBooking: (passTypeId?: string, quantity?: number) => void;
  onOpenSavedPasses: () => void;
  currentPage: 'home' | 'social' | 'schedule' | 'review' | 'referral' | 'x1';
  onNavigate: (page: 'home' | 'social' | 'schedule' | 'review' | 'referral' | 'x1', sectionId?: string) => void;
  activeSection: string;
  onOpenStoryModal?: () => void;
  onOpenStudentPortal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onOpenSavedPasses,
  currentPage,
  onNavigate,
  activeSection,
  onOpenStoryModal,
  onOpenStudentPortal
}) => {

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  const handleNavClick = (page: 'home' | 'social' | 'schedule' | 'review' | 'referral' | 'x1', sectionId?: string) => {
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
    onNavigate(page, sectionId);
  };

  const moreLinks = [
    { page: 'schedule' as const, label: 'Schedule', icon: Calendar },
    { page: 'review' as const, label: 'Leave a Review', icon: Star },
    { page: 'referral' as const, label: 'Referrals', icon: Gift },
  ];

  return (
    <>
      {/* Floating Top Navbar for Desktop & Mobile */}
      <header className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[96%] sm:w-[94%] max-w-6xl">
        <nav className="liquid-glass-panel rounded-full px-2.5 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between transition-all duration-300 gap-1.5">
          
          {/* Brand Logo with Instagram Story Ring */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleNavClick('home')}
              className="relative flex items-center gap-1.5 group text-left"
              id="brand-logo-link"
              title="Back to Home"
            >
              {/* Instagram Gradient Story Ring */}
              <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr ${
                currentPage === 'social'
                  ? 'from-purple-500 via-pink-500 to-amber-400 shadow-[0_0_20px_rgba(217,70,239,0.7)]'
                  : 'from-amber-500 via-rose-500 to-purple-600 shadow-[0_0_20px_rgba(236,72,153,0.6)]'
              } p-[2px] flex items-center justify-center animate-pulse group-hover:scale-105 transition-all cursor-pointer`}>
                <div className="w-full h-full rounded-full bg-[#0a0a0c] p-[1.5px] flex items-center justify-center">
                  {currentPage === 'social' ? (
                    <span className="font-mono font-black text-[10px] sm:text-xs text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-400 to-rose-300">
                      ODT
                    </span>
                  ) : (
                    <AiUrbanoLogo className="w-5 h-5 sm:w-7 sm:h-7" />
                  )}
                </div>
              </div>

              {/* Story Badge Text */}
              <div className="hidden xs:flex flex-col">
                <span className="text-xs sm:text-lg font-black tracking-wider text-white font-mono flex items-center gap-1">
                  <Instagram className="w-3 h-3 sm:w-4 sm:h-4 text-pink-400 shrink-0" />
                  <span>{currentPage === 'social' ? '@ODT.DANCE' : '@AI.URBANO'}</span>
                </span>
                <span className="text-[9px] tracking-widest text-white/60 font-medium uppercase -mt-0.5 hidden sm:block">
                  {currentPage === 'social' ? 'ODT Socials' : 'AI Urbano'}
                </span>
              </div>
            </button>
          </div>

          {/* Top Primary Tabs (Visible on BOTH Mobile & Desktop) */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-full border border-white/15 shadow-inner">
            {/* 1. Socials Tab */}
            <button
              onClick={() => handleNavClick('social')}
              id="nav-link-social"
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all duration-200 flex items-center gap-1.5 ${
                currentPage === 'social'
                  ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white font-black shadow-[0_0_15px_rgba(236,72,153,0.5)] scale-105'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${currentPage === 'social' ? 'text-white' : 'text-pink-400'}`} />
              <span>Socials</span>
            </button>

            {/* 2. Classes Tab */}
            <button
              onClick={() => handleNavClick('home')}
              id="nav-link-home"
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all duration-200 flex items-center gap-1.5 ${
                currentPage === 'home'
                  ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-black shadow-[0_0_15px_rgba(220,38,38,0.5)] scale-105'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Ticket className={`w-3.5 h-3.5 ${currentPage === 'home' ? 'text-white' : 'text-rose-400'}`} />
              <span>Classes</span>
            </button>

            {/* X1 Tab — hidden until it's ready to launch (see SHOW_X1_TAB) */}
            {SHOW_X1_TAB && (
              <button
                onClick={() => handleNavClick('x1')}
                id="nav-link-x1"
                className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all duration-200 flex items-center gap-1.5 ${
                  currentPage === 'x1'
                    ? 'bg-white text-black font-black shadow-[0_0_15px_rgba(255,255,255,0.4)] scale-105'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <Flame className={`w-3.5 h-3.5 ${currentPage === 'x1' ? 'text-black' : 'text-rose-400'}`} />
                <span>X1</span>
                <span className={`text-[7px] font-black px-1 py-0.5 rounded-full leading-none ${
                  currentPage === 'x1' ? 'bg-black text-white' : 'bg-white/15 text-slate-300'
                }`}>
                  SOON
                </span>
              </button>
            )}

            {/* Desktop Only: More Dropdown */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-1 ${
                  moreLinks.some(l => l.page === currentPage)
                    ? 'bg-red-600/30 text-white border border-red-500/50'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>More</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${moreDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mini Dropdown Menu */}
              {moreDropdownOpen && (
                <div 
                  className="absolute left-0 mt-2 w-48 rounded-2xl bg-[#0e0c12] border border-white/20 p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1"
                  onMouseLeave={() => setMoreDropdownOpen(false)}
                >
                  {moreLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <button
                        key={link.label}
                        onClick={() => handleNavClick(link.page)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                          currentPage === link.page
                            ? 'bg-red-600 text-white font-bold'
                            : 'text-slate-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 text-rose-400" />
                        <span>{link.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Actions / Hamburger Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Desktop Only: Member Login / My Portal Button */}
            {onOpenStudentPortal && (
              <button
                onClick={onOpenStudentPortal}
                id="header-member-login-btn"
                className="hidden md:flex liquid-glass-btn px-3.5 py-1.5 rounded-full text-xs font-bold text-white items-center gap-1.5 bg-gradient-to-r from-red-950/90 to-slate-900 border border-red-500/40 hover:border-red-400 shadow-md shrink-0"
                title="Member Login & Account Portal"
              >
                <User className="w-3.5 h-3.5 text-red-400" />
                <span>Member Login</span>
              </button>
            )}

            {/* Desktop Only: Book a Class Button — jumps to the pricing/tiers section */}
            <button
              onClick={() => handleNavClick('home', 'passes')}
              id="header-free-pass-btn"
              className="hidden md:flex liquid-glass-btn liquid-btn-primary px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold text-white tracking-wide items-center gap-1.5 shadow-lg shadow-red-600/30 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
              <span>Join a Class</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="mobile-menu-toggle"
              className="md:hidden p-2 rounded-full bg-white/10 border border-white/20 text-slate-200 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Panel (Everything Else in Dropdown) */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 liquid-glass-panel-dark rounded-2xl p-3.5 flex flex-col gap-2 border border-white/20 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
            
            {/* 1. Join a Class CTA — jumps to the pricing/tiers section */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleNavClick('home', 'passes');
              }}
              className="w-full py-3 px-4 rounded-xl text-xs font-black text-white bg-gradient-to-r from-red-600 via-rose-600 to-red-700 border border-red-400 flex items-center justify-between shadow-lg shadow-red-600/30 uppercase tracking-wider"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>Join a Class</span>
              </div>
            </button>

            {/* 2. Member Login / Account Portal */}
            {onOpenStudentPortal && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenStudentPortal();
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 bg-slate-900/90 border border-slate-700 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-red-950 text-red-400 border border-red-500/30">
                    <User className="w-4 h-4" />
                  </div>
                  <span>Member Login & Account Portal</span>
                </div>
              </button>
            )}

            {/* 3. Schedule, Reviews, Referrals */}
            {moreLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.page)}
                  className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:bg-white/10 hover:text-white flex items-center gap-3 transition-colors"
                >
                  <div className="p-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{link.label}</span>
                </button>
              );
            })}

            {/* 4. WhatsApp Group Link */}
            <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
              <a
                href={STUDIO_INFO.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-950/40 border border-emerald-500/40 hover:bg-emerald-900/50 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                Join WhatsApp Group Chat
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Floating Bottom Dock */}
      <div className="md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-md">
        <div className="liquid-glass-panel rounded-full p-1.5 flex items-center justify-around border border-white/20 shadow-2xl shadow-slate-950">
          <button
            onClick={() => handleNavClick('social')}
            className={`p-2 rounded-full transition-all flex flex-col items-center gap-0.5 ${
              currentPage === 'social' ? 'bg-slate-100 text-black shadow-lg shadow-white/30 scale-105 font-bold' : 'text-slate-300 hover:text-white'
            }`}
            title="Socials"
          >
            <Flame className="w-4 h-4" />
            <span className="text-[9px] font-bold tracking-tight">Socials</span>
          </button>

          <button
            onClick={() => handleNavClick('home')}
            className={`p-2 rounded-full transition-all flex flex-col items-center gap-0.5 ${
              currentPage === 'home' ? 'bg-red-600 text-white shadow-lg shadow-red-600/40 scale-105 font-bold' : 'text-slate-300 hover:text-white'
            }`}
            title="Classes"
          >
            <Ticket className="w-4 h-4" />
            <span className="text-[9px] font-bold tracking-tight">Classes</span>
          </button>

          {onOpenStudentPortal && (
            <button
              onClick={onOpenStudentPortal}
              className="p-2 rounded-full text-slate-300 hover:text-white flex flex-col items-center gap-0.5"
              title="Member Login"
            >
              <User className="w-4 h-4 text-red-400" />
              <span className="text-[9px] font-bold tracking-tight">Account</span>
            </button>
          )}

          <button
            onClick={() => onOpenBooking('dropin-1')}
            className="p-2 rounded-full bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/40 flex flex-col items-center gap-0.5 scale-105 font-bold"
            title="Join a Class"
          >
            <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" style={{ animationDuration: '4s' }} />
            <span className="text-[9px] tracking-tight">Free</span>
          </button>
        </div>
      </div>
    </>
  );
};
