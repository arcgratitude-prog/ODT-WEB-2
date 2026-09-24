// Daily job: emails any active member whose Tier membership is about to
// expire, so they have a heads-up to renew before losing access. Wired
// to run once a day via Vercel Cron (see the "crons" entry in
// vercel.json) — Vercel's Hobby plan allows cron jobs, but caps them at
// once per day with imprecise timing (fires sometime within the
// scheduled hour, not the exact minute) — both are fine here, since a
// renewal reminder never needs more precision than "sometime today."
//
// REMINDER_WINDOW_DAYS below controls how many days before expiration
// the reminder goes out — change that one number to adjust the timing.
//
// Two ways in, matching the pattern used elsewhere in this project:
//   - Vercel's own cron invocation, authenticated via the Authorization:
//     Bearer header it automatically sends when CRON_SECRET is set as
//     an env var (set this in Vercel the same way ADMIN_PASSWORD is
//     set) — this is what runs it for real, once a day.
//   - The existing shared ADMIN_PASSWORD (as the x-admin-password
//     header), so a real person can manually trigger or dry-run it to
//     verify it's working, without needing to know/handle CRON_SECRET.
//
// Add ?dryRun=true to preview exactly who would be emailed WITHOUT
// actually sending anything or marking anyone as reminded — always do
// this first before trusting a fresh deploy of this file, since it
// sends real email to real customers.

import { ensureMembersTable, sql } from './_lib/db.js';
import { sendMembershipRenewalReminder } from './_lib/notify.js';
import { isCronOrAdminAuthorized } from './_lib/auth.js';

const REMINDER_WINDOW_DAYS = 3;

export default async function handler(req, res) {
  if (!isCronOrAdminAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await ensureMembersTable();

  const dryRun = req.query?.dryRun === 'true' || req.query?.dryRun === '1';

  // Active members whose membership expires within the reminder window,
  // and who either haven't been reminded yet or whose last reminder was
  // for an OLDER (shorter) expiration — i.e. they've since renewed at
  // least once since that reminder, so this is a fresh cycle and they're
  // due a fresh reminder as THIS expiration approaches. Comparing
  // against membership_expires_at (not just checking IS NULL) is what
  // makes this correctly re-arm itself after every renewal, whether
  // someone renews early or lets it lapse and comes back later.
  const dueForReminder = await sql`
    SELECT id, name, email, last_pass_name, membership_expires_at
    FROM members
    WHERE membership_expires_at > NOW()
      AND membership_expires_at <= NOW() + ${`${REMINDER_WINDOW_DAYS} days`}::interval
      AND (
        renewal_reminder_sent_at IS NULL
        OR renewal_reminder_sent_at < membership_expires_at - INTERVAL '28 days'
      )
    ORDER BY membership_expires_at ASC;
  `;

  if (dryRun) {
    return res.status(200).json({
      dryRun: true,
      wouldEmail: dueForReminder.length,
      members: dueForReminder.map((m) => ({ name: m.name, email: m.email, expiresAt: m.membership_expires_at })),
    });
  }

  let sentCount = 0;
  const failures = [];

  for (const member of dueForReminder) {
    try {
      await sendMembershipRenewalReminder(member);
      await sql`UPDATE members SET renewal_reminder_sent_at = NOW() WHERE id = ${member.id};`;
      sentCount += 1;
    } catch (err) {
      // One failed email (bad address, Resend hiccup, etc.) shouldn't
      // stop the rest of the batch from going out — log it and move on.
      failures.push({ email: member.email, error: err?.message || 'unknown error' });
    }
  }

  console.log(`Renewal reminders: ${sentCount} sent, ${failures.length} failed, out of ${dueForReminder.length} due.`);

  return res.status(200).json({
    checked: dueForReminder.length,
    sent: sentCount,
    failed: failures.length,
    failures,
  });
}
