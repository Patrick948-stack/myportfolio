import { describe, expect, it, vi, beforeEach } from "vitest";

const { table, resetTable } = vi.hoisted(() => {
  let rows: Record<string, unknown>[] = [];
  return {
    table: {
      get rows() {
        return rows;
      },
      set rows(value: Record<string, unknown>[]) {
        rows = value;
      },
    },
    resetTable: () => {
      rows = [];
    },
  };
});

function fakeQuery(text: string, params: unknown[] = []) {
  const sql = text.trim().toLowerCase().replace(/\s+/g, " ");

  if (sql.startsWith("select slug from articles")) {
    const [base] = params as [string];
    return table.rows.filter(
      (r) => typeof r.slug === "string" && (r.slug as string).startsWith(base)
    );
  }

  if (sql.startsWith("insert into articles (type, title, slug")) {
    const [title, slug, excerpt, contentHtml, coverImage, tags, status, publishedAt] =
      params as string[];
    const row = {
      id: `native-${table.rows.length + 1}`,
      type: "native",
      title,
      slug,
      excerpt,
      content_html: contentHtml,
      cover_image: coverImage,
      external_url: null,
      tags,
      status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: publishedAt,
    };
    table.rows = [...table.rows, row];
    return [row];
  }

  if (sql.startsWith("insert into articles (type, title, excerpt")) {
    const [title, excerpt, coverImage, externalUrl, tags, status, publishedAt] =
      params as string[];
    const row = {
      id: `link-${table.rows.length + 1}`,
      type: "link",
      title,
      slug: null,
      excerpt,
      content_html: null,
      cover_image: coverImage,
      external_url: externalUrl,
      tags,
      status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: publishedAt,
    };
    table.rows = [...table.rows, row];
    return [row];
  }

  if (sql.startsWith("select * from articles where status")) {
    return table.rows.filter((r) => r.status === "published");
  }

  if (sql.startsWith("select * from articles where slug")) {
    const [slug] = params as [string];
    return table.rows.filter(
      (r) => r.slug === slug && r.type === "native" && r.status === "published"
    );
  }

  if (sql.startsWith("select * from articles where id")) {
    const [id] = params as [string];
    return table.rows.filter((r) => r.id === id);
  }

  if (sql.startsWith("select * from articles order by updated_at")) {
    return [...table.rows];
  }

  if (sql.startsWith("update articles set title")) {
    const [id, title, excerpt, coverImage, tags, contentHtml, externalUrl, slug] =
      params as string[];
    const row = table.rows.find((r) => r.id === id);
    if (!row) return [];
    row.title = title;
    row.excerpt = excerpt;
    row.cover_image = coverImage;
    row.tags = tags;
    if (contentHtml != null) row.content_html = contentHtml;
    row.external_url = externalUrl;
    if (slug != null) row.slug = slug;
    return [row];
  }

  if (sql.startsWith("update articles set status")) {
    const [id, status] = params as string[];
    const row = table.rows.find((r) => r.id === id);
    if (!row) return [];
    row.status = status;
    if (status === "published") row.published_at = new Date().toISOString();
    return [row];
  }

  if (sql.startsWith("delete from articles")) {
    const [id] = params as [string];
    table.rows = table.rows.filter((r) => r.id !== id);
    return [];
  }

  throw new Error(`Unhandled fake query: ${text}`);
}

vi.mock("@/lib/db", () => ({
  query: vi.fn((text: string, params?: unknown[]) => Promise.resolve(fakeQuery(text, params))),
}));

vi.mock("@/lib/session", () => ({
  verifySession: vi.fn(() => Promise.resolve({ isAuth: true })),
}));

vi.mock("@/lib/blog", () => ({
  getAllPosts: vi.fn(() => []),
}));

const { getAllPosts } = await import("@/lib/blog");
const {
  getPublicArticles,
  getPublicNativeArticleBySlug,
  getAllArticlesAdmin,
  createArticle,
  updateArticle,
  setArticleStatus,
  deleteArticle,
} = await import("@/lib/articles");

beforeEach(() => {
  resetTable();
  vi.mocked(getAllPosts).mockReturnValue([]);
});

