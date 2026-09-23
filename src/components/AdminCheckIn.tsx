import React, { useState, useEffect, useCallback } from 'react';
import { Search, Check, X, RefreshCw, Users, LogOut } from 'lucide-react';

// Private staff check-in page. Not linked anywhere in the public nav —
// reached directly at /?admin=checkin (see App.tsx). Protected by a shared
// password (set as ADMIN_PASSWORD in Vercel's environment variables); the
// password is sent with every request rather than using a login session,
// which keeps this simple for a small team sharing one door device.

interface Booking {
  id: number;
  ticket_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  pass_name: string;
  pass_type: string | null;
  amount_cents: number;
  classes_included: string | null;
  referred_by: string | null;
  ticket_number: number;
  ticket_count: number;
  checked_in: boolean;
  checked_in_at: string | null;
  created_at: string;
}

const PASSWORD_STORAGE_KEY = 'ai_urbano_admin_password';

export const AdminCheckIn: React.FC = () => {
  const [password, setPassword] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [passTypeFilter, setPassTypeFilter] = useState('all');
  // Defaults to showing only what's been purchased since the LAST
  // Wednesday class — without this, the list just keeps accumulating
  // every booking ever, and a drop-in class purchase (which recurs
  // every week with no date of its own attached) becomes impossible to
  // tell apart from one bought weeks ago that's already been used. See
  // the cutoff calculation below (anchored to the class cadence, not a
  // plain rolling week) for why that distinction matters. It naturally
  // "resets" itself every time the page loads — no manual action
  // needed — and staff can flip to "All Time" for older history.
  const [thisWeekOnly, setThisWeekOnly] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const fetchBookings = useCallback(async (pwd: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin-bookings', {
        headers: { 'x-admin-password': pwd },
      });
      if (res.status === 401) {
        setAuthorized(false);
        setAuthError('Incorrect password.');
        localStorage.removeItem(PASSWORD_STORAGE_KEY);
        return;
      }
      const data = await res.json();
      setBookings(data.bookings || []);
      setLastRefreshed(new Date());
      setAuthorized(true);
      setAuthError(null);
    } catch {
      setAuthError('Could not reach the server. Check your connection.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Try a password saved earlier this browser session, so staff don't have
  // to re-type it every time they refresh the page during an event.
  useEffect(() => {
    const saved = localStorage.getItem(PASSWORD_STORAGE_KEY);
    if (saved) {
      setPassword(saved);
      fetchBookings(saved);
    }
  }, [fetchBookings]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    localStorage.setItem(PASSWORD_STORAGE_KEY, password);
    fetchBookings(password);
  };

  const handleLogout = () => {
    localStorage.removeItem(PASSWORD_STORAGE_KEY);
    setAuthorized(false);
    setPassword('');
    setBookings([]);
  };

  const toggleCheckIn = async (booking: Booking) => {
    const nextState = !booking.checked_in;
    // Optimistic update — flip it immediately, then confirm with the server.
    setBookings((prev) =>
      prev.map((b) => (b.id === booking.id ? { ...b, checked_in: nextState } : b))
    );
    try {
      await fetch('/api/admin-bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify({ ticketId: booking.ticket_id, checkedIn: nextState }),
      });
    } catch {
      // Roll back on failure.
      setBookings((prev) =>
        prev.map((b) => (b.id === booking.id ? { ...b, checked_in: booking.checked_in } : b))
      );
    }
  };

  if (!authorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-3xl p-8 space-y-4"
        >
          <h1 className="text-xl font-black text-white uppercase text-center">Staff Check-In</h1>
          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/15 text-white text-sm focus:outline-none focus:border-red-500"
          />
          {authError && <p className="text-xs text-red-400 text-center">{authError}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Checking...' : 'Enter'}
          </button>
        </form>
      </div>
    );
  }

  // Groups every pass into one of a small, fixed set of categories for
  // the dropdown below — every individual Tier (1/2/3) and every
  // drop-in size all collapse into a single "Classes" bucket, rather
  // than the dropdown having a separate entry per Tier.
  const getPassCategory = (passName) => {
    if (/Locura/i.test(passName)) return 'Bachata Locura';
    if (/Boot Camp/i.test(passName)) return 'Bachata Battle Boot Camp';
    if (/Lab Night/i.test(passName)) return 'AI Urbano Lab Night';
    if (/Invasion/i.test(passName)) return 'Bachata Invasion';
    return 'Classes';
  };

  const passTypeFiltered = passTypeFilter === 'all'
    ? bookings
    : bookings.filter((b) => getPassCategory(b.pass_name) === passTypeFilter);

  // "This week" = since the day AFTER the LAST Wednesday class, through
  // right now — not a plain rolling 7 days. A plain rolling window has a
  // real bug: on a Wednesday (today), "the last 7 days" reaches exactly
  // back to LAST Wednesday too, which is the class that already
  // happened — so someone who bought same-day for last week's class
  // (already used, already attended) would still show up today. This
  // anchors to the actual class cadence instead: it always excludes the
  // most recent past class day itself, and only shows what's been
  // purchased since then — the purchases that are actually relevant to
  // the UPCOMING or CURRENT class, not the one that's already over.
  const WEDNESDAY = 3; // Date.getDay(): 0=Sun ... 3=Wed ... 6=Sat
  const today = new Date();
  let daysSinceLastWednesday = (today.getDay() - WEDNESDAY + 7) % 7;
  if (daysSinceLastWednesday === 0) daysSinceLastWednesday = 7; // if today IS Wednesday, "last" class was a full week ago, not today
  const lastClassDay = new Date(today);
  lastClassDay.setDate(today.getDate() - daysSinceLastWednesday);
  lastClassDay.setHours(0, 0, 0, 0);
  const cutoff = new Date(lastClassDay);
  cutoff.setDate(lastClassDay.getDate() + 1); // start of the day AFTER the last class

  const dateFiltered = thisWeekOnly
    ? passTypeFiltered.filter((b) => new Date(b.created_at) >= cutoff)
    : passTypeFiltered;

  const query = search.trim().toLowerCase();
  const filtered = query
    ? dateFiltered.filter(
        (b) =>
          b.customer_name.toLowerCase().includes(query) ||
          b.customer_email.toLowerCase().includes(query) ||
          b.ticket_id.toLowerCase().includes(query)
      )
    : dateFiltered;

  // Stats reflect the SAME "this week" scope as the list below, so
  // "Booked: 12" means 12 this week (the number that's actually useful
  // at the door), not a growing all-time count buried under months of
  // history. Search/pass-type don't affect these, matching how they
  // already didn't before this change — only the week toggle does.
  const statsBase = thisWeekOnly ? bookings.filter((b) => new Date(b.created_at) >= cutoff) : bookings;
  const checkedInCount = statsBase.filter((b) => b.checked_in).length;
  const boughtTodayCount = statsBase.filter(
    (b) => /^Tier \d+:/.test(b.pass_name) && new Date(b.created_at).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-16">
      <div className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur border-b border-white/10 p-4">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-black uppercase">Check-In</h1>
            <div className="flex items-center gap-2">
              <a
                href="/members"
                className="px-2.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-[11px] font-bold uppercase tracking-wide flex items-center gap-1.5"
                title="Check if someone is an active Tier member (e.g. for free Lab Night entry)"
              >
                <Users className="w-3.5 h-3.5" />
                Members
              </a>
              <button
                onClick={() => fetchBookings(password)}
                disabled={isLoading}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-[10px] text-teal-400/80 -mt-1">
            Lab Night is free for active Tier members — no ticket needed. Tap "Members" to verify at the door.
          </p>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
              <div className="text-lg font-black">{bookings.length}</div>
              <div className="text-[10px] text-slate-400 uppercase flex items-center justify-center gap-1">
                <Users className="w-3 h-3" /> Booked
              </div>
            </div>
            <div className="bg-emerald-500/10 rounded-xl p-2.5 border border-emerald-500/30">
              <div className="text-lg font-black text-emerald-400">{checkedInCount}</div>
              <div className="text-[10px] text-slate-400 uppercase flex items-center justify-center gap-1">
                <Check className="w-3 h-3" /> Checked In
              </div>
            </div>
            <div className="bg-amber-500/10 rounded-xl p-2.5 border border-amber-500/30">
              <div className="text-lg font-black text-amber-400">{boughtTodayCount}</div>
              <div className="text-[10px] text-slate-400 uppercase flex items-center justify-center gap-1 leading-tight">
                Bought Today
              </div>
            </div>
          </div>

          {boughtTodayCount > 0 && (
            <p className="text-[10px] text-amber-400/80 text-center -mt-1">
              "Bought Today" = a Tier purchased same-day — their membership is already active, so let them into tonight's class if it's a Wednesday.
            </p>
          )}

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search name, email, or ticket ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="flex gap-1 p-1 bg-white/5 rounded-xl border border-white/10">
            <button
              onClick={() => setThisWeekOnly(true)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors ${
                thisWeekOnly ? 'bg-white text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setThisWeekOnly(false)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors ${
                !thisWeekOnly ? 'bg-white text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Time
            </button>
          </div>

          <select
            value={passTypeFilter}
            onChange={(e) => setPassTypeFilter(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-bold uppercase tracking-wide focus:outline-none focus:border-red-500"
          >
            <option value="all" className="bg-slate-950 text-white">All Socials & Classes</option>
            <option value="Bachata Invasion" className="bg-slate-950 text-white">Bachata Invasion</option>
            <option value="Bachata Locura" className="bg-slate-950 text-white">Bachata Locura</option>
            <option value="Bachata Battle Boot Camp" className="bg-slate-950 text-white">Bachata Battle Boot Camp</option>
            <option value="AI Urbano Lab Night" className="bg-slate-950 text-white">AI Urbano Lab Night</option>
            <option value="Classes" className="bg-slate-950 text-white">Classes (Tiers & Drop-Ins)</option>
          </select>

          {lastRefreshed && (
            <p className="text-[10px] text-slate-500 text-center">
              Last updated {lastRefreshed.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 space-y-2">
        {filtered.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-12">
            {bookings.length === 0
              ? 'No bookings yet.'
              : thisWeekOnly && dateFiltered.length === 0
              ? 'Nothing since the last class — try "All Time" to see older bookings.'
              : 'No matches.'}
          </p>
        ) : (
          filtered.map((b) => (
            <div
              key={b.id}
              className={`rounded-2xl p-4 border flex items-center justify-between gap-3 transition-colors ${
                b.checked_in
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="min-w-0">
                <div className="font-bold text-sm truncate flex items-center gap-2">
                  {b.customer_name}
                  {b.ticket_count > 1 && (
                    <span className="shrink-0 px-1.5 py-0.5 rounded bg-fuchsia-500/20 border border-fuchsia-500/40 text-fuchsia-300 text-[9px] font-bold uppercase tracking-wide">
                      Ticket {b.ticket_number} of {b.ticket_count}
                    </span>
                  )}
                  {/^Tier \d+:/.test(b.pass_name) && new Date(b.created_at).toDateString() === new Date().toDateString() && (
                    <span className="shrink-0 px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[9px] font-bold uppercase tracking-wide">
                      Bought Today
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400 truncate">{b.pass_name} · ${(b.amount_cents / 100).toFixed(2)}</div>
                <div className="text-[10px] text-slate-500">
                  Purchased {new Date(b.created_at).toLocaleDateString()}
                </div>
                {b.classes_included && (
                  <div className="text-[11px] text-slate-500 truncate">{b.classes_included}</div>
                )}
                {b.referred_by && (
                  <div className="text-[11px] text-emerald-500 truncate">Referred by: {b.referred_by}</div>
                )}
              </div>
              <button
                onClick={() => toggleCheckIn(b)}
                className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 transition-colors ${
                  b.checked_in
                    ? 'bg-emerald-500 text-black hover:bg-emerald-400'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {b.checked_in ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                {b.checked_in ? 'Checked In' : 'Check In'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
