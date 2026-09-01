import React, { useState, useEffect, useCallback } from 'react';
import { Search, RefreshCw, Users, UserCheck, LogOut, Mail, Phone } from 'lucide-react';

// Private staff page for tracking Tier members. Not linked anywhere in
// the public nav — reached directly at /?admin=members (see App.tsx).
// Same shared-password auth as AdminCheckIn.tsx — reuses the same
// sessionStorage key too, so staff already logged into check-in don't
// have to log in again here.

interface Member {
  id: number;
  email: string;
  name: string;
  phone: string | null;
  last_pass_name: string | null;
  last_ticket_id: string | null;
  membership_expires_at: string;
  created_at: string;
  isActive: boolean;
}

const PASSWORD_STORAGE_KEY = 'ai_urbano_admin_password';

export const AdminMembers: React.FC = () => {
  const [password, setPassword] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const fetchMembers = useCallback(async (pwd: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin-members', {
        headers: { 'x-admin-password': pwd },
      });
      if (res.status === 401) {
        setAuthorized(false);
        setAuthError('Incorrect password.');
        sessionStorage.removeItem(PASSWORD_STORAGE_KEY);
        return;
      }
      const data = await res.json();
      setMembers(data.members || []);
      setLastRefreshed(new Date());
      setAuthorized(true);
      setAuthError(null);
    } catch {
      setAuthError('Could not reach the server. Check your connection.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem(PASSWORD_STORAGE_KEY);
    if (saved) {
      setPassword(saved);
      fetchMembers(saved);
    }
  }, [fetchMembers]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    sessionStorage.setItem(PASSWORD_STORAGE_KEY, password);
    fetchMembers(password);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(PASSWORD_STORAGE_KEY);
    setAuthorized(false);
    setPassword('');
    setMembers([]);
  };

  if (!authorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-3xl p-8 space-y-4"
        >
          <h1 className="text-xl font-black text-white uppercase text-center">Members</h1>
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
  const visibleMembers = showActiveOnly ? members.filter((m) => m.isActive) : members;
  const filtered = query
    ? visibleMembers.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.email.toLowerCase().includes(query)
      )
    : visibleMembers;

  const activeCount = members.filter((m) => m.isActive).length;

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-16">
      <div className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur border-b border-white/10 p-4">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-black uppercase">Members</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchMembers(password)}
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

          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
              <div className="text-lg font-black">{members.length}</div>
              <div className="text-[10px] text-slate-400 uppercase flex items-center justify-center gap-1">
                <Users className="w-3 h-3" /> Total Members
              </div>
            </div>
            <div className="bg-emerald-500/10 rounded-xl p-2.5 border border-emerald-500/30">
              <div className="text-lg font-black text-emerald-400">{activeCount}</div>
              <div className="text-[10px] text-slate-400 uppercase flex items-center justify-center gap-1">
                <UserCheck className="w-3 h-3" /> Active Now
              </div>
            </div>
          </div>

          {/* Active Only / All toggle — this is the "one section shows
              everyone, one shows only who's currently active" the studio
              asked for. */}
          <div className="flex rounded-xl bg-white/5 border border-white/10 p-1">
            <button
              onClick={() => setShowActiveOnly(true)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors ${
                showActiveOnly ? 'bg-emerald-500 text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              Active Only
            </button>
            <button
              onClick={() => setShowActiveOnly(false)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors ${
                !showActiveOnly ? 'bg-white text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Members
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search name or email..."
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
            {members.length === 0
              ? 'No members yet — they get created automatically the first time someone buys a Tier pass.'
              : 'No matches.'}
          </p>
        ) : (
          filtered.map((m) => {
            const expiresDate = new Date(m.membership_expires_at);
            return (
              <div
                key={m.id}
                className={`rounded-2xl p-4 border flex items-center justify-between gap-3 transition-colors ${
                  m.isActive ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/10 opacity-70'
                }`}
              >
                <div className="min-w-0">
                  <div className="font-bold text-sm truncate flex items-center gap-2">
                    {m.name}
                    <span
                      className={`shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide ${
                        m.isActive
                          ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                          : 'bg-red-500/20 border border-red-500/40 text-red-300'
                      }`}
                    >
                      {m.isActive ? 'Active' : 'Expired'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 truncate flex items-center gap-1">
                    <Mail className="w-3 h-3 shrink-0" /> {m.email}
                  </div>
                  {m.phone && (
                    <div className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                      <Phone className="w-3 h-3 shrink-0" /> {m.phone}
                    </div>
                  )}
                  {m.last_pass_name && (
                    <div className="text-[11px] text-slate-500 truncate">{m.last_pass_name}</div>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-[9px] text-slate-500 uppercase tracking-wide">
                    {m.isActive ? 'Expires' : 'Expired'}
                  </div>
                  <div className={`text-xs font-bold ${m.isActive ? 'text-emerald-400' : 'text-red-400'}`}>
                    {expiresDate.toLocaleDateString()}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
