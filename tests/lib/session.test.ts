// @vitest-environment node
//
// jose's HMAC signing does a strict `instanceof Uint8Array` check on the key.
// In the jsdom environment (this project's default), TextEncoder/Uint8Array
// come from a different realm than Node's, which fails that check — so this
// file runs under the plain Node environment instead.
import { describe, expect, it, beforeAll } from "vitest";

beforeAll(() => {
  process.env.SESSION_SECRET = "test-secret-key-for-vitest-only";
});

const { encryptSession, decryptSession, readSessionFromCookieValue } = await import(
  "@/lib/session"
);

describe("session encrypt/decrypt", () => {
  it("round-trips a valid session payload", async () => {
    const token = await encryptSession({ role: "admin", expiresAt: Date.now() + 1000 });
    const payload = await decryptSession(token);
    expect(payload?.role).toBe("admin");
  });

  it("returns null for a garbage token", async () => {
    const payload = await decryptSession("not-a-real-token");
    expect(payload).toBeNull();
  });

  it("returns null for an undefined cookie value", async () => {
    const payload = await decryptSession(undefined);
    expect(payload).toBeNull();
  });

  it("rejects a token signed with a different secret", async () => {
    const token = await encryptSession({ role: "admin", expiresAt: Date.now() + 1000 });
    const originalSecret = process.env.SESSION_SECRET;
    process.env.SESSION_SECRET = "a-completely-different-secret";
    const payload = await decryptSession(token);
    process.env.SESSION_SECRET = originalSecret;
    expect(payload).toBeNull();
  });
});

describe("readSessionFromCookieValue", () => {
  it("reports authenticated for a valid admin token", async () => {
    const token = await encryptSession({ role: "admin", expiresAt: Date.now() + 1000 });
    const { isAuth } = await readSessionFromCookieValue(token);
    expect(isAuth).toBe(true);
  });

  it("reports unauthenticated for a missing cookie", async () => {
    const { isAuth } = await readSessionFromCookieValue(undefined);
    expect(isAuth).toBe(false);
  });

  it("reports unauthenticated for an invalid cookie", async () => {
    const { isAuth } = await readSessionFromCookieValue("garbage");
    expect(isAuth).toBe(false);
  });
});
