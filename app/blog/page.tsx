import type { Metadata } from "next";
import { getPublicArticles } from "@/lib/articles";
import { getSiteContent } from "@/lib/site-content";
import Reveal from "@/components/Reveal";
import ArticleCard from "@/components/blog/ArticleCard";

export const metadata: Metadata = {
  title: "Writing — Patrick Mulikuza",
  description:
    "Notes on physics, data visualization, and the AI systems I'm building.",
};

// Queries the live articles DB — can't be statically prerendered at build
// time (no DATABASE_URL available then).
export const dynamic = "force-dynamic";

export default async function BlogIndexPage() {
  const [items, content] = await Promise.all([
    getPublicArticles(),
    getSiteContent("writing"),
  ]);

  return (
    <main className="min-h-screen bg-[#0a0b0d] text-white">
      <section className="px-[10%] pt-40 pb-24">
        <Reveal>
          <h1 className="text-5xl font-semibold sm:text-6xl">{content.title}</h1>
          {content.subtitle && (
            <p className="mt-4 max-w-2xl text-lg text-[#ababab]">{content.subtitle}</p>
          )}
        </Reveal>

        {items.length === 0 ? (
          <p className="mt-16 text-[#666]">
            No posts published yet — check back soon.
          </p>
        ) : (
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => {
              const key = item.source === "legacy" ? item.post.slug : item.article.id;
              return (
                <Reveal key={key} delay={(i % 3) * 0.08}>
                  <ArticleCard item={item} />
                </Reveal>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
