import React, { useState, useEffect } from 'react';
import { 
  User, X, LogIn, UserPlus, Calendar, Award, Gift, Ticket, QrCode, CheckCircle2, 
  Sparkles, Flame, Users, Clock, MapPin, Share2, Copy, Check, MessageCircle, LogOut, 
  ChevronRight, Shield, Zap, BookOpen, Star, ArrowRight, Activity, ChevronDown, Trophy, CreditCard
} from 'lucide-react';
import { MemberUser, TicketPass } from '../types';
import { STUDIO_INFO } from '../data/danceData';

interface StudentPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedPasses: TicketPass[];
  onOpenBooking: (passTypeId?: string) => void;
}

const DEFAULT_DEMO_MEMBER: MemberUser = {
  id: 'member-7892',
  name: 'Alex Rivera',
  email: 'alex.rivera@dance.com',
  phone: '(813) 555-0192',
  danceRole: 'Lead',
  level: 'Intermediate',
  joinedDate: 'June 2026',
  referralCode: 'alexrivera',
  referralCount: 2,
  attendanceCount: 7,
  socialsAttendedCount: 4,
  socialPunchGoal: 5,
  totalTicketsPurchased: 3,
  freeSocialRewardEarned: false,
  achievements: [
    { id: '1', title: 'First Steps', desc: 'Attended your first AI Urbano Bachata class', icon: '⚡', date: 'June 2026' },
    { id: '2', title: 'Social Butterfly', desc: 'Attended 4 Bachata Invasion/Locura socials', icon: '💃', date: 'July 2026' },
    { id: '3', title: 'Community Ambassador', desc: 'Referred 2 friends to AI Urbano', icon: '🎁', date: 'July 2026' },
    { id: '4', title: 'Cycle Enrollee', desc: 'Registered for 8-Week Progressive Urban Bachata', icon: '🏆', date: 'August 2026' }
  ],
  enrolledCycles: [
    {
      id: 'track-progression-enrolled',
      title: 'Tier 2: Progression Track (4-Week Course)',
      schedule: 'Wednesdays @ 7:00 PM - 9:00 PM',
      location: 'Dance Factory Tampa',
      startDate: 'August 5, 2026',
      currentWeek: 2,
      totalWeeks: 4,
      nextClassDate: 'Wednesday, Aug 5 (7:00 PM)',
      instructors: 'Albina & Isaac',
      status: 'Active'
    },
    {
      id: 'social-invasion-pass',
      title: 'Bachata Invasion Monthly Pass',
      schedule: '2nd Fridays @ 8:00 PM',
      location: 'Dance Factory Tampa',
      startDate: 'July 2026',
      currentWeek: 1,
      totalWeeks: 4,
      nextClassDate: 'Friday, Sep 11 (8:00 PM)',
      instructors: 'Albina & Isaac',
      status: 'Active'
    }
  ]
};

