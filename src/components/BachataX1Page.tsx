import React, { useState } from 'react';
import { HeroSection } from './x1/HeroSection';
import { StatementSection } from './x1/StatementSection';
import { MovementBanner } from './x1/MovementBanner';
import { HolisticSection } from './x1/HolisticSection';
import { FoundationSection } from './x1/FoundationSection';
import { ExperienceTimeline } from './x1/ExperienceTimeline';
import { CommunitySection } from './x1/CommunitySection';
import { FinalCTA } from './x1/FinalCTA';
import { X1BookingModal } from './x1/X1BookingModal';

interface BachataX1PageProps {
  onOpenBooking: (passTypeId?: string, quantity?: number) => void;
}

// No standalone nav/header here — this renders as page CONTENT underneath
// the site's persistent Navbar (same pattern as every other tab), so
// switching to/from X1 feels like the rest of the site rather than
// navigating to a separate webpage.
export const BachataX1Page: React.FC<BachataX1PageProps> = ({ onOpenBooking }) => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const handleSelectPass = (passId: string) => {
    setIsBookingOpen(false);
    onOpenBooking(passId);
  };

  return (
    <div className="bg-black text-[#ededed] selection:bg-white selection:text-black antialiased overflow-x-hidden">
      <main>
        <HeroSection onOpenJoin={() => setIsBookingOpen(true)} />
        <StatementSection />
        <MovementBanner />
        <HolisticSection />
        <FoundationSection />
        <ExperienceTimeline />
        <CommunitySection />
        <FinalCTA onOpenJoin={() => setIsBookingOpen(true)} />
      </main>

      <X1BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onSelectPass={handleSelectPass}
      />
    </div>
  );
};
