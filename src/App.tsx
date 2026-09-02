import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BachataLocuraSocialSection } from './components/BachataLocuraSocialSection';
import { BachataX1Page } from './components/BachataX1Page';
import { SpecialEventsSection } from './components/SpecialEventsSection';
import { ScheduleSection } from './components/ScheduleSection';
import { PricingSection } from './components/PricingSection';
import { LocationSection } from './components/LocationSection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { PolicyPage } from './components/PolicyPage';
import { ResetPasswordPage } from './components/ResetPasswordPage';
import { TicketModal } from './components/TicketModal';
import { SavedPassesDrawer } from './components/SavedPassesDrawer';
import { CalendarPage } from './components/CalendarPage';
import { ReviewPage } from './components/ReviewPage';
import { ReferralProgramSection } from './components/ReferralProgramSection';
import { InstagramStoryModal } from './components/InstagramStoryModal';
import { StudentPortalModal } from './components/StudentPortalModal';
import { AdminCheckIn } from './components/AdminCheckIn';
import { AdminMembers } from './components/AdminMembers';
import { InAppBrowserNotice } from './components/InAppBrowserNotice';
import { DigitalPassPage } from './components/DigitalPassPage';
import { TicketPass } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'social' | 'schedule' | 'review' | 'referral' | 'x1'>('home');
  const [savedPasses, setSavedPasses] = useState<TicketPass[]>([]);
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [bookingPassTypeId, setBookingPassTypeId] = useState<string>('social-presale');
  const [bookingClassTimes, setBookingClassTimes] = useState<string[]>([]);
  const [bookingQuantity, setBookingQuantity] = useState<number>(1);
  const [isSavedPassesOpen, setIsSavedPassesOpen] = useState<boolean>(false);
  const [isStudentPortalOpen, setIsStudentPortalOpen] = useState<boolean>(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState<boolean>(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('schedule');


  // Load saved passes from localStorage
  useEffect(() => {
    try {
      const localData = localStorage.getItem('urban_bachata_passes');
      if (localData) {
        setSavedPasses(JSON.parse(localData));
      }
    } catch (e) {
      console.error('Failed to load local passes:', e);
    }
  }, []);

  // Capture a referral code from the URL (?ref=CODE) the moment anyone
  // arrives via a referral link, and persist it so it survives normal
  // browsing/navigation around the site even if they don't sign up on
  // this exact page. This is what "the referral information must
  // persist while the new person navigates the site" actually means in
  // practice — it's read again later, at the moment of signup, in
  // TicketModal.tsx / StudentPortalModal.tsx.
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref');
      if (ref && ref.trim()) {
        localStorage.setItem('ai_urbano_pending_referral_code', ref.trim());
      }
    } catch (e) {
      console.error('Failed to capture referral code:', e);
    }
  }, []);

  // Intersection observer for section tracking
  useEffect(() => {
    if (currentPage !== 'home') return;

    const handleScroll = () => {
      const sections = ['events', 'schedule', 'passes', 'location'];
      const scrollPos = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  const handleNavigate = (page: 'home' | 'social' | 'schedule' | 'review' | 'referral' | 'x1', sectionId?: string) => {
    setCurrentPage(page);
    if (page === 'social' || page === 'schedule' || page === 'review' || page === 'referral' || page === 'x1') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (sectionId) {
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 50);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleOpenBooking = (passTypeId: string = 'dropin-1', quantity: number = 1) => {
    setBookingPassTypeId(passTypeId);
    setBookingClassTimes([]);
    setBookingQuantity(quantity);
    setIsBookingOpen(true);
  };

  // Used by the Drop-Ins tier picker, which also captures which specific
  // class hour(s) the customer selected (e.g. ["7:00 PM - 8:00 PM"]).
  const handleOpenDropInBooking = (passTypeId: string, classTimes: string[]) => {
    setBookingPassTypeId(passTypeId);
    setBookingClassTimes(classTimes);
    setBookingQuantity(1);
    setIsBookingOpen(true);
  };

  const handlePassCreated = (newPass: TicketPass) => {
    const updated = [newPass, ...savedPasses];
    setSavedPasses(updated);
    try {
      localStorage.setItem('urban_bachata_passes', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save pass to localStorage:', e);
    }
  };

  const handleRemovePass = (ticketId: string) => {
    const updated = savedPasses.filter(p => p.ticketId !== ticketId);
    setSavedPasses(updated);
    try {
      localStorage.setItem('urban_bachata_passes', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update localStorage:', e);
    }
  };

  // Private staff tool — reached directly at yoursite.com/?admin=checkin,
  // not linked anywhere in the public nav. Renders standalone, skipping
  // the public site's Navbar/Footer/background entirely.
  if (typeof window !== 'undefined' && window.location.search.toLowerCase().includes('admin=checkin')) {
    return <AdminCheckIn />;
  }

  // Private staff tool — reached directly at yoursite.com/?admin=members.
  // Same reasoning as admin=checkin above.
  if (typeof window !== 'undefined' && window.location.search.toLowerCase().includes('admin=members')) {
    return <AdminMembers />;
  }

  // Interactive 3D digital pass — reached via the "View Your Digital
  // Pass" link in the confirmation email, at yoursite.com/?ticket=<id>.
  // Renders standalone, same pattern as the admin check-in page above.
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const ticketId = params.get('ticket');
    if (ticketId) {
      return <DigitalPassPage ticketId={ticketId} />;
    }
    // Password reset — reached via the link in the password reset
    // email, at yoursite.com/?reset=<token>.
    const resetToken = params.get('reset');
    if (resetToken) {
      return <ResetPasswordPage token={resetToken} />;
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-100 relative selection:bg-red-600 selection:text-white overflow-x-hidden pb-24 md:pb-0">
      
      {/* Immersive Background Atmosphere (Red & Black) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[60%] rounded-full bg-red-900/25 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[70%] rounded-full bg-red-600/20 blur-[130px]"></div>
        <div className="absolute top-[20%] right-[10%] w-[35%] h-[40%] rounded-full bg-red-950/30 blur-[100px]"></div>
      </div>

      <div className="relative z-10">
        {/* Floating Navbar */}
        <Navbar
          onOpenBooking={handleOpenBooking}
          onOpenSavedPasses={() => setIsSavedPassesOpen(true)}
          currentPage={currentPage}
          onNavigate={handleNavigate}
          activeSection={activeSection}
          onOpenStoryModal={() => setIsStoryModalOpen(true)}
          onOpenStudentPortal={() => setIsStudentPortalOpen(true)}
        />


        {currentPage === 'social' ? (
          <div className="pt-20 sm:pt-24 min-h-[80vh]">
            <BachataLocuraSocialSection
              onOpenBooking={handleOpenBooking}
              onNavigateToHome={() => handleNavigate('home')}
            />
            <Footer onOpenPolicy={() => setIsPolicyOpen(true)} />
          </div>
        ) : currentPage === 'x1' ? (
          <div className="min-h-[80vh]">
            <BachataX1Page
              onOpenBooking={handleOpenBooking}
            />
            <Footer onOpenPolicy={() => setIsPolicyOpen(true)} />
          </div>
        ) : currentPage === 'schedule' ? (
          <div className="pt-20 sm:pt-24 min-h-[80vh]">
            <CalendarPage
              onOpenBooking={handleOpenBooking}
              onNavigate={handleNavigate}
            />
            <Footer onOpenPolicy={() => setIsPolicyOpen(true)} />
          </div>
        ) : currentPage === 'review' ? (
          <div className="pt-20 sm:pt-24 min-h-[80vh]">
            <ReviewPage
              onOpenBooking={handleOpenBooking}
            />
            <Footer onOpenPolicy={() => setIsPolicyOpen(true)} />
          </div>
        ) : currentPage === 'referral' ? (
          <div className="pt-20 sm:pt-24 min-h-[80vh]">
            <ReferralProgramSection
              onOpenBooking={handleOpenBooking}
              onNavigateHome={() => handleNavigate('home')}
              onOpenStudentPortal={() => setIsStudentPortalOpen(true)}
            />
            <Footer onOpenPolicy={() => setIsPolicyOpen(true)} />
          </div>
        ) : (
          <>
            {/* Hero Section */}
            <Hero
              onOpenBooking={handleOpenBooking}
            />

            {/* Class Schedule Section */}
            <ScheduleSection
              onOpenBooking={handleOpenBooking}
            />

            {/* Drop-In Passes & Calculator Section */}
            <PricingSection
              onOpenBooking={handleOpenBooking}
              onOpenDropInBooking={handleOpenDropInBooking}
            />

            {/* Location & Studio Section */}
            <LocationSection />

            {/* FAQ Section */}
            <FAQSection />

            {/* Footer */}
            <Footer onOpenPolicy={() => setIsPolicyOpen(true)} />
          </>
        )}
      </div>

      {/* Digital Pass Ticket Generator Modal */}
      <TicketModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialPassTypeId={bookingPassTypeId}
        initialClassTimes={bookingClassTimes}
        initialQuantity={bookingQuantity}
        onPassCreated={handlePassCreated}
      />

      {/* Saved Passes Drawer */}
      <SavedPassesDrawer
        isOpen={isSavedPassesOpen}
        onClose={() => setIsSavedPassesOpen(false)}
        passes={savedPasses}
        onRemovePass={handleRemovePass}
      />

      {/* Instagram Story Modal */}
      <InstagramStoryModal
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
        onOpenBooking={handleOpenBooking}
      />

      {/* Student Account Portal Modal */}
      <StudentPortalModal
        isOpen={isStudentPortalOpen}
        onClose={() => setIsStudentPortalOpen(false)}
        savedPasses={savedPasses}
        onOpenBooking={handleOpenBooking}
      />

      {/* Privacy & Refund Policy overlay — reachable from the footer on
          every page */}
      {isPolicyOpen && (
        <div className="fixed inset-0 z-[60] bg-[#0a0a0c] overflow-y-auto">
          <PolicyPage onBack={() => setIsPolicyOpen(false)} />
        </div>
      )}

      {/* Nudge for social-app in-app browsers (Instagram, etc.) where wallet
          checkout misbehaves — prompts opening in a real browser. */}
      <InAppBrowserNotice />

    </div>
  );
}

