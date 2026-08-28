import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BachataLocuraSocialSection } from './components/BachataLocuraSocialSection';
import { SpecialEventsSection } from './components/SpecialEventsSection';
import { ScheduleSection } from './components/ScheduleSection';
import { PricingSection } from './components/PricingSection';
import { LocationSection } from './components/LocationSection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { TicketModal } from './components/TicketModal';
import { SavedPassesDrawer } from './components/SavedPassesDrawer';
import { CalendarPage } from './components/CalendarPage';
import { SecretSpecialPage } from './components/SecretSpecialPage';
import { ReviewPage } from './components/ReviewPage';
import { ReferralProgramSection } from './components/ReferralProgramSection';
import { InstagramStoryModal } from './components/InstagramStoryModal';
import { StudentPortalModal } from './components/StudentPortalModal';
import { AdminCheckIn } from './components/AdminCheckIn';
import { TicketPass } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'social' | 'schedule' | 'review' | 'referral' | 'secret-openhouse'>('home');
  const [savedPasses, setSavedPasses] = useState<TicketPass[]>([]);
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [bookingPassTypeId, setBookingPassTypeId] = useState<string>('social-presale');
  const [bookingClassTimes, setBookingClassTimes] = useState<string[]>([]);
  const [isSavedPassesOpen, setIsSavedPassesOpen] = useState<boolean>(false);
  const [isStudentPortalOpen, setIsStudentPortalOpen] = useState<boolean>(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('schedule');


  // Check URL query search parameters for secret QR code scan
  useEffect(() => {
    const search = window.location.search.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (search.includes('code=') || search.includes('openhouse') || search.includes('vip') || hash.includes('openhouse')) {
      setCurrentPage('secret-openhouse');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

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

  const handleNavigate = (page: 'home' | 'social' | 'schedule' | 'review' | 'referral' | 'secret-openhouse', sectionId?: string) => {
    setCurrentPage(page);
    if (page === 'social' || page === 'schedule' || page === 'review' || page === 'referral' || page === 'secret-openhouse') {
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

  const handleOpenBooking = (passTypeId: string = 'dropin-1') => {
    setBookingPassTypeId(passTypeId);
    setBookingClassTimes([]);
    setIsBookingOpen(true);
  };

  // Used by the Drop-Ins tier picker, which also captures which specific
  // class hour(s) the customer selected (e.g. ["7:00 PM - 8:00 PM"]).
  const handleOpenDropInBooking = (passTypeId: string, classTimes: string[]) => {
    setBookingPassTypeId(passTypeId);
    setBookingClassTimes(classTimes);
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
            <Footer onNavigateToSecret={() => handleNavigate('secret-openhouse')} />
          </div>
        ) : currentPage === 'schedule' ? (
          <div className="pt-20 sm:pt-24 min-h-[80vh]">
            <CalendarPage
              onOpenBooking={handleOpenBooking}
              onNavigate={handleNavigate}
            />
            <Footer onNavigateToSecret={() => handleNavigate('secret-openhouse')} />
          </div>
        ) : currentPage === 'secret-openhouse' ? (
          <div className="pt-20 sm:pt-24 min-h-[80vh]">
            <SecretSpecialPage
              onOpenBooking={handleOpenBooking}
              onNavigateHome={() => handleNavigate('home')}
            />
            <Footer onNavigateToSecret={() => handleNavigate('secret-openhouse')} />
          </div>
        ) : currentPage === 'review' ? (
          <div className="pt-20 sm:pt-24 min-h-[80vh]">
            <ReviewPage
              onOpenBooking={handleOpenBooking}
            />
            <Footer onNavigateToSecret={() => handleNavigate('secret-openhouse')} />
          </div>
        ) : currentPage === 'referral' ? (
          <div className="pt-20 sm:pt-24 min-h-[80vh]">
            <ReferralProgramSection
              onOpenBooking={handleOpenBooking}
              onNavigateHome={() => handleNavigate('home')}
            />
            <Footer onNavigateToSecret={() => handleNavigate('secret-openhouse')} />
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
            <Footer onNavigateToSecret={() => handleNavigate('secret-openhouse')} />
          </>
        )}
      </div>

      {/* Digital Pass Ticket Generator Modal */}
      <TicketModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialPassTypeId={bookingPassTypeId}
        initialClassTimes={bookingClassTimes}
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

    </div>
  );
}

