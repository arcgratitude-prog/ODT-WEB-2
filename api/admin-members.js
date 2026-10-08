// Admin-only endpoint: lists all Tier members (regardless of active
// status — filtering active-only happens client-side so staff can toggle
// between "everyone who ever had a membership" and "who's active right
// now" without extra requests). Also handles manual corrections to a
// member's expiration date (PATCH) — kept in this same file rather than
// a new one, since Vercel's plan caps the number of serverless
// functions and this is the same underlying resource anyway.
// Same shared-password protection as admin-bookings.js.

import { ensureMembersTable, ensureBookingsTable, sql } from './_lib/db.js';
import { isAdminAuthorized } from './_lib/auth.js';

export default async function handler(req, res) {
  if (!isAdminAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await ensureMembersTable();
  await ensureBookingsTable();

  if (req.method === 'PATCH') {
    // Three independent manual corrections live on this one endpoint:
    //   - newExpiresAt: fixing a member's expiration date for a real
    //     edge case (e.g. someone bought right after that day's class
    //     already happened, so their real 4-week window should be
    //     counted differently than a pure "purchase timestamp + 28
    //     days" would give them; or a comp member activated by hand).
    //   - isTestAccount: flagging/unflagging an account as a test
    //     account, so it can be told apart from real members in the
    //     list and excluded from the real member counts — without
    //     changing how the account actually behaves anywhere else.
    //   - staffNote: a short freeform note shown as "*note" on the
    //     member's card — e.g. which classes a manually-activated comp
    //     member is actually attending, since there's no real booking
    //     (and therefore no classes_included) behind their membership.
    // Any combination can be sent together; at least one is required.
    const { memberId, newExpiresAt, isTestAccount, staffNote } = req.body || {};
    if (!memberId) {
      return res.status(400).json({ error: 'memberId is required.' });
    }
    if (newExpiresAt === undefined && isTestAccount === undefined && staffNote === undefined) {
      return res.status(400).json({ error: 'Nothing to update — provide newExpiresAt, isTestAccount, and/or staffNote.' });
    }

    const existingRows = await sql`SELECT membership_expires_at, is_test_account, staff_note FROM members WHERE id = ${memberId};`;
    if (existingRows.length === 0) {
      return res.status(404).json({ error: 'No member found with that id.' });
    }
    const existing = existingRows[0];

    let newExpiresAtIso = existing.membership_expires_at;
    if (newExpiresAt !== undefined) {
      const parsedDate = new Date(newExpiresAt);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: 'newExpiresAt is not a valid date.' });
      }
      newExpiresAtIso = parsedDate.toISOString();
    }
    const newIsTestAccount = isTestAccount !== undefined ? !!isTestAccount : existing.is_test_account;
    // Empty string clears the note back to NULL rather than saving "".
    const newStaffNote = staffNote !== undefined ? (staffNote.trim() === '' ? null : staffNote.trim()) : existing.staff_note;

    const updated = await sql`
      UPDATE members
      SET membership_expires_at = ${newExpiresAtIso}, is_test_account = ${newIsTestAccount}, staff_note = ${newStaffNote}, updated_at = NOW()
      WHERE id = ${memberId}
      RETURNING id, name, email, membership_expires_at, is_test_account, staff_note;
    `;

    return res.status(200).json({ success: true, member: updated[0] });
  }

  if (req.method === 'DELETE') {
    // Permanently remove a member account — built for clearing out test
    // accounts (and any genuine duplicate/mistake) without ever touching
    // the database by hand. Scoped strictly to the one member id given,
    // plus that member's own bookings (matched by their unique email), so
    // it can never affect anyone else's account or purchases.
    const { memberId } = req.body || {};
    // Whether to also delete this person's bookings/purchase history.
    // Defaults to true (what you want for a test account); pass
    // deleteBookings:false to keep the purchase records and only remove
    // the login account.
    const alsoDeleteBookings = !(req.body && req.body.deleteBookings === false);

    if (!memberId) {
      return res.status(400).json({ error: 'memberId is required.' });
    }

    const found = await sql`SELECT id, email, name FROM members WHERE id = ${memberId} LIMIT 1;`;
    if (found.length === 0) {
      return res.status(404).json({ error: 'No member found with that id.' });
    }
    const member = found[0];
    const email = (member.email || '').toLowerCase();

    // Ordered cleanup so no foreign key can block the delete, all wrapped
    // in a single transaction that either fully succeeds or fully rolls
    // back (never a half-deleted account):
    //   1. Detach anyone this member referred. Their account is kept —
    //      only the referral link pointing back at this member is cleared
    //      — otherwise the members.referred_by_member_id -> members(id)
    //      foreign key would reject the delete.
    //   2. Delete this member's password-reset tokens (the
    //      password_resets.member_id -> members(id) foreign key).
    //   3. Optionally delete this member's bookings. Bookings have no
    //      foreign key to members, so this is matched purely on the
    //      member's own unique email and touches nothing else.
    //   4. Delete the member row itself.
    const statements = [
      sql`UPDATE members SET referred_by_member_id = NULL WHERE referred_by_member_id = ${memberId} RETURNING id`,
      sql`DELETE FROM password_resets WHERE member_id = ${memberId} RETURNING id`,
    ];
    const bookingsStatementIndex = alsoDeleteBookings ? statements.length : -1;
    if (alsoDeleteBookings) {
      statements.push(sql`DELETE FROM bookings WHERE LOWER(customer_email) = ${email} RETURNING id`);
    }
    statements.push(sql`DELETE FROM members WHERE id = ${memberId} RETURNING id`);

    const results = await sql.transaction(statements);
    const detachedReferrals = results[0].length;
    const bookingsDeleted = bookingsStatementIndex >= 0 ? results[bookingsStatementIndex].length : 0;

    return res.status(200).json({
      success: true,
      deleted: { id: member.id, name: member.name, email: member.email },
      detachedReferrals,
      bookingsDeleted,
    });
  }

  if (req.method === 'POST') {
    // Merges two member accounts into one — for exactly the "same
    // person checked out with two different emails" situation: rather
    // than them having two disconnected records (say, one correctly
    // expired and one freshly active from today's purchase), this folds
    // everything onto whichever account you choose to KEEP and
    // permanently removes the other. Whichever of the two has the LATER
    // expiration date wins (so the merge never shortens anyone's real
    // paid time), all of the removed account's bookings get re-attached
    // under the kept account's email (so purchase history and check-in
    // both show under one identity from now on — this is also what
    // stops the "same person, two rows" display problem at check-in),
    // and any referral relationship that pointed at the removed account
    // gets repointed at the kept one instead of silently breaking.
    const { keepMemberId, mergeMemberId } = req.body || {};
    if (!keepMemberId || !mergeMemberId) {
      return res.status(400).json({ error: 'keepMemberId and mergeMemberId are required.' });
    }
    if (keepMemberId === mergeMemberId) {
      return res.status(400).json({ error: 'Pick two different accounts to merge.' });
    }

    const rows = await sql`
      SELECT id, email, name, phone, last_pass_name, last_ticket_id, membership_expires_at
      FROM members WHERE id IN (${keepMemberId}, ${mergeMemberId});
    `;
    const keep = rows.find((r) => r.id === keepMemberId);
    const mergeAway = rows.find((r) => r.id === mergeMemberId);
    if (!keep || !mergeAway) {
      return res.status(404).json({ error: 'One or both member accounts were not found.' });
    }

    const mergeAwayIsNewer = new Date(mergeAway.membership_expires_at) > new Date(keep.membership_expires_at);
    const mergedExpiresAt = mergeAwayIsNewer ? mergeAway.membership_expires_at : keep.membership_expires_at;
    const mergedPhone = keep.phone || mergeAway.phone || null;
    const mergedLastPassName = mergeAwayIsNewer ? mergeAway.last_pass_name : keep.last_pass_name;
    const mergedLastTicketId = mergeAwayIsNewer ? mergeAway.last_ticket_id : keep.last_ticket_id;
    const mergeAwayEmailLower = (mergeAway.email || '').toLowerCase();

    // One transaction, so a partial merge (e.g. bookings moved but the
    // old account not actually removed) can never happen.
    const statements = [
      sql`UPDATE bookings SET customer_email = ${keep.email} WHERE LOWER(customer_email) = ${mergeAwayEmailLower} RETURNING id`,
      sql`UPDATE members SET referred_by_member_id = ${keep.id} WHERE referred_by_member_id = ${mergeAway.id} RETURNING id`,
      sql`DELETE FROM password_resets WHERE member_id = ${mergeAway.id} RETURNING id`,
      sql`DELETE FROM members WHERE id = ${mergeAway.id} RETURNING id`,
      sql`
        UPDATE members
        SET membership_expires_at = ${mergedExpiresAt}, phone = ${mergedPhone},
            last_pass_name = ${mergedLastPassName}, last_ticket_id = ${mergedLastTicketId}, updated_at = NOW()
        WHERE id = ${keep.id}
        RETURNING id, name, email, membership_expires_at, phone, last_pass_name, is_test_account, staff_note;
      `,
    ];

    const results = await sql.transaction(statements);
    const bookingsMoved = results[0].length;
    const finalMember = results[4][0];

    return res.status(200).json({
      success: true,
      member: finalMember,
      bookingsMoved,
      removedEmail: mergeAway.email,
    });
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, PATCH, POST, DELETE');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const rows = await sql`
    SELECT id, email, name, phone, last_pass_name, last_ticket_id,
           membership_expires_at, created_at, is_test_account, staff_note
    FROM members
    ORDER BY membership_expires_at DESC
    LIMIT 500;
  `;

  const now = new Date();
  const members = rows.map((m) => ({
    ...m,
    isActive: new Date(m.membership_expires_at) > now,
  }));

  return res.status(200).json({ members });
}
