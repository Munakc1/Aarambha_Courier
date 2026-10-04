# ammrambha_courier — API

Node · Express · MongoDB · Redis (optional) · TypeScript. Built on zero-dependency `@lacspace/*` packages.

Run it from the repo root with `npm run dev` (starts this API + the frontend). Standalone: `npm run dev` inside this folder.

## Endpoints

| Method | Path             | Auth | Description                    |
|--------|------------------|------|--------------------------------|
| GET    | `/health`        | —    | Liveness check                 |
| POST   | `/auth/register` | —    | Create an account → JWT + user |
| POST   | `/auth/login`    | —    | Log in → JWT + user            |
| GET    | `/auth/me`       | ✓    | The current user               |
| GET    | `/notes`         | ✓    | List your notes (cached)       |
| POST   | `/notes`         | ✓    | Create a note                  |
| GET    | `/notes/:id`     | ✓    | Read one note                  |
| PATCH  | `/notes/:id`     | ✓    | Update a note                  |
| DELETE | `/notes/:id`     | ✓    | Delete a note                  |

Send `Authorization: Bearer <token>` for the ✓ routes (you get the token from register/login).

## Layout

```
src/
├─ index.ts        boot: load env → connect Mongo → listen
├─ load-env.ts     loads the root .env (imported first)
├─ env.ts          typed, validated env (@lacspace/env)
├─ app.ts          the Express app (CORS, routes, error handler)
├─ db.ts           Mongoose connection
├─ cache.ts        Redis, or an in-memory fallback (@lacspace/cache)
├─ http.ts         HttpError + asyncHandler
├─ validation.ts   request schemas (@lacspace/validate)
├─ middleware/     auth (@lacspace/jwt) + error handling
├─ models/         Mongoose models (User, Note)
└─ routes/         auth + notes (the example CRUD resource)
```
