import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BachataLocuraSocialSection } from './components/BachataLocuraSocialSection';
import { SpecialEventsSection } from './components/SpecialEventsSection';
import { ScheduleSection } from './components/ScheduleSection';
import { PricingSection } from './components/PricingSection';
import { AudioVibePlayer } from './components/AudioVibePlayer';
import { LocationSection } from './components/LocationSection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { TicketModal } from './components/TicketModal';
import { SavedPassesDrawer } from './components/SavedPassesDrawer';
import { CalendarPage } from './components/CalendarPage';
import { SecretSpecialPage } from './components/SecretSpecialPage';
import { ReviewPage } from './components/ReviewPage';
import { ReferralProgramSection } from './components/ReferralProgramSection';
import { BackgroundVinylPlayer } from './components/BackgroundVinylPlayer';
import { InstagramStoryModal } from './components/InstagramStoryModal';
import { StudentPortalModal } from './components/StudentPortalModal';
import { TicketPass } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'social' | 'schedule' | 'review' | 'referral' | 'secret-openhouse'>('home');
  const [savedPasses, setSavedPasses] = useState<TicketPass[]>([]);
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [bookingPassTypeId, setBookingPassTypeId] = useState<string>('social-presale');
  const [isSavedPassesOpen, setIsSavedPassesOpen] = useState<boolean>(false);
  const [isStudentPortalOpen, setIsStudentPortalOpen] = useState<boolean>(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState<boolean>(false);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState<boolean>(false);
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
      const sections = ['events', 'schedule', 'passes', 'vibe', 'location'];
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

  const handleToggleMusic = () => {
    if (currentPage !== 'home') {
      handleNavigate('home', 'vibe');
    } else {
      const el = document.getElementById('vibe');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsPlayingMusic(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-100 relative selection:bg-red-600 selection:text-white overflow-x-hidden pb-24 md:pb-0">
      
      {/* Immersive Background Atmosphere (Red & Black) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[60%] rounded-full bg-red-900/25 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[70%] rounded-full bg-red-600/20 blur-[130px]"></div>
        <div className="absolute top-[20%] right-[10%] w-[35%] h-[40%] rounded-full bg-red-950/30 blur-[100px]"></div>
      </div>

      <div className="relative z-10">
        {/* Floating Top-Right Spinning Vinyl Player Widget */}
        <BackgroundVinylPlayer videoId="kE1-O0tU-UU" />

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
          onOpenPlaylist={() => setIsPlaylistOpen(true)}
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
              onToggleMusic={handleToggleMusic}
              isPlayingMusic={isPlayingMusic}
            />

            {/* Class Schedule Section */}
            <ScheduleSection
              onOpenBooking={handleOpenBooking}
            />

            {/* Drop-In Passes & Calculator Section */}
            <PricingSection
              onOpenBooking={handleOpenBooking}
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

      {/* AI Playlist Modal */}
      {isPlaylistOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsPlaylistOpen(false)}
              className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-colors"
              aria-label="Close AI Playlist"
            >
              <X className="w-5 h-5" />
            </button>
            <AudioVibePlayer
              isPlaying={isPlayingMusic}
              onTogglePlay={handleToggleMusic}
            />
          </div>
        </div>
      )}

    </div>
  );
}

