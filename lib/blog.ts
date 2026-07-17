import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Post, PostFrontmatter, PostMeta } from "@/types";

const POSTS_DIR = path.join(process.cwd(), "content/blog");

function estimateReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function parsePostFrontmatter(data: unknown): PostFrontmatter {
  if (typeof data !== "object" || data === null) {
    throw new Error("Invalid post frontmatter: must be an object.");
  }

  const entry = data as Record<string, unknown>;

  if (!isNonEmptyString(entry.title)) {
    throw new Error("Invalid post frontmatter: title is required.");
  }
  if (!isNonEmptyString(entry.date)) {
    throw new Error("Invalid post frontmatter: date is required.");
  }
  if (!isNonEmptyString(entry.excerpt)) {
    throw new Error("Invalid post frontmatter: excerpt is required.");
  }

  const tags = entry.tags === undefined
    ? undefined
    : Array.isArray(entry.tags)
    ? entry.tags.map((tag) => {
        if (!isNonEmptyString(tag)) {
          throw new Error("Invalid post frontmatter: tags must be non-empty strings.");
        }
        return tag.trim();
      })
    : (() => { throw new Error("Invalid post frontmatter: tags must be an array."); })();

  const coverImage = entry.coverImage === undefined
    ? undefined
    : isNonEmptyString(entry.coverImage)
    ? entry.coverImage.trim()
    : (() => { throw new Error("Invalid post frontmatter: coverImage must be a string."); })();

  const published = entry.published === undefined
    ? undefined
    : typeof entry.published === "boolean"
    ? entry.published
    : (() => { throw new Error("Invalid post frontmatter: published must be boolean."); })();

  return {
    title: entry.title.trim(),
    date: entry.date.trim(),
    excerpt: entry.excerpt.trim(),
    tags,
    coverImage,
    published,
  };
}

function readPostFile(slug: string) {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf8");
  return matter(raw);
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getAllPosts(): PostMeta[] {
  return getAllSlugs()
    .flatMap((slug) => {
      const { data, content } = readPostFile(slug);
      let frontmatter: PostFrontmatter;
      try {
        frontmatter = parsePostFrontmatter(data);
      } catch (error) {
        console.warn(`Skipping "${slug}.mdx": ${(error as Error).message}`);
        return [];
      }
      return [
        {
          slug,
          ...frontmatter,
          readingTime: estimateReadingTime(content),
        },
      ];
    })
    .filter((post) => post.published !== false)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const { data, content } = readPostFile(slug);
    const frontmatter = parsePostFrontmatter(data);
    if (frontmatter.published === false) return null;
    return {
      slug,
      ...frontmatter,
      readingTime: estimateReadingTime(content),
      content,
    };
  } catch {
    return null;
  }
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  getAllPosts().forEach((post) => post.tags?.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
}
