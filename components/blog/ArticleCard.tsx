import Link from "next/link";
import { FaArrowRight, FaArrowUpRightFromSquare } from "react-icons/fa6";
import type { WritingItem } from "@/types";
import TiltCard from "@/components/TiltCard";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function estimateReadingTime(html: string): string {
  const words = html
    .replace(/<[^>]*>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export default function ArticleCard({ item }: { item: WritingItem }) {
  if (item.source === "legacy") {
    const post = item.post;
    return (
      <Link href={`/blog/${post.slug}`} data-cursor="view" className="block h-full">
        <CardShell
          tags={post.tags}
          title={post.title}
          excerpt={post.excerpt}
          coverImage={post.coverImage}
        >
          <span>{formatDate(post.date)}</span>
          <span className="flex items-center gap-1 text-[#ff004f]">
            {post.readingTime} <FaArrowRight className="text-[10px]" />
          </span>
        </CardShell>
      </Link>
    );
  }

  const article = item.article;
  const date = formatDate(article.publishedAt ?? article.createdAt);

  if (article.type === "link") {
    return (
      <a
        href={article.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="link"
        className="block h-full"
      >
        <CardShell
          tags={article.tags}
          title={article.title}
          excerpt={article.excerpt}
          coverImage={article.coverImage}
        >
          <span>{date}</span>
          <span className="flex items-center gap-1 text-[#ff004f]">
            Read on site <FaArrowUpRightFromSquare className="text-[10px]" />
          </span>
        </CardShell>
      </a>
    );
  }

  return (
    <Link href={`/blog/${article.slug}`} data-cursor="view" className="block h-full">
      <CardShell
        tags={article.tags}
        title={article.title}
        excerpt={article.excerpt}
        coverImage={article.coverImage}
      >
        <span>{date}</span>
        <span className="flex items-center gap-1 text-[#ff004f]">
          {estimateReadingTime(article.contentHtml)} <FaArrowRight className="text-[10px]" />
        </span>
      </CardShell>
    </Link>
  );
}

function CardShell({
  tags,
  title,
  excerpt,
  coverImage,
  children,
}: {
  tags?: string[];
  title: string;
  excerpt: string;
  coverImage?: string;
  children: React.ReactNode;
}) {
  return (
    <TiltCard
      maxTilt={6}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-[#141414] transition-colors duration-300 hover:border-[#ff004f]/50"
    >
      {coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={coverImage} alt="" className="h-40 w-full object-cover" />
      )}
      <div className="flex flex-1 flex-col p-8">
        {tags && tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#ff004f]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#ff004f]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <h3 className="mb-3 text-xl font-semibold leading-snug text-white">{title}</h3>
        <p className="mb-6 flex-1 text-sm leading-relaxed text-[#ababab]">{excerpt}</p>
        <div className="flex items-center justify-between text-xs text-[#666] group-hover:gap-2">
          {children}
        </div>
      </div>
    </TiltCard>
  );
}
