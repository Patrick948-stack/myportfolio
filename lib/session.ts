import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "admin_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not set.");
  }
  return new TextEncoder().encode(secret);
}

interface SessionPayload {
  role: "admin";
  expiresAt: number;
  [key: string]: unknown;
}

// Exported (rather than kept private) so tests can round-trip a session
// token without needing a Next.js request context for cookies().
export async function encryptSession(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());
}

export async function decryptSession(
  sessionCookie: string | undefined
): Promise<SessionPayload | null> {
  if (!sessionCookie) return null;
  try {
    const { payload } = await jwtVerify(sessionCookie, getSecretKey(), {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function createSession(): Promise<void> {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const session = await encryptSession({ role: "admin", expiresAt });
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expiresAt),
  });
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function readSessionFromCookieValue(
  cookieValue: string | undefined
): Promise<{ isAuth: boolean }> {
  const payload = await decryptSession(cookieValue);
  return { isAuth: payload?.role === "admin" };
}

// Non-redirecting check — use in Route Handlers called via fetch (e.g. the
// image upload endpoint), where a 401 JSON response is more useful to the
// caller than an HTML redirect.
export const getSessionPayload = cache(async (): Promise<SessionPayload | null> => {
  const cookieStore = await cookies();
  return decryptSession(cookieStore.get(COOKIE_NAME)?.value);
});

// Secure, per-request check for use in Server Components and Server Actions.
// Redirects unauthenticated requests — proxy.ts only performs an optimistic
// check and must not be the sole line of defense.
export const verifySession = cache(async (): Promise<{ isAuth: true }> => {
  const payload = await getSessionPayload();

  if (!payload || payload.role !== "admin") {
    redirect("/admin/login");
  }

  return { isAuth: true };
});

export { COOKIE_NAME };
