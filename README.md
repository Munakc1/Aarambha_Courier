# ammrambha_courier

A full-stack app scaffolded with [create-lacspace-app](https://www.npmjs.com/package/create-lacspace-app) — a **Personal portfolio** frontend + a real backend, wired together.

```
ammrambha_courier/
├─ frontend/   Next.js 15 app (your UI) — talks to the API
├─ backend/    Node · Express · MongoDB · Redis · TypeScript API
├─ types/      Shared API types — imported by BOTH sides, so they can't drift
└─ docker-compose.yml   Mongo + Redis for local dev (optional)
```

## Quick start

```bash
cp .env.example .env         # one env file for everything (sensible defaults)
docker compose up -d         # optional: starts MongoDB + Redis locally
npm install                  # installs all three workspaces at once
npm run dev                  # runs the API (:4000) and the frontend (:3000) together
```

Then open **http://localhost:3000** → visit **/register**, create an account, and you'll land on **/account** — a protected page that reads/writes the example "notes" resource through the API.

**No Docker?** Point `MONGODB_URI` at any MongoDB (a free [Atlas](https://www.mongodb.com/atlas) cluster works). Redis is optional — leave `REDIS_URL` empty and the API uses an in-memory cache instead.

## What's already built

- **Auth** — `POST /auth/register`, `POST /auth/login` (JWT), `GET /auth/me`. Passwords hashed with `@lacspace/password`, tokens signed/verified with `@lacspace/jwt`.
- **Example CRUD** — `/notes` (list · create · read · update · delete), protected, per-user, with a per-user cache (Redis or in-memory) that busts on writes.
- **Validation** — request bodies validated with `@lacspace/validate`; failures return a clean 400.
- **Rate limiting** — auth endpoints throttled with `@lacspace/rate-limit`.
- **Typed env** — `@lacspace/env` fails fast at boot if config is wrong.

Everything on the backend is built from zero-dependency `@lacspace/*` packages → https://lacspace.com/packages

## Make it yours

Rename the `Note` resource (in `types/index.d.ts`, `backend/src/models/note.ts`, `backend/src/routes/notes.ts`) to your real domain object, then follow the same pattern for more resources. The shared `types/` package keeps the frontend and backend in lock-step.
