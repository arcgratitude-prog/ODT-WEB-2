import React, { useState, useEffect, useCallback } from 'react';
import { Search, Check, X, RefreshCw, Users, DollarSign, LogOut } from 'lucide-react';

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
        sessionStorage.removeItem(PASSWORD_STORAGE_KEY);
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
    const saved = sessionStorage.getItem(PASSWORD_STORAGE_KEY);
    if (saved) {
      setPassword(saved);
      fetchBookings(saved);
    }
  }, [fetchBookings]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    sessionStorage.setItem(PASSWORD_STORAGE_KEY, password);
    fetchBookings(password);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(PASSWORD_STORAGE_KEY);
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

  const query = search.trim().toLowerCase();
  const filtered = query
    ? bookings.filter(
        (b) =>
          b.customer_name.toLowerCase().includes(query) ||
          b.customer_email.toLowerCase().includes(query) ||
          b.ticket_id.toLowerCase().includes(query)
      )
    : bookings;

  const checkedInCount = bookings.filter((b) => b.checked_in).length;
  const totalRevenueCents = bookings.reduce((sum, b) => sum + b.amount_cents, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-16">
      <div className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur border-b border-white/10 p-4">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-black uppercase">Check-In</h1>
            <div className="flex items-center gap-2">
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
            <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
              <div className="text-lg font-black">${(totalRevenueCents / 100).toFixed(0)}</div>
              <div className="text-[10px] text-slate-400 uppercase flex items-center justify-center gap-1">
                <DollarSign className="w-3 h-3" /> Revenue
              </div>
            </div>
          </div>

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
            {bookings.length === 0 ? 'No bookings yet.' : 'No matches.'}
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
                </div>
                <div className="text-xs text-slate-400 truncate">{b.pass_name} · ${(b.amount_cents / 100).toFixed(2)}</div>
                {b.classes_included && (
                  <div className="text-[11px] text-slate-500 truncate">{b.classes_included}</div>
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
