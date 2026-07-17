import { describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/session", () => ({
  readSessionFromCookieValue: vi.fn(),
  COOKIE_NAME: "admin_session",
}));

const { readSessionFromCookieValue } = await import("@/lib/session");
const { default: proxy } = await import("@/proxy");

function makeRequest(path: string, cookie?: string) {
  return new NextRequest(`https://example.com${path}`, {
    headers: cookie ? { cookie: `admin_session=${cookie}` } : {},
  });
}

describe("proxy", () => {
  it("passes through requests outside /admin without checking session", async () => {
    const res = await proxy(makeRequest("/blog"));
    expect(readSessionFromCookieValue).not.toHaveBeenCalled();
    expect(res.status).toBe(200);
  });

  it("redirects unauthenticated requests to /admin to the login page", async () => {
    vi.mocked(readSessionFromCookieValue).mockResolvedValue({ isAuth: false });
    const res = await proxy(makeRequest("/admin"));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/admin/login");
  });

  it("lets authenticated requests through to /admin", async () => {
    vi.mocked(readSessionFromCookieValue).mockResolvedValue({ isAuth: true });
    const res = await proxy(makeRequest("/admin", "valid"));
    expect(res.status).toBe(200);
  });

  it("redirects an already-authenticated visitor away from /admin/login", async () => {
    vi.mocked(readSessionFromCookieValue).mockResolvedValue({ isAuth: true });
    const res = await proxy(makeRequest("/admin/login", "valid"));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toMatch(/\/admin$/);
  });

  it("lets an unauthenticated visitor reach /admin/login", async () => {
    vi.mocked(readSessionFromCookieValue).mockResolvedValue({ isAuth: false });
    const res = await proxy(makeRequest("/admin/login"));
    expect(res.status).toBe(200);
  });
});
