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
  // The regular ($20) Locura price — same real event as the $15
  // pre-sale entry above, sold once pre-sale closes. Kept as a
  // separate catalog entry (rather than reusing the same name) because
  // this lookup can only map one name to one price; see
  // src/data/danceData.ts (SOCIAL_PASS_DOOR_OPTION) for why the name
  // still starts with "Bachata Locura Social Pass".
  'Bachata Locura Social Pass - Regular Price': 2000,
  'Bachata Battle Boot Camp': 4500,
  'AI Urbano Lab Night': 1200,
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

// Florida sales tax on event admissions (Florida Statute 212.04) —
// applied only to the two ticketed social events, Invasion and Locura,
// per Antonio's direction. NOT applied to Tiers/drop-ins/Boot Camp/Lab
// Night — those weren't asked for and shouldn't silently start charging
// tax without a separate, deliberate decision (they may have different
// taxability under FL law — e.g. structured classes are treated
// differently from straight admissions — worth confirming with an
// accountant before ever extending this list).
//
// 7.5% is the current combined Tampa/Hillsborough County rate (6% FL
// state + 1.5% county surtax) as of this writing. Rates can change —
// confirm the current rate at floridarevenue.com or with an accountant
// before updating this number; Claude is not a tax advisor and this
// figure should be treated as configuration to verify, not gospel.
export const SALES_TAX_RATE = 0.075;

// PAUSED as of Sept 20, 2026 — Antonio asked to leave tax out of this
// social and revisit it for the next one, so this set is empty for now.
// The real event admissions (Invasion, Locura, the $20 door price) are
// listed below, commented out — un-comment the ones that should charge
// tax again when ready, rather than rebuilding this feature from
// scratch. Nothing else needs to change: create-payment-intent.js,
// stripe-webhook.js, and the checkout UI all already key off
// isTaxablePass() below, so flipping this set is the single switch.
const TAXABLE_PASS_NAMES = new Set([
  // 'Bachata Invasion Social Pass',
  // 'Bachata Locura Social Pass',
  // 'Bachata Locura Social Pass - Regular Price',
]);

export function isTaxablePass(passName) {
  return TAXABLE_PASS_NAMES.has(passName);
}

// Tax is computed on the amount actually being paid — i.e. AFTER any
// member discount — not the pre-discount sticker price. This matches
// how sales tax normally works: tax on what the customer is really
// charged, not on a price they never paid.
export function calculateTaxCents(subtotalInCents) {
  return Math.round(subtotalInCents * SALES_TAX_RATE);
}
