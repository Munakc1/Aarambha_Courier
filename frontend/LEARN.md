# 🧭 Learn ammrambha_courier

You scaffolded **Personal portfolio** with 7 feature add-ons:
`auth-pages` · `payments` · `email` · `notify` · `realtime` · `ui` · `dataviz`.

Work through the checklist below — each item is a real next step.

## Auth & account `(auth-pages)`

Account management on top of the built-in login/register: edit profile, change password, and TOTP two-factor auth (2FA) with backup codes. Full-stack.

- [ ] Sign in, then open http://localhost:3000/account/settings.
- [ ] Enable 2FA: add the shown secret to an authenticator app (Google Authenticator, Authy…), then verify.
- [ ] Backup codes are shown once on enable — store them somewhere safe.

Learn more → https://developer.lacspace.com/packages/otp

## Payments (Nepal) `(payments)`

A checkout wired to eSewa & Khalti — orders, the signed eSewa flow (works in TEST with NO credentials), Khalti when keyed, integer-safe money. Full-stack.

- [ ] Sign in, then open http://localhost:3000/checkout and pay with eSewa — it works in TEST mode with no credentials.
- [ ] Enable Khalti by setting KHALTI_SECRET in .env (get a test key from https://khalti.com).
- [ ] Go live: set ESEWA_MERCHANT_CODE + ESEWA_SECRET (and a live KHALTI_SECRET).

Learn more → https://developer.lacspace.com/packages/esewa

## Email `(email)`

Transactional email — a ready mail service (@lacspace/mailer) with beautiful templates + address validation. Logs to the console until you add SMTP. Full-stack.

- [ ] Sign in, then open http://localhost:3000/email-test and send yourself a sample email.
- [ ] With no SMTP_* set, the email is printed to the API console (dev). Set SMTP_* in .env to send for real.
- [ ] Reuse the helpers in backend/src/mail/mailer.ts: sendWelcome / sendVerify / sendReset.

Learn more → https://developer.lacspace.com/packages/mailer

## Toast notifications `(notify)`

Beautiful in-app toast notifications (@lacspace/notify) — a <Toaster/> plus success/error/promise toasts, accessible and zero-config. Frontend, any template.

- [ ] Render <Toaster/> once in app/layout.tsx: import { Toaster } from '@/components/toaster'.
- [ ] Then call toast.success('Saved!') (or .error/.info/.promise) from any client component.
- [ ] See it live at http://localhost:3000/notify-demo.

Learn more → https://developer.lacspace.com/packages/notify

## Real-time (SSE) `(realtime)`

Live server-to-browser updates over Server-Sent Events (@lacspace/sse) — a channel hub + a /live stream + a React useSSE feed. No WebSocket server. Full-stack.

- [ ] Open http://localhost:3000/live in two tabs; click 'Broadcast' in one — the other updates instantly.
- [ ] Push from anywhere on the server: hub.broadcast({ event: 'message', data }) in src/routes/live.ts.
- [ ] SSE auto-reconnects and needs no WebSocket server — great for notifications and live feeds.

Learn more → https://developer.lacspace.com/packages/sse

## UI components `(ui)`

The @lacspace/components library wired into this template — 96 accessible components, a theme bridge so they inherit your accent and dark mode, and a working settings page. Frontend, any template.

- [ ] Run `npm run dev` and open http://localhost:3000/ui — a real form, a confirm dialog and toasts, already themed.
- [ ] Use the kit anywhere: import "@lacspace/components/styles.css" and "./lacspace-ui.css" in app/layout.tsx, then wrap <body> with <UIProvider> from @/components/ui-provider.
- [ ] Rebrand everything from app/lacspace-ui.css — it maps this template's accent, radius and font onto the kit's --lac-* variables, so dark mode follows your theme toggle.

Learn more → https://developer.lacspace.com/components

## Charts, tables & dates `(dataviz)`

A working insights page from @lacspace/charts, @lacspace/table and @lacspace/date — SVG charts, a sortable/exportable data table and a date-range filter. No canvas, no D3, no grid licence. Frontend, any template.

- [ ] Run `npm run dev` and open http://localhost:3000/insights — stats, a line chart, a date-range filter and an exportable table.
- [ ] Swap the sample arrays at the top of app/insights/page.tsx for your own data; everything else is already wired.
- [ ] The CSV export neutralises leading =, +, - and @, so an exported cell can never run as a formula in Excel.

Learn more → https://developer.lacspace.com/components#charts

---

Every add-on is built from zero-dependency `@lacspace/*` packages. Browse them all → https://lacspace.com/packages