export const StudentPortalModal: React.FC<StudentPortalModalProps> = ({
  isOpen,
  onClose,
  savedPasses,
  onOpenBooking
}) => {
  const [user, setUser] = useState<MemberUser | null>(null);
  const [selectedView, setSelectedView] = useState<
    'tickets' | 'socials' | 'referrals' | 'cycles' | 'achievements' | 'profile'
  >('socials');
  
  // Login / Signup Form State
  const [isSignUp, setIsSignUp] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [roleInput, setRoleInput] = useState<'Lead' | 'Follow' | 'Both' | 'Social Dancer / Enthusiast'>('Lead');
  const [levelInput, setLevelInput] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedPassForQr, setSelectedPassForQr] = useState<TicketPass | null>(null);
  
  // Simulated punch card check-in state
  const [checkInSuccessMsg, setCheckInSuccessMsg] = useState<string | null>(null);

  // Load user from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('ai_urbano_member_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Failed to load member user:', e);
    }
  }, []);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    const loggedInUser: MemberUser = {
      ...DEFAULT_DEMO_MEMBER,
      name: nameInput.trim() || emailInput.split('@')[0],
      email: emailInput.trim(),
      phone: phoneInput.trim() || DEFAULT_DEMO_MEMBER.phone,
      danceRole: roleInput,
      level: levelInput,
      referralCode: (nameInput.trim() || emailInput.split('@')[0]).toLowerCase().replace(/\s+/g, '')
    };

    setUser(loggedInUser);
    localStorage.setItem('ai_urbano_member_user', JSON.stringify(loggedInUser));
  };

  const handleDemoLogin = () => {
    setUser(DEFAULT_DEMO_MEMBER);
    localStorage.setItem('ai_urbano_member_user', JSON.stringify(DEFAULT_DEMO_MEMBER));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('ai_urbano_member_user');
  };

  const handlePunchCheckIn = () => {
    if (!user) return;
    const newCount = user.socialsAttendedCount + 1;
    const isFreeEarned = newCount >= user.socialPunchGoal;

    const updatedUser: MemberUser = {
      ...user,
      socialsAttendedCount: newCount,
      freeSocialRewardEarned: isFreeEarned || user.freeSocialRewardEarned,
      attendanceCount: user.attendanceCount + 1
    };

    setUser(updatedUser);
    localStorage.setItem('ai_urbano_member_user', JSON.stringify(updatedUser));

    if (newCount === 5) {
      setCheckInSuccessMsg("🎉 STAMP #5 ADDED! You unlocked 1 FREE Social Pass!");
    } else {
      setCheckInSuccessMsg(`✨ Stamp #${newCount} recorded! ${user.socialPunchGoal - newCount} more for a FREE social!`);
    }

    setTimeout(() => setCheckInSuccessMsg(null), 4000);
  };

  const refLink = user 
    ? `https://aiurbano.dance?ref=${user.referralCode}`
    : `https://aiurbano.dance?ref=dancefriend`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(refLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = `Hey! Join me at AI Urbano Bachata in Tampa with Albina & Isaac! Get your class pass or free open house here: ${refLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-[#0c0a0e] rounded-3xl border border-red-500/30 shadow-[0_25px_70px_rgba(225,29,72,0.25)] overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-red-950/90 via-black to-slate-950 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-lg shadow-red-600/30">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight font-sans">
                  MEMBER ACCOUNT PORTAL
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                  AI URBANO
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {user ? `Logged in as ${user.name}` : 'Log in to track tickets, social visits, referrals & cycle progress'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Selector Bar when Logged In */}
        {user && (
          <div className="px-4 py-3 bg-slate-950 border-b border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span>Jump To Section:</span>
            </label>

            {/* Dropdown Menu Selector */}
            <div className="relative flex-1">
              <select
                value={selectedView}
                onChange={(e) => setSelectedView(e.target.value as any)}
                className="w-full appearance-none px-4 py-2.5 pr-10 rounded-xl bg-gradient-to-r from-red-950/60 via-slate-900 to-slate-950 border border-red-500/40 text-xs font-extrabold text-white uppercase tracking-wide focus:outline-none focus:border-red-400 cursor-pointer shadow-md"
              >
                <option value="socials" className="bg-slate-950 text-white">
                  💃 Socials Tracker & 5-Punch Loyalty Pass ({user.socialsAttendedCount}/5 Attended)
                </option>
                <option value="tickets" className="bg-slate-950 text-white">
                  🎟️ My Tickets & Purchased Passes ({savedPasses.length} Saved)
                </option>
                <option value="referrals" className="bg-slate-950 text-white">
                  👥 Referral Rewards & Earned Credits ({user.referralCount} Friends)
                </option>
                <option value="cycles" className="bg-slate-950 text-white">
                  📅 Enrolled Wednesday Cycles & Schedule ({user.enrolledCycles.length} Enrolled)
                </option>
                <option value="achievements" className="bg-slate-950 text-white">
                  🏆 Member Badges & Dance Achievements ({user.achievements.length} Unlocked)
                </option>
                <option value="profile" className="bg-slate-950 text-white">
                  👤 Profile, Role & Preferences
                </option>
              </select>
              <ChevronDown className="w-4 h-4 text-red-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {!user ? (
            /* ================= LOGGED OUT STATE: LOGIN / SIGNUP ================= */
            <div className="max-w-md mx-auto py-4 space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono font-bold uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  <span>DANCER & MEMBER PORTAL</span>
                </div>
                <h4 className="text-2xl font-extrabold text-white">
                  {isSignUp ? 'Create Your Member Account' : 'Member Portal Login'}
                </h4>
                <p className="text-xs text-slate-400">
                  Track tickets bought, check social attendance stamps (5th social FREE!), invite friends, and view cycle schedules.
                </p>
              </div>

              {/* Login/Signup Toggle */}
              <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    !isSignUp ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    isSignUp ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  New Member Account
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {isSignUp && (
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Rivera"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="dance@example.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>

                {isSignUp && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                        Dance Role
                      </label>
                      <select
                        value={roleInput}
                        onChange={(e) => setRoleInput(e.target.value as any)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-red-500"
                      >
                        <option value="Lead">Lead</option>
                        <option value="Follow">Follow</option>
                        <option value="Both">Both / Switch</option>
                        <option value="Social Dancer / Enthusiast">Social Dancer</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                        Experience Level
                      </label>
                      <select
                        value={levelInput}
                        onChange={(e) => setLevelInput(e.target.value as any)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-red-500"
                      >
                        <option value="Beginner">Beginner (Level 1)</option>
                        <option value="Intermediate">Intermediate (Level 2)</option>
                        <option value="Advanced">Advanced (Level 3)</option>
                      </select>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  {isSignUp ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                  <span>{isSignUp ? 'Complete Member Setup' : 'Log In to Member Portal'}</span>
                </button>
              </form>

              {/* Demo Login Option */}
              <div className="pt-4 border-t border-white/10 text-center space-y-2">
                <p className="text-[11px] text-slate-400">Or test with a pre-configured sample profile:</p>
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Instant Login as Demo Member (Alex Rivera)</span>
                </button>
              </div>
            </div>
          ) : (
            /* ================= LOGGED IN STATE: MEMBER DASHBOARD ================= */
            <div className="space-y-6">
              
              {/* Member Quick Info Header */}
              <div className="bg-gradient-to-r from-red-950/60 via-slate-900 to-slate-950 p-4 rounded-2xl border border-red-500/30 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 via-rose-600 to-pink-600 p-0.5 shadow-lg shadow-red-600/30 shrink-0">
                    <div className="w-full h-full rounded-[14px] bg-black flex items-center justify-center text-lg font-black text-white">
                      {user.name.charAt(0)}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-black text-white">{user.name}</h4>
                      <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono font-bold text-[10px] uppercase">
                        {user.danceRole}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center w-full sm:w-auto">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenBooking('dropin-1');
                    }}
                    className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                    <span>Get New Pass</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors"
                    title="Log Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* SECTION 1: SOCIALS TRACKER & LOYALTY PUNCH CARD */}
              {selectedView === 'socials' && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-red-950/70 via-slate-950 to-purple-950/70 p-5 rounded-3xl border border-red-500/40 shadow-2xl space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30 uppercase">
                          LOYALTY REWARDS CARD
                        </span>
                        <h5 className="text-xl font-black text-white mt-1 uppercase tracking-tight">
                          Socials Attendance Punch Card
                        </h5>
                        <p className="text-xs text-slate-300">
                          Attend 5 Bachata Invasion or Locura Socials = Get 1 FREE Social Pass!
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-2xl font-black font-mono text-pink-400">
                          {user.socialsAttendedCount} / {user.socialPunchGoal}
                        </span>
                        <p className="text-[10px] text-slate-400">Socials Attended</p>
                      </div>
                    </div>

                    {/* Check-In Success Banner */}
                    {checkInSuccessMsg && (
                      <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold text-center animate-bounce">
                        {checkInSuccessMsg}
                      </div>
                    )}

                    {/* Visual 5 Punch Card Stamps */}
                    <div className="grid grid-cols-5 gap-2 sm:gap-3 py-2">
                      {[1, 2, 3, 4, 5].map((stampNum) => {
                        const isStamped = user.socialsAttendedCount >= stampNum;
                        const isRewardStamp = stampNum === 5;

                        return (
                          <div
                            key={stampNum}
                            className={`p-3 sm:p-4 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                              isStamped
                                ? isRewardStamp
                                  ? 'bg-gradient-to-br from-yellow-500/30 to-amber-600/40 border-yellow-400 text-yellow-300 shadow-lg shadow-yellow-500/20 scale-105'
                                  : 'bg-gradient-to-br from-red-600/30 to-pink-600/40 border-red-500 text-white shadow-md'
                                : 'bg-slate-900/60 border-slate-800 text-slate-600'
                            }`}
                          >
                            <div className="text-xs font-mono font-bold uppercase text-slate-400">
                              #{stampNum}
                            </div>

                            {isStamped ? (
                              <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md">
                                <CheckCircle2 className="w-5 h-5 text-white" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center text-xs font-bold text-slate-500">
                                {stampNum}
                              </div>
                            )}

                            <span className="text-[9px] font-bold uppercase tracking-tight">
                              {isRewardStamp ? 'FREE PASS' : isStamped ? 'PUNCHED' : 'STAMP'}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Interactive Action Controls */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
                      <div className="text-xs text-slate-300">
                        {user.socialsAttendedCount >= 5 ? (
                          <span className="text-yellow-300 font-extrabold flex items-center gap-1">
                            <Sparkles className="w-4 h-4 text-yellow-300" />
                            CONGRATS! You unlocked a 100% FREE Social Pass!
                          </span>
                        ) : (
                          <span>
                            Only <strong className="text-white">{5 - user.socialsAttendedCount} more social(s)</strong> until your free admission pass!
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={handlePunchCheckIn}
                          className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-pink-600/30 flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Flame className="w-4 h-4 text-pink-300" />
                          <span>Check In Today (+1 Stamp)</span>
                        </button>

                        {user.socialsAttendedCount >= 5 && (
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onOpenBooking('social-presale');
                            }}
                            className="px-4 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-yellow-500/30 flex items-center justify-center gap-1.5 transition-all"
                          >
                            <Gift className="w-4 h-4 text-black" />
                            <span>Claim Free Pass</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 2: MY TICKETS & BOUGHT PASSES */}
              {selectedView === 'tickets' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-base font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                        <Ticket className="w-4.5 h-4.5 text-red-400" />
                        <span>Purchased Tickets & Digital Entry Passes</span>
                      </h5>
                      <p className="text-xs text-slate-400">Total Passes Bought: {savedPasses.length}</p>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onOpenBooking('social-presale');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
                    >
                      <span>+ Buy New Pass</span>
                    </button>
                  </div>

                  {savedPasses.length === 0 ? (
                    <div className="text-center py-10 bg-slate-900/50 rounded-2xl border border-slate-800 p-6 space-y-3">
                      <Ticket className="w-10 h-10 text-slate-600 mx-auto" />
                      <p className="text-xs text-slate-300">No active passes saved on this device yet.</p>
                      <button
                        onClick={() => {
                          onClose();
                          onOpenBooking('dropin-1');
                        }}
                        className="px-4 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold"
                      >
                        Browse Class Passes
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {savedPasses.map((pass) => (
                        <div
                          key={pass.ticketId}
                          className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 hover:border-red-500/40 transition-all flex flex-col justify-between space-y-3"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                                {pass.status}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                ID: #{pass.ticketId.slice(0, 8)}
                              </span>
                            </div>

                            <h6 className="text-sm font-extrabold text-white">{pass.passName}</h6>
                            <p className="text-xs text-slate-300 font-medium">{pass.eventDate}</p>
                            <p className="text-[11px] text-slate-400">{pass.location}</p>
                          </div>

                          <button
                            onClick={() => setSelectedPassForQr(pass)}
                            className="w-full py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>Show Entry QR Code</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SECTION 3: REFERRAL REWARDS */}
              {selectedView === 'referrals' && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-black p-5 rounded-2xl border border-rose-500/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase">
                          REFERRAL DASHBOARD
                        </span>
                        <h5 className="text-lg font-black text-white mt-1">Your Personal Referral Link</h5>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-rose-400">{user.referralCount}</span>
                        <p className="text-[10px] text-slate-400">Friends Referred</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={refLink}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-rose-300 focus:outline-none truncate"
                      />
                      <button
                        onClick={handleCopyLink}
                        className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1 shrink-0"
                      >
                        {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                      </button>
                      <button
                        onClick={handleShareWhatsApp}
                        className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shrink-0"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </button>
                    </div>

                    {/* Rewards Tiers Progress */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                      <div className={`p-3 rounded-xl border text-xs ${user.referralCount >= 1 ? 'bg-red-950/60 border-red-500/50 text-white' : 'bg-slate-900/40 border-slate-800 text-slate-400'}`}>
                        <div className="font-bold">1 Referral</div>
                        <div className="text-[11px] text-slate-300 mt-0.5">Free Social / Drop-in</div>
                        {user.referralCount >= 1 && <span className="text-[10px] font-bold text-emerald-400">✓ Unlocked</span>}
                      </div>

                      <div className={`p-3 rounded-xl border text-xs ${user.referralCount >= 3 ? 'bg-rose-950/60 border-rose-500/50 text-white' : 'bg-slate-900/40 border-slate-800 text-slate-400'}`}>
                        <div className="font-bold">3 Referrals</div>
                        <div className="text-[11px] text-slate-300 mt-0.5">$20 OFF Cycle</div>
                        {user.referralCount >= 3 ? <span className="text-[10px] font-bold text-emerald-400">✓ Unlocked</span> : <span className="text-[10px] text-slate-500">Need {3 - user.referralCount} more</span>}
                      </div>

                      <div className={`p-3 rounded-xl border text-xs ${user.referralCount >= 5 ? 'bg-amber-950/60 border-amber-500/50 text-white' : 'bg-slate-900/40 border-slate-800 text-slate-400'}`}>
                        <div className="font-bold">5 Referrals</div>
                        <div className="text-[11px] text-slate-300 mt-0.5">FREE Private Lesson</div>
                        {user.referralCount >= 5 ? <span className="text-[10px] font-bold text-emerald-400">✓ Unlocked</span> : <span className="text-[10px] text-slate-500">Need {5 - user.referralCount} more</span>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 4: ENROLLED CYCLES */}
              {selectedView === 'cycles' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-red-400" />
                      <span>Enrolled Cycles & Wednesday Schedule</span>
                    </h5>
                    <span className="text-xs text-slate-400">Dance Factory Tampa</span>
                  </div>

                  {user.enrolledCycles.map((cycle) => (
                    <div
                      key={cycle.id}
                      className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 hover:border-red-500/40 transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                        <div>
                          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                            {cycle.status}
                          </span>
                          <h6 className="text-base font-extrabold text-white mt-1">
                            {cycle.title}
                          </h6>
                          <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <Clock className="w-3.5 h-3.5 text-red-400" />
                            <span>{cycle.schedule}</span>
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-mono font-bold text-red-400">
                            Week {cycle.currentWeek} of {cycle.totalWeeks}
                          </span>
                          <div className="w-28 h-2 rounded-full bg-slate-800 mt-1 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-red-600 to-rose-400"
                              style={{ width: `${(cycle.currentWeek / cycle.totalWeeks) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-red-400" />
                          <span>{cycle.location} ({STUDIO_INFO.mallName})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-rose-400" />
                          <span>Instructors: {cycle.instructors}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* SECTION 5: ACHIEVEMENTS & DANCE BADGES */}
              {selectedView === 'achievements' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-amber-400" />
                      <span>Unlocked Dance Badges ({user.achievements.length})</span>
                    </h5>
                    <span className="text-xs font-mono text-amber-400 font-bold">VIP Status</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {user.achievements.map((ach) => (
                      <div
                        key={ach.id}
                        className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 flex items-start gap-3"
                      >
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 text-2xl flex items-center justify-center shrink-0">
                          {ach.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h6 className="text-xs font-extrabold text-white">{ach.title}</h6>
                            {ach.date && <span className="text-[9px] font-mono text-amber-400">{ach.date}</span>}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{ach.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 6: PROFILE & PREFERENCES */}
              {selectedView === 'profile' && (
                <div className="space-y-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
                  <h5 className="text-sm font-bold text-white uppercase tracking-wider">
                    Member Account Details
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-1">Full Name</span>
                      <input
                        type="text"
                        readOnly
                        value={user.name}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium"
                      />
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-1">Email Address</span>
                      <input
                        type="text"
                        readOnly
                        value={user.email}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium"
                      />
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-1">Dance Role</span>
                      <input
                        type="text"
                        readOnly
                        value={user.danceRole}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-rose-300 font-bold"
                      />
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-1">Experience Level</span>
                      <input
                        type="text"
                        readOnly
                        value={`${user.level} Level`}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-300 font-bold"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex justify-end">
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 text-xs font-bold flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out of Account</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

      {/* QR Code Inspection Modal */}
      {selectedPassForQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-slate-950 p-6 rounded-3xl border border-red-500/40 max-w-sm w-full text-center space-y-4">
            <h4 className="text-base font-extrabold text-white">{selectedPassForQr.passName}</h4>
            <div className="w-48 h-48 bg-white p-3 rounded-2xl mx-auto flex items-center justify-center shadow-2xl">
              <QrCode className="w-40 h-40 text-black" />
            </div>
            <p className="text-xs text-slate-400">Show this QR code at Dance Factory check-in counter</p>
            <button
              onClick={() => setSelectedPassForQr(null)}
              className="w-full py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold"
            >
              Close QR Code
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
