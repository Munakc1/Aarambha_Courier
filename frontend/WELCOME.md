# 🎁 Welcome to ammrambha_courier

You didn't get a blank page — you got a running, good-looking **Personal portfolio** with the
boring-but-essential stuff already done. Here's what's in the box.

## ✅ Already set up for you

- **Beautiful home page** — styled with Tailwind v4, Inter font, dark theme + gradient accent.
- **SEO** — metadata, Open Graph, Twitter cards & JSON-LD, all from one file (`lib/site.ts`).
- **✨ Dynamic OG images** — every page auto-generates a social-share card at `/og` (`@lacspace/og`, auto-fitting titles). Share a link and see.
- **✨ A working contact form** — `/contact` is live, typed, validated and spam-protected (honeypot + timing) via `@lacspace/form` + `@lacspace/validate`. Just point it at your inbox.
- **✨ A ⌘K command palette** — press `⌘K` / `Ctrl-K` anywhere, powered by `@lacspace/ui`. Also try `<Reveal>`, `<Counter>`, `<GradientText>`, `<TiltCard>`, `<Marquee>`, `<Typewriter>`.
- **✨ Dark / light / system theme** — a no-flash toggle in the header via `@lacspace/theme` + `@lacspace/hooks`. The whole template is theme-aware.
- **✨ Multiple pages + auto header & footer** — the nav and a full footer are generated from one page map. The highest-value page for your template ships with **real content** (e.g. a pricing table, a shop with a working cart, a menu, a settings panel). Every other link still resolves to a real, branded page — ones you haven't filled in yet show a friendly **"under development"** screen instead of a 404. Add content in `app/<route>/page.tsx`.
- **✨ Global state + data fetching** — a dismissible announcement bar and the mobile menu use `@lacspace/store` (with `persist`); the home page's live "By the numbers" strip fetches `/api/stats` with `@lacspace/query` (shared cache, revalidate-on-focus).
- **✨ Per-page SEO** — see `app/about` & `app/contact`: one `site.meta()` call gives each route its own title, canonical & OG image.
- **✨ An SEO CI gate** — `.github/workflows/seo.yml` audits every page on each push and fails below grade A, so SEO can never regress.
- **Security headers** — HSTS, CSP, X-Frame-Options and more, via `next.config.mjs`.
- **robots.txt + sitemap.xml** — generated from your site config. No hand-editing.
- **A styled 404**, a **PWA manifest**, and **auto favicon + Apple icon** — the finishing touches most starters skip.

## 🚀 Run it

```bash
npm run dev      # http://localhost:3000
```

## 🎨 Make it yours (start here)

1. Edit **`lib/site.ts`** — your name, URL and description flow into SEO, sitemap, robots and OG.
2. Edit **`app/page.tsx`** — your home page.
3. Set **`NEXT_PUBLIC_SITE_URL`** in `.env` before deploying (copy `.env.example`).

## 🎉 Surprise: 50+ more Lacspace packages, one install away

Your app is wired for the whole ecosystem. Drop any of these in — all zero-dependency:

```bash
npm i @lacspace/id          # uuidv7, nanoid, short ids
npm i @lacspace/pdf         # invoices & receipts, no headless browser
npm i @lacspace/signed-url  # magic-login & expiring download links
npm i @lacspace/webhooks    # sign / verify / deliver webhooks
npm i @lacspace/flags       # feature flags & A/B, no SaaS
npm i @lacspace/humanize    # "1.5 KB", "3 hours ago", "1.2M"
```

Browse them all → **https://lacspace.com/packages**

## ☁️ Deploy

Push to GitHub and import on **[Vercel](https://vercel.com/new)** — it just works. Remember to set
`NEXT_PUBLIC_SITE_URL` to your real domain.

---

Built with ❤️ using [Lacspace](https://lacspace.com/packages). This app is yours under the Lacspace Free Licence.
