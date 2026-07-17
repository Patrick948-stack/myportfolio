import Link from "next/link";
import { verifySession } from "@/lib/session";
import { getAllArticlesAdmin } from "@/lib/articles";
import { getSiteContent } from "@/lib/site-content";
import { deleteArticleAction, setArticleStatusAction } from "@/app/admin/actions";
import WritingSectionForm from "@/components/admin/WritingSectionForm";

export default async function AdminDashboardPage() {
  await verifySession();
  const [articles, writingContent] = await Promise.all([
    getAllArticlesAdmin(),
    getSiteContent("writing"),
  ]);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Personal Writing</h1>
        <Link
          href="/admin/writing/new"
          className="rounded-lg bg-[#ff004f] px-4 py-2 text-sm font-medium text-white"
        >
          New article
        </Link>
      </div>

      <WritingSectionForm content={writingContent} />

      {articles.length === 0 ? (
        <p className="text-[#666]">No articles yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {articles.map((article) => (
            <div
              key={article.id}
              className="flex items-center justify-between rounded-lg border border-white/10 bg-[#141414] px-5 py-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                      article.status === "published"
                        ? "bg-[#ff004f]/10 text-[#ff004f]"
                        : "bg-white/10 text-[#ababab]"
                    }`}
                  >
                    {article.status}
                  </span>
                  <span className="text-[10px] uppercase text-[#666]">{article.type}</span>
                </div>
                <p className="mt-1 font-medium text-white">{article.title}</p>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Link href={`/admin/writing/${article.id}/edit`} className="text-[#ababab] hover:text-white">
                  Edit
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await setArticleStatusAction(
                      article.id,
                      article.status === "published" ? "draft" : "published"
                    );
                  }}
                >
                  <button type="submit" className="text-[#ababab] hover:text-white">
                    {article.status === "published" ? "Unpublish" : "Publish"}
                  </button>
                </form>
                <form
                  action={async () => {
                    "use server";
                    await deleteArticleAction(article.id);
                  }}
                >
                  <button type="submit" className="text-[#ababab] hover:text-[#ff004f]">
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
