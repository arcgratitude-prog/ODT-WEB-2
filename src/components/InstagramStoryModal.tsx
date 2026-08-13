import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Volume2, VolumeX, Sparkles, Calendar, MapPin, Ticket, Heart, Send, Instagram } from 'lucide-react';
import albinaIsaacImg from '../assets/images/albina_and_isaac_1784919294060.jpg';
import studioHeroImg from '../assets/images/urban_studio_hero_1784906979054.jpg';
import coupleImg from '../assets/images/urban_bachata_couple_1784906962781.jpg';
import dripLogoImg from '../assets/images/ai_urbano_drip_logo_1784909928829.jpg';
import { STUDIO_INFO } from '../data/danceData';

interface InstagramStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: (passId?: string) => void;
}

interface StoryItem {
  id: number;
  image: string;
  tagline: string;
  title: string;
  subtitle: string;
  location: string;
  timeAgo: string;
  badge: string;
  ctaText: string;
  passId: string;
}

export const InstagramStoryModal: React.FC<InstagramStoryModalProps> = ({
  isOpen,
  onClose,
  onOpenBooking
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  const stories: StoryItem[] = [
    {
      id: 1,
      image: coupleImg,
      tagline: 'WATCH THEM DANCE',
      title: 'Albina & Isaac Urban Flow Reel',
      subtitle: 'Watch Albina & Isaac dancing live! Urban bachata flow, isolations, & smooth social dance musicality.',
      location: 'Tampa Bay • @ai.urbano',
      timeAgo: 'Just now',
      badge: 'FEATURED REEL',
      ctaText: 'Watch Reel on Instagram',
      passId: 'reel'
    },
    {
      id: 2,
      image: albinaIsaacImg,
      tagline: 'MONTHLY SOCIAL NIGHT',
      title: 'Bachata Invasion ($10)',
      subtitle: 'Every 2nd Friday @ Dance Factory Tampa • 8 PM Class by Albina & Isaac + 9 PM - 1 AM Social with DJ JR!',
      location: 'Dance Factory Tampa',
      timeAgo: '2h ago',
      badge: 'EVERY 2ND FRIDAY',
      ctaText: 'Get $10 Social Pass',
      passId: 'social-invasion-10'
    },
    {
      id: 3,
      image: studioHeroImg,
      tagline: 'SPECIALTY SUNDAY EVENT',
      title: 'Bachata Locura ($15)',
      subtitle: 'Sunday, Aug 16th @ Yuengling Draft Haus • Silver & Black Theme • Presocial Class & DJ JR!',
      location: 'Yuengling Draft Haus Tampa',
      timeAgo: '4h ago',
      badge: 'SPECIAL EDITION',
      ctaText: 'Get Pre-Sale Pass ($15)',
      passId: 'social-presale'
    },
    {
      id: 4,
      image: coupleImg,
      tagline: 'EVERY WEDNESDAY NIGHT',
      title: 'Weekly Urban Bachata Classes',
      subtitle: '7 PM Foundations • 8 PM Skills & Drills • 9 PM Urban Flow • Dance Factory Westshore Mall',
      location: 'Westshore Plaza Mall Unit A10',
      timeAgo: '6h ago',
      badge: 'WEEKLY CLASSES',
      ctaText: 'Book a Class',
      passId: 'dropin-1'
    }
  ];

  const STORY_DURATION_MS = 5000;

  useEffect(() => {
    if (!isOpen) {
      setCurrentIndex(0);
      setProgress(0);
      return;
    }

    if (isPaused) return;

    const interval = 50; // update every 50ms
    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + (interval / STORY_DURATION_MS) * 100;
        if (next >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex(c => c + 1);
            return 0;
          } else {
            // Loop back or close
            setCurrentIndex(0);
            return 0;
          }
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isOpen, currentIndex, isPaused, stories.length]);

  if (!isOpen) return null;

  const currentStory = stories[currentIndex];

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200">
      
      {/* Background Dim Backdrop Click to Close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Story Container Frame (Mobile Story Aspect) */}
      <div 
        className="relative w-full max-w-sm sm:max-w-md h-[85vh] max-h-[750px] rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(236,72,153,0.3)] border border-white/20 bg-black flex flex-col justify-between z-10 select-none"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Background Image with Gradient Overlay */}
        <img
          src={currentStory.image}
          alt={currentStory.title}
          className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/95 pointer-events-none" />

        {/* Top Story Header Controls */}
        <div className="relative z-20 p-4 space-y-3">
          
          {/* Progress Bars Row */}
          <div className="flex gap-1.5 w-full">
            {stories.map((s, idx) => (
              <div key={s.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-75"
                  style={{
                    width: idx < currentIndex ? '100%' : idx === currentIndex ? `${progress}%` : '0%'
                  }}
                />
              </div>
            ))}
          </div>

          {/* User Profile Bar */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[2px]">
                <img
                  src={dripLogoImg}
                  alt="AI Urbano"
                  className="w-full h-full rounded-full object-cover border border-black"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold tracking-tight">{STUDIO_INFO.instagram}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-red-600 text-white font-bold">STORY</span>
                  <span className="text-[10px] text-white/60">• {currentStory.timeAgo}</span>
                </div>
                <span className="text-[10px] text-red-300 font-mono font-bold flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5 text-red-400" />
                  {currentStory.location}
                </span>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/40 hover:bg-black/70 text-white transition-all border border-white/20"
              aria-label="Close Story"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Left / Right Tap Touch Zones for Navigation */}
        <div className="absolute inset-y-16 inset-x-0 z-10 flex">
          <div className="w-1/3 h-full cursor-pointer" onClick={handlePrev} />
          <div className="w-2/3 h-full cursor-pointer" onClick={handleNext} />
        </div>

        {/* Bottom Story Content & Call to Action */}
        <div className="relative z-20 p-5 space-y-3 text-left">
          <div className="inline-block px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-mono font-black uppercase tracking-widest shadow-lg">
            {currentStory.badge}
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-white font-sans uppercase tracking-tight drop-shadow-md">
            {currentStory.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-200 leading-snug drop-shadow-md font-medium">
            {currentStory.subtitle}
          </p>

          {/* Action Button & Likes */}
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                if (currentStory.passId === 'reel') {
                  window.open('https://www.instagram.com/reel/DaYnhyGJtQ_/', '_blank', 'noopener,noreferrer');
                } else {
                  onOpenBooking(currentStory.passId);
                }
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-600/40 flex items-center justify-center gap-2 border border-red-400/40"
            >
              {currentStory.passId === 'reel' ? (
                <Instagram className="w-4 h-4 text-white" />
              ) : (
                <Ticket className="w-4 h-4 text-white" />
              )}
              <span>{currentStory.ctaText}</span>
            </button>

            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-3 rounded-xl border transition-all ${
                isLiked
                  ? 'bg-rose-600 border-rose-500 text-white scale-110'
                  : 'bg-black/60 border-white/20 text-white hover:bg-white/10'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
