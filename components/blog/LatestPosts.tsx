import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import { getPublicArticles } from "@/lib/articles";
import { getSiteContent } from "@/lib/site-content";
import Reveal from "@/components/Reveal";
import ArticleCard from "@/components/blog/ArticleCard";

export default async function LatestPosts() {
  const [allItems, content] = await Promise.all([
    getPublicArticles(),
    getSiteContent("writing"),
  ]);
  const items = allItems.slice(0, 3);
  if (items.length === 0) return null;

  return (
    <section id="writing" className="px-[10%] py-20">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="text-5xl font-semibold text-white sm:text-6xl">
              {content.title}
            </h2>
            {content.subtitle && (
              <p className="mt-3 max-w-xl text-[#ababab]">{content.subtitle}</p>
            )}
          </div>
          <Link
            href="/blog"
            data-cursor="link"
            className="flex items-center gap-2 text-sm font-medium text-[#ff004f] transition-all duration-200 hover:gap-3"
          >
            View all posts <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </Reveal>
      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => {
          const key = item.source === "legacy" ? item.post.slug : item.article.id;
          return (
            <Reveal key={key} delay={(i % 3) * 0.08}>
              <ArticleCard item={item} />
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
