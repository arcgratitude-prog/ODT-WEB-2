// Admin-only endpoint: lists all Tier members (regardless of active
// status — filtering active-only happens client-side so staff can toggle
// between "everyone who ever had a membership" and "who's active right
// now" without extra requests). Also handles manual corrections to a
// member's expiration date (PATCH) — kept in this same file rather than
// a new one, since Vercel's plan caps the number of serverless
// functions and this is the same underlying resource anyway.
// Same shared-password protection as admin-bookings.js.

import { ensureMembersTable, sql } from './_lib/db.js';

function isAuthorized(req) {
  const provided = req.headers['x-admin-password'];
  const expected = process.env.ADMIN_PASSWORD;
  return expected && provided === expected;
}

export default async function handler(req, res) {
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await ensureMembersTable();

  if (req.method === 'PATCH') {
    // Two independent manual corrections live on this one endpoint:
    //   - newExpiresAt: fixing a member's expiration date for a real
    //     edge case (e.g. someone bought right after that day's class
    //     already happened, so their real 4-week window should be
    //     counted differently than a pure "purchase timestamp + 28
    //     days" would give them).
    //   - isTestAccount: flagging/unflagging an account as a test
    //     account, so it can be told apart from real members in the
    //     list and excluded from the real member counts — without
    //     changing how the account actually behaves anywhere else.
    // Either can be sent alone, or both together; at least one is
    // required.
    const { memberId, newExpiresAt, isTestAccount } = req.body || {};
    if (!memberId) {
      return res.status(400).json({ error: 'memberId is required.' });
    }
    if (newExpiresAt === undefined && isTestAccount === undefined) {
      return res.status(400).json({ error: 'Nothing to update — provide newExpiresAt and/or isTestAccount.' });
    }

    let parsedDate = null;
    if (newExpiresAt !== undefined) {
      parsedDate = new Date(newExpiresAt);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: 'newExpiresAt is not a valid date.' });
      }
    }

    let updated;
    if (parsedDate !== null && isTestAccount !== undefined) {
      updated = await sql`
        UPDATE members
        SET membership_expires_at = ${parsedDate.toISOString()}, is_test_account = ${!!isTestAccount}, updated_at = NOW()
        WHERE id = ${memberId}
        RETURNING id, name, email, membership_expires_at, is_test_account;
      `;
    } else if (parsedDate !== null) {
      updated = await sql`
        UPDATE members SET membership_expires_at = ${parsedDate.toISOString()}, updated_at = NOW()
        WHERE id = ${memberId}
        RETURNING id, name, email, membership_expires_at, is_test_account;
      `;
    } else {
      updated = await sql`
        UPDATE members SET is_test_account = ${!!isTestAccount}, updated_at = NOW()
        WHERE id = ${memberId}
        RETURNING id, name, email, membership_expires_at, is_test_account;
      `;
    }

    if (updated.length === 0) {
      return res.status(404).json({ error: 'No member found with that id.' });
    }
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

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, PATCH, DELETE');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const rows = await sql`
    SELECT id, email, name, phone, last_pass_name, last_ticket_id,
           membership_expires_at, created_at, is_test_account
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
