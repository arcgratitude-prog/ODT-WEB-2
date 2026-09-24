// Shared admin-auth checks. Every private staff/automation endpoint in
// this project used to define its own copy of the same simple password
// check — this is that logic in one place instead, so there's exactly
// one thing to read (and one thing to change, if the auth approach ever
// needs to) rather than three near-identical copies quietly drifting
// apart over time.

// The plain shared-password check used by every staff-facing admin page
// (check-in, members) — sent as the "x-admin-password" header, checked
// against the ADMIN_PASSWORD env var. Simple, no user accounts to
// manage, good enough for a small team sharing one door-check device.
export function isAdminAuthorized(req) {
  const provided = req.headers['x-admin-password'];
  const expected = process.env.ADMIN_PASSWORD;
  return !!expected && provided === expected;
}

// For endpoints that ALSO need to accept Vercel's own automated cron
// invocation (authenticated via the Authorization: Bearer header Vercel
// sends automatically when CRON_SECRET is set as an env var), on top of
// the same admin password above — so a real person can still manually
// trigger or test-run the job without needing to know/handle
// CRON_SECRET themselves.
export function isCronOrAdminAuthorized(req) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers['authorization'];
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) return true;
  return isAdminAuthorized(req);
}
