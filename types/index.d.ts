// Shared API contract — imported by BOTH the frontend and the backend, so the two
// can never drift. These are TYPE-ONLY (no runtime code), so importing them adds
// nothing to either bundle. Edit here once; both sides update. Use `import type`.

/** A user, as returned by the API (no password; dates are ISO strings). */
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

/** The response from POST /auth/register and POST /auth/login. */
export interface AuthResponse {
  token: string;
  user: User;
}

/** The shape of an error response from the API. */
export interface ApiError {
  error: string;
  fields?: Record<string, string>;
}

/** The example CRUD resource. Rename "Note" to your real domain object. */
export interface Note {
  id: string;
  title: string;
  body: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteInput {
  title: string;
  body?: string;
}

export interface UpdateNoteInput {
  title?: string;
  body?: string;
}
