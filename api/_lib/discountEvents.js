// Server-side "which cycle is this" tag for each dated, discount-eligible
// event (Invasion, Locura, Boot Camp). Used ONLY to enforce one member
// discount per event — see create-payment-intent.js (checks whether this
// member already has a booking with this key) and stripe-webhook.js
// (stamps the key onto the one ticket in an order that got the
// discount).
//
// WHY A KEY INSTEAD OF A DATE COMPARISON: these events recur (Invasion
// every 2 weeks, the others roughly monthly), and this file has no
// reliable way to compute "which occurrence a past booking belongs to"
// from a date range alone without risking either blocking a member from
// re-earning their discount next cycle, or letting them reuse it within
// the same live cycle. A plain string key sidesteps that: it only
// changes when a human updates it below, which already happens as part
// of the existing manual date-rollover ritual for these events (see the
// file list in src/utils/eventSchedule.ts) — so bumping the key here,
// at the same time, is what naturally lets the discount become
// claimable again for the next occurrence.
//
// KEEP THIS IN SYNC: update the key for an event here at the same time
// its real date changes elsewhere (src/utils/eventSchedule.ts and the
// other files it lists) — otherwise a member could be wrongly blocked
// from a discount they haven't actually used yet this cycle.
const DISCOUNT_EVENT_KEYS = {
  'Bachata Invasion Social Pass': 'invasion-2026-09-11',
  'Bachata Locura Social Pass': 'locura-2026-09-20',
  'Bachata Battle Boot Camp': 'bootcamp-2026-09-20',
};

export function getDiscountEventKey(passName) {
  return DISCOUNT_EVENT_KEYS[passName] || null;
}
