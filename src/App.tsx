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
import { TicketModal } from './components/TicketModal';
import { SavedPassesDrawer } from './components/SavedPassesDrawer';
import { CalendarPage } from './components/CalendarPage';
import { ReviewPage } from './components/ReviewPage';
import { ReferralProgramSection } from './components/ReferralProgramSection';
import { InstagramStoryModal } from './components/InstagramStoryModal';
import { StudentPortalModal } from './components/StudentPortalModal';
import { AdminCheckIn } from './components/AdminCheckIn';
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

  // Interactive 3D digital pass — reached via the "View Your Digital
  // Pass" link in the confirmation email, at yoursite.com/?ticket=<id>.
  // Renders standalone, same pattern as the admin check-in page above.
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const ticketId = params.get('ticket');
    if (ticketId) {
      return <DigitalPassPage ticketId={ticketId} />;
    }
  }

  // Bachata X1 has its own complete navigation and stark black visual
  // language — rendered standalone rather than nested inside the main
  // site's Navbar/red-glow-background wrapper, same reasoning as the
  // digital pass page above.
  if (currentPage === 'x1') {
    return (
      <>
        <BachataX1Page
          onOpenBooking={handleOpenBooking}
          onBackToSite={() => handleNavigate('home')}
        />
        {/* Same real checkout modal the rest of the site uses — without
            this, X1's booking buttons would set state with nothing
            mounted to respond to it. */}
        <TicketModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          initialPassTypeId={bookingPassTypeId}
          initialClassTimes={bookingClassTimes}
          initialQuantity={bookingQuantity}
          onPassCreated={handlePassCreated}
        />
      </>
    );
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
          savedPassesCount={savedPasses.length}
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
            <Footer />
          </div>
        ) : currentPage === 'schedule' ? (
          <div className="pt-20 sm:pt-24 min-h-[80vh]">
            <CalendarPage
              onOpenBooking={handleOpenBooking}
              onNavigate={handleNavigate}
            />
            <Footer />
          </div>
        ) : currentPage === 'review' ? (
          <div className="pt-20 sm:pt-24 min-h-[80vh]">
            <ReviewPage
              onOpenBooking={handleOpenBooking}
            />
            <Footer />
          </div>
        ) : currentPage === 'referral' ? (
          <div className="pt-20 sm:pt-24 min-h-[80vh]">
            <ReferralProgramSection
              onOpenBooking={handleOpenBooking}
              onNavigateHome={() => handleNavigate('home')}
            />
            <Footer />
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
            <Footer />
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

      {/* Nudge for social-app in-app browsers (Instagram, etc.) where wallet
          checkout misbehaves — prompts opening in a real browser. */}
      <InAppBrowserNotice />

    </div>
  );
}

