import { describe, expect, it, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../test-utils";

vi.mock("@/lib/articles", () => ({
  getPublicArticles: vi.fn(),
}));

vi.mock("@/lib/site-content", () => ({
  getSiteContent: vi.fn(),
}));

const { getPublicArticles } = await import("@/lib/articles");
const { getSiteContent } = await import("@/lib/site-content");
const { default: LatestPosts } = await import("@/components/blog/LatestPosts");

describe("LatestPosts", () => {
  beforeEach(() => {
    vi.mocked(getSiteContent).mockResolvedValue({
      title: "Latest Writing",
      subtitle: "Notes on physics, data visualization, and AI research.",
    });
  });

  it("renders nothing when there are no published articles", async () => {
    vi.mocked(getPublicArticles).mockResolvedValue([]);
    const result = await LatestPosts();
    expect(result).toBeNull();
  });

  it("renders the section heading and cards when articles exist", async () => {
    vi.mocked(getPublicArticles).mockResolvedValue([
      {
        source: "legacy",
        post: {
          slug: "a-post",
          title: "A Post",
          date: "2026-01-01",
          excerpt: "Excerpt",
          readingTime: "1 min read",
        },
      },
    ]);
    const result = await LatestPosts();
    if (!result) throw new Error("Expected LatestPosts to render.");
    renderWithProviders(result);
    expect(screen.getByText("Latest Writing")).toBeInTheDocument();
    expect(screen.getByText("A Post")).toBeInTheDocument();
  });
});