describe("getPublicArticles", () => {
  it("returns an empty list when there are no legacy posts or DB articles", async () => {
    expect(await getPublicArticles()).toEqual([]);
  });

  it("merges published DB articles with legacy posts, sorted by date desc", async () => {
    vi.mocked(getAllPosts).mockReturnValue([
      {
        slug: "legacy-post",
        title: "Legacy Post",
        date: "2026-01-01",
        excerpt: "Old",
        readingTime: "1 min read",
      },
    ]);

    await createArticle({
      type: "native",
      title: "New Article",
      excerpt: "New",
      contentHtml: "<p>hi</p>",
      tags: [],
      status: "published",
    });

    const items = await getPublicArticles();
    expect(items).toHaveLength(2);
    expect(items[0].source).toBe("db"); // most recent (just created) first
    expect(items[1].source).toBe("legacy");
  });

  it("excludes draft DB articles from the public list", async () => {
    await createArticle({
      type: "native",
      title: "Draft Article",
      excerpt: "Draft",
      contentHtml: "<p>hi</p>",
      tags: [],
      status: "draft",
    });

    expect(await getPublicArticles()).toEqual([]);
  });
});

describe("createArticle / slug generation", () => {
  it("slugifies the title for native articles", async () => {
    const article = await createArticle({
      type: "native",
      title: "Hello, World!",
      excerpt: "e",
      contentHtml: "<p>hi</p>",
      tags: [],
    });
    expect(article.type).toBe("native");
    if (article.type === "native") expect(article.slug).toBe("hello-world");
  });

  it("disambiguates a slug collision", async () => {
    await createArticle({
      type: "native",
      title: "Same Title",
      excerpt: "e1",
      contentHtml: "<p>1</p>",
      tags: [],
    });
    const second = await createArticle({
      type: "native",
      title: "Same Title",
      excerpt: "e2",
      contentHtml: "<p>2</p>",
      tags: [],
    });
    expect(second.type).toBe("native");
    if (second.type === "native") expect(second.slug).toBe("same-title-2");
  });

  it("sanitizes script tags out of native article content", async () => {
    const article = await createArticle({
      type: "native",
      title: "XSS Test",
      excerpt: "e",
      contentHtml: '<p>safe</p><script>alert(1)</script>',
      tags: [],
    });
    expect(article.type).toBe("native");
    if (article.type === "native") {
      expect(article.contentHtml).not.toContain("<script>");
      expect(article.contentHtml).toContain("safe");
    }
  });

  it("creates draft articles by default", async () => {
    const article = await createArticle({
      type: "link",
      title: "Link Article",
      excerpt: "e",
      externalUrl: "https://example.com",
      tags: [],
    });
    expect(article.status).toBe("draft");
  });
});

describe("publish/unpublish toggling", () => {
  it("flips status and stamps publishedAt when publishing", async () => {
    const article = await createArticle({
      type: "link",
      title: "Toggle Me",
      excerpt: "e",
      externalUrl: "https://example.com",
      tags: [],
    });
    expect(article.status).toBe("draft");

    const published = await setArticleStatus(article.id, "published");
    expect(published.status).toBe("published");
    expect(published.publishedAt).toBeTruthy();

    const unpublished = await setArticleStatus(article.id, "draft");
    expect(unpublished.status).toBe("draft");
  });
});

describe("updateArticle", () => {
  it("updates fields without clobbering content when contentHtml is omitted", async () => {
    const article = await createArticle({
      type: "native",
      title: "Original",
      excerpt: "e",
      contentHtml: "<p>original body</p>",
      tags: [],
    });

    const updated = await updateArticle(article.id, { title: "Updated title" });
    expect(updated.title).toBe("Updated title");
    if (updated.type === "native") expect(updated.contentHtml).toBe("<p>original body</p>");
  });
});

describe("deleteArticle", () => {
  it("removes the article from admin listings", async () => {
    const article = await createArticle({
      type: "link",
      title: "Delete Me",
      excerpt: "e",
      externalUrl: "https://example.com",
      tags: [],
    });
    await deleteArticle(article.id);
    expect(await getAllArticlesAdmin()).toEqual([]);
  });
});

describe("getPublicNativeArticleBySlug", () => {
  it("returns null for a draft article", async () => {
    const article = await createArticle({
      type: "native",
      title: "Hidden Draft",
      excerpt: "e",
      contentHtml: "<p>x</p>",
      tags: [],
    });
    expect(await getPublicNativeArticleBySlug((article as { slug: string }).slug)).toBeNull();
  });

  it("returns the article once published", async () => {
    const article = await createArticle({
      type: "native",
      title: "Visible",
      excerpt: "e",
      contentHtml: "<p>x</p>",
      tags: [],
      status: "published",
    });
    const found = await getPublicNativeArticleBySlug((article as { slug: string }).slug);
    expect(found?.title).toBe("Visible");
  });
});
