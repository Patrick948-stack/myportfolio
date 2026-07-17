import "server-only";
import sanitizeHtml from "sanitize-html";
import { query } from "@/lib/db";
import { verifySession } from "@/lib/session";
import { getAllPosts } from "@/lib/blog";
import type { Article, ArticleInput, ArticleStatus, NativeArticle, WritingItem } from "@/types";

interface ArticleRow {
  id: string;
  type: "native" | "link";
  title: string;
  slug: string | null;
  excerpt: string;
  content_html: string | null;
  cover_image: string | null;
  external_url: string | null;
  tags: string[];
  status: ArticleStatus;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "u", "s"]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    img: ["src", "alt", "width", "height"],
    span: ["style"],
    "*": ["style"],
  },
  allowedStyles: {
    "*": {
      "font-family": [/.*/],
    },
  },
};

function mapRow(row: ArticleRow): Article {
  const base = {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt,
    coverImage: row.cover_image ?? undefined,
    tags: row.tags ?? [],
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    publishedAt: row.published_at ?? undefined,
  };

  if (row.type === "native") {
    return {
      ...base,
      type: "native",
      slug: row.slug ?? "",
      contentHtml: row.content_html ?? "",
    };
  }

  return {
    ...base,
    type: "link",
    externalUrl: row.external_url ?? "",
  };
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function uniqueSlug(title: string, excludeId?: string): Promise<string> {
  const base = slugify(title) || "article";
  const existing = await query<{ slug: string }>(
    `select slug from articles where slug like $1 || '%' and ($2::uuid is null or id <> $2)`,
    [base, excludeId ?? null]
  );
  const taken = new Set(existing.map((r) => r.slug));
  if (!taken.has(base)) return base;
  let suffix = 2;
  while (taken.has(`${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
}

// --- Public (reader) access — published content only ---

export async function getPublicArticles(): Promise<WritingItem[]> {
  const [legacyPosts, rows] = await Promise.all([
    Promise.resolve(getAllPosts()),
    query<ArticleRow>(
      `select * from articles where status = 'published' order by coalesce(published_at, created_at) desc`
    ),
  ]);

  const dbItems: WritingItem[] = rows.map((row) => ({ source: "db", article: mapRow(row) }));
  const legacyItems: WritingItem[] = legacyPosts.map((post) => ({ source: "legacy", post }));

  return [...dbItems, ...legacyItems].sort((a, b) => {
    const dateA = a.source === "db" ? a.article.publishedAt ?? a.article.createdAt : a.post.date;
    const dateB = b.source === "db" ? b.article.publishedAt ?? b.article.createdAt : b.post.date;
    return dateA < dateB ? 1 : -1;
  });
}

export async function getPublicNativeArticleBySlug(slug: string): Promise<NativeArticle | null> {
  const rows = await query<ArticleRow>(
    `select * from articles where slug = $1 and type = 'native' and status = 'published' limit 1`,
    [slug]
  );
  return rows[0] ? (mapRow(rows[0]) as NativeArticle) : null;
}

// --- Admin access — requires a verified session on every call ---

export async function getAllArticlesAdmin(): Promise<Article[]> {
  await verifySession();
  const rows = await query<ArticleRow>(`select * from articles order by updated_at desc`);
  return rows.map(mapRow);
}

export async function getArticleByIdAdmin(id: string): Promise<Article | null> {
  await verifySession();
  const rows = await query<ArticleRow>(`select * from articles where id = $1 limit 1`, [id]);
  return rows[0] ? mapRow(rows[0]) : null;
}

export async function createArticle(input: ArticleInput): Promise<Article> {
  await verifySession();

  const status = input.status ?? "draft";
  const publishedAt = status === "published" ? new Date().toISOString() : null;

  if (input.type === "native") {
    const slug = await uniqueSlug(input.title);
    const contentHtml = sanitizeHtml(input.contentHtml, SANITIZE_OPTIONS);
    const rows = await query<ArticleRow>(
      `insert into articles (type, title, slug, excerpt, content_html, cover_image, tags, status, published_at)
       values ('native', $1, $2, $3, $4, $5, $6, $7, $8)
       returning *`,
      [input.title, slug, input.excerpt, contentHtml, input.coverImage ?? null, input.tags, status, publishedAt]
    );
    return mapRow(rows[0]);
  }

  const rows = await query<ArticleRow>(
    `insert into articles (type, title, excerpt, cover_image, external_url, tags, status, published_at)
     values ('link', $1, $2, $3, $4, $5, $6, $7)
     returning *`,
    [input.title, input.excerpt, input.coverImage ?? null, input.externalUrl, input.tags, status, publishedAt]
  );
  return mapRow(rows[0]);
}

export async function updateArticle(
  id: string,
  input: Partial<ArticleInput>
): Promise<Article> {
  await verifySession();

  const existing = await getArticleByIdAdmin(id);
  if (!existing) {
    throw new Error(`Article ${id} not found.`);
  }

  const title = input.title ?? existing.title;
  const excerpt = input.excerpt ?? existing.excerpt;
  const coverImage = "coverImage" in input ? input.coverImage ?? null : existing.coverImage ?? null;
  const tags = input.tags ?? existing.tags;

  let contentHtml = existing.type === "native" ? existing.contentHtml : null;
  if (existing.type === "native" && "contentHtml" in input && input.contentHtml !== undefined) {
    contentHtml = sanitizeHtml(input.contentHtml, SANITIZE_OPTIONS);
  }

  const externalUrl =
    existing.type === "link"
      ? "externalUrl" in input && input.externalUrl !== undefined
        ? input.externalUrl
        : existing.externalUrl
      : null;

  const slug =
    existing.type === "native" && input.title && input.title !== existing.title
      ? await uniqueSlug(input.title, id)
      : existing.type === "native"
      ? existing.slug
      : null;

  const rows = await query<ArticleRow>(
    `update articles
     set title = $2, excerpt = $3, cover_image = $4, tags = $5,
         content_html = coalesce($6, content_html),
         external_url = $7, slug = coalesce($8, slug), updated_at = now()
     where id = $1
     returning *`,
    [id, title, excerpt, coverImage, tags, contentHtml, externalUrl, slug]
  );
  return mapRow(rows[0]);
}

export async function setArticleStatus(id: string, status: ArticleStatus): Promise<Article> {
  await verifySession();

  const rows = await query<ArticleRow>(
    `update articles
     set status = $2,
         published_at = case when $2 = 'published' then now() else published_at end,
         updated_at = now()
     where id = $1
     returning *`,
    [id, status]
  );
  if (!rows[0]) {
    throw new Error(`Article ${id} not found.`);
  }
  return mapRow(rows[0]);
}

export async function deleteArticle(id: string): Promise<void> {
  await verifySession();
  await query(`delete from articles where id = $1`, [id]);
}
