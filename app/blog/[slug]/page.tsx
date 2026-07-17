import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { getAllSlugs, getPostBySlug } from "@/lib/blog";
import { getPublicNativeArticleBySlug } from "@/lib/articles";
import { mdxComponents } from "@/components/blog/MDXComponents";
import ShareButtons from "@/components/blog/ShareButtons";
import Reveal from "@/components/Reveal";

const SITE_URL = "https://patrickmulikuza.com";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

async function loadPost(slug: string) {
  const legacy = getPostBySlug(slug);
  if (legacy) {
    return {
      title: legacy.title,
      excerpt: legacy.excerpt,
      tags: legacy.tags,
      date: legacy.date,
      readingTime: legacy.readingTime,
      body: { type: "mdx" as const, content: legacy.content },
    };
  }

  const article = await getPublicNativeArticleBySlug(slug);
  if (!article) return null;

  const words = article.contentHtml.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return {
    title: article.title,
    excerpt: article.excerpt,
    tags: article.tags,
    date: article.publishedAt ?? article.createdAt,
    readingTime: `${Math.max(1, Math.round(words / 200))} min read`,
    body: { type: "html" as const, content: article.contentHtml },
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await loadPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Patrick Mulikuza`,
    description: post.excerpt,
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await loadPost(slug);
  if (!post) notFound();

  const url = `${SITE_URL}/blog/${slug}`;

  return (
    <main className="min-h-screen bg-[#0a0b0d] text-white">
      <article className="px-[10%] pt-40 pb-24">
        <Reveal className="mx-auto max-w-3xl">
          {post.tags && post.tags.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[#ff004f]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#ff004f]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            {post.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-8 text-sm text-[#666]">
            <span>
              {formatDate(post.date)} · {post.readingTime}
            </span>
            <ShareButtons title={post.title} url={url} />
          </div>

          <div className="mt-10">
            {post.body.type === "mdx" ? (
              <MDXRemote
                source={post.body.content}
                components={mdxComponents}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [rehypeSlug, rehypeHighlight],
                  },
                }}
              />
            ) : (
              <div
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: post.body.content }}
              />
            )}
          </div>
        </Reveal>
      </article>
    </main>
  );
}
