// This file lives at: api/lib/priceCatalog.js
//
// The REAL, authoritative price for every pass on the site, checked
// server-side before ever creating a Stripe charge. This exists because
// the frontend price data (src/data/danceData.ts) only lives in the
// browser bundle — without this file, a customer could edit the
// "priceInCents" value in a network request before it reaches the
// server and pay whatever they want for any pass.
//
// IMPORTANT: if you ever change a price in src/data/danceData.ts, you
// MUST update the matching entry here too, or checkout will start
// rejecting real customers at the correct new price. Same duplication
// pattern already used for event dates between danceData.ts and
// api/lib/notify.js — keep both in sync by hand.
//
// Keyed by the pass's exact `name` string, since that's the only
// identifier the frontend currently sends (see TicketModal.tsx's
// `passName={currentPassOption.name}`).

export const PRICE_CATALOG = {
  'Bachata Invasion Social Pass': 1200,
  'Bachata Locura Social Pass': 1500,
  'Tier 1: Solo Sesh': 8000,
  'Tier 2: Grindin\u2019': 10500,
  'Tier 3: Locked In': 12500,
  '1 Class Drop-In': 2000,
  '2 Class Drop-In': 3500,
  '3 Class Drop-In': 5000,
  'Bachata X1 Monthly': 10000,
  'Bachata X1 Drop-In': 3000,
};

// Returns the real per-ticket price in cents for a pass name, or null if
// the name isn't recognized at all (which itself should block checkout —
// there's no legitimate reason a real purchase would reference an
// unknown pass name).
export function getRealPriceInCents(passName) {
  return Object.prototype.hasOwnProperty.call(PRICE_CATALOG, passName)
    ? PRICE_CATALOG[passName]
    : null;
}
