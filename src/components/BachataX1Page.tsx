import React, { useState } from 'react';
import { X1Navigation } from './x1/X1Navigation';
import { HeroSection } from './x1/HeroSection';
import { StatementSection } from './x1/StatementSection';
import { MovementBanner } from './x1/MovementBanner';
import { HolisticSection } from './x1/HolisticSection';
import { FoundationSection } from './x1/FoundationSection';
import { ExperienceTimeline } from './x1/ExperienceTimeline';
import { CommunitySection } from './x1/CommunitySection';
import { FinalCTA } from './x1/FinalCTA';
import { X1BookingModal } from './x1/X1BookingModal';
import { studioAmbience } from '../utils/x1Audio';

interface BachataX1PageProps {
  onOpenBooking: (passTypeId?: string, quantity?: number) => void;
  onBackToSite: () => void;
}

export const BachataX1Page: React.FC<BachataX1PageProps> = ({ onOpenBooking, onBackToSite }) => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const handleToggleAudio = () => {
    const playing = studioAmbience.toggle();
    setIsAudioPlaying(playing);
  };

  const handleSelectPass = (passId: string) => {
    setIsBookingOpen(false);
    onOpenBooking(passId);
  };

  return (
    <div className="min-h-screen bg-black text-[#ededed] selection:bg-white selection:text-black antialiased overflow-x-hidden">
      <X1Navigation
        onOpenJoin={() => setIsBookingOpen(true)}
        onBackToSite={onBackToSite}
        isAudioPlaying={isAudioPlaying}
        toggleAudio={handleToggleAudio}
      />

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
