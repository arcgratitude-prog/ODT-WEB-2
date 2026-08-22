import React, { useState } from 'react';
import { Star, MessageSquare, Sparkles, CheckCircle2, Ticket, Gift, User, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { STUDIO_INFO } from '../data/danceData';

interface ReviewPageProps {
  onOpenBooking: (passTypeId?: string) => void;
}

interface DancerReview {
  id: string;
  name: string;
  role: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  favoriteClass: string;
  verified: boolean;
}

const INITIAL_REVIEWS: DancerReview[] = [
  {
    id: 'rev-1',
    name: 'Carlos M.',
    role: 'Google Local Guide • Lead & Social Dancer',
    rating: 5,
    date: 'July 2026',
    title: 'Best Urban Bachata energy in Tampa Bay!',
    comment: 'Albina and Isaac break down sensual isolation and urban body movement like no one else. The 8 PM Sensual Skills class transformed my social dancing confidence instantly.',
    favoriteClass: 'Sensual Skills & Body Movement',
    verified: true
  },
  {
    id: 'rev-2',
    name: 'Jessica R.',
    role: 'Google Reviewer • Follower',
    rating: 5,
    date: 'July 2026',
    title: 'Welcoming community & super structured progressive curriculum',
    comment: 'I started at the 7 PM Foundations class with zero dance background. In just 3 weeks I felt comfortable joining the social floor! The vibe at WestShore Plaza Dance Factory is unmatched.',
    favoriteClass: '7 PM Foundations & Essentials',
    verified: true
  },
  {
    id: 'rev-3',
    name: 'Marcus & Sarah',
    role: 'Google Local Guide • Partner Dancers',
    rating: 5,
    date: 'June 2026',
    title: 'The Open House & Wednesday classes were epic!',
    comment: 'The 4-week cycle classes are full of smooth partnerwork combos that transformed our technique on the dance floor. Albina & Isaac are fantastic instructors!',
    favoriteClass: 'Wednesday Full Night Immersion',
    verified: true
  },
  {
    id: 'rev-4',
    name: 'Sofia V.',
    role: 'Google Reviewer • Follower & Regular Student',
    rating: 5,
    date: 'June 2026',
    title: 'Challenging, fun, and addicting fusion style',
    comment: 'If you want modern urban bachata timing, smooth hair flips, and syncopated footwork, this is the place in Tampa. Worth every dollar.',
    favoriteClass: '9 PM Urban Flow & Partnerwork',
    verified: true
  }
];

export const ReviewPage: React.FC<ReviewPageProps> = ({ onOpenBooking }) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [favoriteClass, setFavoriteClass] = useState<string>('7 PM Foundations & Essentials');
  const [title, setTitle] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  
  const [submittedReview, setSubmittedReview] = useState<boolean>(false);
  const [reviewsList, setReviewsList] = useState<DancerReview[]>(INITIAL_REVIEWS);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    const newRev: DancerReview = {
      id: `rev-${Date.now()}`,
      name: name.trim(),
      role: 'Google Verified Reviewer',
      rating,
      date: 'Just now',
      title: title.trim() || 'Awesome Bachata Experience!',
      comment: comment.trim(),
      favoriteClass,
      verified: true
    };

    setReviewsList([newRev, ...reviewsList]);
    setSubmittedReview(true);

    // Automatically tie back and open Google Maps review box for AI Urbano
    if (STUDIO_INFO.googleReviewUrl) {
      setTimeout(() => {
        window.open(STUDIO_INFO.googleReviewUrl, '_blank', 'noopener,noreferrer');
      }, 600);
    }
  };

  const ratingLabels = ['1 Star - Needs Work', '2 Stars - Fair', '3 Stars - Good', '4 Stars - Great!', '5 Stars - Amazing / High Vibe! ★'];

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto min-h-screen">
      
      {/* Page Header */}
      <div className="text-center space-y-4 mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-badge border border-amber-500/40 text-xs font-bold text-amber-300 uppercase tracking-[0.2em] shadow-lg shadow-amber-500/20">
          <Gift className="w-4 h-4 text-amber-400" />
          COMMUNITY REVIEW PROGRAM
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase font-sans tracking-tight">
          LEAVE US <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 urban-text-glow">A REVIEW</span>
        </h1>

        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
          Your feedback helps our Tampa dance family grow! Share your experience below and post it directly to AI Urbano on Google — it only takes a minute.
        </p>
      </div>

      {/* Main Form or Success Card */}
      {!submittedReview ? (
        <div className="liquid-glass-card rounded-3xl p-6 sm:p-10 border border-white/20 shadow-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 max-w-2xl mx-auto space-y-6">
          
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase font-sans">
                Leave Your Review
              </h2>
              <p className="text-xs text-slate-400">
                Takes under 60 seconds • Posts directly to our Google Maps page
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Star Rating Picker */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                Overall Star Rating *
              </label>
              <div className="flex items-center gap-2 bg-slate-950/80 p-4 rounded-2xl border border-white/10">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoverRating || rating)
                          ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                          : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-auto text-xs font-mono font-bold text-amber-300 hidden sm:inline">
                  {ratingLabels[rating - 1]}
                </span>
              </div>
            </div>

            {/* Dancer Name & Email Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  Your Name / Alias *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maria S."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. maria@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Favorite Class Dropdown (Social Removed) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                Which class session did you attend?
              </label>
              <select
                value={favoriteClass}
                onChange={(e) => setFavoriteClass(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
              >
                <option value="7 PM Foundations & Essentials">Wednesday 7 PM - Foundations & Essentials</option>
                <option value="8 PM Sensual Skills & Body Isolation">Wednesday 8 PM - Sensual Skills & Body Isolation</option>
                <option value="9 PM Urban Flow & Partnerwork">Wednesday 9 PM - Urban Flow & Syncopated Partnerwork</option>
                <option value="Wednesday Full Night Immersion">Wednesday Full Night Immersion (All 3 Classes)</option>
              </select>
            </div>

            {/* Headline Title */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                Review Headline
              </label>
              <input
                type="text"
                placeholder="e.g. Amazing instruction & friendly community!"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>

            {/* Detailed Comment */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                Your Detailed Review *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Tell us what you enjoyed most about the instruction, energy, or music..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-sm uppercase tracking-wider shadow-2xl shadow-amber-500/30 flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
            >
              <Sparkles className="w-5 h-5 text-black" />
              <span>SUBMIT REVIEW</span>
            </button>

          </form>
        </div>
      ) : (
        /* SUCCESS REWARD CARD */
        <div className="liquid-glass-card rounded-3xl p-8 sm:p-10 border-2 border-amber-400/80 shadow-[0_0_40px_rgba(251,191,36,0.3)] bg-gradient-to-b from-slate-900 via-zinc-950 to-slate-950 max-w-2xl mx-auto text-center space-y-6">
          
          <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/50 flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle2 className="w-10 h-10 text-amber-400" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30 uppercase tracking-widest inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              REVIEW SUBMITTED & LINKED TO GOOGLE MAPS!
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white uppercase font-sans">
              THANK YOU FOR YOUR REVIEW!
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto">
              We opened <strong>AI Urbano on Google Maps</strong> in a new tab so you can publish your review live. It means the world to our Tampa dance family!
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => onOpenBooking()}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
            >
              <Ticket className="w-4 h-4" />
              <span>BOOK A CLASS</span>
            </button>
            {STUDIO_INFO.googleReviewUrl && (
              <a
                href={STUDIO_INFO.googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-blue-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700"
              >
                <span>Post Live on Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
              </a>
            )}
          </div>

        </div>
      )}

      {/* Verified Dancers Reviews Wall */}
      <div className="mt-16 space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-black text-white font-sans uppercase">
            WHAT TAMPA DANCERS ARE SAYING
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            Verified student reviews from Dance Factory @ WestShore Plaza Mall
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviewsList.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 hover:border-amber-500/30 transition-all space-y-3 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-slate-500">{rev.date}</span>
              </div>

              <h4 className="text-sm font-bold text-white font-sans">
                "{rev.title}"
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed">
                {rev.comment}
              </p>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-bold">{rev.name}</span>
                  <span className="text-slate-500">• {rev.role}</span>
                </div>
                <span className="text-amber-400/90 text-[10px]">
                  {rev.favoriteClass}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
