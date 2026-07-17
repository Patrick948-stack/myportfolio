import { describe, expect, it, vi, beforeEach } from "vitest";

const { rows, resetRows } = vi.hoisted(() => {
  let data: Record<string, unknown> = {};
  return {
    rows: {
      get: () => data,
      set: (value: Record<string, unknown>) => {
        data = value;
      },
    },
    resetRows: () => {
      data = {};
    },
  };
});

function fakeQuery(text: string, params: unknown[] = []) {
  const sql = text.trim().toLowerCase().replace(/\s+/g, " ");
  const store = rows.get();

  if (sql.startsWith("select key, data from site_content")) {
    const [key] = params as [string];
    return key in store ? [{ key, data: store[key] }] : [];
  }

  if (sql.startsWith("insert into site_content")) {
    const [key, json] = params as [string, string];
    const data = JSON.parse(json);
    rows.set({ ...store, [key]: data });
    return [{ key, data }];
  }

  throw new Error(`Unhandled fake query: ${text}`);
}

vi.mock("@/lib/db", () => ({
  query: vi.fn((text: string, params?: unknown[]) => Promise.resolve(fakeQuery(text, params))),
}));

vi.mock("@/lib/session", () => ({
  verifySession: vi.fn(() => Promise.resolve({ isAuth: true })),
}));

const { getSiteContent, updateSiteContent } = await import("@/lib/site-content");

beforeEach(() => {
  resetRows();
});

describe("getSiteContent", () => {
  it("returns a valid empty default when a section has never been seeded", async () => {
    const hero = await getSiteContent("hero");
    expect(hero).toEqual({ titles: [], headline: "", subtitle: "" });
  });

  it("returns the stored row once one exists", async () => {
    await updateSiteContent("contact", {
      email: "test@example.com",
      phone: "555-0100",
      social: [{ label: "github", href: "https://github.com/example" }],
    });

    const contact = await getSiteContent("contact");
    expect(contact.email).toBe("test@example.com");
    expect(contact.social).toHaveLength(1);
  });
});

describe("updateSiteContent", () => {
  it("upserts valid content for every section key", async () => {
    const hero = await updateSiteContent("hero", {
      titles: ["Engineer"],
      headline: "Headline",
      subtitle: "Subtitle",
    });
    expect(hero.headline).toBe("Headline");

    const portfolio = await updateSiteContent("portfolio", {
      items: [{ id: "p1", title: "Project", description: "Desc", href: "#" }],
    });
    expect(portfolio.items).toHaveLength(1);

    const services = await updateSiteContent("services", {
      items: [
        {
          iconKey: "code",
          title: "Dev",
          description: "Desc",
          ctaLabel: "Go",
          ctaHref: "#contact",
        },
      ],
    });
    expect(services.items[0].title).toBe("Dev");
  });

  it("rejects malformed content instead of saving it", async () => {
    await expect(
      updateSiteContent(
        "hero",
        // Missing required `headline`/`subtitle` — should fail zod validation.
        { titles: ["Engineer"] } as never
      )
    ).rejects.toThrow();

    // Confirm the bad write didn't get through.
    const hero = await getSiteContent("hero");
    expect(hero.headline).toBe("");
  });
});
