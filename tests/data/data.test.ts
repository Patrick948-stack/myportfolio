import { describe, expect, it } from "vitest";
import { papers } from "@/data/research";

// Projects and About content used to live in data/projects.ts and
// data/about.ts — both are now rows in the site_content table, edited from
// /admin, and covered by tests/lib/site-content.test.ts instead. Research &
// Writing stays static and out of the CMS, so it's still tested here.
describe("data/research.ts", () => {
  it("every paper has non-empty fields, a unique id, and a resolvable-looking href", () => {
    const ids = new Set<string>();
    for (const paper of papers) {
      expect(paper.id.trim()).not.toBe("");
      expect(paper.title.trim()).not.toBe("");
      expect(paper.description.trim()).not.toBe("");
      expect(paper.tag.trim()).not.toBe("");
      expect(paper.href.startsWith("/")).toBe(true);
      ids.add(paper.id);
    }
    expect(ids.size).toBe(papers.length);
  });
});
