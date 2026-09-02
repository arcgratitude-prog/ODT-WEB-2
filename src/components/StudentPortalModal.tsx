import React, { useState, useEffect } from 'react';
import { 
  User, X, LogIn, UserPlus, Calendar, Award, Gift, Ticket, QrCode, CheckCircle2, 
  Sparkles, Flame, Users, Clock, MapPin, Share2, Copy, Check, MessageCircle, LogOut, 
  ChevronRight, Shield, BookOpen, Star, ArrowRight, Activity, ChevronDown, Trophy, CreditCard
} from 'lucide-react';
import { MemberUser, TicketPass } from '../types';
import { STUDIO_INFO, PASS_OPTIONS } from '../data/danceData';

interface StudentPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedPasses: TicketPass[];
  onOpenBooking: (passTypeId?: string, quantity?: number) => void;
}

const DEFAULT_DEMO_MEMBER: MemberUser = {
  id: 'member-7892',
  name: 'Alex Rivera',
  email: 'alex.rivera@dance.com',
  phone: '(813) 555-0192',
  danceRole: 'Lead',
  level: 'Intermediate',
  joinedDate: 'June 2026',
  referralCode: '',
  referralCount: 0,
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
  enrolledCycles: []
};

export const StudentPortalModal: React.FC<StudentPortalModalProps> = ({
  isOpen,
  onClose,
  savedPasses,
  onOpenBooking
}) => {
  const [user, setUser] = useState<MemberUser | null>(null);
  const [selectedView, setSelectedView] = useState<
    'tickets' | 'referrals' | 'cycles' | 'profile'
  >('tickets');
  
  // Login / Signup Form State
  const [isSignUp, setIsSignUp] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState<string | null>(null);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [realTickets, setRealTickets] = useState<Array<{
    ticketId: string; passName: string; amountCents: number;
    classesIncluded: string | null; ticketNumber: number; ticketCount: number;
    checkedIn: boolean; createdAt: string;
  }> | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedPassForQr, setSelectedPassForQr] = useState<TicketPass | null>(null);
  
  // Simulated punch card check-in state

  // Load user from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('ai_urbano_member_user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        if (parsed?.email && parsed?.sessionToken) {
          fetchRealTickets(parsed.email, parsed.sessionToken);
        }
      }
    } catch (e) {
      console.error('Failed to load member user:', e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isOpen) return null;

  const fetchRealTickets = async (email: string, sessionToken: string) => {
    try {
      const res = await fetch('/api/member-tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, sessionToken }),
      });
      if (!res.ok) return; // Silently skip — local savedPasses still shows as a fallback.
      const data = await res.json();
      setRealTickets(data.tickets || []);
    } catch {
      // Network hiccup — not worth blocking the whole portal over.
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotPasswordEmail.trim()) return;
    setIsSendingReset(true);
    setForgotPasswordMessage(null);
    try {
      const res = await fetch('/api/member-forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotPasswordEmail.trim() }),
      });
      const data = await res.json();
      // Deliberately the same message whether or not the email exists —
      // matches the backend's own privacy-preserving behavior.
      setForgotPasswordMessage(data.message || "If that email has an account, we've sent a password reset link to it.");
    } catch {
      setForgotPasswordMessage('Could not reach the server. Please try again.');
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !passwordInput.trim()) return;
    if (isSignUp && !nameInput.trim()) return;
    setLoginError(null);

    if (isSignUp) {
      if (passwordInput.length < 6) {
        setLoginError('Password must be at least 6 characters.');
        return;
      }
      if (passwordInput !== confirmPasswordInput) {
        setLoginError('Passwords do not match.');
        return;
      }
    }

    setIsLoggingIn(true);

    try {
      // Signing up creates a free account (no purchase required, no
      // benefits until a real Tier purchase); logging in verifies an
      // existing one. Both endpoints return the same response shape.
      const endpoint = isSignUp ? '/api/member-signup' : '/api/member-login';
      // If they arrived via someone's referral link, App.tsx already
      // captured it into localStorage — send it along so the backend can
      // record the real relationship at the moment the account is
      // actually created. Only relevant for signup; logging into an
      // existing account can't retroactively add a referrer.
      const pendingReferralCode = isSignUp ? localStorage.getItem('ai_urbano_pending_referral_code') : null;
      const body = isSignUp
        ? { name: nameInput.trim(), email: emailInput.trim(), password: passwordInput, referralCode: pendingReferralCode || undefined }
        : { email: emailInput.trim(), password: passwordInput };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || 'Could not complete that. Please try again.');
        setIsLoggingIn(false);
        return;
      }

      // Once a signup successfully uses a pending referral code, clear
      // it — it's been consumed (recorded permanently in the database as
      // referred_by_member_id), so it shouldn't be replayed onto a
      // second, unrelated signup later in the same browser.
      if (isSignUp) {
        localStorage.removeItem('ai_urbano_pending_referral_code');
      }

      // Real account data (name/email/membership status/referral code/
      // referral count) — all of this now comes directly from the
      // server, which is the actual source of truth. referralCode is a
      // real, unique, database-stored value generated server-side (see
      // api/lib/referral.js), never derived from the name client-side —
      // that would collide for two people who happen to share a name.
      // referralCount is computed live from real rows in the database
      // (how many accounts have this account as their referrer), not a
      // hardcoded or locally-tracked number.
      const loggedInUser: MemberUser = {
        ...DEFAULT_DEMO_MEMBER,
        id: String(data.id),
        name: data.name,
        email: data.email,
        phone: data.phone || DEFAULT_DEMO_MEMBER.phone,
        isActive: data.isActive,
        membershipExpiresAt: data.membershipExpiresAt,
        lastPassName: data.lastPassName,
        sessionToken: data.sessionToken,
        referralCode: data.referralCode || '',
        referralCount: data.referralCount ?? 0,
      };
      setUser(loggedInUser);
      localStorage.setItem('ai_urbano_member_user', JSON.stringify(loggedInUser));

      // Real purchase history from the database — not just whatever
      // happens to be saved in this one browser's local storage, which
      // breaks the moment someone logs in on a different device.
      if (data.email && data.sessionToken) {
        fetchRealTickets(data.email, data.sessionToken);
      }
    } catch {
      setLoginError('Could not reach the server. Check your connection and try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setRealTickets(null);
    localStorage.removeItem('ai_urbano_member_user');
    // Clear the form entirely — otherwise the next person to use this
    // device (e.g. a shared computer at the studio front desk) would see
    // the previous person's name and email still sitting in the fields.
    setIsSignUp(false);
    setNameInput('');
    setEmailInput('');
    setPasswordInput('');
    setConfirmPasswordInput('');
    setLoginError(null);
  };

  const refLink = user?.referralCode
    ? `https://officialdancetheory.com?ref=${user.referralCode}`
    : '';

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

        {/* Real membership status — only shows once we actually have it
            from the backend (isActive is undefined for older/demo user
            objects that predate this). This is the actual, computed
            "is your Tier membership active right now" status. */}
        {user && user.isActive !== undefined && (
          <div className={`px-4 py-2.5 flex items-center justify-between gap-3 border-b border-white/10 ${
            user.isActive ? 'bg-emerald-500/10' : 'bg-red-500/10'
          }`}>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-emerald-400' : 'bg-red-400'}`} />
              <span className={`text-xs font-bold uppercase tracking-wide ${user.isActive ? 'text-emerald-300' : 'text-red-300'}`}>
                {user.isActive ? 'Active Member' : 'Membership Expired'}
              </span>
            </div>
            {user.membershipExpiresAt && (
              <span className="text-[11px] text-slate-400">
                {user.isActive ? 'Renews/expires ' : 'Expired '}
                {new Date(user.membershipExpiresAt).toLocaleDateString()}
              </span>
            )}
          </div>
        )}

        {/* Real Tier benefits — pulled from the actual PASS_OPTIONS data
            (the same features list shown on the pricing page), matched to
            whichever Tier they last purchased. Only shown for active
            members — an expired membership doesn't get the perks. */}
        {user && user.isActive && user.lastPassName && (() => {
          const matchedPass = PASS_OPTIONS.find((p) => p.name === user.lastPassName);
          if (!matchedPass) return null;
          return (
            <div className="px-4 py-3 bg-slate-900/60 border-b border-white/10">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Your {matchedPass.name} Benefits
              </p>
              <ul className="space-y-1">
                {matchedPass.features.map((feature, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })()}

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
                <option value="tickets" className="bg-slate-950 text-white">
                  🎟️ My Tickets & Purchased Passes ({savedPasses.length} Saved)
                </option>
                <option value="referrals" className="bg-slate-950 text-white">
                  👥 Referral Rewards & Earned Credits ({user.referralCount} Friends)
                </option>
                <option value="cycles" className="bg-slate-950 text-white">
                  🎁 Tier Benefits & Perks
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
                  Member Portal Login
                </h4>
                <p className="text-xs text-slate-400">
                  Check your Tier membership status and track tickets bought.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                <p className="text-[11px] text-slate-400">
                  Anyone can create a free account. <span className="text-white font-bold">Buying a Tier pass</span> unlocks active-member perks like discounted socials.
                </p>
              </div>

              {showForgotPassword ? (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="dance@example.com"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  {forgotPasswordMessage && (
                    <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                      <p className="text-[11px] text-emerald-300">{forgotPasswordMessage}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSendingReset}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all disabled:opacity-60"
                  >
                    {isSendingReset ? 'Sending...' : 'Send Reset Link'}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setShowForgotPassword(false); setForgotPasswordMessage(null); }}
                    className="w-full text-center text-xs text-slate-400 hover:text-white"
                  >
                    ← Back to Log In
                  </button>
                </form>
              ) : (
                <>
              {/* Login/Signup Toggle */}
              <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800">
                <button
                  type="button"
                  onClick={() => { setIsSignUp(false); setLoginError(null); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    !isSignUp ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => { setIsSignUp(true); setLoginError(null); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    isSignUp ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Create Free Account
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
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Re-enter password"
                      value={confirmPasswordInput}
                      onChange={(e) => setConfirmPasswordInput(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500"
                    />
                  </div>
                )}


                {loginError && (
                  <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30">
                    <p className="text-[11px] text-red-300">{loginError}</p>
                  </div>
                )}

                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => { setShowForgotPassword(true); setLoginError(null); }}
                    className="text-xs text-slate-400 hover:text-white underline underline-offset-2"
                  >
                    Forgot Password?
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSignUp ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                  <span>{isLoggingIn ? 'Logging In...' : isSignUp ? 'Complete Member Setup' : 'Log In to Member Portal'}</span>
                </button>
              </form>
              </>
              )}
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
                    <h4 className="text-base font-black text-white">{user.name}</h4>
                    <p className="text-xs text-slate-300 font-medium">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center w-full sm:w-auto">
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors"
                    title="Log Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>

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

                  {/* Real purchase history from your account — this is
                      what actually persists across devices, unlike the
                      "saved on this device" section below which only
                      knows about tickets bought in this exact browser. */}
                  {realTickets !== null && (
                    <div className="space-y-2">
                      <h6 className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                        Your Account Purchase History
                      </h6>
                      {realTickets.length === 0 ? (
                        <p className="text-xs text-slate-500 italic">No purchases found yet for this account's email.</p>
                      ) : (
                        <div className="space-y-2">
                          {realTickets.map((t) => (
                            <div
                              key={t.ticketId}
                              className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3"
                            >
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-white truncate">{t.passName}</p>
                                <p className="text-[10px] text-slate-500">
                                  {new Date(t.createdAt).toLocaleDateString()} · #{t.ticketId.slice(0, 8)}
                                  {t.ticketCount > 1 ? ` · Ticket ${t.ticketNumber} of ${t.ticketCount}` : ''}
                                </p>
                              </div>
                              <div className="shrink-0 flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-300">${(t.amountCents / 100).toFixed(2)}</span>
                                {t.checkedIn && (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                    Checked In
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <h6 className="text-xs font-bold text-slate-400 uppercase tracking-wide pt-2">
                    Passes Saved On This Device
                  </h6>

                  {savedPasses.length === 0 ? (
                    <div className="text-center py-10 bg-slate-900/50 rounded-2xl border border-slate-800 p-6 space-y-3">
                      <Ticket className="w-10 h-10 text-slate-600 mx-auto" />
                      <p className="text-xs text-slate-300">No active passes saved on this device yet.</p>
                      <button
                        onClick={onClose}
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
                        <p className="text-[10px] text-slate-400 mt-1 max-w-xs">
                          Share your link with friends. When they create an account through it, we automatically know you referred them — no need to tell them to type your name anywhere.
                        </p>
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
                      <Gift className="w-4 h-4 text-red-400" />
                      <span>Tier Benefits</span>
                    </h5>
                    {user.lastPassName && (
                      <span className="text-xs text-slate-400">{user.lastPassName}</span>
                    )}
                  </div>

                  {user.isActive === false && (
                    <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30">
                      <p className="text-[11px] text-red-300">
                        Your membership has expired — these perks aren't active right now. Buy a new Tier pass to renew.
                      </p>
                    </div>
                  )}

                  <div
                    className={`p-4 sm:p-5 rounded-2xl border space-y-3 ${
                      user.isActive
                        ? 'bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-emerald-500/30'
                        : 'bg-slate-900/40 border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className={`w-4 h-4 ${user.isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                      <span className="text-sm font-bold text-white">20% off ODT socials</span>
                    </div>
                    <p className="text-xs text-slate-400 pl-6">
                      Applies at checkout for Bachata Invasion and Bachata Locura — log in with this account to redeem. Limited to one discounted ticket per order.
                    </p>
                  </div>

                  <div
                    className={`p-4 sm:p-5 rounded-2xl border space-y-3 ${
                      user.isActive
                        ? 'bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-emerald-500/30'
                        : 'bg-slate-900/40 border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className={`w-4 h-4 ${user.isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                      <span className="text-sm font-bold text-white">10% off private lessons</span>
                    </div>
                    <p className="text-xs text-slate-400 pl-6">
                      Mention your member account when booking a private lesson with Albina & Isaac.
                    </p>
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
