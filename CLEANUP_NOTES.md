# Cleanup notes

A pass to de-duplicate the project and fix bugs. Everything below still type-checks
(`npm run lint`) and builds (`npm run build`) cleanly.

## Bugs fixed
1. **Fragile asset import in `Hero.tsx`.** It imported `albina_isaac_directors.jpg`
   via `../../` (reaching *outside* `src/` into the repo root) while every other image
   used `../assets/images/`. Moved the image into `src/assets/images/` and fixed the
   import so nothing in `src/` reaches outside `src/` anymore.
2. **Missing favicon.** `index.html` referenced `/favicon.svg`, which didn't exist
   (404 on every page load). Added an on-brand `public/favicon.svg`.
3. **Invalid pass type (TypeScript error).** The "3 Class Drop-In" pass had
   `type: 'drop_in_3'`, which isn't a member of the `PassOption` union.
4. **Calendar CTA opened the wrong pass.** `CalendarPage` opened booking with
   `passTypeId: 'dropin-full'`, but the matching pass had `id: 'dropin-3'`, so
   `TicketModal` fell back to the *1*-class pass. Renamed the pass to
   `id: 'dropin-full'` / `type: 'drop_in_full'` — this fixes bug #3, fixes the calendar
   mismatch, and puts the previously-unused `drop_in_full` union member to use.
5. **Stripe type error in `CustomStripeCheckout.tsx`.** The installed Stripe typings
   mis-infer `elements.getElement(CardElement)`, breaking the `confirmCardPayment`
   call. Narrowed the result to `StripeCardElement` (type-only change; runtime
   behavior is unchanged).

## Duplicates / dead files removed
- Stale root-level copies left over from the move into `src/` (all older than, and
  broken relative to, the `src/` versions): `App.tsx`, `Hero.tsx`, `Navbar.tsx`,
  `ScheduleSection.tsx`, `main.tsx`, `index.css`, `types.ts`, `danceData.ts`,
  `vite-env.d.ts`.
- Dead nested duplicate: `src/components/App.tsx` (identical to `src/App.tsx`, unused).
- Byte-identical duplicate media at the repo root (the real copies live in
  `src/assets/`): the 4 studio images + `albina_isaac_dance_reel.mp4`.
- Junk: the 6.8 MB `Thank you to everyone…​.mp4` (an accidental upload with a mangled
  filename) and `albina_isaac_directors-1.jpg` (a "(1)" copy nothing referenced).

Result: ~17 MB lighter, and the repo root now contains only real project files.

## Worth a look (not changed, to avoid surprises)
- **Unused dependencies.** `@google/genai` and `motion` are declared in `package.json`
  but imported nowhere. Removing them (and the stale `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`
  in `metadata.json`) would slim installs. `express` / `dotenv` also aren't imported by
  the app code — check whether your deploy tooling needs them before removing.
- **Two lockfiles.** Both `bun.lock` and `package-lock.json` are present. Pick one
  package manager and delete the other so they can't drift apart.
- **Unused alias.** The `@` alias (`vite.config.ts` + `tsconfig.json`) points at the
  repo root and is imported by nothing. Left as-is; safe to remove or repoint to `./src`.
- **Placeholder phone number.** `index.html`'s JSON-LD has `+1-813-555-0192`, which looks
  like a stand-in. Update it for accurate local-business SEO.
- **Unused asset.** `src/assets/videos/albina_isaac_dance_reel.mp4` isn't referenced
  anywhere (kept in place in case you want to wire it in).
