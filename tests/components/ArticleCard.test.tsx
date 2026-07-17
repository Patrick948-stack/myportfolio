import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../test-utils";
import ArticleCard from "@/components/blog/ArticleCard";
import type { WritingItem } from "@/types";

describe("ArticleCard", () => {
  it("renders a legacy MDX post linking to /blog/[slug]", () => {
    const item: WritingItem = {
      source: "legacy",
      post: {
        slug: "legacy-post",
        title: "Legacy Post",
        date: "2026-01-01",
        excerpt: "An old post.",
        readingTime: "2 min read",
      },
    };
    renderWithProviders(<ArticleCard item={item} />);
    expect(screen.getByText("Legacy Post")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/blog/legacy-post");
  });

  it("renders a native DB article linking to /blog/[slug]", () => {
    const item: WritingItem = {
      source: "db",
      article: {
        id: "1",
        type: "native",
        title: "Native Article",
        excerpt: "A new article.",
        tags: ["AI"],
        status: "published",
        createdAt: "2026-02-01T00:00:00.000Z",
        updatedAt: "2026-02-01T00:00:00.000Z",
        publishedAt: "2026-02-01T00:00:00.000Z",
        slug: "native-article",
        contentHtml: "<p>Some words here for reading time.</p>",
      },
    };
    renderWithProviders(<ArticleCard item={item} />);
    expect(screen.getByText("Native Article")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/blog/native-article");
  });

  it("renders a link article as an external anchor opening in a new tab", () => {
    const item: WritingItem = {
      source: "db",
      article: {
        id: "2",
        type: "link",
        title: "External Article",
        excerpt: "Read it elsewhere.",
        tags: [],
        status: "published",
        createdAt: "2026-02-01T00:00:00.000Z",
        updatedAt: "2026-02-01T00:00:00.000Z",
        publishedAt: "2026-02-01T00:00:00.000Z",
        externalUrl: "https://example.com/article",
      },
    };
    renderWithProviders(<ArticleCard item={item} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://example.com/article");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });
});
