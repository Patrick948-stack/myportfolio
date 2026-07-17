import { describe, expect, it } from "vitest";
import { getAllSlugs, getAllPosts, parsePostFrontmatter } from "@/lib/blog";

describe("blog utilities", () => {
  // content/blog/ now only holds legacy static posts, if any — real articles
  // are authored through the /admin CMS and live in the database instead.
  // There are none checked into this repo, so these read as empty.
  it("returns no slugs when content/blog is empty", () => {
    expect(getAllSlugs()).toEqual([]);
  });

  it("returns no posts when content/blog is empty", () => {
    expect(getAllPosts()).toEqual([]);
  });

  it("validates frontmatter and preserves tags", () => {
    const parsed = parsePostFrontmatter({
      title: "Test",
      date: "2026-01-01",
      excerpt: "A test excerpt.",
      tags: ["Test", "MDX"],
      published: true,
    });

    expect(parsed).toEqual({
      title: "Test",
      date: "2026-01-01",
      excerpt: "A test excerpt.",
      tags: ["Test", "MDX"],
      coverImage: undefined,
      published: true,
    });
  });

  it("throws when frontmatter title is missing", () => {
    expect(() =>
      parsePostFrontmatter({
        date: "2026-01-01",
        excerpt: "A test excerpt.",
      }),
    ).toThrow("Invalid post frontmatter: title is required.");
  });
});
