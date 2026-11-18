import React, { useState } from 'react';
import { Menu, X, MessageCircle } from 'lucide-react';
import { STUDIO_INFO } from '../data/danceData';
import { AiUrbanoLogo } from './AiUrbanoLogo';

// X1 isn't ready to launch yet — hides the nav link entirely rather than
// showing a disabled/"coming soon" state. Flip to true (and flip
// X1_IS_LIVE in BachataX1Page.tsx) when it's time to bring X1 live.
const SHOW_X1_TAB = false;

type Page = 'home' | 'social' | 'schedule' | 'review' | 'referral' | 'x1';

interface NavbarProps {
  onOpenBooking: (passTypeId?: string, quantity?: number) => void;
  onOpenSavedPasses: () => void;
  currentPage: Page;
  onNavigate: (page: Page, sectionId?: string) => void;
  activeSection: string;
  onOpenStoryModal?: () => void;
  onOpenStudentPortal?: () => void;
}

// A deliberately plain header: logo on the left, a short row of text links,
// and "Sign In" on the right. On phones the same links collapse into one
// simple menu — no second bottom bar, no dropdowns, no extra buttons.
export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenStudentPortal,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const go = (page: Page, sectionId?: string) => {
    setMenuOpen(false);
    onNavigate(page, sectionId);
  };

  const links: { page: Page; label: string }[] = [
    { page: 'home', label: 'Classes' },
    { page: 'social', label: 'Socials' },
    { page: 'schedule', label: 'Schedule' },
    ...(SHOW_X1_TAB ? [{ page: 'x1' as const, label: 'X1' }] : []),
    { page: 'referral', label: 'Referrals' },
    { page: 'review', label: 'Reviews' },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#0a0a0c]/90 backdrop-blur-xl border-b border-white/10">
      <nav className="max-w-6xl mx-auto h-14 px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          onClick={() => go('home')}
          id="brand-logo-link"
          title="Back to Home"
          className="flex items-center gap-2 shrink-0"
        >
          <AiUrbanoLogo className="w-7 h-7" />
          <span className="text-sm sm:text-base font-black tracking-wide text-white">
            {currentPage === 'social' ? 'ODT Socials' : 'AI Urbano'}
          </span>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <button
              key={l.page}
              onClick={() => go(l.page)}
              id={`nav-link-${l.page}`}
              className={`text-sm font-semibold transition-colors py-1 border-b-2 ${
                currentPage === l.page
                  ? 'text-white border-red-500'
                  : 'text-slate-300 border-transparent hover:text-white'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Sign in + mobile toggle */}
        <div className="flex items-center gap-2 shrink-0">
          {onOpenStudentPortal && (
            <button
              onClick={onOpenStudentPortal}
              id="header-member-login-btn"
              title="Member Login & Account Portal"
              className="text-sm font-semibold text-white px-3.5 py-1.5 rounded-full border border-white/25 hover:bg-white/10 transition-colors"
            >
              Sign In
            </button>
          )}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            id="mobile-menu-toggle"
            className="md:hidden p-2 rounded-full text-slate-200 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0a0a0c] px-4 py-2 flex flex-col">
          {links.map((l) => (
            <button
              key={l.page}
              onClick={() => go(l.page)}
              className={`text-left py-3 text-base font-semibold border-b border-white/5 ${
                currentPage === l.page ? 'text-white' : 'text-slate-300'
              }`}
            >
              {l.label}
            </button>
          ))}
          <a
            href={STUDIO_INFO.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 text-base font-semibold text-emerald-300 flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp Group
          </a>
        </div>
      )}
    </header>
  );
};
