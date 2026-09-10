import React, { useState, useEffect, useCallback } from 'react';
import { Search, RefreshCw, Users, UserCheck, LogOut, Mail, Phone, Ticket, Pencil, Check, X, Trash2, AlertTriangle } from 'lucide-react';

// Private staff page for tracking Tier members. Not linked anywhere in
// the public nav — reached directly at /?admin=members (see App.tsx).
// Same shared-password auth as AdminCheckIn.tsx — reuses the same
// localStorage key too, so staff already logged into check-in don't
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
  const [editingMemberId, setEditingMemberId] = useState<number | null>(null);
  const [editDateValue, setEditDateValue] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  // Delete-a-member flow (for clearing out test/duplicate accounts).
  const [deletingMember, setDeletingMember] = useState<Member | null>(null);
  const [alsoDeleteBookings, setAlsoDeleteBookings] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  const fetchMembers = useCallback(async (pwd: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin-members', {
        headers: { 'x-admin-password': pwd },
      });
      if (res.status === 401) {
        setAuthorized(false);
        setAuthError('Incorrect password.');
        localStorage.removeItem(PASSWORD_STORAGE_KEY);
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
    const saved = localStorage.getItem(PASSWORD_STORAGE_KEY);
    if (saved) {
      setPassword(saved);
      fetchMembers(saved);
    }
  }, [fetchMembers]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    localStorage.setItem(PASSWORD_STORAGE_KEY, password);
    fetchMembers(password);
  };

  const handleStartEdit = (m: Member) => {
    setEditingMemberId(m.id);
    // Pre-fill with the current expiration date in YYYY-MM-DD form for
    // the native date input.
    setEditDateValue(new Date(m.membership_expires_at).toISOString().slice(0, 10));
    setEditError(null);
  };

  const handleSaveEdit = async (memberId: number) => {
    if (!editDateValue) return;
    setIsSavingEdit(true);
    setEditError(null);
    try {
      // Set to end of that day (11:59 PM) so the member stays active
      // through the whole final day rather than expiring at midnight.
      const newExpiresAt = new Date(`${editDateValue}T23:59:59`).toISOString();
      const res = await fetch('/api/admin-members', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ memberId, newExpiresAt }),
      });
      const data = await res.json();
      if (!res.ok) {
        setEditError(data.error || 'Could not save.');
        setIsSavingEdit(false);
        return;
      }
      setEditingMemberId(null);
      fetchMembers(password);
    } catch {
      setEditError('Could not reach the server.');
      setIsSavingEdit(false);
    }
  };

  const openDeleteConfirm = (m: Member) => {
    setDeletingMember(m);
    setAlsoDeleteBookings(true);
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingMember) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch('/api/admin-members', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ memberId: deletingMember.id, deleteBookings: alsoDeleteBookings }),
      });
      const data = await res.json();
      if (!res.ok) {
        setDeleteError(data.error || 'Could not remove this member.');
        setIsDeleting(false);
        return;
      }
      const removedName = data?.deleted?.name || deletingMember.name;
      const bookingsDeleted = data?.bookingsDeleted ?? 0;
      setDeletingMember(null);
      setIsDeleting(false);
      setDeleteSuccess(
        `Removed ${removedName}` +
          (bookingsDeleted > 0 ? ` and ${bookingsDeleted} booking${bookingsDeleted === 1 ? '' : 's'}` : '') +
          '.'
      );
      fetchMembers(password);
      setTimeout(() => setDeleteSuccess(null), 6000);
    } catch {
      setDeleteError('Could not reach the server.');
      setIsDeleting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(PASSWORD_STORAGE_KEY);
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
              <a
                href="/checkin"
                className="px-2.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-[11px] font-bold uppercase tracking-wide flex items-center gap-1.5"
                title="Go to ticket check-in"
              >
                <Ticket className="w-3.5 h-3.5" />
                Check-In
              </a>
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
        {deleteSuccess && (
          <div className="bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-semibold rounded-xl px-3 py-2 text-center">
            {deleteSuccess}
          </div>
        )}
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
                  {editingMemberId === m.id ? (
                    <div className="flex flex-col items-end gap-1.5">
                      <input
                        type="date"
                        value={editDateValue}
                        onChange={(e) => setEditDateValue(e.target.value)}
                        className="px-2 py-1 rounded-lg bg-slate-950 border border-white/20 text-white text-xs"
                      />
                      {editError && <p className="text-[9px] text-red-400 max-w-[140px] text-right">{editError}</p>}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleSaveEdit(m.id)}
                          disabled={isSavingEdit}
                          className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50"
                          title="Save"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setEditingMemberId(null)}
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300"
                          title="Cancel"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="text-[9px] text-slate-500 uppercase tracking-wide">
                        {m.isActive ? 'Expires' : 'Expired'}
                      </div>
                      <button
                        onClick={() => handleStartEdit(m)}
                        className="group flex items-center gap-1 hover:opacity-80"
                        title="Manually correct this member's expiration date"
                      >
                        <span className={`text-xs font-bold ${m.isActive ? 'text-emerald-400' : 'text-red-400'}`}>
                          {expiresDate.toLocaleDateString()}
                        </span>
                        <Pencil className="w-2.5 h-2.5 text-slate-500 group-hover:text-slate-300" />
                      </button>
                      {m.isActive && (() => {
                        const daysRemaining = Math.max(0, Math.ceil((expiresDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
                        const weeksRemaining = Math.floor(daysRemaining / 7);
                        const extraDays = daysRemaining % 7;
                        let label;
                        if (daysRemaining === 0) label = 'Today';
                        else if (weeksRemaining === 0) label = `${daysRemaining}d left`;
                        else if (extraDays === 0) label = `${weeksRemaining}w left`;
                        else label = `${weeksRemaining}w ${extraDays}d left`;
                        return <div className="text-[9px] text-emerald-500/80">{label}</div>;
                      })()}
                    </>
                  )}
                </div>
                {editingMemberId !== m.id && (
                  <button
                    onClick={() => openDeleteConfirm(m)}
                    className="shrink-0 p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    title="Remove this member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Confirm-delete overlay */}
      {deletingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-red-500/30 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h2 className="text-base font-black uppercase tracking-wide">Remove member?</h2>
            </div>
            <div className="text-sm text-slate-300 space-y-3">
              <p>
                This permanently deletes the account for{' '}
                <span className="font-bold text-white">{deletingMember.name}</span>{' '}
                <span className="text-slate-400 break-all">({deletingMember.email})</span>.
              </p>
              <label className="flex items-start gap-2 cursor-pointer bg-white/5 rounded-xl p-3 border border-white/10">
                <input
                  type="checkbox"
                  checked={alsoDeleteBookings}
                  onChange={(e) => setAlsoDeleteBookings(e.target.checked)}
                  className="mt-0.5"
                />
                <span className="text-xs text-slate-300">
                  Also delete this person&apos;s ticket &amp; purchase history (recommended for test accounts).
                </span>
              </label>
              <p className="text-[11px] text-slate-500">
                This can&apos;t be undone. It does not refund any Stripe charges — refund those separately in Stripe if needed.
              </p>
            </div>
            {deleteError && <p className="text-xs text-red-400">{deleteError}</p>}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setDeletingMember(null);
                  setDeleteError(null);
                }}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-bold disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {isDeleting ? (
                  'Removing…'
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" /> Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
